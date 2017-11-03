requirejs.config({
	  baseUrl: '/js',
    paths : {
      jquery : "jquery-2.1.4.min",
      jqMobile:['mobile/jquery.mobile-1.4.5.min'],
      
      SelectImageDialog:"wdk/input/SelectImageDialog",
      UploadButton:"wdk/input/UploadButton"
    },
    
    shim:{
    	  "jqMobile":{ deps: [ 'jquery' ] },
        "SelectImageDialog":["jquery","jqMobile"],
        "UploadButton":["jquery"]
    }
});

requirejs(["SelectImageDialog",
           "UploadButton",
           "jqMobile"
],function(SelectImageDialog,UploadButton) {
	 $(document).ready(function(){    
	 	    new UploadButton({
	 	        button:$("#button_upload"),
	 	        handler:function(url){
	 	        	  setThumbnail(url);
	 	        }
	 	    })
	 	    
	 	    var selectPicForThumDialog=null;
        $("#button_select").click(function(e){
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
	 	    
	 	    
	 	    
	 	    function setThumbnail(url){
       	  var img=$("<img src='"+url+"' width='100' height='100' id='thumbnail'>");
       	  $("#Thumbnail_imageDiv").empty();
       	  $("#Thumbnail_imageDiv").append(img)
        }
        
        $("#saveButton").click(function(){
        	
       	   var uint={
       	   	   RequestFlag:"createUnit",
       	   	   type:window.unitType,
       	   	   name:$("#input_Name").val(),
       	   	   title:$("#input_Title").val(),
       	   	   keywords:$("#input_Keywords").val(),
       	   	   thumbnail:$("#thumbnail").attr("src"),
       	   	   discription:$("#textarea_description").val()
       	   }
       	   
       	   var error="";
       	   if(!uint.name){
       	       error+="<p>请输入角色名称<p>";
       	   }
       	   
       	   if(!uint.title){
       	       error+="<p>请输入个性签名</p>";
       	   }
       	   
       	   
       	   if(error!=""){
       	   	   window.wdk.popup({
       	   	   	  title:"提示",
       	   	   	  text:error
       	   	   })	
       	   	   return;	
       	   }
       	   
       	   
       	   $.ajax({
            	type: "POST",
              dataType: "json",
              url:"/UnitSession",
              data: uint,
              success: function(data){
              	  if(data.Failure){
              	  	  if(data.Failure=="RequiredLog"){
              	  	  	  window.parent.reLogin();
              	  	  }else if(data.Failure=="DataBase"){
              	  	  	  window.wdk.popup({
       	   	   	             title:"操作失败",
       	   	   	             text:"稍后请重试，或者刷新本页面。"
       	   	              })		
              	  	  }              	  	  
              	  }else if(data.Forbidden){
              	  	  var forbidden="";
              	  	  if(data.Forbidden.Name){
              	  	  	  forbidden+="<p>名称："+data.Forbidden.Name+"</p>";
              	  	  }
              	  	  
              	  	  if(data.Forbidden.Title){
              	  	  	  forbidden+="<p>标题："+data.Forbidden.Title+"</p>";
              	  	  }
              	  	  
              	  	  if(data.Forbidden.Keywords){
              	  	  	  forbidden+="<p>标签："+data.Forbidden.Keywords+"</p>";
              	  	  }
              	  	  
              	  	  if(data.Forbidden.Discription){
              	  	  	  forbidden+="<p>详细描述："+data.Forbidden.Discription+"</p>";
              	  	  }
              	  	  
              	  	  window.wdk.popup({
       	   	   	         title:"以下字、词不允许出现，请更正",
       	   	   	         text:forbidden
       	   	          })		
              	  }else if(data.ID){
              	  	  window.location.href="/weixin/myUnit.jsp?UnitID="+data.ID;
              	  }
    	        }
           });
       });
       
   }) 
}); 