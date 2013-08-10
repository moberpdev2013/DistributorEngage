var fileSystemObj=null;

function initFileSystem(callBack) {
	
	if(fileSystemObj==null){
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
    		gotFS(fs);
    		
    		if(callBack){
    			
    			callBack();
    		}
    		
    	}, fail);
	}else
	if(callBack){
		
		callBack();
	}
}

function gotFS(fileSystem) {
	 fileSystemObj = fileSystem;
    // fileSystem.root.getFile("notifications.json", {create: true, exclusive: false}, gotFileEntry, fail);
}

function fail(error) {
        console.log(error.code);
}

function getDirectory(dirName,callB){

	var dataDir = fileSystemObj.root.getDirectory(dirName, {create: true},function(dirEntry){
		
		if(callB){
			
			callB(dirEntry);
		}
	},function(err){
		
		console.log("create Directory error source " + error.source);
    	console.log("create Directory error target " + error.target);
    	console.log("create Directory error code" + error.code);
		
	});
}

function fileTransfer(url,fileName,dirName,callBack){
	
	if(!dirName){
		
		dirName = "mydata";
	}	
	
	
	getDirectory(dirName,function(dataDir){
		
		var filePath = dataDir.fullPath+"/"+fileName;

		var fileTransfer = new FileTransfer();

		fileTransfer.download(
	    	url,
	    	filePath,
	    	function(entry) {
	        	console.log("download complete: " + entry.fullPath);
	        	
	        	if(callBack){
	        		
	        		callBack(filePath);
	        	}
	    	},
	    	function(error) {
	        	console.log("download error source " + error.source);
	        	console.log("download error target " + error.target);
	        	console.log("upload error code" + error.code);
	    	}
		);

		
		
		
	});
	
	
}



function capturePhoto(){

	navigator.camera.getPicture(uploadPhoto,
    function(message) { showAlert('get picture failed'); },
                                        { quality: 50, 
                                        destinationType: navigator.camera.DestinationType.FILE_URI,
                                        sourceType : Camera.PictureSourceType.CAMERA }
    );
}


function uploadPhoto(imageURI) {
            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";

            var params = {};
            params.value1 = "test";
            params.value2 = "param";

            options.params = params;

            var ft = new FileTransfer();
            
            ft.upload(imageURI, encodeURI("http://some.server.com/upload.php"), win, fail, options);
}

function win(r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
}

function showAlert(data) {
        navigator.notification.alert(
            data,  // message
            alertDismissed,         // callback
            'Register',            // title
            'Done'                  // buttonName
        );
}

function sendComplaints(){

	var compText= $("#complaintBoxText").val();
	var compAddress= $("#complaintBoxAddress").val();
	try{
		
		$.post("http://showmystatus.appspot.com/complaints",{text:compText,address:compAddress},function(result){
	    	
	  	});
	    $("#back").click();
	}catch(err){
		showAlert(err);
	}
	
	
}
function alertDismissed(){
	$("#back").click();
}




		
	
	function showImage(ev){		
		
		for (var i = 0; i < ev.target.files.length; i++) {
            var fr = new FileReader();
            var file = ev.target.files[i];
			fr.onloadend = function(ev1){
				console.log("Point 3:::"+ file.type );
        		if (file.type.search(/image\/.*/) != -1) {
                    $("#myimage").attr("src",ev1.target.result);                	
                }
				
			}
			fr.readAsDataURL(file);
		}
			
		
	}
	
	function uploadFile(){
	
		$("#busypop").click();
		
		console.log("User"+getUser());
		
		$("#user").val(getUser());
		
		$.get("http://showmystatus.appspot.com/complaints_upload.jsp",function(data){
		
		$( "#myPopupDiv" ).popup( "close" )
		
			$('form').attr("action",$.trim(data));
			
			$('form').ajaxSubmit({success:function(){
			
				$("#back").click();
			}});
		});
	
	}