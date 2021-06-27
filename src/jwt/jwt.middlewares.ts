import { NestMiddleware, Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtService } from "./jwt.service";
import { InfoService } from "src/info/info.service";

@Injectable()
export class JWTMiddlewares implements NestMiddleware {
  constructor(
    private readonly jwtServie: JwtService,
    private readonly infoService: InfoService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ("x-jwt" in req.headers) {
      const token = req.headers["x-jwt"];

      try {
        const decoded = this.jwtServie.verify(token.toString());

        if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
          const id = decoded["id"];
          const info = await this.infoService.findById(id);

          req["info"] = info;
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
