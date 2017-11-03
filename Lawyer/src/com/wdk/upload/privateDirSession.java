package com.wdk.upload;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import com.wdk.system.SystemConfigration;
import com.wdk.util.V;
import com.wdk.user.User;

public class privateDirSession extends HttpServlet {
    private String privateDirectroyURI="/PrivateDirectory/";
	/**
	 * Constructor of the object.
	 */
	public privateDirSession() {
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
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String flag = request.getParameter("RequestFlag");
        if (V.isBlank(flag)) {
                return;
        }

        JSONObject result = new JSONObject();

        if (flag.equals("FileManage_getList")) {
            result = this.getFileList(request, response);
        }

        response.setContentType("text/javascript; charset=utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter out = response.getWriter();
        out.print(result.toString());
        out.flush();
}

	
        
private JSONObject getFileList(HttpServletRequest request, HttpServletResponse response) {
        JSONObject res = new JSONObject();
        String type = request.getParameter("type");
        
        
        User user=(User)request.getSession().getAttribute("User");
        if(user==null){
        	return res;
        }
        
        String path=this.privateDirectroyURI + "/" +user.getId()+ "/";
        
       
        if(path==null){return res;}
        
        String[] fileTypes = new String[] { "gif", "jpg", "jpeg", "png" };
        String RealPath = request.getSession().getServletContext().getRealPath(path);
        File folder = new File(RealPath);
        if (!folder.exists() ||  !folder.isDirectory()) {
                return res;
        }

        // 遍历目录取的文件信息
        List<Hashtable> fileList = new ArrayList<Hashtable>();
        if (folder.listFiles() != null) {
                for (File file : folder.listFiles()) {
                        Hashtable<String, Object> hash = new Hashtable<String, Object>();
                        String fileName = file.getName();
                        if (file.isFile()) {
                                String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
                                if (Arrays.<String> asList(fileTypes).contains(fileExt)) {
                                        hash.put("url", path+ fileName);
                                        hash.put("size", file.length());
                                        hash.put("name", fileName);
                                        hash.put("datetime", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(file.lastModified()));
                                        fileList.add(hash);
                                }
                        }
                }
        }

        
        
        res.put("pictures", fileList);

        return res;
}


	/**
	 * Initialization of the servlet. <br>
	 *
	 * @throws ServletException if an error occurs
	 */
	public void init() throws ServletException {
		SystemConfigration sc=(SystemConfigration)this.getServletContext().getAttribute(SystemConfigration.NameInContext);
		this.privateDirectroyURI=sc.getString("PrivateDirectroyURI");
	}

}
