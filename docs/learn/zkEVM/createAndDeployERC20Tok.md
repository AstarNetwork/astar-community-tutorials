# Astar zkEVM FAQs
# Create and Deploy an ERC-20 Token on Astar zkEVM

Before we begin, it's important to note that we'll be deploying the token on the zkEVM Testnet. You can access comprehensive information about zkEVM in the Astar documentation: [zkEVM Documentation](https://docs.astar.network/docs/build/zkEVM)

## Network Integration
To start, integrate the Testnet into your Metamask. Refer to the necessary network details [here](https://docs.astar.network/docs/build/zkEVM/quickstart) or in the following guide.

## Create Deployer Account
Generate a Test Wallet for this tutorial, as we'll need the private key to deploy the contract programmatically through Hardhat. Avoid using your regular wallet, and never commit your private key to a public repository. [Guide](https://docs.astar.network/docs/build/zkEVM/smart-contracts/using-hardhat)

## Faucet and Bridging
Bridging ETH from an ETH Testnet (Sepolia) to the zkEVM Testnet is the next step. Details can be found [here](https://docs.astar.network/docs/build/zkEVM/bridge-to-zkevm/). Acquire ETH Test Tokens for free from the [faucet](https://docs.astar.network/docs/build/zkEVM/zkevm-faucet), such as [Sepolia Faucet](https://sepolia-faucet.pk910.de/).

## Create and Deploy Smart Contract
Our ERC-20 token contract leverages the OpenZeppelin library for secure smart contract development. Deployment is handled through Hardhat, a powerful development environment for Ethereum. Follow the guides mentioned in the provided links.

## Hardhat Configuration
Ensure Hardhat is configured correctly in the `hardhat.config.js` file. Set up network details, including RPC URL and account private key.

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

This code configures the Hardhat environment for EVM smart contract development. It loads environment variables from a .env file, specifies Solidity version, sets the artifact output path, and defines the test network named "zKatana" with a specific RPC URL and an account using the private key stored in the environment variable ACCOUNT_PRIVATE_KEY.
Feel free to remove the Lock.sol file within the contracts folder. Subsequently, introduce a new file named Token.sol, containing the following code:
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
This Solidity smart contract, named MyToken, is an ERC-20 token with additional features. It inherits from OpenZeppelin contracts, implementing standard ERC-20 functionality, burnable capabilities, ownership management, and permit functionality. The constructor sets initial parameters, and a mint function allows the owner to create new tokens. You can change the initial parameters to whatever you want to name your token and symbol.
Clear the deploy.js script within the scripts folder and replace its contents with the following code. Don't forget to modify the initialOwnerAddress with your MetaMask public wallet address:
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
This JavaScript script deploys the smart contract named MyToken we have defined before using Hardhat. It obtains the contract factory, deploys the contract with a specified initial owner address, and waits for the deployment to be mined. The console then logs the deployed contract's address.
Remember to install the dotenv and the openzeppelin package aswell as we use it for our privat key and as a basis for our token smart contract:
npm install dotenv
npm install @openzeppelin/contracts
Nowe we can compile our token using the following command:
npx hardhat compile
Upon successful execution, you should observe the following output:
Having compiled our token smart contract, the next step is deployment. Execute the following command, specifying the network parameter as zKatana. This instructs the deployment to occur on the zKatana Network, as configured in the hardhat.config.js file:
npx hardhat run scripts/deploy.js --network zKatana
Upon successful execution, you should observe the following output:
Simply open your browser and enter the URL provided in the output to view your smart contract on the block explorer or zKatana.
Upon searching your public wallet address in the block explorer at https://zkatana.explorer.startale.com, expect to find a new transaction labeled "contract creation." The appearance of this transaction may take a minute, so please be patient. It should resemble the following:
Congratulations! You have successfully deployed your smart contract on the zKatana Blockchain.
Verify the Smart Contract
Next, let's verify the smart contract. You can refer to the Astar docs guide (https://docs.astar.network/docs/build/zkEVM/smart-contracts/verify-smart-contract), but I'll also guide you through the process. Navigate to your deployed smart contract on the Block Explorer, access the Contract tab, and proceed to click the Verify and Publish button.
Various methods exist for verifying a smart contract; we'll utilize Solidity flattened source code. Revisit your code editor, where you made adjustments to the token smart contract, and execute the following terminal command with Hardhat to flatten the contract code:
npx hardhat flatten > flattened.sol
In your root directory, you'll discover a flattened.sol file. Copy the code from flattened.sol and paste it into the contract code field. In my example, the EVM Version is "Paris," which you can identify from the npx hardhat compile output. We utilized compiler version v0.8.20 and have no optimization enabled.
Congratulations! You have successfully verified your deployed smart contract. If successful, a green tick should appear next to your contract, as illustrated in my screenshot for reference:
Mint your Tokens and add them to Metamask:
Navigate to the Contract section and access the Write Contract tab to mint some tokens. Ensure your wallet is connected to the address that deployed the token smart contract on the zKatana Network. Choose the recipient address (I'll select mine) and specify the number of tokens you wish to mint. Due to the 18 decimals in our token, when minting 100 tokens, append additional zeros. In this example, minting 100 tokens would require entering the following number: 100000000000000000000 as the minting amount.
Metamask will prompt for permission. After the transaction is successful, add the coin to Metamask. Copy your contract address, obtained from the output after deploying your smart contract with the npx hardhat deploy command. In Metamask, navigate to "Import Token," paste the contract address, and the symbol and decimals should auto-fill. Proceed to click "Continue," and your token will be visible in Metamask.
In the upcoming guide, we'll leverage the newly created token to establish a liquidity pair on QuickSwap https://quickswap.exchange/#/.