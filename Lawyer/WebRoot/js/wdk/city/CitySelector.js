define(["Cities"],function(Cities) {
      
    return function(options){
    	  var me=this;
     	  options=options || {};
        
        this.init=function(){   
        	  this.level=options.level || 3;
        	  this.ProvinceSelector=options.provinceSelector;
        	  this.CitySelector=options.citySelector;
        	  this.CountySelector=options.countySelector;
        	  
        	  $.each(Cities.country.subs,function(){
        	  	  var oProvince=$("<option value='"+this.id+"'>"+this.name+"</option>");
        	  	  me.ProvinceSelector.append(oProvince);
        	  })
        	  
        	  this.ProvinceSelector.change(function(){
        	  	 me._setCityList($(this).val())
        	  })
        	  
        	  if(options.id){
        	      this.val(options.id);
        	  }
        }
        
        
        
        
        this._setCityList=function(id){
        	  this._refresh(this.CitySelector);
        	  this._refresh(this.CountySelector);
        	  
        	  
        	  
        	  this.CitySelector.append("<option></option>");
        	  var province=Cities.getCityById(id);    	     	  
        	  $.each(province.subs,function(){
        	  	  var oCity=$("<option value='"+this.id+"'>"+this.name+"</option>");
        	  	  me.CitySelector.append(oCity);  
        	  })
        	  this.CitySelector.change(function(){
        	  	  var cid=$(this).val();
        	  	  if(cid){
        	  	  	  me._setCountyList(cid);
        	  	  }else{
        	  	      me.CountySelector.empty();	
        	  	  }
        	  })
        }
        
        this._setCountyList=function(id){
        	  this._refresh(this.CountySelector);
        	  this.CountySelector.append("<option></option>");
        	  var city=Cities.getCityById(id); 
        	  $.each(city.subs,function(){
        	  	  var oCounty=$("<option value='"+this.id+"'>"+this.name+"</option>");
        	  	  me.CountySelector.append(oCounty);  
        	  })   	
        }
        
        this._refresh=function(obj){
        	  obj[0].selectedIndex=0;
        	  obj.empty();
        }
        
        this.val=function(id){
        	  if(id){
        	  	  var provinceID=id.substring(0,6);
        	  	  $("option[id='"+provinceID+"']",this.ProvinceSelector).attr("selected",true);
        	  	  this._setCityList(provinceID);
        	  	  
        	  	  if(id.length>=9){
        	  	  	  var cityID=id.substring(0,9);
        	  	      $("option[id='"+cityID+"']",this.CitySelector).attr("selected",true);
        	  	      this._setCityList();	
        	  	      if(id.length==12){
        	  	          $("option[id='"+id+"']",this.CountySelector).attr("selected",true);
        	  	      }
        	  	  }
        	  }else{
        	      if(this.level==1 && !this.ProvinceSelector.val()){
        	          return;
        	      }
        	      
        	      if(this.level==2 && !this.CitySelector.val()){
        	          return;
        	      }
        	      
        	      if(this.level==3 && !this.CountySelector.val()){
        	          return;
        	      }
        	      
        	      return this.CountySelector.val() || this.CitySelector.val() || this.ProvinceSelector.val();
        	  }
        }   
        this.init();
    }   
});