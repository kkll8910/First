package com.wdk.system;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.wdk.user.User;

public class WeixinFilter implements Filter {
	private SystemConfigration sc;
	private String authUrl;

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain fc) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;
		HttpSession session = request.getSession();
		User user = User.get(request);
		
		String userAgent = request.getHeader("user-agent").toLowerCase();
		if (userAgent == null || userAgent.indexOf("micromessenger") == -1) {// 检测请求是否来自微信客户端
			request.setAttribute("Error", "NotFromWeixinBrowser");
			request.getRequestDispatcher("/Error.jsp").forward(request, response);
		} else if (user != null) {//用户已经登录
			session.removeAttribute("Page");
			fc.doFilter(req, res);
			return;
		} else {//微信验证
			String page = request.getRequestURI().toString();
			session.setAttribute("Page", page);
			response.sendRedirect(this.authUrl);
		}

	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		this.sc = (SystemConfigration) arg0.getServletContext().getAttribute(SystemConfigration.NameInContext);
		try {
			String encodeRedirectUrl = java.net.URLEncoder.encode(sc.getString(SystemConfigration.Configration_Domain) + sc.getString(SystemConfigration.Configration_Weixinpublic_AuthRedirectURI),"utf-8");
			this.authUrl = sc.getString(SystemConfigration.Configration_Weixinpublic_Url_OAuth).replace("APPID", sc.getString(SystemConfigration.Configration_Weixinpublic_appID)).replace("REDIRECT_URI", encodeRedirectUrl);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}
}
