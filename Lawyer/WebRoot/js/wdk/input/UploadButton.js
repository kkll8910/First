﻿define([],function() {
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  this.maxSize=options.max || 5*1024*1024;
        this.UploadURL=options.url || "/UploadPicture";
        
        
        this.init=function(){   
        	  this.form=$("<form enctype='multipart/form-data'><input type='file' name='picture' accept='image/png,image/gif,image/jpeg' /></form>");
            options.button.click(function(){
                $("input",me.form).click();	
            })
        	  
        	  $("input",this.form).change(function(){
        	  	   
        	  	   if(this.files.length){
        	  	   	   var file=this.files[0];
        	  	   	   if(file.size>me.maxSize){
        	  	   	       window.wdk.popup({
       	   	   	            title:"提示",
       	   	   	            text:"您选择的文件大小超过"+(me.maxSize/1024)+"k，请重新选择."
       	   	             })		
        	  	   	       return;		
        	  	   	   }
        	  	   	   
        	  	   	   window.wdk.popup({
       	   	   	            title:"操作中",
       	   	   	            dismissible:false,
       	   	   	            text:"文件正在上传，请稍后..."
       	   	         })	
        	  	   	   
        	  	   	   var formdata = new FormData(me.form[0]);
            	  	   //formdata.append("type",options.type)
            	  	   $.ajax({
                       dataType: "json",
                       type:"post",
                       data:formdata,   
                       url: me.UploadURL,
                       cache: false,
                       processData: false,
                       contentType: false
                     }).done(function(res){  
                     	  if(res.Result){
                     	  	  if(res.Result.URL){
                     	  	      if(options.handler){
                     	  	      	  options.handler(res.Result.URL)
                     	  	      }
                     	  	       window.wdk.popup("close");	
                     	  	  }
                     	  }else if(res.Failure){
                     	  	  window.wdk.popup({
       	   	   	               dismissible:true,
       	   	   	               text:"上传失败，稍后请重试"
       	   	                })	
                     	  }
                     });
        	  	   }
        	  })
        	  
        	  $(document.body).append(this.form);
        }
       
        this.init();
    }   
});