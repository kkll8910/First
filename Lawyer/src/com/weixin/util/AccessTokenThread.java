package com.weixin.util;

import net.sf.json.JSONException;
import net.sf.json.JSONObject;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class AccessTokenThread implements Runnable {
	private static Logger log = LogManager.getLogger(AccessTokenThread.class.getName());
	public static String UrlOfGetAccessToken;
	public static String UrlOfGetJSApiTicket;
	public static String AccessToken;
	public static String JSApiTicket;

	// 凭证有效时间，单位：秒
	public static int ExpiresIn;

	public void run() {
		while (true) {
			try {
				JSONObject jsonObject = WXUtil.httpRequest(UrlOfGetAccessToken, "GET", null);
				if (jsonObject != null) {
					if (jsonObject.containsKey("access_token")) {
						AccessToken = jsonObject.getString("access_token");
						ExpiresIn = jsonObject.getInt("expires_in");
					}

				} else {
					AccessToken = null;
				}

				if (AccessToken != null) {
					//获取jsapi_ticket
					UrlOfGetJSApiTicket=UrlOfGetJSApiTicket.replace("ACCESS_TOKEN", AccessToken);
					JSONObject ticketObject = WXUtil.httpRequest(UrlOfGetJSApiTicket, "GET", null);
					if (ticketObject != null) {
						if (ticketObject.containsKey("ticket")) {
							JSApiTicket= ticketObject.getString("ticket");
							Thread.sleep((ExpiresIn - 200) * 1000);
						}else{
							JSApiTicket=null;
							Thread.sleep(60 * 1000);
						}
					}					
				} else {
					if (jsonObject.has("errcode") && jsonObject.has("errmsg")) {
						log.error("从微信服务器获取access_token失败： errcode:{} errmsg:{}，60秒后系统会再次请求。", jsonObject.getInt("errcode"), jsonObject.getString("errmsg"));
					}
					Thread.sleep(60 * 1000);
				}
			} catch (JSONException e) {
				AccessToken = null;
				log.error("从微信服务器获取access_token失败！");
			} catch (InterruptedException e) {
				log.error("access_token获取失败:{}", e);
				try {
					Thread.sleep(60 * 1000);
				} catch (InterruptedException e1) {
					e1.printStackTrace();
				}				
			}
		}
	}

}
