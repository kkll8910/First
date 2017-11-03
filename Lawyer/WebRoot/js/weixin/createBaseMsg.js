requirejs.config({
	  baseUrl: '/js',
    paths : {
      jquery : "jquery-2.1.4.min",
      jqMobile:['mobile/jquery.mobile-1.4.5.min'],
      
      Cities:"wdk/city/Cities",
      CitySelector:"wdk/city/CitySelector",
      
      SelectImageDialog:"wdk/input/SelectImageDialog",
      UploadImageDialog:"wdk/input/UploadImageDialog"
    },
    
    shim:{
    	  "jqMobile":{ deps: [ 'jquery' ] },
        "SelectImageDialog":["jquery","jqMobile"],
        "UploadImageDialog":["jquery","jqMobile"]
    }
});

requirejs(["Cities","CitySelector","SelectImageDialog","UploadImageDialog","jqMobile"],function(Cities,CitySelector,SelectImageDialog,UploadImageDialog) {
	 $(document).ready(function(){    
	 	   
	 	   var cs=new CitySelector({
	 	   	    provinceSelector:$("#provinceSelector"),
	 	   	    citySelector:$("#citySelector"),
	 	   	    countySelector:$("#countySelector")
	 	   })
	 	   
	 	   
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
	 	   
       $("#saveButton").click(function(){
       	   var para={
       	       WeixinQr:$("#img_Thumbnail").attr("src"),
       	       WeixinID:$("#WeixinID").val()	
       	   }
       	   
       	   var err=0;
       	   if(!para.WeixinID){
       	   	   setHitMessage("hit_weixinID","请输入您的微信号");
       	       err++;
       	   }else{
       	   	   setHitMessage("hit_weixinID");	
       	   }
       	   
       	   if(!para.WeixinQr){
       	   	   setHitMessage("hit_weixinQR","请设置您的微信二维码");
       	   	   err++	
       	   }else{
       	   	   setHitMessage("hit_weixinQR");	
       	   }
       	   
       	   if(err>0){
       	   	   return;	
       	   }
       	   
       	   $.ajax({
            	type: "POST",
              dataType: "json",
              url:"/registeWeixinIDAndQr",
              data: para,
              success: function(data){
              	  if(data.Success){
              	      location.href="/createUnit.jsp?Type"+window.unitType;	
              	  }else{
              	      window.wdk.popup({
       	   	   	          title:"操作失败",
       	   	   	          text:"稍后请重试，或者刷新本页面。"
       	   	          })		
              	  }
    	        }
           });
       });
       
       
       function init(){
       	
       }
       init();
    	
   }) 
}); 