# Astar zkEVM FAQs
# Create and Deploy an ERC-20 Token on Astar zkEVM

Before we begin, it's important to note that we'll be deploying the token on the zkEVM Testnet. You can access comprehensive information about zkEVM in the Astar documentation: [zkEVM Documentation](https://docs.astar.network/docs/build/zkEVM)

## Network Integration
To start, let’s integrate the Testnet into our Metamask. You can find the necessary network details below or in the following guide https://docs.astar.network/docs/build/zkEVM/quickstart:

## Create Deployer Account
For this tutorial, kindly generate a Test Wallet (avoid using your regular wallet) since we’ll require the private key to programmatically deploy the contract through Hardhat. Always refrain from committing your private key to any public repository! Refer to this guide on obtaining your private key for Metamask: https://docs.astar.network/docs/build/zkEVM/smart-contracts/using-hardhat

## Faucet and Bridging
Proceeding to the next stage involves bridging ETH from an ETH Testnet (Sepolia) to the zkEVM Testnet. Detailed information on this process can be found here: https://docs.astar.network/docs/build/zkEVM/bridge-to-zkevm/

To acquire ETH Test Tokens, visit the faucets listed here https://docs.astar.network/docs/build/zkEVM/zkevm-faucet for a free distribution. I personally utilized this faucet: https://sepolia-faucet.pk910.de/.

## Create and Deploy Smart Contract
Our ERC-20 token contract will be built using the OpenZeppelin library (https://docs.openzeppelin.com/), while the creation and deployment of this smart contract will be handled through Hardhat (https://hardhat.org/hardhat-runner/docs/getting-started#overview) .

OpenZeppelin is renowned for secure smart contract development, providing standardized and audited contracts on platforms like Ethereum or Astar EVM/zkEVM. Hardhat, an EVM development environment, simplifies the entire development lifecycle with its built-in tasks, plugins, and robust developer tools.

Please follow the guides in the links I have posted to get hardhat installed on your system (there is an offical extension for VSCode). I will be using VSCode as my Code editor.

After you have installed it please run the following comand in your target folder to create a sample project with hardhat:

```bash
npx hardhat init
```

In this tutorial, opt for creating a JavaScript project and stick to the default choices for the remaining options. Following this, generate a .env file in your project’s source directory, configured as follows. Ensure to include your private key, as it’s necessary for the deployment process. To proceed, open the hardhat.config.js file and incorporate the following code:

```javascript
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
    solidity: "0.8.20",
    paths: {
        artifacts: "./src",
    },
    networks: {
        zKatana: {
            url: `https://rpc.zkatana.gelato.digital`,
            accounts: [process.env.ACCOUNT_PRIVATE_KEY],
        },
    },
};
```

This code configures the Hardhat environment for EVM smart contract development. It loads environment variables from a .env file, specifies Solidity version, sets the artifact output path, and defines the test network named “zKatana” with a specific RPC URL and an account using the private key stored in the environment variable ACCOUNT_PRIVATE_KEY.

Feel free to remove the Lock.sol file within the contracts folder. Subsequently, introduce a new file named Token.sol, containing the following code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    constructor(address initialOwner)
        ERC20("MemeTest", "MT")
        Ownable(initialOwner)
        ERC20Permit("MemeTest")
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

This Solidity smart contract, named MyToken, is an ERC-20 token with additional features. It inherits from OpenZeppelin contracts, implementing standard ERC-20 functionality, burnable capabilities, ownership management, and permit functionality. The constructor sets initial parameters, and a mint function allows the owner to create new tokens. You can change the initial parameters to whatever you want to name your token and symbol.

Clear the deploy.js script within the scripts folder and replace its contents with the following code. Don’t forget to modify the initialOwnerAddress with your MetaMask public wallet address:

```javascript
const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const MyToken = await hre.ethers.getContractFactory("MyToken");

    // Deploy the contract with the initial owner address
    const initialOwnerAddress = "YOUR METAMASK TEST ADDRESS"; // Replace with a valid address
    const deployedContract = await MyToken.deploy(initialOwnerAddress);

    // Wait for the deployment to be mined
    await deployedContract.waitForDeployment();

    console.log(
        `MyToken contract deployed to https://zkatana.explorer.startale.com/address/${deployedContract.target}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

This JavaScript script deploys the smart contract named MyToken we have defined before using Hardhat. It obtains the contract factory, deploys the contract with a specified initial owner address, and waits for the deployment to be mined. The console then logs the deployed contract’s address.

Remember to install the dotenv and the openzeppelin package aswell as we use it for our privat key and as a basis for our token smart contract:

```bash
npm install dotenv
npm install @openzeppelin/contracts
```

Now we can compile our token using the following command:

```bash
npx hardhat compile
```

Upon successful execution, you should observe the following output:
**Compiled 20 Solidity files successfully (evm: target: paris).**

Having compiled our token smart contract, the next step is deployment. Execute the following command, specifying the network parameter as zKatana. This instructs the deployment to occur on the zKatana Network, as configured in the hardhat.config.js file:

```bash
npx hardhat run scripts/deploy.js --network zKatana
```

Upon successful execution, you should observe the following output:
**MyToken contract deployed to https://zkatana.explorer.startale.com/address/YOUR_CONTRACT_ADDRESS**

Simply open your browser and enter the URL provided in the output to view your smart contract on the block explorer or zKatana.

Upon searching your public wallet address in the block explorer at https://zkatana.explorer.startale.com, expect to find a new transaction labeled “contract creation.” The appearance of this transaction may take a minute, so please be patient.

Congratulations! You have successfully deployed your smart contract on the zKatana Blockchain.

## Verify the Smart Contract

Next, let’s verify the smart contract. You can refer to the Astar docs guide (https://docs.astar.network/docs/build/zkEVM/smart-contracts/verify-smart-contract), but I’ll also guide you through the process. Navigate to your deployed smart contract on the Block Explorer, access the Contract tab, and proceed to click the Verify and Publish button.

Various methods exist for verifying a smart contract; we’ll utilize Solidity flattened source code. Revisit your code editor, where you made adjustments to the token smart contract, and execute the following terminal command with Hardhat to flatten the contract code:

```bash
npx hardhat flatten > flattened.sol
```

In your root directory, you’ll discover a flattened.sol file. Copy the code from flattened.sol and paste it into the contract code field. In my example, the EVM Version is “Paris,” which you can identify from the npx hardhat compile output. We utilized compiler version v0.8.20 and have no optimization enabled.

Congratulations! You have successfully verified your deployed smart contract. 

## Mint your Tokens and add them to Metamask:

Navigate to the Contract section and access the Write Contract tab to mint some tokens. Ensure your wallet is connected to the address that deployed the token smart contract on the zKatana Network. Choose the recipient address (I’ll select mine) and specify the number of tokens you wish to mint. Due to the 18 decimals in our token, when minting 100 tokens, append additional zeros. In this example, minting 100 tokens would require entering the following number: 100000000000000000000 as the minting amount.

Metamask will prompt for permission. After the transaction is successful, add the coin to Metamask. Copy your contract address, obtained from the output after deploying your smart contract with the npx hardhat deploy command. In Metamask, navigate to "Import Token," paste the contract address, and the symbol and decimals should auto-fill. Proceed to click "Continue," and your token will be visible in Metamask.

In the upcoming guide, we’ll leverage the newly created token to establish a liquidity pair on QuickSwap https://quickswap.exchange/#/.


## Reference

You can find the original guide here: https://medium.com/@sequaja.marco/launch-erc-20-token-on-astar-zkevm-8153576d3ac2
Contact: Sequaja#3605 on discord 
