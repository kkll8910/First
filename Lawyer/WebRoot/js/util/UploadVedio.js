 define(["Popup","css!util/css/UploadPicture.css"],function(Popup) {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  options.UploadURL=options.UploadURL || "/UploadVedio"
     	  
     	  this.init=function(){
     	      this._root=$(
     	                  "<div class='uploader_container'>"
                       +"    <div  class='uploader_discription'>"
                       +"        <div class='upload_input_container'>"
                       +"            <div class='upload_input_title'>视频文件：</div>"
                       +"            <form id='multiForm' enctype='multipart/form-data' style='display:block;float:left;'>"
                       +"                <input type='file' id='fileInput' name='video'/>"  
                       +"            </form>"
                       +"        </div>"
                       +"        <div class='upload_input_container'>"
                       +"            <div class='upload_input_title'>拍摄时间：</div>"
                       +"            <input type='text' value='' class='upload_input' id='input_date'>"
                       +"        </div>"
                       
                       +"        <div class='upload_input_container'>"
                       +"            <div class='upload_input_title'>监控校时：</div>"
                       +"            <input type='text' value='' class='upload_input' id='input_delay'>"
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
                       
                       +'</div>'
            );
            
            $(".uploader_preview",this._root).click(function(){
            	  $("#fileInput",me._root).click();
            })
            
            this.popup=new Popup({
 	     	        title:"上传视频",
 	     	        width:620,
 	     	        height:260,
 	     	        content:this._root,
 	     	        buttons:[
 	     	            {title:"上传视频",handler:function(){
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
                  timeout:1200000,  
                  url: options.UploadURL,
                  cache: false,
                  processData: false,
                  contentType: false,
                  success: function(res){
                	  if(res.OriginalUrl){
                	  	      alert("该视频正在进行转码操作,需要几分钟的时间，视频会显示无法加载等属正常，你可以继续任何操作。")
                	  	
                	  	      fileInput.val("")
                	  	      
                	  	      var result={Encoding:true,OriginalUrl:res.OriginalUrl,EncodeUrl:res.EncodeUrl}
                	  	      
                	  	      if($("#input_address",me._root).val()){
                	  	          result.address=$("#input_address",me._root).val();	
                	  	      }
                	  	      
                	  	      if($("#input_date",me._root).val()){
                	  	          result.date=$("#input_date",me._root).val();	
                	  	      }
                	  	      
                	  	      if($("#input_delay",me._root).val()){
                	  	          result.delay=$("#input_delay",me._root).val();	
                	  	      }
                	  	      
                	  	      
                	  	      if($("#input_discription",me._root).val()){
                	  	          result.discription=$("#input_discription",me._root).val();	
                	  	      }
                	  	      $(".upload_input",me._root).val("")
                	  	      
                	  	      me.popup.hide();
                	  	      if(options.handler){
                	  	      	  options.handler.call(result)
                	  	      }
                	  	      
                	  }else{
                	  	  alert("上传失败，稍后请重试！"+JSON.stringify(res))
                	  }
                  },
                  error:function(XMLHttpRequest, textStatus, errorThrown) {
                   alert(XMLHttpRequest.status);
                   alert(XMLHttpRequest.readyState);
                   alert(textStatus);
                  }
                })
            }
        }
        
        
        this.show=function(){
            this.popup.show();
        }	
        this.init();
    }   
});