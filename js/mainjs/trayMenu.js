import { Menu } from 'electron'

export default function (window) {
  // Template for SiaPrime-UI tray menu.
  const menutemplate = [
    {
      label: 'Show SiaPrime',
      click: () => window.show()
    },
    { type: 'separator' },
    {
      label: 'Hide SiaPrime',
      click: () => window.hide()
    },
    { type: 'separator' },
    {
      label: 'Quit SiaPrime',
      click: () => {
        window.webContents.send('quit')
      }
    }
  ]

  return Menu.buildFromTemplate(menutemplate)
}
