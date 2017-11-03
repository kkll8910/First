<%@page import="com.wdk.unit.Unit"%>
<%@page import="com.wdk.util.V"%>
<%@page import="com.wdk.user.User"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<html>
 <head>
   <title>律师合作</title>
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
   <link rel="stylesheet" href="/js/mobile/jquery.mobile-1.4.5.min.css" />

   <style type="text/css">
       .titleDiv{
           width:60px;
           float:left;
           text-align:right;
           padding-right:20px;
           color:#FF9900;
       }
       
       .contentDiv{
           float:left;
       }
       
       .contentDiv img{
          width:100px;
          height:100px;
          -webkit-border-radius: 4px;
          border-radius: 4px;
       }
       
       .ui-icon-group:after {
           background-image: url("/images/icon_group.png");
           /* Make your icon fit */
           background-size: 24px 24px;
       }      
       
       .ui-icon-person:after {
           background-image: url("/images/icon_person.png");
           /* Make your icon fit */
           background-size: 24px 24px;
       }  
          
       .browsed{
           margin-left:20px;
           font-size:12px;
           color:#CCCCCC;
       }
   </style>
   
   <script data-main="/js/weixin/index" src="/js/require.js" defer async="true"></script>
 </head>
 <body>
    <div data-role="panel" id="mypanel" data-display="overlay">
        <div data-role="collapsible" data-inset="false">
        <h3>我发的单子</h3>
        <ul data-role="listview">
            <li><a href="#">Canary</a></li>
            <li><a href="#">Cat</a></li>
            <li><a href="#">Dog</a></li>
            <li><a href="#">Gerbil</a></li>
            <li><a href="#">Iguana</a></li>
            <li><a href="#">Mouse</a></li>
        </ul>
    </div><!-- /collapsible -->
    <div data-role="collapsible" data-inset="false">
        <h3>我应征的单子</h3>
        <ul data-role="listview">
            <li><a href="#">Chicken</a></li>
            <li><a href="#">Cow</a></li>
            <li><a href="#">Duck</a></li>
            <li><a href="#">Horse</a></li>
            <li><a href="#">Pig</a></li>
            <li><a href="#">Sheep</a></li>
        </ul>
    </div><!-- /collapsible -->
    <div data-role="collapsible" data-inset="false">
        <h3>我的收藏</h3>
        <ul data-role="listview">
            <li><a href="#">Aardvark</a></li>
            <li><a href="#">Alligator</a></li>
            <li><a href="#">Ant</a></li>
            <li><a href="#">Bear</a></li>
            <li><a href="#">Beaver</a></li>
            <li><a href="#">Cougar</a></li>
            <li><a href="#">Dingo</a></li>
        </ul>
    </div>
    </div>      
    
   <div data-role="header" data-position="fixed"  data-theme="b" data-content-theme="b"> 
   	<div style="height:32px;line-height:32px;">您有一个单子被应征，请进行处理</div>

   </div>
 	 <div style="width:98%;margin:0px auto;"  id="UnitList">
 	 </div>
 	 
 	 <div data-role="footer" data-position="fixed"  data-theme="b" data-content-theme="b">
 	      
 	 	    <div data-role="controlgroup" data-type="horizontal" data-mini="true" style="float:left;margin-right:10px;">
 	 	    <a href="#mypanel" class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-bullets ui-btn-b"  data-transition="slide" id="showLeftButton">我的单子</a>
            <a href="#popupSearch" class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-search ui-btn-b"  data-position-to="window" data-transition="window"  data-rel="popup">搜索</a>
            <a href="#popupDisplay" class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-bullets ui-btn-b"  data-transition="slide"  data-rel="popup">显示</a>
            <a href="#popupMore" class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-bullets ui-btn-b"  data-transition="slide"  data-rel="popup">我要发布</a>
            </div>
     </div>
    
    
    
    <div data-role="popup" id="popupSearch" data-theme="a" data-overlay-theme="b" class="ui-corner-all"  data-dismissible="false">
    	  <a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>
        <div style="padding:10px 20px;">
        	<input name="password" id="search" value="" placeholder="请输入搜索关键词...">
        	<input name="password" id="search" value="" placeholder="所在城市">
            <fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">
                        <input id="checkbox-role" type="checkbox">
                        <label for="checkbox-role">个人微信</label>
                        <input id="checkbox-group" type="checkbox">
                        <label for="checkbox-group">微信群</label>
                        <input id="checkbox-service" type="checkbox">
                        <label for="checkbox-service">本地服务</label>
            </fieldset>
            <button type="submit" class="ui-btn ui-corner-all ui-btn-b">搜索</button>
        </div>
    </div>
    
    <div data-role="popup" id="popupDisplay" data-theme="a" data-overlay-theme="b" class="ui-corner-all"  data-dismissible="true" style="padding:0px;">
        <fieldset data-role="controlgroup"  style="margin:0px;">
            <input name="checkbox-1a" id="checkbox-1a" checked="true" type="checkbox">
            <label for="checkbox-1a">个人微信</label>
            <input name="checkbox-2a" id="checkbox-2a" checked="true" type="checkbox">
            <label for="checkbox-2a">微信群</label>
            <input name="checkbox-3a" id="checkbox-3a" checked="true" type="checkbox">
            <label for="checkbox-3a">微信公众号</label>
        </fieldset>
    </div>
    
    <div data-role="popup" id="popupMore" data-theme="a" data-overlay-theme="b" class="ui-corner-all"  data-dismissible="true">
        <ul data-role="listview">
            <li><a href="#"  id="createRoleButton">个人微信</a></li>
            <li><a href="#"  id="createGroupButton">微信群</a></li>
            <li><a href="#"  id="createServiceButton">服务项目</a></li>
            <li><a href="#"  id="createPublicButton">公众号</a></li>
            <li><a href="#"  id="myUnitsButton">我已经发布的...</a></li>
        </ul>
    </div>
 </body>
</html>
