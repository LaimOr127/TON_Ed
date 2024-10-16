import { expect } from 'chai';
import { ContractA } from '../build/compiled_contractA.fif';

describe('ContractA', () => {
  it('should send message to contract B', async () => {
    const contractA = new ContractA();
    const result = await contractA.sendMessage('recipient-address', 1000);
    expect(result).to.equal(true);
  });
});
