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
var data = [];
function flush() {
    if(data.length === 0) {
        return;
    }
    var delays = data.map(function(data) {
        return data.d;
    });
    var string = data.map(function(data) {
        return data.c;
    }).join('');
    fs.writeSync(file, 'd: ' + delays.join(' ') + '\n');
    string.split('\n').forEach(function(line) {
        fs.writeSync(file, 'l: ' + line + '\n');
    });
    data = [];
}
process.stdin.on (
	'data', function(input) {
        if(input === '\x04') {
            flush();
            process.exit();
        }
		input = input.replace('\x7f', '\b');
		var delay = (Date.now() - timer) / 1000;
		timer = Date.now();
        var chars = input.split('');
        for(var i = 0; i < chars.length; ++i) {
            var first = (i === 0);
            var c = chars[i];
            var nc = chars[i + 1];
            switch(c) {
                case '\r':
                    if(nc === '\n') {
                        ++i;
                    }
                case '\n':
                    data.push({ d: first? delay : 0, c: '\n' });
                    flush();
                    break;
                default:
                    data.push({ d: delay, c });
                    if(c === '\x1b') {
                        flush();
                    }
                    break;
            }
        }
		process.stdout.write(input);
	}
);
