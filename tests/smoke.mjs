import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const edge = readFileSync(new URL("../supabase/functions/phaseone-agent-v1/index.ts", import.meta.url), "utf8");

new vm.Script(app, { filename: "app.js" });
assert.match(html, /Version 1\.0\.0/);
assert.match(html, /@supabase\/supabase-js@2/);
assert.match(html, /app\.js\?v=1\.0\.0/);
assert.match(html, /styles\.css\?v=1\.0\.0/);
assert.match(app, /phaseone-agent-v1/);
assert.match(edge, /\/ai\/run\/\$\{model\}/, "Cloudflare model route must keep path separators");
assert.doesNotMatch(edge, /encodeURIComponent\(model\)/, "Cloudflare model path must not encode its slashes");
assert.match(edge, /adam_kraus@icloud\.com/);
assert.match(edge, /Anmeldung erforderlich/);
assert.match(edge, /identityResponse/);
assert.match(app, /phaseone_memories/);
assert.match(app, /phaseone_tasks/);
assert.match(app, /phaseone_messages/);
assert.match(app, /adam_kraus@icloud\.com/);
assert.match(app, /signInWithPassword/);
assert.match(app, /auth\.signOut/);
assert.doesNotMatch(app, /localStorage/);
assert.doesNotMatch(app, /signUp\s*\(/);
assert.doesNotMatch(app, /service_role|SUPABASE_SERVICE_ROLE_KEY/i);
assert.match(css, /\.hidden\s*\{\s*display:none!important\s*\}/);

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, "HTML enthält doppelte IDs");
const refs = [...app.matchAll(/\$\(["']([^"']+)["']\)/g)].map((m) => m[1]);
const missing = [...new Set(refs.filter((id) => !ids.includes(id)))];
assert.deepEqual(missing, [], "app.js referenziert IDs, die in index.html fehlen");

console.log("PHASEONE[human] v1.0.0 smoke tests passed.");
console.log(`JS syntax valid; ${ids.length} unique DOM IDs; ${refs.length} ID references checked; Supabase backend and login guards present.`);
