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
If you ar familiar with [Pug](https://pugjs.org/api/getting-started.html) and [Gulp](https://gulpjs.com) you can also link a new file with editing
dev/views/index.pug and add an entry in the array named `moleculeDataFile` like below (you have to load every dependencies with `npm install --save-dev`)

```javascript

  var moleculeDataFile = [
    {
      title: 'Name of the molecule',
      file: 'file_name.jdx'
    },
    ...
  ];
```

Then you have to build the html files with running `gulp views`.

--------

### Dependencies

Spectrum vizualisation (area chart) is made with [D3.js v4](https://github.com/d3/d3).

Audio synthesis with [Tone.js](https://github.com/Tonejs/Tone.js).

Others features 'll come asap...
Due to the loading of these by XMLHttpRequest,
this script could work only on server (local or distant).


--------


### The purpose of this work

This project is produced within the framework of a part of the COSA research group, which studies relation between art and science.


--------

### Build with / Thanks
<a href="https://github.com/Tonejs/Tone.js"><img src="https://avatars0.githubusercontent.com/u/11019186?s=400&v=4" width="120"></a>
&nbsp; &nbsp; <a href="https://github.com/d3/d3"><img src="https://avatars3.githubusercontent.com/u/1562726?s=400&v=4" width="120"></a>
&nbsp; &nbsp; <a href="https://github.com/processing/p5.js"><img src="https://p5js.org/assets/img/p5js.svg" width="200"></a>
&nbsp; &nbsp; <a href="https://github.com/gulpjs/gulp"><img src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png" width="90"></a>
&nbsp; &nbsp; <a href="https://github.com/sass/sass"><img src="http://sass-lang.com/assets/img/styleguide/color-1c4aab2b.png" width="160"></a>
&nbsp; &nbsp; <a href="https://github.com/pugjs/pug"><img src="https://camo.githubusercontent.com/a43de8ca816e78b1c2666f7696f449b2eeddbeca/68747470733a2f2f63646e2e7261776769742e636f6d2f7075676a732f7075672d6c6f676f2f656563343336636565386664396431373236643738333963626539396431663639343639326330632f5356472f7075672d66696e616c2d6c6f676f2d5f2d636f6c6f75722d3132382e737667" width="160"></a>
