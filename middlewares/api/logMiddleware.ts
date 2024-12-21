/* eslint-disable @typescript-eslint/no-explicit-any */
export function logMiddleware(req: Request): any {
  return { response: req.method + " " + req.url };
}
