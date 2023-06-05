require('dotenv').config({ path: '../.env' })

const ethUtil = require('ethereumjs-util')

// Generating message hash
const message = 'hello'
const msgHex = ethUtil.bufferToHex(Buffer.from(message))
const msgBuffer = ethUtil.toBuffer(msgHex)
const prefixedHash = ethUtil.hashPersonalMessage(msgBuffer)
console.log('msgBuffer: ' + ethUtil.bufferToHex(msgBuffer))
console.log('prefixedHash: ' + ethUtil.bufferToHex(prefixedHash))

// Signing message with private key
const privateKey = ethUtil.toBuffer('0x' + process.env.PRIVATE_KEY)
const signatureFromEcsign = ethUtil.ecsign(prefixedHash, privateKey)
console.log('\n--- signatureFromEcsign ---')
console.log('v: ' + signatureFromEcsign.v)
console.log('r: ' + ethUtil.bufferToHex(signatureFromEcsign.r))
console.log('s: ' + ethUtil.bufferToHex(signatureFromEcsign.s))

// Verifying the message is really from sender (by checking public key recovered)
const publicKey = ethUtil.ecrecover(
    prefixedHash,
    signatureFromEcsign.v,
    signatureFromEcsign.r,
    signatureFromEcsign.s
)
const sender = ethUtil.publicToAddress(publicKey)
const addr = ethUtil.bufferToHex(sender)
console.log('public key: ' + publicKey.toString('hex'))
console.log('sender: ' + sender.toString('hex'))
console.log('addr: ' + addr)


//======================================================================
// Obtaining signed message from RPC sig
const inSignature =
  '0xc48e96cd6f0ba6c7eb7d269601b725a25fd4cdc8e668a73aeb0b8ffc04e6805401b715591fd317587ccb0cdc5542a0614df28d18edcb7a782e4c5710a10bcd7c1b' //user signed message
const signature = ethUtil.toBuffer(inSignature)
const sigParams = ethUtil.fromRpcSig(signature)
console.log('\n--- sigParams ---')
console.log('v: ' + sigParams.v)
console.log('r: ' + ethUtil.bufferToHex(sigParams.r))
console.log('s: ' + ethUtil.bufferToHex(sigParams.s))
console.log('\n')

