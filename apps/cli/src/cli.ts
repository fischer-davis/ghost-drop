#!/usr/bin/env bun

import { Command } from "commander";
import { upload } from "./commands/upload";
import { download } from "./commands/download";

const program = new Command();

program
  .name("ghost")
  .alias("gd")
  .description("GhostDrop CLI - Upload and download files easily")
  .version("1.0.0");

program.addCommand(upload);
program.addCommand(download);

program.parse();
