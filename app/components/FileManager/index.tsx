import * as React from 'react'
import styled from 'styled-components'
import { FileManager, FileNavigator } from '@opuscapita/react-filemanager'
import connectorNodeV1 from 'sia-opus-connector'
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
    background-color: ${props => props.theme.colors['silver']} !important;
    color: #fff;
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
  componentWillMount() {
    connectorNodeV1.emitter.on('uploadrequestpath', this.uploadHandler)
    connectorNodeV1.emitter.on('downloadrequestpath', this.downloadHandler)
  }
  componentWillUnmount() {
    connectorNodeV1.emitter.removeListener('uploadrequestpath', this.uploadHandler)
    connectorNodeV1.emitter.removeListener('downloadrequestpath', this.downloadHandler)
  }
  render() {
    return (
      <div style={{ height: '450px' }}>
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
