<h1 align="center">r2load</h1>

<div align="center">
  <strong>r2load is a Node.js autoloader for your files, folders, and modules</strong>
</div>

<br />

<div align="center">
  <!-- NPM version -->
  <a href="https://npmjs.org/package/r2load" target="_blank">
    <img src="https://img.shields.io/npm/v/r2load.svg" alt="NPM version" />
  </a>
  <!-- License -->
  <a href="https://npmjs.org/package/r2load" target="_blank">
    <img src="https://img.shields.io/npm/l/r2load.svg" alt="License" />
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/r2load" target="_blank">
    <img src="https://img.shields.io/npm/dt/r2load.svg" alt="Downloads" />
  </a>
  <!-- Downloads Month -->
  <a href="https://npmjs.org/package/r2load" target="_blank">
    <img src="https://img.shields.io/npm/dm/r2load.svg" alt="Downloads Month" />
  </a>
  <!-- Travis CI -->
  <a href="https://travis-ci.org/r2js/r2load" target="_blank">
    <img src="https://img.shields.io/travis/r2js/r2load.svg" alt="Travis CI" />
  </a>
  <!-- Dependencies -->
  <a href="https://david-dm.org/r2js/r2load" target="_blank">
    <img src="https://img.shields.io/david/r2js/r2load.svg" alt="Dependencies" />
  </a>
  <!-- Codeclimate -->
  <a href="https://codeclimate.com/github/r2js/r2load" target="_blank">
    <img src="https://img.shields.io/codeclimate/github/r2js/r2load.svg" alt="Codeclimate" />
  </a>
  <!-- Codeclimate Coverage -->
  <a href="https://codeclimate.com/github/r2js/r2load" target="_blank">
    <img src="https://img.shields.io/codeclimate/coverage/github/r2js/r2load.svg" alt="Codeclimate Coverage" />
  </a>
  <!-- Codacy -->
  <a href="https://codacy.com" target="_blank">
    <img src="https://img.shields.io/codacy/grade/c199fde5dba44f0e9820d97be8178762.svg" alt="Codacy" />
  </a>
  <!-- Github Stars -->
  <a href="https://github.com/r2js/r2load" target="_blank">
    <img src="https://img.shields.io/github/stars/r2js/r2load.svg?label=%E2%98%85" alt="Github Stars" />
  </a>
</div>

<br />

## Usage

```js
const r2load = require('r2load');
const loader = r2load();
const app = {};
loader
  .load('model')
  .load('controller')
  .load('service')
  .into(app);

/*
{
  services: {
    'model/users': ...,
    'controller/users': ...,
    'service/users': ...,
  }
}
*/
```

## Installation

```bash
$ npm install r2load
```
