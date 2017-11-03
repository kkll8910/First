<%@page import="com.wdk.unit.Unit"%>
<%@page import="com.wdk.util.V"%>
<%@page import="com.wdk.user.User"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<html>
 <head>
   <title>用户资料</title>
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

   <style type="text/css">
   	   body{
   	       padding:0px;
   	       margin:0px;	
   	   }
   	   
       
   	
       #ContentDiv{
       	   width:96%;
           margin:0 auto;	
       }
       
       
       #footer{
       	   position:fixed;
       	   bottom :0;
       	   height:48px;
       	   background-color:#555;
       	   width:100%
       }   	
       input{
          width:100%;
          border:0px;
          height:32px;	
          line-height:32px;
          padding:4px 5px;
          font-size:14px;
       }
       
       .citySelect{
           height:32px;	
           line-height:32px;	
           float:left;
           margin:5px 0 5px 10px;
           -moz-border-radius: 4px;  
           -webkit-border-radius:4px;
           border-radius:4px;
       }
       
       .FormItem{
       	  margin-top:12px;
       }
   </style>
   
   <script data-main="/js/weixin/UserMessage" src="/js/require.js" defer async="true"></script>
 </head>
 <body>
     
     <div id="ContentDiv">
         <div type="Pane" theme="b" class="FormItem">
 	       	  <div><div type='title'>姓名</div></div>
            <div class="FormItem_input">
            	<input id="input_name" value="" type="text">
            </div>
 	       </div>	
 	       
 	       <div type="Pane" theme="b" class="FormItem">
 	       	  <div><div type='title'>手机号码</div></div>
            <div class="FormItem_input">
            	<input id="input_mobile" value="" type="text">
            </div>
 	       </div>	
 	       
 	       <div type="Pane" theme="b" class="FormItem">
 	       	  <div><div type='title'>微信号</div></div>
            <div class="FormItem_input">
            	<input id="input_weixinID" value="" type="text">
            </div>
 	       </div>	
 	       
 	       <div type="Pane" theme="b" class="FormItem">
 	       	  <div><div type='title'>所在城市:</div></div>
            <div class="FormItem_input">
            	  <select class="citySelect"  id="provinceSelector">
                	<option selected="true">请选择省份</option>
                </select>
                
                <select class="citySelect"  id="citySelector">
                  <option selected="true">城市</option>
                </select>
                
                <select class="citySelect"  id="countySelector">
                	<option selected="true">区县</option>
                </select>
            </div>
 	       </div>	
 	       
 	       <div type="Pane" theme="b" class="FormItem">
 	       	  <div><div type='title'>详细通讯地址:</div></div>
            <div class="FormItem_input">
            	<input id="input_mobile" value="" type="text">
            </div>
 	       </div>	
 	       
     
 	   	   <div type="Pane" theme="b" class="FormItem">
 	         	  <div><div type='title'>您的执业证号码</div></div>
              <div class="FormItem_input">
              	<input id="input_mobile" value="" type="text">
              </div>
 	       </div>	
         
         
         <div type="Pane" theme="b" class="FormItem">
 	         	  <div><div type='title'>您在律所担任的职务</div></div>
              <div class="FormItem_input">
              	<input id="input_mobile" value="" type="text">
              </div>
 	       </div>	
 	 	     
 	 	     
 	 	     <div type="Pane" theme="b" class="FormItem">
 	         	  <div><div type='title'>您擅长的业务范围</div></div>
              <div class="FormItem_input">
              	<input id="input_mobile" value="" type="text">
              </div>
 	       </div>	
 	 	     
         <div type="Pane" theme="b" class="FormItem">
 	         	  <div><div type='title'>您曾从事的职业或拥有的其它证书</div></div>
              <div class="FormItem_input">
              	<input id="input_mobile" value="" type="text">
              </div>
 	       </div>	
 	 	     
         <div type="Pane" theme="b" class="FormItem">
 	         	  <div><div type='title'>目前的办案状态</div></div>
              <div class="FormItem_input">
              	<input id="input_mobile" value="" type="text">
              </div>
 	       </div>	 	   	
     </div>
     
     <div style="height:50px"></div>
 	   <div id="footer">
 	   	
 	   </div>
 </body>
</html>
