import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss";

import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import ruleRoutes from "./routes/RuleRoutes";
import ActionRoutes from "./routes/ActionRoutes"
import ConditionRoutes from "./routes/ConditionRoutes"
import ConfigRoutes from "./routes/ConfigRoutes"
import TriggerRoutes from "./routes/TriggerRoutes"
import onFailureRoutes from "./routes/onFailureRoutes"

const app: Application = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());

app.use(express.json());
app.use(mongoSanitize());

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
});

app.use("/api/rules", ruleRoutes);
app.use("/api/action", ActionRoutes)
app.use("/api/condition", ConditionRoutes)
app.use("/api/config", ConfigRoutes)
app.use("/api/trigger", TriggerRoutes)
app.use("/api/onFailure", onFailureRoutes)

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
