package com.wdk.system;
import java.util.Timer;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.wdk.util.DB;

public class InitializeSystemListener implements ServletContextListener {
	
	@Override
	public void contextDestroyed(ServletContextEvent sce) {

	}

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		ServletContext context = sce.getServletContext();

		DB db = new DB();
		try {
			SystemConfigration sc=new SystemConfigration(db);
			context.setAttribute(SystemConfigration.NameInContext,sc);
			context.setAttribute(SystemNotifies.NameInContext, new SystemNotifies());
			
			
			new GetAccessTokenThread(sc).start(); //定时获取AccessToken
			new GetJSApiTicketThread(sc).start(); //定时获取JS ticket；
		} catch (Exception e) {
			// TODO: handle exception
		} finally {
			db.close();
		}

	}
}
