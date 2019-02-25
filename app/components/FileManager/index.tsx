import * as React from 'react'
import styled from 'styled-components'
import { FileManager, FileNavigator } from '@eddiewang/react-filemanager'
import ReactPlayer from 'react-player'
import connectorNodeV1 from 'sia-opus-connector'
import { Modal } from 'antd'
import { Box } from 'components/atoms'
import { shell } from 'electron'
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
  uploadHandler = () => {
    const paths = dialog.showOpenDialog({
      properties: ['openFile']
    })
    connectorNodeV1.emitter.emit('uploadpath', paths)
  }
  downloadHandler = (filename: string) => {
    const paths = dialog.showSaveDialog({
      title: 'Save File As',
      defaultPath: filename
    })
    connectorNodeV1.emitter.emit('downloadpath', paths)
  }
  // openHandler = (filename: string) => {
  //   shell.openItem('')
  // }
  componentWillMount() {
    connectorNodeV1.emitter.on('uploadrequestpath', this.uploadHandler)
    connectorNodeV1.emitter.on('downloadrequestpath', this.downloadHandler)
    // connectorNodeV1.emitter.on('openfile', this.openHandler)
  }
  componentWillUnmount() {
    connectorNodeV1.emitter.removeListener('uploadrequestpath', this.uploadHandler)
    connectorNodeV1.emitter.removeListener('downloadrequestpath', this.downloadHandler)
  }
  render() {
    return (
      <div style={{ height: '500px' }}>
        {/* <Modal visible width="680px">
          <Box>
            <ReactPlayer width="640px" url="https://www.youtube.com/watch?v=WQqVny3MKdg" playing />
          </Box>
        </Modal> */}
        <ThemedManager>
          <FileNavigator
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
