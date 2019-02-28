import * as React from 'react'
import Transition, { TransitionProps } from 'react-transition-group/Transition'
import { TimelineMax, TweenLite, TweenMax, Expo, Linear, Elastic } from 'gsap'

export const TransitionFade = ({ children, ...props }) => {
  return (
    <Transition
      {...props}
      appear
      timeout={10000}
      mountOnEnter
      unmountOnExit
      addEndListener={(n, done) => {
        if (props.in) {
          TweenMax.killTweensOf(n)
          TweenMax.fromTo(
            n,
            2,
            { force3D: true, opacity: 0, transform: 'translateY(-100%)' },
            {
              force3D: true,
              opacity: 1,
              transform: 'translateY(0)',
              onComplete: done,
              ease: Expo.easeOut
            }
          )
        } else {
          TweenMax.killTweensOf(n)
          TweenMax.to(n, 2, {
            force3D: true,
            opacity: 0,
            transform: 'translateY(100%)',
            onComplete: done,
            ease: Expo.easeOut
          })
        }
      }}
    >
      {children}
    </Transition>
  )
}
