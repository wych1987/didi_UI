<?php
include("../layout/header.php");
?>
<div style="padding: 50px;">
    <div class="ddui-form-item">
        <label class="ddui-label">客户类型</label>
        <select class="ddui-select">
            <option value="0">乘客</option>
            <option value="1">司机</option>
            <option value="2">乘客</option>
        </select>
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
            <li class="oper-row">
                <div class="customer-box">
                    <input type="text" class="ddui-input-01" placeholder="选择人群">
                    <div class="oper-field">
                        <label class="ddui-select-label01">计算字段</label>
                        <select type="text" class="ddui-select-01" >
                            <option value="pid">pid</option>
                            <option value="pid">pid</option>
                            <option value="pid">pid</option>
                            <option value="pid">pid</option>
                        </select>
                    </div>
                </div>
                <div class="oper-field">
                    <label class="ddui-select-label01">运算</label>
                    <select type="text" class="ddui-select-01" >
                        <option value="pid">pid</option>
                        <option value="pid">pid</option>
                        <option value="pid">pid</option>
                        <option value="pid">pid</option>
                    </select>
                </div>
                <div class="customer-box">
                    <input type="text" class="ddui-input-01" placeholder="选择人群">
                    <div class="oper-field">
                            <label class="ddui-select-label01">计算字段</label>
                            <select type="text" class="ddui-select-01" >
                                <option value="pid">pid</option>
                                <option value="pid">pid</option>
                                <option value="pid">pid</option>
                                <option value="pid">pid</option>
                            </select>
                    </div>
                </div>
                <div class="customer-box">
                    <label>临时客户群名称:</label>
                    <span >ls_asdadasd</span>
                </div>
                <button class="ddui-btn-delete">删除</button>
            </li>
              <li class="oper-row">
                <div class="customer-box">
                    <input type="text" class="ddui-input-01" placeholder="选择人群">
                    <div class="oper-field">
                        <label class="ddui-select-label01">计算字段</label>
                        <select type="text" class="ddui-select-01" >
                            <option value="pid">pid</option>
                            <option value="pid">pid</option>
                            <option value="pid">pid</option>
                            <option value="pid">pid</option>
                        </select>
                    </div>
                </div>
                <div class="oper-field">
                    <label class="ddui-select-label01">运算</label>
                    <select type="text" class="ddui-select-01" >
                        <option value="pid">pid</option>
                        <option value="pid">pid</option>
                        <option value="pid">pid</option>
                        <option value="pid">pid</option>
                    </select>
                </div>
                <div class="customer-box">
                    <input type="text" class="ddui-input-01" placeholder="选择人群">
                    <div class="oper-field">
                            <label class="ddui-select-label01">计算字段</label>
                            <select type="text" class="ddui-select-01" >
                                <option value="pid">pid</option>
                                <option value="pid">pid</option>
                                <option value="pid">pid</option>
                                <option value="pid">pid</option>
                            </select>
                    </div>
                </div>
                <div class="customer-box">
                    <label>临时客户群名称:</label>
                    <span >ls_asdadasd</span>
                </div>
                <button class="ddui-btn-delete">删除</button>
            </li>
              <li class="oper-row">
                <div class="customer-box">
                    <input type="text" class="ddui-input-01" placeholder="选择人群">
                    <div class="oper-field">
                        <label class="ddui-select-label01">计算字段</label>
                        <select type="text" class="ddui-select-01" >
                            <option value="pid">pid</option>
                            <option value="pid">pid</option>
                            <option value="pid">pid</option>
                            <option value="pid">pid</option>
                        </select>
                    </div>
                </div>
                <div class="oper-field">
                    <label class="ddui-select-label01">运算</label>
                    <select type="text" class="ddui-select-01" >
                        <option value="pid">pid</option>
                        <option value="pid">pid</option>
                        <option value="pid">pid</option>
                        <option value="pid">pid</option>
                    </select>
                </div>
                <div class="customer-box">
                    <input type="text" class="ddui-input-01" placeholder="选择人群">
                    <div class="oper-field">
                            <label class="ddui-select-label01">计算字段</label>
                            <select type="text" class="ddui-select-01" >
                                <option value="pid">pid</option>
                                <option value="pid">pid</option>
                                <option value="pid">pid</option>
                                <option value="pid">pid</option>
                            </select>
                    </div>
                </div>
                <div class="customer-box">
                    <label>临时客户群名称:</label>
                    <span >ls_asdadasd</span>
                </div>
                <button class="ddui-btn-delete">删除</button>
            </li>

        </ul>
    </div>
    </div>
    <div class="ddui-form-item">
        <button class="ddui-btn-big">
            <i class="iconfont ddui-font-jiahao"></i>
            添加新运算
        </button>
    </div>
     <div class="ddui-form-item">
         <label class="ddui-label">随机抽取</label>
          <input type="text" placeholder="随机抽取运算结果占比" class="ddui-input-text"/><span>%</span>
    </div>
    <div class="ddui-form-item">
        <label class="ddui-label">随机抽取</label>
        <input type="text" placeholder="随机抽取中参照组占比" class="ddui-input-text"/><span>%</span>
    </div>
<div class="ddui-form-item">
        <label class="ddui-label">客户群名称</label>
        <input type="text" placeholder="运算后客户群名称" class="ddui-input-text"/>
    </div>
</div>
<div class="ddui-form-btn-box">
    <button class="ddui-btn-big ddui-btn-submit">提交运算</button>
    <a class="ddui-btn-big ddui-btn-cancel" href="#">取消</a>
</div>

<script type="text/javascript" src="/static/libs/jqueryUI/autoComplate.min.js"></script>
<!--SCRIPT_PLACEHOLDER-->
<!--RESOURCEMAP_PLACEHOLDER-->
<script>

	</script>