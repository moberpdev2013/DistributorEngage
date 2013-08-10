/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2011, IBM Corporation
 *
 * Modified by Murray Macdonald (murray@workgroup.ca) on 2012/05/30 to add support for stop(), pitch(), speed() and interrupt();
 *
 */

package com.google.android.gcm.demo.app;

import static com.google.android.gcm.demo.app.CommonUtilities.DISPLAY_MESSAGE_ACTION;
import static com.google.android.gcm.demo.app.CommonUtilities.EXTRA_MESSAGE;
import static com.google.android.gcm.demo.app.CommonUtilities.SENDER_ID;
import static com.google.android.gcm.demo.app.CommonUtilities.SERVER_URL;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.os.AsyncTask;

import com.google.android.gcm.GCMRegistrar;

public class GCMPlugin extends CordovaPlugin {

	private static final String LOG_TAG = "TTS";
	private static final int STOPPED = 0;
	private static final int INITIALIZING = 1;
	private static final int STARTED = 2;

	private int state = STOPPED;
	private CallbackContext startupCallbackContext;
	private CallbackContext callbackContext;
	AsyncTask<Void, Void, Void> mRegisterTask;

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) {
		
		ConnectivityManager conMgr = (ConnectivityManager) webView.getContext().getSystemService(Context.CONNECTIVITY_SERVICE);

		boolean connected = (conMgr.getActiveNetworkInfo() != null && conMgr.getActiveNetworkInfo().isAvailable() && conMgr
				.getActiveNetworkInfo().isConnected());
		
		if(!connected){
			PluginResult.Status status = PluginResult.Status.ERROR;
			callbackContext.sendPluginResult(new PluginResult(status,
					"Registration Failed due to Network Connection Unavailability"));
			
			return false;
		}

		PluginResult.Status status = PluginResult.Status.OK;
		
		
		String result = "";
		this.callbackContext = callbackContext;

		try {

			if (!GCMRegistrar.isRegisteredOnServer(cordova.getActivity())) {
				
				checkNotNull(SERVER_URL, "SERVER_URL");
				checkNotNull(SENDER_ID, "SENDER_ID");
				
				GCMRegistrar.checkDevice(webView.getContext());
				GCMRegistrar.checkManifest(webView.getContext());

				String userId = args.getString(0);

				CommonUtilities.USER_ID = userId;

				System.out.println("Execute");

				String commandId = args.getString(0);

				CommonUtilities.USER_ID = commandId;

				webView.getContext().registerReceiver(mHandleMessageReceiver,
						new IntentFilter(DISPLAY_MESSAGE_ACTION));

				final String regId = GCMRegistrar.getRegistrationId(webView
						.getContext());

				if (regId == null || regId.equals("")) {

					GCMRegistrar.register(cordova.getActivity(), SENDER_ID);

				} else {

					registerTimerTask(regId);

				}

			}
			
			else{
				CommonUtilities.USER_ID = args.getString(0);
				
				final String regId = GCMRegistrar.getRegistrationId(cordova.getActivity());
				registerTimerTask(regId);

			}
			

		} catch (Exception e) {
			e.printStackTrace();
			callbackContext.sendPluginResult(new PluginResult(
					PluginResult.Status.JSON_EXCEPTION));
		}
		return true;
	}
	private void checkNotNull(Object reference, String name) {
		if (reference == null) {
			throw new NullPointerException();
		}
	}

	private boolean isReady() {
		// TODO Auto-generated method stub
		return true;
	}

	/**
	 * Clean up the TTS resources
	 */
	public void onDestroy() {

		if (mRegisterTask != null) {
			mRegisterTask.cancel(true);
		}
		webView.getContext().unregisterReceiver(mHandleMessageReceiver);
		GCMRegistrar.onDestroy(webView.getContext());
		super.onDestroy();

	}

	private void registerTimerTask(final String regId) {

		final Context context = webView.getContext();
		mRegisterTask = new AsyncTask<Void, Void, Void>() {

			@Override
			protected Void doInBackground(Void... params) {
				boolean registered = ServerUtilities.register(context, regId);

				if (!registered) {
					GCMRegistrar.unregister(context);
				}else{
					PluginResult.Status status = PluginResult.Status.OK;
					
					callbackContext.sendPluginResult(new PluginResult(status,
							"Registration Success"));
				}
				return null;
			}

			@Override
			protected void onPostExecute(Void result) {
				mRegisterTask = null;
			}

		};
		mRegisterTask.execute(null, null, null);

	}
	
	


	private final BroadcastReceiver mHandleMessageReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			String newMessage = intent.getExtras().getString(EXTRA_MESSAGE);

		}
	};

}