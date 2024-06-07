import { NextRequest, NextResponse } from "next/server";
import { array } from "zod";
import { isValidPassword } from "./utils/isValidPassword";

export async function middleware(req: NextRequest) {
  if ((await isAuthenticate(req)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": "Basic",
      },
    });
  }
}

async function isAuthenticate(req: NextRequest) {
  const authHeader =
    (await req.headers.get("Authorization")) ||
    req.headers.get("authorization");
  if (authHeader == null) return false;

  const [username, password] = await Buffer.from(
    authHeader.split(" ")[1],
    "base64"
  )
    .toString()
    .split(":");

  console.log(username, password);

  return (
    username === process.env.ADMIN_USERNAME && (await isValidPassword(password))
  );
}

export const config = {
  matcher: "/admin/:path*",
};
