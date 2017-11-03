var setTab=null,getDocument=null;
require.config({
    baseUrl: '/js',
    paths: {
    	jquery:"jquery-2.1.4.min",
      jqMobile:['mobile/jquery.mobile-1.4.5.min'],
      TabContainer:["wdk/layout/TabContainer"]
    },
    shim: {
        jqMobile:{deps:['jquery']},
        TabContainer:{deps:['jquery']}
    }
});

requirejs(["TabContainer","jqMobile"],function(TabContainer) {
    $(document).ready(function(){
    	  $(window).resize(function(){
        	   window.wdk.Observer.publish("window/resize");
        })
    	  
    	  window.wdk.Observer.subscribe("window/resize",function(){
    	  	 $("#TabContainer").height($(window).height()-$("#TopDiv").height()-2);   
       	});
        
        window.wdk.Observer.publish("window/resize");
        
        setTab=function(id,obj){
        	  pageTabContainer.setTab(id,obj);
        }
        
        var pageTabContainer=new TabContainer({
        	  container:$("#TabContainer")
        });
        
        pageTabContainer.addTab({
                	  title:"欢迎光临",
                    src:"/advertisement/index.jsp",
                    closable:false,
                    selected:true,
                    id:"welcome",
                    single:true
        })	
        
        
        $("#createDocumentButton").click(function(){
            pageTabContainer.addTab({
                	  title:"创建文档",
                    src:"/advertisement/createDocument.jsp",
                    closable:true,
                    selected:true,
                    id:"createDocument",
                    single:true
            })	
        })
        
        getDocument=function (id){
        	  for(var i=0;i<window.myDocuments.length;i++){
                if(window.myDocuments[i].id==id){
                	  return window.myDocuments[i];
                }	
            }
        }
        
        
        $(".docListItem").click(function(){
        	  pageTabContainer.addTab({
                	  title:$(this).text(),
                    src:"/advertisement/myDocument.jsp?DocumentID="+this.id,
                    closable:true,
                    selected:true,
                    id:"myDocument_"+this.id,
                    single:true
            })
            $("#popupMydocument").popup("close");
        })
        
        
        function getSystemNotifies(){
        	  $.ajax({
            	type: "POST",
              dataType: "json",
              url:"/getSystemNotifies",
              success: function(data){
              	$.each(data,function(){
              		if(this.type=="ReviewHasBeenDone"){
                      ReviewHasBeenDoneHandler(this.notify)
                  }else if(this.type=="DocumentCreated"){
                  	  DocumentHasCreatedHandler(this.notify);
                  }else if(this.type=="DocumentModified"){
                  	  DocumentHasModifiedHandler(this.notify);
                  }else if(this.type=="PublishSuccess"){
                  	  PublishSuccessHandler(this.notify);
                  }
                });  
    	        }
            });
        }	
        
        function DocumentHasCreatedHandler(doc){
        	  myDocuments.push(doc)
            var item=$("<li class='docListItem' id='"+doc.id+"'><img src='"+doc.thumbnail+"'><h2>"+doc.title+"</h2><p><span>正在审核当中...</span></p></li>");
            $("#myDocumentsList").append(item);
            $("#myDocumentsList").listview("refresh");
       	    
       	    window.wdk.popup({
       	            title:"文档创建成功",
       	            dialog:true,
       	            
       	            text:"标题为：“"+doc.title+"”的文档已经创建成功，我们的工作人员正在审核当中",
       	            buttons:[{vertical:true,close:true,title:"我知道了"}]
       	    })
        }
        
        function DocumentHasModifiedHandler(nty){
        	  window.wdk.popup({
       	            title:"文档修改成功",
       	            dialog:true,
       	            text:"文档修改成功，我们的工作人员正在在对其重新审核，请稍候...",
       	            buttons:[{vertical:true,close:true,title:"我知道了"}]
       	    })
       	    var doc=getDocument(nty.DocumentID);
       	    if(doc){
       	        doc.review=null;	
       	        if(doc.title!=nty.title){
       	        	   pageTabContainer.setTab("myDocument_"+nty.DocumentID,{title:nty.title});
       	        }
       	        
       	        $(".docListItem").each(function(){
       	            var item=$(this);	
       	            if(this.id==nty.DocumentID){
       	            	  if(doc.title!=nty.title){
       	        	          $("h2",item).html(nty.title);
       	                }
       	                
       	                if(doc.thumbnail!=nty.thumbnail){
       	        	          $("img",item).attr("src",nty.thumbnail);
       	                }
       	                $("p",item).html("正在审核当中...");
       	                return;
       	            }
       	        })
       	    }
        }
        
        
        
        function PublishSuccessHandler(publish){
        	  window.wdk.popup({
       	            title:"文档开始发布",
       	            dialog:true,
       	            text:"标题为：“"+publish.title+"”的文档成功创建了新的发布动作。",
       	            buttons:[
       	              {vertical:true,close:true,title:"我知道了"},
       	              {vertical:true,close:true,title:"查看发布记录"}
       	            ]
       	    })
        }
        
        window.setInterval(getSystemNotifies,3000);
    })
});

