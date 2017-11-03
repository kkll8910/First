define(["Item"],function(Item) {
	  
	  var ContentModule=function(options){
	  	   options=options || {};
       	 var self=this;
       	 this.id="content_"+options.index;
       	 this.parent=options.parent;
       	 
       	 this.init=function(){
       	 	   this.root=$("<hr/>");
       	 	   
       	     options.contentContainer.append(this.root);
       	 }	
       	 
       	 this.init();
    };

    var AttributeModule=function(options){
	  	   options=options || {};
       	 var self=this;
       	 this.id="attribute_"+options.index;
       	 this.parent=options.parent;
       	 
       	 this.init=function(){
       	     this.root=$("<div class='Image_attribute_container AttributeModule' id='"+this.id+"'></div>");
       	                
       	     var itemOfShape=new Item({title:"形状及透明度"});
       	     var tableOfShape=$("<table width='388px' border='0' cellspacing='4' cellpadding='4'>"
                              +"  <tr>"
                              +"    <td width='20%' align='right'>线型:</td>"
                              +"    <td width='30%'align='left'><input type='number' class='img_inputItem'>%<td>"
                              +"    <td width='20%' align='right'>粗细:</td>"
                              +"    <td width='30%' align='left'><input type='number' class='img_inputItem'>度<td>"
                              +"  </tr>"
                              +"  <tr>"
                              +"    <td align='right'>颜色:</td>"
                              +"    <td><input type='number' class='img_inputItem'>%<td>"
                             
                              +"  </tr>"
                              +"</table>");
             itemOfShape.append(tableOfShape);
             itemOfShape.appendTo(this.root);
             
             var itemOfMargin=new Item({title:"外间距"});
       	     var tableOfMargin=$("<table width='388px' border='0' cellspacing='4' cellpadding='4'>"
                               +"  <tr>"
                               +"    <td>左边距</td>"
                               +"    <td>上边距</td>"
                               +"    <td>右边距</td>"
                               +"    <td>底边距</td>"
                               +"  </tr>"
                               +"  <tr>"
                               +"    <td><input class='marginInput' type='number' id='"+this.id+"_leftmargin'></td>"
                               +"    <td><input class='marginInput' type='number' id='"+this.id+"_topmargin'></td>"
                               +"    <td><input class='marginInput' type='number' id='"+this.id+"_rightmargin'></td>"
                               +"    <td><input class='marginInput' type='number' id='"+this.id+"_bottommargin'></td>"
                               +"  </tr>"
                               +"</table>");
             itemOfMargin.append(tableOfMargin);
             itemOfMargin.appendTo(this.root);
             
             
       	               
             $("."+this.id+"_leftmargin",this.root).change(function(){
             	   self.parent.contentModule.root.css("margin-left",$(this).val()+"px");	
             }) 
              
       	     options.attributeContainer.append(this.root);
       	     window.wdk.Observer.publish("/module/attribute/show");
       	 }	
       	 
       	 
       	 this.show=function(){
       	     this.root.show();	
       	 }
       	 
       	 this.hide=function(){
       	     this.root.hide();	
       	 }
       	 
       	 this.init();
    };

    var Model=new function(options){
       	    
       	    	
    };
    
	  return function(options){           
       	options=options || {};
       	
       	var me=this;
       	this.type="image";
       	this.index=options.index;
       	
       	this.init=function(){
       		  var cmOptions={
       		  	  URL:options.URL,
       		  	  parent:this,
       		  	  index:this.index,
       		  	  contentContainer:options.contentContainer
       		  };
       		  
       		  var amOptions={
       		  	  URL:options.URL,
       		  	  parent:this,
       		  	  index:this.index,
       		  	  attributeContainer:options.attributeContainer
       		  };
       		  
       		  
       		  this.contentModule=new ContentModule(cmOptions);
       		  this.attributeModule=new AttributeModule(amOptions);
       		  
       		  this.contentModule.root.click(function(){
       	     	  window.wdk.Observer.publish("/module/attribute/show",me.attributeModule)
       	    })
       		  window.wdk.Observer.publish("/module/attribute/show",this.attributeModule)
       	}
       	
       	this.getContentModule=function(){
       	    return this.contentModule;	
       	}
       	
       	this.getAttributeModule=function(){
       	    return this.attributeModule;	
       	}
       	
       	this.init();
       	   
    }
})