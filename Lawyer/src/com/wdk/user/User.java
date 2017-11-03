package com.wdk.user;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;

import javax.servlet.http.HttpServletRequest;

import com.wdk.item.Item;
import com.wdk.util.DB;
import com.wdk.util.Parameter;
import com.wdk.util.V;

public class User {
	public static final String NameInSession = "User";
	public static final String Item_Key_Province="province";
	public static final String Item_Key_City="city";
	public static final String Item_Key_Country="country";
	
	
	
	

	private int id = -1;
	private String unionid = "";
	private String nickname = "";
	private int sex;
	private String city = "";
	private String headimgurl="";
	private int type;
	private long date;

	private ArrayList<Item> items;

	
	public User(int id, String unionid, String nickname, int sex, String city, String headimgurl, int type, long date) {
		super();
		this.id = id;
		this.unionid = unionid;
		this.nickname = nickname;
		this.sex = sex;
		this.city = city;
		this.headimgurl = headimgurl;
		this.type = type;
		this.date = date;
	}
	
	public int getId() {
		return id;
	}

	public String getUnionid() {
		return unionid;
	}

	public String getNickname() {
		return nickname;
	}

	public int getSex() {
		return sex;
	}

	public String getCity() {
		return city;
	}

	public String getHeadimgurl() {
		return headimgurl;
	}

	public int getType() {
		return type;
	}

	public long getDate() {
		return date;
	}

	public ArrayList<Item> getItems() {
		return items;
	}

	public void loadItems(DB db){
		Item.getItemByParent(Item.Catagory_User, this.id, db);
	}
	

	
	public static User get(HttpServletRequest request) {
		return (User) request.getSession().getAttribute(User.NameInSession);
	}
	
	public static User parse(Hashtable<String, String> h) {
		if (h == null || h.isEmpty()) {
			return null;
		}
		
		int id=V.parseInt(h.get("user_id"));
		String unionid=h.get("user_unionid");
		String nickname=h.get("user_nickname");
		int sex=V.parseInt(h.get("user_sex"));
		String city=h.get("user_city");
		String headimgurl=h.get("user_headimgurl");
		long date=V.parseLong(h.get("user_date"));
		int type=V.parseInt(h.get("user_type"));
		return new User(id, unionid, nickname, sex, city, headimgurl, type, date);
	}
	
	
	public boolean isExist(String unionID,DB data){
		DB db=(data==null)?new DB() : data;
		boolean res=false;
		try {
			Hashtable h=db.queryOne("select user_id from wx_user where user_unionid=?", new Parameter[]{new Parameter(unionID)});
			res=(h!=null && h.size()>0);
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			if(data==null) db.close();
		}
		return res;
	}

	public static User getUserByUnionID(String unionID,DB data) {
		if (V.isBlank(unionID)) {
			return null;
		}
		DB db = (data==null) ? new DB() : data;
		User user = null;
		try {
			Hashtable<String, String> h = db.queryOne("select * from wx_user where user_unionid=?", new Parameter[] { new Parameter(unionID) });
			user = parse(h);
			user.loadItems(db);
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if(data==null)	db.close();
		}

		return user;
	}
	
	public static int add(DB data,String unionid,String nickname,int sex,String headimgurl){
		if(V.isBlank(unionid)) return -1;
		
		String sql="insert into wx_user(user_unionid,user_nickname,user_sex,user_headimgurl,user_date) values (?,?,?,?,?)";
		Parameter[] para=new Parameter[]{new Parameter(unionid),new Parameter(nickname),new Parameter(sex),new Parameter(headimgurl),new Parameter(System.currentTimeMillis())};
		
		DB db=(data==null)?new DB() : data;
		int id=-1;
		try {
			if(db.update(sql, para)>0){
				Hashtable<String,String> h=db.queryOne("select user_id from wx_user where user_unionid=?", new Parameter[] { new Parameter(unionid)});
				id=V.parseInt(h.get("user_id"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			if(data==null) db.close();
		}
		return id;
	}
	
	public static boolean setCity(DB data,int id,String city){
		if(id<0 || V.isBlank(city)) return false;
		
		String sql="update wx_user set user_city=? where user_id=?";
		Parameter[] para=new Parameter[]{new Parameter(city),new Parameter(id)};
		
		DB db=(data==null)?new DB() : data;
		boolean res=false;
		try {
			res=(db.update(sql, para)>0);
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			if(data==null) db.close();
		}
		return res;
	}
	
	public static boolean setType(DB data,int id,int type){
		if(id<0 || type<0) return false;
		
		String sql="update wx_user set user_type=? where user_id=?";
		Parameter[] para=new Parameter[]{new Parameter(type),new Parameter(id)};
		
		DB db=(data==null)?new DB() : data;
		boolean res=false;
		try {
			res=(db.update(sql, para)>0);
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			if(data==null) db.close();
		}
		return res;
	}
}
