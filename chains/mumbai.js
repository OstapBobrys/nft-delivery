require("dotenv").config();
const ethers = require("ethers");

const {
  getTokenID,
  createContractInstance,
  sendNFT,
  calculateGas,
  signers,
} = require("../helpers");

const contractAddress = process.argv[2];
const receiver = process.argv[3]; // 0x5F49CfE21B12ffD7fE0dDd11E91b2636F86D7358

if (!contractAddress || !receiver) {
  throw Error("Usage: node chains/mumbai.js <contractAddress> <receiver>");
}

const provider = new ethers.JsonRpcProvider(
  "https://polygon-mumbai-bor.publicnode.com" // Paste your RPC Provider
);

const gasSender = new ethers.Wallet(process.env.GAS_SENDER, provider);

const apiKey = process.env.POLYGON_API_KEY;
const mumbaiURL = "https://api-testnet.polygonscan.com/api";

const instance = createContractInstance(contractAddress, provider);

const main = async () => {
  for (let i = 0; i < signers.length; i++) {
    const signer = new ethers.Wallet(signers[i], provider);

    let tokenId;

    if (process.argv[4]) {
      tokenId = process.argv[4];
    } else {
      tokenId = await getTokenID(
        signer.address,
        contractAddress,
        apiKey,
        mumbaiURL
      );
    }

    if (tokenId) {
      const gas = await calculateGas(tokenId, instance, signer, receiver);

      const feeData = await provider.getFeeData();

      const tx = await gasSender.sendTransaction({
        to: signer.address,
        value: gas * 2n * feeData.gasPrice,
      });

      await tx.wait();

      if (await sendNFT(tokenId, instance, signer, receiver)) {
        console.log(
          `Successfully send tokenId: ${tokenId} | to: ${receiver} | from: ${signer.address}`
        );
      }
    } else {
      console.log(
        `No ERC-721 tokens found for ${signer.address} with Contract Address ${contractAddress}.`
      );
    }
  }

  console.log("Transfer NFT successfully completed!");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
