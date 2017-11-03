package com.wdk.system;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import javax.servlet.http.HttpServletRequest;


public class ReviewList {
	public static final String NameInContext = "ReviewList";
	private ReadWriteLock lock = new ReentrantReadWriteLock();

	private LinkedList<String> reviewList = new LinkedList<String>();
	
	
	
	public ReviewList() {
		super();
		// TODO Auto-generated constructor stub
	}



	public static ReviewList getInstance(HttpServletRequest request) {
		return (ReviewList) request.getServletContext().getAttribute(NameInContext);
	}

	public void add(int id){
		if(id<0 || this.isExist(id)){
			return;
		}
		
		this.lock.writeLock().lock();
		try {
			this.reviewList.add(id+"");
		} finally {
			this.lock.writeLock().unlock();
		}
	}
	
	public boolean isExist(int id) {
		if (id < 0) {
			return false;
		}

		Iterator<String> itea = this.reviewList.iterator();
		while (itea.hasNext()) {
			String uintID = itea.next();
			if (uintID.equals(id+"")) {
				return true;
			}
		}

		return false;
	}
	
	public void del(int id){
		if (id < 0) {
			return;
		}
        
		
		Iterator<String> itea = this.reviewList.iterator();
		while (itea.hasNext()) {
			String uintID = itea.next();
			if (uintID.equals(id+"")) {
				itea.remove();
			}
		}
	}
}
