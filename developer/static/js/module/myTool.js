var o = {}
 var myEvent = {};
		myEvent.init = function(eventName){
			myEvent.eventList=myEvent.eventList||{};
			myEvent.eventList[eventName]=document.createEvent("Event");
			myEvent.eventList[eventName].initEvent(eventName,true,true);
			return myEvent.eventList[eventName];
		};
		myEvent.on = function (ele,eventName,handle) {
			ele.addEventListener(eventName,handle,false);
		};
		myEvent.remove = function (ele,eventName,handle) {
			ele.removeEventListener(eventName,handle,false);
		};
		myEvent.trigger=function(ele,eventName){
			ele.dispatchEvent(myEvent.eventList[eventName])
		};
function deepClone(){
	
}		
o.myEvent = myEvent;		
module.exports=o;