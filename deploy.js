const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./compile');


const provider = new HDWalletProvider(
    'orange trophy inflict plate soon notice dizzy day tape piano van dust',
    'https://rinkeby.infura.io/v3/5b30aaa9296b48209425475d736395a6'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const res = await new web3.eth.Contract(abi)
        .deploy({data: bytecode})
        .send({gas: '1000000', from: accounts[0]});
    console.log('Contract deployed to', res.options.address);
};
deploy();