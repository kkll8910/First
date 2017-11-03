define(["css!wdk/layout/css/VerticalTabContainer.css"],function() {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
        
        this.init=function(){    
            this.root=$("<div class='vtc_container'>"
                       +"   <div class='vtc_leftDiv'></div>"
                       +"   <div class='vtc_rightDiv'></div>"
                       +"</div>");
            
            
            if(options.container){
                options.container.append(this.root);
            }else{
            	  $(document.body).append(this.root);
            }
            
            if (options.height) {
            	  $(".vtc_leftDiv",this.root).height(options.height);
            	  $(".vtc_rightDiv",this.root).height(options.height);
            }
            
            //添加内容
            if(options.contents){
            	  $.each(options.contents,function(){
                	  me.addContent(this);	
                })	
            } 
            
            if(options.draggable){
            	  this.root.draggable({ handle: '.vtc_dragHandler'});       
            }
        }
        
        this.addContent=function(tab){
        	  var tabItem=$("<div class='vtc_tab'>"+tab.title+"</div>");
        	  $(".vtc_leftDiv",this.root).append(tabItem);
        	  if(tabItem.index()==0){
        	      tabItem.css("margin-top","20px")	
        	  }
        	  
        	  tabItem.click(function(){
        	      me.showTab($(this).index());
        	  });
        	  
        	  
        	  var cItem=$("<div class='vtc_content'></div>");
        	  cItem.append(tab.content);
        	  $(".vtc_rightDiv",this.root).append(cItem);
        	  
        	  if(tab.selected){
        	  	  this.showTab(tabItem.index());
        	  }
        }
        
        this.showTab=function(idx){
            $(".vtc_tab_selected",this.root).removeClass("vtc_tab_selected");
            $(".vtc_content_selected",this.root).removeClass("vtc_content_selected");
            
            $(".vtc_tab:eq("+idx+")",this.root).addClass("vtc_tab_selected");
            $(".vtc_content:eq("+idx+")",this.root).addClass("vtc_content_selected");
        }
        
        this.init();
    }   
});