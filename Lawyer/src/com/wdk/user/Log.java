package com.wdk.user;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import com.wdk.unit.Unit;
import com.wdk.util.DB;
import com.wdk.util.Parameter;
import com.wdk.util.V;

public class Log extends HttpServlet {

	/**
	 * Constructor of the object.
	 */
	public Log() {
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
	 * This method is called when a form has its tag value method equals to post.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		User user = User.get(request);
		HttpSession session = request.getSession();

		String username = request.getParameter("username");
		String password = request.getParameter("password");
		
		if((!V.isMobile(username) && !V.isEmail(username))  || !V.isPassword(password, 6, 16)){
			return;
		}
		
		
		JSONObject res=new JSONObject();
		if(user!=null){
			res.put("Failure", "UserHasLog");
		}else{
			user = this.getUserByUsername(username, password);
			if (user == null) {
				res.put("Failure", "UsernameOrPassword");
			} else {
				session.setAttribute(User.NameInSession, user);
                res.put("User", user);
                
                ArrayList<Unit> list=Unit.getMyUnit(user.getId());
    			if(list!=null && !list.isEmpty()){
    				res.put("Units", list);
    			}
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
	 * @throws ServletException if an error occurs
	 */
	public void init() throws ServletException {
		// Put your code here
	}
	
	
    private User getUserByUsername(String username,String password){
    	DB db=new DB();
        User user=null;
        try {
            Hashtable<String, String> h=db.queryOne("select * from wx_user where user_username=? and user_password=?", new Parameter[]{
            		new Parameter(username),
            		new Parameter(password)
            });
            user=User.parse(h);
        } catch (SQLException e) {
            e.printStackTrace();
        }finally{
            db.close();
        }
        return user;
    }
}
