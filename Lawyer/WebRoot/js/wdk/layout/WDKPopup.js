define(["Dialog"],function(Dialog) {
   return {
       alert:function(options){
           options.title=options.title || "提示";
       	   var dialog=new Dialog({
       	   	    modal:true,
                title:options.title,
                content:$("<div style='width:420px;text-align:left;word-break:break-all;white-space:normal;text-indent:2em;'>"+options.message+"<div>"),
                buttons:[
                    {title:"知道了",handler:function(){
                    	   dialog.destory();
                    	   if(options.handler){
                    	       options.handler(); 
                    	   }
                    }}
                ]	
           })
           dialog.show();
       },
       
       confirm:function(options){
           options.title=options.title || "提示";
       	   var dialog=new Dialog({
       	   	    modal:true,
                title:options.title,
                content:$("<div style='width:420px;text-align:left;word-break:break-all;white-space:normal;text-indent:2em;'>"+options.message+"<div>"),
                buttons:[
                    {title:"取消",handler:function(){
                    	   if(options.cancleHandler){
                    	       options.cancleHandler(); 
                    	   }
                    	   dialog.destory();
                    }},
                    
                    {title:"确定",handler:function(){
                    	   if(options.okHandler){
                    	       options.okHandler(); 
                    	   }
                    	   dialog.destory();
                    }}
                ]	
           })
           dialog.show();
       }
   } 
});