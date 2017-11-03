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
       $("#modifyButton").click(function(){
       	   window.location.href="/weixin/modifyUnit.jsp?UnitID="+window.unit.id;
       })
   }) 
}); 