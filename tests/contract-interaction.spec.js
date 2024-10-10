import { Blockchain, Contract } from '@ton-community/blueprint';
import { ContractA } from './ContractA';
import { ContractB } from './ContractB';

describe('Contract Interaction Tests', () => {
    let blockchain;
    let contractA;
    let contractB;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        contractA = blockchain.createContract(ContractA);
        contractB = blockchain.createContract(ContractB);

        // Инициализация контрактов
        await contractA.deploy({ value: 1000000000 });
        await contractB.deploy({ value: 1000000000 });
    });

    it('should send bounceable message from Contract A to Contract B', async () => {
        // Тест на отправку bounceable сообщения от Контракта A к Контракту B
        const msgBody = beginCell()
            .storeUint(1, 32)  // Операция 1
            .storeAddress(contractB.address)
            .storeCoins(1000000)  // Сумма перевода
            .endCell();

        await contractA.sendExternal({ value: 10000000, body: msgBody });

        const state = await contractB.getState();
        expect(state.balance).toBe(1000000);
    });

    it('should send response with body from Contract B to Contract A', async () => {
        // Тест на отправку сообщения с телом от Контракта B к Контракту A
        const msgBody = beginCell()
            .storeUint(3, 32)  // Операция 3
            .storeAddress(contractA.address)
            .storeCoins(500000)
            .endCell();

        await contractB.sendExternal({ value: 10000000, body: msgBody });

        const state = await contractA.getState();
        expect(state.balance).toBe(500000);
    });
});
