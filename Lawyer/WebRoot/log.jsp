<%@page import="com.wdk.user.User"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
%>

<!DOCTYPE html>
<html>
  <head>
    <title>Log.html</title>
	
    <meta name="keywords" content="keyword1,keyword2,keyword3">
    <meta name="description" content="this is my page">
    <meta name="content-type" content="text/html; charset=UTF-8">
    
    <link rel="stylesheet" href="/js/mobile/jquery.mobile-1.4.5.min.css" />
    <script data-main="/js/log" src="/js/require.js"></script>
  </head>
  
  <body>
      <div id="MainDiv" style="width:600px;margin:120px auto;">
          <div data-role="tabs" id="tabs">
            <div data-role="navbar">
              <ul>
                <li><a href="#one" data-ajax="false">微信登录</a></li>
                <li><a href="#two" data-ajax="false">普通登录</a></li>
              </ul>
            </div>
            <div id="one" class="ui-body-d ui-content">
              <img src='images/031ii5i6nkZqUahy.jpg'/>
            </div>
            <div id="two">
              
            </div>
          </div>	
      </div>
  </body>
</html>
<%%>