var o = {}
/*自定义事件相关*/
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

/*jqueryUI-autocomplete*/
    function bindAutoComplate(dom, data,ownEvent) {
		var data = data||[];
    	function split(val) {
    		return val.split(/;\s*/);
    	}
    	function extractLast(term) {
    		return split(term).pop();
    	}
    	dom.bind("keydown", function (event) {
    		if (event.keyCode === $.ui.keyCode.TAB &&
    			$(this).autocomplete("instance").menu.active) {
    			event.preventDefault();
    		}
    	}).autocomplete({
    		minLength : 0,
    		source : function (request, response) {
    			// delegate back to autocomplete, but extract the last term
    			response($.ui.autocomplete.filter(
    					data, extractLast(request.term)));
    		},
    		focus : function () {
    			// prevent value inserted on focus
    			return false;
    		},
    		select : function (event, ui) {
    			var terms = split(this.value);
    			// remove the current input
    			terms.pop();
    			// add the selected item
    			terms.push(ui.item.value);
    			// add placeholder to get the comma-and-space at the end
    			terms.push("");
    			this.value = terms.join(";");
				if(ownEvent){
					myEvent.trigger(this,ownEvent);
				}				
    			//$(this).trigger("blur");
    			return false;
    		}
    	});
    }
o.myEvent = myEvent;
o.bindAutoComplate=bindAutoComplate;
module.exports=o;