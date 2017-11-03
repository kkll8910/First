 define(["css!wdk/layout/css/Tooltip.css"],function() {
       return function(options){
       	   	var me=this;
        	  var options=options || {};
             this.referenceObject=options.referenceObject || options.trigger;
             
            this.init=function(){
                this.root=$("<div class='tooltip_container'>"
                           +"    <div class='tooltip_title'></div>"
                           +"    <div class='tooltip_content'></div>"+
                           +"</div>");
                           
                
                
                //标题-------------------------------------------
                if(options.title){
                   this.root.find(".tooltip_title").html(options.title);
                   this.root.find(".tooltip_title").show();
                }
                
                if(options.width){     
                	  this.width(options.width);
                }
                
                
                if(options.height){
                   	this.height(options.height);
                }
                
                //内容区-------------------------------------------
                if(options.content){
                   this.root.find(".tooltip_content").append(options.content);
                }
                
                
                if(options.html){
                   this.root.find(".tooltip_content").html(options.html);
                }
                
                if(options.event && options.event=="focus"){
                    options.trigger.focus(function(){
                    	  me.show();
                    })
                }else{
                    options.trigger.click(function(){
                      me.show();
                    })           
                }
                
                 this.root.hover(null,function(){
                    	  me.hide();
                 })   
                
                 $(document.body).append(this.root);
            }
            
            this.width=function(width){
            	  if(width){
            	  	  if(isNaN(width)){
            	  	  	$(".tooltip_content",this.root).css("width",width);	
            	  	  }else{
            	          $(".tooltip_content",this.root).css("width",width+"px");	
            	      }
            	  }else{
            	      return this.root.width();	
            	  }
            }
            
            this.height=function(height){
            	  if(height){
            	  	  if(isNaN(height)){
            	  	  	$(".tooltip_content",this.root).css("height",height);	
            	  	  }else{
            	          $(".tooltip_content",this.root).css("height",height+"px");	
            	      }
            	  }else{
            	      return this.root.height();	
            	  }
            }
            
            
            this.show=function(){
            	  var horizontal=(!options.horizontal) ? "left" : options.horizontal;
            	  var vertical=(!options.vertical) ? "bottom" : options.vertical;
            	  var referenceObject=options.reference || options.trigger
            	  var offset=options.offset || {h:0,v:0};
            	  
            	  var position={};
            	  if(horizontal=="left" && vertical=="bottom"){
            	      position.left=(referenceObject.offset().left+offset.h)+"px";
            	      position.top=(referenceObject.offset().top+referenceObject.height()+offset.v)+"px";
            	  }
            	  this.root.css(position);
            	  this.root.fadeIn();
            }
            
            
            this.hide=function(){
            	  this.root.fadeOut("fast");
            }
            
            this.getContentArea=function(){
            	  return this.root.find(".tooltip_content");
            }
            
            
            this.init();
       } 
    }
);