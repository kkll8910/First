define(["VerticalTab","Item","css!wdk/app/css/Text.css"],function(VerticalTab,Item) {
	  
	  var ContentModule=function(options){
	  	   options=options || {};
       	 var self=this;
       	 this.id="content_"+options.index;
       	 this.parent=options.parent;
       	 
       	 this.init=function(){
       	 	   this.root=$("<div id='"+this.id+"'></div>");
       	     if(options.html){
       	         this.root.html(options.html);	
       	     }
       	     options.contentContainer.append(this.root);
       	     
       	 }	
       	 
       	 this.setContent=function(html){
       	 	   this.root.html(html);
       	 }
       	 this.init();
    };

    var AttributeModule=function(options){
	  	   options=options || {};
       	 var self=this;
       	 this.id="attribute_"+options.index;
       	 this.parent=options.parent;
       	 
       	 this.init=function(){
       	     this.root=$("<div class='text_attribute_container AttributeModule' id='"+this.id+"'>"
       	                +"    <textarea style='height:300px;width:398px'></textarea>"
       	                +"</div>");
               
       	     options.attributeContainer.append(this.root);
       	     
       	     var tableOfMarin=$("<table width='100%' border='0' cellspacing='4' cellpadding='4'>"
                               +"  <tr>"
                               +"    <td>左:<input class='marginInput' type='number' id='"+this.id+"_leftmargin'></td>"
                               +"    <td>上:<input class='marginInput' type='number' id='"+this.id+"_topmargin'></td>"
                               +"    <td>右:<input class='marginInput' type='number' id='"+this.id+"_rightmargin'></td>"
                               +"    <td>下:<input class='marginInput' type='number' id='"+this.id+"_bottommargin'></td>"
                               +"  </tr>"
                               +"</table>");
                        
       	     var itemOfMargin=new Item({title:"外边距",item:tableOfMarin,width:"380px"});
       	     itemOfMargin.appendTo(this.root)
       	     
       	     if(options.html){
       	         this.root.find("textarea").html(options.html)
       	     }
       	     
       	     this.setEditor();
       	     this.root.hide();
       	     window.wdk.Observer.publish("/module/attribute/show");
       	 }	
       	 
       	 this.setEditor=function(){
       	 	   this.editor =KindEditor.create($("textarea",this.root),{
                items:['formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', '|','bold','italic', 'underline', 'strikethrough', 'lineheight','/',
                       'justifyleft', 'justifycenter', 'justifyright','justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', '|',  'table', 'hr','|','plainpaste', 'wordpaste', '/', 
                       'clearhtml', 'quickformat', '|','undo', 'redo','|','selectall','removeformat'],
                minWidth:320,//this.root.width()-2,
                afterChange:function(){
                    self.parent.contentModule.setContent(this.html());
                }
             });
       	 }
       	 
       	 this._getMarginUI=function(){
       	     var div=$("<div class='TextMarginContainer'>"
       	              +"    <div class='TextMarginDiv'><label for='"+this.id+"_leftmargin'>左边距:</label><input type='number' id='"+this.id+"_leftmargin'></div>"
       	              +"    <div class='TextMarginDiv'><label for='"+this.id+"_topmargin'>上边距:</label><input type='number' id='"+this.id+"_topmargin'></div>"
       	              +"    <div class='TextMarginDiv'><label for='"+this.id+"_rightmargin'>右边距:</label><input type='number' id='"+this.id+"_rightmargin'></div>"
       	              +"    <div class='TextMarginDiv'><label for='"+this.id+"_bottommargin'>底边距:</label><input type='number' id='"+this.id+"_bottommargin'></div>"
       	              +"</div>");
       	              
       	     $("#"+this.id+"_leftmargin",div).change(function(){
       	         self.parent.contentModule.root.css("margin-left",$(this).val()+"px")	
       	     })
       	     
       	     $("#"+this.id+"_topmargin",div).change(function(){
       	         self.parent.contentModule.root.css("margin-top",$(this).val()+"px")	
       	     })
       	     $("#"+this.id+"_rightmargin",div).change(function(){
       	         self.parent.contentModule.root.css("margin-right",$(this).val()+"px")	
       	     })
       	     $("#"+this.id+"_bottommargin",div).change(function(){
       	         self.parent.contentModule.root.css("margin-bottom",$(this).val()+"px")	
       	     })
       	     return div;
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
       	this.type="text";
       	this.index=options.index;
       	this.init=function(){
       		  var cmOptions={
       		  	  parent:this,
       		  	  index:this.index,
       		  	  contentContainer:options.contentContainer
       		  };
       		  
       		  var amOptions={
       		  	  parent:this,
       		  	  index:this.index,
       		  	  attributeContainer:options.attributeContainer
       		  };
       		  
       		  if(options.html){
       		  	  cmOptions.html=options.html;
       		  	  amOptions.html=options.html;
       		  }
       		  
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