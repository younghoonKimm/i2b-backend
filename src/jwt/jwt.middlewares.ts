import { NestMiddleware, Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtService } from "./jwt.service";

@Injectable()
export class JWTMiddlewares implements NestMiddleware {
  constructor(private readonly jwtServie: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ("authorization" in req.headers) {
      const token = req.headers["authorization"].replace("Bearer ", "");

      try {
        const decoded = this.jwtServie.verify(token.toString());

        if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
          const id = decoded["id"];
          // const info = await this.infoService.findById(id);

          req["infoId"] = id;
        }
      } catch (e) {
        console.log(e);
      }
    }
    next();
  }
}

// export function JWTMiddlewares(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   console.log(req.headers);
//   next();
// }
