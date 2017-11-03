 define(["css!wdk/layout/css/CollapsiblePanel.css"],function() {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  this.closed=false;
     	  this.root=$(
     	        "<div class='CollapsiblePanel_container'>"
             +"	<div class='CollapsiblePanel_toolbar'>"
             +"	   <div class='CollapsiblePanel_cp'>-</div>"
             +"	   <div class='CollapsiblePanel_title'>"+(options.title || "")+"</div>"
             +"	</div>"
             +"	<div class='CollapsiblePanel_body'></div>"
             +"	<div class='CollapsiblePanel_bottom'></div>"
             +"</div>"
     	  );
     	  
        this.init=function(){
        	 $(".CollapsiblePanel_toolbar",me.root).click(function(){
        	     $(".CollapsiblePanel_body",me.root).slideToggle();	
        	     if($(".CollapsiblePanel_cp",me.root).html()=="-"){
        	     	  $(".CollapsiblePanel_cp",me.root).html("+")
        	     	  $(".CollapsiblePanel_bottom",me.root).css("background-color","#284452");
        	     }else{
        	     		$(".CollapsiblePanel_cp",me.root).html("-");
        	     		$(".CollapsiblePanel_bottom",me.root).css("background-color","#32505f");
        	     }
        	 })
        	 
        	 if(options.closed){
        	 	  $(".CollapsiblePanel_body",me.root).hide();
        	 	  $(".CollapsiblePanel_bottom",me.root).css("background-color","#284452");
        	 	  $(".CollapsiblePanel_cp",me.root).html("+");
        	 }else{
        	 	  $(".CollapsiblePanel_body",me.root).show();
        	 	  $(".CollapsiblePanel_bottom",me.root).css("background-color","#32505f");
        	 	  $(".CollapsiblePanel_cp",me.root).html("-");
        	 }
         	 options.container.append(this.root);
        }
        
        this.getChildren=function(){
            return 	$(".CollapsiblePanel_body",me.root).children();
        }
        
        this.append=function(jDom){
        	  $(".CollapsiblePanel_body",me.root).append(jDom);
        }
        
        this.clear=function(){
            $(".CollapsiblePanel_body",me.root).html("");	
        }
        
        this.init();
    }   
});