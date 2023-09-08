const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function downloadFile(url, filename, createDir=false) {
	return new Promise((resolve, reject) => {
		if (createDir) {
			let dir = filename.replaceAll('\\', '/').split('/');
			dir.pop();
			if (!fs.existsSync(path.join(...dir))) {
				fs.mkdirSync(path.join(...dir), { recursive: true });
			}
		}
		const config = { url, method: 'GET', responseType: 'stream' };
		axios(config)
		.then((res) => {
			const { data } = res;
			const stream = fs.createWriteStream(filename);
			stream.on('error', (err) => { reject(err); });
			stream.on('close', () => { resolve(filename); })
			data.pipe(stream);
		})
		.catch(reject);
	})
}

module.exports = downloadFile;