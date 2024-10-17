import { toNano } from '@ton/core';
import { ContractA } from '../contract/ContractA';
import { ContractB } from '../contract/ContractB';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // Компиляция контрактов
    const codeA = await compile('contracts/ContractA.fc');
    const codeB = await compile('contracts/ContractB.fc');

    // Создание экземпляров контрактов
    const contractA = provider.open(ContractA.createFromConfig(codeA));
    const contractB = provider.open(ContractB.createFromConfig(codeB));

    // Деплой контрактов с соответствующими значениями
    await contractA.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(contractA.address);

    await contractB.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(contractB.address);

    // Пример вызова метода на ContractA
    // await contractA.sendExternal(provider.sender(), {
    //     value: toNano('0.1'),
    //     seqno: 0,
    //     to: contractB.address,
    //     amount: toNano('0.1'),
    //     body: new Cell(),
    // });

    // Пример вызова метода на ContractB
    // await contractB.sendInternal(provider.sender(), {
    //     value: toNano('0.1'),
    //     seqno: 0,
    //     to: contractA.address,
    //     amount: toNano('0.1'),
    //     body: new Cell(),
    // });
}
