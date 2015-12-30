# Octofab
A tool to turn the awesome Octoprint into a standalone independent application for use on Smoothieboards

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

# Future targets

* https://github.com/cheton/cnc.js
* Chilipeppr
* Octocut
* Laserweb




