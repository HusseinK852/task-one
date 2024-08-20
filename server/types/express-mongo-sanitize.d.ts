declare module "express-mongo-sanitize" {
  import { RequestHandler } from "express";
  const sanitize: () => RequestHandler;
  export default sanitize;
}
