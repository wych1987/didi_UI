var o = {}
var tpl = __inline("basePopupSelect.html");
var myTool = require("myTool");
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
var popupSelect_vue={};
function init(){

		 popupSelect_vue = new Vue({
		el:"#ddui-basePopupSelect",
		data:{
			top:0,
			left:0,
			ownEvent:"popupSelect_OK",
			isHide:true,
			selected:"",
			type:'radio',
			group:[],
			showGroup:"",
			showList:[],
			groupData:{}
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
			if(ele.nodeName.toLowerCase()==='input'){
				if(this.type==='radio'){
					//this.selected=ele.value;
 					okBtnClick(ele);
				}else{

				}		
			}
		},
		okClick:function(){
			//确认按钮点击
			 okBtnClick();
		},
		cancelClick:function(){
			//取消按钮的点击
			this.isHide=true;
		}
	},
	"watch":{
		"showGroup":function(val){
				this.showList=this.groupData[val]||[];
		},
		"isHide":function(val){
			if(!val){
				this.data={
					top:0,
					left:0,
					isHide:false,
					selected:"",
					type:'radio',
					group:[],
					showGroup:"",
					showList:[],
					groupData:{}
				};
			}
		}	
	}
});
 
}
function okBtnClick(ele){//v=vue
	//触发自定义事件v.ownEvent
	//o.selectData=v.selected;
	if(ele){
		o.selectData={
	id:[ele.value],
	name:[ele.getAttribute("data-name")]
};
	}else{
		getAllSelected();
	}
	
	myTool.myEvent.trigger(document,popupSelect_vue.ownEvent);
	close()
}
/*
打开弹层，param里主要是data的数据

*/
function open(param){
	param.isHide=false;
	setOption(param);
}
function setOption(param){
	for(var key in param){
		if(popupSelect_vue.$data.hasOwnProperty(key)){
			popupSelect_vue[key]=param[key];
		}
	}
	myTool.myEvent.init(popupSelect_vue.ownEvent);
}
function close(){
	setTimeout(function(){
				popupSelect_vue.isHide=true;
			},100);//延时一下让用户有视觉反应
}
function getAllSelected(){
	o.selectData={
	id:[],
	name:[]
};
	if(popupSelect_vue.type==="radio"){
		o.selectData.id=[popupSelect_vue.selected];
	}else{
		for(var key in popupSelect_vue.groupData){
			var t = popupSelect_vue.groupData[key];
			t.forEach(function(v){
				v.item.forEach(function(item){
					if(item.selected){
						o.selectData.id.push(item.value);
						o.selectData.name.push(item.name);
					}
				})
			})
		}		
	}
}
o.open = open;
o.selectData={
	id:[],
	name:[]
};
module.exports=o;