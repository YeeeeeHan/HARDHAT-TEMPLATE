require('dotenv').config({ path: '../.env' })


const secp256k1 = require('secp256k1')

const message = Buffer.from("", 'hex')
const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex')

var sig = secp256k1.ecdsaSign(message, privateKey)

var ret = {}
ret.r = sig.signature.slice(0, 32)
ret.s = sig.signature.slice(32, 64)
ret.v = sig.recovery + 27
console.log("r:", ret.r.toString())
console.log("s:", ret.s.toString())
console.log("v:", ret.v.toString())

const pubKey = secp256k1.publicKeyCreate(privateKey)

// Verify private key
console.log("Is private key verified: ", secp256k1.privateKeyVerify(privateKey))