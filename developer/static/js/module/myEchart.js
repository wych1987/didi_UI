//define(['echarts', 'echarts/chart/line', 'echarts/chart/pie', 'echarts/chart/bar'], function (echarts) {
//define(function(require) {	
    // var echarts = require('echarts');
    // require('echarts/chart/line');
    // require('echarts/chart/pie');
    // require('echarts/chart/bar');
	 	 
 
	var o = {};
	//var chartLineColor=["#ff7f01","#ed258e","#fc16ff","#0125ff","#f10101","#1db239","#df7eff","#f37a6c","#51b3ff","#f670d8","#d9ff66","#a5e221","#1fba76"];
	var chartLineColor=[ 
    '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', 
    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0', 
    '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700', 
    '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0' 
];
	var option={};
	function setOption(opt) {
		 
		var opt = opt || {};
		var legend = {};
		legend = setValue(legend, opt.legend || {}, {
				x : 'left', // 'center' | 'left' | {number},
				y : 'bottom', // 'center' | 'bottom' | {number}
				padding : [5, 80, 15, 80]
			});
		var xAxis =opt.xAxis;
		var yAxis =opt.yAxis||[{
					type : 'value',
					boundaryGap:false,
					scale: true
				}
			];
		var series = opt.series;
		var tooltip = setValue({}, opt.tooltip, {
				show : true,
				trigger : 'axis'
			});
		var toolbox={show:false}	
		var option = {
			grid:{x:80,y:30,x2:80,y2:100},
			title : {
				text : opt.title || ""
			},
			color : opt.lineColor || chartLineColor,
			legend : legend,
			tooltip : tooltip,
			toolbox:opt.toolbox||toolbox,
			xAxis : xAxis,
			yAxis : yAxis,
			series : series
		};
		if(opt.yAxis){
			option.yAxis=opt.yAxis;
		}
		 
		return option;
	}
  function setValue(a, b, init) {
  	if (init) {
  		for (var q in init) {
  			if (init.hasOwnProperty(q)) {
  				a[q] = init[q];
  			}
  		}
  	}
  	if (b) {
  		for (var k in b) {
  			if (b.hasOwnProperty(k)) {
  				a[k] = b[k];
  			}
  		}
  	}
  	return a;
  }
	o.createChart = function (dom, option, chartType) {
		var myChart = echarts.init(dom);
		myChart.showLoading({
			text : "loading",
			textStyle : {
				fontSize : 20
			}
		});
		var opt = {};
		if (chartType) {
			opt = option;
			if (!opt.color) {
				opt.color = chartLineColor;
			}			
		} else {
			opt = setOption(option);
		}
		console.log(JSON.stringify(opt));
		myChart.setOption(opt);
		myChart.hideLoading();
		return myChart;
	}
	module.exports=o;
	// return o;
// });
