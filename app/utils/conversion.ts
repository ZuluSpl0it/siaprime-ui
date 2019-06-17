import * as bytes from 'bytes'

// converts byte amount to GB. returns a string without the unit 'GB'.
export const bytesToGBString = (b: number) => {
  const GBString = bytes(b, {
    unit: 'GB'
  })
  return parseFloat(GBString).toString()
}

// converts byte amount to TB. returns a string without the unit 'TB'.
export const bytesToTB = (b: number) => {
  const TBString = bytes(b, {
    unit: 'TB'
  })
  return parseFloat(TBString)
}

// converts byte amount to TB. returns a string without the unit 'TB'.
export const bytesToTBString = (b: number) => {
  const TBString = bytes(b, {
    unit: 'TB'
  })
  return parseFloat(TBString).toString()
}

export const BLOCKS_PER_HOUR = 6
export const BLOCKS_PER_DAY = BLOCKS_PER_HOUR * 24
export const BLOCKS_PER_MONTH = 30 * BLOCKS_PER_DAY
