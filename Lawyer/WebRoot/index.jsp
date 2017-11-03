<%@page import="com.wdk.util.V"%>
<%@page import="com.wdk.unit.Unit"%>
<%@page import="net.sf.json.JSONObject"%>
<%@page import="com.wdk.user.User"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
User user = User.get(request);
ArrayList<Unit> myUnits=null;
if(user!=null){
    myUnits=Unit.getMyUnit(user.getId());
}
%>
<html>
<head>
<meta charset="utf-8">
<title>管理后台</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/js/mobile/jquery.mobile-1.4.5.min.css" />
<style type="text/css">
#TopDiv {
	height: 40px;
	background-color: #284452;
}

#TabContainer {
	width: 100%;
}

.inputHit{
    height:20px;
    line-height:20px;
    font-size:12px;
    color:#FF0000;
    margin:0 0 10 10;
    display:none;
}

.UnitListItem{
    cursor:pointer;	
}
</style>
<script type="text/javascript">
<%
if(user!=null){
    JSONObject obj=JSONObject.fromObject(user);
    out.print("var Myself="+obj.toString());
}
%>
</script>
<script data-main="/js/index" src="/js/require.js"></script>
</head>

</head>

<body>
	<div id="TopDiv">
	    
	    <div data-role="controlgroup" data-type="horizontal"	class="ui-mini ui-btn-right" data-theme="a" data-content-theme="a" id="LogBottons">
			<a href="#popupSearch" data-rel="popup" data-transition="slideup"		class="ui-btn ui-btn-icon-left ui-icon-search" id="publishButton">搜索</a> 
			<a href="#popupLogin" data-rel="popup" data-transition="pop"	 data-position-to="window"  class="ui-btn ui-btn-icon-left ui-icon-edit" id="publishButton">发布...</a> 
			<a href="#popupLogin" data-rel="popup" data-transition="pop"	 data-position-to="window"	class="ui-btn ui-btn-icon-left ui-icon-edit" id="logButton">登录</a>          
			<a href="#popupEnrol" data-rel="popup" data-transition="pop"	 data-position-to="window"	class="ui-btn ui-btn-icon-left ui-icon-edit" id="enrolButton">注册</a> 
		</div>
		
		<div data-role="controlgroup" data-type="horizontal"	class="ui-mini ui-btn-right" data-theme="a" data-content-theme="a" style="display:none" id="FunctionButtons">
			<a href="#popupSearch" data-rel="popup" data-transition="slideup"		class="ui-btn ui-btn-icon-left ui-icon-search" id="publishButton">搜索</a> 
			<a href="#publishMenu" data-rel="popup" data-transition="slideup"		class="ui-btn ui-btn-icon-left ui-icon-edit" id="publishButton">发布..</a> 
			<a href="#myUnits" data-rel="popup" data-transition="flow"		class="ui-btn ui-btn-icon-left ui-icon-bullets"	id="myDocumentsButton">我的</a> 
			<a href="#myUnits" data-rel="popup" data-transition="flow"		class="ui-btn ui-btn-icon-left ui-icon-bullets"	id="myDocumentsButton">充值</a> 
		</div>
		
	</div>
	<div id="TabContainer"></div>

	<div data-role="popup" id="publishMenu" data-theme="b">
		<ul data-role="listview" data-inset="true" style="min-width:210px;">
			
			<li data-icon="user"><a href="#" data-role='none' class="createUnit" type="1" id="createWeixin">微信角色</a></li>
			<li data-icon="home"><a href="#" data-role='none' class="createUnit" type="2" id="createGroup">微信群</a></li>
			<li data-icon="info"><a href="#" data-role='none'	class="createUnit" type="3" id="createPlatform">公众平台</a></li>
		</ul>
	</div>


  <div data-role="popup" id="popupSearch" data-theme="a" data-overlay-theme="b" class="ui-corner-all"  data-dismissible="true"  style="width:480px;">
	    
        <div style="padding:10px 20px;">
        	   <input name="password" id="search" value="" placeholder="请输入搜索关键词..." type="search">
            <fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">
                        
                        
                        <input name="checkbox-7" id="checkbox-7" type="checkbox">
                        <label for="checkbox-7">微信角色</label>
                        <input name="checkbox-8" id="checkbox-8" type="checkbox">
                        <label for="checkbox-8">微信群</label>
                        <input name="checkbox-6" id="checkbox-6" type="checkbox">
                        <label for="checkbox-6">公众平台</label>
            </fieldset>
           
            <button type="submit" class="ui-btn ui-corner-all ui-btn-a">搜索</button>
            
            
        </div>
  </div>


	<div data-role="popup" id="popupLogin" data-theme="a" data-overlay-theme="b" class="ui-corner-all"  data-dismissible="false"  style="width:480px;">
	    <a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>
        <div style="padding:10px 20px;">
            <h3>用户登录</h3>
            
            <label for="un" class="ui-hidden-accessible">Username:</label>
            <input name="user" id="log_username" value="13963934275" placeholder="手机号/邮箱" data-theme="a" type="text"/>
            <div class="inputHit" id=""></div>
            
            
            <label for="password" class="ui-hidden-accessible">密码:</label>
            <input name="pass" id="log_password" value="wdk0805" placeholder="密码" data-theme="a" type="password">
            <div class="inputHit"></div>
            
            <input data-theme="b" data-iconshadow="true" value="登录" type="button" id="LogButton">
            <input data-theme="b" data-iconshadow="true" value="忘记密码，点此找回" type="button">
        </div>
  </div>
  
  <div data-role="popup" id="popupEnrol" data-theme="a" data-overlay-theme="b" class="ui-corner-all"  data-dismissible="false" style="width:480px;">
  	    <a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>
        <div style="padding:10px 20px;">
            <h3>注册账号</h3>
            <label for="un" class="ui-hidden-accessible">Username:</label>
            <input name="user" id="username" value="13963934275" placeholder="手机号/邮箱" data-theme="a" type="text"/>
            <div class="inputHit" id=""></div>
            
            
            <label for="password" class="ui-hidden-accessible">密码:</label>
            <input name="pass" id="password" value="wdk0805" placeholder="密码" data-theme="a" type="text">
            <div class="inputHit"></div>
            
            <label for="confirm" class="ui-hidden-accessible">确认密码:</label>
            <input name="confirm" id="confirmPassword" value="wdk0805" placeholder="请将上面的密码重输一次" data-theme="a" type="text">
            <div class="inputHit"></div>
            
            <label for="validcode" class="ui-hidden-accessible">验证码:</label>
            <input name="validcode" id="validcode" value="" placeholder="验证码" data-theme="a" type="text">
            <image src="/getValidcodePicture?Attribute=EnrolValid" style="float:right"/>
            <div class="inputHit"  id="validHit"></div>
            
            <fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">
                    <input name="sex" id="man" value="1" checked="checked" type="radio">
                    <label for="man">男生</label>
                    <input name="sex" id="women" value="2" type="radio">
                    <label for="women">女生</label>
            </fieldset>
            <a href="#" class="ui-btn ui-icon-plus" id="EnrolButton">马上注册</a>
        </div>
  </div>
  
  
  <div data-role="popup" id="myUnits" data-theme="none">
    <div data-role="collapsibleset" data-theme="b" data-content-theme="a" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" style="margin:0; width:250px;">
        <div data-role="collapsible" data-inset="false">
        <h2>微信角色</h2>
            <ul data-role="listview" id="RoleList">
                <% 
                if(myUnits!=null){
                    for(int i=0;i<myUnits.size();i++){
                        Unit unit=myUnits.get(i);
                        if(unit.getType()==1){
                            String paid="";
                            if(!unit.isPaid()){
                                paid="未付款";
                            }
                            out.print("<li class='UnitListItem' type=1 id='"+unit.getId()+"'><h2>"+unit.getName()+"</h2><p><span>"+unit.getTitle()+"</span><span style='color:#FF9900;margin-left:10px;'>"+paid+"</span></p></li>");
                        }
                    }
                }
                %>
            </ul>
        </div>
        
        <div data-role="collapsible" data-inset="false">
        <h2>微信群</h2>
            <ul data-role="listview" id="GroupList">
                <% 
                if(myUnits!=null){
                    for(int i=0;i<myUnits.size();i++){
                        Unit unit=myUnits.get(i);
                        if(unit.getType()==2){
                            String rev="";
                            if(V.isBlank(unit.getReview())){
                                rev="正在审核当中";
                            }else if(unit.getReview().equals(Unit.Review_Passed)){
                                rev="已通过审核";
                            }else if(unit.getReview().equals(Unit.Review_Rejected)){
                                rev="未通过审核";
                            }
                            
                            out.print("<li class='UnitListItem' type=2 id='"+unit.getId()+"'><h2>"+unit.getName()+"</h2><p><span>"+unit.getTitle()+"</span><span style='color:#FF9900;margin-left:10px;'>"+rev+"</span></p></li>");
                        }
                    }
                }
                %>
            </ul>
        </div>
        
        <div data-role="collapsible" data-inset="false">
        <h2>公众号</h2>
            <ul data-role="listview" id="PlatformList">
                <% 
                if(myUnits!=null){
                    for(int i=0;i<myUnits.size();i++){
                        Unit unit=myUnits.get(i);
                        if(unit.getType()==3){
                            String rev="";
                            if(V.isBlank(unit.getReview())){
                                rev="正在审核当中";
                            }else if(unit.getReview().equals(Unit.Review_Passed)){
                                rev="已通过审核";
                            }else if(unit.getReview().equals(Unit.Review_Rejected)){
                                rev="未通过审核";
                            }
                            
                            out.print("<li class='UnitListItem' type=3 id='"+unit.getId()+"'><h2>"+unit.getName()+"</h2><p><span>"+unit.getTitle()+"</span><span style='color:#FF9900;margin-left:10px;'>"+rev+"</span></p></li>");
                        }
                    }
                }
                %>
            </ul>
        </div>
        
    </div>
  </div>
</body>
</html>
<%%>
