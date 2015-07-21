var o = {}
var tpl = __inline("basePopupSelect.html");
//var dd_cityList = $("#popupSelect");
$(document).ready(function(){
 		$("body").append(tpl);
 		//dd_cityList = $("#dd_cityList");
 	init();
});

/*
	data:{
			isHide:false,
			type:'radio',
			selected:"12q",//radio的时候
			group:[
			{name:"北京大区",id:123},
			{name:"沈阳地区",id:123}
			],
			showGroup:"武汉大区",
			showList:[
			{title:"A",item:[{name:"鞍山市",value:"12q",selected:false},{name:"鞍山市1",value:"112a",selected:true}]}
			]
	}

*/

function init(){
		var popupSelect_vue = new Vue({
		el:"#dd-basePopupSelect",
		data:{
			isHide:false,
			selected:"12q",
			type:'radio',
			group:[
			{name:"北京大区",id:123},
			{name:"上海大区",id:123},
			{name:"广州大区",id:123},
			{name:"武汉大区",id:123},
			{name:"沈阳地区",id:123}
			],
			showGroup:"武汉大区",
			showList:[
			{title:"A",item:[{name:"鞍山市",value:"12q"},{name:"鞍山市1",value:"112a"}]},
			{title:"B",item:[{name:"鞍山市",value:"12s"},{name:"鞍山市1",value:"11s2"}]},
			{title:"C",item:[{name:"鞍山市",value:"12x"},{name:"鞍山市1",value:"112c"},{name:"鞍山市",value:"12f"},{name:"鞍山市1",value:"1g2"},{name:"鞍山市",value:"12h"},{name:"鞍山市y1",value:"112o"},{name:"鞍山市",value:"1i2"},{name:"鞍山市1",value:"1m12"}]},
			{title:"D",item:[{name:"鞍山市",value:"12c"},{name:"鞍山市1",value:"112v"}]}
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
			var self = this;
			setTimeout(function(){
				self.isHide=true;
			},300);//延时一下让用户有视觉反应
		},
		okClick:function(){
			//确认按钮点击
			this.isHide=true;
		},
		cancelClick:function(){
			//取消按钮的点击
			this.isHide=true;
		}
	},
	"watch":{
		"showGroup":function(val){
				this.showList=groupData[val]||[];
		},
		"isHide":function(val){
			if(!val){
				this.data={};
			}
		}	
	}
});
 return popupSelect_vue;
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