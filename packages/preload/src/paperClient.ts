import { createClient, type NormalizeOAS } from "fets";
import openAPIDoc from "./openapi";

export const paperClient = createClient<NormalizeOAS<typeof openAPIDoc>>({
  endpoint: openAPIDoc.servers[0].url,
});
