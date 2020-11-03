import * as React from 'react'
import Transition, { TransitionProps } from 'react-transition-group/Transition'
import { TimelineMax, TweenLite, TweenMax, Expo, Linear, Power1 } from 'gsap'
import './bonus/DrawSVGPlugin.min.js'

export const SiaLogo = ({ width, height }) => (
  <div>
    <div style={{ width, height }}>
      <svg id="sia-logo" width="100%" height="100%" viewBox="-10 -10 277 277" version="1.1">
        <g id="Sia-Logo" transform="translate(-0.109375, 0.562500)">
          <g transform="translate(0.420058, 0.407811)" strokeWidth="1px" stroke="#7F8C8D">
            <g id="spinner">
              <path
                d="M57.2433086,21.3506107 L61.9234926,27.277593 C81.2437494,14.5648555 104.41953,7.25462637 129.288124,7.53264021 C193.48118,8.24984772 246.18186,59.7949795 248.252467,123.958188 C250.495339,193.470177 193.468388,250.497128 123.956398,248.25255 C59.794043,246.181091 8.24976405,193.479558 7.53255655,129.287355 C7.25539551,104.41876 14.5656246,81.2438331 27.2766565,61.9235763 L21.350527,57.2433923 C8.12013796,77.1256464 0.296521293,100.900947 0.00827380721,126.454343 C-0.780569164,196.36715 54.9364759,254.228142 124.97294,255.807534 C197.902965,257.452591 257.45336,197.902196 255.808303,124.972171 C254.227206,54.9357068 196.366213,-0.781338303 126.454259,0.00835747148 C100.900863,0.296604957 77.1255627,8.12107443 57.2433086,21.3506107 Z"
                id="loop"
              />
              <path
                d="M52.6734757,40.1321517 C52.6734757,47.0586193 47.0586193,52.6734757 40.1321517,52.6734757 C33.205684,52.6734757 27.5908276,47.0586193 27.5908276,40.1321517 C27.5908276,33.205684 33.205684,27.5908276 40.1321517,27.5908276 C47.0586193,27.5908276 52.6734757,33.205684 52.6734757,40.1321517"
                id="dot"
              />
            </g>
            <path
              d="M 128.011719 43.523438 C 117.765625 44.210938 107.976562 47.210938 99.53125 52.257812 C 93.484375 55.867188 87.964844 60.71875 83.34375 66.445312 C 76.1875 75.332031 71.417969 85.507812 69.484375 96.007812 C 68.914062 99.113281 68.625 101.769531 68.425781 105.6875 C 68.015625 113.867188 67.980469 119.296875 68.003906 167.335938 C 68.03125 208.941406 68.039062 210.640625 68.1875 210.867188 C 68.566406 211.417969 67.820312 211.382812 80.265625 211.390625 C 88.671875 211.390625 91.640625 211.363281 91.832031 211.285156 C 92.164062 211.164062 92.382812 210.964844 92.558594 210.632812 C 92.6875 210.394531 92.707031 208.828125 92.707031 192.300781 L 92.707031 174.234375 L 92.890625 173.988281 C 93.292969 173.441406 91.515625 173.492188 115.195312 173.421875 C 127.085938 173.398438 136.964844 173.34375 137.15625 173.320312 C 137.347656 173.292969 138.039062 173.230469 138.6875 173.179688 C 140.742188 173.003906 144.199219 172.378906 147.132812 171.644531 C 158.796875 168.722656 168.960938 162.820312 176.871094 154.378906 C 185.859375 144.796875 191.90625 132.972656 194.066406 120.726562 C 195.730469 111.355469 195.328125 100.960938 192.9375 91.457031 C 189.386719 77.355469 180.703125 64.328125 169.015625 55.609375 C 164.296875 52.085938 158.769531 49.121094 153.246094 47.121094 C 147.570312 45.082031 142.003906 43.941406 135.640625 43.511719 C 134.09375 43.40625 129.613281 43.417969 128.011719 43.523438 Z M 135.1875 69.191406 C 144.679688 70.351562 153.152344 74.90625 159.433594 82.230469 C 162.652344 85.980469 165.53125 91.140625 167.109375 96.007812 C 169.820312 104.34375 169.792969 113.273438 167.046875 121.453125 C 165.410156 126.335938 162.792969 130.921875 159.433594 134.8125 C 158.628906 135.753906 156.816406 137.566406 155.835938 138.429688 C 150.070312 143.480469 143.308594 146.625 136.0625 147.621094 C 133.078125 148.03125 133.421875 148.023438 113.179688 148.023438 L 94.019531 148.023438 L 93.617188 147.820312 C 93.34375 147.691406 93.152344 147.515625 93.003906 147.253906 L 92.792969 146.886719 L 92.792969 126.875 C 92.792969 105.738281 92.785156 106.113281 93.195312 103.027344 C 94.148438 95.851562 96.808594 89.398438 101.046875 83.972656 C 103.082031 81.367188 106.066406 78.480469 108.894531 76.371094 C 114.285156 72.351562 120.890625 69.75 127.226562 69.160156 C 127.777344 69.105469 128.390625 69.046875 128.582031 69.027344 C 129.472656 68.941406 134.066406 69.054688 135.1875 69.191406 Z M 135.1875 69.191406"
              id="center"
            />
          </g>
        </g>
      </svg>
    </div>
  </div>
)

export const TransitionSiaSpinner = ({
  width = 200,
  height = 200,
  ...props
}: Partial<TransitionProps> & any) => {
  return (
    <Transition
      {...props}
      appear
      mountOnEnter
      unmountOnExit
      timeout={10000}
      addEndListener={(n, done) => {
        if (props.in) {
          const t = new TimelineMax()
          const paths = n.querySelectorAll('path')
          const greenFill = n.querySelectorAll('#dot, #center')
          const greyFill = n.querySelectorAll('#loop')
          const spinner = n.querySelectorAll('#spinner')

          const drawPath = TweenMax.fromTo(
            paths,
            2,
            {
              force3D: true,
              drawSVG: '50% 50%',
              opacity: 0,
              fill: 'transparent',
              ease: Linear.easeNone
            },
            { force3D: true, drawSVG: true, opacity: 1 }
          )
          const fadeInFromBottom = TweenMax.from(n, 1, {
            force3D: true,
            transform: 'translateY(100%)',
            opacity: 0
          })
          const removePath = TweenMax.staggerTo(paths, 2, { force3D: true, strokeOpacity: 0 }, 0.1)
          const addGreen = TweenMax.to(greenFill, 1, {
            force3D: true,
            fill: '#2074EE'
          })
          const addBorder = TweenMax.to(greyFill, 2, {
            force3D: true,
            fill: '#2074ee',
            onComplete: done
          })
          const rotateCircle = TweenMax.to(spinner, 1, {
            force3D: true,
            rotation: 360,
            transformOrigin: '50% 50%',
            repeat: -1,
            ease: Linear.easeNone
          })
          t.add([drawPath, fadeInFromBottom]).add([removePath, addGreen, addBorder, rotateCircle])
        } else {
          TweenMax.to(n, 1, {
            force3D: true,
            scale: 0.98,
            opacity: 0,
            transform: 'translateY(100%)',
            ease: Expo.easeOut,
            onComplete: done
          })
        }
      }}
    >
      <SiaLogo width={width} height={height} />
    </Transition>
  )
}

export const TransitionSiaOnlySpin = ({
  width = 200,
  height = 200,
  ...props
}: Partial<TransitionProps> & any) => {
  return (
    <Transition
      {...props}
      appear
      timeout={10000}
      addEndListener={(n, done) => {
        if (props.in) {
          const t = new TimelineMax()
          const paths = n.querySelectorAll('path')
          const greenFill = n.querySelectorAll('#dot, #center')
          const greyFill = n.querySelectorAll('#loop')
          const spinner = n.querySelectorAll('#spinner')

          TweenLite.defaultEase = Expo.easeOut
          const fadeInFromBottom = TweenMax.from(n, 0.5, {
            force3D: true,
            transform: 'translateY(100%)',
            opacity: 0
          })
          const addGreen = TweenMax.to(greenFill, 0.5, { fill: '#2074ee' })
          const addBorder = TweenMax.to(greyFill, 0.5, { fill: '#7F8C8D', onComplete: done })
          const rotateCircle = TweenMax.to(spinner, 1, {
            force3D: true,
            rotation: 360,
            transformOrigin: '50% 50%',
            repeat: -1,
            ease: Linear.easeNone
          })
          t.add([fadeInFromBottom, addGreen, addBorder, rotateCircle])
        } else {
          TweenMax.to(n, 0.5, {
            force3D: true,
            scale: 0.98,
            opacity: 0,
            transform: 'translateY(100%)',
            ease: Expo.easeOut,
            onComplete: done
          })
        }
      }}
    >
      <SiaLogo width={width} height={height} />
    </Transition>
  )
}
