import { Application, Request, Response, NextFunction } from "express";
import { AuthMiddleWare } from "./../controllers/middleware/auth.middleware";
import { CacheMiddleWare } from "./../controllers/middleware/cache.middleware";

import { SocketServiceController } from "../controllers/api/socketService.controller";

import { inspect } from "util";

// const config = require('platformsh-config').config();
const env = process.env.NODE_ENV || "development";
const ttl = 60 * 60 * 1; // cache for 1 hour
const cache = new CacheMiddleWare(ttl);

export class Routes {
  constructor(
    private app: Application,
    private socketService: SocketServiceController
  ) {
    cache.flush();
  }

  initRoutes(): void {
    this.app.get("/*", function(req, res, next) {
      res.setHeader("Last-Modified", new Date().toUTCString());
      next();
    });

    this.app.use(this.ignoreFavicon);

    this.app.route("/").get((req: Request, res: Response) => {
      // res.status(200).send({ messages: 'GET request successfull!' });
      // console.log('platformsh config: ', config);
      // console.log('process: ', process);
      // console.log('env: ', env);

      res.end(
        '<html> <head><title>PLATFOX OTB Fulfillment APIs</title> <meta charset="UTF-8">' +
          '<link href="https://fonts.googleapis.com/css?family=Comfortaa|Open+Sans+Condensed:300&display=swap" rel="stylesheet">' +
          "<style> *, * > *, body { font-family: Open Sans Condensed, sans-serif; font-family: Comfortaa, cursive; } </style> </head><body>" +
          "<h1>" +
          "Platfox OTB Api - running".toUpperCase() +
          "</h1>" +
          // '<div><label> Port </label> <pre>' + inspect(config.port) + '</pre></div>' +
          // '<div><label> Config </label> <pre>' + inspect(config) + '</pre></div>' +
          "<div><label> Process </label> <pre>" +
          inspect(process) +
          "</pre></div>" +
          "<div><label> ENV </label> <pre>" +
          env +
          "</pre></div>" +
          "</body></html>"
      );
    });
  }

  private ignoreFavicon(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    if (
      request.originalUrl &&
      request.originalUrl.split("/").pop() === "favicon.ico"
    ) {
      return response.sendStatus(204);
    }

    return next();
  }

  private loggerMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    console.log(`${request.method} ${request.path}`);
    next();
  }
}
