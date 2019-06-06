import * as React from 'react'
import styled from 'styled-components'
import { FileManager, FileNavigator } from '../vendor/react-filemanager/client'
import connectorNodeV1 from 'sia-opus-connector'
import { notification } from 'antd'
const { dialog } = require('electron').remote

const apiOptions = {
  ...connectorNodeV1.apiOptions,
  siaClientConfig: {}
}

const ThemedManager = styled(FileManager)`
  border: 0 !important;
  border-radius: 4px !important;
  box-shadow: ${(props: any) => props.theme.boxShadow[0]} !important;
  .oc-fm--list-view__row--selected {
    position: relative;
    background-color: ${props => props.theme.colors['light-gray']} !important;
    color: ${props => props.theme.colors['mid-gray']} !important;
    border-bottom-color: transparent;
  }
`

export default class fManager extends React.Component {
  poll: any = null
  uploadHandler = uploadType => {
    let paths: any = []
    if (uploadType === 'file') {
      paths = dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
      })
    } else {
      paths = dialog.showOpenDialog({
        properties: ['openDirectory']
      })
    }
    connectorNodeV1.emitter.emit('uploadpath', paths)
  }
  downloadHandler = (filename: string) => {
    const paths = dialog.showSaveDialog({
      title: 'Save File As',
      defaultPath: filename
    })
    connectorNodeV1.emitter.emit('downloadpath', paths)
  }
  componentWillMount() {
    connectorNodeV1.emitter.on('uploadrequestpath', this.uploadHandler)
    connectorNodeV1.emitter.on('downloadrequestpath', this.downloadHandler)
    connectorNodeV1.emitter.on('notification', this.notificationHandler)
    setTimeout(() => {
      connectorNodeV1.emitter.emit('startuploadpoll')
      connectorNodeV1.emitter.emit('startdownloadpoll')
    }, 3000)
    this.poll = setInterval(() => {
      connectorNodeV1.emitter.emit('startuploadpoll')
      connectorNodeV1.emitter.emit('startdownloadpoll')
    }, 10000)
  }
  componentWillUnmount() {
    connectorNodeV1.emitter.removeListener('uploadrequestpath', this.uploadHandler)
    connectorNodeV1.emitter.removeListener('downloadrequestpath', this.downloadHandler)
    connectorNodeV1.emitter.removeListener('notification', this.notificationHandler)
    connectorNodeV1.emitter.removeAllListeners()
    clearInterval(this.poll)
  }
  notificationHandler = description => {
    const descriptionString = '' + description
    notification.open({
      message: 'File Manager',
      description: description.error ? description.error.message : descriptionString
    })
  }
  render() {
    return (
      <div style={{ height: 'calc(100vh - 300px)' }}>
        <ThemedManager>
          <FileNavigator
            // this passes the filenav ref back to the parent component so the api
            // is exposed. kind of an anti-pattern, but this will have to do for
            // now.
            ref={this.props.getFileNavRef}
            id="filemanager-1"
            initialResourceId="root"
            api={connectorNodeV1.api}
            apiOptions={apiOptions}
            capabilities={connectorNodeV1.capabilities}
            listViewLayout={connectorNodeV1.listViewLayout}
            viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
          />
        </ThemedManager>
      </div>
    )
  }
}
