import PropTypes from 'prop-types'
import React from 'react'

const SendButton = ({ currencytype, onClick }) => (
  <div onClick={onClick} className='wallet-button send-button'>
    <i className='fa fa-paper-plane fa-2x' />
    <span>
      Send {currencytype === 'Siacoin' ? 'SiaPrimeCoin' : 'SiaPrimeFund'}
    </span>
  </div>
)

SendButton.propTypes = {
  currencytype: PropTypes.string.isRequired
}

export default SendButton
