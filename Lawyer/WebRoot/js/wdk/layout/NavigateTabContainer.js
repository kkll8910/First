define(["css!wdk/layout/css/NavigateTabContainer.css"],function() {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
        
        this.root=$("<div class='NavigateTabContainer_container'>"
                   +"<div class='NavigateTabContainer_topdiv'>"
                   +"    <div class='NavigateTabContainer_tablist'></div>"
                   +"</div>"
                   +"<div class='NavigateTabContainer_contentlist'></div>"
                   +"</div>");
                   
        this.root.css({
        	  width:$(document).width()+"px",
            height:$(document).height()+"px"
        });
        
        
        
        $(document.body).append(this.root);
        
        this.root.find(".NavigateTabContainer_tablist").css({
        	  width:(this.root.width()-280)+"px",
        	  left:"280px"
        });
        
        
        this.root.find(".NavigateTabContainer_contentlist").css({
        	  height:($(document).height()-$(".NavigateTabContainer_contentlist").position().top)+"px",
        });
        
        //添加Tab
        this.addTab=function(tab){
        	  var tabItem=$("<div class='NavigateTabContainer_tab'>"+tab.title+"</div>");
        	  tabItem.click(function(){
        	      me.showTab($(this))
        	  });
        	  this.root.find(".NavigateTabContainer_tablist").append(tabItem);
        	  
        	  var iframe=$("<iframe class='NavigateTabContainer_iframe'  scrolling='no' data='"+tab.src+"'></iframe>");
        	  this.root.find(".NavigateTabContainer_contentlist").append(iframe);
        	  
        	  if(tab.selected){
        	  	  this.showTab(tabItem);
        	  }
        }
        
        
        this.showTab=function(obj){
            	  var index=(isNaN(obj)) ? obj.index() : obj;
            	  if(index==this.root.find(".NavigateTabContainer_tab_selected").index()){
            	      return;	
            	  }
            	  
            	  this.root.find(".NavigateTabContainer_tab_selected").toggleClass("NavigateTabContainer_tab_selected");
            	  $(this.root.find(".NavigateTabContainer_tablist").children().get(index)).toggleClass("NavigateTabContainer_tab_selected");
            	  
            	  this.root.find("iframe").hide();
            	  var ifa=$(this.root.find("iframe").get(index));
            	  
            	  if(!ifa.attr("src")){
            	      ifa.attr("src",ifa.attr("data"));	
            	  }
            	  ifa.show();
        }
        
        if(options.tabList){
            $.each(options.tabList,function(i,tab){
            	  me.addTab(tab);	
            })	
        }
    }   
});