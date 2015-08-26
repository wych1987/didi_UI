define('page', function(require, exports, module){ //define(["jquery"],function($){
//define(function(require) {	  
  var o = {};
    o.className={action:"page-action",
        btn:"page-btn",
        disabled:"ep-pages-disabled"
    };
    o.tpl = '<li class="page-action" i="0">1</li>';//  <li class="page-btn ep-pages-disabled">上一页</li>
    //@param.index当前页码1开始
    //@param.total总页码
    //@param.dom//放置页码的Dom节点
    o.createPage = function(param){
        var html = '',pageNum = 10,baseNum= 5;
        param.index=param.index-0;
        param.total=param.total-0;
        if(param.index>1){
            html+='<li class="page-btn" i="'+(param.index-1)+'">上一页</li>';
        }
        if(param.total<=pageNum){//总页码小于pageNum的情况
            for(var i = 1 ; i <=param.total;i++){
                if(i==param.index){
                    html+='<li class="page-action" >'+(param.index-0)+'</li>';
                }else{
                    html+= getPageItem("",i);
                }
            }
        }else{//当总页数大于pageNum
            if(param.index<=baseNum){
                for(var i = 1 ; i <=pageNum;i++){
                    var className = i==param.index? this.className.action:"";
                    html+= getPageItem(className,i);
                }
            }else{
                for(var i = param.index-baseNum ; i <param.index;i++){
                    html+= getPageItem("",i);
                }
                html+='<li class="page-action" >'+(param.index-0)+'</li>';
                i++;
                for(; i <param.index+baseNum&&i<=param.total;i++){
                    html+= getPageItem("",i);
                }
            }
        }
        if(param.total&&param.index!=param.total){
            html+='<li class="page-btn" i="'+(param.index-0+1)+'">下一页</li>';
        }
        param.dom.html?param.dom.html(html): param.dom.innerHTML = html;
    };
    function getPageItem(className,i){
        return '<li class="'+className+'" i="'+i+'">'+(i-0)+'</li>';
    }
	module.exports=o;
    // return o;
// }) 
});