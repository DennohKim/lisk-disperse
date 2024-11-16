# Disperse App for cKES

## cKES Hackathon by Mento Submission 

Disperse app lets you distribute CELO tokens like cKES to multiple addresses using a single transaction on the Celo blockchain.

## Features

- Distribute cKES or any ERC20 token on Celo to multiple addresses in one transaction
- Pay gas fees with CELO or cKES (Celo Kenyan Shilling stablecoin)
- User-friendly interface for inputting recipient addresses and amounts
- Support for various input formats
- Real-time transaction status updates

## Getting Started

### Prerequisites

- Node.js (v14.x or later recommended)
- npm or yarn
- MetaMask or any Web3 wallet with Celo support

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/disperse-celo-clone.git
   ```

2. Install the dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your configuration:
   ```
   CELO_MAINNET_RPC=https://forno.celo.org
   PRIVATE_KEY=your_private_key_here
   
   ```

4. Deploy the contract:
   ```
   npx hardhat run scripts/deploy.js --network celo
   ```

5. Update the `disperseAddress` in `frontend/src/utils/constants.ts` with the newly deployed contract address.

6. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   # or
   yarn dev
   ```

## Usage

1. Connect your Web3 wallet (ensure it's connected to the Celo network).
2. Enter recipient addresses and amounts in the text area.
4. Click "Disperse" to send the transaction.
5. Confirm the transaction in your wallet.
6. Wait for the transaction to be processed and check the status.


## License

This project is licensed under the MIT License.

## Acknowledgements

- Built with [Hardhat](https://hardhat.org/), [React](https://reactjs.org/), and [ethers.js](https://docs.ethers.io/)
- Celo integration powered by [Celo SDK](https://docs.celo.org/developer/)
