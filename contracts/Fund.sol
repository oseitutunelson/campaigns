// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {PriceConvertor} from "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract Fund is AutomationCompatibleInterface {
    using PriceConvertor for uint256;

    event CampaignCreated(
        string name,
        string description,
        string imageUrl,
        uint256 indexed goal,
        uint256 indexed deadline
    );

    address public owner;
    address[] public campaignCount;

    AggregatorV3Interface private s_priceFeed;
    uint256 public constant MINIMUM_USD = 5e18;

    struct Campaign {
        string name;
        string description;
        string imageUrl;
        uint256 fundingGoal;
        uint256 balance;
        uint256 deadline;
        bool fundingSuccessful;
        bool campaignExist;
        uint256 lastTimeStamp;
    }

    mapping(address => Campaign) public campaigns;
    mapping(address => address[]) public campaignFunders; // campaign => funders
    mapping(address => mapping(address => uint256)) public contributions; // campaign => (funder => amount)

    constructor(address priceFeed) {
        owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeed);
    }

    function createCampaign(
        string memory name,
        string memory description,
        string memory imageUrl,
        uint256 goal,
        uint256 deadline
    ) public {
        require(!campaigns[msg.sender].campaignExist, "Campaign already exists");

        campaigns[msg.sender] = Campaign({
            name: name,
            description: description,
            imageUrl: imageUrl,
            fundingGoal: goal,
            deadline: deadline,
            balance: 0,
            fundingSuccessful: false,
            campaignExist: true,
            lastTimeStamp: block.timestamp
        });

        campaignCount.push(msg.sender);

        emit CampaignCreated(name, description, imageUrl, goal, deadline);
    }

    function fundCampaign(address creator) public payable {
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "Amount too low");
        require(campaigns[creator].campaignExist, "Campaign doesn't exist");

        if (contributions[creator][msg.sender] == 0) {
            campaignFunders[creator].push(msg.sender);
        }

        contributions[creator][msg.sender] += msg.value;
        campaigns[creator].balance += msg.value;
    }

    function withdrawFromCampaign() public {
        Campaign storage campaign = campaigns[msg.sender];
        require(campaign.campaignExist, "Campaign doesn't exist");
        require(campaign.fundingSuccessful, "Funding not successful");

        uint256 amount = campaign.balance;
        campaign.balance = 0;
        campaign.campaignExist = false;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    function sendEther(address payable _to, uint256 amount) internal {
        (bool sent, ) = _to.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    function checkUpkeep(bytes memory checkData)
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        if (keccak256(checkData) == keccak256(hex"01")) {
            for (uint256 i = 0; i < campaignCount.length; i++) {
                address campaignAddr = campaignCount[i];
                Campaign storage campaign = campaigns[campaignAddr];
                if (campaign.balance >= campaign.fundingGoal && !campaign.fundingSuccessful) {
                    return (true, checkData);
                }
            }
        }

        if (keccak256(checkData) == keccak256(hex"02")) {
            for (uint256 i = 0; i < campaignCount.length; i++) {
                address campaignAddr = campaignCount[i];
                Campaign storage campaign = campaigns[campaignAddr];
                uint256 deadlineInSeconds = campaign.deadline * 1 days;

                if (
                    campaign.campaignExist &&
                    !campaign.fundingSuccessful &&
                    (block.timestamp - campaign.lastTimeStamp) > deadlineInSeconds
                ) {
                    return (true, checkData);
                }
            }
        }

        return (false, bytes(""));
    }

    function performUpkeep(bytes calldata performData) external override {
        if (keccak256(performData) == keccak256(hex"01")) {
            for (uint256 i = 0; i < campaignCount.length; i++) {
                address campaignAddr = campaignCount[i];
                Campaign storage campaign = campaigns[campaignAddr];

                if (campaign.balance >= campaign.fundingGoal && !campaign.fundingSuccessful) {
                    campaign.fundingSuccessful = true;
                }
            }
        }

        if (keccak256(performData) == keccak256(hex"02")) {
            for (uint256 i = 0; i < campaignCount.length; i++) {
                address campaignAddr = campaignCount[i];
                Campaign storage campaign = campaigns[campaignAddr];
                uint256 deadlineInSeconds = campaign.deadline * 1 days;

                if (
                    campaign.campaignExist &&
                    !campaign.fundingSuccessful &&
                    (block.timestamp - campaign.lastTimeStamp) > deadlineInSeconds
                ) {
                    address[] memory funders = campaignFunders[campaignAddr];

                    for (uint256 j = 0; j < funders.length; j++) {
                        address funder = funders[j];
                        uint256 amount = contributions[campaignAddr][funder];

                        if (amount > 0) {
                            contributions[campaignAddr][funder] = 0;
                            sendEther(payable(funder), amount);
                        }
                    }

                    campaign.campaignExist = false;
                    campaign.balance = 0;
                }
            }
        }
    }

    // ========== View Functions ==========

    function getAllCampaigns() public view returns (uint256) {
        return campaignCount.length;
    }

    function getCampaignName(address creator) public view returns (string memory) {
        return campaigns[creator].name;
    }

    function getCampaignBalance(address creator) public view returns (uint256) {
        return campaigns[creator].balance;
    }

    function getAllCampaignDetails()
    public
    view
    returns (
        string[] memory names,
        string[] memory descriptions,
        string[] memory imageUrls,
        uint256[] memory goals,
        uint256[] memory balances,
        uint256[] memory deadlines,
        bool[] memory fundingSuccesses,
        bool[] memory campaignExists,
        address[] memory creators // ← added
    )
{
    uint256 len = campaignCount.length;

    names = new string[](len);
    descriptions = new string[](len);
    imageUrls = new string[](len);
    goals = new uint256[](len);
    balances = new uint256[](len);
    deadlines = new uint256[](len);
    fundingSuccesses = new bool[](len);
    campaignExists = new bool[](len);
    creators = new address[](len); // ← added

    for (uint256 i = 0; i < len; i++) {
        address campaignAddr = campaignCount[i];
        Campaign storage campaign = campaigns[campaignAddr];

        names[i] = campaign.name;
        descriptions[i] = campaign.description;
        imageUrls[i] = campaign.imageUrl;
        goals[i] = campaign.fundingGoal;
        balances[i] = campaign.balance;
        deadlines[i] = campaign.deadline;
        fundingSuccesses[i] = campaign.fundingSuccessful;
        campaignExists[i] = campaign.campaignExist;
        creators[i] = campaignAddr;
    }
}

    function getAllCampaignAddresses() public view returns (address[] memory) {
    return campaignCount;
}

}
