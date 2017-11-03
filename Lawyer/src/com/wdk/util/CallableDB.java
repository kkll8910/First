package com.wdk.util;

import java.sql.*;
import java.util.*;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class CallableDB {
	private String jndiName = "java:comp/env/weixin/jdbc";
	private Connection conn = null;
	private CallableStatement cs = null;

	public CallableDB() {
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

	public void close() {
		try {
			if (this.cs != null && this.cs.isClosed() == false) {
                 this.cs.close();
                 this.cs=null;
			}

			if (this.conn != null && this.conn.isClosed() == false) {
				this.conn.close();
				this.conn=null;
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public CallableStatement call(String procedure) throws SQLException {
		return conn.prepareCall("{call " + procedure + "}");
	}	
}
