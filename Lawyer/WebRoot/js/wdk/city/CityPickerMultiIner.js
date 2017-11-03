define(["Cities","css!wdk/city/css/CityPickerIner.css"],function(Cities) {
      
    return function(options){
    	  var me=this;
     	  options=options || {};
        
        this.init=function(){   
        	  this.root=$("<table border='0' width='100%'>"
        	             +"  <tr>"
        	             +"    <td class='td_0'></td>"
        	             +"  </tr>"
        	             +"  <tr>"
        	             +"    <td  id='picker_levellist'><div class='picker_levelItem' id='cn'>中国</div><div class='hitDiv'>单击中国、省份或者城市返回到上层列表</div></td>"
        	             +"  </tr>"
        	             +"  <tr>"
        	             +"    <td>"
        	             +"        <div class='picker_cityList' id='list_province'></div>"
        	             +"        <div class='picker_cityList' id='list_city'></div>"
        	             +"        <div class='picker_cityList' id='list_county'></div>"
        	             +"    </td>"
        	             +"  </tr>"
        	             +"</table>");
            
        	 
        	  this._showProvinceList();
        	  $("#cn",this.root).click(this._showProvinceList);    
        	  
        	  if(options.container){
        	  	  options.container.append(this.root)
        	  }
        }
        
        
        this._showProvinceList=function(){
        	  $(".picker_levelItem:gt(0)",this.root).remove();    
        	  $(".picker_cityList",this.root).hide();        
        	  $("#list_province",this.root).show();
        	                 
        	  if(!$("#list_province",this.root).html()){
        	      $.each(Cities.country.subs,function(idx,province){
        	      	  var oProvince=$("<div class='picker_cityitem' id='"+province.id+"'>"+province.name+"</div>");
        	      	  $("#list_province",me.root).append(oProvince);
        	      	  oProvince.click(function(){
        	      	     var levelListItem_province=$("<div class='picker_levelItem' id='"+province.id+"'>/"+province.name+"</div>");
        	      	     $("#picker_levellist",me.root).append(levelListItem_province);
        	      	     levelListItem_province.click(function(){
        	      	     	  me._showCityList(province.id);
        	      	     })
        	      	     
        	      	     me._showCityList(province.id);
        	      	  })
        	      })
        	  }
        }
        
        this._showCityList=function(id){
        	  $(".picker_levelItem:gt(1)",this.root).remove();    
        	  $(".picker_cityList",this.root).hide();        
        	  $("#list_city",this.root).empty();
        	  $("#list_city",this.root).show();
        	  
        	  var province=Cities.getCityById(id);    	     	  
        	  $.each(province.subs,function(idx,city){
        	  	    var divCity=$("<div class='picker_cityitemcontainer'>"
        	      	                 +"<div class='picker_cityitem' id='"+city.id+"'>"+city.name+"</div>"
        	      	             +"</div>");
        	      	divCity.append(me._makeCheckboxObject(city));               
        	      	$("#list_city",me.root).append(divCity);
        	      	
        	      	$("#"+city.id,divCity).click(function(){
        	      	   var levelListItem_city=$("<div class='picker_levelItem' id='"+city.id+"'>/"+city.name+"</div>");
        	      	   $("#picker_levellist",me.root).append(levelListItem_city);
        	      	   levelListItem_city.click(function(){
        	      	   	  me._showcountyList(city.id);
        	      	   })
        	      	   
        	      	   me._showcountyList(city.id);
        	      	})
        	  })
        }
        
        this._showcountyList=function(id){
        	  $(".picker_levelItem:gt(2)",this.root).remove();    
        	  $(".picker_cityList",this.root).hide();        
        	  $("#list_county",this.root).empty();
        	  $("#list_county",this.root).show();
        	  
        	  var city=Cities.getCityById(id);    	     	  
        	  $.each(city.subs,function(idx,county){
        	  	    var divCounty=$("<div class='picker_cityitemcontainer'>"
        	      	                 +"<div class='picker_cityitem' id='"+county.id+"'>"+county.name+"</div>"
        	      	               +"</div>");
        	      	divCounty.append(me._makeCheckboxObject(county));               
        	      	$("#list_county",me.root).append(divCounty);
        	  })
        }
        
        this._makeCheckboxObject=function(city){
        	  var div=$("<div class='picker_checkbox' id='ckb_"+city.id+"'></div>");
        	  if(this._isSelected(city.id)){
        	      div.addClass("picker_checkbox_checked");	
        	  }
        	  div.click(function(){
        	  	  if($(this).hasClass("picker_checkbox_checked")){
        	  	  	  div.removeClass("picker_checkbox_checked");	
        	          me._delCityFromSelectedList(city)
        	      	  
        	      }else{
        	      	  div.addClass("picker_checkbox_checked");	
        	          me._appendCityToSelectedList(city)
        	      }
        	  })
        	  return div;
        }
        
        this._isSelected=function(id){
        	  var isSelected=false;
        	  $(".picker_selectedItem",$("td:first",this.root)).each(function(){
        	      var sid=$(this).attr("id");
        	      if(id==sid){
        	          isSelected=true;
        	          return;	
        	      }	
        	  })
        	  
        	  return isSelected;
        }
        
        this._appendCityToSelectedList=function(city){
        	  var selectedContainer=$("td:first",this.root);
        	  if($("#"+city.id,selectedContainer).length>0){
        	      return;	
        	  }
        	  
        	  var selectedItem=$("<div class='picker_selectedItem'  id='"+city.id+"'>"+city.name+"</div>");
        	  selectedItem.click(function(){
        	      $(this).remove();
        	      $("#ckb_"+city.id,this.root).removeClass("picker_checkbox_checked");	;
        	      return false;
        	  })
        	  
        	  selectedContainer.append(selectedItem);
        }
        
        this._delCityFromSelectedList=function(city){
        	  $("#"+city.id,$(".picker_selectedlist")).remove();
        	  $("#"+city.id,$("td:first",this.root)).remove();
        }
        
        this.value=function(){
        	  var v="",dot="";
        	  $(".picker_selectedItem",$("td:first",this.root)).each(function(){
        	  	  v+=dot+$(this).attr("id");
        	  	  dot=","
        	  })
        	  return v;
        }   
        this.init();
    }   
});