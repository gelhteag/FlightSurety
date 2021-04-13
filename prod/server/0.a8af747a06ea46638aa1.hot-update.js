exports.id=0,exports.modules={"./src/server/server.js":function(e,t,i){"use strict";i.r(t);var n=i("./build/contracts/FlightSuretyApp.json"),s=i("./src/server/config.json"),r=i("./src/dapp/config.json"),a=i("web3"),o=i.n(a);function l(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var u=function(){function e(t,i){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);var s=r[t];this.web3=new o.a(new o.a.providers.HttpProvider(s.url)),this.flightSuretyApp=new this.web3.eth.Contract(n.abi,s.appAddress),this.initialize(i),this.owner=null,this.airlines=[],this.passengers=[],this.oracles=[],this.price=null,this.fee=10,this.CREDIT_MULTIPLIER=1.5;this.STATUS_CODES=Array(0,10,20,30,40,50)}var t,i,s;return t=e,(i=[{key:"initialize",value:function(e){var t=this;this.web3.eth.getAccounts((function(i,n){t.owner=n[0];for(var s=1;t.airlines.length<5;)t.airlines.push(n[s++]);for(;t.passengers.length<5;)t.passengers.push(n[s++]);e()}))}},{key:"MultiPartyRegisterAirline",value:function(e,t,i,n){var s={companyName:e,IATA:t,flight:flight,registered:i,airline:this.airlines[2]};this.flightSuretyApp.methods.MultiPartyRegisterAirline(s.companyName,s.IATA,s.registered,s.airline).send({from:this.owner},(function(e,t){callback(e,s)}))}},{key:"seedFunding",value:function(e){var t=this.weiMultiple*this.fee;this.flightSuretyApp.methods.seedFunding().send({from:e,value:t},(function(e,t){}))}},{key:"setInsurance",value:function(e,t){this.price=Number(e);var i={airline:this.airlines[2],passenger:this.passengers[1],price_wei:this.weiMultiple*e};this.flightSuretyApp.methods.setInsurance(i.airline).send({from:i.passenger,value:i.price_wei},(function(e,n){t(e,i)}))}},{key:"withdraw",value:function(e){var t={airline:this.airlines[2],passenger:this.passengers[1]};this.flightSuretyApp.methods.withdraw().send({from:t.passenger},(function(i,n){e(i,t)}))}},{key:"submitOracleResponse",value:function(e,t,i,n,s){var r={indexes:e,airline:this.airlines[2],flight:i,timestamp:n,statusCode:this.STATUS_CODES[Math.floor(Math.random()*this.STATUS_CODES.length)]};this.flightSuretyApp.methods.triggerOracleResponse(r.indexes,r.airline,r.flight,r.timestamp,r.statusCode).send({from:this.owner},(function(e,t){s(e,r)}))}},{key:"isOperational",value:function(e){this.flightSuretyApp.methods.isOperational().call({from:this.owner},e),console.log(this.owner)}},{key:"fetchFlightStatus",value:function(e,t){var i={airline:this.airlines[0],flight:e,timestamp:Math.floor(Date.now()/1e3)};this.flightSuretyApp.methods.fetchFlightStatus(i.airline,i.flight,i.timestamp).send({from:this.owner},(function(e,n){t(e,i)}))}}])&&l(t.prototype,i),s&&l(t,s),e}(),h=i("express"),c=i.n(h);var f=s.localhost,p=new o.a(new o.a.providers.WebsocketProvider(f.url.replace("http","ws")));p.eth.defaultAccount=p.eth.accounts[0];var d=new p.eth.Contract(n.abi,f.appAddress),g=[],m=0;function v(){return function(e){throw new TypeError('"'+e+'" is read-only')}("counter"),m=1,u.STATUS_CODES[Math.floor(Math.random()*m)]}p.eth.getAccounts((function(e,t){t[0];for(var i=function(e){d.methods.registerOracle().send({from:t[e],value:p.utils.toWei("1","ether"),gas:45e5},(function(i,n){i?console.log(i):d.methods.getMyIndexes().call({from:t[e]},(function(i,n){if(i)console.log(i);else{var s={address:t[e],index:n};console.log("Oracle: ".concat(JSON.stringify(s))),g.push(s)}}))}))},n=20;n<40;n++)i(n)})),d.events.OracleRequest({fromBlock:0},(function(e,t){e?console.log(e):function(){for(var e=t.returnValues.index,i=t.returnValues.airline,n=t.returnValues.flight,s=t.returnValues.timestamp,r=v(),a=function(t){g[t].index.includes(e)&&d.methods.submitOracleResponse(e,i,n,s,r).send({from:g[t].address},(function(e,i){e?console.log(e):console.log("".concat(JSON.stringify(g[t]),": Status code ").concat(r))}))},o=0;o<g.length;o++)a(o)}()}));var w=c()();w.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})}));t.default=w}};