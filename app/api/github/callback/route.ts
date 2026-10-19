import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  const code = request.nextUrl.searchParams.get("code");
  const returnedState = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get("github_oauth_state")?.value;

  const fail = (message: string, status = 400) => {
    const response = NextResponse.json({ error: message }, { status });
    response.cookies.delete("github_oauth_state");
    return response;
  };

  if (!clientId || !clientSecret) {
    return fail("GitHub OAuth environment variables are missing.", 500);
  }

  if (
    !code ||
    !returnedState ||
    !expectedState ||
    returnedState !== expectedState
  ) {
    return fail("GitHub authorization could not be verified.");
  }

  if (request.nextUrl.searchParams.has("error")) {
    return fail("GitHub authorization was cancelled or denied.");
  }

  const redirectUri = new URL(
    "/api/github/callback",
    request.url
  ).toString();

  try {
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

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    });

    if (!userResponse.ok) {
      return fail("Could not verify your GitHub account.");
    }

    const githubUser = await userResponse.json();

    // Temporary verification only: token storage comes next.
    const response = NextResponse.json({
      message:
        "GitHub authorization verified. The token has not been saved yet.",
      githubUsername: githubUser.login,
    });

    response.cookies.delete("github_oauth_state");
    return response;
  } catch {
    return fail("Could not complete GitHub authorization.", 502);
  }
}