import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
} from 'ton-core';

export class ContractA implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromAddress(address: Address) {
        return new ContractA(address);
    }

    static createFromConfig(code: Cell, workchain = 0) {
        const data = beginCell().endCell();
        const init = { code, data };
        return new ContractA(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendExternal(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        seqno: number,
        to: Address,
        amount: bigint,
        body: Cell
    ) {
        const msgBody = beginCell()
            .storeUint(seqno, 32)
            .storeUint(1, 32)
            .storeAddress(to)
            .storeCoins(amount)
            .storeRef(body)
            .endCell();

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msgBody,
        });
    }
}
