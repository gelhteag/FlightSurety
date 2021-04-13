import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi,config.appAddress);
        
        
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
        this.oracles = [];
        this.price = null;
        this.fee = 10;


        
    }        

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
           
            this.owner = accts[0];

            let counter = 1;
            
            while(this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }
   // Airline registration 
   MultiPartyRegisterAirline(companyName,IATA,registered,airline){
        let self =this;
        
        let payload = {
            companyName: companyName,
            IATA: IATA,
            flight: flight,
            registered: registered,
            airline: self.airlines[2]
        }
        self.flightSuretyApp.methods
            .MultiPartyRegisterAirline(payload.companyName,payload.IATA,payload.registered,payload.airline)
            .send({from: self.owner}, (error, result) => {
		callback(error, payload);
            });
    }
    // Airline fund seed for participation 
    seedFunding(airlineAddress){
        let self = this;
        let seedfee = this.weiMultiple * this.fee; // Web3.utils.toWei("10", "ether");

        self.flightSuretyApp.methods
            .seedFunding()
            .send({from: airlineAddress, value: seedfee}, (error, result) =>{
		
            });

    }
    

    
    // Passenger insurance subscribe
    setInsurance(price, callback){
        let self = this;
        self.price = Number(price);
        let payload = {
            airline: self.airlines[2],
            passenger: self.passengers[1],
            price_wei: self.weiMultiple * price, //  Web3.utils.toWei(price.toString(), "ether")
        }
        self.flightSuretyApp.methods
            .setInsurance(payload.airline)
            .send({from: payload.passenger, value: payload.price_wei}, (error, result) => {
                callback(error, payload);
            });
    }
    // Passenger insurance subscribe
    withdraw(callback){
        let self = this;
        let payload = {
            airline :   self.airlines[2],
            passenger: self.passengers[1]
        }
        self.flightSuretyApp.methods
        .withdraw()
        .send({from: payload.passenger}, (error, result) => {
            callback(error, payload);
        });
        
    }    
    
    submitOracleResponse(indexes, airline, flight, timestamp, callback){
        let self = this;


        let payload = {
            indexes: indexes,
            airline: self.airlines[2],
            flight: flight,
            timestamp: timestamp,
            statusCode: self.STATUS_CODES[Math.floor(Math.random()*self.STATUS_CODES.length)]
        }
        self.flightSuretyApp.methods
            .triggerOracleResponse(payload.indexes, payload.airline, payload.flight, payload.timestamp, payload.statusCode)
            .send({from: self.owner}, (error, result) =>{
                callback(error, payload);

            });

    }


    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, callback);
            console.log(self.owner)

    }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }
    
}

