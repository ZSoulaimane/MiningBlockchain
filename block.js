const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptohash = require('./crypto-hash')

class Block {
  constructor({ timestamp, lastHash, hash, data,nonce,difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({lastblock,data}){
    const lastHash = lastblock.hash;
    let hash , timestamp;
    let { difficulty } = lastblock;
    let nonce = 0;

    do {
      nonce++;
      timestamp=Date.now();
      difficulty = Block.adjustdifficulty({originalBlock : lastblock , timestamp });
      hash=cryptohash(timestamp,lastHash , data,nonce,difficulty);
    } while (hash.substring(0,difficulty) !== '0'.repeat(difficulty));
    return new this({
      timestamp,
      lastHash,
      data,
      difficulty ,
      nonce ,
      hash

    });
  }
  static adjustdifficulty({originalBlock , timestamp}){
    const {difficulty} = originalBlock;

    const diffirence = timestamp - originalBlock.timestamp;

    if(difficulty < 1 ) return 1 ;

    if(diffirence > MINE_RATE) {return difficulty-1;}

    return difficulty+1;
  }
}

module.exports = Block;
