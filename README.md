# ![flask](https://raw.githubusercontent.com/nclslbrn/infrared-spectrum-reinterpretation/master/favicon-flask.ico "Favicon of the website") infrared-spectrum-reinterpretation

![screenshot](https://raw.githubusercontent.com/nclslbrn/infrared-spectrum-reinterpretation/master/screenshot.jpg "Screenshot of the website")

This project is a tool for reinterpret, transcode infrared analysis of various molecules into different medium:
- light sequences
- sounds
- motion keys

Infrared spectrums come from NIST (National Institute of Standards and Technology - U.S. Department of Commerce),
due to a server limitation we have to download files manually from [nist.gov](http://webbook.nist.gov/chemistry/name-ser/)
and put into a folder _jcamp/, and put each link into the <select> of index.html. Due to the loading of these by XMLHttpRequest,
this script could work only on server (local or distant).


This project is produced within the framework of a part of the COSA research group, which studies relation between art and science.
