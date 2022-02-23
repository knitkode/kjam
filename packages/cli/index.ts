#! /usr/bin/env node
import { Command } from "commander";
import { watch } from "./watch";

const program = new Command();

program.name("kjam").description("CLI to use kjam").version("0.0.1");

program
  .command("watch")
  .description("Watch your local content repo")
  .action(watch);

program.parse();
