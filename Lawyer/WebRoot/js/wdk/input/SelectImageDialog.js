define(["css!wdk/input/css/SelectImageDialog.css"],function() {
      
    return function(options){
    	  var me=this;
     	  options=options || {};
        
        this.init=function(){
        	  this.root=$('<div data-role="popup" data-overlay-theme="b" data-theme="b" data-dismissible="true">'
                       +'    <h4>请选择图片</h4>'
                       +'   <div class="PictureSelector_list" data-theme="a"></div>'
                       +'</div>');
            
        	  this.root.popup();
        	  this.root.width($(window).width()-20)
        	  
        }
        
        this._getImageList=function(){
        	  $.ajax({
              dataType: "json",
              type:"post",
              data:{RequestFlag:"FileManage_getList",type:options.type},
              url: options.url || "/privateDirSession",
              success: function(data){
              	if(data.pictures){
            	  	  $.each(data.pictures, function(i,pict) {
            	  	  	  
            	  	  	  var isExist=false;
            	  	  	  $("img",me.root).each(function(){
            	  	  	  	  if($(this).attr("src")==pict.url){
            	  	  	  	  	  isExist=true;
            	  	  	  	  	  return;
            	  	  	  	  }
            	  	  	  })
            	  	  	  
            	  	  	  
            	  	  	  if(isExist==false){
                            var thumbnail=$("<div class='PictureSelector_thumbnail'><img src='"+pict.url+"'></div>");
                            thumbnail.click(function(){
                            	 if($(this).hasClass("PictureSelector_selected")){
                            	 	   $(this).removeClass("PictureSelector_selected");	
                            	 	   if(options.unSelectHandler){
                            	 	   	  options.unSelectHandler(url);
                            	 	   }
                            	 }else{                        	 	
                            	     var url=$(this).find("img").attr("src");
                            	     if(options.selectHandler){
                                       options.selectHandler(url);
                                   }
                                   
                            	     if(options.single){
                                      me.root.popup("close");
                                   }else{
                                      $(this).addClass("PictureSelector_selected");		
                                   }
                            	 }
                            })
                            $(".PictureSelector_list",me.root).append(thumbnail);      
                        }  	  
                    });
            	  }
    	        }
            })
        }
        
        this.show=function(){
        	  this._getImageList();
        	  this.root.popup("open");
        }
       
        this.init();
    }   
});