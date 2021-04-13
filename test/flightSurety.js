
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });
  
let airline2 = accounts[2];
let airline3 = accounts[3];
let airline4 = accounts[4];
let airline5 = accounts[5];
   

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

describe('(multiparty) test stop loss functionality', function() {
  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try 
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });
 });
 
 describe('(airline) test airline functionality', function() {
    // Airline Contract Initialization: First airline is registered when contract is deployed.
    it('(airline) first airline is registered when contract is deployed', async () => {
     console.log(config.firstAirline) 

      let airlineInfo = await config.flightSuretyApp.getAirlinesInfo.call({from: config.owner});
      //console.log("test inf   "+ airlineInfo[1]);
       assert.equal(airlineInfo[1], config.firstAirlineName, "First airline is not registered when contract is deployed")
    });

    // Airline : Airline can be registered, but does not participate in contract until it submits funding of 10 ether
    it('(airline) cannot register an airline using registerAirline() if it is not funded', async () => {
      try {
        await config.flightSuretyApp.MultiPartyRegisterAirline("luftansa", "AM7573",airline2, {from: config.firstAirline}); // by default the first airline is funded
        
      }
      catch(e) {
        //console.log(e);
      }
      
      
      
      try {
        await config.flightSuretyApp.MultiPartyRegisterAirline("luftansa", "AM7573",airline3, {from: airline2});
        
      }
      catch(e) {
        //console.log(e);
      }
      
      let result = await config.flightSuretyData.getAirlineRegisterStatus.call(airline3); 
      assert.equal(result, false, "Airline can be registered, but does not participate in contract until it submits funding of 10 ether");
    });


    it('(airline) airline needs to be funded with 10 ether', async () => {
      const AIRLINE_FUNDING_VALUE_LOWER = web3.utils.toWei("5", "ether");

      let reverted = false;
      try {
        await config.flightSuretyApp.seedFunding.send({from: config.firstAirline, value: AIRLINE_FUNDING_VALUE_LOWER, gasPrice: 0})
      }
      catch(e) {
        //console.log(e);
        reverted = true;
      }

      assert.equal(reverted, true, "Funding seed must be 10 ether");
    });
   
   
    
    
    
    it('(airline) cannot register an airline more than once', async () => {
    
      let reverted = false;
      try {
         await config.flightSuretyApp.MultiPartyRegisterAirline("luftansa", "AM7573",airline2, {from: config.firstAirline});
        
      }
      catch(e) {
        //console.log(e);
        reverted = true;
      }

      assert.equal(reverted, true, "Airline cannot be registered twice");
    });
    
    
    // Multiparty Consensus: Only existing airline may register a new airline until there are at least four airlines registered
    // For the fifth a random vote has been hardcoded but can be removed in order to involves the already 4th validators !
    it('(airline) can register up to 4 airlines', async () => {
      let result = undefined;

      try {
         await config.flightSuretyApp.MultiPartyRegisterAirline("luftansa", "BE7573",airline3, {from: config.firstAirline});
      }
      catch(e) {
        console.log(e);
      }
      result = await config.flightSuretyData.getAirlineRegisterStatus.call(airline3);
      assert.equal(result, true, "Registering the third airline should be possible");

     try {
         await config.flightSuretyApp.MultiPartyRegisterAirline("luftansa", "CE7573",airline4, {from: config.firstAirline});
      }
      catch(e) {
        console.log(e);
      }
      result = await config.flightSuretyData.getAirlineRegisterStatus.call(airline4);
      assert.equal(result, true, "Registering the fourth airline should be possible");
    });
   }); 
});
