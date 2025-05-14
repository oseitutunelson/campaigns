const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const priceFeedAddress = "0x3aC23DcB4eCfcBd24579e1f34542524d0E4eDeA8";
  const Fund = await ethers.getContractFactory("Fund");
  const fund = await Fund.deploy(priceFeedAddress);

  await fund.waitForDeployment();
  console.log(`Contract deployed to: ${await fund.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
