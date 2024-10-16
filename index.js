#!/usr/bin/env node
const { exec } = require("child_process");
const command = "cd " + __dirname + " && npm run start";
exec(command);
