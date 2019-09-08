const { GENESIS_DATA,MINE_RATE } = require('./config');
const Block = require('./block');
const cryptohash = require('./crypto-hash');

describe('Block', () => {
  const timestamp = 2000;
  const lastHash = 'foo-hash';
  const hash = 'bar-hash';
  const data = ['blockchain', 'data'];
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({ timestamp, lastHash, hash, data , nonce , difficulty});

  it('has a timestamp, lastHash, hash, and data property', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  describe('genesis()', () => {
    const genesisBlock = Block.genesis();

    it('returns a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it('returns the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });
  describe('mineblock() ' , () => {
    const lastblock = Block.genesis();
    const data = 'mined data' ;
    const minedBlock = Block.mineBlock({lastblock, data});

    it('returns a Block instance', () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it('sets the lasthash to be the hash of the last block', () => {
      expect(minedBlock.lastHash).toEqual(lastblock.hash);
    });

    it('sets the data',() => {
      expect(minedBlock.data).toEqual(data);
    });

    it('it sets a timestamp', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it('creates a sha-256 hash based on the proper inputs',() =>{
      expect(minedBlock.hash).toEqual(cryptohash(
        minedBlock.timestamp,
        minedBlock.nonce,
        minedBlock.difficulty,
        lastblock.hash,
        data
        )
      );
    });

    it('sets a hash that matches the difficulty criteria',()=>{
      expect(minedBlock.hash.substring(0,minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
    });

    it('adjusts the difficulty', ()=>{
      const possibleresults = [lastblock.difficulty+1 , lastblock.difficulty-1];

      expect(possibleresults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe('adjustdifficulty()',()=>{
    it('raises the difficulty for a quickly mined block',()=>{
      expect(Block.adjustdifficulty({originalBlock : block , timestamp : block.timestamp+MINE_RATE-100})).toEqual(block.difficulty+1);
    });

    it('lower the difficulty for a slowly mined block',()=>{
      expect(Block.adjustdifficulty({originalBlock : block , timestamp : block.timestamp+MINE_RATE+100})).toEqual(block.difficulty-1);
    });
    
    it('has a lower limit of 1', ()=>{
      block.difficulty = -1;

      expect(Block.adjustdifficulty({originalBlock : block})).toEqual(1);
    });
  });
});