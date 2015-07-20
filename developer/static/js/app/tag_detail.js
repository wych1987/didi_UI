//define(["jquery","handlebars","page","myTool"],function($,Handlebars,page,myTool){
		var page = require("page");
	var myTool= require("myTool");
   var o = {};
   var gridView=$("#gridView");
    var pageDom=$("#gridViewPage");
   var pageIndex=1;
   var type=myTool.getURLSearch("type");
    var ajaxURL="./getDetailList";
   var template = {};
   var gridviewTplHeader=[];
    var gridViewTplContent=[];
    var task_id="";
    o.init=function(param){
        template=formatTpl(param.tplKey);
        task_id=param.task_id;
         getListData();
    }
    function formatTpl(tplKey){
        gridviewTplHeader=tplKey.names;
        var key=tplKey.keys;       
        for(var i = 0; i <key.length;i++){
            gridViewTplContent.push("{{"+key[i]+"}}");
        }
        var gridviewTpl='<table border-space="0"class="mis-gridview-table"><thead><tr>'+myTool.createGridviewHeader(gridviewTplHeader)+'</tr></thead><tbody>{{#each this}}<tr>'+myTool.createGridviewHeader(gridViewTplContent,'td')+'</tr>{{/each}}</tbody></table>';
       return Handlebars.compile(gridviewTpl);
    }
    function getListData(){
        $.get(ajaxURL,{pagenum:pageIndex,id:task_id,type:type},function(serverData){
            if(serverData.errno==0&&serverData.data){
                //填充模版
                var d = serverData.data;
                gridView.html(template(d));
                var totalNum=serverData.total_num;
                page.createPage({dom:pageDom,index:pageIndex,total:totalNum});
            }else{
                errorFun();
            }
        },"json").error(function(){
                errorFun();
            });
    }
    function errorFun(){
        gridView.html('<table border-space="0"class="mis-gridview-table"><thead><tr>'+myTool.createGridviewHeader(gridviewTplHeader)+'</tr></thead><tbody><tr><td colspan="'+gridviewTplHeader.length+'">暂无数据</tr></tbody></table>');
        pageIndex=1;
        page.createPage({dom:pageDom,index:pageIndex,total:1});
    }
    pageDom.bind("click",function(e){
        //翻页的点击
        var ele= e.target;
        var p = ele.getAttribute("i");
        if(p!==null){
             pageIndex=p-0;
            getListData();
        }
    });
    gridView.on("click",function(evevn){

    });
module.exports=o;