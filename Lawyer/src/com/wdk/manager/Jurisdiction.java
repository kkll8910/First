package com.wdk.manager;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class Jurisdiction {
	public static final String NameOfJurisdiction_Review = "Review";
	public static final String NameOfJurisdiction_SuperManager = "SuperManager";
	private JSONArray jurisdiction = null;
	
	public Jurisdiction(String jurisdiction) {
		super();
		try {
			this.jurisdiction=JSONArray.fromObject(jurisdiction);
		} catch (Exception e) {
			// TODO: handle exception
		}
	}
	
	
	public boolean isSuperManager() {
		return this.getJurisdiction(Jurisdiction.NameOfJurisdiction_SuperManager) != null;
	}

	public JSONObject getJurisdiction(String name) {
		if (this.jurisdiction == null || this.jurisdiction.size() <= 0) {
			return null;
		}

		JSONObject res = null;
		for (int i = 0; i < this.jurisdiction.size(); i++) {
			JSONObject obj = this.jurisdiction.getJSONObject(i);
			if (obj.containsKey("name") && obj.getString("name").equals(name)) {
				res = obj;
				break;
			}
		}

		return res;
	}

	/**
	 * @return 返回该管理员具备哪些城市的文档审核权限，超级管理员具有所有城市的审核权
	 */
	public String[] getCitiesOfReviewJurisdiction() {
		if (this.isSuperManager()) {
			return new String[] { "001" };
		} else {
			JSONObject obj = this.getJurisdiction(Jurisdiction.NameOfJurisdiction_Review);
			if (obj != null) {
				String s = obj.getString("Cities");
				return s.split(",");
			} else {
				return null;
			}
		}
	}


	public JSONArray getJurisdiction() {
		return jurisdiction;
	}	
}
