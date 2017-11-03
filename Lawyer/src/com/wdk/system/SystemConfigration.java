package com.wdk.system;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;

import com.wdk.util.DB;
import com.wdk.util.V;

public class SystemConfigration {
	public static final String NameInContext = "SystemConfigration";
	
	public static final String Configration_UploadDirectroyURI="UploadDirectroyURI";
	public static final String Configration_ForbiddenPattens="forbiddenPattens";
	public static final String Configration_Domain="Domain";
	public static final String Configration_Weixinpublic_appID="Weixinpublic_appID";
	public static final String Configration_Weixinpublic_appSecret="Weixinpublic_appSecret";
	public static final String Configration_Weixinpublic_AuthRedirectURI="Weixinpublic_AuthRedirectURI";
	public static final String Configration_Weixinpublic_State="Weixinpublic_State";
	public static final String Configration_Weixinpublic_Token="Weixinpublic_Token";
	public static final String Configration_Weixinpublic_Url_GetGlobalAccessToken="Weixinpublic_Url_GetGlobalAccessToken";
	public static final String Configration_Weixinpublic_Url_GetJSApiTicket="Weixinpublic_Url_GetJSApiTicket";
	public static final String Configration_Weixinpublic_Url_GetOAuth2AccessToken="Weixinpublic_Url_GetOAuth2AccessToken";
	public static final String Configration_Weixinpublic_Url_GetUserMessage="Weixinpublic_Url_GetUserMessage";
	public static final String Configration_Weixinpublic_Url_OAuth="Weixinpublic_Url_OAuth";
	public static final String Configration_Unit_PriceOfPublishUnit="unit_PriceOfPublishUnit";
	
	private ContentFilter contentFilter;
	
	private ArrayList<Hashtable<String, String>> parameters = null;

	public SystemConfigration(DB data) {
		DB db = (data == null) ? new DB() : data;
		String sql = "select * from wx_systemconfiguration";
		try {
			this.parameters = db.query(sql, null);
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (data == null) {
				db.close();
			}
		}
	}

	
	public static SystemConfigration getInstance(HttpServletRequest request) {
		return (SystemConfigration) request.getServletContext().getAttribute(NameInContext);
	}

	

	public String getString(String key) {
		Iterator<Hashtable<String, String>> itea = this.parameters.iterator();
		while (itea.hasNext()) {
			Hashtable<String, String> h = itea.next();
			if (h.get("configuration_key").equals(key)) {
				return h.get("configuration_value");
			}
		}
		return null;
	}

	public int getInt(String key){
		Iterator<Hashtable<String, String>> itea = this.parameters.iterator();
		while (itea.hasNext()) {
			Hashtable<String, String> h = itea.next();
			if (h.get("configuration_key").equals(key)) {
				if(h.get("configuration_type").equals("int")){
					return V.parseInt(h.get("configuration_value"));
				}else{
					return -1;
				}
				
			}
		}
		return -1;
	}
	
	public float getFloat(String key){
		Iterator<Hashtable<String, String>> itea = this.parameters.iterator();
		while (itea.hasNext()) {
			Hashtable<String, String> h = itea.next();
			if (h.get("configuration_key").equals(key)) {
				if(h.get("configuration_type").equals("float")){
					return V.parseFloat(h.get("configuration_value"));
				}else{
					return -1;
				}
			}
		}
		return -1;
	}


	public ContentFilter getContentFilter() {
		if(this.contentFilter==null){
			this.contentFilter=new ContentFilter(this.getString(Configration_ForbiddenPattens));
		}
		return contentFilter;
	}
	
}
