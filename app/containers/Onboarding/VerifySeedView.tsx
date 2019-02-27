import { WalletActions } from 'actions'
import { Button, Steps, Input, Icon, AutoComplete } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import {
  Box,
  Text,
  Card,
  DragContiner,
  ButtonWithAdornment,
  StyledAutoComplete
} from 'components/atoms'
import { SeedForm } from 'components/Forms'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { IndexState } from 'reducers'
import { WalletRootReducer } from 'reducers/wallet'
import { selectSeedState } from 'selectors'
import { Grid } from 'components/atoms/Grid'
import { Flex } from 'components/atoms/Flex'
import { mnemonics } from './seedlist'

export const VerifySeedView = ({ seed, setAllValid }) => {
  const seedlist = seed.split(' ')
  const remainder = 9
  const indicesToCheck = seedlist
    .map((_, i) => (i % remainder === 0 ? i : null))
    .filter(x => typeof x === 'number')

  const { initialSeedState, validationState } = React.useMemo(() => {
    let mappedInitialState = {}
    let validationArray: any = []

    for (let x = 0, y = seedlist.length; x < y; x++) {
      const isFiltered = indicesToCheck.includes(x)
      mappedInitialState[x] = isFiltered ? '' : seedlist[x]
      validationArray.push(isFiltered ? false : true)
    }
    return { initialSeedState: mappedInitialState, validationState: validationArray }
  }, [seed])

  const [seedInputs, setSeedInput] = React.useState(initialSeedState)
  const [validation, setValidation] = React.useState(validationState)

  React.useEffect(() => {
    let newValidationArray: any = []
    for (let x = 0, y = seedlist.length; x < y; x++) {
      const isMatch = seedlist[x] === seedInputs[x]
      newValidationArray.push(isMatch)
    }
    // set validation for parent
    if (newValidationArray.every(x => x)) {
      setAllValid(true)
    } else {
      setAllValid(false)
    }

    setValidation(newValidationArray)
  }, [seedInputs])

  return (
    <Box>
      <Card mb={4}>
        <Flex alignItems="center">
          <Box mx={4}>
            <svg height={50} width={50} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <title>filter check</title>
              <g fill="#32d66a" stroke="none">
                <path d="M14,19H2a1,1,0,0,0,0,2H14a1,1,0,0,0,0-2Z" fill="#32d66a" />
                <path d="M14,27H2a1,1,0,0,0,0,2H14a1,1,0,0,0,0-2Z" fill="#32d66a" />
                <path d="M30,11H2a1,1,0,0,0,0,2H30a1,1,0,0,0,0-2Z" fill="#32d66a" />
                <path d="M2,5H30a1,1,0,0,0,0-2H2A1,1,0,0,0,2,5Z" fill="#32d66a" />
                <path d="M25,17a7,7,0,1,0,7,7A7.008,7.008,0,0,0,25,17Zm-.293,9.707a1,1,0,0,1-1.414,0L20.586,24,22,22.586l2,2,4-4L29.414,22Z" />
              </g>
            </svg>
          </Box>
          <Box>
            <Text fontSize={2}>
              Let's verify your seed. <br />
              We've removed a few random seed words from the seed file. Enter them back in to
              confirm your seed is accurate.
            </Text>
          </Box>
        </Flex>
      </Card>
      <Grid gridTemplateColumns="repeat(6, 1fr)" gridGap={3}>
        {seedlist.map((v, i) => {
          const hideWord = i % remainder === 0
          return (
            <Box>
              {hideWord ? (
                <StyledAutoComplete
                  error={!validation[i]}
                  dataSource={
                    seedInputs[i].length > 1 && mnemonics.filter(x => x.includes(seedInputs[i]))
                  }
                  value={seedInputs[i]}
                  filterOption={false}
                  onChange={v => setSeedInput({ ...seedInputs, [i]: v })}
                />
              ) : (
                <Input disabled prefix={<Text color="silver">{i}</Text>} value={v} />
              )}
            </Box>
          )
        })}
      </Grid>
    </Box>
  )
}
