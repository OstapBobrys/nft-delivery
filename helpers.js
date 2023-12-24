const axios = require("axios");
const ethers = require("ethers");

const ERC721 = {
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

const signers = [
  process.env.PRIVATE_KEY, // 0xbCAe8fb7A84f437d15760779897bfCB11E5AA969
  process.env.PRIVATE_KEY_2, // 0x9316da8aF53d5030a22997345b338F628Cf69606
  process.env.PRIVATE_KEY_3, // 0x5B1D72Dce914FC4fB24d2BfBa4DdBdd05625152D
  process.env.PRIVATE_KEY_4, // 0xdfB793dfA0b99DA6C7628dbDbE3F40Fa68991bd5
];

async function getTokenID(address, contractAddress, apiKey, url) {
  try {
    const response = await axios.get(url, {
      params: {
        module: "account",
        action: "tokennfttx",
        address: address,
        contractaddress: contractAddress,
        apiKey,
      },
    });

    const tokenData = response.data.result;

    const ids = [];

    for (let i = tokenData.length - 1; i >= 0; i--) {
      if (tokenData[i].to.toLowerCase() != address.toLowerCase()) {
        ids.push(tokenData[i].tokenID);
      }

      if (tokenData[i].to.toLowerCase() == address.toLowerCase()) {
        if (ids.includes(tokenData[i].tokenID)) {
          continue;
        } else {
          return tokenData[i].tokenID;
        }
      }
    }

    return null;
  } catch (error) {
    throw error;
  }
}

function createContractInstance(contractAddress, provider) {
  const instance = new ethers.Contract(contractAddress, ERC721.abi, provider);

  return instance;
}

async function sendNFT(tokenId, contractInstance, signer, to) {
  await contractInstance.connect(signer).transferFrom(signer, to, tokenId);

  return true;
}

async function calculateGas(tokenId, contractInstance, signer, to) {
  const data = contractInstance.interface.encodeFunctionData("transferFrom", [
    signer.address,
    to,
    tokenId,
  ]);

  const transaction = {
    to: contractInstance.target,
    data: data,
    from: signer.address,
  };

  const estimateGas = await signer.estimateGas(transaction);

  return estimateGas;
}

module.exports = {
  getTokenID,
  createContractInstance,
  sendNFT,
  calculateGas,
  signers,
};
