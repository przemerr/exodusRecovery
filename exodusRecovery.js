const  cryptography  = require('@liskhq/lisk-cryptography');
const readline = require('readline');
const nacl = require('tweetnacl');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
  });
});
