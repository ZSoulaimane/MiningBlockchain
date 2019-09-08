const Blockchain = require ('./blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({data : 'initial'});

let prevtimestamp , nexttimestamp , nextBlock , timeDiff , average;

const times = [];

for ( let i=0 ; i<10000; i++){
    prevtimestamp = blockchain.chain[blockchain.chain.length-1].timestamp;

    blockchain.addBlock({data : 'block ${i}'});

    nextBlock = blockchain.chain[blockchain.chain.length-1];

    nexttimestamp = nextBlock.timestamp;
    timeDiff = nexttimestamp - prevtimestamp;
    times.push(timeDiff);

    average = times.reduce((total,num) =>(total + num))/times.length;

    console.log('time to mine block: '+timeDiff+'ms.Difficulty : '+nextBlock.difficulty+'. average time : '+average+'ms');
}