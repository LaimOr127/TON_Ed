const { expect } = require("chai");
const { Blockchain, TonClient, internal } = require("@ton-community/sandbox");
const { ContractA, ContractB, ContractLong } = require("../build/compiled_contractA.abi.json");

describe("Contract interaction tests", () => {
  let blockchain;
  let contractA, contractB, contractLong;

  before(async () => {
    blockchain = await Blockchain.create();
    // Деплой контрактов
    contractA = blockchain.createContract(ContractA, {
      code: await TonClient.readCode("./build/compiled_contractA.fif"),
      data: {},
    });

    contractB = blockchain.createContract(ContractB, {
      code: await TonClient.readCode("./build/compiled_contractB.fif"),
      data: {},
    });

    contractLong = blockchain.createContract(ContractLong, {
      code: await TonClient.readCode("./build/compiled_contract_long.fif"),
      data: {},
    });

    await contractA.deploy();
    await contractB.deploy();
    await contractLong.deploy();
  });

  it("should send a message from ContractA to ContractB", async () => {
    await contractA.sendSimpleMessage({
      amount: 1000,
      to: contractB.address,
      body: {},
      mode: 1,
    });

    const balanceB = await contractB.getBalance();
    expect(balanceB).to.equal(1000);
  });

  it("should exchange large state data between contracts", async () => {
    const largeData = { key: "big_data" };
    const addr = contractA.address;

    await contractLong.largeStateExchange({
      stateData: largeData,
      info: addr,
    });

    // Проверка взаимодействия контрактов
    const response = await contractB.receiveMessage({ amount: 0, sender: addr, body: largeData });
    expect(response).to.exist;
  });
});
