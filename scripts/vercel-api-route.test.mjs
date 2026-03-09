import test from "node:test";
import assert from "node:assert/strict";

const handlerModule = await import(new URL("../api/[endpoint].js", import.meta.url));
const handler = handlerModule.default;

test("vercel api route returns health payload", async () => {
  const req = { query: { endpoint: "health" }, headers: {} };
  let statusCode = 200;
  let payload;
  const res = {
    status(code) {
      statusCode = code;
      return { json(body) { payload = body; } };
    },
    json(body) { payload = body; },
    setHeader() {}
  };

  await handler(req, res);

  assert.equal(statusCode, 200);
  assert.deepEqual(payload, { status: "ok" });
});

test("vercel api route returns 404 for unknown endpoint", async () => {
  const req = { query: { endpoint: "missing" }, headers: {} };
  let statusCode = 200;
  let payload;
  const res = {
    status(code) {
      statusCode = code;
      return { json(body) { payload = body; } };
    },
    json(body) { payload = body; },
    setHeader() {}
  };

  await handler(req, res);

  assert.equal(statusCode, 404);
  assert.deepEqual(payload, { error: "unknown_api_endpoint", endpoint: "missing" });
});
