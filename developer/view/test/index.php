<?php
include("../layout/header.php");
?>
<input id="cityInput" type="text" style="margin:50px;"/>
<script type="text/javascript" src="/static/libs/jqueryUI/autoComplate.min.js"></script>
  <!--SCRIPT_PLACEHOLDER-->
<!--RESOURCEMAP_PLACEHOLDER-->
	<script>
	
	var myTool = require("myTool");
	var cityList = require("cityList");
	myTool.myEvent.on(document,"cityData_ready",function(){
	 	console.log(cityList.first_data.city_id);
	 });
myTool.myEvent.on(document,"city_okBtnClick",function(){
	 	console.log(cityList.selected.city_id);
});

	var conf = {
		ele:$("#cityInput"),
		url:"/api/citylist.php",
		ownEvent:"cityInput_okBtnClick",
		filterName:["全国","北京市"],
		okBtnCallback:function(ids){
			console.log(ids);//我们也可以监听自定义事件ownEvent,二不需要这个callback
		}
	}

	cityList.init(conf);
	</script>