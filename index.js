#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
const pressAnyKey = require("press-any-key");

const CURR_DIR = process.cwd();

console.log("Welcome to Prime.");
console.log(
  "A program using inquirer.js which finds all prime numbers between two given numbers."
);
inquirer
  .prompt([
    {
      type: "input",
      name: "firstNumber",
      message:
        "What is the first number that should be tested for being prime?",
      validate: function (answer) {
        const valid = !isNaN(answer);
        return valid || "Please enter a number";
      },
    },
    {
      type: "input",
      name: "lastNumber",
      message: "What is the last number that should be tested for being prime?",
      validate: function (answer) {
        const valid = !isNaN(answer);
        return valid || "Please enter a number";
      },
    },
    {
      type: "list",
      name: "output",
      message:
        "Should the detected prime numbers be printed in the console or in an external file?",
      choices: [
        "Print result in the console",
        "List the result in an external file",
      ],
    },
    {
      type: "input",
      name: "filename",
      message: "Please enter a file name for listing the primes.",
      when: function (answers) {
        return answers.output === "List the result in an external file";
      },
      validate: function (answer) {
        if (!answer) {
          return "Please enter a value";
        }
        return true;
      },
    },
  ])
  .then((answers) => {
    // Initialise variables
    const firstNumber = answers.firstNumber;
    const lastNumber = answers.lastNumber;
    let filename;
    const primes = [];

    if (answers.filename) {
      filename = answers.filename;
    } else {
      filename = false;
    }

    for (let i = Math.round(firstNumber); i <= lastNumber; i++) {
      if (isPrime(i)) {
        primes.push(i);
      }
    }

    if (filename) {
      fs.writeFile(`${CURR_DIR}/${filename}`, primes, function (err) {
        if (err) {
          chalk.red(err);
          return pressAnyKeyToExit();
        }
        console.log("File was saved successfully as " + filename);
        return pressAnyKeyToExit();
      });
    }
    if (!filename) {
      console.log(primes);
      pressAnyKeyToExit();
    }
  })
  .catch((err) => {
    chalk.red(err);
    pressAnyKeyToExit();
  });

function isPrime(n) {
  if (n < 2) {
    return false;
  }
  if (n != Math.round(n)) {
    return false;
  }

  let isPrime = true;

  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i == 0) {
      isPrime = false;
    }
  }

  return isPrime;
}

function pressAnyKeyToExit() {
  pressAnyKey("Press any key to exit.");
}
