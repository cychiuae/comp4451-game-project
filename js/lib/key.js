KEY_CODES = {
	13: 'mouse1',	// enter
	32: 'space',
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down',
	75: 'mouse2',	// k
	80: 'pause',	// p
	82: 'restart',	// r
	101: 'mouse4',	// numpad 5
	192: 'mouse3',	// `
}

KEY = {};
for(code in KEY_CODES) {
	KEY[KEY_CODES[code]] = 0;
}

document.onkeydown = function(e) {
	var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
	if(KEY_CODES[keyCode]) {
		e.preventDefault();
		KEY[KEY_CODES[keyCode]] = 1;
	}
}

document.onkeyup = function(e) {
	var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
	if (KEY_CODES[keyCode]) {
		e.preventDefault();
		KEY[KEY_CODES[keyCode]] = -1;
	}
}