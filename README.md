# Octofab
A tool to turn awesome 3D printer/laser cutter/CNC milling web applications into standalone independent applications for use with Smoothieboard's on-board web interface, or on-line

# Current targets

* Octoprint ( status : semi-working )
* https://github.com/cheton/cnc.js
* Chilipeppr
* Octocut
* Laserweb
* DC42's online least squares calibration
* DC42's duet web interface

# Using

First clone this repository :

git clone https://github.com/arthurwolf/Octofab.git

Move to the new repository

cd Octofab/

In there, clone Octoprint itself

git clone https://github.com/foosel/OctoPrint.git

Move to the OctoPrint folder: 

cd OctoPrint

Create a user-owned virtual environment therein: 

virtualenv --system-site-packages venv

Install OctoPrint into that virtual environment: 

./venv/bin/python setup.py install

Run Octoprint

./venv/bin/octoprint





