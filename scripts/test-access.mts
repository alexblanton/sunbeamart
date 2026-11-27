import { verifyAccessJwt } from "../src/lib/access.ts";
const { publicKey, privateKey } = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1,0,1]), hash: "SHA-256" }, true, ["sign","verify"]);
const other = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1,0,1]), hash: "SHA-256" }, true, ["sign","verify"]);
const jwk = { ...(await crypto.subtle.exportKey("jwk", publicKey)), kid: "k1" };
let certFetches = 0;
const fetchImpl = (async (url: string) => { certFetches++; if (!String(url).endsWith("https://sunbeam.cloudflareaccess.com/cdn-cgi/access/certs")) throw new Error("bad url " + url); return new Response(JSON.stringify({ keys: [jwk] })); }) as any;
const b64u = (b: Uint8Array) => Buffer.from(b).toString("base64url");
async function mint(claims: any, key = privateKey, header: any = { alg: "RS256", kid: "k1" }) {
  const h = b64u(new TextEncoder().encode(JSON.stringify(header))), p = b64u(new TextEncoder().encode(JSON.stringify(claims)));
  const sig = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${h}.${p}`)));
  return `${h}.${p}.${b64u(sig)}`;
}
const now = Math.floor(Date.now()/1000);
const good = { aud: ["AUD123"], iss: "https://sunbeam.cloudflareaccess.com", exp: now + 3600, iat: now, email: "owner@example.com" };
const opts = { teamDomain: "sunbeam", aud: "AUD123", fetchImpl };
const cases: [string, Promise<string|null>, string|null][] = [
  ["valid token", verifyAccessJwt(await mint(good), opts), "owner@example.com"],
  ["valid, full team domain form", verifyAccessJwt(await mint(good), { ...opts, teamDomain: "https://sunbeam.cloudflareaccess.com/" }), "owner@example.com"],
  ["missing token", verifyAccessJwt(null, opts), null],
  ["garbage", verifyAccessJwt("abc.def", opts), null],
  ["wrong audience", verifyAccessJwt(await mint({ ...good, aud: ["OTHER"] }), opts), null],
  ["wrong issuer", verifyAccessJwt(await mint({ ...good, iss: "https://evil.cloudflareaccess.com" }), opts), null],
  ["expired", verifyAccessJwt(await mint({ ...good, exp: now - 600 }), opts), null],
  ["not yet valid", verifyAccessJwt(await mint({ ...good, nbf: now + 600 }), opts), null],
  ["signed by another key", verifyAccessJwt(await mint(good, other.privateKey), opts), null],
  ["unknown kid", verifyAccessJwt(await mint(good, privateKey, { alg: "RS256", kid: "nope" }), opts), null],
  ["alg none", verifyAccessJwt(await mint(good, privateKey, { alg: "none", kid: "k1" }), opts), null],
];
let fail = 0;
for (const [name, p, want] of cases) { const got = await p; const ok = got === want; if (!ok) fail++; console.log(`${ok ? "PASS" : "FAIL"} ${name} -> ${got}`); }
const t = await mint(good); const parts = t.split("."); const tampered = `${parts[0]}.${Buffer.from(JSON.stringify({ ...good, email: "attacker@example.com" })).toString("base64url")}.${parts[2]}`;
const g = await verifyAccessJwt(tampered, opts); console.log(`${g === null ? "PASS" : "FAIL"} tampered payload -> ${g}`); if (g !== null) fail++;
console.log("cert fetches:", certFetches); process.exit(fail ? 1 : 0);
