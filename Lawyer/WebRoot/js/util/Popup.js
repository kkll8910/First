define(["css!util/css/Popup.css"],function() {
      
    return function(options){
    	  var me=this;
     	  options=options || {};
        this.init=function(){    
        	 this.theme=options.theme || "a";
           if(options.modal!=false){
               this.backgroundDiv=$("<div class='backgroundDiv_"+this.theme+"'></div>");	
               $(document.body).append(this.backgroundDiv);
           } 
           
           this.root=$(
               "<div  class='popup_Container_"+this.theme+"'> "+
               "    <div class='popup_TopDiv_"+this.theme+"'>"+
               "      <div class='popup_Title_"+this.theme+"'>"+(options.title || "提示")+"</div> "+
               "      <div class='popup_ExitButton_"+this.theme+"'></div> "+
               "    </div> "+
               "    <div class='popup_ContentDiv_"+this.theme+"'></div>"+
               "</div>"
           ); 
           
           if(options.noExit){
               	$(".popup_ExitButton_"+this.theme,this.root).remove();
           }
           
           if(options.buttons){
               var toolbar=$("<div  class='popup_ToolBarDiv_"+this.theme+"'></div>");
               $.each(options.buttons,function(){
               	   var button=this;
                   var buttonDiv=$("<div  class='popup_ButtonDiv_"+me.theme+"'>"+this.title+"</div>");	
                   buttonDiv.click(function(){
                       var hRes=button.handler();
                       if(hRes==false){
                           return;	
                       }
                       if(button.close==true){
                       	   me.hide();
                       }
                   });
                   toolbar.append(buttonDiv);
               });	
               this.root.append(toolbar);
           }
           
           this.root.width(options.width || 400);
           $(".popup_ContentDiv_"+this.theme,this.root).height(options.height || 300);
           
           if(options.content){
           	    this.appendContent(options.content);
           }
           
           $(".popup_ExitButton_"+this.theme,this.root).click(function(){
           	   me.hide()
           }) 
           
           
           $(document.body).append(this.root);
           if(options.show==true){
               this.show();	
           }
        }
        
        this.appendContent=function(dom){
        	  $(".popup_ContentDiv_"+this.theme,this.root).append(dom);
        }
        
        this.height=function(height){
        	  $(".popup_ContentDiv_"+this.theme,this.root).css("min-height",height+"px");
        	  this.show();
        }
        
        this.width=function(width){
        	  $(".popup_ContentDiv_"+this.theme,this.root).css("min-width",width+"px");
        	  this.show();
        }
        
        
        
        this.getContent=function(){
            return 	$(".popup_ContentDiv_"+this.theme,this.root);
        }
        
        this.hide=function(){
            if(this.backgroundDiv){
               this.backgroundDiv.fadeOut("fast");
            }	
            this.root.fadeOut("fast");	
        }
        
        this.show=function(){
        	   options.content.show();
             var left=($(window).width()-this.root.width())/2;
             var top=(window.innerHeight-this.root.height())/2;	
             this.backgroundDiv.height(window.innerHeight)
             this.root.css({
                     top:top+"px",
                     left:left+"px"
             });
             
             if(this.backgroundDiv){
             	   this.backgroundDiv.fadeIn("fast");
             }	
             this.root.fadeIn("fast");
        }
        
        this.destory=function(){
            if(this.backgroundDiv){
               this.backgroundDiv.remove();
            }	
            this.root.remove();
        }
        this.init();
    }   
});