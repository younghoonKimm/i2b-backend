import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class AdminAuthGuards implements CanActivate {
  canActivate(context: ExecutionContext) {
    const user = context.getArgs();

    if (!user) {
      return false;
    }
    return true;
  }
}
