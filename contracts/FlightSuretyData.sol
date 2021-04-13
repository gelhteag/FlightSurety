pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false

    
    
    /*===================================  Airlines Variables   =================================*/ 
    uint256 public airlineCount = 0;
    uint256 public constant AirlineRegistrationFee = 10 ether;
    
    
     struct airliner {
      string companyName;
      string IATA; //airline designators, sometimes called IATA reservation codes, are two-character codes assigned by the International Air Transport Association  
      bool registered;
      bool funded;
      mapping(address => bool) delegator; //Participants of the elections process
      }
      mapping(address => airliner) private airlinerAddress;
    
    
    

    
    /*=================================== End Airlines Variables    =================================*/ 
    
    /*
    struct passenger {
      bool exist;
      uint256 status;
      bool add;
      string IATA; //airline designators, sometimes called IATA reservation codes, are two-character codes assigned by the International Air Transport Association  
      uint256 departure;
      uint256 price;
      mapping(address => bool) flightInsured;
    }*/
    
    struct insurancesContract {
      uint256 airlineRegistrationFee;
      uint256 passengerFee;
      
    }
    mapping(uint => insurancesContract) termsInsurance;
    
    struct InsuranceIndex {
      uint256 passengerShare;
      address passenger;
    }
    mapping(address => InsuranceIndex) insuranceIndex;
    
    struct InsuranceTreasury{
      uint256 amount;    	
    }
    mapping(address => InsuranceTreasury) insuranceTreasury;
    
    mapping(address => uint256) private credit;
    
    //mapping(bytes32 => clientFlights) private flights;
    mapping(address => uint256) passengerAccount;
    mapping(address => uint256) private authorizedCallers;
    
    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/
    event AuthorizedContract(address authContract);
    event DeAuthorizedContract(address authContract);
    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                ) 
                                public 
    {
        contractOwner = msg.sender;
        
        
        insurancesContract memory Insurance;
        Insurance.airlineRegistrationFee = 10 ether;
        Insurance.passengerFee = 1 ether;
        termsInsurance[1] = Insurance;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
         
        require(operational, "Contract is currently not operational");  
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner.");
        _;
    }
    /**
    * @dev Modifier that requires the "passenger" account to be insure
    */
     modifier requireIsInsure(address airline, address passenger)
    {
        require(insuranceIndex[airline].passenger == passenger, "Passenger is not insured.");
        _;
    }
    /**
    * @dev Modifier that requires the "amount" credited to be right
    */
     modifier requireIsRightCredited(address airline,uint256 amount)
    {
        require(insuranceIndex[airline].passengerShare.mul(3).div(2) == amount, "Wrong credited amount.");
        _;
    }
    /**
    * @dev Modifier that requires the "passenger" account and the "airline" account to be valide
    */
     modifier requireIsAccountValide(address passenger,address airline)
    {
        require((passenger != address(0)) && (airline != address(0)), "'accounts address must be  valid.");
        _;
    }



    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner 
    {
        operational = mode;
    }
     function authorizeCaller
                            (
                                address contractAddress
                            )
                            external
                            requireContractOwner
    {
        authorizedCallers[contractAddress] = 1;
        emit AuthorizedContract(contractAddress);
    }
    function deauthorizeContract
                            (
                                address contractAddress
                            )
                            external
                            requireContractOwner
    {
        delete authorizedCallers[contractAddress];
        emit DeAuthorizedContract(contractAddress);
    }


    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/
    
    
   /*===================================  Airlines functions   =================================*/ 

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
     
    function registerAirline
                            (
                            string companyName, string IATA, bool registered, bool funded, address delegator                            
                            )
                            external                            
    {
    
        airliner memory addAirline;
        addAirline.companyName = companyName;
        addAirline.IATA = IATA;
        addAirline.registered = registered;
        addAirline.funded = funded; //===> false not already participate to the seed funding 
        airlinerAddress[delegator] = addAirline;
        airlineCount = airlineCount.add(1);

    }
    
    //******************  transactions tools ******************
    function sendFund
    		     (
    		     address Owner, uint256 amount
    		     )
    		     external
    {
        Owner.transfer(amount);
        
        airlinerAddress[Owner].funded = true;
        
    }
    
    
    
   
    
    // ******************* setter/getter function for insurancesContract struct *******************
    
    function getAirlineRegistrationFee
    					(
    					)
    					external 
    					requireIsOperational 
    					returns(uint256)
    {
        
        return termsInsurance[1].airlineRegistrationFee;
    }
    
    
    // ******************* setter/getter function for airliner struct *******************
    
      function getAirlineRegisterStatus
      					(
      					address account
      					) 
      					external 
      					requireIsOperational 
      					returns(bool)
    {
        return airlinerAddress[account].registered;
    }

   

    
    /*=================================== Insurance subscription =================================*/ 
    
    function getAirlineFundingStatus
      					(
      					address account
      					) 
      					external 
      					requireIsOperational 
      					returns(bool)
    {
        return airlinerAddress[account].funded;
    }

    function _setInsurance
    			(
    			address airline, address passenger, uint256 share
    			) 
    			external 
    			requireIsOperational
    {
        insuranceIndex[airline] = InsuranceIndex({
            passengerShare: share,
            passenger: passenger
        });
        uint256 getShare = insuranceTreasury[airline].amount;
        insuranceTreasury[airline].amount = getShare.add(share);
    }
   
    /**
     *  @dev Credits payouts to insurees
    */
    function setCreditInsurance
                                (
                                    address airline,
                                    address passenger,
                                    uint256 amount
                                )
                                external
                                requireIsOperational
                                requireIsInsure(airline,passenger)
				 requireIsRightCredited(airline,amount)
				 //requireIsAccountValide
							      
    {
        // Amount to be credited
        uint256 insureAmount =insuranceIndex[airline].passengerShare.mul(3).div(2);

       
        // Keep track of amount to be credited in passenger account
        passengerAccount[passenger] = insureAmount;

    }
    function getInsuredIndexPassengers
    					(
    					address airline
    					)
    					 external 
    					 requireIsOperational  
    					 returns(address, uint256)
    {
        return (insuranceIndex[airline].passenger,insuranceIndex[airline].passengerShare);
    }
    function _getAirlinesInfo
    					(
    					//address airline
    					)
    					 external 
    					 requireIsOperational  
    					 returns(string memory, string memory)
    {
        return (airlinerAddress[0x0C0b6847Afd923c7c39Ae185ceF946318b82083a].companyName,airlinerAddress[0x0C0b6847Afd923c7c39Ae185ceF946318b82083a].IATA);
    }
    function _withdraw
                        (
                            address passenger
                        )
                        external
                        
                        requireIsOperational
                        returns(uint256)
    {
        uint256 withdraw = passengerAccount[passenger];
        delete passengerAccount[passenger];
        return withdraw;
    }
    
  

    
    
    

   
   

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }
   

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() 
                            external 
                            payable 
    {
       // sendFund();
    }


}

