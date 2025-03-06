import { decrypt } from "./lib/actions/session";
import { cookies } from "next/headers";
import { routeAccessMap } from "./lib/settings";
import { NextRequest, NextResponse } from "next/server";

function createRouteMatcher(pattern: string) {
  const regex = new RegExp(`^${pattern}`);
  return (req: NextRequest) => regex.test(req.nextUrl.pathname);
}

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher(route),
  allowedRoles: routeAccessMap[route],
}));

export async function middleware(request: NextRequest) {
  const cookie = cookies().get("session");
  if (!cookie) {
    return NextResponse.next();
  }
  const session = await decrypt(cookie.value);

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const role = session.role as string;

  const pageRole =
    {
      ADMIN: "admin",
      TEACHER: "teacher",
      STUDENT: "student",
      PARENT: "parent",
    }[role] || "parent";

  // Redirect to role-specific page if on homepage
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/${pageRole}`, request.url));
  }

  // Check route access permissions
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(request) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL(`/${pageRole}`, request.url));
    }
  }
}

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:css|js|png|jpg|jpeg|webp|gif|svg|ico|woff2?|ttf|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
