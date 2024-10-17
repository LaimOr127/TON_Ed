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

export class ContractB implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromAddress(address: Address) {
        return new ContractB(address);
    }

    static createFromConfig(code: Cell, workchain = 0) {
        const data = beginCell().endCell();
        const init = { code, data };
        return new ContractB(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendInternal(
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
            .storeUint(3, 32)
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
