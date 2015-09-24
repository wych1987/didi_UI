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
    			$(this).trigger("blur");
    			return false;
    		}
    	});
    }
function dateFormat(date, formatStr) {
	var str = formatStr;
	var Week = ['日', '一', '二', '三', '四', '五', '六'];
	str = str.replace(/yyyy|YYYY/, date.getFullYear());
	str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
	str = str.replace(/MM/, date.getMonth() > 8 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1));
	str = str.replace(/M/g, (date.getMonth() + 1));
	str = str.replace(/w|W/g, Week[date.getDay()]);
	str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
	str = str.replace(/d|D/g, date.getDate());
	str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
	str = str.replace(/h|H/g, date.getHours());
	str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
	str = str.replace(/m/g, date.getMinutes());
	str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
	str = str.replace(/s|S/g, date.getSeconds());
	return str;
}
o.myEvent = myEvent;
o.bindAutoComplate=bindAutoComplate;
o.dateFmt=dateFormat;
module.exports=o;