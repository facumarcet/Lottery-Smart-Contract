const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
        .deploy({data: bytecode})
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows accounts to enter', async () => {
        for (let i = 0; i < 3; i++) {
            const currentAcount = accounts[i];
            await lottery.methods.enter().send({
                from: currentAcount,
                value: web3.utils.toWei('0.02', 'ether')
            });
            const players = await lottery.methods.getPlayers().call({
                from: currentAcount
            });
            assert.equal(currentAcount, players[i]);
            assert.equal(i+1, players.length);
        }
    });

    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.01', 'ether')
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('only manager can call pickwinner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('sends money to the winner and resets the lottery', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({from: accounts[0]});

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('0.8', 'ether'));
    });

});