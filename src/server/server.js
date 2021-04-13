import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import contract from '../dapp/contract.js';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
const oraclesRegistered = 30;
const offset = 10; 
let oraclesArray = [];


/* Get random Flight status codees
 In order to generate the random number 0,10,20,30,40,50 for status from FlightSuretyApp contract related to status code  to submit the oracles
 Flight status codees
   UNKNOWN = 0
   TIME = 10
   LATE_AIRLINE = 20
   LATE_WEATHER = 30
   LATE_TECHNICAL = 40
   LATE_OTHER = 50
*/
function getRandomStatusCode() {
  return (Math.floor(Math.random()*6))*10;
}


// Setup application
web3.eth.getAccounts((error, accounts) => {
  let owner = accounts[0];

  
      /*
      ============Oracles register============
  	Register the number of oracles needed for the dapp, here an offset is set on the for loop in order to let the x first addresses available for the airlines/passengers/owner
      */
  for(let _=offset; _<oraclesRegistered ; _++) {
    flightSuretyApp.methods.registerOracle().send({from: accounts[_], value: web3.utils.toWei("1",'ether'), gas: 4500000}, (error, result) => {
      if(error) {
        console.log(error);
      }
      else {
        flightSuretyApp.methods.getMyIndexes().call({from: accounts[_]}, (error, result) => {
          if (error) {
            console.log(error);
          }
          else {
            let oracle = {address: accounts[_], index: result};
            console.log(`Oracle:\n   - address :${oracle.address}\n   - index :${oracle.index}`);
            oraclesArray.push(oracle);
          }
        });
      }
    });
  };
});

     /*
   
            ============Listen to OracleRequest event============
   
	     Event fired when flight status request is submitted
	     Oracles track this and if they have a matching index
	     they fetch data and submit a response
   
    */
flightSuretyApp.events.OracleRequest({fromBlock: 0}, function (error, event) {
  if (error) {
    console.log(error);
  }
  else {
    let returnValues = event.returnValues;
    for(let _=0; _<oraclesArray.length; _++) {
      if(oraclesArray[_].index.includes(returnValues.index)) {
        /*     
                    =================submitOracleResponse=================
		       
		Called by oracle when a response is available to an outstanding request
	    	For the response to be accepted, there must be a pending request that is open
	    	and matches one of the three Indexes randomly assigned to the oracle at the
	    	time of registration (i.e. uninvited oracles are not welcome)
	    	
    	*/
        flightSuretyApp.methods.submitOracleResponse(returnValues.index, returnValues.airline, returnValues.flight,returnValues.timestamp, getRandomStatusCode())
        .send({from: oraclesArray[_].address}, (error, result) => {
          if(error) {
            console.log(error);
          } 
          else {
            console.log(`${JSON.stringify(oraclesArray[_])}: Status code ${getRandomStatusCode()}`);
          }
        });
      }
    }
  }
});





const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

export default app;
