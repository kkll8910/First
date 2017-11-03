 define(["css!wdk/layout/css/Accordion.css"],function() {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  
        this.init=function(){
         	  this.root=$("<div class='Accordion_container'></div>");
            if(options.css){
                this.root.css(options.css);	
            }
            
            if(options.tabs){
                $.each(options.tabs,function(i,item){
                    me.addTab(item);	
                })	
            }
            
            if(options.container){
                this.appendTo(options.container);	
            }	
        }
        
        //添加Tab
        this.addTab=function(tab){
            var titleBar=$("<div class='Accordion_titleBar'></div>");
            
            //图标
            var iconDiv=$("<div class='Accordion_icon'></div>");	
            if(tab.icon){
                iconDiv.append($("<img src='"+tab.icon+"' width='12' height='12'/>"));
            }
            titleBar.append(iconDiv);
            
            //标题
            var titleDiv=$("<div class='Accordion_title'></div>");
            if(tab.title){
                titleDiv.html(tab.title);	
            }
            titleBar.append(titleDiv);
            
            //按钮栏
            if(tab.buttons){
                var buttonsDiv=$("<div class='Accordion_buttonList'></div>");
                $.each(tab.buttons,function(i,item){
                	  var button=$("<div class='Accordion_button'></div>");
                	  if(item.title){
                	  	  button.html(item.title);
                	  }else if(item.src){
                	  	  button.append($("<img src='"+item.src+"' width='12' height='12'/>"));
                	  }
                	  
                	  if(item.handler){
                	      button.click(function(event){
                	      	item.handler();
                	      	event.stopPropagation();
                	      })
                	  }
                	  buttonsDiv.append(button);
                })	
                titleBar.append(buttonsDiv);
            }
            
            //单击事件
            titleBar.click(function(){
                me.toggle($(this));	
            })
            
            
            this.root.append(titleBar);
            
            
            //内容区
            var contentDiv=$("<div class='Accordion_contentList'></div>");
            if(tab.contentHeight){
                contentDiv.css({
                    height:tab.contentHeight+"px",
                    overflowY:"auto"	
                })	
            }
            this.root.append(contentDiv);
            
            //内容区添加内容
            if(tab.content){
               this.appendContent(titleBar.index()/2,tab.content); 	
            } 
            
            //默认展开
            if(tab.selected){
            	  this.toggle(titleBar);	
            }
        }
        
        this.appendContent=function(index,content){
        	  
        	  if($.isArray(content)){
            	  $.each(content,function(i,item){
            	  	  $(me.root.find(".Accordion_contentList")[index]).append($(item));	
                })
            }else{
            	  $(this.root.find(".Accordion_contentList")[index]).append(content);	
            }
        }
        
        this.toggle=function($titleDiv){
        	  var div=$titleDiv.next();
            
            if(div.css("display")=="none"){
                
                $titleDiv.css("border-bottom","0px");
                div.fadeIn("fast");
            }else{
            	  $titleDiv.css("border-bottom","solid #6a6a6a 1px");
                div.fadeOut("fast");	
            }
        }
        
        this.appendTo=function($container){
        	  $container.append(this.root);
        }
        
        this.init();
    }   
});