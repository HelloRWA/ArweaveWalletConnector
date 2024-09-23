<template>
  <div class="wallet-info">
    <v-button
      v-if="!truncatedAddress"
      @click="connectWallet"
      title="Connect Wallet"
      class="button" />
    <span v-else-if="userInfoLoading"> Loading... </span>
    <template v-else>
      <v-button
        @click="showNicknameModal"
        :title="nickname ? nickname : 'Setup Nickname'"
        class="button ml10" />
      <span class="ml10">{{ truncatedAddress }}</span>
      <span class="ml10">Balance: {{ balance }} $SNAKE</span>
      <v-button
        @click="disconnectWallet"
        title="Disconnect"
        class="button ml10" />
      <v-button
        @click="setAdmin"
        v-if="isAdmin"
        title="Set Admin"
        class="ml10"></v-button>
    </template>
  </div>
</template>

<script lang="ts">
  import { computed, onMounted, nextTick } from 'vue'
  import { useStore } from 'vuex'
  import VButton from '@/components/Button.vue'
  import { message, result } from '@permaweb/aoconnect'

  export default {
    name: 'WalletConnect',
    components: {
      VButton,
    },
    setup() {
      const store = useStore()

      const walletAddress = ''
      const truncatedAddress = computed(
        () => store.getters['pwaConnector/truncatedAddress']
      )
      const nickname = computed(() => store.state.aoSnake.nickname)
      const balance = computed(() => store.state.aoSnake.balance)
      const userInfoLoading = computed(
        () => store.state.aoSnake.userInfoLoading
      )

      async function connectWallet() {
        const rz = await store.dispatch('pwaConnector/connect')
        if (!rz.error) {
          await store.dispatch('aoSnake/getUserInfo')
          return
        }
        alert(rz.error)
      }

      function disconnectWallet() {
        store.dispatch('pwaConnector/disconnect')
      }

      onMounted(async () => {})

      const isAdmin = computed(() => {
        return location.search.includes('admin=true')
      })

      async function setAdmin() {
        try {
          const signer = store.dispatch('wallet/getSigner')
          const mid = await message({
            process: import.meta.env.VITE_AO_PROCESS_ID,
            tags: [
              { name: 'Action', value: 'setAdmin' },
              { name: 'address', value: walletAddress.value },
              { name: 'operation', value: 'add' },
            ],
            signer,
          })

          const rz = await result({
            message: mid,
            process: import.meta.env.VITE_AO_PROCESS_ID,
          })

          console.log('setAdmin result:', rz)
          if (rz.Messages[0].Data === 'true') {
            console.log('Admin added successfully')
          } else {
            console.error('Failed to add admin')
          }
        } catch (error) {
          console.error('Error calling setAdmin:', error)
        }
        // store.dispatch('wallet/setAdmin', walletAddress.value);
      }

      function showNicknameModal() {
        store.commit('SET_SHOW_NICKNAME_MODAL', true)
      }

      return {
        userInfoLoading,
        isAdmin,
        setAdmin,
        truncatedAddress,
        connectWallet,
        disconnectWallet,
        nickname,
        balance,
        showNicknameModal,
      }
    },
  }
</script>

<style lang="postcss" scoped>
  .wallet-info {
    display: flex;
    align-items: center;
  }

  .ml10 {
    margin-left: 10px;
  }
</style>
