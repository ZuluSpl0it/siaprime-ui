# [![SiaPrime Logo](/assets/scPrime-logo.png)](https://siaprime.net/) User Interface

[![Build Status](https://travis-ci.org/NebulousLabs/SiaPrime-UI.svg?branch=master)](https://travis-ci.org/NebulousLabs/SiaPrime-UI)
[![devDependency Status](https://david-dm.org/NebulousLabs/SiaPrime-UI/dev-status.svg)](https://david-dm.org/NebulousLabs/SiaPrime-UI#info=devDependencies)
[![dependencies Status](https://david-dm.org/NebulousLabs/SiaPrime-UI.svg)](https://david-dm.org/NebulousLabs/SiaPrime-UI#info=dependencies)
[![Known Vulnerabilities](https://snyk.io/test/github/NebulousLabs/SiaPrime-UI/badge.svg)](https://snyk.io/test/github/NebulousLabs/SiaPrime-UI)
[![license:mit](https://img.shields.io/badge/license-mit-blue.svg)](https://opensource.org/licenses/MIT)

# A Highly Efficient Decentralized Storage Network

![A snapshot of the file library](/doc/assets/files.png)
This is the user interface for [SiaPrime](https://gitlab.com/SiaPrime/Sia), it
is a desktop application based off the
[electron](https://github.com/atom/electron) framework. The ambition behind
this project is to facilitate easy, graphical interaction between users and
the Sia network.

## Prerequisites

- [spd](https://gitlab.com/SiaPrime/Sia)
- [node & npm 6.9.0 LTS](https://nodejs.org/download/)
Earlier node versions may work, but they do not have guaranteed support.
- `libxss` is a required dependency for Electron on Debian, it can be installed with `sudo apt-get install libxss1`.

## Running

[Download your OS's release archive and unzip it](https://gitlab.com/SiaPrime/SiaPrime-UI/releases)

### OR

Run from source

0. Install dependencies mentioned above
1. Download or `git clone` the repository
2. npm install
3. npm start

## [Contributing](doc/Developers.md)

Read the document linked above to learn more about the application and its technologies.

Take a look at our [issues page](https://gitlab.com/SiaPrime/SiaPrime-UI/issues)
for a high level view of what objectives we're working on.

If you're the type to jump right into code, simply search through the project
(sans the `node_modules` folder) for the term `TODO:`. If you're on a UNIX
(Linux & OSX) system, run `grep -r 'TODO:' js plugins` in a terminal at the
root level of the project

## Setting Up
<p>git pull && git checkout integration. 
You will need to create a `bin` folder in the siaprime-ui directory. 
Then using the following folder structure, place your binaries (`spd, spc`) in there.
</p>

<ul>
bin
<ul>linux</ul>
<ul>win</ul>
<ul>mac</ul>
</ul>
 

1. install node 10 LTS 
2. `/usr/bin/node /usr/lib/node_modules/npm/bin/npm-cli.js install --scripts-prepend-node-path=auto`
3. npm run rebuild  

***Dev environment***  
npm run dev

***Build Executables***
update version in app/package.json  
  
npm run package-win  
npm run package-linux   
npm run package-mac

For linux, you will need to install wine to run a windows build. 
Building .dmg requires a mac.

