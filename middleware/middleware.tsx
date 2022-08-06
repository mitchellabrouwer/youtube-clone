import multiparty from "multiparty";
import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { Request } from "../types/general";

const middleware = nextConnect();

middleware.use(async (req: Request, res: NextApiResponse, next) => {
  const form = new multiparty.Form();
  await form.parse(req, (error, fields, files) => {
    req.body = fields;
    req.files = files;
    next();
  });
});

export default middleware;
