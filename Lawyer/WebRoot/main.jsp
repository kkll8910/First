<%@page import="com.wdk.user.User"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
User user=User.get(request);
if(user==null){
    request.setAttribute("ErrorMessage", "用户信息超时，请重新登录！");
    response.sendRedirect("/log.jsp");
}else{
   
%>
<html>
<head>
	<meta charset="utf-8">
	<title>管理后台</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="/js/mobile/jquery.mobile-1.4.5.min.css" />
  <style type="text/css">
    #TopDiv{
      height:40px;
    	background-color:#284452;	
    }
    
    #TabContainer{
    	width:100%;
    }
  </style>
  
	<script data-main="/js/main" src="/js/require.js"></script>
</head>

  </head>
  
  <body>
    <div id="TopDiv">
         <div data-role="controlgroup" data-type="horizontal" class="ui-mini ui-btn-right"  data-theme="a" data-content-theme="a" >
            <a href="#publishMenu"  data-rel="popup" data-transition="slideup" class="ui-btn ui-btn-icon-left ui-icon-edit">发布...</a>
            <a href="#popupMydocument" data-rel="popup" data-transition="flow" class="ui-btn ui-btn-icon-left ui-icon-bullets" id="myDocumentsButton">我的</a>
            <a href="#" class="ui-btn ui-btn-icon-left ui-icon-star" id="rechargeButton">充值</a>
        </div>	
    </div>
    <div id="TabContainer"></div>
    
    <div data-role="popup" id="publishMenu" data-theme="b">
        <ul data-role="listview" data-inset="true" style="min-width:210px;">
            <li data-icon="user"><a href="#" data-role='none' class="createUnit" src="/createRole.jsp" id="createWeixin">微信角色</a></li>
            <li data-icon="home"><a href="#" data-role='none' class="createUnit" src="/createGroup.jsp" id="createGroup">微信群</a></li>
            <li data-icon="info"><a href="#" data-role='none' class="createUnit" src="/createPublicPlatform.jsp" id="createPlatform">公众平台</a></li>
        </ul>
    </div>
    
    
     <div data-role="popup" id="myUnits" data-theme="b">
        <ul data-role="listview" data-inset="true" style="min-width:210px;">
            <li data-icon="user"><a href="#" data-role='none' class="createUnit" src="/createRole.jsp" id="createWeixin">微信角色</a></li>
            <li data-icon="home"><a href="#" data-role='none' class="createUnit" src="/createGroup.jsp" id="createGroup">微信群</a></li>
            <li data-icon="info"><a href="#" data-role='none' class="createUnit" src="/createPublicPlatform.jsp" id="createPlatform">公众平台</a></li>
        </ul>
    </div>
  </body>
</html>
<%} %>
