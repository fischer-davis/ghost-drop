import chalk from "chalk";
import { Presets, SingleBar } from "cli-progress";

export function createProgressBar() {
  const bar = new SingleBar(
    {
      format:
        "Progress |" +
        chalk.cyan("{bar}") +
        "| {percentage}% || {value}/{total} Chunks || {status}",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
    },
    Presets.shades_classic,
  );

  return {
    before: (file: string) => {
      console.log(chalk.green(`Uploading file: ${file}`));
      bar.start(100, 0, { status: "starting" });
    },
    update: (progress: number, status: string) => {
      bar.update(progress, { status });
    },
    finish: () => {
      bar.stop();
      console.log(chalk.green(`Upload successful`));
    },
  };
}
