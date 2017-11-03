/**
options:{
	 container:父容器，Tab组件会自动设置为该容器的高度，
	 tablist：[
	     {single:不允许打开重复的页面，
	      title:标题，
	      id：
	      minWidth：tab最小宽度，整数，
	      closable：可关闭的
	      src：Iframe的网址
	      content：内容，jquery对象
	      selected：创建后是否马上获得焦点
	     },.....
	 ]
}
*/
define(["css!util/css/TabContainer.css"],function() {
      
    return function(options){
    	  var me=this;
     	  options=options || {};
        
        this.init=function(){    
            this.root=$("<div class='NavigateTabContainer_container'>"
                       +"    <div class='NavigateTabContainer_tablist'></div>"
                       +"    <div class='NavigateTabContainer_contentlist'></div>"
                       +"</div>");
                       
            if(options.container){
            	   options.container.append(this.root);
            	   var h=options.container.height()-$(".NavigateTabContainer_tablist",this.root).height();
            	   $(".NavigateTabContainer_contentlist",this.root).height(h);
            }
            
            
            if(options.tablist){
            	  $.each(options.tablist,function(i,item){
                	  me.addTab(item);	
                })	
            }
            
            //监听窗口大小改变的事件，从而重新布局大小
            window.wdk.Observer.subscribe("window/resize",function(){
            	  me.render();
            });
        }
        
        this.addTab=function(tab){
        	  if(!tab.id){
        	      alert("错误：Tab项 id为空！");
        	      return;
        	  }
        	 
        	  var isExist=false;
        	  $(".NavigateTabContainer_tab",this.root).each(function(){
        	  	      if($(this).attr("id")=="tab_"+tab.id){
        	              me.showTab(tab.id);
        	              isExist=true;
        	              return;	
        	          }	
        	  })
        	  
        	  if(isExist){return;}
        	  
        	  if(tab.title.length>8){
        	      tab.title=tab.title.substring(0,8)+"...";		
        	  }
        	  var tabItem=$("<div class='NavigateTabContainer_tab' id='tab_"+tab.id+"'><div class='NavigateTabContainer_tab_titletext'>"+tab.title+"</div></div>");
        	  if(tab.minWidth){           
                tabItem.find(".NavigateTabContainer_tab_titletext").css("min-width",tab.minWidth+"px");
            }
            
        	  if(tab.closable){
        	  	  tabItem.append($("<div class='NavigateTabContainer_closebutton'><img id='exitButton' src='/images/exit.png'/></div>"));
        	  }
        	  
        	  
        	  tabItem.click(function(){
        	  	  me.showTab($(this).attr("id"));
        	  });
        	  
        	  this.root.find(".NavigateTabContainer_tablist").append(tabItem);
        	  
        	  
        	  var cItem=null;
        	  if(tab.src){
        	      cItem=$("<iframe class='NavigateTabContainer_content NavigateTabContainer_iframe'  scrolling='auto' src='"+tab.src+"' id='content_"+tab.id+"'></iframe>");
        	  }else if(tab.content){
        	  	  cItem=$("<div class='NavigateTabContainer_content NavigateTabContainer_contentContainer'  id='content_"+tab.id+"'></div>");
        	  	  cItem.append(tab.content);
        	  }
        	  this.root.find(".NavigateTabContainer_contentlist").append(cItem);
        	  
        	  
        	  if(tab.selected){
        	  	  this.showTab(tabItem.attr("id"));
        	  }
        	  
        	  tabItem.find("#exitButton").click(function(){
        	      	if(tabItem.prev().length>0){
        	      		  var prevID=tabItem.prev().attr("id");
        	      		  var id=prevID.substring(4,prevID.length)
        	      	    me.showTab(id);	
        	      	}else if(tabItem.next().length){
        	      	    var nextID=tabItem.next().attr("id");
        	      		  var id=nextID.substring(4,nextID.length)
        	      	    me.showTab(id);	
        	      	}
        	      	tabItem.remove();
        	      	cItem.remove();
        	  })
        }
        
        this.removeTab=function(id){
        	  var tab=$("#tab_"+id,this.root);
        	  if(tab.length<=0) return;
        	  
        	  
        	  var nextTab;
        	  if(tab.prev().length>0){
        	  	  nextTab=tab.prev();
        	  }else if(tab.next().length>0){
        	  	  nextTab=tab.next();
        	  }
        	  
        	  if(nextTab){
        	      var tid=nextTab.attr("id");
        	      var nid=tid.substring(4,tid.length);
        	      this.showTab(nid);
        	  }
        	  
        	  tab.remove();
        	  $("#content_"+id,this.root).remove();
        }
        
        this.setTab=function(id,obj){
        	  var tab=$("#tab_"+id);
        	  if(obj.title){
        	  	  if(obj.title.length>8){
        	          obj.title=obj.title.substring(0,8)+"...";		
        	      }
        	  	  $(".NavigateTabContainer_tab_titletext",tab).html(obj.title);
        	  }
        	  
        	  if(obj.src){
        	  	  $("#content_"+id).attr("src",obj.src);
        	  }
        	  
        	  if(obj.id){
        	  	  $("#tab_"+id).attr("id","tab_"+obj.id);
        	      $("#content_"+id).attr("id","content_"+obj.id);
        	  }
        }
        
        this.setTabID=function(id,newID){
        	  $("#tab_"+id).attr("id","tab_"+newID);
        	  $("#content_"+id).attr("id","content_"+newID);
        }
        
        this.getSelectedIndex=function(){
        	  return this.root.find(".NavigateTabContainer_tab_selected").index();
        }
        
        this.showTab=function(id){
        	  var tabItem=$("#tab_"+id).length>0? $("#tab_"+id) : $("#"+id);
        	  
        	  if(!tabItem || tabItem.length<=0){
        	      return;	
        	  }
        	  
            if(tabItem==$(".NavigateTabContainer_tab_selected",this.root)){
                return;	
            }
            
            $(".NavigateTabContainer_tab_selected",this.root).find("img").hide();//隐藏关闭按钮
            $(".NavigateTabContainer_tab_selected",this.root).toggleClass("NavigateTabContainer_tab_selected");//
            $(".NavigateTabContainer_content",this.root).hide();
            
            
            tabItem.toggleClass("NavigateTabContainer_tab_selected");
            tabItem.find("img").show();
            
            var tabID=tabItem.attr("id");
            id=tabID.substring(4,tabID.length);
            $("#content_"+id).show();
        }
        
        this.render=function(){
        	  var container=this.root.parent();
        	  var h=container.height()-$(".NavigateTabContainer_tablist",this.root).height();
        	  $(".NavigateTabContainer_contentlist",this.root).height(h);
        }
        
        this.getRootDom=function(){
            return this.root;	
        }
        
        this.init();
    }   
});