//define(["jquery","handlebars","page","myTool","tag_popup"],function($,Handlebars,page,myTool,tag_popup){
		var page = require("page");
	var myTool= require("myTool");
 
	var tag_popup= require("tag_popup");
 
   var o = {}
   var startDate=$("#startDate");
   var endDate=$("#endDate");
    var state=$("#taskState");
    var keyword=$("#keyword");
   var  searchBtn=$("#searchBtn");
   var gridView=$("#gridView");
    var pageDom=$("#gridViewPage");
   var pageIndex=1;
   var statusName=["未开始","进行中","已完成","任务异常"];
    var popupSendMail=$("#popupSendMail");
    var mailInput=$("#mailInput");
    var MAILURI="@diditaxi.com.cn";//邮箱后缀
    var sendMailURL="./export?type=email&";//发送邮件的api接口
    //./export?type=download&id=30 下载接口
    var mailMsg="";//保存需要发送的数据的id等
    var ajaxURL="./getTagTaskList";
    var gridviewTplHeader=[
        "任务名称",
        "操作人",
        "提交时间",
		"任务状态",
        "操作"
    ];
    var gridViewTplContent=[
        '{{taskname}}',
        '{{username}}',
        '{{op_time}}',
		'{{statusName}}',
        '{{#if isHref}}<a href="./detail?id={{id}}&type={{type}}" target="_blank" class="gridview-link">查看</a><a href="./export?type=download&id={{id}}&source={{type}}" target="_blank" class="gridview-link">下载</a><span class="mis-btn mis-btn02 hide" c="{{id}}" type="send">发送</span>{{#if setTpl}}<span class="mis-btn mis-btn02 " c="{{id}}" type="tpl">设为模版</span>{{/if}}{{else}}<span tasg_id="{{id}}" class="hide">查看</span>{{#if setTpl}}<span class="mis-btn mis-btn02 hide" c="{{id}}" type="tpl">设为模版</span>{{/if}}{{/if}}'
    ];
    var gridviewTpl='<table border-space="0"class="mis-gridview-table"><thead><tr>'+myTool.createGridviewHeader(gridviewTplHeader)+'</tr></thead><tbody>{{#each this}}<tr>'+myTool.createGridviewHeader(gridViewTplContent,'td')+'</tr>{{/each}}</tbody></table>';
    var template = Handlebars.compile(gridviewTpl);
    o.init=function(){
        searchBtn.triggerHandler("click");
        initPopup();
        myTool.sliderDown({targetDom:$("#searchBox"),sliderDom:$("#filterBox"),targetClass:"search-box-slider",sliderClass:"hide"});
    }
    function initPopup(){
        var popup={};
        popup.dom=popupSendMail;
        popup.close={};
        popup.close.dom=$("#popupCloseBtn");
        popup.close.callback=function(){
            mailInput.val("");
        }
        popup.save={};
        popup.save.dom=$("#saveSubmit");
        popup.save.callback=function(){
            var userMail=mailInput.val();
            if(window.localStorage){
                localStorage.setItem("userMail",userMail);
            }
            var img=new Image();
            img.src=sendMailURL+"email="+encodeURIComponent(userMail+MAILURI)+"&id="+mailMsg;
            img=null;
            myTool.popupClose(popupSendMail);
        }
        myTool.popup(popup);
    }
	
    searchBtn.bind("click",function(){
        pageIndex=1;
        getListData();
    });
    function getListData(){
        $.get(ajaxURL,{page:pageIndex,begintime:startDate.val(),endtime:endDate.val(),state:state.val(),keyword:keyword.val()},function(serverData){
            if(serverData.errno==0&&serverData.data){
                //填充模版
                var d = formatData(serverData.data);
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
	function formatData(d){
		for(var i = 0; i <d.length;i++){			
				var s = d[i].status-0;
				d[i].statusName=statusName[s];
				if(s==2){
					d[i].isHref=true;
				}
                if(d[i].is_template==0){
                    d[i].setTpl=true;
                }
		}
		return d;
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
        var ele=event.target;
        var t = ele.getAttribute("type");
        switch (t){
            case "send":
                //弹窗发送邮件
                var id=ele.getAttribute("c");
                openPopup(id);
                break;
			case "tpl":
			 var id=ele.getAttribute("c");
				tag_popup.saveTplByTaskId=id;
				tag_popup.open({},function(){
					getListData();
				});
				break;
            default :
                break;
        }
    });
    function openPopup(id){
        mailMsg=id;
        if(window.localStorage){
            var userMail=localStorage.getItem("userMail");
            if(userMail){
                mailInput.val(userMail);
            }
        }
        myTool.popupOpen(popupSendMail);
    }
   module.exports=o;