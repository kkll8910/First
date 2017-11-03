require.config({
    baseUrl: '/js',
    paths: {
    	jquery:"jquery-2.1.4.min",
      Cities:"wdk/city/Cities",
      CitySelector:"wdk/city/CitySelector",
      Pane:["util/Pane"]
    },
    shim: {
        jqMobile:{deps:['jquery']},
        Pane:{deps:['jquery']},
        CitySelector:{deps:['jquery','Cities']}
    }
});

requirejs(["Pane","Cities","CitySelector"],function(Pane,Cities,CitySelector) {
    $(document).ready(function(){
    	         	
       	var cs=new CitySelector({
	 	   	    provinceSelector:$("#provinceSelector"),
	 	   	    citySelector:$("#citySelector"),
	 	   	    countySelector:$("#countySelector")
	 	    })
       	
       	
        
        var init=function(){
            $("[type='Pane']").each(function(){
                new Pane({root:$(this)});	
            })
            
            
        }
        
        init();
        $(window).resize();
    })
});

                                                                        