require.config({
    baseUrl: '/js',
    paths: {
    	jquery:"jquery-2.1.4.min",
      jqMobile:['mobile/jquery.mobile-1.4.5.min']
    },
    shim: {
        jqMobile:{ deps: [ 'jquery' ] }
    }
});

requirejs(["jqMobile"],function(jqMobile) {
    $(document).ready(function(){
    	  $(window).resize(function(){
        	   window.wdk.Observer.publish("window/resize");
        })
    	  
    	  window.wdk.Observer.subscribe("window/resize",function(){
           $("iframe").height($(window).height()-$("#headerDiv").height()-6);
        });
        
        window.wdk.Observer.publish("window/resize");
        
        
        $("[targetSrc]").click(function(){
        	  var title=$(this).html();
        	  var url=$(this).attr("targetSrc");
            setPage(title,url);
        })
        
        function setPage(title,url){
        	  if($("#mainIframe").attr("src")==url){
        	  	  //return;
        	  }
        	  $("#PageTitle").html(title);
        	  $("#mainIframe").attr("src",url);
        }
        
        
    })
});