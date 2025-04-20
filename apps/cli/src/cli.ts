#!/usr/bin/env bun
import { Command } from "commander";
import { deleteFile } from "./commands/deleteFile";
import { download } from "./commands/download";
import { list } from "./commands/list";
import { upload } from "./commands/upload";

const program = new Command();

program
  .name("ghost")
  .alias("gd")
  .description("GhostDrop CLI - Upload and download files easily")
  .version("0.0.0");

program.addCommand(upload);
program.addCommand(download);
program.addCommand(deleteFile);
program.addCommand(list);

program.parse();
