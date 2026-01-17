import { headers } from "next/headers";

export async function getBaseUrl() {
  const h = await headers();

  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");

  return `${proto}://${host}`;
}
