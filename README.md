# ![flask](https://raw.githubusercontent.com/nclslbrn/infrared-spectrum-reinterpretation/master/dist/images/favicon-flask.ico "Favicon of the website") infrared-spectrum-reinterpretation


This project is a tool for reinterpreting, transcoding infrared analysis of various molecules into different medium:
- light sequences
- sounds
- motion keys

Infrared spectrums come from NIST (National Institute of Standards and Technology - U.S. Department of Commerce),
due to a server limitation we have to download files manually from [nist.gov](http://webbook.nist.gov/chemistry/name-ser/)
and put into a folder data/, and put each link into the `<ul>` index.html file like below.

Spectrum vizualisation (area chart) is made with [D3.js v4](https://github.com/d3/d3).

Audio synthesis with [Tone.js](https://github.com/Tonejs/Tone.js).

Others features 'll come asap...


```html
<dl id="molecule-select" class="dropdown">
  <a href="#" class="dropdown-button" data-activate="dropdown-molecule">Select a molecule</a>
  <dd>
    <ul>
      <li><a class="link" href="#" data-file="data/{file-name.jdx}.jdx">Name of the molecule</a></li>
      ...
    </ul>
  </dd>
</dl>
```
Due to the loading of these by XMLHttpRequest,
this script could work only on server (local or distant).


This project is produced within the framework of a part of the COSA research group, which studies relation between art and science.
