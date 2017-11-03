 /**
 author:王登科
 date：2017-6-1 -
 version：1.0
 */
 define(["Popup","UploadPicture","UploadVedio","css!util/css/Modules.css"],function(Popup,UploadPicture,UploadVedio) {
 	   function isEditable(user) {
 	   	  if(global_user.id==user){
 	   	  	  return true;	
 	   	  }
 	   	  
 	   	  if(global_user.jurisdictions){
 	   	      for(var i=0;i<global_user.jurisdictions.length;i++){
 	   	          if(global_user.jurisdictions[i].name=="admin"){
 	   	             return true;	
 	   	          }	
 	   	      }	
 	   	  }
 	   }
 	   
 	   /**
 	     container:dom容器
 	     title:标题
 	     mode:模式，1为显示模式，2为编辑模式
 	     editable:是否可编辑
 	     required：必填
 	     value:当前有效的值
 	     id:数据库中对应的id
 	     hit：提示
 	   */
 	   function ModuleTemp(option){
 	   	   var me=this;
 	   	   if(option.value){
 	   	   	  option.initValue=option.value;
 	   	   }
 	   	   
 	   	   if(option.mode!="create"){
 	   	       this._isEditable=isEditable(option.user);
 	   	   }
 	   	   
 	   	   this.init=function(){
 	     	 	  this._root=$(
 	     	         "<div class='Module_container'>"
 	     	        +"    <div class='Module_title'></div>"
 	     	        +"    <div class='Module_content'></div>"
 	     	        +"    <div class='Module_hit'></div>"
 	     	        +"</div>"
 	     	    );
 	     	    if(option.container){option.container.append(this._root);}    
 	     	 	  this.switchMode(option.mode || "display");
 	     	 }
 	     	 
 	     	 this.switchMode=function(mode){
 	     	 	    $(".Module_content",this._root).empty();
 	     	 	    
 	     	 	    if(mode=="display"){
 	     	 	    	  this._showMessage();	
 	     	 	    	  if(option.title){
 	     	 	    	      $(".Module_title",this._root).html(option.title+"：");
 	     	 	    	  } 
 	     	 	    	  $(".Module_hit",this._root).empty();   
 	     	 	    	  $(".Module_delButton",this._root).remove();
 	     	 	    	  this.setModeToDisplay();	
 	     	 	    	  
 	     	 	    	  if(this._isEditable==true){     
 	     	 	    	  	  this._root.prop("title","单击可进行修改");
 	     	   	      	  
 	     	 	    	      this._root.bind("click",function(){
 	     	 	    	          me.switchMode("modify");	
 	     	 	    	      })
 	     	 	    	      
 	     	 	    	      this._appendDelButton();
 	     	 	    	      this._root.hover(
 	     	 	    	          function(){
 	     	 	    	          	$(".Module_delButton",me._root).show();
 	     	 	    	          	me._root.css("background-color","#ccc");
 	     	 	    	          },
 	     	 	    	          function(){
 	     	 	    	          	$(".Module_delButton",me._root).hide();
 	     	 	    	          	me._root.css("background-color","");
 	     	 	    	          }
 	     	 	    	      );
 	     	 	    	  }
 	     	 	    }else if(mode=="create"){
 	     	 	        this._appendTitle();
 	     	 	        this.setModeToCreate();
 	     	 	    }else if(mode=="modify"){     
 	     	 	    	  this._root.unbind("click");
 	     	 	    	  $(".Module_hit",this._root).empty();
 	     	 	    	  this._appendTitle();
 	     	 	    	  this.setModeToModify();	
 	     	 	        this._appendSaveButton();
 	     	 	    }
 	     	 	    option.mode=mode;
 	     	 }
 	     	 
 	     	 this._appendTitle=function(){
 	     	 	   if(option.title){
 	     	     	  var titleText=option.title+"：";
 	     	     	  if(option.required){
 	     	     	  	 titleText="**"+titleText
 	     	     	  }
 	     	     	  $(".Module_title",this._root).html(titleText);
 	     	     }
 	     	 }
 	     	 
 	     	 this._appendSaveButton=function(){
 	     	 	   var saveButton=$("<img src='/js/util/images/save_blue.png' height='16px' class='Module_saveButton'>");
 	     	     saveButton.click(function(){
 	     	         me.save();	
 	     	     })	
 	     	     $(".Module_hit",this._root).append(saveButton);
 	     	 }
 	     	 
 	     	 this._appendDelButton=function(){
 	     	     if(option.required){
 	     	         return;	
 	     	     }
 	     	     
 	     	     var delButton=$("<img src='/js/util/images/delete-black.png' height='12px' class='Module_delButton' title='删除'>");
 	     	     delButton.click(function(){
 	     	         me.remove();	
 	     	         return false;
 	     	     })
 	     	     $(".Module_hit",this._root).append(delButton);
 	     	 }
 	     	 
 	     	 //提示信息
 	     	 this._showMessage=function(msg){
 	     	 	  
 	     	 	  if(msg){
 	     	 	  	  $(".Module_error",this._root).remove();
 	     	 	  	  this._root.append($("<div class='Module_error'>"+msg+"</div>"));
 	     	 	  	  this._root.css("background-color","#ccc");
 	     	 	  }else{
 	     	 	      $(".Module_error",this._root).remove();
 	     	 	      this._root.css("background-color","");
 	     	 	  }
 	     	 }
 	     	 
 	     	 //删除该属性
 	     	 this.remove=function(){
 	     	 	  if(!confirm("您确实要删除该属性吗？")){
 	     	 	      return;	
 	     	 	  }
 	     	 	  
 	     	 	  var para={RequestFlag:"delItem",id:option.id};
 	     	 	  $.ajax({
 	     	 	  	    type: "POST",
                  dataType: "json",
                  url:"/ItemSession",
                  data: para,
            }).done(function(res){  
            	  if(res.Success){
            	  	  me._root.remove();
            	  }else{
            	  	  alert(res.Failure || "删除失败，稍后请重试！")
            	  }
            });	
 	     	 }
 	     	 
 	     	 //保存修改
 	     	 this.save=function(){
 	     	 	   if(this.valid && !this.valid()){
 	     	 	       return;	
 	     	 	   }
 	     	 	   
 	     	 	   var value=this.val();
 	     	 	   if(!value){
 	     	 	   	   return;	
 	     	 	   }	  
 	     	 	   
 	     	 	   
 	     	 	   
 	     	 	   var para={
 	     	 	   	  RequestFlag:"modifyItem",
 	     	 	   	  id:option.id,
 	     	 	   	  value:value
 	     	 	   }
 	     	 	   
 	     	 	   
 	     	 	   $.ajax({
 	     	 	   	 type: "POST",
               dataType: "json",
               url:"/ItemSession",
               data: para,
             }).done(function(res){  
             	  if(res.Success){
             	  	  option.initValue=value;
             	  	  option.value=value;
             	  	  me.switchMode("display");
             	  }else{
             	  	  alert(res.Failure || "保存失败，稍后请重试！");
             	  }
             });
 	     	 }
 	     	 
 	     	 //检查值是否有效
 	     	 this.valid=function(){
 	     	 	  alert("请实现valid方法");
 	     	 }
 	     	  	     	   	  
 	     	 this.val=function(){
 	     	 	  alert("请实现val方法");
 	     	 }
 	     	 
 	     	 
 	     	 //获取选项中的某个值
 	     	 this.getOption=function(key){
 	     	 	  return option[key]
 	     	 }
 	   }
 	   
 	   function FieldsetModuleTemp(option){
 	     	 var me=this;  	
 	     	 if(option.mode!="create"){
 	     	     this._isEditable=isEditable(option.user);
 	       }  	
 	            	   	  
         this.init=function(){
 	     	 	 this._root=$(
 	     	 	      "<fieldset  class='Module_fieldset'>"
 	     	 	     +"    <legend></legend>"
 	     	 	     +"    <div class='Module_fieldset_buttons'></div>"
 	     	 	     +"    <div class='Module_fieldset_content'></div>"
 	     	 	     +"</fieldset>"
 	     	    );
 	     	    
 	     	    if(option.container)option.container.append(this._root);  
 	     	    this.switchMode(option.mode);
 	     	 }
 	     	 
 	     	 this.switchMode=function(mode){
 	     	 	    this._resetFieldset();
 	     	 	    
 	     	 	    if(mode=="display"){
 	     	 	    	  if(option.title){
 	     	          	  $("legend",this._root).html(option.title);
 	     	          }
 	     	   	      this.setModeToDisplay();	
 	     	   	      if(this._isEditable==true){     
 	     	   	      	  if(!option.required){
 	     	 	    	          var delButton=$("<div class='Module_fieldset_button'>删除</div>");
 	     	   	              delButton.click(function(){
 	     	   	                  me.remove();	
 	     	   	              })
 	     	   	              $(".Module_fieldset_buttons",this._root).append(delButton);
 	     	 	    	      }
 	     	 	    	      
 	     	 	    	      this._root.hover(
 	     	 	    	          function() {
 	     	 	    	          	  $(".Module_fieldset_buttons",me._root).show();
 	     	 	    	          },
 	     	 	    	          function() {
 	     	 	    	          	  $(".Module_fieldset_buttons",me._root).hide();
 	     	 	    	          }
 	     	 	    	      );
 	     	 	    	  }
 	     	 	    }else if(mode=="create"){
 	     	 	    	  if(option.title){
 	     	          	  var titleText=option.title+":";
 	     	          	  if(option.required){
 	     	          	  	 titleText="**"+titleText
 	     	          	  }
 	     	          	  $("legend",this._root).html(titleText);
 	     	          }
 	     	          this.setModeToCreate();
 	     	 	    }else if(mode=="modify"){
 	     	 	    	  if(option.title){
 	     	          	  var titleText=option.title;
 	     	          	  if(option.required){
 	     	          	  	 titleText="**"+titleText
 	     	          	  }
 	     	          	  $("legend",this._root).html(titleText);
 	     	          }
 	     	   	      this.setModeToModify();
 	     	 	    }
 	     	 	    option.mode=mode;
 	     	 }
 	     	 
 	     	 this._resetFieldset=function(){
 	     	 	    $(".Module_fieldset_title",this._root).empty(); 
 	     	 	    $(".Module_fieldset_buttons",this._root).empty(); 
 	     	 	    $(".Module_fieldset_buttons",this._root).hide(); 
 	     	 	    $(".Module_fieldset_content",this._root).empty(); 
 	     	 	    this._root.unbind();
 	     	 }
 	     	 
 	     	 //获取选项中的某个值
 	     	 this.getOption=function(key){
 	     	 	  return option[key]
 	     	 }
 	     	 
 	     	 
 	     	 
 	     	 //删除该属性
 	     	 this.remove=function(){
 	     	 	  if(!confirm("您确实要删除该属性吗？")){
 	     	 	      return;	
 	     	 	  }
 	     	 	  
 	     	 	  $.ajax({
 	     	 	  	    type: "POST",
                  dataType: "json",
                  url:"/ItemSession",
                  data: {RequestFlag:"delItem",id:option.id},
            }).done(function(res){  
            	  if(res.Success){
            	  	  me._root.remove();
            	  }else{
            	  	  alert(res.Failure || "删除失败，稍后请重试！")
            	  }
            });	
 	     	 	  
 	     	 }
 	     	 
 	     	 this._showMessage=function(msg){
 	     	 	  
 	     	 	  $(".Module_fieldset_error",this._root).remove();
 	     	 	  if(msg){
 	     	 	  	  $("legend",this._root).append($("<span class='Module_fieldset_error'>"+msg+"</span>"));
 	     	 	  	  this._root.css("background-color","#ccc");
 	     	 	  }else{
 	     	 	      this._root.css("background-color","");
 	     	 	  }
 	     	 }
 	     	 
 	     	 //保存修改
 	     	 this.save=function(){
 	     	 	   if(this.valid && !this.valid()){
 	     	 	       return;	
 	     	 	   }
 	     	 	   
 	     	 	   var value=this.val();
 	     	 	   if(!value){
 	     	 	   	   return;	
 	     	 	   }	 
 	     	 	   
 	     	 	   var para={
 	     	 	   	  RequestFlag:"modifyItem",
 	     	 	   	  id:option.id
 	     	 	   }
 	     	 	   
 	     	 	   var valueType=this.getOption("valuetype");
 	     	 	   para.value=(valueType=="array" || valueType=="json") ? JSON.stringify(value) : value;
 	     	 	   
 	     	 	   $.ajax({
 	     	 	   	 type: "POST",
               dataType: "json",
               url:"/ItemSession",
               data: para,
             }).done(function(res){  
             	  if(res.Success){
             	  	  option.initValue=value;
             	  	  option.value=value;
             	  	  me.switchMode("display");
             	  }else{
             	  	  alert(res.Failure || "保存失败，稍后请重试！");
             	  }
             });
 	     	 }
 	   }
 	   
 	   var Modules=[
 	     /**
 	     min：最小长度
 	     max：最大长度
 	     regexp：正则表达式
 	     */
 	     {type:"text",
 	     	   module:function(option){
 	     	   	  var me=this;
 	     	   	  if(!option){
 	     	   	      alert("Modeule Of Text init Paramtere error!");
 	     	   	      return;
 	     	   	  }
 	     	   	  
 	     	   	  option.type="text";
 	     	   	  option.valuetype="string";
 	     	   	  ModuleTemp.apply(this,[option]);

 	     	   	  this.setModeToDisplay=function(){
 	     	   	  	  var contentDiv=$(".Module_content",this._root);
 	     	   	  	  
 	     	   	  	  contentDiv.html(option.value || "");	
 	     	   	  }
 	     	   	  
 	     	   	  
 	     	   	  this.setModeToCreate=function(){
 	     	   	  	  var contentDiv=$(".Module_content",this._root);
 	     	   	  	  
 	     	   	  	  var input=$("<input type='text' class='Module_input'>");
 	     	   	  	  $(".Module_content",this._root).append(input);
 	     	   	  }
 	     	   	  
 	     	   	  this.setModeToModify=function(){
 	     	   	  	  var contentDiv=$(".Module_content",this._root);
 	     	   	  	  
 	     	   	  	  var input=$("<input type='text' class='Module_input'>");
 	     	   	  	  if(option.value){
 	     	   	  	      input.val(option.value);	
 	     	   	  	  }
 	     	   	  	  $(".Module_content",this._root).append(input);
 	     	   	  } 	     	   	  
 	     	   	  
 	     	   	  this.valid=function(){
 	     	   	  	  var value=$("input",this._root).val();
 	     	   	  	  var errorMsg=null;
 	     	   	  	  
 	     	   	  	  if(option.required==true && !value){
    	            	  errorMsg="必填！";
    	            }else if(value && option.min && value.length<option.min){
    	            	  errorMsg="最低"+option.min+"个字符";
    	            }else if(value && option.max && value.length>option.max){
    	            	  errorMsg="最多"+option.max+"个字符";
    	            }else if(option.pattern){
    	                var pattern = new RegExp(option.pattern);
    	                if(!pattern.test(value)){
    	                    errorMsg="格式错误";
    	                } 	
    	            }
    	            
    	            this._showMessage(errorMsg);
    	            if(errorMsg){
    	            	  return false;	
    	            }else{
    	                option.value=value;
    	                return true;
    	            }
 	     	   	  }
 	     	   	  
 	     	   	  this.val=function(){
 	     	   	  	  if(this.valid()){
 	     	   	  	      return 	$(".Module_input",this._root).val();
 	     	   	  	  }
 	     	   	  }
 	     	   	  
 	     	   	  this.init();
 	     	   }
 	     },
 	     
 	     {type:"radio",
 	     	   module:function(option){
 	     	   	  if(!option || !option.options){
 	     	   	      alert("Modeule Of radio init Paramtere error!");
 	     	   	      return;
 	     	   	  }
 	     	   	  var me=this;
 	     	   	  option.type="radio";
 	     	   	  option.valuetype="string";
 	     	   	  ModuleTemp.apply(this,[option]);

 	     	   	  this.setModeToDisplay=function(){
 	     	   	  	  var contentDiv=$(".Module_content",this._root);
 	     	   	  	  contentDiv.empty();
 	     	   	  	  $.each(option.options,function(){
 	     	   	  	      if(this[0]==option.value){
 	     	   	  	          contentDiv.html(this[1]);
 	     	   	  	          return;  	
 	     	   	  	      }	
 	     	   	  	  }) 	 
 	     	   	  }
 	     	   	  
 	     	   	  this.setModeToCreate=function(){
 	     	   	  	  var contentDiv=$(".Module_content",this._root);
 	     	   	  	  contentDiv.empty();
 	     	   	  	  if(option.options){
 	     	              $.each(option.options,function(){
 	     	              	  var item=$("<div class='Module_radiogroup_item' value='"+this[0]+"'>"+this[1]+"<div>");
 	     	              	  item.click(function(){
 	     	              	  	  $(".Module_radiogroup_item_selected",me._root).removeClass("Module_radiogroup_item_selected");
        	                    $(this).addClass("Module_radiogroup_item_selected");
 	     	              	  })
 	     	              	  contentDiv.append(item);
 	     	              })	
 	     	              
 	     	              contentDiv.children().first().addClass("Module_radiogroup_item_first");
                      contentDiv.children().last().addClass("Module_radiogroup_item_last");
 	     	          }
 	     	   	  } 
 	     	   	  
 	     	   	  this.setModeToModify=function(){
 	     	   	  	  var contentDiv=$(".Module_content",this._root);
 	     	   	  	  contentDiv.empty();
 	     	   	  	  if(option.options){
 	     	              $.each(option.options,function(){
 	     	              	  var item=$("<div class='Module_radiogroup_item' value='"+this[0]+"'>"+this[1]+"<div>");
 	     	              	  item.click(function(){
 	     	              	  	  $(".Module_radiogroup_item_selected",me._root).removeClass("Module_radiogroup_item_selected");
        	                    $(this).addClass("Module_radiogroup_item_selected");
 	     	              	  })
 	     	              	  contentDiv.append(item);
 	     	                  if(option.value && option.value==this[0]){
 	     	              	      item.addClass("Module_radiogroup_item_selected");
 	     	                  }
 	     	              })	
 	     	              
 	     	              
 	     	              contentDiv.children().first().addClass("Module_radiogroup_item_first");
                      contentDiv.children().last().addClass("Module_radiogroup_item_last");
 	     	          }
 	     	   	  } 	
 	     	   	  
 	     	   	  this.val=function(){
 	     	   	      if(!this.valid()){
 	     	   	      	  return;
 	     	   	      }
 	     	   	      var selectedOption=$(".Module_radiogroup_item_selected",this._root);
 	     	   	      if(selectedOption.length>0){
 	     	   	          return 	selectedOption.attr("value") || selectedOption.text();
 	     	   	      }
 	     	   	  } 	     	   	  
 	     	   	  
 	     	   	  this.valid=function(){
 	     	   	  	  var value=null;
 	     	   	  	  var selectedOption=$(".Module_radiogroup_item_selected",this._root);
 	     	   	      if(selectedOption.length>0){
 	     	   	          value=selectedOption.attr("value");
 	     	   	      }
 	     	   	      
 	     	   	  	  if(option.required==true  && !value){
    	            	  this._showMessage("必选");
    	            	  return false;	
    	            }
    	            
    	            option.value=value;
    	            this._showMessage();
    	            return true;
 	     	   	  }
 	     	   	  
 	     	   	  this.init();
 	     	   }
 	     },
 	     
 	     {type:"select",
 	     	   module:function(option){
 	     	   	  if(!option || !option.options){
 	     	   	      alert("Modeule Of select init Paramtere error!");
 	     	   	      return;
 	     	   	  }
 	     	   	  var me=this;
 	     	   	  option.type="select";
 	     	   	  option.valuetype="string";
 	     	   	  ModuleTemp.apply(this,[option]);
 	     	   	  
 	     	   	  this.setModeToDisplay=function(){
 	     	   	  	  var contentDiv=$(".Module_content",this._root);
 	     	   	  	  contentDiv.empty();
 	     	   	  	  $.each(option.options,function(){
 	     	   	  	      if(this[0]==option.value){
 	     	   	  	          contentDiv.html(this[1]);
 	     	   	  	          return;  	
 	     	   	  	      }	
 	     	   	  	  }) 	  
 	     	   	  }
 	     	   	  
 	     	   	  this.setModeToCreate=function(){
 	     	   	  	  var contentDiv=$(".Module_content",this._root);
 	     	   	  	  var select=$("<select class='Module_select'><option></option></select>")
 	     	   	  	  $.each(option.options,function(){
                      select.append("<option value='"+this[0]+"'>"+this[1]+"</option>");
 	     	          })
 	     	          contentDiv.append(select);
 	     	   	  } 
 	     	   	  
 	     	   	  this.setModeToModify=function(){
 	     	   	  	  var contentDiv=$(".Module_content",this._root);
 	     	   	  	  contentDiv.empty();
 	     	   	  	  var select=$("<select class='Module_select'><option></option></select>")
 	     	   	  	  $.each(option.options,function(){
                      var opt=$("<option value='"+this[0]+"'>"+this[1]+"</option>");
                      if(option.value==this[0]){
                         opt.attr("selected","selected");	
                      }
 	     	   	  	  	  select.append(opt);
 	     	          })	
 	     	          
 	     	          contentDiv.append(select);
 	     	   	  } 	     	   	  
 	     	   	  
 	     	   	  this.val=function(){
 	     	   	  	  return $("select",this._root).val() || null;
 	     	   	  }
 	     	   	  
 	     	   	  this.valid=function(){
 	     	   	  	  var value=$("select",this._root).val();
 	     	   	  	  
 	     	   	  	  if(option.required==true  && !value){
    	            	  this._showMessage("必选");
    	            	  return false;	
    	            }
    	            
    	            option.value=value;
    	            this._showMessage();
    	            return true;
 	     	   	  }
 	     	   	  
 	     	   	  this.init();
 	     	   }
 	     },
 	     
 	     /**
 	     value:毫秒数
 	     */
 	     {type:"date",
 	     	   module:function(option){
 	     	   	  if(!option || !option.title){
 	     	   	      alert("Modeule Of radio init Paramtere error!");
 	     	   	      return;
 	     	   	  }
 	     	   	  var me=this;
 	     	   	  option.type="date";
 	     	   	  option.range=parseInt(option.range || 100);
 	     	   	  
 	     	   	  if(option.value){
 	     	   	     option.value=parseInt(option.value);	
 	     	   	  }
 	     	   	  option.valuetype="date";
 	     	   	  ModuleTemp.apply(this,[option]);
              
 	     	   	  	     	   	  
 	     	   	  this.setModeToDisplay=function(){
 	     	   	  	  var contentDiv=$(".Module_content",this._root);
 	     	   	  	  contentDiv.empty();
 	     	   	  	  if(!option.value) return;
 	     	   	  	  
 	     	   	  	  var dateObj=new Date(option.value);	
 	     	   	  	  var year=dateObj.getFullYear();
 	     	   	  	  var month=dateObj.getMonth();
 	     	   	  	  var date=dateObj.getDate();
 	     	   	  	  var hour=dateObj.getHours();
 	     	   	  	  var minute=dateObj.getMinutes();
 	     	   	  	  var second=dateObj.getSeconds();
 	     	   	  	  
 	     	   	  	  var dateStr=year+"-"+(month+1)+"-"+date+"- "+hour+":"+minute;
 	     	   	  	  if(second>0){
 	     	   	  	     dateStr+=":"+second;
 	     	   	  	  }
 	     	   	  	  contentDiv.html(dateStr); 	  
 	     	   	  }
 	     	   	  
 	     	   	  this.setModeToCreate=function(){
 	     	   	  	  var contentDiv=$(".Module_content",this._root);
 	     	   	  	  
 	     	   	  	  var dateObj=new Date();
 	     	   	  	  var year=dateObj.getUTCFullYear();
 	     	   	  	  
 	     	   	  	  var selectorOfYear=$("<select class='Module_date_select year'><option> </option></select>");
 	     	   	  	  for(var i=year-option.range;i<=year+option.range;i++){
 	     	   	  	  	  var sSeleted=(year==i)?"selected='selected'" : "";
 	     	   	  	  	  selectorOfYear.append("<option value='"+i+"' "+sSeleted+">"+i+"</option>");	
 	     	   	  	  }
 	     	   	  	  
 	     	   	  	  var selectorOfMonth=$("<select class='Module_date_select month'><option> </option></select>");
 	     	   	  	  for(var i=0;i<12;i++){
 	     	   	  	  	  selectorOfMonth.append("<option value='"+i+"'>"+(i+1)+"</option>");	
 	     	   	  	  }
 	     	   	  	  
 	     	   	  	  
 	     	   	  	  var selectorOfDate=$("<select class='Module_date_select date'><option> </option></select>");
 	     	   	  	  for(var i=1;i<=31;i++){
 	     	   	  	  	  selectorOfDate.append("<option value='"+i+"'>"+i+"</option>");	
 	     	   	  	  }
 	     	   	  	  
 	     	   	  	  var selectorOfHour=$("<select class='Module_date_select hour'></select>");
 	     	   	  	  for(var i=0;i<=23;i++){
 	     	   	  	  	  selectorOfHour.append("<option value='"+i+"'>"+i+"</option>");	
 	     	   	  	  }
 	     	   	  	  
 	     	   	  	  
 	     	   	  	  var selectorOfMinute=$("<select class='Module_date_select minute'></select>");
 	     	   	  	  for(var i=0;i<=59;i++){
 	     	   	  	  	  selectorOfMinute.append("<option value='"+i+"'>"+i+"</option>");	
 	     	   	  	  }
 	     	   	  	  
 	     	   	  	  var selectorOfSecond=$("<select class='Module_date_select second'></select>");
 	     	   	  	  for(var i=0;i<=59;i++){
 	     	   	  	  	  selectorOfSecond.append("<option value='"+i+"'>"+i+"</option>");	
 	     	   	  	  }
 	     	   	  	  
 	     	   	  	  contentDiv.append(selectorOfYear);
 	     	   	  	  contentDiv.append($("<div class='Module_date_space'>年</div>"));
 	     	   	  	  contentDiv.append(selectorOfMonth);
 	     	   	  	  contentDiv.append($("<div class='Module_date_space'>月</div>"));
 	     	   	  	  contentDiv.append(selectorOfDate);
 	     	   	  	  contentDiv.append($("<div class='Module_date_space'>日</div>"));
 	     	   	  	  
 	     	   	  	  
 	     	   	  	  contentDiv.append(selectorOfHour);
 	     	   	  	  contentDiv.append($("<div class='Module_date_space'>:</div>"));
 	     	   	  	  contentDiv.append(selectorOfMinute);
 	     	   	  	  contentDiv.append($("<div class='Module_date_space'>:</div>"));
 	     	   	  	  contentDiv.append(selectorOfSecond);
 	     	   	  	  
 	     	   	  } 
 	     	   	  
 	     	   	  this.setModeToModify=function(){
 	     	   	  	  var contentDiv=$(".Module_content",this._root);
 	     	   	  	  contentDiv.empty();
 	     	   	  	  var dateObj=new Date(parseInt(option.value));
 	     	   	  	      
 	     	   	  	  var selectorOfYear=$("<select class='Module_date_select year'><option> </option></select>");
 	     	   	  	  
 	     	   	  	  var year=dateObj.getFullYear();
 	     	   	  	  for(var i=year-option.range;i<=year+option.range;i++){
 	     	   	  	  	  var opt=$("<option value='"+i+"'>"+i+"</option>");
 	     	   	  	  	  if(year==i){
 	     	   	  	  	      opt.attr("selected","selected");	
 	     	   	  	  	  }
 	     	   	  	      selectorOfYear.append(opt);	
 	     	   	  	  }
 	     	   	  	  
 	     	   	  	  var selectorOfMonth=$("<select class='Module_date_select month'><option> </option></select>");
 	     	   	  	  for(var i=0;i<12;i++){
 	     	   	  	  	  var opt=$("<option value='"+i+"'>"+(i+1)+"</option>");
 	     	   	  	  	  var month=dateObj.getMonth();
 	     	   	  	  	  if(month==i){
 	     	   	  	  	      opt.attr("selected","selected");	
 	     	   	  	  	  }
 	     	   	  	  	  selectorOfMonth.append(opt);	
 	     	   	  	  }
 	     	   	  	  
 	     	   	  	  
 	     	   	  	  var selectorOfDate=$("<select class='Module_date_select date'><option> </option></select>");
 	     	   	  	  for(var i=1;i<=31;i++){
 	     	   	  	  	  var opt=$("<option value='"+i+"'>"+i+"</option>");
 	     	   	  	  	  var date=dateObj.getDate();
 	     	   	  	  	  if(date==i){
 	     	   	  	  	      opt.attr("selected","selected");	
 	     	   	  	  	  }
 	     	   	  	  	  selectorOfDate.append(opt);	
 	     	   	  	  }
 	     	   	  	  
 	     	   	  	  var selectorOfHour=$("<select class='Module_date_select hour'></select>");
 	     	   	  	  for(var i=0;i<=23;i++){
 	     	   	  	  	  var opt=$("<option value='"+i+"'>"+i+"</option>");
 	     	   	  	  	  var hour=dateObj.getHours();
 	     	   	  	  	  if(hour==i){
 	     	   	  	  	      opt.attr("selected","selected");	
 	     	   	  	  	  }
 	     	   	  	  	  selectorOfHour.append(opt);	
 	     	   	  	  }
 	     	   	  	  
 	     	   	  	  
 	     	   	  	  var selectorOfMinute=$("<select class='Module_date_select minute'></select>");
 	     	   	  	  for(var i=0;i<=59;i++){
 	     	   	  	  	  var opt=$("<option value='"+i+"'>"+i+"</option>");
 	     	   	  	  	  var minute=dateObj.getMinutes();
 	     	   	  	  	  if(minute==i){
 	     	   	  	  	      opt.attr("selected","selected");	
 	     	   	  	  	  }
 	     	   	  	  	  selectorOfMinute.append(opt);	
 	     	   	  	  }
 	     	   	  	  
 	     	   	  	  var selectorOfSecond=$("<select class='Module_date_select second'></select>");
 	     	   	  	  for(var i=0;i<=59;i++){
 	     	   	  	  	  var opt=$("<option value='"+i+"'>"+i+"</option>");
 	     	   	  	  	  var second=dateObj.getSeconds();
 	     	   	  	  	  if(second==i){
 	     	   	  	  	      opt.attr("selected","selected");	
 	     	   	  	  	  }
 	     	   	  	  	  selectorOfSecond.append(opt);	
 	     	   	  	  }
 	     	   	  	  
 	     	   	  	  contentDiv.append(selectorOfYear);
 	     	   	  	  contentDiv.append($("<div class='Module_date_space'>年</div>"));
 	     	   	  	  contentDiv.append(selectorOfMonth);
 	     	   	  	  contentDiv.append($("<div class='Module_date_space'>月</div>"));
 	     	   	  	  contentDiv.append(selectorOfDate);
 	     	   	  	  contentDiv.append($("<div class='Module_date_space'>日</div>"));
 	     	   	  	  
 	     	   	  	  
 	     	   	  	  contentDiv.append(selectorOfHour);
 	     	   	  	  contentDiv.append($("<div class='Module_date_space'>:</div>"));
 	     	   	  	  contentDiv.append(selectorOfMinute);
 	     	   	  	  contentDiv.append($("<div class='Module_date_space'>:</div>"));
 	     	   	  	  contentDiv.append(selectorOfSecond);
 	     	   	  }  	     	   	  
 	     	   	  
 	     	   	  this.valid=function(){
 	     	   	  	   var fields=[
 	     	   	  	       $(".year",this._root),
 	     	   	  	       $(".month",this._root),
 	     	   	  	       $(".date",this._root),
 	     	   	  	       $(".hour",this._root),
 	     	   	  	       $(".minute",this._root),
 	     	   	  	       $(".second",this._root)
 	     	   	  	   ];
 	     	   	  	   
 	     	   	  	   if(option.required && !this.val()){
 	     	   	  	   	  this._showMessage("必选");
 	     	   	  	      return false;	
 	     	   	  	   }else{
 	     	   	  	   	  for(var i=5;i>0;i--){
 	     	   	  	   	      if(fields[i].val() && !fields[i-1].val()){
 	     	   	  	   	      	  this._showMessage("必选");
 	     	   	  	   	          return false;	
 	     	   	  	   	      }	
 	     	   	  	   	  }
 	     	   	  	   	  this._showMessage();
 	     	   	  	   	  return true;
 	     	   	  	   }
 	     	   	  }
 	     	   	  
 	     	   	  this.val=function(value){
 	     	   	  	   var fields=[
 	     	   	  	       $(".year",this._root),
 	     	   	  	       $(".month",this._root),
 	     	   	  	       $(".date",this._root),
 	     	   	  	       $(".hour",this._root),
 	     	   	  	       $(".minute",this._root),
 	     	   	  	       $(".second",this._root)
 	     	   	  	   ];
 	     	   	  	   
 	     	   	  	   if(!fields[0].val() || !fields[1].val() || !fields[2].val()){
 	     	   	  	       return;	
 	     	   	  	   }else if(fields[5].val() && (!fields[4].val() || !fields[3].val())){
 	     	   	  	       return;
 	     	   	  	   }else if(fields[4].val() && !fields[3].val()){
 	     	   	  	       return;	
 	     	   	  	   }
 	     	   	  	   
 	     	   	  	   var year  =fields[0].val();
 	     	   	  	   var month =fields[1].val();
 	     	   	  	   var date  =fields[2].val();
 	     	   	  	   var hour  =fields[3].val() || 0;
 	     	   	  	   var minute=fields[4].val() || 0;
 	     	   	  	   var second=fields[5].val() || 0;
 	     	   	  	   
 	     	   	  	   var dateObj=new Date(year+"/"+(parseInt(month)+1)+"/"+date+" "+hour+":"+minute+":"+second);
 	     	   	  	   return dateObj.getTime();
 	     	   	  }
 	     	   	  
 	     	   	  this.init();
 	     	   }
 	     },
 	     
 	     /**
 	     options:html编辑器参数
 	     */
 	     {type:"html",
 	     	   module:function(option){
 	     	   	  if(!option){
 	     	   	      alert("Modeule Of radio init Paramtere error!");
 	     	   	      return;
 	     	   	  }
 	     	   	  
 	     	   	  option.options=option.options ||{
 	     	   	  	  items:[
                          'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
                          'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                          'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                          'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
                          'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                          'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'table', 'hr', 'emoticons', 
                          'anchor', 'link', 'unlink'
                  ]
 	     	   	  }
 	     	   	  
 	     	   	  var me=this;
 	     	   	  option.type="html";
 	     	   	  option.valuetype="string";
 	     	   	  FieldsetModuleTemp.apply(this,[option]);

 	     	      
 	     	      this.setModeToDisplay=function(){
 	     	      	  var content=$(".Module_fieldset_content",this._root);
 	     	      	  if(this._isEditable==true){
 	     	      	  	  this._root.attr("title","单击可进行修改");
 	     	      	      this._root.click(function(){
 	     	   	              me.switchMode("modify");	
 	     	   	          })
 	     	   	          this._root.hover(
 	     	   	              function(){$(this).css("background-color","#ccc")},
 	     	   	              function(){$(this).css("background-color","")}
 	     	   	          )
 	     	   	      }
 	     	   	          
 	     	   	  	  $(".Module_fieldset_content",this._root).html(option.value); 	     	   	  	   	
 	     	      }
 	     	      
 	     	      this.setModeToCreate=function(){
 	     	      	  var textarea=$("<textarea  class='Module_fieldset_html_textarea'/></textarea>");
 	     	   	  	  $(".Module_fieldset_content",this._root).append(textarea);
 	     	   	  	  this.editor =KindEditor.create(textarea,option.options);
 	     	      } 
 	     	      
 	     	      this.setModeToModify=function(){
 	     	      	  this._root.unbind("click");
 	     	      	  var saveButton=$("<div class='Module_fieldset_button'>保存修改</div>");
 	     	   	      saveButton.click(function(){
 	     	   	          me.save();	
 	     	   	          return false;
 	     	   	      })
 	     	   	      $(".Module_fieldset_buttons",this._root).append(saveButton);
 	     	 	    	  $(".Module_fieldset_buttons",this._root).show();
 	     	 	    	  
 	     	      	  var textarea=$("<textarea  class='Module_fieldset_html_textarea'/></textarea>");
 	     	   	  	  $(".Module_fieldset_content",this._root).append(textarea);
 	     	   	  	  this.editor =KindEditor.create(textarea,option.options);
 	     	   	  	  if(option.value){
 	     	   	  	     	this.editor.html(option.value)
 	     	   	  	  }
 	     	      } 
 	     	   	  
 	     	   	  this.valid=function(){
 	     	   	  	  var value=this.editor.html();
 	     	   	  	  if(option.required==true && !value){
    	            	  this._showMessage("必填");
    	            	  return false;	
    	            }
    	            this._showMessage();
    	            option.value=value;
    	            return true;
 	     	   	  }
 	     	   	  
 	     	   	  this.val=function(){
 	     	   	  	  return 	this.editor.html();
 	     	   	  }
 	     	   	  
 	     	   	  
 	     	   	  this.init();
 	     	   }
 	     },
 	     
 	     {type:"picture_list",
 	     	   module:function(option){
 	     	   	  var me=this;
 	     	   	  option.type="picture_list";
 	     	   	  option.valuetype="array";
 	     	   	  FieldsetModuleTemp.apply(this,[option]);
 	     	   	  
 	     	   	  if(option.value && typeof(option.value)=="string"){
 	     	   	      option.value=JSON.parse(option.value);	
 	     	   	  }
 	     	   	  
 	     	   	  
 	     	   	  this.setModeToDisplay=function(){
 	     	   	  	  if(option.value){
 	     	   	  	  	 $.each(option.value,function(){
 	     	   	  	  	 	    me._putPictureToList(this);
 	     	             });
 	     	          } 	
              }
              
              
              this.setModeToCreate=function(){ 	     	   	  	  
 	     	   	  	  var uploadButton=$("<div class='Module_fieldset_button'>上传照片</div>");
                  if(!this.uploadWindow){
              	  	  this.uploadWindow=new UploadPicture({
              	  	      handler:function(){
              	  	      	 me._putPictureToList(this);
              	  	      	 if(!option.value){
              	  	      	     option.value=[];	
              	  	      	 }
              	  	      	 option.value.push(this);
              	  	      }	
              	  	  })
              	  }
              	  uploadButton.click(function(){
              	      me.uploadWindow.show();
              	  })
              	  $(".Module_fieldset_buttons",this._root).append(uploadButton);
              	  $(".Module_fieldset_buttons",this._root).show();
              }
              
                            
 	     	      this._putPictureToList=function(obj){
 	     	      	  var dom=$("<div class='Module_picture_list_picContainer'></div>");
 	     	      	  var maxWidth=400,maxHeight=300;
 	     	      	  var img=$("<img src='"+obj.url+"'  class='Module_picture_list_img'>");
 	     	      	  img.load(function(){
 	     	      	  	  var width=this.width;
 	     	      	      var height=this.height;
 	     	      	      
 	     	      	      if(!(width<=maxWidth && height<=maxHeight)){
 	     	      	      	 if (maxWidth/ maxHeight  <= width/height){ //原图片宽高比例 大于 图片框宽高比例  
                             this.width = maxWidth;   //以框的宽度为标准  
                             this.height = maxWidth* (height /width);  
                         }   
                         else {   //原图片宽高比例 小于 图片框宽高比例  
                             this.width = maxHeight  * (width/height);  
                             this.height = maxHeight  ;   //以框的高度为标准  
                         }  
 	     	      	      } 
 	     	      	      
 	     	      	      var mh=Math.floor((maxWidth-this.width)/2);
 	     	      	      var mv=Math.floor((maxHeight-this.height)/2);
 	     	      	      $(this).css({
 	     	      	         "margin":mv+"px "+mh+"px"	
 	     	      	      })
 	     	      	      var link=$("<a href='"+obj.url+"' target='_blank' title='单击查看原图'></a>");
 	     	      	      link.append($(this));
 	     	      	      dom.append(link);   	
 	     	      	  })
 	     	      	  
 	     	      	  
 	     	      	  if(obj.date || obj.address || obj.discription){
 	     	      	  	  var discriptionDiv=$("<div  class='Module_picture_list_img_discription'></div>");
 	     	      	  	  if(obj.date){
 	     	      	  	     discriptionDiv.append($(
 	     	      	  	         "<div class='Module_picture_list_img_discription_item'><span style=''>拍摄时间：<span>"+obj.date+"</div>"
 	     	      	  	     ));
 	     	      	  	  }
 	     	      	  	  
 	     	      	  	  if(obj.address){
 	     	      	  	  	 discriptionDiv.append($(
 	     	      	  	         "<div class='Module_picture_list_img_discription_item'><span style=''>拍摄地点：<span>"+obj.address+"</div>"
 	     	      	  	     ));
 	     	      	  	  }
 	     	      	  	  
 	     	      	  	  if(obj.discription){
 	     	      	  	  	 discriptionDiv.append($(
 	     	      	  	         "<div class='Module_picture_list_img_discription_item'><span style=''>简要说明：<span>"+obj.discription+"</div>"
 	     	      	  	     )); 
 	     	      	  	  }
 	     	      	  	  dom.append(discriptionDiv);
 	     	      	  }
 	     	      	  
 	     	      	  if(option.mode=="create"){
 	     	      	  	  var delButton=$("<img src='/js/util/images/delete-black.png' height='12px' class='Module_picture_list_img_delButton'>");
 	     	              delButton.click(function(){
 	     	                 dom.remove();	
 	     	                 for(var i=0;i<option.value.length;i++){
 	     	                 	   if(option.value[i].url==obj.url){
 	     	                 	       option.value.splice(i,1);
 	     	                 	       return;	
 	     	                 	   }
 	     	                 }
 	     	              })
 	     	              dom.append(delButton);
 	     	              dom.hover(
 	     	                  function(){delButton.show()},
 	     	                  function(){delButton.hide()}
 	     	              )
 	     	      	  }
 	     	      	  
 	     	      	  
 	     	      	  $(".Module_fieldset_content",this._root).append(dom)
 	     	      }
 	     	      
 	     	      
 	     	   	  this.valid=function(){
 	     	   	  	  if(option.required==true && (!option.value ||option.value.length<=0)){
    	            	  this._showMessage("最少一张图片");
    	            	  return false;	
    	            }
    	            
    	            this._showMessage();
    	            return true;
 	     	   	  }
 	     	   	  
 	     	   	  this.val=function(){
 	     	   	  	  if(option.value && option.value.length>0){
 	     	   	  	      return option.value;	
 	     	   	  	  }
 	     	   	  }
 	     	   	  
 	     	   	  this.init();
 	     	   	  if(this._isEditable==true){
 	     	          var uploadButton=$("<div class='Module_fieldset_button'>上传照片</div>");
 	     	   	      uploadButton.click(function(){
              	      if(!me.uploadWindow){
              	      	  me.uploadWindow=new UploadPicture({
              	      	      handler:function(){
              	      	      	 me._putPictureToList(this);
              	      	      	 option.value= option.value || [];
              	      	      	 option.value.push(this);
              	      	      	 me.save();
              	      	      }	
              	      	  })
              	      }
              	      me.uploadWindow.show();
              	  })
 	     	   	      
 	     	   	      $(".Module_fieldset_buttons",me._root).append(uploadButton);
 	     	   	  }
 	     	   }
 	     },
 	     
 	     {type:"vedio",
 	     	   module:function(option){
 	     	   	  if(!option) return;
 	     	   	  
 	     	   	  var me=this;
 	     	   	  option.type="vedio";
 	     	   	  option.valuetype="json";
 	     	   	  FieldsetModuleTemp.apply(this,[option]);
 	     	      if(option.value && typeof(option.value)=="string"){
 	     	   	      option.value=JSON.parse(option.value);	
 	     	   	  }
 	     	      
 	     	      
 	     	   	  this.setModeToDisplay=function(){
              	  if(option.value){
 	     	   	  	  	 this._putVedioToList(option.value);
 	     	          } 	
              }
              
              this.setModeToCreate=function(){ 	  
 	     	   	  	  var uploadButton=$("<div class='Module_fieldset_button'>上传视频</div>");
                  if(!this.uploadWindow){
              	  	  this.uploadWindow=new UploadVedio({
              	  	      handler:function(){
              	  	      	 me._putVedioToList(this);
              	  	      	 option.value=this;
              	  	      }	
              	  	  })
              	  }
              	  uploadButton.click(function(){
              	      me.uploadWindow.show();
              	  })
              	  $(".Module_fieldset_buttons",this._root).append(uploadButton);
              	  $(".Module_fieldset_buttons",this._root).show();
              }
              
                            
 	     	      this._putVedioToList=function(obj){
 	     	      	  $(".Module_fieldset_content",this._root).empty();
 	     	      	  var dom=$(
 	     	      	       "<figure>"
                      +"	<video width='96%' height='600' controls='controls'  poster='' preload='metadata' aria-describedby='full-descript'>"
                      +"		<source type='video/mp4' src='"+obj.EncodeUrl+"' />"
                      +"	</video>"
                      +"</figure>"
 	     	      	  )
 	     	      	  
 	     	      	  $("source",dom).error(function(){
 	     	      	      $(this).load();
 	     	      	  })
 	     	      	  
 	     	      	  if(obj.OriginalUrl || obj.date || obj.address || obj.discription){
 	     	      	  	  var discriptionDiv=$("<figcaption id='full-descript'></figcaption>");
 	     	      	  	  if(obj.OriginalUrl){
 	     	      	  	     discriptionDiv.append($(
 	     	      	  	         "<div class='Module_vedio_discription_item'><span style=''>源文件：</span><a href='"+obj.OriginalUrl+"'>下载原文件</a></div>"
 	     	      	  	     ));
 	     	      	  	  }
 	     	      	  	  
 	     	      	  	  if(obj.date){
 	     	      	  	     discriptionDiv.append($(
 	     	      	  	         "<div class='Module_vedio_discription_item'><span style=''>拍摄时间：</span>"+obj.date+"</div>"
 	     	      	  	     ));
 	     	      	  	  }
 	     	      	  	  
 	     	      	  	  if(obj.delay){
 	     	      	  	  	 discriptionDiv.append($(
 	     	      	  	         "<div class='Module_vedio_discription_item'><span style=''>监控校时：</span>"+obj.delay+"</div>"
 	     	      	  	     )); 
 	     	      	  	  }
 	     	      	  	  
 	     	      	  	  if(obj.address){
 	     	      	  	  	 discriptionDiv.append($(
 	     	      	  	         "<div class='Module_vedio_discription_item'><span style=''>拍摄地点：</span>"+obj.address+"</div>"
 	     	      	  	     ));
 	     	      	  	  }
 	     	      	  	  
 	     	      	  	  if(obj.discription){
 	     	      	  	  	 discriptionDiv.append($(
 	     	      	  	         "<div class='Module_vedio_discription_item'><span style=''>简要说明：</span>"+obj.discription+"</div>"
 	     	      	  	     )); 
 	     	      	  	  }
 	     	      	  	  
 	     	      	  	  
 	     	      	  	  dom.append(discriptionDiv);
 	     	      	  }
 	     	      	  
 	     	      	  $(".Module_fieldset_content",this._root).append(dom);
 	     	      }
 	     	      
 	     	      
 	     	   	  this.valid=function(){
 	     	   	  	  if(option.required==true && !option.value){
    	            	  this._showMessage("请上传视频");
    	            	  return false;	
    	            }

    	            this._showMessage();
    	            return true;
 	     	   	  }
 	     	   	  
 	     	   	  this.val=function(){
 	     	   	  	  return option.value;
 	     	   	  }
 	     	   	  
 	     	   	  this.init();
 	     	   }
 	     },
 	     
 	   ];
 	   
 	   return Modules;
 })