const fs = require('fs')
const Promise = require('bluebird')

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

Promise.promisifyAll(web3.eth)

let lllContractData = fs.readFileSync('./build/ETHSwap.lll.bin', 'utf8')
let solContractData = fs.readFileSync('./build/ETHSwap.bin', 'utf8')

lllContractData = lllContractData.trim()
solContractData = solContractData.trim()

const lcl = lllContractData.length
const scl = solContractData.length

console.log(`LLL produced ${(Math.round((scl / lcl) * 100) / 100)}x smaller bytecode`)
console.log('')

const abi = require('./build/ETHSwap')
const ETHSwap = web3.eth.contract(abi)

const getGasUsed = async (hash) => (await web3.eth.getTransactionReceiptAsync(hash)).gasUsed

function NewETHSwap (hash, lock, to, from, value, data) {
  return new Promise((resolve, reject) => {
    ETHSwap.new(hash, lock, to, {
      data,
      from,
      gas: 400000,
      value
    }, (err, contract) => {
      if (err) {
        reject(err)
        return
      }

      if (!contract.address) return

      resolve(contract)
    })
  })
}

const STANDARDTXGAS = 21000

async function run () {
  const accounts = await web3.eth.getAccountsAsync()

  const value = 2e18
  const from = accounts[4]
  const to = accounts[5]

  // console.log(`Value: ${value} wei`)
  // console.log(`From: ${from}`)
  // console.log(`To: ${to}`)
  //
  // console.log('')
  //
  // console.log('Account F:', (await web3.eth.getBalanceAsync(from)).toString())
  // console.log('Account T:', (await web3.eth.getBalanceAsync(to)).toString())
  // console.log('')
  //
  // const args = [ '0x3943fb730471b38900768f17e0ed5bbb48725a380b2fedb519bc29a829589ee1', 123, to ]
  //
  // const lllContract = await NewETHSwap(...args, from, value, lllContractData)
  // const solContract = await NewETHSwap(...args, from, value, solContractData)
  //
  // // console.log(lllContract.address)
  // // console.log(solContract.address)
  //
  // Promise.promisifyAll(lllContract)
  // Promise.promisifyAll(solContract)
  //
  // const creationGasUsedLLL = await getGasUsed(lllContract.transactionHash)
  // const creationGasUsedSol = await getGasUsed(solContract.transactionHash)
  //
  // console.log(`LLL> Gas used to deploy contract: ${creationGasUsedLLL}, ${creationGasUsedLLL - STANDARDTXGAS} more`)
  // console.log(`SOL> Gas used to deploy contract: ${creationGasUsedSol}, ${creationGasUsedSol - STANDARDTXGAS} more`)
  // console.log(`>>>> Savings: ${creationGasUsedSol - creationGasUsedLLL}`)
  // console.log('')
  //
  // const claimArgs = [ '0x8ae25d6e387af39ed76da2422c00547089be2890d1f4882e630da8f672ccbb1d', { from: to } ]

  // ////
  //
  // const transaction = {
  //   from: to,
  //   to: lllContract.address,
  //   value: '0x00',
  //   gas: 5000000,
  //   data: '0xc63ff8dd0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000'
  // }
  //
  // const temp = await web3.eth.sendTransactionAsync(transaction)
  //
  // console.log(temp)

  // //

  const tx = await web3.eth.sendTransaction({from, to, value: web3.toWei(1, 'ether'), data: '0x0'})

  // const txLLL = await lllContract.claimAsync(...claimArgs)
  // const txSol = await solContract.claimAsync(...claimArgs)

  // const claimGasUsedLLL = await getGasUsed(txLLL)
  const claimGasUsedSol = await getGasUsed(tx)

  console.log(claimGasUsedSol)

  // console.log(`LLL> Gas used to claim the swap: ${claimGasUsedLLL}, ${claimGasUsedLLL - STANDARDTXGAS} more`)
  // console.log(`SOL> Gas used to claim the swap: ${claimGasUsedSol}, ${claimGasUsedSol - STANDARDTXGAS} more`)
  // console.log(`>>>> Savings: ${claimGasUsedSol - claimGasUsedLLL}`)
  // console.log('')
}

run()
