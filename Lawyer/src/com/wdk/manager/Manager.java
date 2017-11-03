package com.wdk.manager;

import javax.servlet.http.HttpServletRequest;

public class Manager {
	public static final String NameInSessionAttr = "Manager";
	
	private String id = "";
	private String mobile = "";
	private String name = "";
	private Jurisdiction jurisdiction = null;

	public Manager(String id, String mobile, String name, String jurisdiction) {
		super();
		this.id = id;
		this.mobile = mobile;
		this.name = name;
		this.jurisdiction = new Jurisdiction(jurisdiction);
	}

	public static Manager get(HttpServletRequest request) {
		return (Manager) request.getSession().getAttribute(Manager.NameInSessionAttr);
	}

	public String getId() {
		return id;
	}

	public String getMobile() {
		return mobile;
	}

	public String getName() {
		return name;
	}

	public Jurisdiction getJurisdiction() {
		return jurisdiction;
	}
}
