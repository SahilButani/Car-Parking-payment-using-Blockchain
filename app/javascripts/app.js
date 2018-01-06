import "../stylesheets/app.css";
// Import libraries we need.
import {  default as Web3 } from 'web3';
import {  default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import conference_artifacts from '../../build/contracts/Car.json'

// Conference is our usable abstraction, which we'll use through the code below.
var Conference = contract(conference_artifacts);

var accounts, account, speaker;
var conference;

function getBalance(address) {
    return web3.fromWei(web3.eth.getBalance(address).toNumber(), 'ether');
}

window.App = {
    start: function() {
        var self = this;

        web3.eth.getAccounts(function(err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }


            accounts = accs;
            //console.log(accounts);
            account = accounts[0];
            
            $("#orgBalance").html(getBalance(account));
            
            self.initializeConference();
        });
    },

    initializeConference: function() {
        var self = this;
        Conference.deployed().then(function(instance) {
            conference = instance;
            $("#confAddress").html(conference.address);
            //self.checkValues();
        }).catch(function(e) {
            console.log(e);
        });
    },
    

       checkValues: function() {
        Conference.deployed().then(function(instance) {
            conference = instance;
            conference.amt.call().then(
                function(amt) {
                    $("input#amount").val(amt);
                });
        }).catch(function(e) {
            console.log(e);
        });
    },

    add: function(val,address) {
        var conference;
        Conference.deployed().then(function(instance) {
            conference = instance;
            conference.addcar(val,address,{
             from: accounts[0]
             }).then(
                function() {
                 return conference.cars.call(address);
                }).then(
                function(carn) {
                    var msgResult;
                    if (carn == val) {
                        var msgResult;
                        msgResult = "added successful";
                    } else {
                        msgResult = " failed";
                    }
                    $("#addResult").html(msgResult);
                });
        }).catch(function(e) {
            console.log(e);
        });
    },

    checkIn: function(valcar,valtime) {
        var conference;
        Conference.deployed().then(function(instance) {
    
            conference = instance;
            conference.checkin(valcar,valtime, {
                from: accounts[0]
            }).then(
                function() {
                    return conference.time2.call(valcar);
                }).then(
                function(loc) {
            var msgResult;
            console.log(loc);
            //console.log(location);
                    if (loc == valtime) {
                        msgResult = "Checkin successful";
           
                    } else {
                        msgResult = "Checkin failed";
            console.log("entered else");
                    }
                    $("#checkinResult").html(msgResult);
           
                });
        }).catch(function(e) {
            console.log(e);
        });
    }, 

    checkOut: function(val1,val2,val3) {
        var conference;
        Conference.deployed().then(function(instance) {
    //console.log(val);
            conference = instance;
            conference.checkout(val1,val2,val3, {
                from: accounts[0]
            }).then(
                function() {
                 var msgResult;
                       console.log(99);
                        msgResult = "checkout done!";
                      console.log("entered else");
                    
                    $("#checkoutResult").html(msgResult);
                    return conference.amt.call();
                   }).then(
                       function(amt){
                     $("#amount").html(amt.toNumber());
                      $("#parkBalance").html(amt.toNumber());     
                });
        }).catch(function(e) {
            console.log(e);
        });
    }, 

   selfPay: function(var2,v2,add) {
        var self = this;
         console.log(5555);
       
        
        Conference.deployed().then(function(instance) {
           console.log(5454);
            conference = instance;
          console.log(5533);
            
           
            conference.pay(add,var2,{
                from: add,
                value: v2
            }).then(
                function() {
                   console.log(5556);
                    return conference.cars.call(add);
                }).then(
                function(valuePaid) {
                   console.log(5557);
                    var msgResult;
                    if (valuePaid == 0) {
                    console.log(5558);
                        msgResult = "paid";
                    } else {
                    console.log(5559);
                        msgResult = "Purchase failed";
                    }
                    $("#payResult").html(msgResult);
                });
        }).catch(function(e) {
            console.log(e);
        });
    },

       friendPay: function(v1,var2,v2) {
        var self = this;
      
        Conference.deployed().then(function(instance) {
            conference = instance;
            conference.pay(v1,var2,{
                from: v1,
                value: v2
            }).then(
                function() {
                   
                    return conference.cars.call(v1);
                }).then(
                function(valuePaid) {
                    var msgResult;
                    if (valuePaid == 0) {
                        msgResult = "paid";
                    } else {
                        msgResult = "Purchase failed";
                    }
                    $("#payResult").html(msgResult);
                });
        }).catch(function(e) {
            console.log(e);
        });
    },

  }

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    Conference.setProvider(web3.currentProvider);
    App.start();

    // Wire up the UI elements
 
    $("#add").click(function() {
        var carnumber = $("#carnumber").val();
        var ownerAddress = $("#ownerAddress").val();
        App.add(carnumber, ownerAddress);
    });
    $("#checkIn").click(function() {
        var carnumber = $("#carnumber").val();
        var ctime = $("#ctimeAddress").val();
        var ownerAddress = $("#ownerAddress").val();
        App.checkIn(carnumber,ctime)
    });

     $("#checkOut").click(function() {
        var carnumber = $("#carnumber").val();
        var cotime = $("#cotimeAddress").val();
        var code = $("#code").val();
        App.checkOut(carnumber,cotime,code)
    });

    $('#pay').click(function() {
        var val = $("input:radio[name='group-1']:checked").val();
        console.log(val);
        var carnumber = $("#carnumber").val();
        var amt = $("#amount").val();
        if($('#group-1-0').is(':checked')){
        console.log(amt);
        var add= $("#ownerAddress").val();
        App.selfPay(carnumber,web3.toWei(amt),add);
         }
       else{
       console.log(val);
       var friendAddress = $("#friendAddress").val();
       App.friendPay(friendAddress,carnumber,web3.toWei(amt)); 
       }
    console.log(val);
    });


});

