define(["css!wdk/layout/css/pane.css"],function() {
      
    return function(options){
    	  var me=this;
     	  options=options || {};
        this._collapsed=false;
        
        this.init=function(){    
             this.container=options.container;
             this.topDiv=this.container.children("div:first");
             this.contentDiv=this.container.children("div:gt(0)");
             
             this.theme=this.container.attr("theme") || "a";
             
             this.container.addClass("Pane_Container_"+this.theme);
             this.topDiv.addClass("Pane_TopDiv_"+this.theme);
             this.contentDiv.addClass("Pane_ContentDiv_"+this.theme);
             
             
             $("div:first",this.topDiv).before($("<div class='pane_FoldButton'><img id='FoldIcon' src='/images/close-white.png'><div>"))
             $("[name='title']",this.topDiv).addClass("Pane_TitleDiv");
             $("[name='button']",this.topDiv).addClass("Pane_ButtonDiv");
             $("[name='button']",this.topDiv).click(function(){
                 return false;	
             })
             
             this._collapsed=this.topDiv.attr("collapsed");
             if(this._collapsed){
        	  	  $("#FoldIcon",this.container).attr("src","/images/open-white.png");
        	  	  this.topDiv.addClass("Pane_TopDiv_collapsed");
        	  	  this.contentDiv.hide();
        	  	  
        	   }else{
        	  	  $("#FoldIcon",this.container).attr("src","/images/close-white.png");
        	  	  this.topDiv.removeClass("Pane_TopDiv_collapsed");
        	  	  this.contentDiv.show();
        	   }
             
             this.topDiv.click(function(){
                 me.collapse();	
             })
        }
        
        this.collapse=function(){
        	  if(this._collapsed){
        	  	  $("#FoldIcon",this.container).attr("src","/images/close-white.png");
        	  	  this.topDiv.removeClass("Pane_TopDiv_collapsed");
        	  	  this.contentDiv.show();
        	  	  this._collapsed=false;
        	  }else{
        	  	  $("#FoldIcon",this.container).attr("src","/images/open-white.png");
        	  	  this.topDiv.addClass("Pane_TopDiv_collapsed");
        	  	  this.contentDiv.hide();
        	  	  
        	  	  this._collapsed=true;
        	  }
        }
        this.init();
    }   
});