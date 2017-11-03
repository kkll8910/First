 define(["css!util/css/Department.css"],function() {
    var rootDepartment={id:"001",name:"胶州市公安局",subs:[
        {id:"001001",fullname:"胶州市公安局刑警大队",name:"刑警大队",subs:[
            {id:"001001001",fullname:"胶州市公安局刑警大队一中队",name:"刑警一中队"},
            {id:"001001002",fullname:"胶州市公安局刑警大队二中队",name:"刑警二中队"},
            {id:"001001003",fullname:"胶州市公安局刑警大队三中队",name:"刑警三中队"},
            {id:"001001004",fullname:"胶州市公安局刑警大队四中队",name:"刑警四中队"},
            {id:"001001005",fullname:"胶州市公安局刑警大队五中队",name:"刑警五中队"},
            {id:"001001006",fullname:"胶州市公安局刑警大队六中队",name:"刑警六中队"}
        ]},   	
        {id:"001002",fullname:"胶州市公安局网警大队",name:"网警大队",subs:[
            {id:"001002001",fullname:"胶州市公安局网警大队一中队",name:"网警一中队"},
            {id:"001002002",fullname:"胶州市公安局网警大队二中队",name:"网警二中队"},
            {id:"001002003",fullname:"胶州市公安局网警大队三中队",name:"网警三中队"}
        ]},
        {id:"001003",fullname:"胶州市公安局中云派出所",name:"三里河派出所"},
        {id:"001004",fullname:"胶州市公安局九龙派出所",name:"九龙派出所"},
        {id:"001005",fullname:"胶州市公安局洋河派出所",name:"洋河派出所"},
        {id:"001006",fullname:"胶州市公安局里岔派出所",name:"里岔派出所"},
        {id:"001007",fullname:"胶州市公安局李哥庄派出所",name:"李哥庄派出所"}        
    ]}   
    
    
    return function(options){
    	  var me=this;
     	  options=options || {};
     	  this.init=function(){
        	  this.root=$("<div class='Department_container'></div>");  
        	  this.root.append(makeDepartmentDom(rootDepartment))
        	  this.setClosed(rootDepartment,6)
        }
        
        var makeDepartmentDom=function(dpt){
        	  var dom=$(
        	      "<table cellpadding='2' cellspacing='4' border='0' width='100%'>"
        	      +"   <tr>"
        	      +"       <td width='14px' valign='top'><div class='dpt_icon'  id='dpt_icon_"+dpt.id+"'></div></td>"
        	      +"       <td id='"+dpt.id+"'>"
        	      +"           <div class='dpt_name' id='dpt_name_"+dpt.id+"'>"+dpt.name+"</div>"
        	      +"       </td>"
        	      +"   </tr>"
        	      +"</table>"
        	  );
        	          	  
        	  $(".dpt_name",dom).click(function(){
        	  	  $(".dpt_name_selected",me.root).removeClass("dpt_name_selected");
        	  	  $(this).addClass("dpt_name_selected");
        	  })
        	  
        	  if(dpt.subs){
        	  	 var img=$("<img src='/js/util/images/minus-black.png'>");
        	  	 img.click(function(){
        	  	 	   me.collapsible(dpt)
        	  	 })
        	  	 $(".dpt_icon",dom).append(img);
        	  	 
        	     for(var i=0;i<dpt.subs.length;i++){
        	         $("#"+dpt.id,dom).append(makeDepartmentDom(dpt.subs[i]));	
        	     }
        	  }
        	  
        	  if(dpt.id.length>=6){
        	  	 me.collapsible(dpt,"close");
        	  }
        	  return dom;
        }
        
        
        
        this.getRootDom=function(){
            return this.root;	
        }
        
        this.setClosed=function(dpt,idLength){
        	  if(dpt.id>=idLength && dpt.subs){
                this.collapsible(dpt,"close");
            }
            if(dpt.subs){	
              for(var i=0;i<dpt.subs.length;i++){
        	      this.setClosed(dpt.subs[i],idLength);	
        	    }
        	  }
        }
        
        this.collapsible=function(dpt,flag){
        	  var img=$("#dpt_icon_"+dpt.id,this.root).children("img");
        	  var tables=$("#dpt_name_"+dpt.id,this.root).nextAll();
        	  
        	  var switchFlag=true;//true为打开，false关闭
        	  if(flag){
        	      if(flag=="close"){
        	      	  switchFlag=false;
        	      }
        	  }else{
        	      if(img.attr("src").indexOf("minus-black.png")>0){
        	          switchFlag=false;	
        	      }	
        	  }
        	  
        	  
        	  if(switchFlag==true){
        	  	  img.attr("src","/js/util/images/minus-black.png");
        	  	  tables.show();
        	  }else{
        	  	  img.attr("src","/js/util/images/plus-black.png");
        	  	  tables.hide();
        	  }	  
        }
        
        this.val=function(){
            var selected=$(".dpt_name_selected",this.root);
            if(selected.length>0){
                return selected.parent().attr("id");	
            }
        }
        
        this.init();
    }   
});