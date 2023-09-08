const fs = require('fs');
const path = require('path');

function get() {
	let obj = {};
	const filelist = fs.readdirSync(path.join(__dirname, 'moduli'));
	for (let pos = 0; pos < filelist.length; pos ++) {
		if (filelist[pos] !== '_.js') {
			const requirePath = `./moduli/${filelist[pos].split('.')[0]}`;
			obj[filelist[pos].split('.')[0]] = require(requirePath);
		}
	}
	return obj
}
module.exports = get();