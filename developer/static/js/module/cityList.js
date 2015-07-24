var o = {}
var basePopupSelect = require("basePopupSelect");
var myTool = require("myTool");
var cityName_Map = {}; //城市name=>data
var cityId_Map = {}; //城市id=>data
var autoData=[];//自动填充的数据，存放城市名称
var first_data = {
	ownEvent:"cityData_ready",
	city_id : "",
	city_name : ""
}; //这个变量保存cityData的第一个值，填充元素，方便快速获取数据
var conf_popup = {
	ownEvent : "cityList_ok",
	selected : "",
	type : 'radio',
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
myTool.myEvent.init(first_data.ownEvent);
var cityInput = {};
//var okBtnCallback = function () {}

function init(param) {
	param.url = param.url||"/common/get_city";
	getCityData(param.url,param.filterName);
	cityInput = param.ele;
	cityInput.val(first_data.city_name);
	okCallback = param.okCallback;
	conf_popup.ownEvent=param.ownEvent||conf_popup.ownEvent;
    myTool.myEvent.on(document, first_data.ownEvent, function () {
        cityInput.val(first_data.city_name);
    });
    bindEle(param.ele,{ownEvent:param.ownEvent,okCallback:param.okCallback,type:param.type||"radio"});
}
function getCityData(url,filterName){
	$.get(url,function(serverData){
		formatCityData(serverData.data,filterName);
	},"json");
}
function okBtnClick(data,okCallback) {
		cityInput.val(data.name.join(";"));
		if(typeof okCallback==="function"){
            okCallback(data.id.join(";"));
		}
}
function formatCityData(data, filterName) {
	var f = {};
	if (filterName) {
		filterName.forEach(function (v) {
			f[v] = true;
		})
	}
	data.forEach(function (v) {
		if (!f[v.name]) {
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
				conf_popup.other.name = "全国";
				conf_popup.other.value = v.id;
				conf_popup.other.selected = false;
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
						if (!f[city.city_name]) {
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
						}
					});
				}
			}
		}
	});
	//触发一次数据获取完毕的事件
	o.first_data = first_data;
	myTool.myEvent.trigger(document, first_data.ownEvent);
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
           if(cityId_Map[id]){
               a.push(cityId_Map[id].city_name)
           }
	   }
	  return a;
}
function getCityCodeByNames(name) {
	  var a = [];
	   if(Array.isArray(name)){
	   		name.forEach(function(v){
	   			if(cityName_Map[v]){
	   				a.push(cityName_Map[v].city_id);
	   			}
	   			
	   		})	   		
	   }else{
           if(cityName_Map[name]){
               a.push(cityName_Map[name].city_id)
           }
	   }
	  return a;
}
function eleClick(ele,conf) {
    cityInput=ele;
    var selectName = ele.val();
    selectName = selectName.length?selectName.split(";"):"";
    if(selectName){
        var ids = getCityCodeByNames(selectName);
        conf_popup.showGroup = cityName_Map[selectName[0]].parent;
    }
    conf_popup.ownEvent=conf.ownEvent?conf.ownEvent:conf_popup.ownEvent;
    conf_popup.type=conf.type?conf.type:conf_popup.type;
    basePopupSelect.open(conf_popup,ids,ele);
}
/*
* conf=>ownEvent,okCallback
*
* */
function bindEle(ele,conf){//绑定其他元素的城市,以及某些配置
    myTool.myEvent.on(document, conf.ownEvent, function () {
        //console.log(basePopupSelect);
        o.selected={
            city_id:basePopupSelect.selectData.id,
            city_name:basePopupSelect.selectData.name
        };
        okBtnClick(basePopupSelect.selectData,conf.okCallback);
    });
    myTool.bindAutoComplate(ele,autoData);
    ele.on("keydown",function(){
        basePopupSelect.close();
    });
    ele.on("click",function(){
        eleClick(ele,conf);
    });
}
o.init = init;
o.bindEle = bindEle;
o.getCityCodeByNames=getCityCodeByNames;
o.getCityNameById=getCityNameById;
o.first_data=first_data;
o.selected={};
module.exports = o;
