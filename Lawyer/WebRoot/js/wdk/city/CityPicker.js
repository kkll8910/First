define(["Cities","css!wdk/city/css/CityPicker.css"],function(Cities) {
      
    return function(options){
    	  var me=this;
     	  options=options || {};
        this.ReferenceDom=options.ReferenceDom;
        
        this.init=function(){   
        	  this.root=$('<div data-role="popup" data-overlay-theme="b" data-theme="b" data-dismissible="true" style="max-width:600px;z-index:100">'
                       +"    <div id='picker_levellist'><div class='picker_levelItem' id='cn'>中国</div></div>"
        	             +"    <div class='picker_cityList' id='list_province'></div>"
        	             +"    <div class='picker_cityList' id='list_city'></div>"
        	             +"    <div class='picker_cityList' id='list_county'></div>"
        	             +'</div>');
            
        	  this.root.popup();
        	   
        	  this._showProvinceList();
        	  $("#cn",this.root).click(this._showProvinceList);    
        	  
        	  if(this.ReferenceDom){
        	  	  this.ReferenceDom.addClass("Reference");
        	      this.ReferenceDom.click(function(){
        	      	  var left=options.ReferenceDom.offset().left;
        	      	  
        	          var top=Math.floor(options.ReferenceDom.offset().top+options.ReferenceDom.height()+90);
        	         
        	          me.root.popup("option","positionTo","#"+options.ReferenceDom.attr("id"))
        	          me.root.popup("open");
        	      })
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
        	  	    var divCity=$("<div class='picker_cityitemcontainer' title='注意：单击进入下一级行政区，双击选择该城市。'>"
        	      	                 +"<div class='picker_cityitem' id='"+city.id+"'>"+city.name+"</div>"
        	      	             +"</div>");
        	      	$("#list_city",me.root).append(divCity);
        	      	
        	      	divCity.dblclick(function(){
        	      		
        	      	})
        	      	
        	      	
        	      	
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
        	  $(".picker_selectedItem",this.ReferenceDom).each(function(){
        	      var sid=$(this).attr("id");
        	      if(id==sid){
        	          isSelected=true;
        	          return;	
        	      }	
        	  })
        	  
        	  return isSelected;
        }
        
        
        this._appendCityToSelectedList=function(city){
        	  if($("#"+city.id,this.ReferenceDom).length>0){
        	      return;	
        	  }
        	  
        	  var selectedItem=$("<div class='picker_selectedItem'  id='"+city.id+"'>"+city.name+"</div>");
        	  selectedItem.click(function(){
        	      $(this).remove();
        	      $("#ckb_"+city.id,this.root).removeClass("picker_checkbox_checked");	;
        	      return false;
        	  })
        	  
        	  if(this.ReferenceDom){
        	  	
        	  	options.ReferenceDom.append(selectedItem)
        	  }
        }
        
        this._delCityFromSelectedList=function(city){
        	  $("#"+city.id,$(".picker_selectedlist")).remove();
        	  if(this.ReferenceDom){
        	  	$("#"+city.id,this.ReferenceDom).remove();
        	  }
        }
        
        this.value=function(){
        	  var v="",dot="";
        	  $(".picker_selectedItem",this.ReferenceDom).each(function(){
        	  	  v+=dot+$(this).attr("id");
        	  	  dot=","
        	  })
        	  return v;
        }   
        this.init();
    }   
});