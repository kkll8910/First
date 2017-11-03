define(["Dialog","TabContainer","css!wdk/user/css/Log.css"],function(Dialog,TabContainer) {
       
       return function(options){
       	   	var me=this;
        	  options=options || {};
            var cookiename_openid="msdfwrcf";
            
            this.dialog=null;
            
            this.init=function(){ 	  
            	  this.root=$("<div class='Log_container'></div>");
             	  if(options.container){
             	      options.container.append(this.root);	
             	  }
            	  
            	  var openid=$.cookie(cookiename_openid);
            	  
            	  if(openid){
            	  	  this.getMessageFromServer({mobile:mobile,password:password});
            	  }else{
            	  	  this.showButton();
            	  }
            }     
            
            this.showButton=function(){
                this.root.clear();
                var button=$("<div class='Log_logbutton'>微信登录</div>");
                button.click(function(){
                    me.showLogDialog();	
                })
                this.root.append(button); 	  
            }
            
            this.getMessageFromServer=function(para){    
            	  
            }
            
            this.showLogDialog=function(){
                this.dialog=new Dialog({
                    title:"用户登录",
                    modal:true,
        	       	  content:$("<div>"
                            +"    <image id='weixinlogimg' src='/images/login/011B7ROykdvhHlqQ.jpg' width='284'/>"
                            +"    <div class='log_hint'>请使用微信扫描二维码登录“微微点菜管理系统”</div>"
                            +"    <div class='log_hint'>提示：新用户无需注册，直接扫描登录即可</div>"
                            +"</div>"
                    )           
                })
                
                this.dialog.show();
            }  
            
            this.showEnrolDialog=function(){
            	  
            } 
            this.init();
       } 
        
    }
);