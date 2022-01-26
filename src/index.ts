import * as J from 'doge-json';
import fs from 'fs';
import path from 'path';

const txt = fs.readFileSync(path.resolve(__dirname, 'LICENSE'));
const md = fs.readFileSync(path.resolve(__dirname, 'LICENSE.md'));

export default async function gpl(cwd = '.') {
	function p(p: string) {
		return path.resolve(cwd, p);
	}
	if (fs.existsSync(p('COPYING.md'))) {
		fs.writeFileSync(p('COPYING.md'), md);
	} else if (fs.existsSync(p('COPYING'))) {
		fs.writeFileSync(p('COPYING'), txt);
	} else if (fs.existsSync(p('LICENSE'))) {
		fs.writeFileSync(p('LICENSE'), txt);
	} else {
		fs.writeFileSync(p('LICENSE.md'), md);
	}
	if (fs.existsSync(p('package.json'))) {
		const pkg = J.read(p('package.json'));
		if (!pkg.license?.match(/^GPL/)) {
			pkg.license = 'gpl-3.0-or-later';
			J.write(p('package.json'), pkg);
		}
	}
}
