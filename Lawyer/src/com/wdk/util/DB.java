package com.wdk.util;

import java.sql.*;
import java.util.*;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class DB {

	public static final String ParameterType_String = "String";
	public static final String ParameterType_Integer = "Int";
	public static final String ParameterType_Long = "Long";

	private String jndiName = null;

	private Connection conn = null;

	private PreparedStatement psmt = null;

	private ResultSet rs = null;

	private ResultSetMetaData rsmd = null;

	public DB() {

		jndiName = "java:comp/env/weixin/jdbc";

		try {
			Context ctx = new InitialContext();
			DataSource ds = (DataSource) ctx.lookup(jndiName);
			this.conn = ds.getConnection();
		} catch (NamingException e) {
			System.out.println("找不到JNDI！");
		} catch (SQLException e) {
			System.out.println("无法连接数据库，请检查帐号以及密码是否正确:" + e.getMessage());
		}
	}

	public DB(String jdbc) {

		jndiName = "java:comp/env/" + jdbc;

		try {
			Context ctx = new InitialContext();
			DataSource ds = (DataSource) ctx.lookup(jndiName);
			this.conn = ds.getConnection();
		} catch (NamingException e) {
			System.out.println("找不到JNDI！");
		} catch (SQLException e) {
			System.out.println("无法连接数据库，请检查帐号以及密码是否正确:" + e.getMessage());
		}
	}

	private void setParameters(Parameter[] parameters) throws SQLException {
		if (parameters == null || parameters.length <= 0) {
			return;
		}
		for (int i = 0; i < parameters.length; i++) {
			String type = parameters[i].getType();
			String value = parameters[i].getValue();
			
			if (type.equals("String")) {
				if(V.isBlank(value)){
					this.psmt.setNull(i+1, Types.VARCHAR);
				}else{
				    this.psmt.setString(i + 1, value);
				}
			} else if (type.equals("Int")) {
				if(V.isBlank(value)){
					this.psmt.setNull(i+1, Types.INTEGER);
				}else{
				    this.psmt.setInt(i + 1, Integer.parseInt(value));
				}
			} else if (type.equals("Long")) {
				if(V.isBlank(value)){
					this.psmt.setNull(i+1, Types.BIGINT);
				}else{
				    this.psmt.setLong(i + 1, Long.parseLong(value));
				}
			} else if (type.equals("Float")) {
				if(V.isBlank(value)){
					this.psmt.setNull(i+1, Types.FLOAT);
				}else{
				    this.psmt.setFloat(i + 1, Float.parseFloat(value));
				}
			}else if (type.equals(Parameter.ParameterType_Bit)) {
				if(V.isBlank(value)){
					this.psmt.setNull(i+1, Types.BIT);
				}else{
				    this.psmt.setBoolean(i + 1, Boolean.parseBoolean(value));
				}
			}
		}
	}

	public ArrayList<Hashtable<String, String>> query(String sql, Parameter[] parameters) throws SQLException {
		ArrayList<Hashtable<String, String>> DbOperationList = new ArrayList<Hashtable<String, String>>();
		this.psmt = null;
		this.rs = null;
		this.rsmd = null;
		try {
			this.psmt = this.conn.prepareStatement(sql);
			this.setParameters(parameters);
			this.rs = psmt.executeQuery();
			this.rsmd = rs.getMetaData();
		} catch (SQLException e) {
			if (this.conn.getAutoCommit())
				this.close();
			throw new SQLException(this.MakeErrMsg(sql, e));
		}

		int columnCount = this.rsmd.getColumnCount();

		try {
			while (this.rs.next()) {
				Hashtable<String, String> ht = new Hashtable<String, String>();
				for (int i = 1; i <= columnCount; i++) {
					Object obj = this.rs.getObject(i);
					if (obj != null) {
						String temp = obj.toString().trim();
						ht.put(this.rsmd.getColumnName(i), temp);
					}
				}
				DbOperationList.add(ht);
			}
		} catch (SQLException e) {
			this.rs.close();
			this.psmt.close();
			if (this.conn.getAutoCommit())
				this.close();
			throw e;
		}
		this.rs.close();
		this.psmt.close();
		return DbOperationList;
	}

	public Hashtable<String, String> queryOne(String sql, Parameter[] parameters) throws SQLException {
		Hashtable<String, String> ht = new Hashtable<String, String>();
		this.psmt = null;
		this.rs = null;
		this.rsmd = null;
		try {
			this.psmt = this.conn.prepareStatement(sql);
			this.setParameters(parameters);
			this.rs = this.psmt.executeQuery();
			this.rsmd = this.rs.getMetaData();
		} catch (SQLException e) {
			if (this.conn.getAutoCommit())
				this.close();
			throw new SQLException(this.MakeErrMsg(sql, e));
		}
		int columnCount = this.rsmd.getColumnCount();
		try {
			if (this.rs.next()) {
				for (int i = 1; i <= columnCount; i++) {
					Object obj = this.rs.getObject(i);
					if (obj != null) {
						String temp = obj.toString().trim();
						ht.put(this.rsmd.getColumnName(i), temp);
					}
				}
			}
		} catch (SQLException e) {
			this.rs.close();
			this.psmt.close();
			if (this.conn.getAutoCommit())
				this.close();
			throw e;
		}
		this.rs.close();
		this.psmt.close();
		return ht;
	}

	public int update(String sql, Parameter[] parameters) throws SQLException {
		int result = 0;
		try {
			this.psmt = this.conn.prepareStatement(sql);
			this.setParameters(parameters);
			result = this.psmt.executeUpdate();
			this.psmt.close();
		} catch (SQLException e) {
			if (this.conn.getAutoCommit())
				this.close();
			throw new SQLException(this.MakeErrMsg(sql, e));
		}
		return result;
	}

	public void close() {
		try {
			if (this.conn != null && this.conn.isClosed() == false) {
				this.conn.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}

		if (this.rsmd != null)
			this.rsmd = null;
		if (this.rs != null)
			this.rs = null;
		if (this.psmt != null)
			this.psmt = null;
		if (this.conn != null)
			this.conn = null;
	}

	public String MakeErrMsg(String strSQL, SQLException e) {
		String err = e.getMessage() + "\n" + "\u51fa\u9519\u7684SQL\u8bed\u53e5\u662f\"" + strSQL + "\"";
		System.out.println(err);
		return err;
	}

	public Connection getConnection() {
		return this.conn;
	}

	public PreparedStatement getPsmt() {
		return psmt;
	}

	public ResultSet getRs() {
		return rs;
	}

}