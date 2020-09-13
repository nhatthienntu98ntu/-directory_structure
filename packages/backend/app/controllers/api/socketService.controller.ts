import { Request, Response } from "express";
import { CommonResponse } from "../helper/commonResponse";
import { CacheMiddleWare } from "../middleware/cache.middleware";
import { SOCKET_KEY } from "../../models/socket.model";
import * as mongoose from "mongoose";

const commonResponse: CommonResponse = new CommonResponse();

export class SocketServiceController {
  private clients = {};

  constructor(private io: SocketIO.Server, private port: string) {}

  setIO(io: SocketIO.Server, port: string): void {
    this.io = io;
    this.port = port;
  }

  getIO(): SocketIO.Server {
    return this.io;
  }

  listeningConnect(): void {
    this.io.on("connect", (socket: any) => {
      console.info("➡️  Connected Clients On Port %s 🌎", this.port);
      this.clients[socket.id] = socket;
      console.log("current client: ", socket.handshake.query);
      console.log("a user connected: " + socket.id);
      socket.emit("test", "ping");

      socket.on("test", (e) => {
        console.log("test log: ", e);
      });

      socket.on("message", (m: any) => {
        console.log("[SERVER][MESSAGE]: %s", JSON.stringify(m));
        this.io.emit("message", m);
      });

      socket.on("disconnect", () => {
        delete this.clients[socket.id];
        // console.log('current client: ', this.clients);
        console.info("➡️  Clients Disconnected !");
      });
    });
  }

  res(msg: string): void {
    this.io.emit("profile", msg);
  }

  emit(key, obj): void {
    this.io.emit(key, obj);
  }
}
