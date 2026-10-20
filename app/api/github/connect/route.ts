import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {


 const referer = request.headers.get("referer");
let returnTo = "/dashboard";

if (referer) {
  try {
    const refererUrl = new URL(referer);

    if (refererUrl.origin === new URL(request.url).origin) {
      returnTo = refererUrl.pathname + refererUrl.search;
    }
  } catch {
    // Keep the dashboard fallback.
  }
}


  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "GitHub Client ID is not configured." },
      { status: 500 }
    );
  }

  const supabase = await createClient();
const { data: { user }, error } = await supabase.auth.getUser();

if (error || !user) {
  return NextResponse.json(
    { error: "Please sign in to Shippable first." },
    { status: 401 }
  );
}

  const state = crypto.randomUUID();
  const redirectUri = new URL(
    "/api/github/callback",
    request.url
  ).toString();

  // const params = new URLSearchParams({
  //   client_id: clientId,
  //   redirect_uri: redirectUri,
  //   state,
  // });
  const params = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  state,
  scope: "repo read:user user:email",
});

  const response = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params}`
  );

  response.cookies.set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/github",
    maxAge: 600,
  });
  response.cookies.set("github_return_to", returnTo, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/github",
  maxAge: 600,
});

  return response;
}