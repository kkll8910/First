<%@ page language="java" pageEncoding="GB2312"%>
<%@page import="com.wdk.util.Table"%>
<%
String TableName=request.getParameter("TableName");
Table t=new Table(TableName);
String temp=t.getTemp();
String form=t.getForm();
String html=t.getHtml();
String javascript=t.getJavascript();
String mdy=t.getMdy();
String servlet=t.getServlet();
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    
    <title>MyJsp.jsp</title>

	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
<style type="text/css">
<!--
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}
body,td,th {
	font-size: 12px;
}
.td1{
    width:135px;
	height:27px;
	background-image:url(../images/dhl.gif);
	cursor:hand;
}
-->
</style>

<script type="text/javascript">
<!--
var selectedIDX=1;
function tab(idx){
    document.getElementById(selectedIDX).style.display="none"
    selectedIDX=idx;
    document.getElementById(idx).style.display="block";
}
//-->
</script>
  </head>
  
  <body>
  <table width="100%" border="0" cellspacing="2" cellpadding="0">

    <tr>
      <td><table  border="0" cellspacing="2" cellpadding="0">
        <tr>
          <td valign="middle" align="center" class="td1" onClick="tab(1)"><%=t.getShortName()%> Class</td>
          <td valign="middle" align="center" class="td1" onClick="tab(2)"><%=t.getShortName() %> Form</td>
          <td valign="middle" align="center" class="td1" onClick="tab(3)"><%=t.getShortName() %> Html</td>
          <td valign="middle" align="center" class="td1" onClick="tab(4)"><%=t.getShortName() %> JavaScript</td>
          <td valign="middle" align="center" class="td1" onClick="tab(5)"><%=t.getShortName() %> Servlet</td>
          <td valign="middle" align="center" class="td1" onClick="tab(6)"><%=t.getShortName() %> mdy</td>
          <td>&nbsp;</td>
        </tr>
      </table></td>
    </tr>
    <tr id="1">
      <td><textarea name="textarea" id="textarea" rows="34" style="width:100%"><%=temp %></textarea></td>
    </tr>
    <tr id="2" style="display:none">
      <td><textarea name="textarea" id="textarea" rows="34" style="width:100%"><%=form %></textarea></td>
    </tr>
    <tr id="3" style="display:none">
      <td><textarea name="textarea" id="textarea" rows="34" style="width:100%"><%=html %></textarea></td>
    </tr>
    <tr id="4" style="display:none">
      <td><textarea name="textarea" id="textarea" rows="34" style="width:100%"><%=javascript %></textarea></td>
    </tr>
    <tr id="5" style="display:none">
      <td><textarea name="textarea" id="textarea" rows="34" style="width:100%"><%=servlet %></textarea></td>
    </tr>
    <tr id="6" style="display:none">
      <td><textarea name="textarea" id="textarea" rows="34" style="width:100%"><%=mdy %></textarea></td>
    </tr>
    <tr>
      <td>&nbsp;</td>
    </tr>

  </table>

</body>
</html>
