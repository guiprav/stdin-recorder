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
var script = fs.readFileSync(process.argv[2], { encoding: 'utf8' });
var speed = 1;
var paused = false;
function odd(number) {
	return (number % 2 !== 0);
}
function parse_delay_line(line, i) {
	if(line.charAt(0) !== '@') {
		throw new Error("On line " + i + ", expected '@' token at beginning of delay line.");
	}
	return (function() {
		var delay_string = line.slice(1);
		var delay = parseFloat(delay_string);
		if(Number.isNaN(delay)) {
			throw new Error("On line " + i + ", could not parse delay number '" + delay_string + "'.");
		}
		return delay;
	})();
}
function parse_data_line(line, i) {
	if(line.charAt(0) !== '|' || line.charAt(line.length - 1) !== '|') {
		throw new Error("On line " + i + ", expected data line surrounded by pipes, but got: '" + line + "'.");
	}
	return line.slice(1, -1)
		.replace(/(^|[^\\])\\r/g, '\r')
		.replace(/(^|[^\\])\\n/g, '\n')
		.replace(/(^|[^\\])\\\|/g, '|')
		.replace('\\\\', '\\');
}
script = (function() {
    var data_line = false;
	var lines = script.split('\n');
	var delays;
	var result = [];
    for(var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if(line === '') {
            continue;
        }

        if(data_line && line.startsWith('d: ')) {
            data_line = false;
        }

        if(!data_line) {
            if(!line.startsWith('d: ')) {
                throw new Error("Bad delays line: " + line);
            }

            delays = line.slice('d: '.length).split(' ').map(function(v) {
                return parseFloat(v);
            });

            data_line = true;
        }
        else {
            if(!line.startsWith('l: ')) {
                throw new Error("Bad data line: " + line);
            }

            line = line.slice('l: '.length) || '\r';

            line.split('').forEach(function(c, i) {
                result.push({ delay: delays[i] || 0, data: c });
            });
        }
    }
	return result;
})();
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on (
	'data', function(input) {
		var small_change = (speed <= 1)? 0.1 : 2;
		var big_change = (speed <= 1)? 0.15 : 3;
		switch(input) {
			case 'f':
				speed += small_change;
				break;
			case 'F':
				speed += big_change;
				break;
			case 's':
				speed -= small_change;
				break;
			case 'S':
				speed -= big_change;
				break;
			case 'd':
				speed = 1;
				break;
			case 'p':
				paused = !paused;
				break;
			case 'q':
				process.exit();
				break;
		}
		if(speed < 0) {
			speed = small_change;
		}
		else
		if(speed > 20) {
			speed = 20;
		}
	}
);
(function() {
	var timer = Date.now();
	var i = 0;
	function tick() {
		var command = script[i];
		var elapsed = (Date.now() - timer) / 1000;
		if(!paused && elapsed > (command.delay / speed)) {
			process.stdout.write(command.data, 'utf8');
			timer = Date.now();
			++i;
		}
		if(i < script.length) {
			setImmediate(tick);
		}
	}
	tick();
})();
