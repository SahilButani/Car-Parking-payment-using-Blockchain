pragma solidity ^0.4.4;
contract Car {
  address public owner;
  mapping (address => uint) public cars;
  mapping (uint => address) public carsa;
  mapping (uint => uint) public time2;
uint public intime;
uint public p;
uint public amt;
 
 function Car() {
    owner = msg.sender;
  }

  function addcar(uint carno,address ownerc) public {
   cars[ownerc]=carno;
   carsa[carno]=ownerc;
  }

  function checkin(uint carno,uint intime) public {
   time2[carno]=intime;
  }

  function checkout(uint carno,uint outtime,uint offer ) public returns (uint,address) {
   
   intime=time2[carno];
   uint time=outtime-intime;
   if(time<60){ amt=10;}
   if(time>60 && time<180){ amt=20;}
   if(time>180){ amt=30;}
   if(offer==111||offer==333||offer==444){ amt=(amt*1)/2;}
   if(offer==222||offer==555||offer==666){ amt=amt-((amt*1)/2);}
    return (amt,carsa[carno]);
  

}

function pay(address o,uint n){
cars[o]=0;
time2[n]=0;
}

  function destroy() {
    if (msg.sender == owner) {
      suicide(owner);
    }
  }
 
}
