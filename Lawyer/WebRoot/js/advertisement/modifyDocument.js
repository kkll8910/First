requirejs.config({
	  baseUrl: '/js',
    paths : {
      jquery : "jquery-2.1.4.min",
      jqMobile:['mobile/jquery.mobile-1.4.5.min'],
      
      kindeditor:"kindeditor/kindeditor-all-min",
      zh_lang:"kindeditor/lang/zh-CN",
      
      SelectImageDialog:"wdk/input/SelectImageDialog",
      UploadImageDialog:"wdk/input/UploadImageDialog"
    },
    
    shim:{
    	  "jqMobile":{ deps: [ 'jquery' ] },
        "zh_lang":["kindeditor"],
        SelectImageDialog:["jquery","jqMobile"]
    }
});

requirejs(["SelectImageDialog",
           "UploadImageDialog",
           "jqMobile",
           "kindeditor",
           "zh_lang"
],function(SelectImageDialog,UploadImageDialog,Cities,CityPickerMulti) {
	 $(document).ready(function(){    
	 	   $(window).resize(function(){
       	   window.wdk.Observer.publish("window/resize");
       })
    	 
    	 window.wdk.Observer.subscribe("window/resize",function(){
          $("#mainDiv").height($(window).height()-$("#footer").height()-10);
       });
       
	 	   var editor = KindEditor.create('#editor_id',{
               minWidth : '450px',
               width : '450px',
               height : "800px",
               items : [
                       'source', 'undo', 'redo', 'preview', 'template', '|', 'cut', 'copy', 'paste',
                       'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                       'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                       'superscript', 'clearhtml', 'quickformat', 'selectall', '|',
                       'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                       'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'table', 'hr', 'baidumap', 
                       'anchor', 'link', 'unlink'
               ]
       });
	 	   
       
       //---------------------------------------------------------------------------------------------------------------------
       $("#button_UploadPic").click(function(){
       	   var uploader=new UploadImageDialog({
           	  handler:function(url){
           	  	  KindEditor.insertHtml('#editor_id', "<img src='"+url+"' width='100%'/>");
           	  }
           });
           uploader.show();
       });
      
       var selectPicDialog=null;
       $("#button_SelectPic").click(function(){
       	  if(!selectPicDialog){
       	   	  selectPicDialog=new SelectImageDialog({
       	          selectHandler:function(url){
               	  	  KindEditor.insertHtml('#editor_id', "<img src='"+url+"' width='100%' style='margin:4px'/>");
               	  }
       	      });
       	  } 
       	  selectPicDialog.show();
       });
       
       $("#thumbnailList").click(function(){
       	      var selectPic=new SelectImageDialog({
       	          handler:function(url){
       	          	  $("#thumbnailList").html("");
               	  	  $("#thumbnailList").append("<img src='"+url+"' class='thumbnail'/>");
               	  }
       	      });
       });
       
       $("#button_Video").click(function(){
       	    var v=$("#text-vedio").val();
       	    if(v){
       	    	editor.insertHtml(v);
       	    	$("#text-vedio").val("")
       	    }  
       });
       
       $("#button_URLImage").click(function(){
       	    var url=$("#text-urlimage").val();
       	    if(url){
       	    	editor.insertHtml("<img src='"+url+"' width='100%' style='margin:4px'/>");
       	    	$("#text-urlimage").val("");
       	    }  
       });
       
       
       $("#saveDocumentButton").click(function(){
       	   var doc={
       	   	   DocumentID:window.DocumentID,
       	   	   title:$("#input_Title").val(),
       	   	   thumbnail:$("#img_Thumbnail").attr("src"),
       	   	   body:editor.html()
       	   }
       	   
       	   
       	   var error=0;
       	   if(!doc.title){
       	       setHitMessage("hit_Title","请输入文档的标题");
       	       error++;
       	   }else{
       	   	   setHitMessage("hit_Title");
       	   }
       	   
       	   if(!doc.thumbnail){
       	       setHitMessage("hit_Thumbnail","请设置文档的缩略图");
       	       error++;
       	   }else{
       	   	   setHitMessage("hit_Thumbnail");
       	   }
       	   
       	   
       	   if(doc.body){
       	       setHitMessage("hit_Body"); 	
       	   }else{
       	   	   setHitMessage("hit_Body","请输入正文");
       	       error++;
       	   }
       	   
       	   if(error>0){
       	   	   window.wdk.popup({
       	   	   	   title:"warning",
       	           text:"您的输入项中有"+error+"处错误，请根据提示更正"
       	       });
       	       return;	
       	   }
       	   
       	   
       	   $.ajax({
            	type: "POST",
              dataType: "json",
              url:"/advertisement/modifyDocument",
              data: doc,
              success: function(data){
              	 
              	  if(data.Success){
              	  	  window.location.href="/advertisement/myDocument.jsp?DocumentID="+window.DocumentID;
              	  }else if(data.TitleError){
              	  	 window.wdk.popup({
       	                 title:"warning",
       	                 text:"标题中包含以下不允许出现的字词："+data.TitleError+",请更正。"
       	             })
              	  }else if(data.BodyError){
              	  	 window.wdk.popup({
       	                 title:"warning",
       	                 text:"正文中包含以下不允许出现的字词："+data.BodyError+",请更正。"
       	             })
              	  }else{
              	  	  window.wdk.popup({
       	                  title:"warning",
       	                  text:"系统繁忙，稍后请重试！"
       	              })
              	  }
    	        }
           });
       });
       
       
       
       function setHitMessage(id,message){
       	  var obj=$("#"+id);
       	  if(message){
       	     obj.css("color","#FF0000");
       	     obj.html("<img src='/images/icon_error.png' align='top'>"+message);
       	  }else{
       	  	 obj.css("color","#ababab");
       	     obj.html("<img src='/images/icon_correct.png'  align='top'>");
       	  }
       }
       
       function setThumbnail(url){
       	  var img=$("<img src='"+url+"' width='80' height='80' id='img_Thumbnail'>");
       	  $("#thumbnailDiv").empty();
       	  $("#thumbnailDiv").append(img)
       }
       
       $("#imageURLButton").click(function(){
       	   var url=$("#imageInput").val();
       	   if(url){
       	   	  setThumbnail(url)
       	   }
       })
       
       $("#uploadPicForThumButton").click(function(){
       	   var uploader=new UploadImageDialog({
           	  handler:function(url){
           	  	  setThumbnail(url)
           	  }
           });
           uploader.show();
       });
       
       var selectPicForThumDialog=null;
       $("#selectPicForThumButton").click(function(e){
       	  if(!selectPicForThumDialog){
       	   	  selectPicForThumDialog=new SelectImageDialog({
       	   	  	  single:true,
       	          selectHandler:function(url){
               	  	 setThumbnail(url);
               	  }
       	      });
       	  } 
       	  selectPicForThumDialog.show();
       });
      
       
    	 function init(){
	 	   	 
	 	   }	
    	 init();
    	 window.wdk.Observer.publish("window/resize");
   }) 
}); 