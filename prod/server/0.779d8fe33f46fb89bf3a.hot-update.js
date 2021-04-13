exports.id=0,exports.modules={"./src/server/server.js":function(e,t,i){"use strict";i.r(t);var s=i("./build/contracts/FlightSuretyApp.json"),n=i("./src/server/config.json"),r=i("./src/dapp/config.json"),a=i("web3"),o=i.n(a);function l(e,t){for(var i=0;i<t.length;i++){var s=t[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}var u=function(){function e(t,i){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);var n=r[t];this.web3=new o.a(new o.a.providers.HttpProvider(n.url)),this.flightSuretyApp=new this.web3.eth.Contract(s.abi,n.appAddress),this.initialize(i),this.owner=null,this.airlines=[],this.passengers=[],this.oracles=[],this.price=null,this.fee=10,this.CREDIT_MULTIPLIER=1.5;this.STATUS_CODES=[0,10,20,30,40,50]}var t,i,n;return t=e,(i=[{key:"initialize",value:function(e){var t=this;this.web3.eth.getAccounts((function(i,s){t.owner=s[0];for(var n=1;t.airlines.length<5;)t.airlines.push(s[n++]);for(;t.passengers.length<5;)t.passengers.push(s[n++]);e()}))}},{key:"MultiPartyRegisterAirline",value:function(e,t,i,s){var n={companyName:e,IATA:t,flight:flight,registered:i,airline:this.airlines[2]};this.flightSuretyApp.methods.MultiPartyRegisterAirline(n.companyName,n.IATA,n.registered,n.airline).send({from:this.owner},(function(e,t){callback(e,n)}))}},{key:"seedFunding",value:function(e){var t=this.weiMultiple*this.fee;this.flightSuretyApp.methods.seedFunding().send({from:e,value:t},(function(e,t){}))}},{key:"setInsurance",value:function(e,t){this.price=Number(e);var i={airline:this.airlines[2],passenger:this.passengers[1],price_wei:this.weiMultiple*e};this.flightSuretyApp.methods.setInsurance(i.airline).send({from:i.passenger,value:i.price_wei},(function(e,s){t(e,i)}))}},{key:"withdraw",value:function(e){var t={airline:this.airlines[2],passenger:this.passengers[1]};this.flightSuretyApp.methods.withdraw().send({from:t.passenger},(function(i,s){e(i,t)}))}},{key:"submitOracleResponse",value:function(e,t,i,s,n){var r={indexes:e,airline:this.airlines[2],flight:i,timestamp:s,statusCode:this.STATUS_CODES[Math.floor(Math.random()*this.STATUS_CODES.length)]};this.flightSuretyApp.methods.triggerOracleResponse(r.indexes,r.airline,r.flight,r.timestamp,r.statusCode).send({from:this.owner},(function(e,t){n(e,r)}))}},{key:"isOperational",value:function(e){this.flightSuretyApp.methods.isOperational().call({from:this.owner},e),console.log(this.owner)}},{key:"fetchFlightStatus",value:function(e,t){var i={airline:this.airlines[0],flight:e,timestamp:Math.floor(Date.now()/1e3)};this.flightSuretyApp.methods.fetchFlightStatus(i.airline,i.flight,i.timestamp).send({from:this.owner},(function(e,s){t(e,i)}))}}])&&l(t.prototype,i),n&&l(t,n),e}(),h=i("express"),c=i.n(h),f=n.localhost,p=new o.a(new o.a.providers.WebsocketProvider(f.url.replace("http","ws")));p.eth.defaultAccount=p.eth.accounts[0];var g=new p.eth.Contract(s.abi,f.appAddress),d=[];p.eth.getAccounts((function(e,t){t[0];for(var i=function(e){g.methods.registerOracle().send({from:t[e],value:p.utils.toWei("1","ether"),gas:45e5},(function(i,s){i?console.log(i):g.methods.getMyIndexes().call({from:t[e]},(function(i,s){if(i)console.log(i);else{var n={address:t[e],index:s};console.log("Oracle: ".concat(JSON.stringify(n))),d.push(n)}}))}))},s=20;s<40;s++)i(s)})),g.events.OracleRequest({fromBlock:0},(function(e,t){e?console.log(e):function(){for(var e=t.returnValues.index,i=t.returnValues.airline,s=t.returnValues.flight,n=t.returnValues.timestamp,r=u.STATUS_CODES[1],a=function(t){d[t].index.includes(e)&&g.methods.submitOracleResponse(e,i,s,n,r).send({from:d[t].address},(function(e,i){e?console.log(e):console.log("".concat(JSON.stringify(d[t]),": Status code ").concat(r))}))},o=0;o<d.length;o++)a(o)}()}));var m=c()();m.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})}));t.default=m}};