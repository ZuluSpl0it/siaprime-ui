import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import BalanceInfo from '../../plugins/Wallet/js/components/balanceinfo.js'

describe('wallet balance info component', () => {
	it('renders balance info', () => {
		const component= shallow(<BalanceInfo synced confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" siacoinclaimbalance="0" />)
		expect(component.find('.balance-info').children()).to.have.length(2)
		expect(component.find('.balance-info').children().first().text()).to.contain('Confirmed Balance: 10 SCP')
		expect(component.find('.balance-info').children().last().text()).to.contain('Unconfirmed Delta: 1 SCP')
	})
	it('renders siafund balance when it is non-zero', () => {
		const component = shallow(<BalanceInfo synced confirmedbalance="10" unconfirmedbalance="1" siafundbalance="1" siacoinclaimbalance="0" />)
		expect(component.find('.balance-info').children()).to.have.length(3)
		expect(component.find('.balance-info').children().last().text()).to.contain('Siaprimefund Balance: 1 SPF')
	})
	it('renders a warning when not synced', () => {
		const component = shallow(<BalanceInfo synced={false} confirmedbalance="10" unconfirmedbalance="1" siafundbalance="0" siacoinclaimbalance="0" />)
		expect(component.find('.balance-info').children()).to.have.length(3)
		expect(component.find('.balance-info').children().last().text()).to.contain('Your wallet is not synced, balances are not final.')
	})
})
