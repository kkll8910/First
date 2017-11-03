 define(["Pane","css!util/css/Showcase.css"],function(Pane) {
       
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  this.last=null;
     	  this.first=null;
     	  this.step=options.step || 1;
     	  
        this.init=function(){
            this.root=$(
     	           "<div   theme='b' class='Showcase_container'>"
    	          +"	<div id='titleDiv'>"
    	          +"	  <div type='title'>"+options.title+"</div>"
    	          +"	  <div type='button' id='all'>查看全部</div>"
    	          
    	          +"	</div>"
  	            +"  <div id='contentDiv'><div class='Showcase_entity_list'></div>"
                +"</div>"
     	      );
     	      
     	      if(options.noList){
     	      	$("#all",this.root).remove();
     	      }
     	      
     	      if(options.container){
     	      	  options.container.append(this.root);
     	      }
     	      
     	      this.slide=$(".Showcase_entity_list",this.root);
     	      
     	      this.pane=new Pane({root:this.root});	
        	  this.pane.setTopDivCss({"background-color":"#069"});
        	  
        	  if(options.css){
        	  	  
        	      this.root.css(options.css)	;
        	  }
        	  
        	  $("#all",this.root).click(function(){
        	  	 
        	  	  window.parent.appendTab({
    	          	   title:options.title+"列表",
                     src:"entities.jsp?Catagory="+options.catagory,
                     closable:true,
                     selected:true,
                     id:"entities_"+options.catagory,
                     single:true
    	          })	
        	  })
        	  
        	  
        	  if(options.entities){
        	      $.each(options.entities,function(){
        	          me.appendEntity(this);	
        	      })
        	      
        	      this.next();
        	      
        	      if(options.entities.length>me.step){
        	          var intervalID=setInterval(function(){
        	          	 me.next();
        	          },options.interval);	
        	          
        	          
        	          var mTop=($("#contentDiv",me.root).height()+60-103)/2;
        	          
        	          var prevButton=$("<img style='display:none;position: absolute;left:0;top:"+mTop+"px;' src='/images/left.png'/>");
        	          prevButton.click(function(){
        	              me.preview();	
        	          });
        	          $("#contentDiv",me.root).append(prevButton);
        	          
        	          var nextButton=$("<img style='display:none;position: absolute;right:0px;top:"+mTop+"px;' src='/images/right.png'/>");
        	          nextButton.click(function(){
        	              me.next();	
        	          });
        	          $("#contentDiv",me.root).append(nextButton);
        	          
        	          
        	          $("#contentDiv",me.root).hover(
        	              function(){
        	              	 prevButton.show();
        	              	 nextButton.show();
        	              },
        	              function(){
        	              	 prevButton.hide();
        	              	 nextButton.hide();
        	              }
        	          )
        	      }
        	  }
        	  
        	  
        }
        
        this.preview=function(){
        	  if(!this.first){
        	      this.first=$(".Showcase_entity_show",this.root).first();	
        	  }
        	  $(".Showcase_entity_show",this.root).removeClass("Showcase_entity_show");
        	  
        	  for(var i=0;i<this.step;i++){
        	      this.first=this.first.prev();
        	      if(this.first.length<=0){
        	          this.first=this.slide.children().last();	
        	      }
        	      this.first.addClass("Showcase_entity_show");
        	  }
        }
        
        this.next=function(){
        	  $(".Showcase_entity_show",this.root).removeClass("Showcase_entity_show");
        	  
        	  for(var i=0;i<this.step;i++){
        	      if(!this.last){
        	          this.last=this.slide.children().first();	
        	      }else{
        	          this.last=this.last.next();
        	      }
        	      
        	      if(this.last.length<=0){
        	          this.last=this.slide.children().first();	
        	      }
        	      this.last.addClass("Showcase_entity_show");
        	  }
        }
        
        
        this.appendEntity=function(entity){
        	  
        	  var dom=$("<div class='Showcase_entity_container'></div>");
        	  dom.click(function(){
        	      if(options.handler){
        	         options.handler.call(entity); 	
        	      }	
        	  })
        	  dom.width(options.width);
        	  dom.height(options.height);
        	  //添加图片
        	  if(entity.picture){
        	  	  var img=$("<img src='"+entity.picture+"'>");
 	       	      img.load(function(){
 	       	      	  var width=this.width;
 	       	          var height=this.height;
 	       	          
 	       	          if(!(width<=options.width && height<=options.height)){
 	       	          	 if (options.width/options.height  <= width/height){
                            this.width = options.width;
                            this.height = options.width* (height /width);  
                       }else {
                           this.width = options.height  * (width/height);  
                           this.height = options.height;
                       }  
 	       	          }else{
 	       	          	 if(width<=options.width && height<=options.height){
 	       	          	 	    if(width/height>=1){
 	       	          	 	    	  this.width = options.width;
                                this.height = options.width* (height /width);  
 	       	          	 	    }else{
 	       	          	 	        this.width = options.height  * (width/height);  
                                this.height = options.height;	
 	       	          	 	    }
 	       	          	 }else if(width>=options.width){
 	       	          	 	    this.width = options.width;
                            this.height = options.width* (height /width);  
 	       	          	 }else if(height>=options.width){
 	       	          	 	    this.width = options.height  * (width/height);  
                            this.height = options.height;	
 	       	          	 }
 	       	          	 
 	       	          	 if (options.width/options.height  <= width/height){
                            this.width = options.width;
                            this.height = options.width* (height /width);  
                       }else {
                           this.width = options.height  * (width/height);  
                           this.height = options.height;
                       }
 	       	          } 
 	       	          
 	       	          var mh=Math.floor((options.width-this.width)/2);
 	       	          var mv=Math.floor((options.height-this.height)/2);
 	       	          
 	       	          $(this).css({
 	       	             "margin":mv+"px "+mh+"px"	
 	       	          })
 	       	          
 	       	          dom.append(img);   	
 	       	      })
        	  }
        	  
        	  if(entity.items){
        	      var discriptionDiv=$("<div class='Showcase_entity_discription_container'></div>");	
        	      $.each(entity.items,function(){
        	          discriptionDiv.append(
        	              "<div class='Showcase_entity_discription_item'>"
        	             +"  <div  class='Showcase_entity_discription_item_title'>"+this.title+"：</div>"
        	             +"  <div  class='Showcase_entity_discription_item_text'>"+this.text+"</div>"
        	             +"</div>"
        	          );
        	      })
        	      dom.append(discriptionDiv);
        	  }
        	  
        	  dom.click(function(){
        	  	  window.parent.appendTab({
    	          	   title:entity.name,
                     src:"/entity.jsp?EntityID="+entity.id,
                     closable:true,
                     selected:true,
                     id:"entity_"+entity.id,
                     single:true
    	          	
    	          })	
        	  })
        	  
        	  this.slide.append(dom);
        }
        
        this.init();
    }   
});