#! /usr/bin/env node
import chalk from 'chalk'
import inquirer from 'inquirer'
import * as path from 'path'
import { replace, run } from './utils.js'

interface CLIAnswers {
  projectName: string
  packageManager: {
    label: string
    value: string
  }
}

console.clear()
console.log(chalk.green("Let's get started ✨"))
inquirer
  .prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name',
      default: 'my-small-three-project',
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'What package manager do you wanna use?',
      choices: ['PNPM', 'Yarn', 'NPM'],
      filter(val) {
        return {
          label: val,
          value: val.toLowerCase(),
        }
      },
    },
  ])
  .then((answers: CLIAnswers) => {
    /** Fetch small-three repo */
    const gitCheckoutCommand = `git clone --depth 1 https://github.com/albanbleicher/small-three.git ${answers.projectName}`
    console.log(chalk.cyanBright('☁️  Cloning ') + chalk.magentaBright('small-three'))
    const checkedOut = run(gitCheckoutCommand)
    if (!checkedOut) process.exit(-1)

    /** Install dependencies */
    const installDepsCommand = `cd ${answers.projectName} && ${answers.packageManager.value} install`
    console.log(
      chalk.cyanBright(`📦 Installing dependencies with ${answers.packageManager.label} ... \n`)
    )
    const installedDeps = run(installDepsCommand)
    if (!installedDeps) process.exit(-1)

    /** Woop woop */
    console.log(chalk.yellowBright('🎉 Woop woop ! Everything worked out well ! \n'))

    /** Start commands */
    console.log(chalk.cyanBright('Start your project with : \n'))
    console.log(
      chalk.cyanBright('cd') +
        ' ' +
        chalk.magentaBright(answers.projectName) +
        chalk.cyanBright(
          ` && ${
            answers.packageManager.value !== 'npm'
              ? answers.packageManager.value + ' dev'
              : 'npm run dev'
          } \n`
        )
    )

    /** Update README.md and index.html */
    const readme = path.join(process.cwd(), answers.projectName, 'README.md')
    const index = path.join(process.cwd(), answers.projectName, 'index.html')

    replace(readme, 'small-three', answers.projectName)
    replace(index, /%title%/g, answers.projectName)
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  })
