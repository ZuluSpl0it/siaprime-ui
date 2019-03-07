import { BigNumber } from 'bignumber.js'
import { WalletModel } from 'models'
import { IndexState } from 'reducers'
import { createSelector } from 'reselect'
import { toSiacoins } from 'sia-typescript'
import { computeTxSum, groupTransactionsByDay } from 'utils'

// export const selectGlobalStats = (state: IndexState) => state.dashboard.globalStats

// export const selectPrice = (state: IndexState) => state.dashboard.priceUsd
// export const selectDashboard = (state: IndexState) => state.dashboard

// export const selectDashboardChart = createSelector(selectGlobalStats, gs => {
//   const sorted = gs.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
//   return sorted.slice(-150).map(s => ({
//     date: moment(s.time).format('D'),
//     usdPrice: s.coin_price,
//     btcPrice: s.btc_price
//   })) as PriceChartDataPoint[]
// })

export const selectContracts = (state: IndexState) => state.renter.contracts

export const selectSeedState = (state: IndexState) => state.wallet.seed

export const selectInitFromSeedState = (state: IndexState) => state.ui.initFromSeed

export const selectSiadState = (state: IndexState) => state.ui.siad

export const selectWalletSummary = (state: IndexState) => state.wallet.summary

export const selectGateway = (state: IndexState) => state.gateway

export const selectConsensus = (state: IndexState) => state.consensus

export const selectHost = (state: IndexState) => state.host

export const selectTransactionHeight = (state: IndexState) => state.wallet.transactions.sinceHeight

export const selectFolders = (state: IndexState) => state.host.folders
export const selectHostConfig = (state: IndexState) => state.host.host

export type SpendingTotals = ReturnType<typeof selectSpending>
export const selectSpending = createSelector(
  selectContracts,
  contracts => {
    let storagespending = new BigNumber(0)
    let uploadspending = new BigNumber(0)
    let downloadspending = new BigNumber(0)

    contracts.activecontracts.forEach(c => {
      storagespending = new BigNumber(c.storagespending).plus(storagespending)
      uploadspending = new BigNumber(c.uploadspending).plus(uploadspending)
      downloadspending = new BigNumber(c.downloadspending).plus(downloadspending)
    })

    contracts.inactivecontracts.forEach(c => {
      storagespending = new BigNumber(c.storagespending).plus(storagespending)
      uploadspending = new BigNumber(c.uploadspending).plus(uploadspending)
      downloadspending = new BigNumber(c.downloadspending).plus(downloadspending)
    })

    contracts.expiredcontracts.forEach(c => {
      storagespending = new BigNumber(c.storagespending).plus(storagespending)
      uploadspending = new BigNumber(c.uploadspending).plus(uploadspending)
      downloadspending = new BigNumber(c.downloadspending).plus(downloadspending)
    })

    return {
      storagespending: toSiacoins(storagespending).toFixed(2),
      uploadspending: toSiacoins(uploadspending).toFixed(2),
      downloadspending: toSiacoins(downloadspending).toFixed(2)
    }
  }
)

export type ContractSums = ReturnType<typeof selectContractDetails>
export const selectContractDetails = createSelector(
  selectContracts,
  contracts => {
    return {
      active: contracts.activecontracts.length,
      inactive: contracts.inactivecontracts.length,
      expired: contracts.expiredcontracts.length
    }
  }
)

export const selectActiveHostCount = createSelector(
  selectHost,
  hosts => hosts.activeHosts.length
)

export const selectCurrAddress = (state: IndexState) => state.wallet.receive.address
export const selectReceiveAddresses = (state: IndexState) =>
  state.wallet.receive.addresses.slice(0, 4)

export const selectConfirmedBalance = createSelector(
  selectWalletSummary,
  summary => toSiacoins(summary.confirmedsiacoinbalance).toFixed(2)
)

export const selectIncomingBalance = createSelector(
  selectWalletSummary,
  summary => summary.unconfirmedincomingsiacoins
)
export const selectOutgoingBalance = createSelector(
  selectWalletSummary,
  summary => summary.unconfirmedoutgoingsiacoins
)

export const selectUnconfirmedBalance = createSelector(
  selectIncomingBalance,
  selectOutgoingBalance,
  (incoming, outgoing) => toSiacoins(new BigNumber(incoming).minus(outgoing)).toFixed(4)
)

export const selectSiafundBalance = createSelector(
  selectWalletSummary,
  summary => summary.siafundbalance
)

export const selectWalletBalanceDetails = createSelector(
  selectConfirmedBalance,
  selectUnconfirmedBalance,
  selectSiafundBalance,
  (confirmed, unconfirmed, siafund) => {
    return {
      confirmedBalance: confirmed,
      unconfirmedBalance: unconfirmed,
      siafundBalance: siafund.toString()
    }
  }
)

export const selectMaxFee = (state: IndexState) => state.tpool.maximum

export const selectWalletTx = (state: IndexState) => state.wallet.transactions

export interface StructuredTransaction {
  id: string
  date: number
  height: number
  details: {
    totalSiacoin: string
    totalSiafund: string
    totalMiner: string
    labels: WalletModel.TransactionTypes[]
  }
}

// const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

export type OrganizedTx = ReturnType<typeof selectOrganizedTx>
export const selectOrganizedTx = createSelector(
  selectWalletTx,
  tx => {
    const { confirmedtransactions, unconfirmedtransactions } = tx
    const transformedConfirmedTxs = confirmedtransactions.map(t => {
      return {
        id: t.transactionid,
        date: t.confirmationtimestamp,
        height: t.confirmationheight,
        details: computeTxSum(t)
      } as StructuredTransaction
    })
    const transformUnconfirmedTx = unconfirmedtransactions.map(t => {
      return {
        id: t.transactionid,
        date: t.confirmationtimestamp,
        height: t.confirmationheight,
        details: computeTxSum(t)
      } as StructuredTransaction
    })
    return {
      confirmed: transformedConfirmedTxs,
      unconfirmed: transformUnconfirmedTx
    }
  }
)

export type GroupedTx = ReturnType<typeof selectGroupedTx>
export const selectGroupedTx = createSelector(
  selectOrganizedTx,
  otx => {
    const tx = groupTransactionsByDay(otx)
    return tx
  }
)

export const selectFeeEstimate = createSelector(
  selectMaxFee,
  fee => {
    return toSiacoins(new BigNumber(fee).multipliedBy(1000)).toFixed(4)
  }
)

export const selectSiacoinBroadcastResponse = (state: IndexState) =>
  state.wallet.siacoinBroadcastResponse
