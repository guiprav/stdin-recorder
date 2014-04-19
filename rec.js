#!/usr/bin/env node
/*
	This file is part of stdin-recorder.

	stdin-recorder is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	stdin-recorder is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with stdin-recorder. If not, see <http://www.gnu.org/licenses/>.
*/
'use strict';
var fs = require('fs');
var file = fs.openSync(process.argv[2], 'w');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
var timer = Date.now();
process.stdin.on (
	'data', function(input) {
		// ctrl-c ( end of text )
		if(input === '\x03') {
			fs.closeSync(file);
			process.exit();
		}
		input = input.replace('\x7f', '\b');
		var delay = (Date.now() - timer) / 1000;
		timer = Date.now();
		var stored_input = input
			.replace('\\', '\\\\')
			.replace('\r', '\\r')
			.replace('\n', '\\n')
			.replace('|', '\\|');
		fs.writeSync(file, '@' + delay + '\n|' + stored_input + '|\n');
		process.stdout.write(input);
	}
);
