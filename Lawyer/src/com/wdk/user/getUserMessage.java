package com.wdk.user;

import java.io.IOException;
import java.sql.SQLException;




import java.util.Hashtable;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;







import net.sf.json.JSONObject;

import com.wdk.item.Item;
import com.wdk.system.SystemConfigration;
import com.wdk.util.DB;
import com.wdk.util.Parameter;
import com.wdk.util.V;
import com.weixin.util.WXUtil;

public class getUserMessage extends HttpServlet {

	private SystemConfigration sc;
	private String AuthAccessTokenURL;
    private String URLOfGetUserMessage;
	public getUserMessage() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();
		
		// 微信传过来的获取用户信息的凭证
		String code = request.getParameter("code");
		String state = request.getParameter("state");
		
		
		//从微信获取用户openid和access_token
		String url = this.AuthAccessTokenURL.replace("CODE", code);
		JSONObject res = WXUtil.httpRequest(url, "GET", null);
		
		if (res != null && res.containsKey("access_token") && res.containsKey("openid")) {
			//从微信获取用户详细信息
			String accessToken=res.getString("access_token");
            String openid=res.getString("openid");
            String msgUrl=URLOfGetUserMessage.replace("ACCESS_TOKEN",accessToken).replace("OPENID", openid);
            
            JSONObject infoRes = WXUtil.httpRequest(msgUrl,"GET", null);
            if(infoRes!=null && infoRes.containsKey("unionid")){
            	String unionid=infoRes.getString("unionid");
            	
            	String page = (String) session.getAttribute("Page");
            	
				User user = this.geUser(infoRes);
				if (user != null) {
					session.setAttribute(User.NameInSession, user);
					if (!V.isBlank(page)) {
						request.getRequestDispatcher(page).forward(request, response);
						session.removeAttribute("Page");
					}
				}else{
					request.setAttribute("Error", "GetUserMessageError");
	    			request.getRequestDispatcher("/Error.jsp").forward(request, response);
				}
				
            }else{
            	request.setAttribute("Error", "GetUserMessageError");
    			request.getRequestDispatcher("/Error.jsp").forward(request, response);
            }
		}else{
			request.setAttribute("Error", "GetAccessTokenError");
			request.getRequestDispatcher("/Error.jsp").forward(request, response);
		}
		
	}
	
	private User geUser(JSONObject obj) {
		if (obj == null || obj.isEmpty() || !obj.containsKey("unionid")) {
			return null;
		}

		String unionid = obj.getString("unionid");
		DB db = new DB();
		User user = User.getUserByUnionID(unionid, db);
		if (user == null) {
			// 创建新用户被
			int sex = obj.containsKey("sex") ? obj.getInt("sex") : 0;
			String nickname = obj.containsKey("nickname") ? obj.getString("nickname") : null;
			String headimgurl = obj.containsKey("headimgurl") ? obj.getString("headimgurl") : null;
			int id = User.add(db, unionid, nickname, sex, headimgurl);
			
			
			if (id >= 0) {
				// 将用户的其它属性保存到Item当中
				String province = obj.containsKey("province") ? obj.getString("province") : null;
				String city = obj.containsKey("city") ? obj.getString("city") : null;
				String country = obj.containsKey("country") ? obj.getString("country") : null;

				if (province != null) {
					Item.add(db, Item.Catagory_User, id, null, User.Item_Key_Province, province, Item.Type_String);
				}

				if (city != null) {
					Item.add(db, Item.Catagory_User, id, null, User.Item_Key_City, city, Item.Type_String);
				}

				if (country != null) {
					Item.add(db, Item.Catagory_User, id, null, User.Item_Key_Country, country, Item.Type_String);
				}
				user = User.getUserByUnionID(unionid, db);
			}
		}

		db.close();
		return user;
	}
	
	
	public void init() throws ServletException {
		this.sc = (SystemConfigration) this.getServletContext().getAttribute(SystemConfigration.NameInContext);
		String appid=sc.getString(SystemConfigration.Configration_Weixinpublic_appID);
		String appSecret=sc.getString(SystemConfigration.Configration_Weixinpublic_appSecret);
		this.AuthAccessTokenURL = sc.getString(SystemConfigration.Configration_Weixinpublic_Url_GetOAuth2AccessToken).replace("APPID", appid).replace("SECRET", appSecret);
		this.URLOfGetUserMessage=this.sc.getString(SystemConfigration.Configration_Weixinpublic_Url_GetUserMessage);
	}
}
