#!/usr/bin/env node
const { exec } = require("child_process");
const command = "cd " + __dirname + " && npm run run-bin";
exec(command);
