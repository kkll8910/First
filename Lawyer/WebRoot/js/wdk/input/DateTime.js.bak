define(["css!wdk/input/css/DateTime.css"],function() {
      
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  
        this.init=function(){
        	  this.root=$("<div style='clear:both;'></div>"); 
        	  var now = new Date();
     	      var paras=[
     	          {id:"year",min:2017,max:2020,unit:"年",width:32}, 
     	          {id:"month",min:1,max:12,unit:"月",width:22},
     	          {id:"date",min:1,max:31,unit:"日",width:22},
     	          {id:"hour",min:0,max:23,unit:"点",width:22},
     	          {id:"minute",min:0,max:59,unit:"分",width:22},
     	          {id:"second",min:0,max:59,unit:"秒",width:22}
     	      ];
     	      
     	      this.modules=[];
     	      
     	      var level=options.level || paras.length;
     	      
     	      for(var i=0;i<level;i++){
     	      	  var m=makeInputDom(paras[i]);
     	      	  this.root.append(m);
     	      	  this.modules.push(m);
     	      }
     	      
     	      if(options.value){
     	      	  this.val(options.value);
     	      }else{
     	          this.val({date:new Date()})	
     	      }
     	      
     	      
     	      if(options.container){
     	      	  options.container.append(this.root);
     	      }
        }
        
        function makeInputDom(option){
            var dom=$(
               "<div style='float:left;'>"+
               "  <div class='inputContainer'>"+
        	     "    <input id='"+option.id+"' type='Integer' min='"+option.min+"' max='"+option.max+"' data-role='none'>"+
        	     "    <div style='float:left'><div  style='margin-top:5px;'><img id='up' src='/images/up_gray.png'></div><div style='margin-top:2px;'><img id='down' src='/images/down_gray.png'></div></div>"+
        	     "  </div>"+
        	     "  <div class='datatime_unit'>"+option.unit+"</div>"+
        	     "</div'>"
            );
            
            var input=$("input",dom);
            input.width(option.width)
            input.registValid();
            $("#up",dom).click(function(){
                if(!input.valid()){
                	input.val(option.min);
                }	
                
                var value=parseInt(input.val());
                var v=(value<option.max)?value+1 : option.min;
                input.val(v);
            })	
            
            $("#down",dom).click(function(){
                if(!input.valid()){
                	input.val(option.min);
                }	
                var value=parseInt(input.val());
                var v=(value>option.min)?value-1 : option.max;
                input.val(v);
            })	
            
            if(option.unit=="点"){
            	  $(".inputContainer",dom).css("margin-left","30px");	
            }
            return dom;
        }
       
       
        this.val=function(value){
        	  if(value){
        	  	  var date=null;
        	  	  if(value.date){
        	  	  	  date=value.date;
        	  	  }else if(value.after){
        	  	  	  date = new Date();
        	  	  	  date.setDate(date.getDate()+value.after);
        	  	  }
        	  	  
        	  	  $("#year",this.root).val(date.getFullYear());
        	  	  $("#month",this.root).val(date.getMonth()+1);
        	  	  $("#date",this.root).val(date.getDate());
        	  	  $("#hour",this.root).val(date.getHours());
        	  	  $("#minute",this.root).val(date.getMinutes());
        	  	  $("#second",this.root).val(date.getSeconds());
        	  }else{
        	  	  if($("#year",this.root).valid() &&
        	  	     $("#month",this.root).valid() &&
        	  	     $("#date",this.root).valid() &&
        	  	     $("#hour",this.root).valid() &&
        	  	     $("#minute",this.root).valid() &&
        	  	     $("#second",this.root).valid()){
        	          var year=$("#year",this.root).val();
        	  	      var month=$("#month",this.root).val();
        	  	      var d=$("#date",this.root).val();
        	  	      
        	  	      var hour=$("#hour",this.root).val() || 0;
        	  	      var minute=$("#minute",this.root).val() || 0;
        	  	      var second=$("#second",this.root).val() || 0;	
        	  	      
        	  	      var date=new Date();
        	  	      if(!isNaN(year)){
        	  	          date.setFullYear(parseInt(year));
        	  	      }
        	  	      
        	  	      if(!isNaN(month)){
        	  	          date.setMonth(parseInt(month)-1);
        	  	      }
        	  	      
        	  	      if(!isNaN(d)){
        	  	          date.setDate(parseInt(d));
        	  	      }
        	  	      
        	  	      if(!isNaN(hour)){
        	  	          date.setHours(parseInt(hour));
        	  	      }    
        	  	      
        	  	      if(!isNaN(minute)){
        	  	          date.setMinutes(parseInt(minute));
        	  	      }
        	  	      
        	  	      if(!isNaN(second)){
        	  	          date.setSeconds(parseInt(second));
        	  	      }
        	  	      
        	  	      return date;
        	  	  }
        	  }
        }
        
        this.disable=function(disabled){
        	  if(disabled==true){
        	      this.lastValue=this.val();	
        	      for(var i=0;i<this.modules.length;i++){
        	      	  $("input",this.modules[i]).prop("disabled",true);
        	      	  $("input",this.modules[i]).val("00");
        	      }
        	  }else{
        	      for(var i=0;i<this.modules.length;i++){
        	      	  $("input",this.modules[i]).prop("disabled",false);
        	      }
        	      this.val({date:this.lastValue});	
        	  }
        	  this.disabled=disabled;
        }
        
        this.init();
    }   
});