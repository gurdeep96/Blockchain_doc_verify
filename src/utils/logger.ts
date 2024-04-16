import { createLogger, transports, format } from "winston";
import chalk from "chalk";
import { DailyRotateFileTransportOptions } from "winston-daily-rotate-file";

const customFormat = format.printf(
  ({ level, message, timestamp, label, ...metadata }) => {
    const className = metadata.class || "UnknownClass";
    const functionName = metadata.function || "unknownFunction";
    const colorizedMessage = chalk.blue(message);
    return `[${timestamp}][${level}][${
      label || "NoLabel"
    }] [${className}][${functionName}] ${colorizedMessage}`;
  }
);

const logger = createLogger({
  transports: [
    new transports.Console(),
    // new transports.File({
    //   dirname: "logs",
    //   filename: "docverify.log",
    // }),
    new transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "error",
    }),
  ],
  format: format.combine(
    format.colorize(),
    format.prettyPrint(),
    format.label({ label: "dev" }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat
  ),
  defaultMeta: {
    service: "WinstonExample",
  },
});

export default logger;
