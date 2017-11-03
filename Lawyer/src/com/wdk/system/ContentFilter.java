package com.wdk.system;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.wdk.util.V;

public class ContentFilter {
	private ArrayList<String> patterns=new ArrayList<String>();
	
	public ContentFilter(String ps) {
		if(!V.isBlank(ps)){
			String[] patt = ps.split("\\|");
			for(String p:patt){
				this.patterns.add(p);
			}
		}
	}

	public String[] filter(String str){
    	if(V.isBlank(str)){
    	    return null;	
    	}
    	
    	ArrayList<String> list=new ArrayList<String>();
    	
    	for(String p :this.patterns){
    		Matcher m = Pattern.compile(p).matcher(str);
        	while(m.find()){
        		list.add(m.group());
        	}
    	}
    	
    	if(list.isEmpty()){
    	    return null;	
    	}else{
    		return (String[])list.toArray(new String[list.size()]);
    	}
    } 
}
