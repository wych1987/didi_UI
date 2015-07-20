define("marketList",  function(require, exports, module){
		var page= require("page");
		var myTool=require("myTool");
   var o = {}
    var popupCity={};
   var startDate=$("#startDate");
   var endDate=$("#endDate");
   var  searchBtn=$("#searchBtn");
   var gridView=$("#gridView");
    var pageDom=$("#gridViewPage");
   var pageIndex=1;
    var gridviewTplHeader=[
        "活动名称",
        "活动类型",
        "创建时间",
        "状态",
        "操作"
    ];
    var gridViewTplContent=[
        '{{name}}',
        '{{type}}',
        '{{addtime}}',
        '{{verify_status}}',
        '<a href="./edit?id={{id}}" target="_blank" class="{{#if isEdit}}{{else}}hide{{/if}}">编辑</a>'
    ];
    var gridviewTpl='<table border-space="0"class="mis-gridview-table"><thead><tr>'+myTool.createGridviewHeader(gridviewTplHeader)+'</tr></thead><tbody>{{#each this}}<tr>'+myTool.createGridviewHeader(gridViewTplContent,'td')+'</tr>{{/each}}</tbody></table>';
    var template = Handlebars.compile(gridviewTpl);
    o.init=function(param){

        searchBtn.triggerHandler("click");
    }
    searchBtn.bind("click",function(){
        pageIndex=1;
        getListData();
    });
    function getListData(){
        $.get("./act_list_data",{page:pageIndex,begintime:startDate.val(),endtime:endDate.val()},function(serverData){
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
   // return o;
   module.exports=o;
});