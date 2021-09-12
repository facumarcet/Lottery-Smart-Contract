const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotterypath = path.resolve(__dirname, 'Contracts', 'Lottery.sol');
const source = fs.readFileSync(lotterypath, 'UTF-8');

let input = {
    language: 'Solidity',
    sources: {
        'Lottery.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};

let output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output);
const abi = output.contracts['Lottery.sol']['Lottery'].abi
const bytecode = output.contracts['Lottery.sol']['Lottery'].evm.bytecode.object;
// console.log(abi);
// console.log(bytecode);
exports.abi = abi;
exports.bytecode = bytecode;