 define(["Pane","Modules","css!util/css/Unit.css"],function(Pane,Modules) {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  this.modules=[];
     	  
        this.init=function(){
        	  var paneTitle="<input type='text' id='UnitTitleInput' style='width:240px;' placeholder='请输入标题(选填)'>"
        	  if(options.id){
        	  	  paneTitle=options.title || "";
        	  }
        	  this.root=$(
     	           "<div   theme='b' collapsible='true' style='margin:10px 10px 10px 10px;width:98%;'> "
    	          +"	<div id='titleDiv'>"
    	          +"	  <div type='title' style='margin-right:32px;'>"+paneTitle+"</div>"
    	          +"	</div>"
  	            +"  <div id='contentDiv'></div>"
                +"</div>"
     	      );
     	      
     	      if(options.id){
        	  	  $("[type='button']",this.root).remove();
        	  	  if(!options.title){$("[type='title']",this.root).remove();}
        	  }else{
        	  	  $("#titleDiv",this.root).append("<div type='button' id='saveButton'>保存</div>");
        	  	  $("#titleDiv",this.root).append("<div type='button' id='addVedioButton'>上传视频</div>");
        	  	  $("#titleDiv",this.root).append("<div type='button' id='addPictureButton'>上传图片</div>");
     	      	  $("#titleDiv",this.root).append("<div type='button' id='addHtmlButton'>添加文本</div>");
     	      	  
     	      	  $("#saveButton",this.root).click(function(){
                	  if(options.id){
                        me.modify();	
                    }	else{
                    	  me.create();
                    }
                });
            
     	      	  
     	      	  $("#addHtmlButton",this.root).click(function(){
     	      	      var opt={
            	          type:"html",
            	          title:"说明",
            	          mode:"create"
            	      }    	
            	      me.appendModule(opt);
     	      	  }) 
     	      	  
     	      	  $("#addPictureButton",this.root).click(function(){
     	      	      var opt={
            	          type:"picture_list",
            	          title:"图片",
            	          mode:"create"
            	      }    	
            	      me.appendModule(opt);
     	      	  }) 
     	      	  
     	      	  $("#addVedioButton",this.root).click(function(){
     	      	      var opt={
            	          type:"vedio",
            	          title:"视频",
            	          mode:"create"
            	      }    	
            	      me.appendModule(opt);
     	      	  }) 
     	          
     	          $("#titleDiv",this.root).prepend("<div type='title' style='margin-right:32px;'>"+(options.type==1?"新建工作情况":"新建研判情况")+"</div>")
        	  }
     	      
     	      
     	      
     	      if(options.departmentName){
     	      	  var date=new Date(parseInt(options.date));
     	      	  var ds=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
     	      	  $("#titleDiv",this.root).append(
     	      	      "<div type='title' style='margin-right:32px;font-size:14px;font-weight:normal'>上传人员："+options.departmentName+"-"+options.userName+"</div>"
     	      	     +"<div type='title' style='font-size:14px;font-weight:normal'>"+ds+"</div>"
     	      	  );	
     	      }     	      
     	      
        	  this.pane=new Pane({
        	  	  root:this.root,
        	  	  container:(options.container || $(document.body))
        	  });	        
        	  
        	
        	  if(options.css){
        	      this.root.css(options.css);	
        	  }
        	  
        	  if(options.id){
        	     this.root.attr("id","UnitPane_"+options.id);
        	     if(options.items){
        	         $.each(options.items,function(){
        	         	   var opt=this;
        	         	   opt.container=$("#contentDiv",me.root);         
        	         	   opt.mode="display";
        	         	   $.each(Modules,function(){
    	 	               	  if(this.type==opt.type){
    	                        new this.module(opt);
    	                        return;
    	                    }	
    	 	               })
        	         })	
        	     }
        	  }else{
        	  	 $("#titleDiv",this.root).css("background-color","#069");
        	  }
        	  
            $("#titleDiv",this.root).css({"background-color":"#069"});
        }
        
        this.create=function(){
        	  var para={RequestFlag:"createUnit",type:options.type,parent:global_entity_id,catagory:options.catagory};
        	  var title=$("#UnitTitleInput",this.root).val();
        	  if(title){
        	      para.title=title;	
        	  }
        	  
        	  var items=[];
        	  $.each(this.modules,function(){
        	      if(this.valid()){
    	 	   	   	    if(this.val()){
    	 	   	   	    	   var item={
    	 	              	     type:this.getOption("type"),
    	 	              	     title:this.getOption("title"),
    	 	              	     valuetype:this.getOption("valuetype")
    	 	                }
    	 	                if(item.valuetype=="json"  || item.valuetype=="array"){
    	 	                    item.value=JSON.stringify(this.val());	
    	 	                }else{
    	 	                	   item.value=this.val();	
    	 	                }
    	 	                items.push(item);
    	 	            }  
    	 	        }else{
    	 	        	   error++;
    	 	        }	
        	  })
        	  
        	  if(items.length>0){
        	      para.items=JSON.stringify(items);	
        	  }
        	  
        	  
        	  
        	  $.ajax({
    	 	    	type: "POST",
              dataType: "json",
              url:"/UnitSession",
              data: para,
            }).done(function(res){  
            	  if(res.id){
            	  	  me.id=res.id;
            	  	  window.location.reload();
            	  }else{
            	      alert(res.Failure);	
            	  }
            });
        }
        
        this.appendModule = function(opt){
        	 opt.container=$("#contentDiv",this.root);
    	 	   $.each(Modules,function(){
    	 	   	  if(this.type==opt.type){
    	            me.modules.push(new this.module(opt));
    	            return true;
    	        }	
    	 	   })
    	 	   return false;
    	  }
        
        this.init();
    }   
});