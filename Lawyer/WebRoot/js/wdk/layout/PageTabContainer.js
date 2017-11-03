define(["css!wdk/layout/css/PageTabContainer.css"],function() {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
        
        this.init=function(){    
            this.root=$("<div class='NavigateTabContainer_container'>"
                       +"    <div class='NavigateTabContainer_tablist'></div>"
                       +"    <div class='NavigateTabContainer_contentlist'></div>"
                       +"</div>");
            options.container.append(this.root);
            
            
            this.root.find(".NavigateTabContainer_contentlist").css({
            	  height:(options.container.height()-$(".NavigateTabContainer_contentlist").position().top)+"px",
            });
            
            
            if(options.tabList){
                $.each(options.tabList,function(i,tab){
                	  me.addTab(tab);	
                })	
            } 
        
        }
        
        
        /**添加Tab
        title
        closable
        src
        */
        this.addTab=function(tab){
        	  var tabItem=$("<div class='NavigateTabContainer_tab'><div class='NavigateTabContainer_tab_titletext'>"+tab.title+"</div></div>");
        	  if(tab.closable){
        	  	  tabItem.append($("<div class='NavigateTabContainer_closebutton'><img src='/images/exit.png'/></div>"));
        	  }
        	  tabItem.click(function(){
        	      me.showTab($(this))
        	  });
        	  
        	  
        	  
        	  this.root.find(".NavigateTabContainer_tablist").append(tabItem);
        	  
        	  var iframe=$("<iframe class='NavigateTabContainer_iframe'  scrolling='auto' data='"+tab.src+"'></iframe>");
        	  this.root.find(".NavigateTabContainer_contentlist").append(iframe);
        	  
        	  if(tab.selected){
        	  	  this.showTab(tabItem);
        	  }
        	  
        	  tabItem.find("img").click(function(){
        	      	if(tabItem.prev().length){
        	      	    me.showTab(tabItem.prev());	
        	      	}else if(tabItem.next().length){
        	      	    me.showTab(tabItem.next());	
        	      	}
        	      	tabItem.remove();
        	      	iframe.remove();
        	  })
        }
        
        
        this.showTab=function(obj){
            	  var index=(isNaN(obj)) ? obj.index() : obj;
            	  if(index==this.root.find(".NavigateTabContainer_tab_selected").index()){
            	      return;	
            	  }
            	  
            	  this.root.find(".NavigateTabContainer_tab_selected").find("img").hide();
            	  this.root.find(".NavigateTabContainer_tab_selected").toggleClass("NavigateTabContainer_tab_selected");
            	  
            	  $(this.root.find(".NavigateTabContainer_tablist").children().get(index)).toggleClass("NavigateTabContainer_tab_selected");
            	  $(this.root.find(".NavigateTabContainer_tablist").children().get(index)).find("img").show();
            	  
            	  
            	  this.root.find("iframe").hide();
            	  var ifa=$(this.root.find("iframe").get(index));
            	  
            	  if(!ifa.attr("src")){
            	      ifa.attr("src",ifa.attr("data"));	
            	  }
            	  ifa.show();
        }
        
        this.init();
    }   
});