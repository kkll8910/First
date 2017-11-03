requirejs.config({
	  baseUrl: '/js',
    paths : {
      jquery : "jquery-2.1.4.min",
      jqMobile:['mobile/jquery.mobile-1.4.5.min']
    },
    
    shim:{
    	  "jqMobile":{ deps: [ 'jquery' ] }
    }
});

requirejs(["jqMobile"],function() {
	 $(document).ready(function(){    
	 	   $(window).resize(function(){
       	   window.wdk.Observer.publish("window/resize");
       })
    	 
    	 window.wdk.Observer.subscribe("window/resize",function(){
          $("#ReviewsContainer").height($(window).height()-$("#footer").height()-80);
          $("#currentDiv").height($(window).height()-$("#toolbarDiv").height()-100);
          
       });
       
       
       var ReviewItem=function(options){
       	  var me=this;
       	  this.root=$('<li id="'+options.documentID+'" unionID="'+options.unionID+'"><a href="#"><img src="'+options.thumbnail+'" width="60px" height="60px">'+options.title+'</a></li>');
    	     this.root.click(function(){
    	     	  $("#thumbnailContainer").empty();
    	     	  $("#thumbnailContainer").append($("<img src='"+options.thumbnail+"' width='60' height='60'/>"));
    	     	  $("#thumbnailViewImg").attr("src",options.thumbnail);
    	     	  
    	     	  $("#titleContainer").html(options.title);
    	     	  $("#currentDiv").html(options.body);
    	     	  CurrentDocument=$(this);
    	     })
    	     
    	     $("#ReviewListDiv").append(this.root);
    	     $("#ReviewListDiv").listview("refresh");
       }
    	 
    	 var CurrentDocument=null;
    	 function nextReview(){
    	 	   if(!CurrentDocument){ 
    	         if($("#ReviewListDiv").children().length>0){
    	         	  CurrentDocument=$($("#ReviewListDiv").children()[0]); 	
    	            CurrentDocument.click();
    	         }else{
    	         	  $("#thumbnailContainer").empty();
    	         	  $("#titleContainer").html("");
    	         	  $("#currentDiv").html("");
    	            getReviewList();   	
    	         }	
    	     }else{
    	         if(CurrentDocument.next().length>0){
    	             var temp=CurrentDocument;
    	             CurrentDocument=CurrentDocument.next();
    	             CurrentDocument.click();
    	             temp.remove();
    	         }else{
    	         	   CurrentDocument.remove();
    	         	   CurrentDocument=null;
    	         	   nextReview();
    	         }	
    	     }	
    	 }
    	 
    	 $(".setReviewButton").click(function(){
    	 	   if(!CurrentDocument){return;}
    	 	   $.ajax({
                	type: "POST",
                  dataType: "json",
                  url:"/management/setReview",
                  data: {DocumentID:CurrentDocument.attr("id"),unionID:CurrentDocument.attr("unionID"),State:$(this).attr("state")},
                  success: function(data){
                  	  if(data.Success){
                  	      nextReview();	
                  	  }else{
                  	      alert("审核时出现错误。稍后请重试！")	
                  	  }
    	            }
           });    	     
    	 })    	 
    	 
    	 var lastTime=0;
    	 function getReviewList(){
    	 	   $.ajax({
                	type: "POST",
                  dataType: "json",
                  url:"/management/getReviewList",
                  data: {Time:lastTime},
                  success: function(data){
                  	  if(data && data.Result){
                  	  	  lastTime=data.Result.LastTime;
                  	      $.each(data.Result.ReviewList,function(){
                  	      	  new ReviewItem(this);
                  	      })
                  	      nextReview();
                  	  }else{
                  	  	  setTimeout(getReviewList,5000);
                  	  }
    	            },
    	            error:function(){
    	            	  setTimeout(getReviewList,5000);
    	            }
           });
    	 }
    	 
    	 getReviewList();
    	 window.wdk.Observer.publish("window/resize");
   }) 
}); 