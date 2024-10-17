const { expect } = require("chai");
const { Blueprint } = require("@ton-community/blueprint");

describe("ContractA and ContractB Interaction", function () {

    let contractA, contractB, addressA, addressB;

    before(async function () {
        this.timeout(10000);

        contractA = await Blueprint.loadFromSource(__dirname + "/../ContractA.fc").deploy();
        contractB = await Blueprint.loadFromSource(__dirname + "/../ContractB.fc").deploy();

        addressA = contractA.address;
        addressB = contractB.address;
    });

    it("should deploy ContractA and ContractB", async function () {
        expect(await contractA.isDeployed()).to.be.true;
        expect(await contractB.isDeployed()).to.be.true;
    });

    it("should send message from ContractA to ContractB", async function () {
        // Формируем сообщение для отправки
        await contractA.sendMessage(0, addressB, 1, Blueprint.createCell());

        // Проверяем, что ContractB получил сообщение
        const response = await contractB.getLastMessage();
        expect(response).to.have.property("op").that.equals(1);
    });

    it("should send reply from ContractB to ContractA", async function () {
        // ContractB отвечает ContractA
        await contractB.sendMessageToA(addressA);

        // Проверяем, что ContractA получил ответ
        const response = await contractA.getLastMessage();
        expect(response).to.have.property("op").that.equals(3);
    });
});
