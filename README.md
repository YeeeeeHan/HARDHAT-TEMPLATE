# crypto-playground

Repository containing code snippets relevant to web3, javascript and cryptography

# hardhat-template

Template code for hardhat, allowing user to develop, test and deploy smart contracts quickly

## Deployment

1. Install dependencies

   ```sh
   npm install
   ```

2. Rename .env-sample to .env

3. Run hardhat test

   ```sh
   REPORT_GAS=true npx hardhat test
   ```

4. Run local blockchain node

   ```sh
   npx hardhat node

   ```

5. (In separate console) Deploy to local node

   ```sh
   npx hardhat run scripts/deploy.js --network localhost
   ```

6. Testing in console

```sh
npx hardhat run scripts/deploy.js --network localhost
```

```sh
const Box = await ethers.getContractFactory('Box');
const box = await Box.attach('0x5fbdb2315678afecb367f032d93f642f64180aa3')
await box.store(42)
await box.retrieve()
```

6. Deploy to Goerli testnet and verify contract

```bash
hardhat run scripts/deploy-pet.ts --network polygon_mumbai
```
