import { createDataItemSigner } from "@permaweb/aoconnect";
import { ArweaveWebWallet } from "arweave-wallet-connector";
import Arweave from "arweave";

export const pwaConnectorStore = defineStore("pwaConnectorStore", () => {
  let address = $ref('');
  const signer = $computed(() => {
    if (!address) return false
    // @ts-ignore
    return createDataItemSigner(wallet)
  })
  const truncatedAddress = $computed(() => {
    if (address) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }
    return ''
  })

  const init = async () => {
    const arweave = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
    });
    const url = "https://pwa.rwa-wallet.com";
    const wallet = new ArweaveWebWallet(
      {
        name: "UNI Bridge",
        logo: `${location.origin}/logo.png`,
      },
      {
        state: { url },
      }
    );
    wallet.setUrl(wallet.url);
    wallet.on('disconnect', async () => {
      await disconnect(true)
    })
    // @ts-ignore
    window.wallet = wallet;
  }

  const connect = async () => {
    try {
      address = await wallet.connect()
      return true
    } catch (error) {
      return {
        error: 'You rejected connection',
      }
    }
  }

  const disconnect = async (isFromWallet = false) => {
    if (!isFromWallet) {
      await wallet.disconnect()
    }
    address = null
  }

  return $$({ connect, disconnect, address, init, truncatedAddress, signer });
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(pwaConnectorStore, import.meta.hot));
