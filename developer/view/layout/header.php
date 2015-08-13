<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>BI管理系统</title>
    <link type="text/css" rel="stylesheet" href="/static/css/dd_base.css">
    <script type="text/javascript" charset="utf-8" src="/static/libs/vue.js"></script>
    <!--
    <script type="text/javascript" charset="utf-8" src="/static/libs/vue.min.js"></script>
    -->
    <script type="text/javascript" charset="utf-8" src="/static/libs/jquery.js"></script>
    <script type="text/javascript" charset="utf-8" src="/static/libs/mod.js"></script>

</head>
<body>
<!--
<div class="bi-header-box">

</div> 
-->
<div class="ddui-banner-box">
    <div class="ddui-logo">
        <i class="iconfont ddui-font-didi-bi"></i>
    </div>
    <h2 class="ddui-page-title"> 嘀嘀BI管理系统</h2>
</div>
<div class="rel flex-box-row" >
    <!--navtree组件-->
    <div class=" flex-box-row rel" id="navtreeBox">
        <navtree-component > </navtree-component>
        <div class="ddui-nav-trunk-close" v-on="click:trunkCloseClick" v-class="ddui-nav-close-active:trunkClose">
            <i class="iconfont ddui-font-zuosanjiao"></i>
        </div>
    </div>

    <!--SCRIPT_PLACEHOLDER-->
    <!--RESOURCEMAP_PLACEHOLDER-->
   <script>
       require("navTree");
     //  var navTree = require("navTree");

   </script>


