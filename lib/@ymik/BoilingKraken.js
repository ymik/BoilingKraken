//import {spline} from '@georgedoescode/spline'
import {spline} from '../../lib/@georgedoescode/spline/spline.js'

export const boilingKraken = (elm, configuration) => {
  // configuration
  let defaultConfiguration = {
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
    svgOverlay: `<circle cx="100" cy="100" r="45" stroke-width="4" stroke="#fff" fill="#00000000" />`
      + `<line x1="85" y1="85" x2="115" y2="115" stroke-width="4" stroke="#fff" />`
      + `<line x1="115" y1="85" x2="85" y2="115" stroke-width="4" stroke="#fff" />`
      + `<circle cx="100" cy="100" r="100" fill="#00000000" style="cursor: pointer" />`
  }
  // global constants
  const fullAngle = Math.PI * 2
  const cx = 100
  const cy = 100
  // state variables
  let krakenRotation, krakenRadius, tentacles, maxTentacleCast
  let config = {}
  // initialization
  const applyConfiguration = (configuration) => {
    if (!configuration) {
      applyConfiguration(defaultConfiguration)
      return
    }
    const chooseOne = (key, scale) => {
      config[key] = configuration[key] ? configuration[key] : defaultConfiguration[key]
      if (scale) config[key] *= scale
    }
    chooseOne('numOfTentacles')
    chooseOne('startKrakenRadius')
    chooseOne('maxTentacleCastPercent')
    chooseOne('tension')
    chooseOne('maxFPS')
    chooseOne('minGrowthSpeed', config.maxFPS / 100)
    chooseOne('maxGrowthSpeed', config.maxFPS / 100)
    chooseOne('minRotationSpeed', config.maxFPS / 100)
    chooseOne('maxRotationSpeed', config.maxFPS / 100)
    chooseOne('baseRotationSpeed', config.maxFPS)
    chooseOne('color')
    chooseOne('backgroundColor')
    chooseOne('svgOverlay')
    krakenRotation = 0
    krakenRadius = config.startKrakenRadius
    maxTentacleCast = config.maxTentacleCastPercent * krakenRadius / 100
    tentacles = (() => {
      let tentacles = []
      maxTentacleCast = config.maxTentacleCastPercent * krakenRadius / 100
      const time = new Date().getTime()
      const sectorAngle = Math.PI / config.numOfTentacles
      const sectorDiffAngle = sectorAngle * 3 / 7
      for (let i = 0; i < config.numOfTentacles; i++) {
        const angle = 2 * sectorAngle * i
        tentacles[tentacles.length] = {
          grow: {from: maxTentacleCast, to: maxTentacleCast, endTime: time},
          rotate: {from: angle, to: angle, endTime: time},
          sector: {from: angle - sectorDiffAngle, to: angle + sectorDiffAngle},
        }
      }
      return tentacles
    })()
  }
  applyConfiguration(configuration)
  // spline path builder
  const pointsToPath = () => {
    let points = []
    for (let tentacle of tentacles) {
      const angle = krakenRotation + tentacle.rotate.from
      points[points.length] = [
        cx + tentacle.grow.from * Math.cos(angle),
        cy + tentacle.grow.from * Math.sin(angle)
      ]
    }
    return spline(points, config.tension, true)
  }
  // SVG definition
  const krakenId = Math.floor(Math.random() * 0xffffffffffffff)
  elm.innerHTML = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="boilingKraken">`
    + `<circle cx="100" cy="100" r="100" fill="${config.backgroundColor}" />` //#f1f1f1
    + `<clipPath id="boilerClip${krakenId}"><circle cx="100" cy="100" r="100"/></clipPath>`
    + `<path id="kraken${krakenId}" d="${pointsToPath()}" fill="${config.color}" clip-path="url(#boilerClip${krakenId})" />` //#275aff
    + config.svgOverlay
    + `</svg>`;
  const kraken = elm.querySelector('svg.boilingKraken').querySelector(`#kraken${krakenId}`);
  // animations
  (() => {
    const targetFrameTime = 1000 / config.maxFPS
    const isTransitionFinished = (transition, currentTime) => (transition.endTime < currentTime)
    const newTransition = (d1, d2, minSpeed, maxSpeed, time, transition) => {
      const target = Math.abs(d1) > Math.abs(d2) ? d1 : d2
      const transitionFrames = minSpeed + Math.random() * (maxSpeed - minSpeed)
      transition.to = transition.from + target
      transition.endTime = time + targetFrameTime * transitionFrames
    }
    const transit = (transition, currentTime) => {
      const framesLeft = (transition.endTime - currentTime) / targetFrameTime
      if (framesLeft <= 1) transition.from = transition.to
      else transition.from += (transition.to - transition.from) / framesLeft
    }
    const castAngle = (angle) => {
      const a = angle % fullAngle
      return a < 0 ? a + fullAngle : a
    }
    const anglesDiff = (angle1, angle2) => {
      const a1 = castAngle(angle1)
      const a2 = castAngle(angle2)
      if (a1 < a2) {
        const d1 = a2 - a1
        const d2 = a1 + fullAngle - a2
        return d1 < d2 ? d1 : -d2
      } else {
        const d1 = a1 - a2
        const d2 = a2 + fullAngle - a1
        return d1 < d2 ? -d1 : d2
      }
    }
    let tick = new Date().getTime()
    const animate = () => {
      const currentTime = new Date().getTime()
      maxTentacleCast = config.maxTentacleCastPercent * krakenRadius / 100
      krakenRotation = castAngle(krakenRotation + (fullAngle * (currentTime - tick) / 1000 / config.baseRotationSpeed))
      tick = currentTime
      for (let tentacle of tentacles) {
        if (isTransitionFinished(tentacle.rotate, currentTime)) newTransition(
          anglesDiff(tentacle.rotate.from, tentacle.sector.from),
          anglesDiff(tentacle.rotate.from, tentacle.sector.to),
          config.minRotationSpeed, config.maxRotationSpeed,
          currentTime, tentacle.rotate
        )
        else transit(tentacle.rotate, currentTime)
        if (isTransitionFinished(tentacle.grow, currentTime)) newTransition(
          krakenRadius - tentacle.grow.from,
          krakenRadius + maxTentacleCast - tentacle.grow.from,
          config.minGrowthSpeed, config.maxGrowthSpeed,
          currentTime, tentacle.grow
        )
        else transit(tentacle.grow, currentTime)
      }
      kraken.setAttribute("d", pointsToPath());
      requestAnimationFrame(animate);
    }
    animate()
  })()
  // control function
  return {
    applyConfiguration: applyConfiguration,
    setProgress: (progress) => {
      krakenRadius = maxTentacleCast + progress
    },
  }
}

export default {boilingKraken}