const crypto = require('crypto');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  // Generate the hash using SHA-256
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce)
      .digest('hex');
  }

  // Simulate mining process
  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join('0'); // e.g., "0000" for difficulty 4
    console.log(`\n🧱 Starting to mine block #${this.index}`);
    console.log(`🔐 Target hash prefix: '${target}'`);
    console.log(`🧾 Block data:`, this.data);
    console.log(`🔗 Previous hash: ${this.previousHash}`);
    console.log(`\n🚀 Starting mining... This may take a few seconds...`);

    const startTime = Date.now();

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();

      // Visual feedback every 100,000 attempts
      if (this.nonce % 100000 === 0) {
        console.log(`🔄 Attempt #${this.nonce} → Hash: ${this.hash.substring(0, 20)}...`);
      }
    }

    const endTime = Date.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`\n✅ Block successfully mined!`);
    console.log(`💥 Final hash: ${this.hash}`);
    console.log(`🔁 Nonce found: ${this.nonce}`);
    console.log(`⏱️ Time taken: ${timeTaken} seconds`);
    console.log(`🔒 This hash starts with '${target}' so it meets the difficulty requirement!\n`);
  }
}

// Set difficulty
const difficulty = 4;

// Mine a block
const myBlock = new Block(1, new Date().toISOString(), { sender: "Alice", receiver: "Bob", amount: 42 }, '0');
myBlock.mineBlock(difficulty);

// Print final block structure
console.log('🧩 Final Mined Block Structure:');
console.log(JSON.stringify(myBlock, null, 2));
