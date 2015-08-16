<?php
include("../layout/header.php");
?>
<div style="padding: 50px;" id="customerBox">
    <div class="ddui-form-item">
        <label class="ddui-label">客户类型</label>
        <select class="ddui-select" v-model="userType" options="userTypeList"> </select>
    </div>

    <!--
    <ul class="ddui-tab-list">
        <li data-index="1" class="ddui-tab-active">乘客</li>
        <li>乘客</li>
        <li>乘客</li>
        <li>乘客</li>
    </ul>
    -->
    <div class="ddui-form-item">
    <div class="oper-box">
        <ul class="oper-list">
            <li class="oper-row" v-repeat="row:operList">
                <div class="customer-box">
                    <input type="text" class="ddui-input-01" placeholder="选择人群" v-model="row.a.name" v-on="click:customerInput($event)">
                    <div class="oper-field">
                        <label class="ddui-select-label01">计算字段</label>
                        <select type="text" class="ddui-select-01" v-model="row.a.operfield">
                            <option value="pid">pid</option>
                            <option value="cid">cid</option>
                            <option value="wid">wid</option>
                            <option value="uid">uid</option>
                        </select>
                    </div>
                </div>
                <div class="oper-field">
                    <label class="ddui-select-label01">运算</label>
                    <select type="text" class="ddui-select-01" v-model="row.operType">
                        <option value="+">加</option>
                        <option value="-">减</option>
                        <option value="*">乘</option>
                        <option value="/">除</option>
                    </select>
                </div>
                <div class="customer-box">
                    <input type="text" class="ddui-input-01" placeholder="选择人群" v-model="row.b.name">
                    <div class="oper-field">
                        <label class="ddui-select-label01">计算字段</label>
                        <select type="text" class="ddui-select-01" v-model="row.b.operfield">
                            <option value="pid">pid</option>
                            <option value="cid">cid</option>
                            <option value="wid">wid</option>
                            <option value="uid">uid</option>
                        </select>
                    </div>
                </div>
                <div class="customer-box">
                    <label>临时客户群名称:</label>
                    <span >{{row.tempName}}</span>
                </div>
                <button class="ddui-btn-delete" v-if="$index" v-on="click:deleteRow($index)">删除</button>
            </li>
        </ul>
    </div>
    </div>
    <div class="ddui-form-item">
        <button class="ddui-btn-big ddui-btn-add" v-on="click:addRow">
            <i class="iconfont ddui-font-jiahao"></i>
            添加新运算
        </button>
    </div>
     <div class="ddui-form-item">
         <label class="ddui-label">随机抽取</label>
          <input type="text" placeholder="随机抽取运算结果占比" class="ddui-input-text" number v-model="randomNum"/><span>%</span>
    </div>
    <div class="ddui-form-item">
        <label class="ddui-label">参照组占比</label>
        <input type="text" placeholder="随机抽取中参照组占比" class="ddui-input-text" v-model="czzPercent" number/><span>%</span>
    </div>
<div class="ddui-form-item">
        <label class="ddui-label">客户群名称</label>
        <input type="text" placeholder="运算后客户群名称" class="ddui-input-text" v-model="taskMame"/>
    </div>
</div>
<div class="ddui-form-btn-box">
    <button class="ddui-btn-big ddui-btn-submit" >提交运算</button>
    <a class="ddui-btn-big ddui-btn-cancel" href="#">取消</a>
</div>

<script type="text/javascript" src="/static/libs/jqueryUI/autoComplate.min.js"></script>
<!--SCRIPT_PLACEHOLDER-->
<!--RESOURCEMAP_PLACEHOLDER-->
<script>

 var custorm_vue = new Vue({
     el: '#customerBox',
     data: {
         userTypeList  : [{text:"乘客",value:"1"},{text:"司机",value:"2"}],
         userType:1,
         taskMame:"sss",
         czzPercent:10,
         randomNum:25,
         operList:[ {a:{name:"123",operfield:"pid"},b:{name:"123",operfield:"pid"},operType:"+", tempName:"123"} ]
     },
     methods:{
         addRow:function(){
             this.operList.push(createRow());
         },
         deleteRow:function(index){
             console.log(index);
             this.operList.splice(index,1);
         },
         customerInput:function(event){
             var ele  = $(event.target);
             popup_customer.bindEle({
                 ele:ele,
                 ownEvent:"custom_ok",
                 type:"radio",
                 search:{"a":1,"b":2}
             })
         }
     }
 })
    function createRow(){
        var p = {a:{name:"123",operfield:"pid"},b:{name:"123",operfield:"pid"},operType:"+", tempName:"123"}
        p.tempName="LS_"+Math.random();
        return p;
    }
 var popup_customer = require("popupCustom");
 var customer_conf = {
     ele:$(".J_customerInput"),
     ownEvent:"custom_ok",
     type:"radio"
 }
 var custmon= popup_customer.init(customer_conf);
</script>