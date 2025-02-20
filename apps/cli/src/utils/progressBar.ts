export function createProgressBar() {
  const barLength = 30; // Length of the progress bar
  let currentProgress = 0;

  const update = (progress: number, speed: string) => {
    const filledLength = Math.round((barLength * progress) / 100);
    const bar = "█".repeat(filledLength) + "-".repeat(barLength - filledLength);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`[${bar}] ${progress}% | ${speed}`);
    currentProgress = progress;
  };

  const finish = () => {
    process.stdout.clearLine(0); // Clear the progress bar line
    process.stdout.cursorTo(0); // Move the cursor to the start of the line
  };

  return { update, finish };
}
