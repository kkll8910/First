package com.wdk.system;

import java.util.Date;

import com.weixin.util.WXUtil;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import net.sf.json.JSONObject;

public class GetAccessTokenThread extends Thread {
	private static Logger log = LogManager.getLogger(GetAccessTokenThread.class.getName());

	private String accessUrl;
	public static String AccessToken;
	public static int ExpiresIn;// 凭证有效时间，单位：秒

	public GetAccessTokenThread(SystemConfigration sc) {
		super();
		String appid=sc.getString(SystemConfigration.Configration_Weixinpublic_appID);
		String appSecret=sc.getString(SystemConfigration.Configration_Weixinpublic_appSecret);
		String urlOfGetAccessToken=sc.getString(SystemConfigration.Configration_Weixinpublic_Url_GetGlobalAccessToken);
		this.accessUrl = urlOfGetAccessToken.replace("APPID", appid).replace("APPSECRET", appSecret);
	}

	public void run() {
		while (true) {
			try {
				JSONObject obj = WXUtil.httpRequest(this.accessUrl, "GET", null);
				if (obj != null && obj.containsKey("access_token")) {
					AccessToken = obj.getString("access_token");
					ExpiresIn = obj.getInt("expires_in");
					Thread.sleep((ExpiresIn - 1200) * 1000);
					log.info("{}:获取到新的AccessToken：{}", new Date(),AccessToken);
				} else {
					Thread.sleep(60*1000);
					log.error("{}:在获取AccessToken时发生错误，未能取到该值。", new Date());
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
