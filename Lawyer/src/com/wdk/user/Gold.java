package com.wdk.user;

import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Hashtable;

import com.wdk.util.CallableDB;
import com.wdk.util.DB;
import com.wdk.util.Parameter;
import com.wdk.util.V;

public class Gold {
	public static final int Type_Payment_PublishUnit=101;
	public static final int Type_Payment_ReviewRole=102;

	
	private int user=-1;
	private int amount=0;
	
	public Gold(int user,DB db) {
		this.user=user;
		this.refresh(db);
	}
	
	
	
	public void refresh(DB data){
		DB db=(data==null)?new DB():data;
        String sql="select gold_amount  from wx_gold where gold_user=?";
        try {
            Hashtable<String,String> h=db.queryOne(sql,new Parameter[]{new Parameter(this.user)});
            this.amount=V.parseInt(h.get("gold_amount"));
        } catch (SQLException e) {
            e.printStackTrace();
        }finally{
            if(data==null)db.close();
        }
	}
	
	public boolean pay(int type,int amount,String description){
		if(amount<=0 || type<=0){
			return false;
		}
		
		CallableDB db=new CallableDB();
		CallableStatement cs;
		boolean res=false;
		try {
			cs = db.call("pay(?,?,?,?,?,?)");
			cs.setInt(1, this.user);
			cs.setInt(2, type);
			cs.setInt(3, amount);
			cs.setString(4, description);
			cs.setLong(5, System.currentTimeMillis());
			cs.registerOutParameter(6, Types.BOOLEAN);//ID
			
			cs.execute();
			res = cs.getBoolean(6);
			if(res){
				this.amount=this.amount-amount;
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			db.close();
		}
		return res;
	}


	public int getAmount() {
		return amount;
	}
	
}
