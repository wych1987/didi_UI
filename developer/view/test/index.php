<?php
include("../layout/header.php");
?>
<div class="flex-box-1 ddui-con-body">
    <p><label>城市选择</label><input id="cityInput" type="text" style="margin:50px;"/>
<p><label>客户群</label><input id="customerInput" type="text" style="margin:50px;"/>
</p>

<div style="position: absolute;right:100px;top:100px">
    <input id="cityInput02" type="text" style="margin:50px;"/>
</div>
</div>
<script type="text/javascript" charset="utf-8" src="/static/libs/jqueryUI/autoComplate.min.js"></script>
<script type="text/javascript" charset="utf-8" src="/static/js/module/myTool_2e27776.js"></script>
<script type="text/javascript" charset="utf-8" src="/static/widget/basePopupSelect/basePopupSelect_451aa78.js"></script>
<script type="text/javascript" charset="utf-8" src="/static/js/module/cityList_b820d06.js"></script>
<script type="text/javascript" charset="utf-8" src="/static/js/module/popupCustom_535de47.js"></script>
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
    var popup_customer = require("popupCustom");
    var customer_conf = {
        ele:$("#customerInput"),
        ownEvent:"custom_ok",
        type:"radio"
    }
   var custmon= popup_customer.init(customer_conf);

	</script>