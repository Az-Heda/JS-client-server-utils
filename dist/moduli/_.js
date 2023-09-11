const colors = require('colors');

colors.enable();

/**
 * @param {string} title - Titolo del messaggio
 * @param {string} text - Testo del messaggio
 * @param {string} fn - Funzione dal quale viene inviato il messaggio
 * @param {int} lv - livello di priorità
 */
function writeLog(logActive, logLevel, title, text, fn=null, lv=0) {
	if (logActive) {
		let dt = new Date(Date.now());
		let ct = `${parseNumber(dt.getHours())}:${parseNumber(dt.getMinutes())}:${parseNumber(dt.getSeconds())}.${parseNumber(dt.getMilliseconds(), 3)}`;
		let titleText = `[${title.brightRed}`;
		if (fn !== null && typeof fn == 'string') {
			titleText += ` | ${`${fn}()`.brightMagenta}`
		}
		titleText += ` | ${ct.brightCyan}] `;
		if (logLevel <= lv) {
			console.log(titleText, text)
		}
	}
}

/**
 * @param {*} n Numero con una lunghezza da allungare
 * @param {*} d Numero di cifre necessarie del numero
 * @returns 
 */
function parseNumber(n, d=2) {
	n = n+'';
	while (n.length < d) {
		n = `0${n}`;
	}
	return n;
}

module.exports = {
	writeLog,
	parseNumber
}