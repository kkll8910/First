define(["UI","css!wdk/layout/css/Toolbar.css"],function(UI) {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
        
        this.init=function(){    
            this.root=$("<div class='ToolbarContainer'></div>");
            if(options.draggable){
                this.root.append($("<div class='Toolbar_draghandler'></div>"));
                this.root.draggable({ handle: '.Toolbar_draghandler'})
            }
            
            if(options.container){
                options.container.append(this.root);
            }
            
            if(options.css){
                this.root.css(options.css);	
            }
            
            if(options.items){
                //this.addItems();	
            }
        }
        
        this.addItem=function(item){
        	  var obj=$("<div class='Toolbar_item'>"
        	               +"    <div class='Toolbar_item_icon_ontainer'></div>"
        	               +"    <div class='Toolbar_item_title'>"+item.title+"</div>"
        	               +"</div>");
        	               
        	  if(item.icon){
        	      var img=$("<img/>")
        	      img.attr("src",item.icon);
        	      $(".Toolbar_item_icon_ontainer",obj).append(img);	
        	  }
        	  
        	  if(item.handler){
        	  	 item.handler();
        	  }
        	  
        	  if(item.subItem){
        	      var subItemContainer=$("<div class='Toolbar_SubItem_Container'></div>");
        	      subItemContainer.append(item.subItem);
        	      subItemContainer.hover(null,function(){
        	      	
        	      })
        	      obj.click(function(){
        	  	  
        	      })
        	  }
        }
        
        this.hideSubItem=function(){
            	
        }
        
        this.showTab=function(idx){
            var tab=$(this.root.find("#leftTd").children()[idx]);
            var content=$(this.root.find("#rightTd").children()[idx]);
            
            this.root.find(".vtc_tab_selected").removeClass("vtc_tab_selected");
            tab.addClass("vtc_tab_selected");
            
            this.root.find(".vtc_content_selected").removeClass("vtc_content_selected");
            content.addClass("vtc_content_selected");
        }
        
        this.init();
    }   
});