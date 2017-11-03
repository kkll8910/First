package com.wdk.user;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.Hashtable;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import com.wdk.util.DB;
import com.wdk.util.Parameter;
import com.wdk.util.V;

public class Enrol extends HttpServlet {

	/**
	 * Constructor of the object.
	 */
	public Enrol() {
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
		User user = User.get(request);
		HttpSession session = request.getSession();

		String username = request.getParameter("username");
		String password = request.getParameter("password");
		int sex = V.parseInt(request.getParameter("sex"));
		String valid = request.getParameter("valid");
		String validInsession=(String)session.getAttribute("EnrolValid");
        
		if((!V.isMobile(username) && !V.isEmail(username))  || !V.isPassword(password, 6, 16) || (sex!=1 && sex!=2) || V.isBlank(valid) || V.isBlank(validInsession)){
			return;
		}
		
		JSONObject res=new JSONObject();
		
		
		if (user != null) {
            res.put("Failure", "AnUserHasBeenLogin");
		}else if(!valid.equals(validInsession)){
			res.put("Failure", "valid");
		}else{
			String sql="insert into wx_user(user_username,user_password,user_sex,user_date) values (?,?,?,?)";
	        Parameter[] para=new Parameter[]{
	        		 new Parameter(username),
	        		 new Parameter(password),
	        		 new Parameter(sex),
	        		 new Parameter(System.currentTimeMillis())
	        };
			
	        DB db=new DB();
	        try {
	            if(db.update(sql,para)>0){
	                Hashtable<String, String> h=db.queryOne(
	                		"select * from wx_user where user_username=?",
	                		new Parameter[]{new Parameter(username)}
	                );
	                //登录成功------------------
	                user=User.parse(h);
	                session.setAttribute(User.NameInSession, user);
	                session.removeAttribute("EnrolValid");
	                res.put("User", user);
	            }
	        } catch (SQLException e) {
	        	res.put("Failure", "UsernameHasExist");
	        }finally{
	            db.close();
	        }
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
		// Put your code here
	}

}
