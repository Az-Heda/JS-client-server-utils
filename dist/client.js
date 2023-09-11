const myStorage = {
	add: function(key, value) {
		if (typeof Storage !== undefined) {
			window.localStorage.setItem(key, JSON.stringify(value));
			return Object.keys(window.localStorage).includes(key);
		}
		return null;
	},
	remove: function(key) {
		if (typeof Storage !== undefined) {
			if (Object.keys(window.localStorage).includes(key)) {
				window.localStorage.removeItem(key);
				return true;
			}
			return false;
		}
		return null;
	},
	get: function(key) {
		if (typeof Storage !== undefined) {
			if (Object.keys(window.localStorage).includes(key)) {
				return JSON.parse(window.localStorage.getItem(key));
			}
		}
		return null;
	},
	clear: function() {
		if (typeof Storage !== undefined) {
			window.localStorage.clear();
			return window.localStorage.length == 0;
		}
		return null;
	},
	localcookie: {
		set: function(key, value, expr = 1000 * 60 * 60 * 24) {
			const now = new Date();
			const item = { value: value, expiry: now.getTime() + expr };
			window.localStorage.setItem(key, JSON.stringify(item));
		},
		read: function(key) {
			if (Object.keys(window.localStorage).includes(key)) {
				const itemStr = window.localStorage.getItem(key);
				if (!itemStr) return null;
				const item = JSON.parse(itemStr);
				const now = new Date();
				if (now.getTime() > item.expiry) {
					window.localStorage.removeItem(key);
					return null;
				}
				return item.value;
			}
			return null;
		}
	}
}

class Loader {
	/**
	 * Methods:
	 * * loader.append()
	 * * loader.remove()
	 * @param {String} theme Light OR Dark
	 */
    constructor(theme='dark') {
		this.theme = (['light', 'dark'].includes(theme)) ? theme : 'dark';
		this.themeColors = {
			'light': {
				border: 'black',
				background: 'rgba(0, 0, 0, 0.25)',
			},
			'dark': {
				border: 'white',
				background: 'rgba(255, 255, 255, 0.25)',
			},
		}
		this.className = `cube-${Date.now()}`;
        this.loader = document.createElement('div');
        this.loader.classList.add(this.className);
        this.#_styleLoader();
        this.sides = [];
        for (let pos = 0; pos < 6; pos ++) {
            let side = document.createElement('div');
            side.setAttribute('class', 'side');
            this.sides.push(side);
        }
        this.sides.forEach((s) => {
            this.loader.appendChild(s);
        })
    }

    #_styleLoader() {
		const exists = (document.getElementById('azheda-loader-style') !== null)
		let css = (exists)
					? document.getElementById('azheda-loader-style')
					: document.createElement('style');
		css.setAttribute('id', 'azheda-loader-style');
		css.innerHTML = `
		/* Animation for Theme: ${this.theme} */
		@keyframes AzHedaCubeAnimation {
			0% { transform: rotate(45deg) rotateX(-25deg) rotateY(25deg); }
			50% { transform: rotate(45deg) rotateX(-385deg) rotateY(25deg); }
			100% { transform: rotate(45deg) rotateX(-385deg) rotateY(385deg); }
		}
		  
		.${this.className} {
			animation: AzHedaCubeAnimation 2s infinite ease;
			transform-style: preserve-3d;
			height: 40px;
			width: 40px;
		}
		
		.${this.className} div {
			background-color: ${this.themeColors[this.theme].background};
			height: 100%;
			position: absolute;
			width: 100%;
			border: 2px solid ${this.themeColors[this.theme].border};
		}
		
		.${this.className} div:nth-of-type(1) { transform: translateZ(-20px) rotateY(180deg); }
		.${this.className} div:nth-of-type(2) { transform: rotateY(-270deg) translateX(50%); transform-origin: top right; }
		.${this.className} div:nth-of-type(3) { transform: rotateY(270deg) translateX(-50%); transform-origin: center left; }
		.${this.className} div:nth-of-type(4) { transform: rotateX(90deg) translateY(-50%); transform-origin: top center; }
		.${this.className} div:nth-of-type(5) { transform: rotateX(-90deg) translateY(50%); transform-origin: bottom center; }
		.${this.className} div:nth-of-type(6) { transform: translateZ(20px); }`;
		
		
        let styles = {
			'position': 'fixed',
			'top': '50%',
			'left': '50%',
			'z-index': '1', 
        };
        let keys = Object.keys(styles);
        let values = keys.map((item) => { return `${item}: ${styles[item]}` }).join('; ');
        this.loader.setAttribute('style', values);
		if (!exists) {
			document.body.appendChild(css);
		}
    }
	/**
	 * Show loader
	 */
    append() {
        if (this.loader !== null) {
            let body = document.getElementsByTagName('body')[0];
            body.appendChild(this.loader);
        }
        else {
            throw new Error(`Loader not found`);
        }
    }

	/**
	 * Remove loader
	 */
    remove() {
        this.loader.remove();
    }
}

/** number **/
Number.prototype.map = function(start1, stop1, start2, stop2) {
	return (this - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};



/** string **/
String.prototype.encode = function(separator = '|') {
	let newString = [];
	for (let pos = 0; pos < this.length; pos++) {
		let lett = this.charCodeAt(pos);
		newString.push(lett);
	}
	return newString.join(separator);
};

String.prototype.decode = function(separator = '|') {
	return String.fromCharCode(...this.split(separator));
};

String.prototype.capitalize = function() {
	const str = this;
	const arr = str.split(" ");
	for (var i = 0; i < arr.length; i++) {
		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
	}
	const str2 = arr.join(" ");
	return str2;
};

String.prototype.hashSeed = function(seed = 0) {
	let h1 = 0xdeadbeef ^ seed;
	let h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < this.length; i++) {
		ch = this.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761)
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};


/** array **/
Array.prototype.sortByString = function(strlist) {
	const mapped = this.map((v, i) => {
		return { i, isIn: strlist.includes(v) } 
	});
	mapped.sort((a, b) => {
		if (a.isIn && b.isIn) {
			const idx1 = strlist.indexOf(a);
			const idx2 = strlist.indexOf(b);
			return (idx1 < idx2) ? -1 : (idx1 > idx2) ? 1 : 0;
		}
		if (a.isIn || b.isIn) {
			return (a.isIn) ? -1 : (b.isIn) ? 1 : 0;
		}
		return 0;
	});

	return strlist.concat(...mapped.map((v) => { return this[v.i] }).splice(strlist.length));
};

Array.prototype.randomize = function() {
	let currentIndex = this.length;
	let randomIndex;

	while (0 != currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
	}
	return this;
};



/** object **/
Object.prototype.getList = function() {
	const labels = Object.keys(this);
	const values = labels.map((item) => { return this[item] });
	return [labels, values];
};

Object.prototype.sort = function() {
	const keys = Object.keys(this);
	let newObject = {};
	keys.sort();
	for (let i = 0; i < keys.length; i++) {
		let k = keys[i];
		newObject[k] = this[k];
	}
	return newObject;
};


/** multiple */
(function() {
	const fn = function() { return JSON.parse(JSON.stringify(this)); };
	Array.prototype.copy = fn;
	Object.prototype.copy = fn;
}());

(function() {
	const fn = function() {
		let thisString = `${this}`;
		var len = thisString.length;
		let code = 0;
		for (let i = 0; i < len; ++i) {
			code += thisString.charCodeAt(i);
			code += (code << 10);
			code ^= (code >> 6);
		}
		code += (code << 3);
		code ^= (code >> 11);
		code += (code << 15);
		return Math.floor(Math.abs(code));
	}
	String.prototype.getid = fn;
	Number.prototype.getid = fn;
}());