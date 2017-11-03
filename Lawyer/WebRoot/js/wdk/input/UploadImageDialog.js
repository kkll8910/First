define(["css!wdk/input/css/UploadImageDialog.css"],function() {
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  this.maxSize=options.max || 5*1024*1024;
        this.UploadURL=options.url || "/UploadPicture";
        
        
        this.init=function(){   
        	  this.root=$('<div data-role="popup" data-overlay-theme="b" data-theme="b" data-dismissible="true">'
                       +'    <h4>请选择要上传的图片</h4>'
                       +"	   <div class='uploader_thumbnail'></div>"
                       +"    <div class='uploader_buttons'>"
                       +"        <div class='uploader_file'>"
                       +"             选择文件"
                       +"             <form enctype='multipart/form-data'>"
                       +"                 <input type='file' name='picture' accept='image/png,image/gif,image/jpeg' />"  
                       +"             </form>"
                       +"        </div>"
                       +"        <div id='uploadBtn' class='uploader_button'>上传文件</div>"
                       +"    </div>"
                       +'</div>');
            
        	  this.root.popup();
        	  
        	  
        	  $("input",this.root).change(function(){
        	  	   if(this.files.length){
        	  	   	   var file=this.files[0];
        	  	   	   if(file.size>me.maxSize){
        	  	   	       $(".uploader_thumbnail",me.root).empty();  
        	  	   	       me.showError("您选择的文件大小超过"+(me.maxSize/1024)+"k，请重新选择");
        	  	   	       $("#uploadBtn",me.root).hide();     
        	  	   	       return;		
        	  	   	   }
        	  	   	   
        	  	   	   $(".uploader_thumbnail",me.root).empty();   
                     var reader = new FileReader();
        	  	       reader.readAsDataURL(file);
        	  	       reader.onload=function(){
        	  	       	    $(".uploader_message",me.root).fadeOut();     
        	  	       	    $(".uploader_thumbnail",me.root).append($("<img src='"+this.result+"'>"));
        	  	            $("#uploadBtn",me.root).show();     
        	  	       };
        	  	   }
        	  })
        	  
            $("#uploadBtn",this.root).click(function(){
            	  if($("input",me.root)[0].files.length<=0){
            	      return;	
            	  }else{
            	  	  var formdata = new FormData(me.root.find("form")[0]);
            	  	  formdata.append("type",options.type)
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
                    	  	      $("input",me.root).val("")
                    	  	      $(".uploader_thumbnail",me.root).empty();
                    	  	      $("#uploadBtn",me.root).hide();
                    	  	          
                    	  	      if(options.handler){
                    	  	      	  options.handler(res.Result.URL)
                    	  	      }
                                
                                if(!options.multi){
                    	  	      	 me.root.popup("close");
                    	  	      }	
                    	  	  }
                    	  }else if(res.Failure){
                    	  	  me.showError(res.Failure)
                    	  }
                    });
            	  }
            })
        }
        
        
        this.showError=function(error){
        	  $(".uploader_thumbnail",me.root).append($("<div class='uploader_message'>"+error+"</div>"))
        }
        
        this.show=function(){
        	  this.root.popup("open");
        }
       
        this.init();
    }   
});