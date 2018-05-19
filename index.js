const fs = require('fs')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const lllContractData = fs.readFileSync('./build/ETHSwap.lll.bin', 'utf8')
const soldContractData = fs.readFileSync('./build/ETHSwap.lll.bin', 'utf8')

const lcl = lllContractData.length
const scl = soldContractData.length

console.log('*******')
console.log(`> LLL produced ${(Math.round((scl/lcl) * 100)/100)}x smaller bytecode`)

const abi = require('./build/ETHSwap')
const ETHSwap = web3.eth.contract(abi)

web3.eth.getAccounts((err, accounts) => {
  console.log('*******')

  const value = 2e18
  const from = accounts[3]
  const to  = accounts[4]

  console.log(`Value: ${value} wei`);
  console.log(`From: ${from}`)
  console.log(`To: ${to}`)

  console.log('*******')

  web3.eth.getBalance(from, (err, bal) => console.log('From:', bal.toString()))
  web3.eth.getBalance(to, (err, bal) => console.log('To:', bal.toString()))

  ETHSwap.new('0x3943fb730471b38900768f17e0ed5bbb48725a380b2fedb519bc29a829589ee1', 123, to, {
    data: lllContractData.trim(),
    from,
    gas: 400000,
    value
  }, (err, contract) => {
    if (err) {
      console.error(err)
      return
    }

    if (!contract.address) return

    console.log('*******')

    console.log(`Contract Address: ${contract.address}`)

    console.log('*******')

    const ETHSwapInstance = ETHSwap.at(contract.address)
    const txHash = ETHSwapInstance.claim('0x8ae25d6e387af39ed76da2422c00547089be2890d1f4882e630da8f672ccbb1d', { from: to })
    console.log(`> ${txHash}`)

    console.log('*******')

    web3.eth.getBalance(from, (err, bal) => console.log('From:', bal.toString()))
    web3.eth.getBalance(to, (err, bal) => console.log('To:', bal.toString()))
  })
})
