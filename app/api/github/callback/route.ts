import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { encryptToken } from "@/lib/github/crypto";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const fail = (message: string, status = 400) => {
    const response = NextResponse.json(
      { error: message },
      { status }
    );

    response.cookies.delete("github_oauth_state");
    return response;
  };

  if (!user) {
    return fail("Please sign in to Shippable again.", 401);
  }

  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const returnedState = params.get("state");
  const expectedState =
    request.cookies.get("github_oauth_state")?.value;

  if (params.has("error")) {
    return fail("GitHub authorization was cancelled or denied.");
  }

  if (
    !code ||
    !returnedState ||
    !expectedState ||
    returnedState !== expectedState
  ) {
    return fail("GitHub authorization could not be verified.");
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return fail("GitHub OAuth configuration is missing.", 500);
  }

  try {
    const redirectUri = new URL(
      "/api/github/callback",
      request.url
    ).toString();

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
        cache: "no-store",
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return fail("GitHub token exchange failed.");
    }

    const githubResponse = await fetch(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      }
    );

    if (!githubResponse.ok) {
      return fail("Could not verify your GitHub account.");
    }

    const githubUser = await githubResponse.json();

    if (
      typeof githubUser.login !== "string" ||
      typeof tokenData.access_token !== "string"
    ) {
      return fail("GitHub returned an invalid response.");
    }

    const expiresAt =
      typeof tokenData.expires_in === "number"
        ? new Date(
            Date.now() + tokenData.expires_in * 1000
          ).toISOString()
        : null;

    const admin = createAdminClient();

    const { error } = await admin
      .from("github_connections")
      .upsert(
        {
          user_id: user.id,
          github_username: githubUser.login,
          access_token: encryptToken(tokenData.access_token),
          refresh_token:
            typeof tokenData.refresh_token === "string"
              ? encryptToken(tokenData.refresh_token)
              : null,
          token_expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("GitHub connection storage failed.");
      return fail("Could not save the GitHub connection.", 500);
    }

    const response = NextResponse.json({
      message: "GitHub connected successfully.",
      githubUsername: githubUser.login,
    });

    response.cookies.delete("github_oauth_state");
    return response;
  } catch {
    return fail("Could not complete GitHub authorization.", 502);
  }
}