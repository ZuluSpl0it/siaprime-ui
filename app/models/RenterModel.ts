import { WalletModel } from './WalletModel'

export namespace RenterModel {
  interface Contract {
    downloadspending: string
    endheight: number
    fees: string
    hostpublickey: WalletModel.SiaPublicKey
    id: string
    lasttransactions: any
    netaddress: string
    renterfunds: string
    size: number
    startheight: number
    storagespending: string
    totalcost: string
    uploadspending: string
    goodforupload: boolean
    goodforrenew: false
  }
  export interface ContractsGETResponse {
    activecontracts: Contract[]
    inactivecontracts: Contract[]
    expiredcontracts: Contract[]
  }
}
