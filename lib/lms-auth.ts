import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getAppEnv } from "@/lib/env";

export type LmsSessionRole = "student" | "admin" | "company_admin";

export type LmsSession = {
  userId: string;
  role: LmsSessionRole;
  name: string;
  email: string;
  companyId?: string;
};

type TokenPayload = LmsSession & {
  iat?: number;
  exp?: number;
};

export const lmsAuthCookieName = "limco_lms_auth";

function getJwtSecret() {
  return new TextEncoder().encode(getAppEnv().jwtSecret);
}

export async function createAuthToken(session: LmsSession) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  const result = await jwtVerify(token, getJwtSecret());
  return result.payload as TokenPayload;
}

export async function setAuthCookie(session: LmsSession) {
  const token = await createAuthToken(session);
  const cookieStore = await cookies();
  const isProduction = getAppEnv().nodeEnv === "production";

  cookieStore.set(lmsAuthCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(lmsAuthCookieName);
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(lmsAuthCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAuthToken(token);
    return {
      userId: payload.userId,
      role: payload.role,
      name: payload.name,
      email: payload.email,
      companyId: payload.companyId,
    } satisfies LmsSession;
  } catch {
    return null;
  }
}
