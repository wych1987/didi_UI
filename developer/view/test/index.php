<?php
include("../layout/header.php");
?>
<input id="cityInput" type="text" style="margin:50px;"/>

<div style="position: absolute;right:100px;top:100px">
    <input id="cityInput02" type="text" style="margin:50px;"/>
</div>
<script type="text/javascript" src="/static/libs/jqueryUI/autoComplate.min.js"></script>
  <!--SCRIPT_PLACEHOLDER-->
<!--RESOURCEMAP_PLACEHOLDER-->
	<script>
	
	var myTool = require("myTool");
	var cityList = require("cityList");
	myTool.myEvent.on(document,"cityData_ready",function(){
	 	console.log(cityList.first_data.city_id);
	 });


	var conf = {
		ele:$("#cityInput"),
		url:"/api/citylist.php",
		ownEvent:"cityInput_okBtnClick",
		filterName:["全国","北京市"],
        okCallback:function(ids){
           console.log(" 我是city1");
			console.log(ids);//我们也可以监听自定义事件ownEvent,二不需要这个callback
		}
	}
    cityList.bindEle($("#cityInput02"), {
        ownEvent: "cityList_02", okCallback: function () {
            console.log("我是city2");
        }, type: "checkbox"
    });
	cityList.init(conf);
    myTool.myEvent.on(document,"cityInput_okBtnClick",function(){
        alert("111");
        console.log(cityList.selected.id);
    });
	</script>