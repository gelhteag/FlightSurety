
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0x5228F27C50693e1236eb4A18AD65dA158Ac859a8",
        "0x0C0b6847Afd923c7c39Ae185ceF946318b82083a",
        "0x25aceD65F40188651cb4327A01A40309bc6aFc38",
        "0x7d1DD0648A962bBAD8316C0C3c436D4842DAefDD",
        "0x70E9637BFbD8F0a966147fE0AEC2EF2d850c0377",
        "0xbDEA0401133470718e30F74CACFFa23d69677fe5",
        "0xf00741dB5469732B10ea105bFAa398C78F1553C3",
        "0xf77Ef01E67AEEF52d564FeE2E55440A6257c9302",
        "0x9D8fddb48F1c2C7dd3bc1e14C133e9fBa4971BA2",
        "0xE17c47153aDb92fE5fC8E0B052a4CC1790a86154"

    ];


    let owner = accounts[0];
    let firstAirline = accounts[1];
    let firstAirlineName = "AM757";
    
    let flightSuretyData = await FlightSuretyData.new();
    let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);

    

    
    return {
        owner: owner,
        firstAirline: firstAirline,
        firstAirlineName:firstAirlineName,
        weiMultiple: (new BigNumber(10)).pow(18),
        testAddresses: testAddresses,
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp
    }
}

module.exports = {
    Config: Config
};
