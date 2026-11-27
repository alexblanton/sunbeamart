// Verifies the Cloudflare Access token that Access adds to every request it lets through
// (the Cf-Access-Jwt-Assertion header). Checking it here means /admin stays locked even if a
// request reaches the Worker some other way, such as a preview URL that Access doesn't cover.
// Uses WebCrypto only, so it runs the same in Workers and in Node.

type Jwk = JsonWebKey & { kid?: string };
type Claims = { aud?: string | string[]; iss?: string; exp?: number; nbf?: number; email?: string };

const certCache = new Map<string, { at: number; keys: Jwk[] }>();
const CERT_TTL_MS = 60 * 60 * 1000;

function b64urlToBytes(s: string): Uint8Array<ArrayBuffer> {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const decodeJson = <T>(part: string): T => JSON.parse(new TextDecoder().decode(b64urlToBytes(part))) as T;

export function teamOrigin(teamDomain: string) {
  const host = teamDomain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return `https://${host.includes(".") ? host : `${host}.cloudflareaccess.com`}`;
}

async function getKeys(origin: string, fetchImpl: typeof fetch, force = false): Promise<Jwk[]> {
  const hit = certCache.get(origin);
  if (!force && hit && Date.now() - hit.at < CERT_TTL_MS) return hit.keys;
  const res = await fetchImpl(`${origin}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error(`Access certs request failed: ${res.status}`);
  const keys = ((await res.json()) as { keys?: Jwk[] }).keys ?? [];
  certCache.set(origin, { at: Date.now(), keys });
  return keys;
}

/**
 * Returns the signed-in email if `token` is a valid Access token for this team and application,
 * otherwise null. Never throws.
 */
export async function verifyAccessJwt(
  token: string | null | undefined,
  opts: { teamDomain: string; aud: string; now?: number; fetchImpl?: typeof fetch },
): Promise<string | null> {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const header = decodeJson<{ alg?: string; kid?: string }>(parts[0]);
    if (header.alg !== "RS256") return null;
    const claims = decodeJson<Claims>(parts[1]);

    const origin = teamOrigin(opts.teamDomain);
    const fetchImpl = opts.fetchImpl ?? fetch;
    let keys = await getKeys(origin, fetchImpl);
    let jwk = keys.find((k) => k.kid === header.kid);
    if (!jwk) {
      // Access rotates its signing keys; refetch once before giving up.
      keys = await getKeys(origin, fetchImpl, true);
      jwk = keys.find((k) => k.kid === header.kid);
    }
    if (!jwk) return null;

    const key = await crypto.subtle.importKey("jwk", { kty: jwk.kty, n: jwk.n, e: jwk.e }, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlToBytes(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
    if (!ok) return null;

    const now = Math.floor((opts.now ?? Date.now()) / 1000);
    const skew = 60;
    if (typeof claims.exp !== "number" || claims.exp + skew < now) return null;
    if (typeof claims.nbf === "number" && claims.nbf - skew > now) return null;
    if (claims.iss !== origin) return null;
    const auds = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!auds.includes(opts.aud)) return null;
    return typeof claims.email === "string" && claims.email ? claims.email : null;
  } catch {
    return null;
  }
}
