package com.wdk.item;

import java.sql.Date;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;

import com.wdk.util.DB;
import com.wdk.util.Parameter;
import com.wdk.util.V;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class Item {
	public static final int Catagory_User=1;
	public static final int Catagory_Order=2;
	
	public static final String Type_String="String";
	public static final String Type_Int="Int";
	public static final String Type_Float="Float";
	public static final String Type_Boolean="Boolean";
	public static final String Type_Date="Date";
	public static final String Type_JSON="JSON";
	public static final String Type_Array="Array";
	
	
	
	
	private int id;
	private int catagory;
	private int parent;
	private String key;
	private String value;
	private String title;
	private String type;

	public Item(int id, int catagory, String title,int parent, String key, String value, String type) {
		super();
		this.id = id;
		this.catagory = catagory;
		this.parent = parent;
		this.key = key;
		this.value = value;
		this.title = title;
		this.type = type;
	}

	
	
	public Item() {
		
	}



	public int getId() {
		return id;
	}

	public int getCatagory() {
		return catagory;
	}

	public int getParent() {
		return parent;
	}

	public String getKey() {
		return key;
	}

	public String getTitle() {
		return title;
	}

	public String getTyupe() {
		return type;
	}

		
	
	public String getStringValue() {
		return value;
	}
	
	public int getIntValue(){
		return V.parseInt(this.value);
	}
	
	public float getFloatValue(){
		return V.parseFloat(this.value);
	}
	
	public Date getDateValue(){
		long v=V.parseLong(this.value);
		if(v>0){
			return new Date(v);
		}else{
			return null;
		}
	}
	
	public JSONObject getJSONObjectValue(){
		JSONObject obj=null;
		try {
			obj=JSONObject.fromObject(value);
		} catch (Exception e) {
			// TODO: handle exception
		}
		return obj;
	}
	
	public JSONArray getJSONArrayValue(){
		JSONArray arr=null;
		try {
			arr=JSONArray.fromObject(value);
		} catch (Exception e) {
			// TODO: handle exception
		}
		return arr;
	}
	
	
	public void setId(int id) {
		this.id = id;
	}

	public void setCatagory(int catagory) {
		this.catagory = catagory;
	}

	public void setParent(int parent) {
		this.parent = parent;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setType(String type) {
		this.type = type;
	}

	
		
	
	public static ArrayList<Item> parse(ArrayList<Hashtable<String,String>> list){
		ArrayList<Item> res=null;
		if(!V.isBlank(list)){
			res=new ArrayList<Item>(list.size());
			for(Hashtable<String,String> h :list){
				Item item=parse(h);
				if(h!=null){
					res.add(item);
				}
			}
			
		}
		return res;
	}
	
    public static Item parse(Hashtable<String,String> h){
    	if(h==null || h.isEmpty()){
    		return null;
    	}
    	
    	int id=V.parseInt(h.get("item_id"));
    	int catagory=V.parseInt(h.get("item_catagory"));
    	int parent=V.parseInt(h.get("item_id"));
    	String key=h.get("item_key");
    	String value=h.get("item_value");
    	String title=h.get("item_title");
    	String type=h.get("item_type");
    	return new Item(id, catagory, title,  parent, key, value,type);
    }
    
    public static ArrayList<Item> getItemByParent(int catagory,int parent,DB data){
    	if(catagory<0 || parent<=0) return null;
    	
    	DB db=(data==null)?new DB() : data;
    	ArrayList<Item> res=null;
    	try {
    		ArrayList<Hashtable<String,String>> list=db.query("select * from wx_item where item_catagory=? and item_parent=?", new Parameter[]{new Parameter(catagory),new Parameter(parent)});
    		res=parse(list);
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			if(data==null) db.close();
		}
    	return res;
    }
        
    public static int add(DB data,int catagory,int parent,String title,String key,String value,String type){
    	if(catagory<0 || parent<0 || V.isBlank(key) || V.isBlank(value) || V.isBlank(type)){
    		return -1;
    	}
    	
    	int id=-1;
    	DB db=(data==null)?new DB() : data;
    	String sql="insert into wx_item(wx_catagory,wx_parent,wx_title,wx_key,wx_value,wx_type) values (?,?,?,?,?,?)";
    	Parameter[] paras=new Parameter[]{
    			new Parameter(catagory),
    			new Parameter(parent),
    			new Parameter(title),
    			new Parameter(key),
    			new Parameter(value),
    			new Parameter(type)
    	};
    	
    	
    	try {
    		if(db.update(sql, paras)>0){
    			Hashtable<String,String> h=db.queryOne("select max(item_id) as id from wx_item where catagory="+catagory+" and parent="+parent,null);
    			id=V.parseInt(h.get("id"));
    		}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			if(data==null) db.close();
		}
    	return id;
    }
    
    public static boolean modifyValue(int id,String value,DB data){
    	if(id<0 || V.isBlank(value)) return false;
    	DB db=(data==null)?new DB() : data;
    	String sql="update wx_item set item_value=? where item_id=?";
    	Parameter[] paras=new Parameter[]{
    			new Parameter(value),
    			new Parameter(id)
    	};
    	
    	boolean res=false;
    	try {
    		res=(db.update(sql, paras)>0);
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			if(data==null) db.close();
		}
    	return res;
    }
    
    public static boolean modifyTitle(int id,String title,DB data){
    	if(id<0 || V.isBlank(title)) return false;
    	DB db=(data==null)?new DB() : data;
    	String sql="update wx_item set item_title=? where item_id=?";
    	Parameter[] paras=new Parameter[]{
    			new Parameter(title),
    			new Parameter(id)
    	};
    	
    	boolean res=false;
    	try {
    		res=(db.update(sql, paras)>0);
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			if(data==null) db.close();
		}
    	return res;
    }
    
    public static boolean delete(int id,DB data){
    	if(id<0) return false;
    	DB db=(data==null)?new DB() : data;
    	String sql="delete from wx_item  where item_id=?";
    	Parameter[] paras=new Parameter[]{new Parameter(id)};
    	
    	boolean res=false;
    	try {
    		res=(db.update(sql, paras)>0);
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			if(data==null) db.close();
		}
    	return res;
    }
}
