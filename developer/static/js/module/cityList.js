var o = {}
var basePopupSelect = require("basePopupSelect");
var myTool = require("myTool");
var cityName_Map = {}; //城市name=>data
var cityId_Map = {}; //城市id=>data
var first_data = {
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
	groupData : {}
}
var cityInput = {};
var okBtnCallback = function () {}
formatCityData(cityData.data);

function init(param) {
	cityInput = param.ele;
	okBtnCallback = param.okBtnCallback;
	param.ele.on("click", function () {
		var offset = param.ele.offset();
		conf_popup.left = offset.left;
		conf_popup.top = offset.top + param.ele.outerHeight();
		basePopupSelect.open(conf_popup);
	});
	myTool.myEvent.on(document, conf_popup.ownEvent, function () {
		console.log(basePopupSelect);
		okBtnClick(basePopupSelect.selectData);
	});
}
function okBtnClick(data) {	 
		cityInput.val(data.name.join(","));
}
function formatCityData(data) {
	data.forEach(function (v) {
		if (v.name == "全国") {
			conf_popup.all = v.city;
			if (!first_data.city_id) {
				first_data.city_id = v.id;
				first_data.city_name = v.name;
			}
			cityName_Map[v.name] = {
				city_id : v.id
			};
			cityId_Map[v.id] = {
				city_id : v.name
			};

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
					cityId_Map[city.city_id] = city;
				});
			}
		}
	});
}
function sortCityDataByCode(city) {
	city.sort(function (a, b) {
		var a1 = a.whole_put_together.charCodeAt(0);
		var b1 = b.whole_put_together.charCodeAt(0);
		return a1 - b1;
	});
}
function getCityNameById(id) {
	  

}
function getCityIdsByName(id) {
	  

}
o.init = init;

module.exports = o;
