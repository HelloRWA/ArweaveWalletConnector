import { reactive } from 'vue'
import { createDataItemSigner } from '@permaweb/aoconnect'
import { ArweaveWebWallet } from 'arweave-wallet-connector'
import Arweave from 'arweave'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
})
const url = 'https://pwa.rwa-wallet.com'
const wallet = new ArweaveWebWallet(
  {
    name: 'AO Snake',
    logo: `${location.origin}/logo.png`,
  },
  {
    state: reactive({ url }),
  }
)
wallet.setUrl(wallet.url)
// @ts-ignore
window.wallet = wallet

const state = () => ({
  wallet,
  address: null,
})

const getters = {
  signer: (state) => {
    if (!state.address) return false
    return createDataItemSigner(wallet)
  },
  truncatedAddress: (state) => {
    if (state.address) {
      return `${state.address.slice(0, 6)}...${state.address.slice(-4)}`
    }
    return ''
  },
}

const mutations = {
}

const actions = {
  async connect({ commit, state, dispatch }) {
    try {
      const address = await wallet.connect()
      wallet.on('disconnect', async () => {
        await dispatch('disconnect', true)
      })
    state.address = address

      return true
    } catch (error) {
      return {
        error: 'You rejected connection',
      }
    }
  },
  async disconnect({ commit }, isFromWallet = false) {
    if (!isFromWallet) {
      await wallet.disconnect()
    }
    state.address = null
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
