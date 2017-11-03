package com.wdk.system;

import java.util.Date;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import net.sf.json.JSONException;
import net.sf.json.JSONObject;

import com.weixin.util.WXUtil;

public class GetJSApiTicketThread  extends Thread{
	private static Logger log = LogManager.getLogger(GetJSApiTicketThread.class.getName());
	public static String JSTicket;
	public static int ExpiresIn;
	private SystemConfigration sc;
	
	public GetJSApiTicketThread(SystemConfigration sc) {
		super();
		this.sc = sc;
	}

	public void run() {
		while (true) {
			try {
				if (GetAccessTokenThread.AccessToken != null) {
					String UrlOfGetJSApiTicket=sc.getString(SystemConfigration.Configration_Weixinpublic_Url_GetJSApiTicket);
					String url=UrlOfGetJSApiTicket.replace("ACCESS_TOKEN", GetAccessTokenThread.AccessToken);
					JSONObject obj = WXUtil.httpRequest(url, "GET", null);
					if (obj!=null && obj.containsKey("ticket")) {
					   JSTicket=obj.getString("ticket");
					   ExpiresIn = obj.getInt("expires_in");
					   Thread.sleep((ExpiresIn - 1200) * 1000);
					}
				}else{
					Thread.sleep(60*1000);
				}	
			} catch (InterruptedException e) {
				try {
					Thread.sleep(60 * 1000);
				} catch (InterruptedException e1) {
					e1.printStackTrace();
				}				
			}
		}
	}
}
