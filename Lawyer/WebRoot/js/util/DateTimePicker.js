 define(["css!util/css/DateTimePicker.css"],function() {
       
    return function(option){
    	  this.init=function(){
    	  	  var year=new Date().getFullYear();
 	     	   	
 	     	   	var selectorOfYear=$("<select class='Module_date_select year'></select>");
 	     	   	for(var i=year-100;i<=year+100;i++){
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
 	     	   	
 	     	   	option.container.append(selectorOfYear);
 	     	   	option.container.append($("<div class='Module_date_space'>年</div>"));
 	     	   	option.container.append(selectorOfMonth);
 	     	   	option.container.append($("<div class='Module_date_space'>月</div>"));
 	     	   	option.container.append(selectorOfDate);
 	     	   	option.container.append($("<div class='Module_date_space'>日</div>"));
 	     	   	
 	     	   	
 	     	   	option.container.append(selectorOfHour);
 	     	   	option.container.append($("<div class='Module_date_space'>:</div>"));
 	     	   	option.container.append(selectorOfMinute);
 	     	   	option.container.append($("<div class='Module_date_space'>:</div>"));
 	     	   	option.container.append(selectorOfSecond);
    	  }
        
        
        this.val=function(value){
        	  var fields=[
 	     	   	    $(".year",option.container),
 	     	   	    $(".month",option.container),
 	     	   	    $(".date",option.container),
 	     	   	    $(".hour",option.container),
 	     	   	    $(".minute",option.container),
 	     	   	    $(".second",option.container)
 	     	   	];
 	     	   	
        	  if(value){
        	      var d=new Date();
        	  	  fields[0].val(d.getFullYear());
        	  	  fields[1].val(d.getMonth());
        	  	  fields[2].val(d.getDate());
        	  	  fields[3].val(d.getHours());
        	  	  fields[4].val(d.getMinutes());
        	  	  fields[5].val(d.getSeconds());
        	  }else{
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
        }
        
        
        this.init();
    }   
});