package com.weixin.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.weixin.util.AccessTokenThread;
import com.weixin.util.WXUtil;

import net.sf.json.JSONObject;

public class getSignOfJSApi extends HttpServlet {

	private String domain;
    private String appid;
	/**
	 * Constructor of the object.
	 */
	public getSignOfJSApi() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	/**
	 * The doPost method of the servlet. <br>
	 * 
	 * This method is called when a form has its tag value method equals to
	 * post.
	 * 
	 * @param request
	 *            the request send by the client to the server
	 * @param response
	 *            the response send by the server to the client
	 * @throws ServletException
	 *             if an error occurred
	 * @throws IOException
	 *             if an error occurred
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject res = new JSONObject();
		String url = request.getScheme()+"://"+request.getServerName()+request.getContextPath()+request.getServletPath();
		
		if (AccessTokenThread.JSApiTicket != null) {
			Map<String, String> ret = WXUtil.sign(AccessTokenThread.JSApiTicket, url);
			ret.put("appId", this.appid);
			res.put("Sign", ret);
		}else{
			res.put("Failure", "Can not get jsapi_ticket!");
		}
		
		response.setContentType("text/javascript; charset=utf-8");
		response.setCharacterEncoding("utf-8");
		PrintWriter out = response.getWriter();
		out.print(res.toString());
		out.flush();
	}

	/**
	 * Initialization of the servlet. <br>
	 * 
	 * @throws ServletException
	 *             if an error occurs
	 */
	public void init() throws ServletException {
		ServletContext context=this.getServletContext();
		this.domain=context.getInitParameter("Domain")+"wx/shareGuangGao.jsp";
		
		this.appid=context.getInitParameter("AppID");
	}

}
