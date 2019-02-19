import { Col, InputNumber, Row, Slider } from 'antd'
import { Text } from 'components/atoms'
import * as React from 'react'
import { Flex } from 'rebass'

const bytes = require('bytes')

interface Props {
  min: number
  max: number
}

class IntegerStep extends React.Component<Props> {
  state = {
    inputValue: this.props.min
  }

  onChange = (value: any) => {
    this.setState({
      inputValue: value
    })
  }

  getBytes = () => bytes.parse(`${this.state.inputValue}mb`)

  render() {
    const { inputValue } = this.state
    const { min, max } = this.props
    return (
      <Row>
        <Col span={12}>
          <Slider
            min={min}
            max={max}
            onChange={this.onChange}
            value={typeof inputValue === 'number' ? inputValue : 0}
          />
        </Col>
        <Col span={6}>
          <InputNumber
            min={min}
            max={max}
            step={1}
            style={{ marginLeft: 16 }}
            value={inputValue}
            onChange={this.onChange}
          />
        </Col>
        <Col span={6}>
          <Flex ml={2} flexDirection="column">
            <Text color="mid-gray" fontSize={0}>
              {inputValue} MB
            </Text>
            <Text>{bytes.format(bytes.parse(`${inputValue}mb`), { unitSperator: ' ' })}</Text>
          </Flex>
        </Col>
      </Row>
    )
  }
}

export default IntegerStep
