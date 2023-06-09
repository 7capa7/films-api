import logger from "pino";
import dayjs from "dayjs";
import config from "config";

export const log = logger({
  transport: {
    target: "pino-pretty",
  },
  level: "info",
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
  enabled: config.get("pinoEnabled"),
});
