var getMessage=null,reLogin=null;
require.config({
    baseUrl: '/js',
    paths: {
    	jquery:"jquery-2.1.4.min",
      jqMobile:['mobile/jquery.mobile-1.4.5.min'],
      TabContainer:["wdk/layout/TabContainer"]
    },
    shim: {
        jqMobile:{deps:['jquery']},
        TabContainer:{deps:['jquery']}
    }
});

requirejs(["TabContainer","jqMobile"],function(TabContainer) {
    $(document).ready(function(){
    	  $(window).resize(function(){
        	   window.wdk.Observer.publish("window/resize");
        })
    	  
    	  window.wdk.Observer.subscribe("window/resize",function(){
    	  	 $("#TabContainer").height($(window).height()-$("#TopDiv").height()-2);   
       	});
        
        window.wdk.Observer.publish("window/resize");
        
        var pageTabContainer=new TabContainer({
        	  container:$("#TabContainer")
        });
        
        pageTabContainer.addTab({
                	  title:"首页",
                    src:"/view.jsp",
                    closable:false,
                    selected:true,
                    id:"welcome",
                    single:true
        })	
        
        
        $(".createUnit").click(function(){
        	  $("#publishMenu").popup("close");
            var obj=$(this);
            pageTabContainer.addTab({
                	  title:"发布"+obj.text(),
                    src:"/createUnit.jsp?Type="+obj.attr("type"),
                    closable:true,
                    selected:true,
                    id:obj.attr("id"),
                    single:true
            })
        })
        
        reLogin=function(){
        	  alert("请重新登录")
        }
        
        $("#LogButton").click(function(){
        	  
        	  var error=0;
            if(!checkUsername($("#log_username"))){
                error++;	
            }
            
            if(!checkPassword($("#log_password"))){
                error++;	
            }
            
            if(error>0){
                return;
            }
            
            var para={
                username:$("#log_username").val(),	
                password:$("#log_password").val()
            }    
            
            $.ajax({
            	type: "POST",
              dataType: "json",
              url:"/Login",
              data: para,
              success: function(data){
              	  if(data.User){
              	  	  window.Myself=data.User;
              	  	  $("#popupLogin").popup("close");
              	  	  
              	  	  $("#LogBottons").hide();
        	            $("#FunctionButtons").show();
        	            
        	            if(data.Units){
        	            	  $.each(data.Units,function(){
        	            	      addUnit(this);	
        	            	  })
        	            }
        	    	  }else if(data.Failure){
              	  	 if(data.Failure=="UsernameOrPassword"){
              	  	 	  setHit($("#log_username"),"用户名存在或者密码错误。")
              	  	 }
              	  }
    	        }
           });
            
 
        })
        
        $("#EnrolButton").click(function(){
        	  
        	  var error=0;
            if(!checkUsername($("#username"))){
                error++;	
            }
            
            if(!checkPassword($("#password"))){
                error++;	
            }
            
            if(!checkConfirm($("#confirmPassword"),$("#password"))){
                error++;	
            }
            
            if(!checkValid($("#validcode"))){
                error++;	
            }
            
            if(error>0){
                return;
            }
            
            var para={
                username:$("#username").val(),	
                password:$("#password").val(),
                sex:$('input[name="sex"]:checked ').val(),
                valid:$("#validcode").val()
            }    
            
            $.ajax({
            	type: "POST",
              dataType: "json",
              url:"/Enrol",
              data: para,
              success: function(data){
              	  if(data.User){
              	  	  window.Myself=data.User;
              	  	  $("#popupEnrol").popup("close");
              	  	  
              	  	  $("#LogBottons").hide();
        	            $("#FunctionButtons").show();
              	  	  
              	  }else if(data.Failure){
              	  	 if(data.Failure=="valid"){
              	  	 	  $("#validHit").html("验证码错误，请更正")
        	  	          $("#validHit").show();
              	  	 }else if(data.Failure=="UsernameHasExist"){
              	  	 	  setHit($("#username"),"用户名已经被注册")
              	  	 }
              	  }
    	        }
           });
            
 
        })
        
        function setHit(iptObj,txt){
        	  var hit=iptObj.parent().next()
        	  
        	  if(txt){
        	      hit.html(txt);
        	      hit.show();
        	  }else{
        	      hit.hide();	
        	  }
        	  
        }
        
        function checkUsername(obj){
        	  var username=obj.val();
        	  if(!username){
                setHit(obj,"请输入您的手机号或者是邮箱");	
            }else if(!isEmail(username) && !isMobile(username)){
            	  setHit(obj,"您输入的既不是一个手机号也不是一个Email");	
            }else{
            	  setHit(obj);
            	  return true;	
            }
        }
        
        function checkPassword(obj){
        	  var pwd=obj.val();
        	  if(!pwd || pwd.length<6 || pwd.length>16){
        	  	 setHit(obj,"请输入一个6位以上的密码");
        	  	 return false;	
        	  }else{
        	  	 setHit(obj);
        	  	 return true;	
        	  }
        }
        
        function checkConfirm(obj,pwdOjb){
        	  if(!checkPassword(pwdOjb)){
        	  	  setHit(obj);
        	  	  return;
        	  }
        	  
        	  var pwd=obj.val();
        	  if(!pwd){
        	  	 setHit(obj,"为防止手误，请将上面的密码重复一次。");
        	  }else if(pwd!=pwdOjb.val()){
        	  	 setHit(obj,"您两次输入的密码不一致，请更正。");
        	  }else{
        	  	 setHit(obj);
        	  	 return true;	
        	  }
        }
        
        function checkValid(obj){
        	  var valid=obj.val();
        	  if(!valid || valid.length!=4){
        	  	 $("#validHit").html("请以此输入右方图片中的数字。")
        	  	 $("#validHit").show();
        	  }else{
        	  	 $("#validHit").hide();
        	  	 return true;	
        	  }
        }
        
        function isEmail(v){
        	  return  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(v);
        }
        
        function isMobile(v){
        	  return /^1(3|4|5|7|8)\d{9}$/.test(v);
        }
        
        
        function addUnit(unit){
        	  
        	  var listObj=null,pUri="";;
        	  if(unit.type==1){
        	  	  listObj=$("#RoleList");
        	       pUri="/myRole.jsp";
        	  }else if(unit.type==2){
        	  	  listObj=$("#GroupList");
        	  	  pUri="/myGroup.jsp";
        	  }else if(unit.type==3){
        	  	  listObj=$("#PlatformList");
        	  	  pUri="/myPlatform.jsp";	
        	  }
        	  
        	  var unpaid="";
        	  if(!unit.paid){
        	      unpaid="未付款"	
        	  }
        	  
        	  var item=$("<li class='docListItem' type="+unit.type+" id='"+unit.id+"' style='cursor:pointer;'><h2>"+unit.name+"</h2><p><span>"+unit.title+"</span><span style='color:#FF9900;margin-left:10px;'>"+unpaid+"</span></p></li>");
        	  item.click(function(){
        	  	 gotoPage($(this));	
        	  })
        	  
        	  listObj.append(item);
            listObj.listview("refresh");
        }
        
        
        
        var notifyHandlers=[
            {type:"UnitHasBeenCreated",handler:function(unit){
            	  addUnit(unit)
            }},
            {type:"setTab",handler:function(option){
            	  pageTabContainer.setTab(option.oldId,option);
            }},
            {type:"setMyWeixinID",handler:function(option){
            	  window.Myself.weixinID=option.ID;
        	  	  window.Myself.weixinQR=option.Qr;
            }}
        ];
        
        getMessage=function(type,obj){
        	  $.each(notifyHandlers,function(){
        	      if(this.type==type){
        	          this.handler(obj);
        	          return;	
        	      }	
        	  })
        }
        
        function gotoPage(obj){
                var pUri="";
                var type=obj.attr("type");
                var name=$("h2",obj).text();
                var id=obj.attr("id");
                
                if(type==1){
            	  	  pUri="/myRole.jsp";
            	  }else if(type==2){
            	  	  pUri="/myGroup.jsp";
            	  }else if(type==3){
            	  	  pUri="/myPlatform.jsp";	
            	  }
            	  
            	  pageTabContainer.addTab({
                    	  title:name,
                        src:"/myUnit.jsp?UnitID="+id,
                        closable:true,
                        selected:true,
                        id:"myUnit_"+id,
                        single:true
                })
                
                $("#myUnits").popup("close");
        }
        
        function init(){
            if(window.Myself){
                $("#LogBottons").hide();
        	      $("#FunctionButtons").show();
            }
            
            $(".UnitListItem").click(function(){
                gotoPage($(this))	
            })
        }
        init();
    })
});

                                    