import { NextApiRequest } from "next";

export interface Request extends NextApiRequest {
  files?: {
    image: { path: string; originalFilename: string; size: number }[];
    video: { path: string; originalFilename: string; size: number }[];
  };
}
