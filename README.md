# Interact:
## Step 1. Clone repository and install dependencies:

    git clone https://github.com/OstapBobrys/nft-delivery.git
    cd nft-delivery
    npm i

## Step 2. Create .env file or rename .env.example to .env:

    ETHERSCAN_API_KEY=
    BSCSCAN_API_KEY=
    POLYGON_API_KEY=
    ARBITRUM_API_KEY=
    GAS_SENDER=
## Step 3. Change `signers` array with your private keys:

    File: `helpers.js`. Line: 32
    Two options:
        1. Add all private keys to `.env` file, example:
            PRIVATE_KEY=
            PRIVATE_KEY_2=
            PRIVATE_KEY_3=
            PRIVATE_KEY_4=

            const signers = [
                process.env.PRIVATE_KEY,
                process.env.PRIVATE_KEY_2,
                process.env.PRIVATE_KEY_3,
                process.env.PRIVATE_KEY_4,
                ...
                process.env.PRIVATE_KEY_N
            ];

        2. Just add the private keys directly to the array:
            const signers = [
                'privateKey',
                'privateKey',
                'privateKey',
                'privateKey',
                ...
                'privateKey'
            ];
## Step 4. Call script:
    ETH: 
    ```
    node chains/ethereum.js <contractAddress> <receiver>
    ```
    BSC: 
    ```
    node chains/bsc.js <contractAddress> <receiver>
    ```
    Polygon: 
    ```
    node chains/polygon.js <contractAddress> <receiver>
    ```
    Arbitrum: 
    ```
    node chains/arbitrum.js <contractAddress> <receiver>
    ```
## For test you can use Mumbai:
    node chains/mumbai.js <contractAddress> <receiver>
