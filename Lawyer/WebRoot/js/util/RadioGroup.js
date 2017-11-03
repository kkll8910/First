 define(["css!util/css/Group.css"],function() {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  
     	  this.root=options.root;
     	  this.theme=options.theme || "a";
     	  
        this.init=function(){	
        	 if(this.theme=="a"){
        	     this.root.addClass("Group_container_a");
        	     this.root.children().addClass("Group_item_a");
        	     this.root.children().click(function(){
        	     	   	  me._select($(this));
        	     })
               
               this.root.children().first().addClass("Group_item_first_a");
               this.root.children().last().addClass("Group_item_last_a");
           }else if(this.theme=="b"){
               this.root.addClass("Group_container_b");
        	     this.root.children().addClass("Group_item_b");
        	     this.root.children().click(function(){
        	     	   	  me._select($(this));
        	     })
           }
        }
        
        this._select=function(obj){
        	  $(".Group_item_selected",this.root).removeClass("Group_item_selected");
        	  obj.addClass("Group_item_selected");
        	  $("#errorDiv",this.root).remove();	
        }
        
        this.val=function(){
            return 	$(".Group_item_selected",this.root).attr("value") || $(".Group_item_selected",this.root).text();
        }
        
        this.valid=function(){
            if(!this.val()){
            	  var msg=this.root.attr("errorMsg") || "请选择其中一项";
            	  var div=$("<div id='errorDiv'>"+msg+"</div>");
    	  	      div.css({
    	  	      	  "margin-left":"10px",
    	              "color":"#FF0000",
    	              "float":"left",
    	              "height":"40px",
    	              "line-height":"40px"
    	          })
    	          this.root.append(div);
            }else{
                $("#errorDiv",this.root).remove();	
                return true;
            }
        }
        this.init();
    }   
});