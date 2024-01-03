const { apiClient, cryptography, transactions } = require('@liskhq/lisk-client');
const readline = require('readline');
const nacl = require('tweetnacl');

const RPC_ENDPOINT = 'wss://mainnet.lisk.io/rpc-ws';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
        if (client && client.close) {
          
        }
        rl.close();
        process.exit(0);
      }
    });
  });
});
