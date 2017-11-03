﻿ define(["css!wdk/input/css/Textarea.css"],function() {
    /**
    
    input type:email,url,number,ange,Date pickers (date, month, week, time, datetime, datetime-local),search,color
    */   
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  
        
        this.init=function(){   
        	  this.root=$("<div class='Input_container'>"
        	             +"    <div class='Input_top'><div class='Input_title'></div><div class='Input_hint'></div></div>"
        	             +"    <div class='Input_item'><textarea  class='Input_ipt'/></textarea></div>"
        	             +"</div>");
        	  if(options.id){
        	      this.root.find("textarea").attr("id",options.id);	
        	  }           
        	  (options.container || $(document.body)).append(this.root);
        	  
        	  
        	  if(options.width){
        	      this.root.css("width",options.width+"px");	
        	  }
        	  
        	  if(options.height){
        	      this.root.find("textarea").css("height",options.height+"px");
        	  }
        	  
        	  
        	  
        	  this.root.find(".Input_title").html(options.title);
        	  
        	  
        	  if(options.hint){
        	  	  this.root.find(".Input_hint").html(options.hint);
        	  }
        	  
        	  this.root.find("textarea").blur(function(){
            	  me.valid();
            }) 
        }
        
        this.valid=function(){
        	  var attrs=options;
        	  var value=this.root.find("textarea").val();
        	  
        	  if(attrs){
        	  	  if(attrs.required && value.length<=0){
        	      	  return me.setStatus(false,"该输入项是必填项，请根据提示输入相应值。")
        	      }
        	      
        	      if(attrs.minlength && value.length < attrs.minlength){
        	      	  return me.setStatus(false,"该输入项的最小长度为"+attrs.minlength+"个字符。")
        	      }
        	      
        	      if(attrs.maxlength && value.length > attrs.maxlength){
        	      	  return me.setStatus(false,"该输入项的最大长度为"+attrs.manlength+"个字符，请调整到规定的字数内。")
        	      }
        	  }
        	  
            if(options.valid){
                return 	options.valid.call(this);
            }
            
            return this.setStatus(true);
        }
        
        //status:true表示输入状态正确，false表示存在问题
        this.setStatus=function(status,msg){
        	  if(status){
        	      this.root.find("textarea").css("border","solid #FF6600 1px");	
        	      this.root.find(".Input_hint").html("");
        	      this.root.find(".Input_hint").removeClass("Input_hint_error");	
        	      this.root.find("textarea").removeClass("Input_ipt_error");	
        	  }else{
        	  	  this.root.find("textarea").css("border","solid #FF0000 1px");	
        	  	  if(msg){
        	  	      this.root.find(".Input_hint").html(msg);
        	  	      this.root.find(".Input_hint").addClass("Input_hint_error");	
        	  	      this.root.find("textarea").addClass("Input_ipt_error");	
        	  	  }
        	  }
        	  return status;
        }
        
        this.getInputObject=function(){
        	  return this.root.find("textarea");
        }
        
        this.val=function(value){
        	  if(value){
        	  	  this.root.find("textarea").val(value);
        	  }else{
        	      return this.root.find("textarea").val();
        	  }
        }
        
        this.init();
    }   
});