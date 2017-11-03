package com.wdk.util;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class Parameter {
	public static final String ParameterType_String="String";
	public static final String ParameterType_Int="Int";
	public static final String ParameterType_Long="Long";
	public static final String ParameterType_Float="Float";
	public static final String ParameterType_Bit="Bit";
	
    private String type="";
    private String value="";
    
	public Parameter(String type, String value) {
		super();
		this.type = type;
		this.value = value;
	}
	
	
	public Parameter(boolean value){
		this.type=ParameterType_Bit;
		this.value=(value)?"1":"0";
	}
	
	public Parameter(float value) {
		super();
		this.type = ParameterType_Float;
		this.value = value+"";
	}
	
	public Parameter(long value) {
		super();
		this.type = ParameterType_Long;
		this.value = value+"";
	}
	
	public Parameter(int value) {
		super();
		this.type = ParameterType_Int;
		this.value = value+"";
	}
	
	
	public Parameter(String value) {
		this.type="String";
		this.value = value;
	}

	public Parameter(JSONObject value) {
		this.type="String";
		this.value = value.toString();
	}
	
	
	public Parameter(JSONArray value) {
		this.type="String";
		this.value = value.toString();
	}
	
	public String getType() {
		return type;
	}

	public String getValue() {
		return value;
	}
}
