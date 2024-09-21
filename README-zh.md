# Arweave 钱包连接器

[English](README.md) | 简体中文

## 在线演示

连接器模块本身不包含视觉组件，并且独立于任何 javascript 框架。

查看一个你可以用它构建的用户流程示例：https://jfbeats.github.io/ArweaveWalletConnector/

## 它是如何工作的

用户浏览到 WEBSITE 时，需要授权交易才能继续。私钥由 arweave.app 持有，安全地保存在浏览器存储中，并远离其他网站。

1. 安装 - 为了让 WEBSITE 让用户无需直接访问私钥即可授权与 arweave 网络的交互，网站开发者将连接器安装到他们的应用程序中。该模块仅包含在用户计算机上发送和接收安全且直接的网页消息所需的逻辑
2. 连接 - WEBSITE 要求用户选择一个 URL，用户可以在其中找到他们的私钥。他们选择 `arweave.app` ，连接器现在会加载页面以让用户接受或拒绝连接。一旦接受，用户的地址将共享给 WEBSITE，后者就能够发送和接收请求
3. 授权 - WEBSITE 现在将请求发送到 arweave.app，请求交易签名并提供新的未签名交易信息。使用提供的数据，arweave.app 显示用户所需的所有信息，以做出同意并返回已签名交易的决策，或拒绝并返回错误消息。它就像 metamask，但它是 web3

## 它是什么

连接器是 `permanent` 账户管理器的终极链接。用户无需安装任何东西，也不受特定设备类型或操作系统的限制。该系统不依赖于任何第三方，一旦实现，任何网页都可以连接到任何钱包提供商，尊重标准。这个模块有效地和永久地提供了一个通信协议，在 arweave 上托管的去中心化应用程序或普通网页之间。它利用 web 技术在用户设备上建立了一个完全在用户设备上运行的桥梁，即使在没有网络的情况下也是如此。

## 功能

对于每个人：

- 永久免费
- 可以在后台处理请求 ***

对于你的用户：

- 无需安装
- 可在任何设备上使用，包括移动设备

对于开发者：

- 不依赖任何基础设施（没有 api key）
- 最终 - 没有破坏性变化，只有改进
- 完全类型化
- 兼容 [arweave-js](https://github.com/ArweaveTeam/arweave-js)
- 兼容使用 [arweave-js](https://github.com/ArweaveTeam/arweave-js) api 对象（例如 smartweave 客户端）的其他工具
- 兼容使用注入的 `window.arweaveWallet` 对象的任何其他内容
- 最安全 - 包括内置的运行时双向类型验证，以过滤掉具有意外格式的外部消息
- 不需要管理权限 - 由钱包提供者处理
- 为任何属性值更改发出事件 - 使用 `wallet.on('event', callback)` 监听

对于钱包开发者：

- 使用 [JSON RPC](https://www.jsonrpc.org/specification) api 标准
- 提供可导入的预构建运行时类型验证

<sub>*** Brave 是目前唯一需要用户在盾牌菜单中手动设置 `所有 cookie 允许` 以让 iframe 访问其保存的设置的浏览器。钱包提供商可以选择如何处理这种情况，其中后台功能不可用。对于 arweave.app 来说，弹出窗口保持打开状态。</sub>

## 注意

截至现在，[arweave.app](https://arweave.app) 和 [RWA-Wallet.com](https://pwa.rwa-wallet.com) 是唯二的钱包提供商，因此建议将其作为默认选项。通过允许用户输入自己的自定义钱包 URL，增加去中心化和永久性。这还让他们可以在你的应用程序中使用运行在 localhost 上的提供商。

## 如何使用

安装：

```sh
npm i arweave-wallet-connector
```

导入 / 创建实例 / 设置要连接的 URL / 启动：

```js
import { ArweaveWebWallet } from 'arweave-wallet-connector'

const wallet = new ArweaveWebWallet({
    // 可选地提供有关你的应用程序的信息，这些信息将显示在钱包提供者界面中
    name: '你的应用程序名称',
    logo: '你的 logo 的 URL 用于显示给用户'
})

wallet.setUrl('钱包提供者的 URL 以连接到')
await wallet.connect() // 在用户动作触发以避免阻止弹出窗口（指用户自己主动点击你的页面上的按钮才触发这个代码）
```

一旦连接建立，你可以选择使用 `wallet` 对象，如 [demo](https://jfbeats.github.io/ArweaveWalletConnector/) 中所示，或使用 Arconnect api 格式：

```js
const arconnectLikeAPI = wallet.namespaces.arweaveWallet
```

### 连接后

在用户完成连接流程（`wallet.connect()` 成功）后，连接器将开始接收来自 `window.arweaveWallet` 对象的指令，如 arweave-js、smartweave 客户端等。在断开连接时，它会恢复任何之前可用的端点，由浏览器扩展注入

## 响应式 Javascript 框架

该模块不导入任何框架组件，但提供了使实例属性响应式的方法

### Vue

传递一个 `ref` 或一个 `reactive` 对象实例。钱包属性将变得响应式，可以在模板中使用

```html
<script setup>
const state = ref({ url: 'arweave.app' })
const wallet = new ArweaveWebWallet({ /* ... */ }, { state })
</script>

<template>
    <p @click="() => wallet.connect()">Connect</p>
    <p>{{ wallet.address }}</p>
</template>
```

[地址栏组件](example/src/components/WalletSelector.vue)

### For Svelte

在组件中使用 `$wallet`

```html
<script>
const state = { url: 'arweave.app' }
const wallet = new ArweaveWebWallet({ /* ... */ }, { state })
</script>

<div>
    <p on:click={() => wallet.connect()}>Connect</p>
    <p>{$wallet.address}</p>
</div>
```

### For React

在组件中调用 `wallet.setState(useState(wallet.state))` ，钱包将使用钩子

```js
const state = { url: 'arweave.app' }
const wallet = new ArweaveWebWallet({ /* ... */ }, { state })

function App () {
    wallet.setState(useState(wallet.state))
    return (
        <div>
            <p onClick={() => wallet.connect()}>Connect</p>
            <p>{wallet.address}</p>
        </div>
    )
}
```

## Wallet Server

如果你的应用程序在能够创建 web socket 服务器的环境中运行（node、原生应用程序等），可以通过该链接与钱包提供商通信

### Node.js

从本地机器上运行的服务器。例如，可以用于请求服务费或数据上传

```js
import { ArweaveWalletServer } from 'arweave-wallet-connector/lib/node'
const wallet = new ArweaveWalletServer('arweave.app')
await wallet.connect()
await wallet.signTransaction( /* ... */ )
```
