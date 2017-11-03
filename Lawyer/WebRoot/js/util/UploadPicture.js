 define(["Popup","css!util/css/UploadPicture.css"],function(Popup) {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  options.UploadURL=options.UploadURL || "/UploadSession"
     	  
     	  this.init=function(){
     	      this._root=$(
     	                  "<div class='uploader_container'>"
                       +"    <div class='uploader_preview'>点此选择图片</div>"
                       +"    <div  class='uploader_discription'>"
                       +"        <div class='upload_input_container'>"
                       +"            <div class='upload_input_title'>拍摄时间：</div>"
                       +"            <input type='text' value='' class='upload_input' id='input_date'>"
                       +"        </div>"
                       +"        <div class='upload_input_container'>"
                       +"            <div class='upload_input_title'>拍摄地点：</div>"
                       +"            <input type='text' value=''  class='upload_input' id='input_address'>"
                       +"        </div>"
                       +"        <div class='upload_input_container'>"
                       +"            <div  class='upload_input_title'>简要描述：</div>"
                       +"            <textarea class='upload_input' id='input_discription' style='height:100px;'></textarea>"
                       +"        </div>"
                       +"    </div>"
                       +"    <form id='multiForm' enctype='multipart/form-data' style='display:none'>"
                       +"        <input type='file' id='fileInput' name='file' accept='image/*' />"  
                       +"    </form>"
                       +'</div>'
            );
            
            $(".uploader_preview",this._root).click(function(){
            	  $("#fileInput",me._root).click();
            })
            
            $("#fileInput",this._root).change(function(){
        	  	   if(this.files.length){
        	  	   	   var preview=$(".uploader_preview",me._root);
        	  	   	   var file=this.files[0];
        	  	   	   preview.empty();   
                     var reader = new FileReader();
        	  	       reader.readAsDataURL(file);
        	  	       reader.onload=function(){
        	  	       	   var img=$("<img src='"+this.result+"' height='240'>");
        	  	       	   preview.append(img);
        	  	       };
        	  	   }
        	  })
            
            this.popup=new Popup({
 	     	        title:"上传照片",
 	     	        width:620,
 	     	        height:440,
 	     	        content:this._root,
 	     	        buttons:[
 	     	            {title:"上传图片",handler:function(){
 	     	                me.upload();	
 	     	            }}
 	     	        ]
 	     	    })
        }        
        
        this.upload=function(){
        	  var fileInput=$("#fileInput",this._root);
        	  if(fileInput[0].files.length<=0){
                return;	
            }else{
            	  var form=$("form",this._root)[0];
            	  var formdata = new FormData(form);
            	  formdata.append("type",options.type)
            	  $.ajax({
                  dataType: "json",
                  type:"post",
                  data:formdata,   
                  url: options.UploadURL,
                  cache: false,
                  processData: false,
                  contentType: false
                }).done(function(res){  
                	  if(res.URL){
                	  	      fileInput.val("")
                	  	      $(".uploader_preview",me._root).html("点此选择图片");
                	  	      var result={url:res.URL}
                	  	      
                	  	      if($("#input_address",me._root).val()){
                	  	          result.address=$("#input_address",me._root).val();	
                	  	      }
                	  	      
                	  	      if($("#input_date",me._root).val()){
                	  	          result.date=$("#input_date",me._root).val();	
                	  	      }
                	  	      
                	  	      if($("#input_discription",me._root).val()){
                	  	          result.discription=$("#input_discription",me._root).val();	
                	  	      }
                	  	      $(".upload_input",me._root).val("")
                	  	      
                	  	      if(options.handler){
                	  	      	  options.handler.call(result)
                	  	      }
                	  	      me.popup.hide();
                	  }else{
                	  	  alert("上传失败，稍后请重试！")
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