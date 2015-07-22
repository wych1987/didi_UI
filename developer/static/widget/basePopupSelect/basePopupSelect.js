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
			groupData{
				"武汉大区":[
						{title:"A",item:[{name:"鞍山市",value:"12q",selected:false},{name:"鞍山市1",value:"112a",selected:true}]}
					]
			}
			showGroup:"武汉大区",
			showList:[
				{title:"A",item:[{name:"鞍山市",value:"12q",selected:false},{name:"鞍山市1",value:"112a",selected:true}]}
			],
			other:{
				name:“全国”,
				value:0,
				selected:false
			}
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
			groupData:{},
			other:{
				name:"",
				value:"",
				selected:false
			}
	},
	"methods":{
		groupClick:function(event){
			var ele = event.target;
			var g_name = ele.getAttribute("data-name");

			if(ele.type==="checkbox"){
				groupBoxSetByChecked(this.groupData[g_name],ele.checked);
			}
			if(g_name&&this.showGroup!=g_name){
				this.showGroup=g_name;
			}
		},
		itemBoxClick:function(event){
			var ele = event.target;
			//input点击
			if(ele.nodeName.toLowerCase()==='input'){
				if(ele.type==='radio'){
					//this.selected=ele.value;
 					okBtnClick(ele);
				}else if(ele.type==="checkbox"&&!ele.checked){
						 var g_name = this.showGroup;
						 this.group.forEach(function(v){
						 	if(v.name===g_name){
						 		v.selected=false;
						 		return ;
						 	}
						 })
				}		
			}
		},
		otherClick:function(event){
			var ele = event.target;
			//input点击
			if(ele.nodeName.toLowerCase()==='input'){
				if(this.type==='radio'){
					//this.selected=ele.value;
 					okBtnClick(ele);
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
			if(val){
				this.data={
					top:0,
					left:0,
					isHide:false,
					selected:"",
					type:'radio',
					group:[],
					showGroup:"",
					showList:[],
					groupData:{},
					other:{
				name:"",
				value:"",
				selected:false
			}
				};
			}
		}	
	}
}); 
}
function okBtnClick(ele) { //v=vue
	//触发自定义事件v.ownEvent
	//o.selectData=v.selected;
	if (ele) {//单选项点击触发
		o.selectData = {
			id : [ele.value],
			name : [ele.getAttribute("data-name")]
		};
	} else {
		getAllSelected();
	}
	myTool.myEvent.trigger(document, popupSelect_vue.ownEvent);
	close()
}
function groupBoxSetByChecked(arr,checked){
	arr.forEach(function(v){
		v.item.forEach(function(g){
			g.selected=checked;
		})
	})
}
/*
打开弹层，param里主要是data的数据
ids=>选中的id串，array
*/
function open(param,ids){
	popupSelect_vue.isHide=true;
	var p = JSON.parse(JSON.stringify(param));//深拷贝
	setOption(p);
	setSelectedEleByIds(ids);
	popupSelect_vue.isHide=false;
}
function setOption(param){
	for(var key in param){
		if(popupSelect_vue.$data.hasOwnProperty(key)){
			popupSelect_vue[key]=param[key];
		}
	}
	if(!popupSelect_vue.showGroup){
		popupSelect_vue.showGroup=popupSelect_vue.group[0].name;
	}
	popupSelect_vue.showList=popupSelect_vue.groupData[popupSelect_vue.showGroup];
	myTool.myEvent.init(popupSelect_vue.ownEvent);
}
function setSelectedEleByIds(ids){
	if(ids){
		if(popupSelect_vue.type==="radio"){
			popupSelect_vue.selected=ids[0];			
		}else if(popupSelect_vue.type==="checkbox"){
			var ids_key = {};
			ids.forEach(function(v){
				ids_key[v]=true;
				if(v==popupSelect_vue.other.value){
					popupSelect_vue.other.selected=true;
				}
			});
			for(var k in popupSelect_vue.groupData ){
				var g = popupSelect_vue.groupData[k];
				g.forEach(function(it){
					it.item.forEach(function(q){
						q.selected = ids_key[q.value]?true:false;
					})
				})
				}
				
			}
		}
		popupSelect_vue.showList=popupSelect_vue.groupData[popupSelect_vue.showGroup];
	}

function close(){
	setTimeout(function(){
				popupSelect_vue.isHide=true;
			},100);//延时一下让用户有视觉反应
}
function getAllSelected() {
	o.selectData = {
		id : [],
		name : []
	};
	if (popupSelect_vue.type === "radio") {
		o.selectData.id = [popupSelect_vue.selected];
	} else {
		for (var key in popupSelect_vue.groupData) {
			var t = popupSelect_vue.groupData[key];
			t.forEach(function (v) {
				v.item.forEach(function (item) {
					if (item.selected) {
						o.selectData.id.push(item.value);
						o.selectData.name.push(item.name);
					}
				})
			})
		}
		if (popupSelect_vue.other.selected) {
			o.selectData.id.push(popupSelect_vue.other.value);
			o.selectData.name.push(popupSelect_vue.other.name);
		}
	}
}
o.open = open;
o.close = close;
o.selectData={
	id:[],
	name:[]
};
module.exports=o;