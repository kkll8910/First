define(["css!wdk/layout/css/Tab.css"],function() {
      
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  this.container=options.container;
     	  
        this.init=function(){    
        	  this.container.children().first().addClass("tabList");
        	  this.tabItems=this.container.children().first().children();
        	  this.contentList=this.container.children().eq(1).children();
        	  
        	  this.container.addClass("container");
            this.tabItems.addClass("unselected");
            this.container.children().eq(1).addClass("contentContainer");
            
            this.tabItems.click(function(){
        	  	  me.tab($(this).index());
        	  })
            
            this.contentList.hide();	 
            
            var tabIndex=options.index;
            if(!tabIndex || tabIndex>this.tabItems.length){
                tabIndex=0;	
            }
            
            this.tab(tabIndex);	
        }  
        
        
        this.tab=function(index){
        	  
        	  var currIdx=$(".selected",this.container).index();
        	  
        	  if(currIdx==index){
        	  	  return;	
        	  }
        	  
        	  $(".selected",this.container).removeClass("selected");
        	  this.contentList.eq(currIdx).hide();
        	  
        	  this.tabItems.eq(index).addClass("selected");
        	  this.contentList.eq(index).show();
        }
        
        this.init();
        
        this.getTabIndex=function(){
            return 	$(".selected",this.container).index();
        }
    }   
});