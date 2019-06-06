import * as bytes from 'bytes'

// converts byte amount to GB. returns a string without the unit 'GB'.
export const bytesToGBString = (b: number) => {
  const GBString = bytes(b, {
    unit: 'GB'
  })
  return parseFloat(GBString).toString()
}
