package com.wdk.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;


public class Table {
	private String table;
	private String shortName;
	private String sql;
	private String[] column;
	private String wrap="\r\n";
	private Hashtable discriptions=new Hashtable();
	
	
	private String temp="";
	private String form="";
	private String html="";
	private String javascript="";
	private String servlet="";
	
	private String mdy="";
	
	public Table(String table){
		this.table=table;
		
		int idx=table.indexOf("_");
		this.shortName = (idx>=0) ? table.substring(idx+1,table.length()) : table;
		
		this.sql="select * from "+this.table;
		this.getColumnName();
		this.getDiscriptions();
		this.makeTempClass();
		this.makeForm();
		this.makeHtml();
		this.makeJavaScript();
		this.makeServlet();
		this.makeDdyMothod();
	}
	
	public void getColumnName() {
		Connection conn = new DB().getConnection();
		PreparedStatement psmt = null;
		ResultSet rs = null;
		ResultSetMetaData rsmd = null;

		try {
			psmt = conn.prepareStatement(sql);
			rs = psmt.executeQuery();
			rsmd = rs.getMetaData();
		    int columnCount = rsmd.getColumnCount();
		    this.column = new String[columnCount];
			for (int i = 1; i <= columnCount; i++)
				this.column[i-1] = rsmd.getColumnName(i);
		} catch (SQLException e) {
			try {
				rs.close();
				psmt.close();
				if (conn.getAutoCommit())
					conn.close();
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		} finally {
			try {
				rs.close();
				psmt.close();
				conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	private void getDiscriptions(){
		String sql="SELECT * FROM ::fn_listextendedproperty (NULL, 'user', 'dbo', 'table', '"+this.table+"', 'column', default)";
		DB db=new DB();
		try {
			ArrayList list=db.query(sql,null);
			for(int i=0;i<list.size();i++){
				Hashtable h=(Hashtable)list.get(i);
				String objname=(String)h.get("objname");
				String value=(String)h.get("value");
				this.discriptions.put(objname, value);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			db.close();
		}
	}
	
	private String tab(int len){
		String space="";
		for(int i=0;i<len;i++){
			space+="    ";
		}
		return space;
	}
	
	public static String[] getAllTable(){
		String sql="SELECT name From sysobjects WHERE xtype = 'u'";
		DB db=new DB();
		String[] tablenames=null;
		try {
			ArrayList l = db.query(sql,null);
			if(!l.isEmpty()){
				tablenames=new String[l.size()];
				for(int i=0;i<l.size();i++){
					Hashtable h=(Hashtable)l.get(i);
					tablenames[i]=(String)h.get("name");
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			db.close();
		}
		return tablenames;
	}
	
	public void makeTempClass(){
		StringBuffer sb=new StringBuffer();
		sb.append("package com.wdk."+this.wrap);
		
		sb.append("import java.sql.SQLException;"+this.wrap);
		sb.append("import java.util.ArrayList;"+this.wrap);
		sb.append("import java.util.Hashtable;"+this.wrap);
		sb.append("import com.wdk.db.DB;"+this.wrap);
		sb.append(this.wrap);
		
		String className=this.shortName.substring(0,1).toUpperCase()+this.shortName.substring(1,this.shortName.length());
		sb.append("public class "+className+"{"+this.wrap);
		
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			sb.append(this.tab(1)+"private String "+columnname+"=\"\";"+this.wrap);
		}
		
		sb.append(this.wrap);
		sb.append(this.tab(1)+"public "+className+"(String id,DB data) {"+this.wrap);
		sb.append(tab(2)+"this.id=id;"+this.wrap);
		sb.append(tab(2)+"DB db=(data==null)?new DB():data;"+this.wrap);
		sb.append(tab(2)+"String sql=\"select ");
		
		String colums="";
		String dot="";
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			sb.append(dot+this.column[i]+" as "+columnname);
			dot=",";
		}
		sb.append(tab(2)+" from "+this.table+" where "+this.shortName+"_id=\"+id;"+this.wrap);
		sb.append(tab(2)+"try {"+this.wrap);
		sb.append(tab(3)+"Hashtable h=db.queryOne(sql);"+this.wrap);
		
		
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			sb.append(tab(3)+"this."+columnname+"=(String)h.get(\""+this.column[i]+"\");"+this.wrap);
		}
		sb.append(tab(2)+"} catch (SQLException e) {"+this.wrap);
		sb.append(tab(3)+"e.printStackTrace();"+this.wrap);
		sb.append(tab(2)+"}finally{"+this.wrap);
		sb.append(tab(3)+"if(data==null)db.close();"+this.wrap);
		sb.append(tab(2)+"}"+this.wrap);
		sb.append(tab(1)+"}"+this.wrap);
		
		sb.append(this.wrap);
		
		String para="";
		String att="";
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			para+="String "+columnname+((i==this.column.length-1)?"":",");
			att+=tab(2)+"this."+columnname+"="+columnname+";"+this.wrap;
		}
		para=(para.endsWith(","))?para.substring(0,para.length()):para;
		sb.append(tab(1)+"public "+className+"("+para+") {"+this.wrap);
		sb.append(att);
		sb.append(tab(1)+"}"+this.wrap);
		
		sb.append(this.wrap);
		
		//public String add()------------------------------------------
		String p="";
        for(int i=1;i<this.column.length;i++){
			
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			if(!columnname.equals("id"))
			    p+="String "+columnname+((i==this.column.length-1)?"":",");
		}
		sb.append(tab(1)+"public static String add("+p+"){"+this.wrap);
		
		sb.append(tab(2)+"String sql=\"insert into "+this.table+"(\""+this.wrap);
		String scolumn="";
		String svalue="";
		for(int i=1;i<this.column.length;i++){
			
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			String clnName=columnname.substring(0,1).toUpperCase()+columnname.substring(1,columnname.length());
			
			scolumn+=tab(5)+"+\""+this.column[i]+((i==this.column.length-1)?" ":",")+"\""+this.wrap;
			svalue+=tab(5)+"+\"'\"+"+columnname+"+\"'"+((i==this.column.length-1)?" ":",")+"\""+this.wrap;
		}
		sb.append(scolumn);
		sb.append(tab(5)+"+\") values (\""+this.wrap);
		sb.append(svalue);
		sb.append(tab(5)+"+\")\";"+this.wrap);
		
		
		sb.append(tab(2)+"DB db=new DB();"+this.wrap);
		sb.append(tab(2)+"String resID=null;"+this.wrap);
		sb.append(tab(2)+"try {"+this.wrap);
		sb.append(tab(3)+"if(db.update(sql)>0){"+this.wrap);
		sb.append(tab(4)+"String querysql=\"select "+this.shortName+"_id from "+this.table+" where *******\";"+this.wrap);
		sb.append(tab(4)+"resID=(String)db.queryOne(querysql).get(\""+this.shortName+"_id\");"+this.wrap);
		sb.append(tab(3)+"}"+this.wrap);
		sb.append(tab(2)+"} catch (SQLException e) {"+this.wrap);
		sb.append(tab(3)+"e.printStackTrace();"+this.wrap);
		sb.append(tab(2)+"}finally{"+this.wrap);
		sb.append(tab(3)+"db.close();"+this.wrap);
		sb.append(tab(2)+"}"+this.wrap);
		sb.append(tab(2)+"return resID;"+this.wrap);
		sb.append(tab(1)+"}"+this.wrap);
		
		sb.append(this.wrap);
		
		//public String mdy()------------------------------------------
		String pp="";
        for(int i=0;i<this.column.length;i++){
			
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			pp+="String "+columnname+((i==this.column.length-1)?"":",");
		}
        sb.append(tab(1)+"public static boolean mdy("+pp+"){"+this.wrap);
		sb.append(tab(2)+"String sql=\"update "+this.table+" set \""+this.wrap);
        for(int i=1;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			String clnName=columnname.substring(0,1).toUpperCase()+columnname.substring(1,columnname.length());
			sb.append(tab(3)+"+\""+this.column[i]+"='\"+"+columnname+"+\"'"+((i==this.column.length-1)?" ":",")+"\""+this.wrap);
		}
		sb.append(tab(3)+"+\"where "+this.shortName+"_id=\"+id;"+this.wrap);
		sb.append(tab(2)+"DB db=new DB();"+this.wrap);
		sb.append(tab(2)+"boolean succ=false;"+this.wrap);
		sb.append(tab(2)+"try {"+this.wrap);
		sb.append(tab(3)+"succ=db.update(sql)>0;"+this.wrap);
		sb.append(tab(2)+"} catch (SQLException e) {"+this.wrap);
		sb.append(tab(3)+"e.printStackTrace();"+this.wrap);
		sb.append(tab(2)+"}finally{"+this.wrap);
		sb.append(tab(3)+"db.close();"+this.wrap);
		sb.append(tab(2)+"}"+this.wrap);
		sb.append(tab(2)+"return succ;"+this.wrap);
		sb.append(tab(1)+"}"+this.wrap);
		
		sb.append(this.wrap);
	
		//public String del()------------------------------------------
        sb.append(tab(1)+"public static boolean del(String id){"+this.wrap);
		sb.append(tab(2)+"String sql=\"delete from "+this.table+" where "+this.shortName+"_id=\"+id;"+this.wrap);
		sb.append(tab(2)+"DB db=new DB();"+this.wrap);
		sb.append(tab(2)+"boolean succ=false;"+this.wrap);
		sb.append(tab(2)+"try {"+this.wrap);
		sb.append(tab(3)+"succ=db.update(sql)>0;"+this.wrap);
		sb.append(tab(2)+"} catch (SQLException e) {"+this.wrap);
		sb.append(tab(3)+"e.printStackTrace();"+this.wrap);
		sb.append(tab(2)+"}finally{"+this.wrap);
		sb.append(tab(3)+"db.close();"+this.wrap);
		sb.append(tab(2)+"}"+this.wrap);
		sb.append(tab(2)+"return succ;"+this.wrap);
		sb.append(tab(1)+"}"+this.wrap);
		
		
		sb.append(this.wrap);
	
		sb.append(tab(1)+"/**"+this.wrap);
		sb.append(tab(1)+"public static "+className+"[] get(String id){"+this.wrap);
		sb.append(tab(2)+"DB db=new DB();"+this.wrap);
		sb.append(tab(2)+"String sql=\"select * from "+this.table+" where "+this.shortName+"_***=\"+id;"+this.wrap);
		sb.append(tab(2)+className+"[] res=null;"+this.wrap);
		sb.append(tab(2)+"try {"+this.wrap);
		sb.append(tab(3)+"ArrayList list=db.query(sql);"+this.wrap);
		sb.append(tab(3)+"if(!list.isEmpty()){"+this.wrap);
		sb.append(tab(4)+"res = new "+className+"[list.size()];"+this.wrap);
		sb.append(tab(4)+"for (int i = 0; i < list.size(); i++) {"+this.wrap);
		sb.append(tab(5)+"Hashtable h = (Hashtable) list.get(i);"+this.wrap);
		
		String parameter="";
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			String clnName=columnname.substring(0,1).toUpperCase()+columnname.substring(1,columnname.length());
			sb.append(tab(5)+"String "+columnname+" = (String) h.get(\""+this.column[i]+"\");"+this.wrap);
			parameter+=columnname+((i==this.column.length-1)?"":",");
		}
		
		sb.append(tab(5)+"res[i] = new "+className+"("+parameter+");"+this.wrap);
		sb.append(tab(4)+"}"+this.wrap);
		sb.append(tab(3)+"}"+this.wrap);
		sb.append(tab(2)+"} catch (SQLException e) {"+this.wrap);
		sb.append(tab(3)+"e.printStackTrace();"+this.wrap);
		sb.append(tab(2)+"}finally{"+this.wrap);
		sb.append(tab(3)+"db.close();"+this.wrap);
		sb.append(tab(2)+"}"+this.wrap);
		sb.append(tab(2)+"return res;"+this.wrap);
		sb.append(tab(1)+"}"+this.wrap);
		sb.append(tab(1)+"*/"+this.wrap);
		
		sb.append(this.wrap);
		
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			String clnName=columnname.substring(0,1).toUpperCase()+columnname.substring(1,columnname.length());
			sb.append(tab(1)+"public String get"+clnName+"() {"+this.wrap);
			sb.append(tab(2)+"return this."+columnname+";"+this.wrap);
			sb.append(tab(1)+"}"+this.wrap);
			sb.append(this.wrap);
			sb.append(tab(1)+"public void set"+clnName+"(String "+columnname+") {"+this.wrap);
			sb.append(tab(2)+"this."+columnname+"="+columnname+";"+this.wrap);
			sb.append(tab(1)+"}"+this.wrap);
			sb.append(this.wrap);
		}
		
		sb.append(tab(0)+"}"+this.wrap);
		
		this.temp=sb.toString();	
	}
	
	public void makeForm(){
		StringBuffer sb=new StringBuffer();
		sb.append("package com.wdk.struts.form;"+this.wrap);
		sb.append(this.wrap);
		sb.append("import javax.servlet.http.HttpServletRequest;"+this.wrap);
		sb.append("import org.apache.struts.action.ActionErrors;"+this.wrap);
		sb.append("import org.apache.struts.action.ActionForm;"+this.wrap);
		sb.append("import org.apache.struts.action.ActionMapping;"+this.wrap);
		sb.append("import org.apache.struts.action.ActionMessage;"+this.wrap);
		sb.append("import com.wdk.session.Session;"+this.wrap);
		sb.append("import com.wdk.user.User;"+this.wrap);
		sb.append(this.wrap);
		
		String className=this.shortName.substring(0,1).toUpperCase()+this.shortName.substring(1,this.shortName.length());
		sb.append("public class "+className+"Form extends ActionForm{"+this.wrap);
		sb.append(this.wrap);
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			sb.append(this.tab(1)+"private String "+columnname+";"+this.wrap);
		}
		sb.append(this.wrap);
		
		sb.append(tab(1)+"public ActionErrors validate(ActionMapping mapping,HttpServletRequest request) {"+this.wrap);
		
		sb.append(tab(2)+"ActionErrors errors = new ActionErrors();"+this.wrap);
		sb.append(this.wrap);
		sb.append(tab(2)+"User u=Session.getUser(request);"+this.wrap);
		sb.append(tab(2)+"if(u==null){"+this.wrap);
		sb.append(tab(3)+"errors.add(\"log\", new ActionMessage(\"user.log.required\"));"+this.wrap);
		sb.append(tab(2)+"}"+this.wrap);
		sb.append(this.wrap);
		
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			String clnName=columnname.substring(0,1).toUpperCase()+columnname.substring(1,columnname.length());
			sb.append(tab(2)+"if("+columnname+"==null){"+this.wrap);
			sb.append(tab(3)+"errors.add(\""+columnname+"\", new ActionMessage(\""+className+"."+columnname+".required\"));"+this.wrap);
			sb.append(tab(2)+"}"+this.wrap);
			sb.append(this.wrap);
		}
		
		sb.append(tab(2)+"return errors;"+this.wrap);
		sb.append(tab(1)+"}"+this.wrap);
		
		sb.append(this.wrap);
		
		
		sb.append(tab(1)+"public void reset(ActionMapping mapping, HttpServletRequest request) {}"+this.wrap);
		sb.append(this.wrap);
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			String clnName=columnname.substring(0,1).toUpperCase()+columnname.substring(1,columnname.length());
			sb.append(tab(1)+"public String get"+clnName+"() {"+this.wrap);
			sb.append(tab(2)+"return this."+columnname+";"+this.wrap);
			sb.append(tab(1)+"}"+this.wrap);
			sb.append(this.wrap);
			sb.append(tab(1)+"public void set"+clnName+"(String "+columnname+") {"+this.wrap);
			sb.append(tab(2)+"this. "+columnname+"="+columnname+";"+this.wrap);
			sb.append(tab(1)+"}"+this.wrap);
			sb.append(this.wrap);
		}
		
		sb.append(tab(0)+"}"+this.wrap);
		this.form=sb.toString();
	}

	public void makeServlet(){
		StringBuffer sb=new StringBuffer();
		String className=this.shortName.substring(0,1).toUpperCase()+this.shortName.substring(1,this.shortName.length());
		sb.append("package com.wdk.servlet;"+this.wrap+this.wrap);
		sb.append("import java.io.IOException;"+this.wrap);
		sb.append("import java.io.PrintWriter;"+this.wrap);
		sb.append("import javax.servlet.ServletException;"+this.wrap);
		sb.append("import javax.servlet.http.HttpServlet;"+this.wrap);
		sb.append("import javax.servlet.http.HttpServletRequest;"+this.wrap);
		sb.append("import javax.servlet.http.HttpServletResponse;"+this.wrap);
		sb.append("import com.wdk.user.User;"+this.wrap);
		sb.append("import com.wdk.util.Session;"+this.wrap+this.wrap);

		sb.append("public class mdy"+className+" extends HttpServlet {"+this.wrap+this.wrap);

		sb.append(tab(1)+"public mdy"+className+"() {"+this.wrap);
		sb.append(tab(2)+"super();"+this.wrap);
		sb.append(tab(1)+"}"+this.wrap+this.wrap);
		
		sb.append(tab(1)+"public void destroy() {"+this.wrap);
		sb.append(tab(2)+"super.destroy(); "+this.wrap);
		sb.append(tab(1)+"}"+this.wrap+this.wrap);

		sb.append(tab(1)+"public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {"+this.wrap);
		sb.append(tab(2)+"String msg = \"\";"+this.wrap);
		sb.append(tab(2)+"User user = Session.getUser(request);"+this.wrap);
		sb.append(tab(2)+"if (user == null) {"+this.wrap);
		sb.append(tab(3)+"msg += \"��ĵ�¼��Ϣ�Ѿ���ʱ�������µ�¼��\";"+this.wrap);
		sb.append(tab(2)+"}"+this.wrap);
		
		String para="";
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			sb.append(tab(2)+"String "+columnname+"="+"request.getParameter(\""+columnname+"\");"+this.wrap);
			sb.append(tab(2)+"if("+columnname+"==null || "+columnname+".equals(\"\")){"+this.wrap);
			String dis=(String)this.discriptions.get(this.column[i]);
			sb.append(tab(3)+"msg+=\""+dis+"����Ϊ�գ�\";"+this.wrap);
		    sb.append(tab(2)+"}"+this.wrap);
		    para+=columnname+((i==this.column.length-1)?"":",");
		}
		
	    sb.append(tab(2)+"response.setContentType(\"text/html\");"+this.wrap);
	    sb.append(tab(2)+"response.setCharacterEncoding(\"utf-8\");"+this.wrap);
	    sb.append(tab(2)+"PrintWriter out = response.getWriter();"+this.wrap);
	    sb.append(tab(2)+"if(msg.length()<=0){"+this.wrap);
	    sb.append(tab(3)+"String newID=null;"+this.wrap);
	    sb.append(tab(3)+"if(id==null || id.equals(\"\"))"+this.wrap);
	    sb.append(tab(4)+"newID="+className+".add("+para+");"+this.wrap);
	    sb.append(tab(3)+"else{"+this.wrap);
	    sb.append(tab(4)+"boolean succ="+className+".mdy("+para+");"+this.wrap);
	    sb.append(tab(4)+"newID=(succ)?id:null;"+this.wrap);
	    sb.append(tab(3)+"}"+this.wrap);
	    sb.append(tab(3)+"out.print((newID==null)?\"��ݿ����\":newID);"+this.wrap);
	    sb.append(tab(2)+"}else{"+this.wrap);
	    sb.append(tab(3)+"out.print(msg);"+this.wrap);
	    sb.append(tab(2)+"}"+this.wrap);
	    sb.append(tab(2)+"out.flush();"+this.wrap);
	    sb.append(tab(2)+"out.close();"+this.wrap);
	    sb.append(tab(1)+"}");
	    sb.append("}");
		
		this.servlet=sb.toString();
	}
	
	public void makeHtml(){
		StringBuffer sb=new StringBuffer();
		String className=this.shortName.substring(0,1).toUpperCase()+this.shortName.substring(1,this.shortName.length());
		
		sb.append(tab(0)+"<%@ page contentType=\"text/html; charset=GB2312\"%>"+this.wrap);
		sb.append(tab(0)+"<%@page import=\"com.wdk.user.User\"%>"+this.wrap);
		sb.append(tab(0)+"<%@page import=\"com.wdk.util.Session\"%>"+this.wrap);
		
		sb.append(tab(0)+"<%"+this.wrap);
		sb.append(tab(0)+"User user=Session.getUser(request);"+this.wrap);
		sb.append(tab(0)+"if(user!=null){"+this.wrap);
		sb.append(tab(1)+"String "+className+"ID=request.getParameter(\""+className+"ID\");"+this.wrap);
		sb.append(tab(2)+className+" "+this.shortName+" =("+className+"ID==null)?new "+className+"(): new "+className+"("+className+"ID,null);"+this.wrap);
		//-----------
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			String clnName=columnname.substring(0,1).toUpperCase()+columnname.substring(1,columnname.length());
		    sb.append(tab(1)+"String "+columnname+"=("+this.shortName+".get"+clnName+"()==null)?\"\":"+this.shortName+".get"+clnName+"();"+this.wrap);
		}
		
		
		sb.append(tab(0)+"%>"+this.wrap);
		
		sb.append(tab(0)+"<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">"+this.wrap);
		sb.append(tab(0)+"<html xmlns=\"http://www.w3.org/1999/xhtml\">"+this.wrap);
		sb.append(tab(0)+"<head>"+this.wrap);
		sb.append(tab(0)+"<meta http-equiv=\"Content-Type\" content=\"text/html; charset=GB2312\" />"+this.wrap);
		
		//style-------------------------------------------------
		sb.append(tab(0)+"<link href=\"<%=request.getContextPath()%>/css/FormStyle.css\" rel=\"stylesheet\" type=\"text/css\"/>"+this.wrap);
		sb.append(tab(0)+"<link href='<%=request.getContextPath()%>/css/frame.css' rel='stylesheet' type='text/css' />"+this.wrap);
		
		sb.append(tab(0)+""+this.wrap);
		sb.append(tab(0)+""+this.wrap);
		
		sb.append(tab(0)+"<script language=\"JavaScript1.2\" src=\"<%=request.getContextPath()%>/js/ActiveX.js\"></script>"+this.wrap);
		sb.append(tab(0)+"<script language=\"JavaScript1.2\" src=\"<%=request.getContextPath()%>/js/validator.js\"></script>"+this.wrap);
		sb.append(tab(0)+"<script language=\"JavaScript1.2\" src=\"<%=request.getContextPath()%>/js/tab.js\"></script>"+this.wrap);
		sb.append(tab(0)+"<script language=\"JavaScript1.2\" src=\"<%=request.getContextPath()%>/js/Ajax.js\"></script>"+this.wrap);
		sb.append(tab(0)+"<script language=\"JavaScript1.2\">"+this.wrap);
		sb.append(tab(0)+"<!--"+this.wrap);
		sb.append(this.wrap);
		sb.append(tab(0)+"//-->"+this.wrap);
		sb.append(tab(0)+"</script>"+this.wrap);
		sb.append(tab(0)+"<style type='text/css'>"+this.wrap);
		sb.append(tab(0)+"<!--"+this.wrap);
		sb.append(tab(0)+"body,td,th {"+this.wrap);
		sb.append(tab(1)+"font-size: 12px;"+this.wrap);
		sb.append(tab(0)+"}"+this.wrap);
		sb.append(tab(0)+"form{"+this.wrap);
		sb.append(tab(1)+"padding:0px;"+this.wrap);
		sb.append(tab(1)+"margin:0px;"+this.wrap);
		sb.append(tab(0)+"}"+this.wrap);
		sb.append(tab(0)+"-->"+this.wrap);
		sb.append(tab(0)+"</style>"+this.wrap);                    

		sb.append(tab(0)+"</head>"+this.wrap);
		
		
		sb.append(tab(0)+"<body>"+this.wrap);
		
		sb.append(tab(1)+"<form id=\"register\" name=\"register\" method=\"post\" action=\"<%=request.getContextPath()%>/\">"+this.wrap);
		
		sb.append(tab(1)+"<table width='100%' border='0' cellpadding='0' cellspacing='0'>"+this.wrap);
		sb.append(tab(2)+"<tr>"+this.wrap);
		sb.append(tab(3)+"<td class='frame_l_t'></td>"+this.wrap);
		sb.append(tab(3)+"<td class='frame_m_t' nowrap='nowrap'>"+this.wrap);
		sb.append(tab(4)+"<table width='100%' border='0' cellspacing='0' cellpadding='0' >"+this.wrap);
		sb.append(tab(5)+"<tr>"+this.wrap);
		sb.append(tab(5)+"<td width='95' height='29' align='center' valign='middle' class='selected' onclick='show(this,0)'>&nbsp;</td>"+this.wrap);
		sb.append(tab(5)+"<td align='right' valign='middle'>&nbsp;</td>"+this.wrap);
		sb.append(tab(5)+"</tr>"+this.wrap);
		sb.append(tab(4)+"</table>"+this.wrap);
		sb.append(tab(3)+"</td>"+this.wrap);
		sb.append(tab(3)+"<td class='frame_r_t'></td>"+this.wrap);
		sb.append(tab(2)+"</tr>"+this.wrap);
		sb.append(tab(2)+"<tr>"+this.wrap);
		sb.append(tab(3)+"<td height='70' class='frame_l_m' ></td>"+this.wrap);
		sb.append(tab(3)+"<td align='center' valign='top'><table width='100%' border='0'>"+this.wrap);
		sb.append(tab(2)+"<tr>"+this.wrap);
		sb.append(tab(3)+"<td>"+this.wrap);    
		
		
		sb.append(tab(3)+"<table width=\"90%\" align=\"center\" border=\"0\" cellspacing=\"4\" cellpadding=\"2\">"+this.wrap);
		sb.append(tab(4)+"<tr>"+this.wrap);
		sb.append(tab(5)+"<td colspan=\"3\">&nbsp;</td>"+this.wrap);
		sb.append(tab(4)+"</tr>"+this.wrap);
		
		
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			String clnName=columnname.substring(0,1).toUpperCase()+columnname.substring(1,columnname.length());
			String dis=(String)this.discriptions.get(this.column[i]);
			sb.append(tab(4)+"<tr>"+this.wrap);
		    sb.append(tab(5)+"<td align=\"right\" width=\"20%\">"+((dis==null)?this.column[i]:dis)+"��</td>"+this.wrap);
		    sb.append(tab(5)+"<td align=\"left\" width=\"40%\"><input name='"+columnname+"' type='text' id='"+columnname+"' size='32' onblur='check"+clnName+"(this)' value='<%= "+columnname+"%>'/></td>"+this.wrap);
		    sb.append(tab(5)+"<td align=\"left\" width=\"40%\">&nbsp;</td>"+this.wrap);
		    sb.append(tab(4)+"</tr>"+this.wrap);
		}
		
		sb.append(tab(4)+"<tr>"+this.wrap);
	    sb.append(tab(5)+"<td align=\"right\" width=\"20%\"></td>"+this.wrap);
	    sb.append(tab(5)+"<td align=\"left\" width=\"40%\"><input type='button' name='button' id='button' value='�ύ'  onclick='checkForm()'/></td>"+this.wrap);
	    sb.append(tab(5)+"<td align=\"left\" width=\"40%\">&nbsp;</td>"+this.wrap);
	    sb.append(tab(4)+"</tr>"+this.wrap);
	    
		sb.append(tab(3)+"</table>"+this.wrap);
		
		sb.append(tab(2)+"</td>"+this.wrap);                           
		sb.append(tab(2)+"</tr>"+this.wrap);                     
		sb.append(tab(2)+"<tr>"+this.wrap);                      
		sb.append(tab(2)+"<td>&nbsp;</td>"+this.wrap);         
		sb.append(tab(2)+"</tr>"+this.wrap);                     
		sb.append(tab(2)+"<tr>"+this.wrap);                      
		sb.append(tab(2)+"<td>&nbsp;</td>"+this.wrap);         
		sb.append(tab(2)+"</tr>"+this.wrap);                     
		sb.append(tab(2)+"</table>"+this.wrap);                    
		sb.append(tab(2)+"</td>"+this.wrap);                       
		sb.append(tab(2)+"<td class='frame_r_m'></td>"+this.wrap); 
		sb.append(tab(2)+"</tr>"+this.wrap);                         
		sb.append(tab(2)+"<tr>"+this.wrap);                          
		sb.append(tab(2)+"<td class='frame_l_b'></td>"+this.wrap); 
		sb.append(tab(2)+"<td class='frame_m_b'></td>"+this.wrap); 
		sb.append(tab(2)+"<td class='frame_r_b'></td>"+this.wrap); 
		sb.append(tab(2)+"</tr>"+this.wrap);                         
		sb.append(tab(2)+"</table>"+this.wrap);      
		
		sb.append(tab(1)+"</form>"+this.wrap);
		sb.append(tab(0)+"</body>"+this.wrap);
		sb.append(tab(0)+"</html>"+this.wrap);
		sb.append(tab(0)+"<%}}%>"+this.wrap);
		this.html=sb.toString();
	}
	
	
	private void makeJavaScript(){
		StringBuffer sb=new StringBuffer();
		String className=this.shortName.substring(0,1).toUpperCase()+this.shortName.substring(1,this.shortName.length());
		
		sb.append(tab(0)+"var hitmsg=new Array();"+this.wrap);
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			String clnName=columnname.substring(0,1).toUpperCase()+columnname.substring(1,columnname.length());
			String dis=(String)this.discriptions.get(this.column[i]);
			sb.append(tab(0)+"hitmsg["+i+"]='������"+dis+"';"+this.wrap);
		}
		
		sb.append(this.wrap);
		sb.append(tab(0)+"function showMsg(idx){"+this.wrap);
		sb.append(tab(1)+"var obj=window.event.srcElement"+this.wrap);
		sb.append(tab(1)+"var hitTD=obj.parentElement.parentElement.childNodes[2];"+this.wrap);
		sb.append(tab(1)+"hitTD.style.color='#006699'"+this.wrap);
		sb.append(tab(1)+"hitTD.innerHTML=hitmsg[idx];"+this.wrap);
		sb.append(tab(0)+"}"+this.wrap);
		
		sb.append(this.wrap);
		
		sb.append(tab(0)+"function setHit(obj,msg,isErr){"+this.wrap);
		sb.append(tab(1)+"var hitTD=obj.parentElement.parentElement.childNodes[2];"+this.wrap);
		sb.append(tab(1)+"if(isErr){"+this.wrap);
		sb.append(tab(2)+"hitTD.style.color='#FF0000'"+this.wrap);
		sb.append(tab(2)+"hitTD.innerHTML=\"<img src='/images/1000216.gif' align='absmiddle' width='16' height='16' />&nbsp;\"+msg;"+this.wrap);
		sb.append(tab(1)+"}else{"+this.wrap);
		sb.append(tab(2)+"hitTD.style.color='#0066CC'"+this.wrap);
		sb.append(tab(2)+"hitTD.innerHTML=\"<img src='/images/1000716.gif' align='absmiddle'  width='16' height='16' />&nbsp;\"+msg;"+this.wrap);
		sb.append(tab(1)+"}"+this.wrap);
		sb.append(tab(0)+"}"+this.wrap);
		
		sb.append(this.wrap);

		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			String clnName=columnname.substring(0,1).toUpperCase()+columnname.substring(1,columnname.length());
			String dis=(String)this.discriptions.get(this.column[i]);
			sb.append(tab(0)+"function check"+clnName+"(obj){"+this.wrap);
			sb.append(tab(1)+"var isRight=false;"+this.wrap);
			sb.append(tab(1)+"if(!obj.value.match(regRequire)){"+this.wrap);
			sb.append(tab(2)+"setHit(obj,'������"+dis+"',true);"+this.wrap);
			sb.append(tab(1)+"}else{"+this.wrap);
			sb.append(tab(2)+"setHit(obj,'',false);"+this.wrap);
			sb.append(tab(2)+"isRight=true;"+this.wrap);
			sb.append(tab(1)+"}"+this.wrap);
			sb.append(tab(1)+"return isRight;"+this.wrap);
			sb.append(tab(0)+"}"+this.wrap);
			sb.append(this.wrap);
		}
		
		sb.append(tab(0)+"function checkForm(){"+this.wrap);
		sb.append(tab(0)+"var isRight=new Array();"+this.wrap);
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			String clnName=columnname.substring(0,1).toUpperCase()+columnname.substring(1,columnname.length());
			String dis=(String)this.discriptions.get(this.column[i]);
			sb.append(tab(1)+"isRight["+i+"]=check"+clnName+"(document.getElementById('"+columnname+"'))"+this.wrap);
		}
		sb.append(tab(1)+"var ErrCount=0;"+this.wrap);
		sb.append(tab(1)+"for(i=0;i<isRight.length;i++){"+this.wrap);
		sb.append(tab(2)+"if(!isRight[i])"+this.wrap);
		sb.append(tab(3)+"ErrCount++;"+this.wrap);
		sb.append(tab(1)+"}"+this.wrap);
		sb.append(tab(1)+"if(ErrCount>0){"+this.wrap);
		sb.append(tab(2)+"alert('��������ĸ����д���'+ErrCount+'������������ʾ����');	"+this.wrap);
		sb.append(tab(1)+"}else{"+this.wrap);
		sb.append(tab(2)+"document.forms[0].submit();"+this.wrap);
		sb.append(tab(1)+"}"+this.wrap);
		sb.append(tab(0)+"}"+this.wrap);
		this.javascript=sb.toString();
	}
	
	private void makeDdyMothod(){
		StringBuffer sb=new StringBuffer();
		String className=this.shortName.substring(0,1).toUpperCase()+this.shortName.substring(1,this.shortName.length());
		
		sb.append("String cols=\"\";\n");
		sb.append("String values=\"\";\n");
		
		for(int i=0;i<this.column.length;i++){
			int idx=this.column[i].indexOf("_");
			String columnname = (idx>=0) ? this.column[i].substring(idx+1,this.column[i].length()) : this.column[i];
			String clnName=columnname.substring(0,1).toUpperCase()+columnname.substring(1,columnname.length());
			String dis=(String)this.discriptions.get(this.column[i]);
			
			sb.append("if("+columnname+"!=null && !"+columnname+".equals(\"\")){\n");
			sb.append("    cols+=\""+this.column[i]+",\";\n");
			sb.append("    values+=\"'\"+"+columnname+"+\"',\";\n");
			sb.append("}\n");
		}
		
		this.mdy=sb.toString();
	}
	public String getTemp() {
		return temp;
	}

	public String getForm() {
		return form;
	}

	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public String getHtml() {
		return html;
	}

	public String getJavascript() {
		return javascript;
	}

	public String getServlet() {
		return servlet;
	}

	public String getMdy() {
		return mdy;
	}
	
	
}
