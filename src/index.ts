import * as J from 'doge-json';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';

export default async function gpl(cwd = '.') {
	function p(p: string) {
		return path.resolve(cwd, p);
	}
	let ext =
		fs.existsSync(p('LICENSE.md')) || fs.existsSync(p('COPYING.md'))
			? 'md'
			: 'txt';
	let location = `https://gnu.org/licenses/gpl.${ext}`;
	do {
		const res = await new Promise<http.IncomingMessage>((resolve) => {
			const req = https.request(location, resolve);
			req.end();
		});
		if (res.headers.location) {
			location = res.headers.location;
		} else {
			const body = Array<Buffer>();
			res.on('data', (b: Buffer) => body.push(b));
			await new Promise((resolve) => {
				res.on('end', () => {
					const SPDX = `GPL-${location
						.split(/[^0-9\.]+/g)
						.filter((a) => a)
						.pop()
						?.replace(/^\.+/g, '')
						?.replace(/\.+$/g, '')}-or-later`;
					const license = Buffer.concat(body).toString();
					const pkg = J.read(p('package.json'));
					if (pkg && typeof pkg === 'object') {
						pkg.license = SPDX;
						J.write(p('package.json'), pkg);
					}
					if (ext == 'md') {
						if (fs.existsSync(p('COPYING.md'))) {
							fs.writeFileSync(p('COPYING.md'), license);
						} else {
							fs.writeFileSync(p('LICENSE.md'), license);
						}
					} else {
						if (fs.existsSync(p('LICENSE'))) {
							fs.writeFileSync(p('LICENSE'), license);
						} else {
							fs.writeFileSync(p('COPYING'), license);
						}
					}
				});
			});
			return;
		}
	} while (1);
}
