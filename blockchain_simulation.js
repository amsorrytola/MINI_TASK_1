const crypto = require('crypto');

// Block class
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  // Simple SHA-256 hash function
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce)
      .digest('hex');
  }
}

// Create 3 linked blocks
const block1 = new Block(1, new Date().toISOString(), { amount: 100 }, '0');
const block2 = new Block(2, new Date().toISOString(), { amount: 200 }, block1.hash);
const block3 = new Block(3, new Date().toISOString(), { amount: 300 }, block2.hash);

// Display original blocks
console.log('Original Blockchain:');
console.log(JSON.stringify([block1, block2, block3], null, 2));

// Challenge: Tamper Block 1
block1.data.amount = 999;  // tampering data
block1.hash = block1.calculateHash(); // recalculate hash after tampering

// Without updating block2 and block3's previousHash, they become invalid
console.log('\nAfter Tampering Block 1:');
console.log(JSON.stringify([block1, block2, block3], null, 2));

// Validation function to check chain integrity
function isChainValid(blocks) {
  for (let i = 1; i < blocks.length; i++) {
    const current = blocks[i];
    const previous = blocks[i - 1];

    if (current.previousHash !== previous.hash) {
      return false;
    }

    if (current.hash !== current.calculateHash()) {
      return false;
    }
  }
  return true;
}

console.log('\nIs blockchain valid?', isChainValid([block1, block2, block3]) ? '✅ Yes' : '❌ No');
