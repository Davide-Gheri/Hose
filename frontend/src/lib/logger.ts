
class Logger {
  constructor(
    public enabled: boolean,
  ) {}

  get isEnabled() {
    return LoggerManager.enabled && this.enabled;
  }

  getConsole() {
    return new Proxy(console, {
      get: (target: any, p: string | number | symbol): any => {
        if (this.isEnabled) {
          return target[p];
        }
        return () => {};
      },
    });
  }
}

export class LoggerManager {
  static enabled: boolean;

  static loggers: Record<string, Logger> = {};

  static addLogger(name: string, enabled: boolean) {
    this.loggers[name] = new Logger(enabled);
    return this.loggers[name].getConsole();
  }

  static enable(name: string) {
    this.getLogger(name).enabled = true;
  }

  static disable(name: string) {
    this.getLogger(name).enabled = false;
  }

  static getLogger(name: string) {
    if (!this.loggers[name]) {
      throw new Error(`Logger with name ${name} not found`);
    }
    return this.loggers[name];
  }
}

export const makeLogger = (name: string, enabled: boolean = true) => (
  LoggerManager.addLogger(name, enabled)
);
