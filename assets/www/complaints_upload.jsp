<%@page import="org.json.JSONObject"%>
<%@page import="org.apache.commons.fileupload.*"%>
<%@page import="org.apache.commons.fileupload.servlet.ServletFileUpload"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.*"%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>

<%
try {
	
    ServletFileUpload upload = new ServletFileUpload();
    response.setContentType("text/plain");

    FileItemIterator iterator = upload.getItemIterator(request);
    
    StringBuffer sb = new StringBuffer();
    while (iterator.hasNext()) {
      FileItemStream item = iterator.next();
      InputStream stream = item.openStream();

      if (item.isFormField()) {
       		 out.println("Got a form field: " + item.getFieldName());
       		 
       		 //sb.append(item.getFieldName()+":"+item.getHeaders().getHeaderNames().toString());
       		 
      } else {    	    	
	    	out.println("Got a file field: " + item.getName());
			
	    	String owner = request.getParameter("user");
	    	
	    	
	    	
	    		
	  		
  		}
    }
    out.println("Send Success :  name = " + sb.toString());
  } catch (Exception ex) {
    throw new ServletException(ex);
  }
%>
