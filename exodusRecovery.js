const { cryptography } = require('@liskhq/lisk-client');
const readline = require('readline');
const nacl = require('tweetnacl');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

<<<<<<< HEAD
rl.question('Enter your private key (hex format): ', (privateKeyHex) => {
  rl.question('Enter your password for encryption: ', async (password) => {
    const privateKeyBytes = Buffer.from(privateKeyHex, 'hex');
    const publicKeyBytes = nacl.sign.keyPair.fromSeed(privateKeyBytes.slice(0, 32)).publicKey;
    const privateKeyWithPublicKey = Buffer.concat([privateKeyBytes, publicKeyBytes]);

    try {
      const address = cryptography.address.getAddressFromPrivateKey(privateKeyWithPublicKey);
      const address32 = cryptography.address.getLisk32AddressFromAddress(address);
      const publicKey = cryptography.ed.getPublicKeyFromPrivateKey(privateKeyWithPublicKey);

      const encryptedPrivateKey = await cryptography.encrypt.encryptMessageWithPassword(
        `{"privateKey":"${privateKeyWithPublicKey.toString('hex')}","recoveryPhrase":"dummy"}`,
        password
      );

      const cryptoPart = {
        ciphertext: encryptedPrivateKey.ciphertext,
        mac: encryptedPrivateKey.mac,
        kdf: 'argon2id',
        kdfparams: {
          parallelism: 4,
          iterations: 1,
          memorySize: 2097023,
          salt: encryptedPrivateKey.kdfparams.salt,
        },
        cipher: 'aes-128-gcm',
        cipherparams: {
          iv: encryptedPrivateKey.cipherparams.iv,
          tag: encryptedPrivateKey.cipherparams.tag,
        },
        version: '1'
      };

      const metadataPart = {
        name: 'exo',
        pubkey: publicKey.toString('hex'),
        path: "m/44'/134'/0'/0/0",
        address: address32,
        creationTime: new Date().toISOString(),
      };

      const result = {
        crypto: cryptoPart,
        metadata: metadataPart,
        version: 1
      };

      console.log(JSON.stringify(result, null, 2));

    } catch (error) {
      console.error('Error:', error);
    } finally {
      rl.close();
      process.exit(0);
    }
=======
const getClient = async () => {
  return await apiClient.createWSClient(RPC_ENDPOINT);
};

rl.question('Enter the recipient address: ', (recipientAddress) => {
  rl.question('Enter your private key (hex format): ', async (privateKeyHex) => {
    rl.question('Enter the amount to transfer (in LSK): ', async (amount) => {
      const privateKeyBytes = Buffer.from(privateKeyHex, 'hex');
      const publicKeyBytes = nacl.sign.keyPair.fromSeed(privateKeyBytes.slice(0, 32)).publicKey;
      const privateKeyWithPublicKey = Buffer.concat([privateKeyBytes, publicKeyBytes]);

      let client;
      try {
        client = await getClient();
        const address = cryptography.address.getAddressFromPrivateKey(privateKeyBytes);
        const address32 = cryptography.address.getLisk32AddressFromAddress(address);
        const authData = await client.invoke('auth_getAuthAccount', { address: address32 });
        const nonce = authData.nonce;

        const tx = await client.transaction.create({
          module: 'token',
          command: 'transfer',
          nonce: BigInt(nonce),
          fee: BigInt(transactions.convertLSKToBeddows('0.002')),
          params: {
            tokenID: Buffer.from('0000000000000000', 'hex'),
            amount: BigInt(transactions.convertLSKToBeddows(amount)),
            recipientAddress,
            data: ''
          }
        }, privateKeyWithPublicKey);

        console.log(`Transaction prepared:`, tx);
        const res = await client.transaction.send(tx);
        console.log('Transaction sent. Response:', res);
      } catch (error) {
        console.error('Error sending transaction:', error);
      } finally {
        rl.close();
        process.exit(0);
      }
    });
>>>>>>> 80752aabe5731ee1dae755ca82026dd26d39040b
  });
});
