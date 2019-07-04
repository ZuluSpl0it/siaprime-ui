const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron')
const windowStateKeeper = require('electron-window-state')
// const { shutdown, initSiad } = require('./utils/siadProcess')

let menu
let template
let mainWindow = null

// if (process.env.NODE_ENV === 'production') {
//   const sourceMapSupport = require('source-map-support') // eslint-disable-line
//   sourceMapSupport.install()
// }

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')() // eslint-disable-line global-require
  const path = require('path') // eslint-disable-line
  const p = path.join(__dirname, '..', 'app', 'node_modules') // eslint-disable-line
  require('module').globalPaths.push(p) // eslint-disable-line
}

app.on('window-all-closed', () => {
  app.quit()
})

// app.on('before-quit', () => {
//   console.log('err ello')
// })

const installExtensions = () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer') // eslint-disable-line global-require
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload)))
  }

  return Promise.resolve([])
}

const windowConfig =
  process.platform === 'darwin'
    ? {
        frame: false,
        titleBarStyle: 'hiddenInset'
      }
    : {}

app.on('ready', () =>
  installExtensions().then(() => {
    let mainWindowState = windowStateKeeper({
      defaultWidth: 1200,
      defaultHeight: 780
    })
    const browserWindowConfig = Object.assign({}, windowConfig, {
      show: false,
      width: mainWindowState.width,
      height: mainWindowState.height,
      x: mainWindowState.x,
      y: mainWindowState.y,
      autoHideMenuBar: true,
      title: 'SiaPrime Wallet'
    })
    mainWindow = new BrowserWindow(browserWindowConfig)
    mainWindowState.manage(mainWindow)

    mainWindow.loadURL(`file://${__dirname}/app.html`)

    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.show()
      mainWindow.focus()
    })

    if (process.env.NODE_ENV === 'development') {
      mainWindow.openDevTools()
      mainWindow.webContents.on('context-menu', (e, props) => {
        const { x, y } = props

        Menu.buildFromTemplate([
          {
            label: 'Inspect element',
            click() {
              mainWindow.inspectElement(x, y)
            }
          }
        ]).popup(mainWindow)
      })
    }

    if (process.platform === 'darwin') {
      template = [
        {
          label: 'SiaPrime-UI',
          submenu: [
            {
              label: 'About SiaPrime-UI',
              selector: 'orderFrontStandardAboutPanel:'
            },
            {
              type: 'separator'
            },
            {
              label: 'Services',
              submenu: []
            },
            {
              type: 'separator'
            },
            {
              label: 'Hide ElectronReact',
              accelerator: 'Command+H',
              selector: 'hide:'
            },
            {
              label: 'Hide Others',
              accelerator: 'Command+Shift+H',
              selector: 'hideOtherApplications:'
            },
            {
              label: 'Show All',
              selector: 'unhideAllApplications:'
            },
            {
              type: 'separator'
            },
            {
              label: 'Quit',
              accelerator: 'Command+Q',
              click() {
                app.quit()
              }
            }
          ]
        },
        {
          label: 'Edit',
          submenu: [
            {
              label: 'Undo',
              accelerator: 'Command+Z',
              selector: 'undo:'
            },
            {
              label: 'Redo',
              accelerator: 'Shift+Command+Z',
              selector: 'redo:'
            },
            {
              type: 'separator'
            },
            {
              label: 'Cut',
              accelerator: 'Command+X',
              selector: 'cut:'
            },
            {
              label: 'Copy',
              accelerator: 'Command+C',
              selector: 'copy:'
            },
            {
              label: 'Paste',
              accelerator: 'Command+V',
              selector: 'paste:'
            },
            {
              label: 'Select All',
              accelerator: 'Command+A',
              selector: 'selectAll:'
            }
          ]
        },
        {
          label: 'View',
          submenu:
            process.env.NODE_ENV === 'development'
              ? [
                  {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click() {
                      mainWindow.webContents.reload()
                    }
                  },
                  {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click() {
                      mainWindow.setFullScreen(!mainWindow.isFullScreen())
                    }
                  }
                ]
              : [
                  {
                    label: 'Toggle Developer Tools',
                    accelerator: 'Command+Shift+I',
                    click() {
                      mainWindow.toggleDevTools()
                    }
                  },
                  {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click() {
                      mainWindow.setFullScreen(!mainWindow.isFullScreen())
                    }
                  }
                ]
        },
        {
          label: 'Window',
          submenu: [
            {
              label: 'Minimize',
              accelerator: 'Command+M',
              selector: 'performMiniaturize:'
            },
            {
              label: 'Close',
              accelerator: 'Command+W',
              selector: 'performClose:'
            },
            {
              type: 'separator'
            },
            {
              label: 'Bring All to Front',
              selector: 'arrangeInFront:'
            }
          ]
        },
        {
          label: 'Help',
          submenu: [
            {
              label: 'Learn More',
              click() {
                shell.openExternal('http://electron.atom.io')
              }
            },
            {
              label: 'Documentation',
              click() {
                shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme')
              }
            },
            {
              label: 'Community Discussions',
              click() {
                shell.openExternal('https://discuss.atom.io/c/electron')
              }
            },
            {
              label: 'Search Issues',
              click() {
                shell.openExternal('https://github.com/atom/electron/issues')
              }
            }
          ]
        }
      ]

      menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)
    } else {
      template = [
        {
          label: '&File',
          submenu: [
            {
              label: '&Open',
              accelerator: 'Ctrl+O'
            },
            {
              label: '&Close',
              accelerator: 'Ctrl+W',
              click() {
                mainWindow.close()
              }
            }
          ]
        },
        {
          label: '&View',
          submenu:
            process.env.NODE_ENV === 'development'
              ? [
                  {
                    label: '&Reload',
                    accelerator: 'Ctrl+R',
                    click() {
                      mainWindow.webContents.reload()
                    }
                  },
                  {
                    label: 'Toggle &Full Screen',
                    accelerator: 'F11',
                    click() {
                      mainWindow.setFullScreen(!mainWindow.isFullScreen())
                    }
                  }
                ]
              : [
                  {
                    label: 'Toggle &Full Screen',
                    accelerator: 'F11',
                    click() {
                      mainWindow.setFullScreen(!mainWindow.isFullScreen())
                    }
                  },
                  {
                    label: 'Toggle &Developer Tools',
                    accelerator: 'Alt+Ctrl+I',
                    click() {
                      mainWindow.toggleDevTools()
                    }
                  }
                ]
        },
        {
          label: 'Help',
          submenu: [
            {
              label: 'Learn More',
              click() {
                shell.openExternal('http://electron.atom.io')
              }
            },
            {
              label: 'Documentation',
              click() {
                shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme')
              }
            },
            {
              label: 'Community Discussions',
              click() {
                shell.openExternal('https://discuss.atom.io/c/electron')
              }
            },
            {
              label: 'Search Issues',
              click() {
                shell.openExternal('https://github.com/atom/electron/issues')
              }
            }
          ]
        }
      ]
      menu = Menu.buildFromTemplate(template)
      mainWindow.setMenu(menu)
    }
  })
)
