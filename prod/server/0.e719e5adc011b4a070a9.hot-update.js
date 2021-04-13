exports.id=0,exports.modules={"./src/server/server.js":function(e,s,o){"use strict";o.r(s);var t=o("./build/contracts/FlightSuretyApp.json"),n=o("./src/server/config.json"),r=(o("./src/dapp/config.json"),o("web3")),c=o.n(r);var a=o("express"),l=o.n(a),i=n.localhost,u=new c.a(new c.a.providers.WebsocketProvider(i.url.replace("http","ws")));u.eth.defaultAccount=u.eth.accounts[0];var d=new u.eth.Contract(t.abi,i.appAddress),f=[];u.eth.getAccounts((function(e,s){s[0];for(var o=function(e){d.methods.registerOracle().send({from:s[e],value:u.utils.toWei("1","ether"),gas:45e5},(function(o,t){o?console.log(o):d.methods.getMyIndexes().call({from:s[e]},(function(o,t){if(o)console.log(o);else{var n={address:s[e],index:t};console.log("Oracle: ".concat(JSON.stringify(n))),f.push(n)}}))}))},t=10;t<30;t++)o(t)})),d.events.OracleRequest({fromBlock:0},(function(e,s){if(e)console.log(e);else for(var o=s.returnValues.index,t=s.returnValues.airline,n=s.returnValues.flight,r=s.returnValues.timestamp,c=function(e){f[e].index.includes(o)&&d.methods.submitOracleResponse(o,t,n,r,statusCode).send({from:f[e].address},(function(s,o){s?console.log(s):console.log("".concat(JSON.stringify(f[e]),": Status code ").concat(statusCode))}))},a=0;a<f.length;a++)c(a)}));var g=l()();g.get("/api",(function(e,s){s.send({message:"An API for use with your Dapp!"})}));s.default=g}};