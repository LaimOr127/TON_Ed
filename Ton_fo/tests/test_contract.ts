import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, Address } from 'ton-core';
import { compileFunc } from '@ton-community/blueprint';
import { ContractA } from '../Ton_F/contract/ContractA';
import { ContractB } from '../Ton_F/contract/ContractB';

describe('Contract Interaction', () => {
    let blockchain: Blockchain;
    let contractA: SandboxContract;
    let contractB: SandboxContract;
    let deployer: SandboxContract;

    beforeAll(async () => {
        // Инициализация блокчейна
        blockchain = await Blockchain.create();

        // Компиляция контрактов
        const contractACompiled = await compileFunc('contracts/ContractA.fc');
        const contractBCompiled = await compileFunc('contracts/ContractB.fc');

        // Создание развертывателей для контрактов A и B
        deployer = await blockchain.treasury('deployer');

        // Деплой контрактов A и B
        contractA = await blockchain.deploy(ContractA.createFromConfig(contractACompiled, deployer.getSender(), toNano('1')));
        contractB = await blockchain.deploy(ContractB.createFromConfig(contractBCompiled, deployer.getSender(), toNano('1')));
    });

    it('should send message from ContractA to ContractB', async () => {
        const messageBody = new Cell();

        // Отправляем сообщение из ContractA в ContractB
        await contractA.sendExternal(deployer.getSender(), {
            value: toNano('0.1'),
            seqno: 0, // Используйте корректный seqno в зависимости от вашей логики
            to: contractB.address,
            amount: toNano('0.1'),
            body: messageBody,
        });

        const result = await blockchain.run();
        expect(result.ok).toBe(true);
    });

    it('should handle internal message from ContractB', async () => {
        const messageBody = new Cell(); // Формируем тело сообщения

        // Отправляем внутреннее сообщение из ContractB
        await contractB.sendInternal(deployer.getSender(), {
            value: toNano('0.2'),
            seqno: 0, // Используйте корректный seqno в зависимости от вашей логики
            to: contractA.address,
            amount: toNano('0.2'),
            body: messageBody,
        });

        const result = await blockchain.run();
        expect(result.ok).toBe(true);
    });
});
