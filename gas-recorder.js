
const { each } = require('lodash')
const puts = require('./puts')

const DEFAULT_GAS_TO_ETH = 0.00000002
const DEFAULT_ETH_TO_USD = 1000.0

/**
 * Usage:
 *
 *   const { recordGas, dumpRecordedGas } = require('@appliedblockchain/cobalt/gas-recorder')
 *   await contract.methods.foo().send({ from, gas }).then(recordGas('foo'))
 *   dumpRecordedGas()
 *
 * @param {number} .gasToEth = DEFAULT_GAS_TO_ETH (0.00000002)
 * @param {number} .ethToUsd = DEFAULT_ETH_TO_USD (1000.0)
 * @return {{ recordGas: function, dumpRecordedGas: function }}
 */
function makeGasRecorder({ gasToEth = DEFAULT_GAS_TO_ETH, ethToUsd = DEFAULT_ETH_TO_USD } = {}) {
  const cumulativeGasUsed = {}

  const gasToUsd = gas => gas * gasToEth * ethToUsd

  const recordGas = name => function (result) {
    cumulativeGasUsed[name] = (cumulativeGasUsed[name] || 0) + result.cumulativeGasUsed
    return result
  }

  const dumpRecordedGas = () => {
    each(cumulativeGasUsed, (gas, name) => {
      puts('%20s - $ %.2f (%d gas)', name, gasToUsd(gas), gas)
    })
    puts('%20s - $ %d', 'eth price', ethToUsd)
  }

  return { recordGas, dumpRecordedGas }
}

module.exports = makeGasRecorder
