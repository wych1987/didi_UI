

var page = require("page"); 
var tool_obj = {
	isEdit:'<template v-if="tr.isEdit"><a href="#" target="_blank"  class="ddui-action-item" data-type="edit" v-attr="data-id:tr.id"><i class="iconfont ddui-icon-bianji" data-type="edit" v-attr="data-id:tr.id"></i>编辑</a></template>',
	isCopy:'<template v-if="tr.isCopy"><a  href="#" class="ddui-action-item" data-type="copy" v-attr="data-id:tr.id"><i class="iconfont ddui-icon-quanbuwenshufuzhi" data-type="copy" v-attr="data-id:tr.id"></i>复制</a></template>',
	isSearch:'<template v-if="tr.isSearch"><a href="#" target="_blank" class="ddui-action-item" data-type="search" v-attr="data-id:tr.id"><i class="iconfont ddui-icon-sousuo" data-type="search" v-attr="data-id:tr.id"></i>查看</a> </template>'
}
var gridviewTpl=__inline("gridview.tpl.html")


/*
写个for循环拼接字符串
*/
function createTbodyTpl(tbody,tool){
	var h = "";
	var d = formatTplData(tbody);
	d.forEach(function(v){		 
			h+='<td ><div class="ddui-gridview-title '+v.className+' " >{{tr.'+v.text+'}}</div></td>';
	});
	var t = "";
	if(tool){
		tool.forEach(function(v){
			t+=tool_obj[v];
		})
	}
	h+='<td ><div class="ddui-gridview-col-action color-orange" >'+t+'</div></td>';
	return h;
}
function initGridViewComponent(tbody,tool){
	var h = createTbodyTpl(tbody,tool);
	var tpl = gridviewTpl.replace("{{tbody}}",h);
    /*
var table = 	Vue.extend('gridview', {
		inherit: true,
		 replace:true,
	  	template:  tpl,
		methods:{
			viewClick:function(v,event){
				var target = event.target;
				while(target.nodeName.toLowerCase()!=="a"){
					target = target.parentNode;
				}
				 this.$dispatch('viewClick', target,v)
			}
		}
	});
	*/
	return {
        inherit: true,
        replace:true,
        template:  tpl,
        methods:{
            viewClick:function(v,event){
                var target = event.target;
                while(target.nodeName.toLowerCase()!=="a"){
                    target = target.parentNode;
                }
                this.$dispatch('viewClick', target,v)
            }
        }
    };
}

/*
param.data,
param.thead,
param.tbody
*/
/*
var gridviewData=[
	{
		"active_name":"111",
		"start":"1234",
		"user_name":123,
		"active_type":123,
		"active_money":123,
		"active_people":123,
		"active_state":2015,
		isEdit:1
	}
]
*/
function init(param){
    var template = 	initGridViewComponent(param.tbody,param.tool);
	var g = {};
	 var gridview_vue=createGridView(param,template);
	 g.gridview_vue=gridview_vue;
	 g.url = param.url;
	 g.param=param.param;//ajax的参数
	 g.pageIndex  = 1;
	 g.pageDom = $(param.id).find(".j_gridViewPage");
	 g.isFormat=param.isFormat||false;
	 g.tool=param.tool;
	 g.formatData=param.formatData;
	 g.changeData= changeData;
	 updateGridViewData(g);
	 pageClick(g);
	 return g;
}
function createGridView(conf, template) {
    console.log(JSON.stringify(template));
    var gridview_vue = new Vue({
        el: conf.id,
        data: {
            grid: {
                thead: formatTplData(conf.thead),
                data: []
            },
            isHide:conf.isHide||false
        },
        components: {
            'gridviewComponent': template

        }
    });
    if (conf.viewClick && typeof conf.viewClick === "function") {
        gridview_vue.$on("viewClick", function (target, v) {
            conf.viewClick(target, v);
        })
    }
    return gridview_vue;
}
function changeData(param){
	this.param = param;
	this.pageIndex  = 1;
	updateGridViewData(this);
}
/*
*格式化数据，默认打开tool的所有元素
*/
function formatServerData(grid,data){
	if(grid.isFormat){
		data.forEach(function(v){
			grid.tool.forEach(function(key){
				v[key]=v[key]||true;
			})
		})
	}
	return data;
}
function updateGridViewData(grid){
	var url = grid.url;
	var p = grid.param;
	var gridview_vue =grid.gridview_vue;
	var pageDom = grid.pageDom;
	var pageIndex=grid.pageIndex;
	p.pageIndex=pageIndex;
	$.get(url,p,function(serverData){
			if(serverData&&serverData.data){
				var data = serverData.data;
				if(grid.formatData&&typeof grid.formatData==="function"){
					data = grid.formatData(data);
				}
				gridview_vue.grid.data=formatServerData(grid,data);
				//处理翻页
				var totalNum=serverData.total_num;
				page.createPage({dom:pageDom,index:pageIndex||1,total:totalNum||1});
			}else{
				//错误处理
			}
	},"json");
}
function pageClick(grid){
	grid.pageDom.on("click",function(e){
		  //翻页的点击
        var ele= e.target;
        var p = ele.getAttribute("i");
        if(p!==null){
             grid.pageIndex=p-0;
             updateGridViewData(grid);
        }
	})
}
function formatTplData(data){
	var t = [];
	data.forEach(function(v){
		if(typeof v ==="object"){
			t.push(v)
		}else{
			t.push({text:v});
		}
	})
	return t;
}
var o = {}
o.init=init;
module.exports=o;