class CheckTime {
	/**
	 * @param {boolean} start
	 * * Default: false
	 * * If this is set to true, this will automatically start by saving the time this class was called
	 */
	constructor(start=false) {
		this.t = (start) ? Date.now() : null;
	}

	/**
	 * 
	 * @returns {int | null} Return the time difference in milliseconds
	 */
	set(reset=true) {
		if (this.t === null) {
			this.t = Date.now();
		}
		else {
			return this.#_calculate(this.t, Date.now(), reset);
		}
		return null;
	}
	/**
	 * @param {int} t1 First time in MS
	 * @param {int} t2 Second time in MS
	 * @param {boolean} reset Reset the time variable
	 * @returns {int} Difference between the 2 times
	 */
	#_calculate(t1, t2, reset=true) {
		let diff = Math.abs(t1 - t2);
		if (reset) { this.t = null; }
		return diff;
	}
}

module.exports = CheckTime;