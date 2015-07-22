var o = {}
var basePopupSelect = require("basePopupSelect");
var myTool = require("myTool");
var cityName_Map = {}; //城市name=>data
var cityId_Map = {}; //城市id=>data
var autoData=[];//自动填充的数据，存放城市名称
var first_data = {
	event:"cityData_ready",
	city_id : "",
	city_name : ""
}; //这个变量保存cityData的第一个值，填充元素，方便快速获取数据
var conf_popup = {
	ownEvent : "cityList_ok",
	selected : "",
	type : 'checkbox',
	group : [],
	showGroup : "",
	showList : [],
	groupData : {},
	other:{
				name:"",
				value:"",
				selected:false
			}
}
myTool.myEvent.init(first_data.event);
var cityInput = {};
var okBtnCallback = function () {}

function init(param) {
	formatCityData(cityData.data);
	cityInput = param.ele;
	cityInput.val(first_data.city_name);
	okBtnCallback = param.okBtnCallback;
	param.ele.on("click", function () {
		var offset = param.ele.offset();
		conf_popup.left = offset.left;
		conf_popup.top = offset.top + param.ele.outerHeight();
		var selectName = param.ele.val();
		 selectName = selectName.length?selectName.split(";"):"";
		 if(selectName){
		 	var ids = getCityIdsByName(selectName);
		 	conf_popup.showGroup = cityName_Map[selectName[0]].parent;
		 }
		 
		basePopupSelect.open(conf_popup,ids);
	});
	myTool.myEvent.on(document, conf_popup.ownEvent, function () {
		//console.log(basePopupSelect);
		okBtnClick(basePopupSelect.selectData);
	});
	myTool.bindAutoComplate(param.ele,autoData);
	param.ele.on("keydown",function(){
		basePopupSelect.close();
	})
}
function okBtnClick(data) {	 
		cityInput.val(data.name.join(";"));
		if(typeof okBtnCallback==="function"){
			okBtnCallback(data.id.join(";"));
		}
}
function formatCityData(data) {
	data.forEach(function (v) {
		if (v.name == "全国") {
			conf_popup.all = v.city;
			first_data.city_id = v.id;
			first_data.city_name = v.name;

			cityName_Map[v.name] = {
				city_id : v.id
			};
			cityId_Map[v.id] = {
				city_id : v.name
			};
			conf_popup.other.name="全国";
			conf_popup.other.value=v.id;
			conf_popup.other.selected=false;
			autoData.push(v.name);
		} else {
			conf_popup.group.push({
				name : v.name,
				city_id : v.id
			});
			conf_popup.groupData[v.name] = [];
			if (!conf_popup.showGroup) {
				conf_popup.showGroup = v.name;
			}
			if (v.city && v.city.length) {
				sortCityDataByCode(v.city);
				var sortCode = "";
				var list = {};
				v.city.forEach(function (city) {
					autoData.push(city.city_name);
					if (!first_data.city_id) {
						first_data.city_id = city.city_id;
						first_data.city_name = city.city_name;
					}
					var t = city.whole_put_together.charAt(0);
					if (t != sortCode) {
						if (list.title) {
							conf_popup.groupData[v.name].push(list);
						}
						sortCode = t;
						list = {
							title : sortCode.toUpperCase(),
							item : [{
									name : city.city_name,
									value : city.city_id,
									selected : false
								}
							]
						}
					} else {
						list.item.push({
							name : city.city_name,
							value : city.city_id,
							selected : false
						});
					}
					cityName_Map[city.city_name] = city;
					cityName_Map[city.city_name].parent = v.name;
					cityId_Map[city.city_id] = city;
					cityId_Map[city.city_id].parent = v.name;
				});
			}
		}
	});
	//触发一次数据获取完毕的事件
	o.first_data=first_data;
	myTool.myEvent.trigger(document,first_data.event);
}
function sortCityDataByCode(city) {
	city.sort(function (a, b) {
		var a1 = a.whole_put_together.charCodeAt(0);
		var b1 = b.whole_put_together.charCodeAt(0);
		return a1 - b1;
	});
}
function getCityNameById(id) {
		var a = [];
	   if(Array.isArray(id)){
	   		id.forEach(function(v){
	   			a.push(cityId_Map[v].city_name);
	   		})	   		
	   }else{
	   	a.push(cityId_Map[id].city_name)
	   }
	  return a;
}
function getCityIdsByName(name) {
	  var a = [];
	   if(Array.isArray(name)){
	   		name.forEach(function(v){
	   			if(cityName_Map[v]){
	   				a.push(cityName_Map[v].city_id);
	   			}
	   			
	   		})	   		
	   }else{
	   	a.push(cityName_Map[name].city_id)
	   }
	  return a;
}
o.init = init;
o.getCityIdsByName=getCityIdsByName;
o.getCityNameById=getCityNameById;
o.first_data=first_data;
module.exports = o;
