const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')
const MNEMONIC = "area advice denial fantasy curtain pool tide finger picnic olive copy curious"
const INFURA_KEY = "3786dbf4174f4c62814969ffe77b7193"
const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS
const NFT_CONTRACT_ADDRESS = "0x1cC6125B5EBd4423EE63aAE2389d0Dc9Bd7Ab9Fe"
const OWNER_ADDRESS = "0x4d0471AE48Ab604722B2B045D26791f45AFA8299"
const NETWORK = "ropsten"
const NUM_LOOTBOXES = 4
const DEFAULT_OPTION_ID = 0
const LOOTBOX_OPTION_ID = 2

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return // if i dont have any of this shit it gives me an error 
}

const NFT_ABI = [{
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "mintTo",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}]

const FACTORY_ABI = [{ // this is useless 
    "constant": false,
    "inputs": [
      {
        "name": "_optionId",
        "type": "uint256"
      },
      {
        "name": "_toAddress",
        "type": "address"
      }
    ],
    "name": "mint",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}]

async function main() {
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`)
    const web3Instance = new web3(
        provider
    )

    if (NFT_CONTRACT_ADDRESS) {
        const nftContract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" })

        // Creatures issued directly to the owner.
            const result = await nftContract.methods.mintTo(OWNER_ADDRESS).send({ from: OWNER_ADDRESS });
            console.log("Minted creature. Transaction: " + result.transactionHash)
        
    } else if (FACTORY_CONTRACT_ADDRESS) {
        const factoryContract = new web3Instance.eth.Contract(FACTORY_ABI, FACTORY_CONTRACT_ADDRESS, { gasLimit: "1000000" })

        // Creatures issued directly to the owner.
        for (var i = 0; i < NUM_CREATURES; i++) {
            const result = await factoryContract.methods.mint(DEFAULT_OPTION_ID, OWNER_ADDRESS).send({ from: OWNER_ADDRESS });
            console.log("Minted creature. Transaction: " + result.transactionHash)
        }

        // Lootboxes issued directly to the owner.
        for (var i = 0; i < NUM_LOOTBOXES; i++) {
            const result = await factoryContract.methods.mint(LOOTBOX_OPTION_ID, OWNER_ADDRESS).send({ from: OWNER_ADDRESS });
            console.log("Minted lootbox. Transaction: " + result.transactionHash)
        }
    }
}

main()