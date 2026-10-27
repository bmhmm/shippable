
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shippable Preview",
  description: "Next.js preview runtime",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
  