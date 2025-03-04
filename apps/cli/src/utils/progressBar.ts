export function createProgressBar() {
  return {
    start: () => {
      console.log("Progress started");
    },
    update: (progress: number, status: string) => {
      console.log(`Progress: ${progress}% - ${status}`);
    },
    finish: () => {
      console.log("Progress finished");
    },
  };
}
