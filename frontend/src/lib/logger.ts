
class Logger {
  constructor(
    public name: string,
    public color: string | false,
    public enabled: boolean,
  ) {}

  get isEnabled() {
    return LoggerManager.enabled && this.enabled;
  }

  consoleWrapper(nativeMethod: Function) {
    // Keep correct log line number
    return nativeMethod.bind(window.console, `%c${this.name} => `, `color: ${this.color}; font-weight: bold`);
  }

  getConsole(): Console {
    return new Proxy(console, {
      get: (target: any, p: string | symbol): any => {
        if (this.isEnabled) {
          return this.color ? this.consoleWrapper(target[p]) : target[p];
        }
        return () => {};
      },
    });
  }
}

export class LoggerManager {
  static enabled: boolean;

  static loggers: Record<string, Logger> = {};

  static get randomColor(): string {
    const names = Object.keys(colors);
    return colors[names[names.length * Math.random() << 0]];
  }

  static getColor(color: string | boolean | undefined | null) {
    if (typeof color === 'string') {
      if (color.startsWith('#')) {
        return color;
      } else {
        return colors[color] || LoggerManager.randomColor;
      }
    }
    if (typeof color !== 'boolean' || color) {
      return LoggerManager.randomColor;
    }
    return false;
  }

  static addLogger(name: string, enabled: boolean, color?: string | boolean) {
    this.loggers[name] = new Logger(
      name,
      LoggerManager.getColor(color),
      enabled
    );
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

export function makeLogger(name: string, enabled: boolean = true, color?: string | boolean): Console {
  return LoggerManager.addLogger(name, enabled, color);
}

const colors: Record<string, string> = {
  purple: '#9c27b0',
  indigo: '#3f51b5',
  teal: '#009688',
  green: '#8bc34a',
  orange: '#ff9800',
  grey: '#9e9e9e',
};
