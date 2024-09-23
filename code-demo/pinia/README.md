# Pinia code demo

## 1. Install dependencies

```bash
pnpm install @permaweb/aoconnect arweave-wallet-connector arweave
```

## 2. copy stores

copy `stores` folder to your project

## 3. copy components

copy `PwaConnector.vue` to your project

## 4. use the `read` and `write` methods from the `aoStore`

```javascript
const { read, write } = $(aoStore())

const rzRead = await read({
  action: 'ReadSomething',
  process: 'your-process-id',
  tagsObj: {
    varName1: 'varValue1',
    varName2: 'varValue2',
  },
})

const rzWrite = await write({
  action: 'SubmitAirdrop',
  process: 'your-process-id',
  tagsObj: {
    varName1: 'varValue1',
    varName2: 'varValue2',
  },
})
```
