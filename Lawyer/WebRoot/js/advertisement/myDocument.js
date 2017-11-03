requirejs.config({
	  baseUrl: '/js',
    paths : {
      jquery : "jquery-2.1.4.min",
      jqMobile:['mobile/jquery.mobile-1.4.5.min'],
      qrcode:["qrcode.min"],
      Cities:"wdk/city/Cities",
      CityPickerMulti:"wdk/city/CityPickerMultiIner"
    },
    
    shim:{
    	  "jqMobile":{ deps: [ 'jquery' ] },
    	  "qrcode":{ deps: [ 'jquery' ] },
    	  CityPickerMulti:["jquery","Cities"]
    }
});

requirejs(["CityPickerMulti","Cities","jqMobile","qrcode"
],function(CityPickerMulti,Cities) {
	 $(document).ready(function(){    
	 	   var setReviewState=function(){
	 	   	    var doc=window.parent.getDocument(DocumentID);
	 	   	    if(doc.review=="pass"){
	 	   	    	  $("#msgTxtDiv").html("文档已通过审核，现在可以开始发布了");
	 	   	    }else if(doc.review=="reject"){
	 	   	    	  $("#msgTxtDiv").html("文档内容不符合规定，审核未通过，请修改您的文档。");
	 	   	    }else{
	 	   	    	  $("#msgTxtDiv").html("我们的工作人员正在对该文档进行审核，请稍候...");
	 	   	    }
	 	   }
	 	   
	 	   $("#modifyDocumentButton").click(function(){
	 	   	   window.location.href="/advertisement/modifyDocument.jsp?DocumentID="+DocumentID;
	 	   });
	 	   
	 	   $("#canclePublish").click(function(){
	 	       $("#createPublishPopup").popup("close");	
	 	   })
	 	   
	 	   $("#saveDocumentButton").click(function(){
	 	   	   $("#createPublishPopup").popup("open");
	 	   })
	 	   
	 	   $("#previewButton").click(function(){
	 	       $("#previewPopup").popup("open");	
	 	       
	 	   })
	 	   
	 	   $("#input_Nmuber").change(function(){
	 	   	   $("#hit_Number").html("价格为"+price/100+"次/元，"+this.value+"次共需支付人民币"+this.value*price/100+"元");
	 	   })
	 	   $("[cities]").each(function(){
	 	       var cts=$(this).attr("cities");
	 	       var cities=cts.split(",");
	 	       $(this).append($("<span style='color:#006699'>发布到：<span>"));
	 	       for(var i=0;i<cities.length;i++){
	 	           var city=Cities.getCityById(cities[i]);
	 	           $(this).append($("<span  style='margin-right:8px;'>"+city.name+"<span>"));    
	 	       }	
	 	   })
	 	   
	 	   var multiCityPicker=new CityPickerMulti({container:$("#CityPickerMultiIner"),ReferenceDom:$("#publish_cities")});	
	 	   
	 	   
	 	   $("#publishButton").click(function(){
       	   var obj={
       	   	   Number:$("#input_Nmuber").val(),
       	   	   Cities:multiCityPicker.value(),
       	   	   DocumentID:DocumentID
       	   }
       	   
       	   
       	   var error=0;
       	   if(!obj.Number || isNaN(obj.Number)){
       	   	   setHitMessage("hit_Number","请输入发布次数。");
       	       error++;
       	   }else if(obj.Number<minNumber){
       	   	   setHitMessage("hit_Number","发布的次数不能少于"+minNumber+"次。");
       	       error++;
       	   }else{
       	   	   setHitMessage("hit_Number");
       	   }       	   
       	   
       	   
       	   
       	   if(error>0){
       	   	   window.wdk.popup({
       	   	   	   title:"warning",
       	           text:"您输入的发布次数错误，请根据提示更正"
       	       });
       	       return;	
       	   }
       	   
       	   
       	   $.ajax({
            	type: "POST",
              dataType: "json",
              url:"/advertisement/createPublish",
              data: obj,
              success: function(data){
              	  if(data.PublishID){
              	  	 window.location.reload();  	  	  
              	  }else if(data.Failure){
              	  	 if(data.Failure=="RMBIsNotEnougn"){
              	  	   alert("您账户的余额不足，请充值。")
       	             }else if(data.Failure=="WaitingReview"){
       	             	 alert("文档正在审核当中，暂时不能发布。")
              	  	 }  
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
       
       function appendPublishToList(options){
       	
       }
	 	   
	 	   function init(){
	 	   	  setReviewState();	 	   	  
	 	   	  $("#previewDiv").qrcode({ 
              render: "canvas", //canvas、table
              width: 240, 
              height:240, 
              text: "http://www.baidu.com"
          }); 
	 	   }	
    	 init();
   }) 
}); 