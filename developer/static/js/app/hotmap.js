//define("hotmap",  function(require, exports, module){
 var myTool = require("myTool");
  var o = {};
  var dateInput = $("#startDate");
  var cityInput=$("#cityInput");
  var hourRange=$("#hourRange");
  var searchBtn=$("#searchBtn");
 
  var hotmapBox=$("#hotmapBox");
	  hotmapBox.height($(window).height());
  var map = new BMap.Map("hotmapBox");          // 创建地图实例
  var MAP_ZOOM=12;	
    var point = new BMap.Point(116.418261, 39.921984);
	var geoc = new BMap.Geocoder();   
    map.centerAndZoom(point, MAP_ZOOM);             // 初始化地图，设置中心点坐标和地图级别
	
    map.enableScrollWheelZoom(); // 允许滚轮缩放
	var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
	var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
	 
	map.addControl(top_left_control);        
		map.addControl(top_left_navigation);     
		 
	/* visible 热力图是否显示,默认为true
     * opacity 热力的透明度,0-1
     * radius 势力图的每个点的半径大小   
     * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
     *	{
			.2:'rgb(0, 255, 255)',
			.5:'rgb(0, 110, 255)',
			.8:'rgb(100, 0, 255)'
		}
		其中 key 表示插值的位置, 0~1. 
		    value 为颜色值. 
     */
  var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":30});
  map.addOverlay(heatmapOverlay);
    
   function openHeatmap(){
        heatmapOverlay.show();
    }
	function closeHeatmap(){
        heatmapOverlay.hide();
    }
	function showHotMap(data) {
		
		var points = data;
		if (!isSupportCanvas()) {
			alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
		}
		heatmapOverlay.setDataSet({
			data : points,
			max:120 
		});
		
	}
    map.addEventListener("dragend",getHotDataByMap);
    map.addEventListener("dblclick", function () {
    	setTimeout(function () {
    		getHotDataByMap();
    	}, 1000);
    });
	
	function getHotDataByMap(e){
		var pt = map.getCenter();
    	geoc.getLocation(pt, function (rs) {
    		var addComp = rs.addressComponents;
    		if (addComp.city !== cityInput.val()&&popupCity.getCityCodeByNames(addComp.city )) {
    			map.centerAndZoom(addComp.city, MAP_ZOOM);
    			cityInput.val(addComp.city);
    			searchBtn.trigger("click");
    		}
    	});
	}
	//判断浏览区是否支持canvas
    function isSupportCanvas(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }
	searchBtn.on("click", function () {
		//获取数据显示热力图
		var cityCode = popupCity.getCityCodeByNames(cityInput.val())[0]||1;
		map.centerAndZoom(cityInput.val(), MAP_ZOOM);
		//loading ，定位到这个城市
		var p = {
			city : cityCode,
			date : dateInput.val(),
			hour : hourRange.val()
		};
		myTool.loadingPopup(hotmapBox);
		$.get("/taxi_hotmap/getHeatmapOverlay", p, function (serverData) {
			if(serverData&&serverData.errno==0){
				showHotMap(serverData.data);
			}else{
				alert("获取热力图数据失败");
			}
			myTool.loadingPopupClose();
		}, "json");
	});
	var popupCity = require("popupCity");
	popupCity.okCallback = function () {
		searchBtn.trigger("click");
	}
	popupCity.init({
		type : "radio"
	})
	cityInput.on("click", function () {
		popupCity.open({
			filterName : "全国",
			cityInput : cityInput
		});
	});
	hourRange.on("change",function(){
		searchBtn.trigger("click");
	})
	 
	function init(){
		// 初始化一些页面信息
		var h = new Date().getHours()-1;
		h = h>9?h:"0"+h;
		
		hourRange.val(h);
		
		searchBtn.trigger("click");
	}
	init();
   module.exports=o;
//});