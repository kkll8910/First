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
	 	
	 	   var queryOptions={
	 	   	  keyword:null,
	 	   	  city:null,
	 	   	  type:null,
	 	   	  lastID:-1,
	 	   	  end:false,
	 	   	  isQuerying:false,
	 	   	  limit:14
	 	   }
	 	   
	 	   function equalsOptions(opt){
	 	   	  return queryOptions.keyword==opt.keyword && queryOptions.city==opt.city && queryOptions.type==opt.type  
	 	   }
	 	   
	 	   var currentKeyword=null,lastID=-1,isGetingUnit=false,toBeEnd=false;
	 	   function getUnit(){
	 	   	    if(queryOptions.isQuerying==true || queryOptions.end==true){
	 	   	        return;	
	 	   	    }
	 	   	    
	 	   	    	 	        
            $.mobile.loading( "show", {
                    text: "正在获取数据...",
                    textVisible: true,
                    theme: "b",
                    textonly: false,
                    html: ""
            });
            
            queryOptions.isQuerying=true;
	 	        $.ajax({
            	type: "POST",
              dataType: "json",
              url:"/searchUnit",
              data: queryOptions,
              success: function(data){
              	  $.mobile.loading( "hide" );
              	  queryOptions.isQuerying=false;
              	  queryOptions.lastID=data.LastId;
              	  if(data.NoResult){
              	  	  queryOptions.end=true;
              	  }
              	  
              	  if(data.Units){
              	  	  $.each(data.Units,function(){
              	  	  	  if(this.type==1){
              	  	  	  	  makeRoleListItem(this);
              	  	  	  }else if(this.type==2){
              	  	  	  	  makeGroupListItem(this);
              	  	  	  }else if(this.type==3){
              	  	  	  	  makePublicListItem(this);
              	  	  	  }else if(this.type==4){
              	  	  	  	  makeServiceListItem(this);
              	  	  	  }
              	  	  })
              	  }
    	        }
            });
	 	   } 
	 	   
	 	   function makeRoleListItem(unit){
	 	   	   var div=$('<div data-role="collapsible" data-collapsed="true"  data-theme="a" data-content-theme="a" type='+unit.type+' data-iconpos="left" data-collapsed-icon="person" data-expanded-icon="carat-u">'+
                     '    <h4 class="ListItem_Title"><span>'+unit.name+'</span><span  class="browsed">浏览次数:'+unit.browsed+'</span></h4>'+
                     '    <ul data-role="listview">'+
                     '        <li><div class="titleDiv">类型:</div><div class="contentDiv">个人微信</div></li>'+
                     '        <li><div class="titleDiv">签名:</div><div class="contentDiv">'+unit.title+'</div></li>'+
                     ((unit.keywords && unit.keywords!="")?'<li><div class="titleDiv">标签:</div><div class="contentDiv">'+unit.keywords+'</div></li>':"")+
                     '        <li><div class="titleDiv">微信号:</div><div class="contentDiv">'+unit.weixinID+'</div></li>'+
                     '        <li><div class="titleDiv">二维码:</div><div class="contentDiv"><img src="'+unit.weixinQR+'"></div></li>'+
                     ((unit.discription && unit.discription!="")?'<li><div style="word-wrap:break-word">'+unit.discription+'</div></li>':"")+
                     '    </ul>'+
                     '</div>');
                     
	 	   	   $("ul",div).listview();	 	   	  
	 	   	   div.collapsible();
           div.collapsible({
               expand: function() {
               	   if(!div.data("browsed")){
               	       $.ajax({
                        	type: "POST",
                          dataType: "json",
                          url:"/UnitSession",
                          data: {RequestFlag:"setBrowse",UnitID:unit.id}
                       });
                       div.data("browsed",true)	
                   }
               }
           });
	 	   	   
	 	   	   $("#UnitList").append(div);
	 	   }
       
       function makeGroupListItem(unit){
       	 
	 	   	   var div=$('<div data-role="collapsible" data-collapsed="true"  data-theme="a" data-content-theme="a" type='+unit.type+' data-iconpos="left" data-collapsed-icon="person" data-expanded-icon="carat-u">'+
                     '    <h4 class="ListItem_Title"><span>'+unit.name+'</span><span  class="browsed">浏览次数:'+unit.browsed+'</span></h4>'+
                     '    <ul data-role="listview">'+
                     '        <li><div class="titleDiv">类型:</div><div class="contentDiv">微信群</div></li>'+
                     '        <li><div class="titleDiv">签名:</div><div class="contentDiv">'+unit.title+'</div></li>'+
                     ((unit.keywords && unit.keywords!="")?'<li><div class="titleDiv">标签:</div><div class="contentDiv">'+unit.keywords+'</div></li>':"")+
                     '        <li><div class="titleDiv">微信号:</div><div class="contentDiv">'+unit.weixinID+'</div></li>'+
                     '        <li><div class="titleDiv">微信二维码:</div><div class="contentDiv"><img src="'+unit.weixinQR+'"></div></li>'+
                     ((unit.thumbnail && unit.thumbnail!="")?'<li><div class="titleDiv">群二维码:</div><div class="contentDiv"><img src="'+unit.thumbnail+'"></div></li>':"")+
                     ((unit.discription && unit.discription!="")?'<li><div style="word-wrap:break-word">'+unit.discription+'</div></li>':"")+
                     '    </ul>'+
                     '</div>');
                     
	 	   	   $("ul",div).listview();	 	   	  
	 	   	   div.collapsible();
	 	   	   
	 	   	   $("#UnitList").append(div);
	 	   }
       
       function makePublicListItem(unit){
       	  var div=$('<div data-role="collapsible" data-collapsed="true"  data-theme="a" data-content-theme="a" type='+unit.type+' data-iconpos="left" data-collapsed-icon="person" data-expanded-icon="carat-u">'+
                     '    <h4 class="ListItem_Title"><span>'+unit.name+'</span><span  class="browsed">浏览次数:'+unit.browsed+'</span></h4>'+
                     '    <ul data-role="listview">'+
                     '        <li><div class="titleDiv">类型:</div><div class="contentDiv">公众号</div></li>'+
                     '        <li><div class="titleDiv">签名:</div><div class="contentDiv">'+unit.title+'</div></li>'+
                     ((unit.keywords && unit.keywords!="")?'<li><div class="titleDiv">标签:</div><div class="contentDiv">'+unit.keywords+'</div></li>':"")+
                     '        <li><div class="titleDiv">微信号:</div><div class="contentDiv">'+unit.weixinID+'</div></li>'+
                     '        <li><div class="titleDiv">二维码:</div><div class="contentDiv"><img src="'+unit.weixinQR+'"></div></li>'+
                     ((unit.discription && unit.discription!="")?'<li><div style="word-wrap:break-word">'+unit.discription+'</div></li>':"")+
                     '    </ul>'+
                     '</div>');
                     
	 	   	   $("ul",div).listview();	 	   	  
	 	   	   div.collapsible();
           div.collapsible({
               expand: function() {
               	   if(!div.data("browsed")){
               	       $.ajax({
                        	type: "POST",
                          dataType: "json",
                          url:"/UnitSession",
                          data: {RequestFlag:"setBrowse",UnitID:unit.id}
                       });
                       div.data("browsed",true)	
                   }
               }
           });
	 	   	   
	 	   	   $("#UnitList").append(div);
       }
       
       function makeServiceListItem(unit){
	 	   	   var div=$('<div data-role="collapsible" data-collapsed="true"  data-theme="a" data-content-theme="a" type='+unit.type+' data-iconpos="left" data-collapsed-icon="person" data-expanded-icon="carat-u">'+
                     '    <h4 class="ListItem_Title"><span>'+unit.name+'</span><span  class="browsed">浏览次数:'+unit.browsed+'</span></h4>'+
                     '    <ul data-role="listview">'+
                     '        <li><div class="titleDiv">服务:</div><div class="contentDiv">'+unit.keywords+'</div></li>'+
                     '        <li><div class="titleDiv">签名:</div><div class="contentDiv">'+unit.title+'</div></li>'+
                     ((unit.item1 && unit.item1!="")?'<li><div class="titleDiv">城市:</div><div class="contentDiv">'+unit.item1+'</div></li>':"")+
                     '        <li><div class="titleDiv">微信号:</div><div class="contentDiv">'+unit.weixinID+'</div></li>'+
                     '        <li><div class="titleDiv">二维码:</div><div class="contentDiv"><img src="'+unit.weixinQR+'"></div></li>'+
                     ((unit.discription && unit.discription!="")?'<li><div style="word-wrap:break-word">'+unit.discription+'</div></li>':"")+
                     '    </ul>'+
                     '</div>');
                     
	 	   	   $("ul",div).listview();	 	   	  
	 	   	   div.collapsible();
           div.collapsible({
               expand: function() {
               	   if(!div.data("browsed")){
               	       $.ajax({
                        	type: "POST",
                          dataType: "json",
                          url:"/UnitSession",
                          data: {RequestFlag:"setBrowse",UnitID:unit.id}
                       });
                       div.data("browsed",true)	
                   }
               }
           });
	 	   	   
	 	   	   $("#UnitList").append(div);
	 	   }
       
       
       
       $("#createRoleButton").click(function(){
           window.location.href="/weixin/createUnit.jsp?Type=1"	
       })
       
       $("#createGroupButton").click(function(){
           window.location.href="/weixin/createUnit.jsp?Type=2"	
       })
       
       $("#createPublicButton").click(function(){
           window.location.href="/weixin/createUnit.jsp?Type=3"	
       })
       
       $("#createServiceButton").click(function(){
           window.location.href="/weixin/createService.jsp"	
       })
       
       $("#myUnitsButton").click(function(){
           window.location.href="/weixin/myUnitList.jsp?Type=3"	
       })
       
       
       
       
       function init(){
           getUnit();	
           
           $(document).scroll(function(){  
           	viewH =$(document.body).height(),//可见高度  
             contentH =document.body.scrollHeight,//内容高度  
             scrollTop =$(document.body).scrollTop();//滚动高度  
              
             if(contentH - viewH - scrollTop <= 1) {
             //if(scrollTop/(contentH -viewH)>=0.95){
                  if(isGetingUnit!=true){
                      getUnit();
                  }
             }  
           });  
       }
       
       init();
   }) 
}); 