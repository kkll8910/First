package com.wdk.upload;

import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.GregorianCalendar;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.wdk.system.SystemConfigration;
import com.wdk.user.User;

import net.sf.json.JSONObject;

public class UploadPicture extends HttpServlet {
	private static Logger logger = LogManager.getLogger(UploadPicture.class.getName());
	private static final long serialVersionUID = 1L;

	private String privateDirectroyURI = "/PrivateDirectory";;
	private final String fileNameExtractorRegex = "filename=\".+\"";

	private double maxWidth = 960;
	private double maxHeight = 640;

	@Override
	public void init() throws ServletException {
		try {
			SystemConfigration sc=(SystemConfigration)this.getServletContext().getAttribute(SystemConfigration.NameInContext);
			
			this.privateDirectroyURI=sc.getString("PrivateDirectroyURI");
			this.maxWidth = sc.getInt("upload_image_maxWidth");
			this.maxHeight = sc.getInt("upload_image_maxHeight");
		} catch (Exception e) {
			logger.error("Servlet:{}启动时读取初始化参数时发生错误。",this.getClass().getName());
		}
		super.init();
	}

	public UploadPicture() {
		super();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		JSONObject result = new JSONObject();

		JSONObject res = this.saveFileToDirectory(request);
		if (res != null) {
			result.put("Result", res);
		}
		
		
		response.setContentType("text/javascript; charset=utf-8");
		response.setCharacterEncoding("utf-8");
		PrintWriter out = response.getWriter();
		out.print(result.toString());
		out.flush();

	}

	private JSONObject saveFileToDirectory(HttpServletRequest request) {
		JSONObject res = new JSONObject();

		User user = User.get(request);
		if (user == null) {
			res.put("Failure", "用户登录信息已过时，请重新登录。");
			return res;
		}

		String path = this.privateDirectroyURI + "/" + user.getId() + "/";
		ServletContext context = getServletContext();
		String RealPath = context.getRealPath(path);
		File dir = new File(RealPath);

		try {
			if (!dir.exists()) {
				dir.mkdirs();
			}

			Part part = request.getPart("picture");
			if (part == null) {
				res.put("Failure", "请选择您要上传的图片。");
				return res;
			}
			
			GregorianCalendar gg = new GregorianCalendar();
			String fileName = "pict_" + user.getId() + "_" + gg.getTimeInMillis() + "." + this.getExtName(part);

			BufferedImage src = ImageIO.read(part.getInputStream());
			double w = src.getWidth();
			double h = src.getHeight();

			double scale = (w / h >= 1) ? this.maxWidth / w : this.maxHeight / h;

			if (scale < 1) {
				int width = (int) Math.floor(w * scale);
				int height = (int) Math.floor(h * scale);

				Image image = src.getScaledInstance(width, height, Image.SCALE_DEFAULT);
				BufferedImage tag = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
				Graphics g = tag.getGraphics();
				g.drawImage(image, 0, 0, null); // 绘制缩小后的图
				g.dispose();

				// 输出到文件流
				ImageIO.write(tag, "JPEG", new File(context.getRealPath(path + fileName)));// 输出到文件流
			} else {
				part.write(context.getRealPath(path + fileName));// 输出到文件流
			}
			res.put("URL", path + fileName);
		} catch (Exception e) {
			res.put("Failure", e.getMessage());
		}
		return res;
	}

	private String getExtName(Part part) {
		// 获取header信息中的content-disposition，如果为文件，则可以从其中提取出文件名
		String cotentDesc = part.getHeader("content-disposition");
		String fileName = null;
		Pattern pattern = Pattern.compile(fileNameExtractorRegex);
		Matcher matcher = pattern.matcher(cotentDesc);
		if (matcher.find()) {
			fileName = matcher.group();
			fileName = fileName.substring(10, fileName.length() - 1);
		}

		String extName = "";
		if (fileName.indexOf(".") > 0) {
			extName = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length());
		} else {
			extName = "";
		}
		return extName;

	}
}
