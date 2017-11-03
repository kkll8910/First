define(["css!util/css/Loader.css"],function() {
      
    return function(options){
    	  var me=this;
     	  options=options || {};
        this.init=function(){    
        	 this.backgroundDiv=$("<div class='loader_backgroundDiv'></div>");	
           $(document.body).append(this.backgroundDiv);
            
           
           this.root=$(
               "<div  class='loader_Container'> "+
               " <img  class='loader_icon' src='/images/ajax-loader.gif'/>   <div  class='loader_text'>"+options.text+"</div>"+
               "</div>"
           ); 
           
           
           
           this.root.width(options.width || 400);
           
           $(document.body).append(this.root);
           if(options.show==true){
               this.show();	
           }
        }
        
        this.show=function(){
        	   
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