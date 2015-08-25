<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>BI管理系统</title>
    <link type="text/css" rel="stylesheet" href="/static/css/didi_UI.css">
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
    </div>
    <script src="/api/navTree.txt"></script>
    <script type="text/javascript" charset="utf-8" src="/static/widget/navTree/navTree.js"></script>
<script>
       var navTree = require("navTree");
       navTree.init({data:bannerData});
   </script>
<div class="flex-box-1 ddui-con-body">
