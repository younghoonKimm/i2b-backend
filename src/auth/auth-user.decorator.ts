import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AdminAuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const [res] = context.getArgs();
    const token = res.headers.authorization.replace("Bearer ", "");
    return token;
  },
);
