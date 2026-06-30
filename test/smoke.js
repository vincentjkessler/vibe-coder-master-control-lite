#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const landing = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cockpit = fs.readFileSync(path.join(root, 'qa-cockpit.js'), 'utf8');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const pkg = fs.readFileSync(path.join(root, 'package.json'), 'utf8');

const requiredCockpitTokens = [
  'QACockpit.init',
  "hotkey: 'T'",
  "'CHANGELOG'",
  "_renderChangelog",
  "changelog: []",
  'COPY DEBUG REPORT',
  'RELEASE GATE'
];

for (const token of requiredCockpitTokens) {
  if (!cockpit.includes(token)) throw new Error(`Missing cockpit token: ${token}`);
}

if (!landing.includes('https://github.com/vincentjkessler/vibe-coder-master-control-lite')) {
  throw new Error('Landing page does not link to GitHub.');
}
if (!landing.includes('VINCENTJKESSLER.COM')) {
  throw new Error('Landing page does not brand VincentJKessler.com.');
}
if (!landing.includes('Changelog')) {
  throw new Error('Landing page does not mention the Changelog tab.');
}
if (!readme.includes('Critical Tab: Changelog')) {
  throw new Error('README does not explain the Changelog tab.');
}
if (/Joe|Truax|Sphere|Kinddit|kinddit|joetruax/i.test(landing + cockpit + readme + pkg)) {
  throw new Error('Old Joe/Sphere/Kinddit branding remains.');
}

console.log('[smoke] VCMC Lite uses qa-cockpit.js, includes Changelog, and is Vincent-branded.');
