import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "src/jwt/jwt.service";

@Injectable()
export class HasID implements CanActivate {
  constructor(private readonly jwtServie: JwtService) {}

  public validateToken(token: string) {
    try {
      if (token) {
        const isToken = this.jwtServie.verify(token.toString());
        return isToken;
      }
    } catch (error) {
      return false;
    }
  }
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.headers.authorization === undefined) return true;

    const requsetToken = request.headers.authorization.replace("Bearer ", "");

    const decodedToken = this.validateToken(requsetToken);

    if (decodedToken) {
      request.user = decodedToken;
    }
    return true;
  }
}
