# ![flask](https://raw.githubusercontent.com/nclslbrn/infrared-spectrum-reinterpretation/master/dist/images/favicon-flask.ico "Favicon of the website") Infrared Spectrum Reinterpretation


This project is a tool for reinterpreting, transcoding infrared analysis of various molecules into different medium:
- light sequences
- sounds
- motion keys

Infrared spectrums come from NIST (National Institute of Standards and Technology - U.S. Department of Commerce),
due to a server limitation we have to download files manually from [nist.gov](http://webbook.nist.gov/chemistry/name-ser/)
and put into a folder data/, and put each link into the `<ul>` index.html file like below.

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
If you ar familiar with [Pug](https://pugjs.org/api/getting-started.html) you can also link a new file with editing
dev/views/index.pug and add an entry in the array named `moleculeDataFile` like below
```javascript

  var moleculeDataFile = [
    {
      title: 'Name of the molecule',
      file: 'file_name.jdx'
    },
    ...
  ];
```

Spectrum vizualisation (area chart) is made with [D3.js v4](https://github.com/d3/d3).

Audio synthesis with [Tone.js](https://github.com/Tonejs/Tone.js).

Others features 'll come asap...
Due to the loading of these by XMLHttpRequest,
this script could work only on server (local or distant).

-------

This project is produced within the framework of a part of the COSA research group, which studies relation between art and science.
