package com.google.android.gcm.demo.app;

public class NotificationData {
	
	public static final int TEXT=0;
	
	public static final int IMAGE=1;
	
	public static final int VIDEO=2;
	
	public static final int DOCUMENT=3;
	
	public static final int PDF=4;
	
	public static final int MUSIC=5;
	
	public static final int UNKNOWN=5;
	
	public static final String FROM_USER="from";
	
	public static final String FROM_USER_CATEGORY="category";
	
	private String from;
	
	private String data;
	
	private String date;
	
	private String category;
	
	private String dataPath;

}
