# BoilingKraken

Open [https://ymik.github.io/BoilingKraken/](https://ymik.github.io/BoilingKraken/) to see an example of a progress bar.

## Basic usage

```javascript
import {boilingKraken} from '/BoilingKraken/src/BoilingKraken.js'
let boiler = boilingKraken(
  bindToElement, // HTMLElement to bind, ad example document.querySelector('div.progress')
  yourConfiguration // or skip for default configuration
)
boiler.setProgress(0) // set progress to 0%
boiler.setProgress(50) // set progress to 50%
boiler.setProgress(100) // set progress to 100%
```
## Configurator

Use `/example/configurator.html` to create a new configuration.
You can skip any parameter, it will be replaced with the default value.

### Default configuration:
```javascript
{
  numOfTentacles: 10,
  startKrakenRadius: 10,
  maxTentacleCastPercent: 10, // max increment out from inner circle for a tentacle in percents of base radius
  tension: 1, // spline smoothing

  // animations & transitions configuration
  maxFPS: 120, // max frames per second for animation
  minGrowthSpeed: 75, // min speed for one tentacle growth transition in % of 1 second
  maxGrowthSpeed: 94, // max speed for one tentacle growth transition in % of 1 second
  minRotationSpeed: 75, // min speed for one tentacle rotation transition in % of 1 second
  maxRotationSpeed: 150, // max speed for one tentacle rotation transition in % of 1 second
  baseRotationSpeed: 5, // base speed of rotation animation: how many seconds are assumed for one complete rotation

  // style properties
  color: '#275aff',
  backgroundColor: '#00000010',
  svgOverlay: '<circle cx="100" cy="100" r="45" stroke-width="4" stroke="#fff" fill="#00000000" />'
    + '<line x1="85" y1="85" x2="115" y2="115" stroke-width="4" stroke="#fff" />'
    + '<line x1="115" y1="85" x2="85" y2="115" stroke-width="4" stroke="#fff" />'
    + '<circle cx="100" cy="100" r="100" fill="#00000000" style="cursor: pointer" />',
}
```
### SVG overlay

You can add multiple SVG nodes as an overlay for the progress bar.
Here's an example of the default SVG overlay for **BoilingKraken**:
```SVG
<circle cx="100" cy="100" r="45" stroke-width="4" stroke="#fff" fill="#00000000" />
<line x1="85" y1="85" x2="115" y2="115" stroke-width="4" stroke="#fff" />
<line x1="115" y1="85" x2="85" y2="115" stroke-width="4" stroke="#fff" />
<circle cx="100" cy="100" r="100" fill="#00000000" style="cursor: pointer" />
```

## Dependencies
All dependency libraries are placed in `/lib`
* There is only one dependency for `BoilingKraken` - library [`@georgedoescode/spline`](https://github.com/georgedoescode/splinejs);
* In addition, **Configurator** `/example/configurator.html` uses some libraries from [`@codemirror`](https://codemirror.net) project.