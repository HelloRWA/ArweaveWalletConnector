import { message } from '@permaweb/aoconnect/browser'
import store from '..'

const state = () => ({
  balance: 0,
  nickname: '',
  userInfoLoading: false,
  process: import.meta.env.VITE_AO_PROCESS_ID,
  leaderboard: [],
  leaderboardLoading: false,
})

const getters = {
  signer: (state, getters, rootState) => rootState['pwaConnector/signer'],
}

const mutations = {}

const actions = {
  async connect({ commit, state, dispatch }) {
    const rz = await dispatch('pwaConnector/connect', null, { root: true })
    if (!rz.error) {
      await dispatch('getUserInfo')
      return
    }
    alert(rz.error)
  },
  async getUserInfo({ commit, state, dispatch }) {
    state.userInfoLoading = true
    const process = state.process
    const rz = await dispatch(
      'ao/read',
      {
        action: 'GetUserInfo',
        process,
      },
      { root: true }
    )

    state.balance = rz.balance
    state.nickname = rz.nickname
    state.userInfoLoading = false
  },
  async setNickname({ commit, state, dispatch }, nickname) {
    const process = state.process
    const rz = await dispatch(
      'ao/write',
      {
        action: 'SetNickname',
        process,
        tagsObj: {
          Nickname: nickname,
        },
      },
      { root: true }
    )
    state.nickname = nickname
  },
  async generateGamePlayId({ commit, state, dispatch }) {
    const process = state.process
    const rz = await dispatch(
      'ao/write',
      {
        action: 'GenerateGamePlayId',
        process,
      },
      { root: true }
    )
    if (!rz.gamePlayId) {
      return false
    }

    store.commit('SET_GAME_PLAY_ID', rz.gamePlayId)

    return rz.gamePlayId
  },
  async fetchLeaderboard({ commit, state, dispatch }) {
      state.leaderboardLoading = true
      const rz = await dispatch('ao/read', {
        action: 'GetLeaderboard',
        process: state.process,
      }, { root: true })  
      state.leaderboard = rz
      state.leaderboardLoading = false
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
