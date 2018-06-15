const fs = require('fs')
const Promise = require('bluebird')

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

Promise.promisifyAll(web3.eth)

let lllContractData = fs.readFileSync('./build/ETHSwap.lll.bin', 'utf8')
let solContractData = fs.readFileSync('./build/ETHSwap.bin', 'utf8')
// let tingContractData = `602060a5600039600051600055602060c5600039600051600155602060e560003960005160025533600355606e8060006037396000f3006000341160235760e060020a60003504806379599f961460245763bd66528a14603e57fe5b60015442106023576000808080303160035460155a03f150005b600254803314156023576004356000526032600020806000541415602357600052600080808030319460155a035000`
let tingContractData = `6020609d600039600051600055602060bd600039600051600155602060dd6000396000516002553360035560668060006037396000f3006000341160235760e060020a60003504806379599f961460245763bd66528a14603457fe5b6001544210602357600354605656005b6002548033141560235760043560005260326000208060005414156023576000525b600080808030318560155a03f1500`

lllContractData = lllContractData.trim()
solContractData = solContractData.trim()

const lcl = lllContractData.length
const scl = solContractData.length
const tcl = tingContractData.length

console.log(` SOL produced ${scl/2} byte code`)
console.log(` LLL produced ${lcl/2} byte code. ${(Math.round((scl/lcl) * 100)/100)}x reduction`)
console.log(`Ting produced ${tcl/2} byte code. ${(Math.round((scl/tcl) * 100)/100)}x reduction`)
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
  });
}

async function run () {
  const accounts = await web3.eth.getAccountsAsync()

  const value = 2e18
  const from = accounts[8]
  const to  = accounts[9]

  const args = [ '0x3943fb730471b38900768f17e0ed5bbb48725a380b2fedb519bc29a829589ee1', 123, to ]

  const lllContract = await NewETHSwap(...args, from, value, lllContractData)
  const solContract = await NewETHSwap(...args, from, value, solContractData)
  const tingContract = await NewETHSwap(...args, from, value, tingContractData)

  Promise.promisifyAll(lllContract)
  Promise.promisifyAll(solContract)
  Promise.promisifyAll(tingContract)

  const creationGasUsedSol = await getGasUsed(solContract.transactionHash)
  const creationGasUsedLLL = await getGasUsed(lllContract.transactionHash)
  const creationGasUsedTing = await getGasUsed(tingContract.transactionHash)

  let STANDARDTXGAS = creationGasUsedSol

  console.log(` SOL> Gas used to deploy contract: ${creationGasUsedSol}, reference`)
  console.log(` LLL> Gas used to deploy contract: ${creationGasUsedLLL}, ${STANDARDTXGAS - creationGasUsedLLL} less`)
  console.log(`TING> Gas used to deploy contract: ${creationGasUsedTing}, ${STANDARDTXGAS - creationGasUsedTing} less`)
  console.log('')

  const claimArgs = [ '0x8ae25d6e387af39ed76da2422c00547089be2890d1f4882e630da8f672ccbb1d', { from: to } ]

  const txLLL = await lllContract.claimAsync(...claimArgs)
  const txSol = await solContract.claimAsync(...claimArgs)
  const txTing = await tingContract.claimAsync(...claimArgs)

  const claimGasUsedSol = await getGasUsed(txSol)
  const claimGasUsedLLL = await getGasUsed(txLLL)
  const claimGasUsedTing = await getGasUsed(txTing)

  STANDARDTXGAS = claimGasUsedSol

  console.log(` SOL> Gas used to claim the swap: ${claimGasUsedSol}, reference`)
  console.log(` LLL> Gas used to claim the swap: ${claimGasUsedLLL}, ${STANDARDTXGAS - claimGasUsedLLL} less`)
  console.log(`TING> Gas used to claim the swap: ${claimGasUsedTing}, ${STANDARDTXGAS - claimGasUsedTing} less`)
}

run()
