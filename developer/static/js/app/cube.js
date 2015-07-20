//define(["jquery","handlebars","popupCity","myTool","myEchart","popupSelect"],function($,Handlebars,popupCity,myTool,myEchart,popupSelect){
//define(function(require) {
	var popupCity=require("popupCity");
	var myTool=require("myTool");
	var myEchart=require("myEchart");
	var popupSelect=require("popupSelect");
  var o = {}
   popupCity.init({type:"checkbox"});
   var URL="/cube/get_page_info";
   var MAX_YAXIS=20;//这个值用来判断line是左边的坐标还是右边的坐标
   var startDate=myTool.quById("startDate");
   var endDate=myTool.quById("endDate");
   var timeRange = myTool.quById("timeRange");//统计周期
   var timeRangeData=[];
   var tabBox = myTool.quById("tabBox");
   var tabContent = myTool.quById("tabContent");
   var tabClass="mis-tab-active";
   var chartTypeClass='chart-type-active';
   var selectStr='{{#each this}}<li ><label class="selected-label">{{dim_name}}:</label><span class="selected-name">{{name}}<i data-dim_id="{{dim_id}}" data-id="{{id}}"class="icon iconfont icon-delete" ></i></span></li>{{/each}}';
   var selectTpl = Handlebars.compile(selectStr);
    var tabContentSrt = '<h3 class="bi-title">条件筛选</h3>'+
   '<div class="filter-cube-box rel"><!--筛选的条件--><div class="selected-box rel"><label class="con-title">已选条件:</label><ul class="selected-list j_select_box "></ul> <span class="cube-manage-btn j_selectMange">全部撤销</span></div>'+
   '<ul class="cube-list j_cube_list">'+
   '{{#each dim}}<li class="cube-group rel"><h4 class="cube-title">{{dim_name}}</h4><div class="cube-box ">'+
   '{{#if fill_type}}'+
   '<input class="input-popup mis-input ui-autocomplete-input cube-input {{#if city}}j_cityInput {{else}} j_popupSelect {{/if}} "type="text"value=""autocomplete="off"data-dim_id="{{dim_id}}" data-fill_url="{{fill_url}}" data-fill_type="{{fill_type}}"/>'+
 //  '{{else if city}}'+
   // '<input class="input-txt02 mis-input ui-autocomplete-input cube-input j_cityInput"type="text"value=""autocomplete="off"data-dim_id="{{dim_id}}" data-fill_type="city"/>'+
   '{{else}}'+
   '{{#each dim_data}}'+
   '<span class="cube-item"><label class="cube-item-label">'+
   '<input type="checkbox"data-id="{{id}}"data-dim_id="{{dim_id}}" data-dim_name="{{dim_name}}" data-name="{{name}}" class="j_cube_item"/>{{name}}</label></span>'+
   '{{/each}} '+
   '<span class="icon-font-arrow icon-font-top j_font_arrow">收起<i data-dim_id="{{dim_id}}"  class="icon iconfont j_font_arrow" ></i> </span><span class="icon-font-arrow icon-font-bottom      j_font_arrow">展开<i data-dim_id="{{dim_id}}"  class="icon iconfont j_font_arrow" ></i></span>'+
   '{{/if}}'+
   '</div></li>'+
   '{{/each}}'+
   '<li class="bi-btn-box"><input class="button01" type="submit"   value="确 认"></li></ul><span class="cube-list-arrow cube-list-arrow-top j_cube_list_icon">精简模式<i class="icon iconfont j_cube_list_icon icon-shangsanjiao" ></i> </span><span class="cube-list-arrow cube-list-arrow-bottom j_cube_list_icon">详细模式<i class="icon iconfont j_cube_list_icon  icon-icsanjiaoxia" ></i> </span></div> '+
   '<div class="cube-line-box j_measures_box"><h4 class="cube-title">指标项</h4><div class="cube-box ">{{#each measures}} <span class="cube-line-item" title="{{desc}}"><label class="cube-item-label"><input type="checkbox" data-id="{{id}}"  data-name="{{name}}"  >{{name}}<i class="iconfont iconfont-left-arrow" data-type="yAxis-L" data-id="{{id}}"  data-name="{{name}}"></i> <i class="iconfont iconfont-right-arrow" data-type="yAxis-R" data-id="{{id}}"  data-name="{{name}}"></i></label></span>{{/each}}</div> </div><h3 class="bi-title rel">数据分析如下<div class="chart-type-box j_tab_chart_type" ><a href="#" target="_blank" class="btn-border-box" style="display:inline-block;font-weight:500;" data-type="down-data">下载数据</a><i class="iconfont icon-tongjitu " data-type="pie"></i><i class="iconfont chart-type-active icon-zhexiantu" data-type="line"></i></div></h3>';
    
   
	var tabContentTpl=Handlebars.compile(tabContentSrt);
	var chartBoxStr='<div class="cube-chart-box flexBox rel"><ul class="tab-chart-data j_group_flag">{{#each this}}<li class="chart-data-item" data-dim_id="{{dim_id}}" data-dim_name="{{name}}">{{dim_name}}</li>{{/each}} </ul><div class="cube-chart j_cubeChart">  </div> <div class="cube-chart j_cubePieChart  hide">  </div><div class="cube-chart j_cubeBoxLoading  cube-loading  hide"> <i   class="icon-loading iconfont "></i> </div> </div> ';//图表的容器 
 
	var timeRangeTpl=Handlebars.compile('{{#each this}}<option value="{{id}}" {{#if selected}}selected="selected"{{/if}}>{{name}}</option>{{/each}}');//统计周期
	
	var chartBoxTpl=Handlebars.compile(chartBoxStr);
   var configData={};
	o.init=function(param){
		getPageConfig(param);
	}
	function getPageConfig(param){
		var p = {};
		p.url=URL;
		p.data=param;
		p.success=function(serverData){			
			if(serverData&&serverData.errmsg&&serverData.errmsg==="success"){
				 //格式化数据
				formatData(serverData.data);
			//	createTabContent(configData);				
				//填充统计周期
				//timeRange.innerHTML=timeRangeTpl(timeRangeData);
				//填充tab
				fillPageByData(configData.tabData);
				
			}else{
				p.error();
			}
		};
		p.error = function(){
			var msg = serverData.errmsg||"服务器错误，稍后重试";
			alert(msg);
		}
		myTool.ajax(p);
	}
	function fillPageByData(tabData){
		//填充tab
		var h ='';		
		for(var i = 0; i <tabData.length;i++){
			h+='<div class="mis-tab-item" data-id="'+tabData[i].cube_id+'" for="tabCon_'+tabData[i].cube_id+'">'+tabData[i].cube_name+'</div>';
		}
		tabBox.innerHTML=h;
		//填充tab对应的content
		createTabContent(configData);
		tabBox.querySelector("div.mis-tab-item").click();
	}
	function formatData(data){
		 var tab = [];
		 var cubeData={};
		 var groupBy={};
		 var period = [];//统计周期
		for(var i = 0; i <data.length;i++){
			var d = data[i];
			var cube_id=d.cube_id;
			var cube_name=d.cube_name;
			tab.push({cube_id:cube_id,cube_name:cube_name});
			 
			//
			cubeData[cube_id]={};//维度数据
			cubeData[cube_id].selectData={};//选中的纬度数据
			cubeData[cube_id].dim=[];//维度数据
			cubeData[cube_id].measures=d.measures.concat();//指标数
			groupBy[cube_id]=[];//groupBy维度
			
			//measures[cube_id]={};//指标
			period[cube_id]=d.time_range.concat();
			 formatDimsData({data:d.dims1,dim:cubeData[cube_id].dim,groupBy:groupBy[cube_id]});
			 
			  formatDimsData({data:d.dims2,dim:cubeData[cube_id].dim,groupBy:groupBy[cube_id]});
			//formatDimsData(d.dims2,cubeData[cube_id].dim,groupBy[cube_id]);
			
		}
		configData.tabData=tab;
		configData.cubeData=cubeData;
		configData.groupBy=groupBy;
		configData.period=period;
	}
	function formatDimsData(param) {
		//param={data, dim, groupBy}
		var data=param.data, 
			cubeData=param.dim, 
			groupBy=param.groupBy,
			period=param.period||{};//统计周期
			
			 
		for (var n = 0; n < data.length; n++) {
			var d = data[n];						
			var m = {};			
			m.dim_id = d.dim_id;
			m.dim_name = d.dim_name;
			//d.component_type : "1",//控件类型：1.单选 2.多选 3.地市 4.时间 5.文本框				
			m.dim_data = [];
			//,这里区分城市和大区和周期
			/*
			if(d.dim_name=="大区"){
				// 填充大区
				
				continue;
			}
			*/
			if(d.dim_name.indexOf("城市")>-1){
				//填充城市
				if (d.group_flag == 1 && groupBy) {
					groupBy.push({
						dim_id : d.dim_id,
						dim_name : d.dim_name
					});
				}
				m.city=1;//模版判断是否城市
				m.fill_type="popupCity";
				//m.fill_url=d.fill_url;
				cubeData.push(m);
				continue;
			}
			if(d.dim_id=="0803"){//先写死市场部多维分析的渠道大类下面的子渠道的groupBy
				groupBy.push({
						dim_id : "0805",
						dim_name : "子渠道"
					});
			}
			if(d.fill_type){
				if (d.group_flag == 1 && groupBy) {
					groupBy.push({
						dim_id : d.dim_id,
						dim_name : d.dim_name
					});
				}				
				m.fill_type=d.fill_type;
				m.fill_url=d.fill_url;
				cubeData.push(m);
				continue;
			}
			if (d.data && d.data.length) {
				for (var q = 0; q < d.data.length; q++) {				
					var p = d.data[q];
					m.dim_data.push({
						id : p.id,
						dim_name : d.dim_name,
						name : p.name,
						dim_id : d.dim_id
					});
				}
				cubeData.push(m);
				if (d.group_flag == 1 && groupBy) {
					groupBy.push({
						dim_id : d.dim_id,
						dim_name : d.dim_name
					});
				}
			}
		}
 
		param.period=period;
		return param;
	}
	 
	function createTabContent(configData){
		var data=configData.cubeData;
		var groupBy=configData.groupBy;
		for(var d in data){
			var div = document.createElement("div");
			div.className="cube-list-toggle hide";
			var html =tabContentTpl(data[d]);
			html+=chartBoxTpl(groupBy[d]);//图表的容器
			data[d].div = div;
			div.innerHTML=html;
			tabContent.appendChild(div);
			data[d].selectBox=div.querySelector(".j_select_box");//存放已选条件的div
			data[d].manageBtn=div.querySelector(".j_selectMange");//存放全部撤销按钮 
			data[d].cubeList=div.querySelector(".j_cube_list");//存放维度的ul 
			data[d].cityInput=div.getElementsByClassName("j_cityInput");//城市输入框 
			data[d].measuresBox=div.querySelector(".j_measures_box");//存放指标项的div 
			data[d].tabChartType=div.querySelector(".j_tab_chart_type");//line pie 的tab
			data[d].chartType="line";//默认选中line		
			data[d].list_group_flag=div.getElementsByClassName("j_group_flag")[0];//group_flag 的ul
			data[d].chartBox=div.getElementsByClassName("j_cubeChart")[0];//chart Box	line-box		
			data[d].pieChartBox=div.getElementsByClassName("j_cubePieChart")[0];//chart Box	pie-box		
			data[d].cubeBoxLoading=div.getElementsByClassName("j_cubeBoxLoading")[0];//loadingBox
			//查找绑定popupSelect
			data[d].popupSelect=[];
			 bindPopupSelect(div,data[d]);
			//addIconArrowClass(div); //展示icon
			bindClick(data[d]);
		}
	}
	function addIconArrowClass(div){
		//判断li的高度确定是否显示arrow 
		var li = div.querySelectorAll("li");
		for(var i = 0; i <li.length;i++){
			if(li[i].offsetHeight>50&&li[i].querySelector(".j_cube_item")){
				li[i].setAttribute("data-height",li[i].offsetHeight)
				li[i].classList.add("cube-li-hide");				
			}
		}
	}
	function bindClick(param){
		//维度的点击
		param.cubeList.addEventListener("click", function (e) {
			var ele = e.target;
			var nodeName = ele.nodeName.toLowerCase();
			if (nodeName === "input") {
				var type = ele.getAttribute("type");
				switch (type) {
				case "text"://区分城市弹层和其他弹层				
					var fill_type=ele.getAttribute("data-fill_type");
					if(fill_type==="popupCity"){
						popupSelect.closeAll();
						popupCity.close();
						popupCity.open({
						cityInput : $(ele)
					});
					}
					break;
				case "checkbox":
					checkedEvent(ele);
					break;
				case "submit":
					//确认按钮
					//收起选择框
					param.div.classList.remove("cube-list-toggle");
					getCubeData(param);
					break;
				}
			} else if (ele.classList.contains("j_font_arrow")) {
				//li展开收起 
				var p = ele.parentNode;
				while (p.nodeName.toLowerCase() !== "li"&&p.nodeName.toLowerCase() !== "body") {
					p = p.parentNode;
				}
				p.classList.toggle("cube-li-show");				
				var h = p.getAttribute("data-height");
				p.classList.contains("cube-li-show")?p.style.height=h+"px":p.style.cssText="";
				 
			}
		}, false);
		param.div.addEventListener("click", function (e) {
			var ele = e.target;
			var nodeName = ele.nodeName.toLowerCase();
			if(ele.classList.contains("j_cube_list_icon")){
				//ul的精简和详细模式点击
				this.classList.toggle("cube-list-toggle");
			}
		},false);
		//selectDiv的删除点击
		param.selectBox.addEventListener("click",function(e){
			var ele = e.target;
			var nodeName = ele.nodeName.toLowerCase();
			if(nodeName==="i"){
				//
				var id = ele.getAttribute("data-id");
				if(id){
				 param.div.querySelector(".j_cube_item[data-id='"+id+"']").click();
				}
			}
		},false);
		//全部撤销按钮的点击
		param.manageBtn.addEventListener("click",function(e){
			 param.selectData={};
			 var item  =param.div.querySelectorAll(".j_cube_item:checked");
			 for(var i = 0; i <item.length;i++){
				item[i].click();
			 }
			 param.div.querySelector("input[type='text']").value="";
		},false);
		//指标项点击
		param.measures={};
		param.measuresBox.addEventListener("click", function (e) {
			var ele = e.target;
			var checkedClass = 'input-checked';
			var nodeName = ele.nodeName.toLowerCase();
			var data_id=ele.getAttribute("data-id");
			var parentEle=ele.parentNode;
			switch(nodeName){
				case "i":
				//左右箭头
				e.preventDefault();
				var yAxis=ele.getAttribute('data-type');
				if(yAxis){
					shangeYaxis(yAxis,ele.getAttribute('data-id'),parentEle,param);
				}				
				break;
				case "input":
					if (ele.checked) {
					//添加class
					parentEle.classList.add(checkedClass);					
					parentEle.classList.add('active-left-yAxias');					
					param.measures[data_id]="yAxis-L";
					//param.measures[data_id]=1;
					getCubeData(param);
				} else {
					//移除class
					parentEle.classList.remove(checkedClass);
					//parentEle.classList.remove('active-left-yAxias');
					parentEle.classList.remove('active-right-yAxias');
					delete param.measures[data_id];
					//绘制图形 					
					fillChartBox(param);//以前是获取全部指标项数据，只渲染选中的数据，现在改为获取选中的指标项数据并且渲染
					param.cubeBoxLoading.classList.add("hide");
				}
				break;
				default:				
				break;
			}			 
		}, false);
		//初始化选中1个指标项
		var firstCheck=param.measuresBox.querySelector("input[type='checkbox']");
		if(firstCheck){
				firstCheck.checked=true;
				$(firstCheck).parents("label").addClass("input-checked active-left-yAxias"); 
					var data_id=firstCheck.getAttribute("data-id");
					param.measures[data_id]="yAxis-L";
		}
		//param.measuresBox.querySelector("input[type='checkbox']").click();
		param.tabChartType.addEventListener("click",function(e){
			//饼图 线图的切换
			
			//默认选中line
			var ele = e.target;
			var type =ele.getAttribute("data-type");
			if(type){
				if(type==="down-data"){
					ele.href="/cube/data_export?"+encodeObj(getSelectData(param));//下载链接
					return true;
				}
				if(param.chartType!=type){
					//切换chart 					
					var p = this.querySelector("."+chartTypeClass);
					if(p){
						p.classList.remove(chartTypeClass);
					}
					ele.classList.add(chartTypeClass); 
					param.chartType=type;
					//改变chartType渲染数据
					//balabala
					fillChartBox(param);
				}
				 
			}
		},false);
		param.list_group_flag.addEventListener("click",function(e){
			//group_flag的点击操作
			var activeClass='chart-data-item-active';
			var ele = e.target;
			var dim_id=ele.getAttribute("data-dim_id");
			if(dim_id!==null&&dim_id!==undefined){
				//
				if(ele.classList.contains(activeClass)===false){
					//
					var p = this.querySelector("."+activeClass);
					if(p){
						p.classList.remove(activeClass);
					}
					ele.classList.add(activeClass);
					//更新图表数据
					//balabala
					param.groupBySelect=dim_id;
					//
					
				}else{//取消groupBy
					ele.classList.remove(activeClass);
					param.groupBySelect="";
				}
				getCubeData(param);
			}
			
		},false);
		
	}
	function shangeYaxis(LoR,id,ele,param){//改变曲线图的y轴，0 1
		//
		var l_class='active-left-yAxias';
		var r_class='active-right-yAxias';
		var c = LoR==='yAxis-R'?r_class:l_class;
		ele.classList.remove(l_class);
		ele.classList.remove(r_class)
		ele.classList.add(c);
		//改变曲线Y轴坐标
		if(param.chartType==="line"){
			//console.log(param.myChart.categoryAxis.getIndexByName("订单数"));
			//重绘曲线图
			param.measures[id]=LoR;
			fillChartBox(param);
		}
	 
		
	}
	function checkedEvent(ele) {
		var checkedClass='input-checked';
		var showId=configData.showId;
		var id=ele.getAttribute("data-id");
		var dim_name=ele.getAttribute("data-dim_name");
		var dim_id=ele.getAttribute("data-dim_id");
		var name=ele.getAttribute("data-name");
		if(ele.checked) {
			configData.cubeData[showId].selectData[id]={dim_name:dim_name,id:id,dim_id:dim_id,name:name};
			//添加class
			 ele.parentNode.classList.add(checkedClass);
		}else {
			delete configData.cubeData[showId].selectData[id];
			//移除class
			 ele.parentNode.classList.remove(checkedClass);
		}
		fillSelectDom(configData.cubeData[showId]);
	}
	function fillSelectDom(obj){
		//填充选择的容器
		 obj.selectBox.innerHTML = selectTpl(obj.selectData);
	}
	function bindPopupSelect(div,param) {
		var domBox = div.getElementsByClassName("j_popupSelect"); //selectInput
		if (domBox) {
			for (var i = 0; i < domBox.length; i++) {
				var input = domBox[i];
				//var input = $(domBox[i]);
				//ajax获取接口数据
				var url = domBox[i].getAttribute("data-fill_url");
				(function(inputDom){
				$.get(url, function (serverData) {
					if (serverData && serverData.errmsg == "success" && serverData.data) {
						var p = {};
						p.data = serverData.data;
						p.keys = {
							"id" : "channel_id",
							"name" : "channel_name",
							"parentId":inputDom.getAttribute("data-dim_id"),
							"childKey":"dim_id"
						};
						p.input = inputDom;
						p.tplName="tplCheckboxStr";
						param.popupSelect.push(popupSelect.init(p));
					}
				}, "json");
				})(input);
			}
		}
		 
	}
	function getCubeData(param){		 
		param.cubeBoxLoading.classList.remove("hide");
		//var chartBox=param.chartBox;
		//获取数据,展示图表
		//var p = {url:"/pre_mis/cube/get_datas"};
		var p = {url:"/cube/get_datas"};
			p.data=getSelectData(param);
			p.success=function(serverData){
				param.cubeBoxLoading.classList.add("hide");
				 if(serverData &&serverData.errno==0){
					//console.log(serverData);					
					//格式化数据，绘制图表
					if(serverData.data){
						param.serverData=serverData.data;
						fillChartBox(param);
					}else{
						p.error();
					}									
										
				 }else{
					 p.error();
				 }
			}
			p.error=function(){
				console.log("xhr错误\n");
				console.log(configData[configData.showId]);
				 fillChartError(param);
			}
			p.type="POST";
		myTool.ajax(p);
	}
	function getSelectData(param){
		var d = param.selectData;
		var p = {};
		p.StartDate =startDate.value;
		p.EndDate  =endDate.value;
		p.CubeID=configData.showId;
		p.TimeRange=timeRange.value;
		p.Dims={};
		for(var key in d){
			var k = d[key];
			p.Dims[k.dim_id]=p.Dims[k.dim_id]||[];
			p.Dims[k.dim_id].push(key);
		}
		//城市模块
		if (param.cityInput && param.cityInput.length) {
			for (var i = 0; i < param.cityInput.length; i++) {
				var this_input = param.cityInput[i];
				if(this_input.value){
					var cityId = popupCity.getCityCodeByNames(this_input.value);
				var dim_id = this_input.getAttribute("data-dim_id");
				p.Dims[dim_id] = cityId;
				}
				
			}
		}
		//popupSelect 模块
		//var popupData=[];
		param.popupSelect.forEach(function(v){
			 var a = v.getValue();
			 if(a&&a.all.length){
				 if(a.parentId){
					  p.Dims[a.parentId]=p.Dims[a.parentId]?p.Dims[a.parentId].concat(a.parentValue):a.parentValue;
				 }				
				 for(var m in a.childValue){
					 p.Dims[m]=p.Dims[m]?p.Dims[m].concat(a.childValue[m]):a.childValue[m];
				 }
			 }
		})
		//console.log(popupData);
		p.Dims=JSON.stringify(p.Dims);
		if(param.groupBySelect){//groupBySelect的选择
			p.groupDim =param.groupBySelect;
		}
		//选中的指标项
		var measure_list=[];
		for(var k in param.measures){
			if(param.measures.hasOwnProperty(k)){
				 measure_list.push(k);
			}
		}
		p.measure_list=JSON.stringify(measure_list);
		return p;
	}
	function fillChartBox(p) {		 
		var data = p.serverData;
		if (data) {
			var option = formatChartData(p);
			p.chartOption = option;
			if (p.chartType == "pie") {
				//绘制饼图
				//每个饼图一个canvas
				createPieByData(p)
			} else {
				p.pieChartBox.classList.add("hide");
				//p.chartBox.innerHTML="";
				p.chartBox.classList.remove("hide");
				p.myChart = myEchart.createChart(p.chartBox, p.chartOption[p.chartType || "line"]);
			}
		}else{
			fillChartError(p);
		}
	}
	function fillChartError(param){
		param.cubeBoxLoading.classList.add("hide");
		if(param.myChart &&typeof param.myChart.dispose==="function"){
					param.myChart.dispose();
				}				
				param.pieChartBox.innerHTML="";
				param.chartBox.innerHTML="";
	}
	function formatChartData(param) {
		var measures = param.measures;
		var data = param.serverData;
		var xAxis = {
			data : data.time
		};
		var yAxis = [{
				type : 'value',
				scale : false
			}, {
				type : 'value',
				scale : false
			}
		];
		var q = getSelectMeasures(measures, data.item);
		var a = {};
		a.line = {
			xAxis : xAxis,
			yAxis : yAxis,
			series : q.lineSeries,
			legend : {
				data : q.legend
			},
			tooltip:{show:true,trigger:'axis'},
			toolbox : {
				show : true,
				feature : {
					mark : {
						show : true
					},
					dataView : {
						show : true
					},
					magicType : {
						show : true,
						type : ['line', 'bar']
					},
					dataZoom : {
						show : true,
						title : {
							dataZoom : '区域缩放',
							dataZoomReset : '区域缩放后退'
						}
					},
					restore : {
						show : true
					},
					saveAsImage : {
						show : true
					}
				}
			},
		};
		a.pie = q.pie;
		return a;
	}
	function getSelectMeasures(measures, item) {
		var seriesData = [];
		var legend = [];
		var pieOption = [];
		for (var key in measures) {
			if (measures[key] && item[key]) {
				var m = item[key];
				for (var i = 0; i < m.data.length; i++) {
					var n = {
						name : m.name,
						type : 'line',
						large:true,
						data : []
					};
					n.name = n.name + m.data[i].name;
					legend.push(n.name);				
					m.data[i].data.forEach(function (value) {
						n.data.push(value - 0);
					});
					/*
					var max = Math.max.apply(window, n.data)
						//这里区分左右数轴
						if (max <= MAX_YAXIS) {
							n.yAxisIndex = 1
						}
						*/
					n.yAxisIndex = measures[key]==='yAxis-R'?1:0;	
						seriesData.push(n)
				}
				//这里计算饼图的数据
				pieOption.push(formteData2Pie(item[key]));
			}
		}
		

		return {
			lineSeries : seriesData,
			legend : legend,
			pie : pieOption
		}
	}
	 function formteData2Pie(item) {
	 	var title = item.name;
	 	var a = {
	 		title : {
	 			text : title,
	 			x : 'center'
	 		},
	 		tooltip : {
	 			trigger : 'item',
	 			formatter : "{a} <br/>{b} : {c} ({d}%)"
	 		},
	 		legend : { 
	 			x : 'center',
	 			y : 'bottom',
	 			data : []//填充数据
	 		},
			
			calculable : true,
	 		series : [{
	 				name : title,
	 				type : 'pie',
	 				radius : '40%',
	 				center : ['50%', '60%'],					
	 				data : [] //填充数据
	 			}
	 		]
	 	};
		var legendData=[];
		var seriesDataSort=[];
		var seriesData=[];
		//var d = {};
		for(var i = 0 ; i <item.data.length;i++){
			var key = item.data[i].name;		
			var arraySum = 0;

			item.data[i].data.forEach(function(value){ arraySum+=(value-0);});
				//legendData.push(key);
			seriesDataSort.push({name:key,value:arraySum});
		}
		//排序合并
		seriesDataSort.sort(function(a,b){
			return b.value -a.value;
		});
		var sortMax=10;
		seriesDataSort.forEach(function(v,i){
			if(i<sortMax){
				seriesData.push(v);
			}else{
				seriesData[sortMax]=seriesData[sortMax]?seriesData[sortMax]:{name:"其他",value:0}
				seriesData[sortMax].value+=v.value;
			}
		})
		/*for(var key in d){
			legendData.push(key);
			seriesData.push({name:key,value:d[key]})
		}
		*/
		a.legend.data=legendData;
		a.series[0].data=seriesData;
		return a;
	 }
	  
	 function createPieByData(param){
		var chartBox = param.chartBox;
		chartBox.classList.add("hide");
		var pieChartBox=param.pieChartBox;
		pieChartBox.innerHTML="";
		pieChartBox.classList.remove("hide");
		
		for(var i = 0; i <param.chartOption.pie.length;i++){
			var opt = param.chartOption.pie[i];
		var pieBox = document.createElement("div");
			pieBox.className="cube-pie-box";
			pieChartBox.appendChild(pieBox);
			myEchart.createChart(pieBox,opt,"pie")
		}
	 }
	 function encodeObj(obj){
		 var s = "";
		 for(var key in obj){
			 if(obj.hasOwnProperty(key)){
				 s+=encodeURIComponent(key)+"="+encodeURIComponent(obj[key])+"&";
			 }
		 }
		 return s;
	 }
	tabBox.addEventListener("click",function(e){
		var ele = e.target;
		if(ele.getAttribute("data-id")){
			var showId=ele.getAttribute("data-id");
			//添加class
			if(configData.showId!==showId){
				//removeAllClass
				var d = this.querySelector("."+tabClass);
				if(d){
					d.classList.remove(tabClass);
				}
				ele.classList.add(tabClass);
				//展示对应的div
				if(configData.cubeData[configData.showId]){
					configData.cubeData[configData.showId].div.classList.add("hide");
				}
				configData.showId=showId;		
				configData.cubeData[showId].div.classList.remove("hide");
				addIconArrowClass(configData.cubeData[showId].div);
				//统计周期的显示
				var timeRangeData = configData.period[showId];
				timeRange.innerHTML=timeRangeTpl(timeRangeData);
			}
		}
	
	},false);
	timeRange.addEventListener("change",function(e){
		 
		var index = this.selectedIndex;
		var showId=configData.showId;
		configData.period[showId].forEach(function(value,i,arr){
			if(i !==index){
				delete arr[i].selected;
			}else{
				arr[i].selected=1;
			}
		})
	
	},false)
	module.exports=o;
    //return o;
