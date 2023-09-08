const fs = require('fs');
const path = require('path');

async function writeFile(filename, data, createDir=false) {
	return new Promise((resolve) => {
		if (createDir) {
			let dir = filename.replaceAll('\\', '/').split('/');
			dir.pop();
			if (!fs.existsSync(path.join(...dir))) {
				fs.mkdirSync(path.join(...dir), { recursive: true });
			}
		}
		let stream = fs.createWriteStream(filename);
		stream.on('close', () => {
			resolve(filename);
		});
		stream.write(data);
		stream.close();
	});
}


module.exports = writeFile;