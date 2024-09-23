import {
  message,
  result,
  dryrun,
} from '@permaweb/aoconnect'

const state = () => ({})

const getters = {
  address: (state, getters, rootState) => rootState.pwaConnector.address,
  wallet: (state, getters, rootState) => rootState['pwaConnector/wallet'],
  signer: (state, getters, rootState, rootGetters) =>
    rootGetters['pwaConnector/signer'],
}

const mutations = {}

const actions = {
  async read(
    { commit, state, getters, dispatch, rootState },
    { action, process, tagsObj = false }
  ) {
    let tags = [{ name: 'Action', value: action }]

    if (getters.address) {
      tags.push({ name: 'Address', value: getters.address })
    }

    if (tagsObj) {
      tags = [
        ...tags,
        ...Object.entries(tagsObj).map(([name, value]) => ({ name, value })),
      ]
    }

    const rz = await dryrun({
      process,
      data: '',
      tags,
    })

    if (rz.Messages && rz.Messages[0] && rz.Messages[0].Data) {
      const data = JSON.parse(rz.Messages[0].Data)
      return data
    }

    return {}
  },
  async write(
    { commit, state, getters, dispatch },
    { action, process, signer, tagsObj = false }
  ) {
    if (!signer) {
      signer = getters.signer
    }
    let tags = [{ name: 'Action', value: action }]
    if (tagsObj) {
      tags = [
        ...tags,
        ...Object.entries(tagsObj).map(([name, value]) => ({ name, value })),
      ]
    }

    try {
      const mid = await message({
        process,
        signer,
        data: '',
        tags,
      })
      let rz = await result({
        message: mid,
        process,
      })

      if (rz.Messages && rz.Messages[0] && rz.Messages[0].Data) {
        const data = JSON.parse(rz.Messages[0].Data)
        return data
      }
    } catch (error) {
      // if(error.message === 'Rejected') {
      //   return {
      //     error: 'Rejected'
      //   }
      // }
      console.error('Error writing to AO:', error)
      throw error
    }

    return {}
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
