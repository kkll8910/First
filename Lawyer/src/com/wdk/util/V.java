package com.wdk.util;

import java.awt.List;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class V {

	public static boolean isBlank(String s) {
		return s == null || s.equals("");
	}

	public static boolean isBlank(String[] s) {
		if (s == null)
			return true;
		for (int i = 0; i < s.length; i++) {
			if (s[i] == null || s[i].equals("")) {
				return true;
			}
		}
		return false;
	}
	
	public static boolean isBlank(ArrayList list) {
		return list==null || list.isEmpty();
	}
	

	public static boolean lengthBetween(String s, int min, int max) {
		if (s == null || s.equals("")) {
			return false;
		} else if (s.length() < min || s.length() > max) {
			return false;
		} else {
			return true;
		}
	}

	public static boolean isHanZi(String str) {
		char[] t1 = str.toCharArray();
		for (int i = 0; i < t1.length; i++) {
			// 判断是否为汉字字符
			if (!Character.toString(t1[i]).matches("[\\u4E00-\\u9FA5]+")) {
				return false;
			}
		}
		return true;
	}

	public static boolean isNumeric(String str) {
		Pattern pattern = Pattern.compile("[0-9]*");
		Matcher isNum = pattern.matcher(str);
		return isNum.matches();
	}

	public static boolean isInteger(String s) {
		if (V.isBlank(s)) {
			return false;
		}

		Pattern pattern = Pattern.compile("^[-\\+]?[\\d]*$");
		return pattern.matcher(s).matches();
	}

	public static boolean parseBoolean(String s){
		if (s == null || s.equals("")) {
			return false;
		}
		try {
			return Boolean.parseBoolean(s);
		} catch (Exception e) {
			return false;
		}
	}
	
	public static boolean parseBoolean(int s){
		return s>0;
	}
	
	public static int parseInt(String s){
		if (s == null || s.equals("")) {
			return -1;
		}
		try {
			return Integer.parseInt(s);
		} catch (Exception e) {
			return -1;
		}
	}
	
	public static long parseLong(String s){
		if (s == null || s.equals("")) {
			return -1;
		}
		try {
			return Long.parseLong(s);
		} catch (Exception e) {
			return -1;
		}
	}
	
	public static float parseFloat(String s){
		if (s == null || s.equals("")) {
			return -1;
		}
		try {
			return Float.parseFloat(s);
		} catch (Exception e) {
			return -1;
		}
	}
	

	public static boolean isEmail(String email) {
		if (V.isBlank(email)) {
			return false;
		}
		String checkPattern = "^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$";
		                        
		Pattern regex = Pattern.compile(checkPattern);
		return regex.matcher(email).matches();
	}

	public static boolean isMobile(String mobile) {
		if (V.isBlank(mobile)) {
			return false;
		}
		Pattern p = Pattern.compile("^1(3|4|5|7|8)\\d{9}$");

		Matcher m = p.matcher(mobile);
		return m.matches();
	}

	public static boolean isPassword(String pwd, int min, int max) {
		if (V.isBlank(pwd)) {
			return false;
		}
		Pattern p = Pattern.compile("^[a-zA-Z0-9]{" + min + "," + max + "}$");
		Matcher m = p.matcher(pwd);
		return m.matches();
	}

	public static boolean isConnection(String url) {
		boolean flag = false;
		int counts = 0;
		if (null == url || url.length() <= 0) {
			return flag;
		}
		while (counts < 10) {
			try {
				HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
				int state = connection.getResponseCode();
				if (state == 200) {
					flag = true;
				}
				break;
			} catch (Exception e) {
				counts++;
				continue;
			}
		}
		return flag;
	}

	public static String paseDateToString(String format, long date) {
		if (date <= 0) {
			return "";
		}

		String res = "";
		Date d = new Date(date * 1000);
		return new SimpleDateFormat(format).format(d);
	}

	public static Date paseDate(String str) {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = null;
		try {
			date = format.parse(str);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return date;
	}

	public static String parseDateToString(Date date) {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String str = format.format(date);
		return str;
	}

	public static boolean isOneOf(String str, String value) {
		String[] values = str.split(",");

		for (String s : values) {
			if (value.equals(s)) {
				return true;
			}
		}
		return false;
	}

	public static int parseMoneyToInt(String money) {
		Pattern pattern = Pattern.compile("^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,2})?$"); // 判断小数点后一位的数字的正则表达式
		Matcher match = pattern.matcher(money);
		if (match.matches() == false) {
			return -1;
		}

		try {
			return (int) (Float.parseFloat(money) * 100);
		} catch (Exception e) {
			return -1;
		}
	}

	public static int parseMoneyToInt(float money) {
		return (money < 0) ? -1 : (int) (money * 100);
	}

	public static float parseToMoney(long money) {
		return (money < 0) ? -1 : ((float) money) / 100;
	}

	public static float parseIntToMoney(String money) {
		try {
			int m = Integer.parseInt(money);
			return (m < 0) ? -1 : (float) (m / 100);
		} catch (Exception e) {
			return -1;
		}
	}
}
