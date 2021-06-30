import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "src/jwt/jwt.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtServie: JwtService) {}

  public validateToken(token: string) {
    try {
      const isToken = this.jwtServie.verify(token.toString());
      return isToken;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const requsetToken = request.headers.authorization.replace("Bearer ", "");

    if (requsetToken === undefined) {
      return;
    }

    const decodedToken = this.validateToken(requsetToken);
    if (decodedToken) {
      request.user = decodedToken;
      return true;
    } else {
      return false;
    }
  }
}
