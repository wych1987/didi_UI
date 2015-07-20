//define(["jquery","myTool",'Vue','popupUploadFile','popupSelect'],function($,myTool,Vue,popupUploadFile,popupSelect){
	var myTool = require("myTool");
	var popupUploadFile = require("popupUploadFile");
	var popupSelect = require("popupSelect");
   var o = {};
   var tagNameInfo=$("#tagNameInfo");
   var tagNameIsExists=true;
   var ajaxURL={};
	ajaxURL["create_task"]="/customer_base/create_task"
	ajaxURL["get_customer_info"]="/customer_base/get_customer_info";
	ajaxURL["tagName"]="/tag/tagNameIsExists";
	var a_b_type={
		tag:1,
		tempName:2,
		file:3
	};
   var popupAllData={};//popup的全部数据
   var tabArray=[{"key":1,"name":"\u4e58\u5ba2"},{"key":2,"name":"\u53f8\u673a"}];
     var user_group_Vue = new Vue({
     		el : '#tag_user_group',
     		data : {
				tabIndex:0,
     			gridview : [{a:"",b:"",selected:"1",temp_name:randomStr(),a_type:"",b_type:""}],
     			random_count : "",
     			refer_precent : "",
     			taskName : ""
     		},
     		methods : {
     			tabClick : function (event) {
     				popupSelect.closeAll();
     				var c = event.target.getAttribute("data-tabIndex");
     				if (c && c != user_group_Vue.tabIndex) {
     					user_group_Vue.tabIndex = c-0;
     					resetPage();
     				}
     			},
     			addLine : function (e) {
     				user_group_Vue.gridview.push({
     					a : "",
     					b : "",
     					selected :"1",
     					temp_name : randomStr(),
     					a_type : "",
     					b_type : ""
     				});
     			},
     			add_a_file : function (v, event) {
     				var index = event.target.getAttribute("data-index");
     				if (index) {
     					var item = v.gridview[index]

     						popupUploadFile.open({
     							successFunc : function (url) {
     								item.a = url;
     								item.a_type = "file";
     							}
     						});
     				}
     			},
     			add_b_file : function (v, event) {
     				var index = event.target.getAttribute("data-index");
     				if (index) {
     					var item = v.gridview[index];
     					popupUploadFile.open({
     						successFunc : function (url) {
     							item.b = url;
     							item.b_type = "file";
     						}
     					});
     				}
     			},
     			add_a_popup : function (v, event) {
     				popupUserData(event.target);
     			},
     			add_b_popup : function () {
     				popupUserData(event.target);
     			},
     			savePageData : function (v) {
     				//保存任务
					savePageData(v);
     			},
     			validName : function (v) {
     				//检查任务名称是否重复
     				$.get(ajaxURL["tagName"], {	tagname : v.taskName}, function (serverData) {
     					if (serverData && serverData.errno == 0) {
     						tagNameIsExists = false;
     						tagNameInfo.html("");
     					} else {
     						tagNameIsExists = true;
     						tagNameInfo.html(serverData.info || "任务名称冲突");
     					}
     				}, "json");
     			}

     		}
     	});
	function resetPage(){
		user_group_Vue.gridview=[{a:"",b:"",selected:"1",temp_name:randomStr(),a_type:"",b_type:""}];
		user_group_Vue.randnum=""
		user_group_Vue.refernum="";
		user_group_Vue.taskName="";
		
		}	
	function popupUserData(ele){
		var index = ele.getAttribute("data-index")-0;
		$.get(ajaxURL["get_customer_info"],{usertype:tabArray[user_group_Vue.tabIndex].key},function(serverData){
				console.log(serverData);
				var d = formatData2Popup(serverData.data,index);
				 var p = popupSelect.init({data:d,tplName:'tplRadioboxStr',input:ele,okCallback:okCallback});
					p.open();
		},"json");
	}
	function formatData2Popup(data,index){
		var myData=[];
		 var temp = getTempUserName(index);
		 if(temp){
		 	//暂时去掉临时客户群closeAll
			 //myData.push({name:"临时客户群",item:temp});
		 };
		 for(var d in data){
			 myData.push({name:d,item:data[d]});
		 }
		 myData.forEach(function(v){
			 for(var k in v.item){
				 v.item[k].input_name="user_group_input";
				 
				 if(v.item[k].type&&v.item[k].type==="tempName"){
					 var n = v.item[k].name;
				 }else{
					 var n = v.item[k].name+"__"+v.item[k].id;
				 }
				 popupAllData[n]={id:v.item[k].id,type:v.item[k].type||"tag",name:v.item[k].name};
				 v.item[k].name=n;		 
			 }
		 });
		return myData;
	}
	function getTempUserName(index){
		var d = [];
		var g = user_group_Vue.gridview;
		g.forEach(function(i,n){
			if(n!==index&&i.temp_name){
				d.push({name:i.temp_name,type:"tempName",id:i.temp_name});
			}
		});
		return d;
	}
	
	function okCallback(ele){
		var k = ele.val();
		k = k.split(";")[0];
		var d = popupAllData[k];
		 if(d){
			 var index = ele.attr("data-index");
			 var q = ele.attr("data-type");
			 user_group_Vue.gridview[index][q]=k;
			 user_group_Vue.gridview[index][q+"_type"]=d.type;
		 }
	}
	
	function randomStr(){
		var str = "ASDFGHJKLMNBVCXZQWERTYUIOPqwertyuiopasdfghjkzxcvbnm";
		var num = Math.random().toString().slice(-4);
		var t = "";
		for(var i = 0; i <6;i++){
			var n = ~~(Math.random()*100)%str.length;
			t+=str.charAt(n);
		}
		return t+"__"+num;
	}
	function savePageData(v){
		 var r = validForm(v);
		if(r){
			var d = getAjaxParam(v);
			$.post(ajaxURL["create_task"],d,function(serverData){
				if(serverData&&serverData.errno==0){
					alert("创建任务成功");
					location.href="/tag/index";
				}else{
					alert(serverData.msg);
				}
			},"json");
		}else{
			return false;
		}
	}
	function validForm(v){
		if(!v.taskName||v.taskName.length===0){
			alert("请给任务起个名字");
			return false;
		}
		if(tagNameIsExists){
			alert("任务名称重复，请重新输入");
			return false;
		}
		return true;
	}
	 function getAjaxParam(v) {
	 	var d = {};
	 	d.usertype = tabArray[v.tabIndex].key;
	 	d.name = v.taskName;
	 	d.refer_precent = v.refer_precent;
	 	d.random_count = v.random_count;
	 	var detail = [];
	 	v.gridview.forEach(function (k) {
	 		var a = k.a;
	 		var left_operands_id = "";
	 		var left_operands_type = "";
	 		if (a) {
	 			k.a_type = k.a_type ? k.a_type : popupAllData[a].type;

	 			switch (k.a_type) {
	 			case "file":
	 				left_operands_id = a;
	 				break;
	 			case "tempName":
	 				left_operands_id = popupAllData[a].id;
	 				break;
	 			case "tag":
	 				left_operands_id = popupAllData[a].id;
	 				break;
	 			default:
	 				break;
	 			}
	 			left_operands_type = a_b_type[k.a_type];
	 		}
	 		var right_operands_id = "";
	 		var right_operands_type = "";
	 		var b = k.b;
	 		if (b) {

	 			k.b_type = k.b_type ? k.b_type : popupAllData[a].type;
	 			switch (k.b_type) {
	 			case "file":
	 				right_operands_id = b;
	 				break;
	 			case "tempName":
	 				right_operands_id = popupAllData[b].id;
	 				break;
	 			case "tag":
	 				right_operands_id = popupAllData[b].id;
	 				break;
	 			default:
	 				break;
	 			}
	 			right_operands_type = a_b_type[k.b_type];
	 		}
	 		detail.push({
	 			name : k.temp_name,
	 			left_operands_id : left_operands_id,
	 			left_operands_name : a,
	 			left_operands_type : a_b_type[k.a_type],
	 			right_operands_id : right_operands_id,
	 			right_operands_name : b,
	 			right_operands_type : right_operands_type,
	 			operators : k.selected
	 		});
	 	});
	 	d.detail = JSON.stringify(detail);
	 	return d;
	 }
    module.exports=o;