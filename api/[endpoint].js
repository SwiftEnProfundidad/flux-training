import { resolveVercelEndpointHandler } from "../apps/backend/dist/vercel-endpoint-handler.js";

function normalizeEndpoint(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return "";
}

function ensureHeaderAccessor(request) {
  if (typeof request.header === "function") return request;
  return {
    ...request,
    header(name) {
      return request.headers?.[name.toLowerCase()];
    }
  };
}

export default async function handler(request, response) {
  const endpoint = normalizeEndpoint(request.query?.endpoint);
  const routeHandler = resolveVercelEndpointHandler(endpoint);

  if (routeHandler === null) {
    response.status(404).json({ error: "unknown_api_endpoint", endpoint });
    return;
  }

  await routeHandler(ensureHeaderAccessor(request), response);
}
