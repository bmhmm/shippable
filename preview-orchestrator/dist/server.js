"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dockerode_1 = __importDefault(require("dockerode"));
const app = (0, express_1.default)();
const docker = new dockerode_1.default();
app.use(express_1.default.json({ limit: "1mb" }));
const PORT = Number(process.env.PORT || 4000);
const PREVIEW_IMAGE = process.env.PREVIEW_IMAGE || "shippable-preview-test";
const containers = new Map();
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "preview-orchestrator" });
});
// Temporary connectivity test only.
// This launches the fixed test image, not generated project code.
app.post("/preview-test", async (_req, res) => {
    let container;
    try {
        container = await docker.createContainer({
            Image: PREVIEW_IMAGE,
            Cmd: ["npm", "run", "start"],
            ExposedPorts: { "3000/tcp": {} },
            HostConfig: {
                AutoRemove: true,
                PortBindings: {
                    //   "3000/tcp": [{ HostPort: "0" }]
                    "3000/tcp": [{ HostIp: "127.0.0.1", HostPort: "" }]
                },
                Memory: 512 * 1024 * 1024,
                NanoCpus: 1_000_000_000,
                PidsLimit: 100,
                NetworkMode: "bridge",
                CapDrop: ["ALL"],
                SecurityOpt: ["no-new-privileges:true"],
                ReadonlyRootfs: true,
                Tmpfs: { "/tmp": "rw,noexec,nosuid,size=64m" }
            }
        });
        await container.start();
        const info = await container.inspect();
        // const port = info.NetworkSettings.Ports["3000/tcp"]?.[0]?.HostPort;
        const port = info.NetworkSettings.Ports?.["3000/tcp"]?.[0]?.HostPort ??
            info.HostConfig.PortBindings?.["3000/tcp"]?.[0]?.HostPort;
        if (!port) {
            throw new Error("Docker did not assign a preview port.");
        }
        containers.set(container.id, container);
        res.status(201).json({
            status: "started",
            containerId: container.id,
            port,
            note: "Fixed test application only; generated files are not running."
        });
    }
    catch (error) {
        if (container) {
            try {
                await container.remove({ force: true });
            }
            catch {
                // Container may not have been created or may already be removed.
            }
        }
        res.status(500).json({
            error: error instanceof Error ? error.message : "Preview test failed."
        });
    }
});
app.delete("/preview-test/:id", async (req, res) => {
    const container = containers.get(req.params.id);
    if (!container) {
        return res.status(404).json({ error: "Container not found." });
    }
    try {
        await container.remove({ force: true });
        containers.delete(req.params.id);
        return res.json({ status: "removed" });
    }
    catch (error) {
        return res.status(500).json({
            error: error instanceof Error ? error.message : "Cleanup failed."
        });
    }
});
app.listen(PORT, "127.0.0.1", () => {
    console.log(`Preview orchestrator listening on http://127.0.0.1:${PORT}`);
});
