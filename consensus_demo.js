const crypto = require('crypto');

// Utility
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// ---------------------
// Block for PoW
// ---------------------
class Block {
  constructor(data, previousHash = '') {
    this.timestamp = new Date().toISOString();
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return sha256(this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce);
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    return this.nonce;
  }
}

// ---------------------
// ⛏️ PoW Simulation
// ---------------------
function simulatePoW(miners, difficulty) {
  console.log('\n⛏️ Simulating Proof of Work...');
  let winner = null;
  let fastestTime = Infinity;

  miners.forEach(miner => {
    const block = new Block({ from: 'A', to: 'B', amount: 10 }, 'prevHash');
    const start = Date.now();
    const nonce = block.mineBlock(difficulty);
    const timeTaken = Date.now() - start;

    console.log(`🔧 ${miner.name} finished mining in ${timeTaken}ms with nonce ${nonce}`);

    if (timeTaken < fastestTime) {
      fastestTime = timeTaken;
      winner = { ...miner, timeTaken, nonce, hash: block.hash };
    }
  });

  console.log(`🏆 PoW Winner: ${winner.name} in ${winner.timeTaken}ms → Hash: ${winner.hash}`);
  return winner;
}

// ---------------------
// 💰 PoS Simulation (weighted lottery)
// ---------------------
function simulatePoS(validators) {
  console.log('\n💰 Simulating Proof of Stake...');
  const totalStake = validators.reduce((sum, v) => sum + v.stake, 0);

  const lottery = [];
  validators.forEach(v => {
    for (let i = 0; i < v.stake; i++) {
      lottery.push(v.name);
    }
  });

  const selected = lottery[getRandomInt(0, lottery.length - 1)];
  const winner = validators.find(v => v.name === selected);

  console.log(`🏆 PoS Winner: ${winner.name} (Stake: ${winner.stake})`);
  return winner;
}

// ---------------------
// 🗳️ DPoS Simulation
// ---------------------
function simulateDPoS(delegates, voters) {
  console.log('\n🗳️ Simulating Delegated Proof of Stake...');
  
  // Reset votes
  delegates.forEach(d => (d.votes = 0));

  voters.forEach(voter => {
    const vote = delegates[getRandomInt(0, delegates.length - 1)];
    vote.votes++;
    console.log(`🗳️ ${voter} voted for ${vote.name}`);
  });

  // Sort and take top voted
  delegates.sort((a, b) => b.votes - a.votes);
  const top = delegates.filter(d => d.votes === delegates[0].votes);
  const chosen = top[getRandomInt(0, top.length - 1)];

  console.log(`🏆 DPoS Winner: ${chosen.name} (Votes: ${chosen.votes})`);
  return chosen;
}

// ---------------------
// ⚙️ Setup + Run All
// ---------------------

// PoW Miners
const miners = [
  { name: 'Miner1' },
  { name: 'Miner2' },
  { name: 'Miner3' }
];

// PoS Validators
const posValidators = [
  { name: 'ValidatorA', stake: getRandomInt(10, 100) },
  { name: 'ValidatorB', stake: getRandomInt(10, 100) },
  { name: 'ValidatorC', stake: getRandomInt(10, 100) }
];

// DPoS Delegates and Voters
const delegates = [
  { name: 'Delegate1' },
  { name: 'Delegate2' },
  { name: 'Delegate3' }
];
const voters = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eva'];

// Run simulations
const powWinner = simulatePoW(miners, 4);
const posWinner = simulatePoS(posValidators);
const dposWinner = simulateDPoS(delegates, voters);

// Final Summary
console.log('\n📊 Final Consensus Results:');
console.log(`✅ PoW Winner: ${powWinner.name}`);
console.log(`✅ PoS Winner: ${posWinner.name}`);
console.log(`✅ DPoS Winner: ${dposWinner.name}`);
