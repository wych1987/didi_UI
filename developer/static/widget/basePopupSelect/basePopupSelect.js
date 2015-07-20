var o = {}
var city_tpl = __inline("basePopupSelect.html");
//var dd_cityList = $("#popupSelect");
$(document).ready(function(){
 		$("body").append(city_tpl);
 		//dd_cityList = $("#dd_cityList");
 	init();
});


function init(){
		var city = new Vue({
		el:"#dd-basePopupSelect",
		data:{
			isHide:false,
			group:[
			{name:"北京大区",id:123},
			{name:"上海大区",id:123},
			{name:"广州大区",id:123},
			{name:"武汉大区",id:123},
			{name:"沈阳地区",id:123}
			],
			showGroup:"武汉大区",
			showList:[
			{title:"A",item:[{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"}]},
			{title:"B",item:[{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"}]},
			{title:"C",item:[{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"},{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"},{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"},{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"}]},
			{title:"D",item:[{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"}]}
			]
	},
	"methods":{
		groupClick:function(event){
			var ele = event.target;
			var g_name = ele.getAttribute("data-name");
			if(g_name&&this.showGroup!=g_name){
				this.showGroup=g_name;
			}
		},
		itemBoxClick:function(event){
			var ele = event.target;
			//input点击
			this.isHide=true;
		},
		okClick:function(){
			//确认按钮点击
			this.isHide=true;
		},
		cancelClick:function(){
			//去掉按钮的点击
			this.isHide=true;
		}
	},
	"watch":{
		"showGroup":function(val){
				this.showList=groupData[val]||[];
		}
	}
});
}
var groupData ={
	"武汉大区":[
			{title:"A",item:[{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"}]},
			{title:"B",item:[{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"}]},
			{title:"C",item:[{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"},{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"},{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"},{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"}]},
			{title:"D",item:[{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"}]}
			],
		"上海大区":[
			{title:"AA",item:[{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"}]},
			{title:"VV",item:[{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"}]},
			{title:"CC",item:[{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"},{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"},{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"},{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"}]},
			{title:"DQ",item:[{name:"鞍山市",value:"12"},{name:"鞍山市1",value:"112"}]}
			],

}
module.exports=o;