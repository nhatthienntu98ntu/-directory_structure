import { createServer, Server } from "http";
import * as express from "express";
import * as socketIo from "socket.io";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as cors from "cors";
import * as helmet from "helmet";

// import { Routes } from '@routes/index.ts';
import { Routes } from "./routes/";
import { CONFIG } from "./config/config";

import { SocketServiceController } from "./controllers/api/socketService.controller";

// const platformConfig = require('platformsh-config').config();

const env = process.env.NODE_ENV || "development";
const config = CONFIG[env];
// const port = env === 'production' ? platformConfig.port : config.app.port;
const port = env === "production" ? config.app.port : config.app.port;

// const dataMigrations: DataMigrations = new DataMigrations();

class App {
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private routes: Routes;
  private socketService: SocketServiceController;

  constructor() {
    this.createApp();
    this.createServer();
    this.socket();
    this.config();
    this.configCors();
    this.mongoSetup();
    this.socketService = new SocketServiceController(this.io, port);
    this.routes = new Routes(this.app, this.socketService);
    this.routes.initRoutes();
    this.socketService.listeningConnect();
    this.appStart();
  }

  private createApp(): void {
    this.app = express();
    console.info("➡️  Created New App ❗");
  }

  private createServer(): void {
    this.server = createServer(this.app);
    console.info("➡️  Created New Server ❗");
  }

  private socket(): void {
    this.io = socketIo(this.server);
    console.info("➡️  Started Socket ❗");
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // serving static files
    this.app.use(express.static("public"));
  }

  private configCors(): void {
    this.app.use(helmet());
    this.app.use(cors());

    if (this.app.get("env") === "production") {
      this.app.use(morgan("common"));
    } else {
      this.app.use(morgan("dev"));
    }

    this.app.use((req, res, next) => {
      // configure CORS
      // res.header('Access-Control-Allow-Origin', req.headers.origin[0] || '*');
      // res.header('Access-Control-Allow-Credentials', 'true');
      // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      next();
    });
  }

  private mongoSetup(): void {
    (<any>mongoose).Promise = global.Promise;

    try {
      const mongoDbConnection = `${config.database.mongo.host}${config.database.mongo.port}/${config.database.mongo.database}${config.database.mongo.auth}`;

      // Connecting to the database
      mongoose
        .connect(mongoDbConnection, {
          useUnifiedTopology: true,
          useCreateIndex: false,
          useNewUrlParser: true,
          useFindAndModify: false,
        })
        .then(() => {
          process.env.MongoDbConnectionState = "connected";
          console.info("➡️  Successfully connected to MongoDB ☢️ ");
        })
        .catch((err) => {
          process.env.MongoDbConnectionState = "disconnected";
          console.log("🔴 Could not connect to MongoDB. %s", err);
          process.exit();
        });
    } catch (error) {
      process.env.MongoDbConnectionState = "disconnected";
    }
  }

  private appStart(): void {
    // Create a Server
    // const server = this.app.listen(port, '0.0.0.0', function (err) {
    //   if (err) {
    //     console.log(err);
    //   }

    //   // const host = server.address();

    //   console.info('➡️ Listening on port %s. Open up http://0.0.0.0:%s/ in your browser 🌎', port, port);
    // });

    this.server.listen(port, () => {
      console.info(
        "➡️  Running Server On Port %s. Open up http://0.0.0.0:%s/ in your browser 🌎",
        port,
        port
      );
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

export default new App().getApp();
