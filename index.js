const fs = require('fs')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const contractData = fs.readFileSync('./build/contractData', 'utf8')
const solidityContractData = fs.readFileSync('./build/foocontract.bin', 'utf8')

const lcl = contractData.length
const scl = solidityContractData.length

console.log('*********************************************************************')
console.log('*****************', `LLL produced ${(Math.round((scl/lcl) * 100)/100)}x smaller bytecode`, '****************')
console.log('*********************************************************************')

const abi = require('./build/foocontract')
const ETHSwap = web3.eth.contract(abi)

web3.eth.getAccounts((err, accounts) => {
  const from = accounts[2]
  const to  = accounts[3]

  console.log('From: ', from)
  console.log('To: ', to)

  ETHSwap.new('0x3943fb730471b38900768f17e0ed5bbb48725a380b2fedb519bc29a829589ee1', 123, to, {
    data: contractData.trim(),
    from,
    gas: 400000,
    value: 2e18
  }, (err, contract) => {
    if (err) {
      console.error(err)
      return
    }

    if (!contract.address) return

    console.log(`Contract Address: ${contract.address}`)
    const ETHSwapInstance = ETHSwap.at(contract.address)

    ETHSwapInstance.claim('0x8ae25d6e387af39ed76da2422c00547089be2890d1f4882e630da8f672ccbb1d', { from: to })

    web3.eth.getBalance(from, (err, bal) => console.log('from', bal.toString()))
    web3.eth.getBalance(to, (err, bal) => console.log('to', bal.toString()))
  })
})
