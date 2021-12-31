#!/usr/bin/env node

import path from 'path';
let cwd = process.cwd();

import gpl from '.';

do {
	if (path.basename(cwd) !== 'node_modules') {
		gpl(cwd);
	}
} while (cwd.includes('node_modules') && (cwd = path.resolve(cwd, '..')));
