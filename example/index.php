<?php
/*
    PHP 接受 webmock 的 POST 请求渲染页面
*/
date_default_timezone_set("Shanghai/Asia");
// __object_array 将 POST请求转换为 PHP对象
function __object_array($e){
    $e=(array)$e;
    foreach($e as $k=>$v){
        if( gettype($v)=='resource' ) return;
        if( gettype($v)=='object' || gettype($v)=='array' )
            $e[$k]=(array)__object_array($v);
    }
    return $e;
}
$__settings = __object_array(json_decode($_POST['_webmock']));
/*
    root         "/Users/nimojs/Documents/git/fms-demo/view/"
    filePath        "/Users/nimojs/Documents/git/fms-demo/view/news.php"
    data                "{"title":"论数据约定在前后端配合中的重要性"}"
*/
/*
    将属性绑定到全局
    随后在模板中通过 $title 获取
*/
foreach ($__settings['data'] as $key => $value) {
    $GLOBALS[$key] = $value;
}
// 引入模板渲染页面
include($__settings['filePath']);
