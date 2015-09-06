<?php
include("../layout/header.php");
?>
<style>
    .gridview-box{margin: 20px 0 0 0;}
    .ddui-con-body{padding:20px;}
</style>
<div class="ddui-filter-wrap">
    <ul class="ddui-filter-box">
        <li class="ddui-filter-item-box01">
            <label class="ddui-label-title">开始日期</label>
            <input type="text" id="time_start" class="ddui-filter-input" onfocus="WdatePicker({maxDate:'#F{$dp.$D(\'addtime_end\')}',dateFmt:'yyyy-MM-dd',alwaysUseStartDate:true,isShowClear:false})" value="2015-08-19">
        </li>
        <li class="ddui-filter-item-box01">
            <label class="ddui-label-title">结束日期</label>

            <input type="text" id="time_end" class="ddui-filter-input" onfocus="WdatePicker({minDate:'#F{$dp.$D(\'addtime_start\')}',dateFmt:'yyyy-MM-dd',alwaysUseStartDate:true,isShowClear:false})" value="2015-08-26">
        </li>
        <li class="ddui-date-input-item-box">
            <button class="ddui-form-btn" id="searchBtn">查询</button>
        </li>
    </ul>
</div>
<ul class="ddui-tab-list flex-box-row" id="tab_gridview">
    <li  v-class="ddui-tab-active:active==item.name" v-repeat="item:list" v-on="click:tabClick(item)">{{item.text}}</li>
</ul>
<div class="gridview-box"v-class="hide:isHide" id="zhuce_gridView">
    <gridview-component></gridview-component>
</div>
<div class="gridview-box "v-class="hide:isHide" id="hujiao_gridView">
    <gridview-component></gridview-component>
</div>
<div class="gridview-box " v-class="hide:isHide" id="bangquan_gridView">
    <gridview-component></gridview-component>
</div>
<div class="gridview-box " v-class="hide:isHide" id="dingdan_gridView">
    <gridview-component></gridview-component>
</div>
<div class="gridview-box " v-class="hide:isHide" id="duanxing_gridView">
    <gridview-component></gridview-component>
</div>

</div>
<script type="text/javascript" src="/static/libs/jqueryUI/autoComplate.min.js"></script>
<!--SCRIPT_PLACEHOLDER-->
<!--RESOURCEMAP_PLACEHOLDER-->
<script>
    var LIST = [
        {name: "zhuce", text: "注册"},
        {name: "hujiao", text: "呼叫"},
        {name: "bangquan", text: "绑券"},
        {name: "dingdan", text: "订单"},
        {name: "duanxing", text: "短信"}
    ];
    var tab_gridview = new Vue({
        el: '#tab_gridview',
        data: {
            active: "zhuce",
            list: JSON.parse(JSON.stringify(LIST))
        },
        methods: {
            tabClick: function (v) {
                if (this.active !== v.name) {
                    this.active = v.name;
                    for (var key in g_vue.list) {
                        if (key === this.active) {
                            g_vue.list[key].gridview_vue.isHide = false;
                        } else {
                            g_vue.list[key].gridview_vue.isHide = true;
                        }
                    }
                }
            }
        }
    });
    var gridview = require('gridview');
    var addtime = $("#time_start");
    var addtime_end = $("#time_end");
    var g_vue = {
        getData: function () {
            var p = getParam();
            LIST.forEach(function (v) {
                g_vue.list[v.name].changeData(p[v.name]);
            })
        },
        list: {}
    };
    function getParam() {
        var p = {};
        LIST.forEach(function (v) {
            var t = v.name;
            p[t] = {
                start_date: addtime.val(),
                end_date: addtime_end.val(),
                type: t
            }
        });
        return p;
    }

    $("#searchBtn").on("click", function () {
        g_vue.getData();
    });
    (function () {
        var p = getParam();
        var gridList = {
            zhuce: {
                id: "#zhuce_gridView",
                thead: ["日期", "波次", "业务线", "当日新增注册用户数", "当日新增注册成本", "累计新增注册用户数", "累计新用户成本"],
                tbody: ["date", "boci", "product", "new_user", "new_user_money", "sum_new_use", "sum_new_money"],
                url: "/api/gridview.php",
                param: p.zhuce
            },
            hujiao: {
                id: "#hujiao_gridView",
                isHide: true,
                thead: ["日期1", "波次1", "业务线1", "当日新增注册用户数1", "当日新增注册成本1", "累计新增注册用户数1", "累计新用户成本1"],
                tbody: ["date1", "boci1", "product1", "new_user1", "new_user_money1", "sum_new_use1", "sum_new_money1"],
                //tool:["edit","copy"],
                url: "/api/gridview1.php",
                param: p.hujiao
            },
            bangquan: {
                id: "#bangquan_gridView",
                isHide: true,
                thead: ["日期2", "波次2", "业务线2", "当日新增注册用户数2", "当日新增注册成本2", "累计新增注册用户数2", "累计新用户成本2"],
                tbody: ["date2", "boci2", "product2", "new_user2", "new_user_money2", "sum_new_use2", "sum_new_money2"],
                //tool:["edit","copy"],
                url: "/api/gridview2.php",
                param: p.bangquan
            },
            duanxing: {
                id: "#duanxing_gridView",
                isHide: true,
                thead: ["日期2", "波次2", "业务线2", "当日新增注册用户数2", "当日新增注册成本2", "累计新增注册用户数2", "累计新用户成本2"],
                tbody: ["date2", "boci2", "product2", "new_user2", "new_user_money2", "sum_new_use2", "sum_new_money2"],
                url: "/api/gridview2.php",
                param: p.duanxing
            },
            dingdan: {
                id: "#dingdan_gridView",
                isHide: true,
                thead: ["日期2", "波次2", "业务线2", "当日新增注册用户数2", "当日新增注册成本2", "累计新增注册用户数2", "累计新用户成本2"],
                tbody: ["date2", "boci2", "product2", "new_user2", "new_user_money2", "sum_new_use2", "sum_new_money2"],
                url: "/api/gridview2.php",
                param: p.dingdan
            }
        };
        for (var key in gridList) {
            g_vue.list[key] = gridview.init(gridList[key]);
        }
    })();

	</script>