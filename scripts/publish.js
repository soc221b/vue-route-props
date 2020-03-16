const readline = require('readline')
const sh = require('shelljs')
const fs = require('fs')

let packageJson = null

function exec (command) {
  if (sh.exec(command).code !== 0) {
    sh.exit(1)
  }
}

function askNewVersion () {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`Old version: ${packageJson.version}\nNew version:`, (answer) => {
      rl.close();
      packageJson.version = answer
      resolve()
    });
  })
}

function readPackageJson () {
  packageJson = JSON.parse(fs.readFileSync('package.json'))
}

function writePackageJson () {
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n')
}

async function main () {
  exec(`yarn test`)
  exec(`yarn build`)
  readPackageJson()
  await askNewVersion()
  writePackageJson()
  exec(`git add dist -u`)
  exec(`git add package.json -u`)
  exec(`git commit -m v${packageJson.version}`)
}

main()
