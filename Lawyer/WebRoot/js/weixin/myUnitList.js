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
       $("li").click(function(){
           window.location.href="/weixin/myUnit.jsp?UnitID="+this.id;	
       })
   }) 
}); 