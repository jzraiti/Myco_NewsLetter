import { spawn } from "node:child_process";

const rawArgs = process.argv.slice(2);
const normalizedArgs = [];
let hasRunFlag = false;

for (const arg of rawArgs) {
  if (arg === "--run") {
    if (hasRunFlag) {
      continue;
    }
    hasRunFlag = true;
  }

  normalizedArgs.push(arg);
}

const child = spawn("npx", ["vitest", ...normalizedArgs], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
