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
	  $(function(){
    	  $("#Button_log").click(function(){
    	  	  var para={
	          	RequestFlag:"log",
	          	Mobile:$("#ipt_mobile").val(),
	          	Password:$("#ipt_password").val(),
	          	ValidCode:$("#ipt_valid").val()
	          }
	          
	          var error="";
	          if(!para.Mobile || !/^0?1[3|4|5|8][0-9]\d{8}$/.test(para.Mobile)){
	              error+="手机号码错误\r\n"	
	          }
	                                
	          if(!para.Password || !/^[a-zA-Z0-9]{7,16}$/.test(para.Password)){
	              error+="密码格式错误\r\n"	
	          }
	          
	          if(!para.ValidCode || !/^[0-9]{4}/.test(para.ValidCode)){
	              error+="验证码错误\r\n"	
	          }
	          
	          if(error!=""){
	              alert(error);
	              return;	
	          }
	  
            $.ajax({
            	type: "POST",
              dataType: "json",
              url:"/management/ManagerLog",
              data: para,
              success: function(data){
              	  if(data.Failure){
              	  	  alert(data.Failure)
              	  }else if(data.Success){
              	  	  window.location.href="/management/main.jsp"
              	  } 
    	        }
            });
    	  })
    	  
    	  
    })
});