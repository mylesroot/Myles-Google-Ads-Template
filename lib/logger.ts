/*
<ai_context>
A simple logger utility for the application.
</ai_context>
*/

type LogLevel = "info" | "warn" | "error" | "debug"

class Logger {
  private prefix: string

  constructor(prefix: string = "") {
    this.prefix = prefix ? `[${prefix}] ` : ""
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString()
    const formattedMessage = `${timestamp} ${this.prefix}${message}`

    switch (level) {
      case "info":
        console.log(formattedMessage, ...args)
        break
      case "warn":
        console.warn(formattedMessage, ...args)
        break
      case "error":
        console.error(formattedMessage, ...args)
        break
      case "debug":
        console.debug(formattedMessage, ...args)
        break
    }
  }

  info(message: string, ...args: any[]): void {
    this.log("info", message, ...args)
  }

  warn(message: string, ...args: any[]): void {
    this.log("warn", message, ...args)
  }

  error(message: string, ...args: any[]): void {
    this.log("error", message, ...args)
  }

  debug(message: string, ...args: any[]): void {
    this.log("debug", message, ...args)
  }
}

export function createLogger(prefix?: string): Logger {
  return new Logger(prefix)
}

export default createLogger
