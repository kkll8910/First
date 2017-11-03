package com.wdk.system;

import java.util.ArrayList;
import java.util.Hashtable;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class SystemNotifies {
	public static final String NameInContext="SystemNotifies";
	
	public static final String NotifyType_RoleHasBeenCreated="RoleHasBeenCreated";

	
	
	Hashtable<String, ArrayList<Notify>> notifies = new Hashtable<String, ArrayList<Notify>>();

	
	
	public SystemNotifies() {
		super();
		// TODO Auto-generated constructor stub
	}


	public static SystemNotifies getInstance(HttpServletRequest request) {
		return (SystemNotifies) request.getServletContext().getAttribute(NameInContext);
	}
	
	public void addNotify(String user,String type,JSONObject jsonObj){
		ArrayList<Notify> list=this.notifies.get(user);
		if(list==null){
			list=new ArrayList<Notify>();
			this.notifies.put(user, list);
		}
		list.add(new Notify(type, jsonObj));
	}
	
	public JSONArray getNotify(String user){
		ArrayList<Notify> list=this.notifies.get(user);
		if(list==null){
			return null;
		}else{
			JSONArray res=JSONArray.fromObject(list);
			this.notifies.remove(user);
			return res;
		}
	}
	

	public class Notify {
		private String type;
		private JSONObject notify;

		public Notify(String type, JSONObject notify) {
			super();
			this.type = type;
			this.notify = notify;
		}

		public String getType() {
			return type;
		}

		public JSONObject getNotify() {
			return notify;
		}
	}
}
