export function logMiddleware(req: Request): any {
  return { response: req.method + " " + req.url };
}
