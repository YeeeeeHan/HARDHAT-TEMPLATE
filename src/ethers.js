require('dotenv').config({ path: '../.env' })

const { ALCHEMY_GOERLI_URL, PRIVATE_KEY } = process.env
const { ethers } = require('ethers')
const { hashMessage } = require('@ethersproject/hash')
const provider = new ethers.providers.AlchemyProvider('goerli', ALCHEMY_GOERLI_URL)

;(async function () {
  const message = "hello"
  const walletInst = new ethers.Wallet(PRIVATE_KEY, provider)
  const signMessage = walletInst.signMessage(message)

  const messageSigner = ethers.utils.recoverAddress(
    hashMessage(message),
    await signMessage
  )
  console.log('message: ' + message)
  console.log('signer: ' + messageSigner)
  console.log('message signature: ' + (await signMessage))
})()
