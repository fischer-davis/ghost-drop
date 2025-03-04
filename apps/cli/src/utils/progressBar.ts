import readline from "readline";
import chalk from "chalk";

export function createProgressBar() {
  return {
    before: (file: string) => {
      console.log(chalk.green(`Uploading file: ${file}`));
    },
    update: (progress: number) => {
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`Progress: ${progress}%`);
      readline.clearLine(process.stdout, 1);
    },
    finish: () => {
      console.log(chalk.green(`\nUpload successful`));
    },
  };
}
