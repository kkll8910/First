 /**
 catagory
 parent
 container
 
 */
 
 define(["Modules","Popup","css!util/css/ItemAppender.css"],function(Modules,Popup) {
    return function(options){
    	  var me=this;
    	  options=options || {};
    	  this.title="";
    	  this.type=null;
    	  this.module=null;
    	  
    	  this.init=function(){
    	  	  this._root=$(
    	          "<div class='Itemappender_container'>"
    	         +"    <div class='Itemappender_topDiv' style=''>" 
    	         +"        <div  class='Itemappender_title' style='margin-left:12px;'>名称：</div>"
    	         +"        <div><input class='Itemappender_title_input' type='text'/></div>"
    	         +"        <div  class='Itemappender_title' style='margin-left:20px;'>数据类型：</div>"
    	         +"        <div>"
    	         +"            <div class='Itemappender_data_type Itemappender_data_type_first' value='text'>普通文本</div>"
    	         +"            <div class='Itemappender_data_type' value='html'>富文本</div>"
    	         +"            <div class='Itemappender_data_type' value='picture_list'>照片</div>"
    	         +"            <div class='Itemappender_data_type Itemappender_data_type_last' value='vedio'>视频</div>"
    	         +"        </div>"
    	         +"    </div>"
    	         +"    <div class='Itemappender_module_container'></div>"
    	         +"</div>"
    	      );	
            
            $(".Itemappender_data_type",this._root).click(function(){
            	  var ipt=$(".Itemappender_title_input");
            	  if(!ipt.val()){
            	  	  alert("请输入名称");
            	  	  ipt.focus();	
            	  	  return;
            	  }
            	  
            	  me.title=ipt.val();
            	  me.type=$(this).attr("value");
            	  $(".Itemappender_topDiv",me._root).remove();
            	  me.createModule();
            })

    	      this.popup=new Popup({
 	     	        title:"添加属性",
 	     	        width:960,
 	     	        height:440,
 	     	        content:this._root,
 	     	        buttons:[
 	     	            {title:"关闭",handler:function(){
 	     	                me.popup.destory();
 	     	            }},
 	     	            {title:"确定",handler:function(){
 	     	                me.putModuleToDocument();
 	     	            }}
 	     	        ]
 	     	    })
    	  }
        
        this.createModule=function(){
        	  if(options.parent){
        	      var moduleContainer=$(".Itemappender_module_container",me._root);
        	      var option={
    	          	 title:me.title,
    	          	 container:moduleContainer,
    	          	 mode:"modify"
    	          }
    	          
    	          if(this.type=="text"){
    	          	  moduleContainer.width();
    	          	  moduleContainer.height();
    	          }else if(this.type=="html"){
    	          	  moduleContainer.height(360);
    	          	  this.popup.height(380);
    	          }else if(this.type=="picture_list"){
    	          	  moduleContainer.height(420);
    	          	  this.popup.height(440);
    	          }else if(this.type=="vedio"){
    	          	
    	          }
    	          
        	      $.each(Modules,function(){
    	             if(this.type==me.type){
    	                me.module=new this.module(option);
    	             }	
    	          })
    	      }else{
    	      	  var option={
    	          	 title:this.title,
    	          	 container:options.container,
    	          	 mode:"modify"
    	          }
    	          
    	          $.each(Modules,function(){
    	             if(this.type==me.type){
    	                me.module=new this.module(option);
    	                
    	                if(options.handler){
    	                	  options.handler.call(me.module);
    	                }
    	                me.popup.destory();   
    	             }	
    	          })
    	      }
        }
        
        this.putModuleToDocument=function(){
        	  if(options.parent){
                if(!this.module || !this.module.val()){
                    return;	
                }	
                
                var valuetype=this.module.getOption("valuetype");
                var para={
                    RequestFlag:"appendItem",
                    catagory:options.catagory,
                    parent:options.parent,
                    type:this.type,
                    title:this.title,
                    value:this.module.val(),
                    valuetype:valuetype
                }
                var obj={};
                $.extend(obj,para);
                
                if (valuetype=="array" || valuetype=="json") {
                	  obj.value=JSON.stringify(this.module.val());
                	  
                }
                
                $.ajax({
    	 	        	type: "POST",
                  dataType: "json",
                  url:"/ItemSession",
                  data: obj,
                }).done(function(res){  
                	  if(res.ID){
                	  	  para.id=res.ID;
                	      options.handler.call(para);
                	      me.popup.destory();                	      
                	  }
                });
            }    
        }
        this.show=function(){
            this.popup.show();	
        }
        this.init();
    }   
});