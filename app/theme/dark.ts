import { theme } from './index'
export const dark = Object.assign({}, theme, {
  colors: {
    black: '#000',
    'near-black': '#fff',
    'dark-gray': '#eee',
    'mid-gray': '#eee',
    gray: ' #777',
    silver: '#999',
    'light-silver': '#aaa',
    'moon-gray': '#ccc',
    'light-gray': '#333',
    'near-white': '#202124',
    'sia-green': '#1ED660',
    white: '#292C2F',
    transparent: 'transparent',
    blacks: [
      'rgba(0,0,0,.0125)',
      'rgba(0,0,0,.025)',
      'rgba(0,0,0,.05)',
      'rgba(0,0,0,.1)',
      'rgba(0,0,0,.2)',
      'rgba(0,0,0,.3)',
      'rgba(0,0,0,.4)',
      'rgba(0,0,0,.5)',
      'rgba(0,0,0,.6)',
      'rgba(0,0,0,.7)',
      'rgba(0,0,0,.8)',
      'rgba(0,0,0,.9)'
    ],
    whites: [
      'rgba(255,255,255,.0125)',
      'rgba(255,255,255,.025)',
      'rgba(255,255,255,.05)',
      'rgba(255,255,255,.1)',
      'rgba(255,255,255,.2)',
      'rgba(255,255,255,.3)',
      'rgba(255,255,255,.4)',
      'rgba(255,255,255,.5)',
      'rgba(255,255,255,.6)',
      'rgba(255,255,255,.7)',
      'rgba(255,255,255,.8)',
      'rgba(255,255,255,.9)'
    ],
    // ... and so on
    // input
    'input-bg': 'rgba(0,0,0,.5)',
    'input-border': 'rgba(0,0,0,.8)',
    // text
    text: '#fefefe'
  }
})
