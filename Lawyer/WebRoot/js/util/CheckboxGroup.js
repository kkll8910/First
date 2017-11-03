 define(["css!util/css/Group.css"],function() {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  
     	  this.root=options.root;
        
        this.init=function(){
        	 this.root.addClass("Group_container");
        	 this.root.children().addClass("Group_item");
        	 this.root.children().click(function(){
        	 	   	  me._switch($(this));
        	 })
           
           this.root.children().first().addClass("Group_item_first");
           this.root.children().last().addClass("Group_item_last");
        }
        
        this._switch=function(obj){
        	  if(obj.hasClass("Group_item_selected")){
        	     obj.removeClass("Group_item_selected");
        	  }else{
        	  	 obj.addClass("Group_item_selected");
        	  }
        	  
        }
        
        this.val=function(){
            var values=[];
            $(".Group_item_selected",this.root).each(function(){
            	  var	v=$(this).attr("value") || $(this).text();
                values.push(v)
            })	
            return values;
        }
        this.init();
    }   
});