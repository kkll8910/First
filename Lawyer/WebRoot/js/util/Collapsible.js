 define(["css!util/css/Collapsible.css"],function() {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  
     	  this.root=options.root;
     	  this.topDiv=this.root.children().first();
     	  this.ContentDiv=this.topDiv.next();
     	  
     	  var themes=[
     	      {name:"a",color:"#333",backgroundColor:"#f6f6f6",hoverBackgroundColor:"#ccc"},
     	      {name:"b",color:"#FFFFFF",backgroundColor:"#333",hoverBackgroundColor:"#373737"}
     	  ];
     	  
        this.init=function(){
        	 this._getTheme();
        	
        	 this.root.addClass("Collapsible_container");
        	 
        	 this.topDiv.addClass("Collapsible_topDiv");
        	 this.topDiv.css({
        	     "background-color":this.theme.backgroundColor,
        	     "border":"solid "+this.theme.backgroundColor+" 1px",
        	     "border-top":"0px"
        	 })
        	 this.topDiv.mouseover(function(){
        	     $(this).css("background-color",me.theme.hoverBackgroundColor);
        	 })
        	 this.topDiv.mouseout(function(){
        	     $(this).css("background-color",me.theme.backgroundColor);
        	 })
        	 
        	 this.topDiv.click(function(){
        	     me.collapse();	
        	 })
        	 
        	 
        	 this.topDiv.prepend("<div class='Collapsible_collapsibleIcon'></div>");
        	 $("[type='title']").addClass("Collapsible_title");
        	 $("[type='title']").css({
        	     "color":this.theme.color
        	 })
        	 
        	 $("[type='button']").addClass("Collapsible_button");
        	 $("[type='button']").css({
        	     "color":this.theme.color
        	 })
        	 
        	 this.ContentDiv.addClass("Collapsible_contentDiv")
        	 this.ContentDiv.css({
        	 	  "border":"solid #ccc 1px",
        	 	  "border-top":"0px"
        	 })
        	 
        	 
        	 var collapsed=this.root.attr("collapsed");
        	 if(collapsed){
        	 	    this.ContentDiv.hide();	
                $(".Collapsible_collapsibleIcon",this.root).css({
                	 "background" : "url('/js/util/images/plus-white.png') no-repeat",
                	 "background-position":"4px 4px"
                })
                
                this.topDiv.css({
                	  "-moz-border-radius" : "4px",      
                    "-webkit-border-radius" : "4px",  
                    "border-radius" : "4px"
                })
        	 
        	 }
        }
        
        this.collapse=function(){
            var display=this.ContentDiv.css("display");
            var disCollapse=this.root.attr("disCollapse");  
              
            if(display=="none"){
                this.ContentDiv.show();	
                $(".Collapsible_collapsibleIcon",this.root).css({
                	 "background" : "url('/js/util/images/minus-white.png') no-repeat",
                	 "background-position":"4px 4px"
                })
                
                this.topDiv.css({
                	  "-moz-border-radius" : "4px 4px 0 0",      
                    "-webkit-border-radius" : "4px 4px 0 0",  
                    "border-radius" : "4px 4px 0 0"
                })
                if(options.collapsedHandler){
                	  options.collapsedHandler()
                }
                
            }else{
            	  if(!disCollapse){
            	      this.ContentDiv.hide();	
            	      $(".Collapsible_collapsibleIcon",this.root).css({
                    	 "background" : "url('/js/util/images/plus-white.png') no-repeat",
                    	 "background-position":"4px 4px"
                    })
                    
                    this.topDiv.css({
                    	  "-moz-border-radius" : "4px",      
                        "-webkit-border-radius" : "4px",  
                        "border-radius" : "4px"
                    })
                }
            }
        }
        
        this.appendContent=function(dom){
        	  this.ContentDiv.append(dom);
        }
        
        this.emptyContent=function(){
        	  this.ContentDiv.empty();
        }
        
        
        this._getTheme=function(){
        	  var theme=this.root.attr("theme") || "a";
        	  $.each(themes,function(){
        	      if(this.name==theme){
        	      	  me.theme=this;
        	      	  return;
        	      }	
        	  })
        }
        
        this.init();
    }   
});