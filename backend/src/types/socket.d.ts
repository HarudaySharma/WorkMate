// types/socket.d.ts
import "socket.io";
import { JWTPayload } from ".";

declare module "socket.io" {
  interface Socket {
    data: {
      user: JWTPayload["data"]["user"]
    };
  }
}
