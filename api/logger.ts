import chalk from 'chalk';
import { LoggerLevels } from '../typings';

export class Logger {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  public log(message: string, level: LoggerLevels = 'INFO') {
    switch (level) {
    case 'DEBUG':
      console.log(chalk.blue(`${this.name}>`) + ` ${message}`);
      break;

    case 'INFO':
      console.log(`${this.name}> ${message}`);
      break;

    case 'WARNING':
      console.log(chalk.bgYellow(`${this.name}>`) + ` ${message}`);
      break;

    case 'ERROR':
      console.log(chalk.red(`${this.name}>`) + ` ${message}`);
      break;

    case 'CRITICAL':
      console.log(chalk.bgRed(`${this.name}>`) + ` ${message}`);
      break;
    }
  }
}
