stdin-recorder
==============

stdin-recorder is a program that records stdin data with timing information in a file, allowing for later playback to stdout.

I've written it because I wanted to store vim sessions in a way that I could later fine-tune simply by editing the session file. The session file is then played back and the whole terminal session is recorded using Asciinema.

Usage
-----

    $ stdin-rec how-to-vim | vim  # Use vim normally, but also store stdin to file.
	$ # ... Then, after finishing the vim session ...
	$ stdin-play how-to-vim | vim  # vim will receive stored data from file.

Installation
------------

This program has no stable releases yet. To install, simply clone this repository and run `sudo npm install -g` from within the clone directory.

Copying
-------

![](https://www.gnu.org/graphics/gplv3-127x51.png)

stdin-recorder is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Unfriendliness with the proprietary paradigm is intentional. If you're writing proprietary software, please consider [respecting your users' freedom instead.](https://www.gnu.org/philosophy/free-sw.html)

Exclusion of warranty
---------------------

stdin-recorder is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

A copy of GPLv3 can be found in [COPYING.](COPYING)
