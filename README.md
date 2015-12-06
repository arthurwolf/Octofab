# Octofab
A tool to turn the awesome Octoprint into a standalone independent application for use on Smoothieboards

# Installing on Smoothie
* Copy ```index.html``` and the ```static``` folder to your smoothie's sd card
* [Enable the ethernet module](http://smoothieware.org/network)
* Connect the smoothieboard to ethernet
* Go to ```http://ip/sd/index.html``` in your browser, replace 'ip' with your board's IP address

# Using

* First clone this repository:

```git clone https://github.com/arthurwolf/Octofab.git```

* Move to the new repository

```cd Octofab/```

* In there, clone OctoPrint itself

```git clone https://github.com/foosel/OctoPrint.git```

* Move to the OctoPrint folder: 

```cd OctoPrint```

* Create a user-owned virtual environment therein:

```virtualenv --system-site-packages venv```

* Install OctoPrint into that virtual environment: 

```./venv/bin/python setup.py install```

* Run OctoPrint

```./venv/bin/octoprint```
