const { app, BrowserWindow, Menu, shell, Tray } = require('electron')
const windowStateKeeper = require('electron-window-state')
const defaultConfig = require('./config')
const path = require('path')

let menu
let template
let mainWindow = null

// Useful dynamic env constants
const isDev = process.env.NODE_ENV === 'development'
const isDarwin = process.platform === 'darwin'
const isWindows = process.platform === 'win32'

if (isDev) {
  require('electron-debug')() // eslint-disable-line global-require
  const p = path.join(__dirname, '..', 'app', 'node_modules') // eslint-disable-line
  require('module').globalPaths.push(p) // eslint-disable-line
}

app.on('window-all-closed', () => {
  app.quit()
})

const installExtensions = () => {
  if (isDev) {
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
    // Keep the window state for app relaunch
    let mainWindowState = windowStateKeeper({
      defaultWidth: 1200,
      defaultHeight: 780
    })
    // Setup the browser window and create the app
    const browserWindowConfig = Object.assign({}, windowConfig, {
      show: false,
      width: mainWindowState.width,
      height: mainWindowState.height,
      x: mainWindowState.x,
      y: mainWindowState.y,
      autoHideMenuBar: true,
      title: 'Sia Wallet'
    })
    mainWindow = new BrowserWindow(browserWindowConfig)
    mainWindowState.manage(mainWindow)

    // Setup close to tray settings for both minimize and close events.
    mainWindow.on('minimize', e => {
      app.dock.hide()
      mainWindow.hide()
      return false
    })

    mainWindow.on('close', e => {
      if (!mainWindow.isQuitting) {
        e.preventDefault()
        app.dock.hide()
        mainWindow.hide()
      }
      return false
    })

    mainWindow.loadURL(`file://${__dirname}/app.html`)

    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.show()
      mainWindow.focus()
    })

    const iconName = isWindows ? 'trayWin.png' : 'trayTemplate.png'
    const iconPath = isDev
      ? path.join(process.cwd(), 'resources', iconName)
      : path.join(app.getAppPath(), 'resources', iconName)
    const appIcon = new Tray(iconPath)
    const trayContextMenu = Menu.buildFromTemplate([
      {
        label: 'Show App',
        click: function() {
          app.dock.show()
          mainWindow.show()
        }
      },
      {
        label: 'Quit',
        click: function() {
          mainWindow.isQuitting = true
          app.quit()
        }
      }
    ])

    appIcon.setToolTip('Sia-UI syncs the daemon in the background.')
    appIcon.setContextMenu(trayContextMenu)
    mainWindow.tray = appIcon

    if (isDev || defaultConfig.debugMode) {
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

    if (isDarwin) {
      template = [
        {
          label: 'Sia-UI',
          submenu: [
            {
              label: 'About Sia-UI',
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
          submenu: isDev
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
          submenu: isDev
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
