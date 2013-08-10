//transaction.executeSql("CREATE TABLE IF NOT EXISTS notification_data(payload TEXT, type TEXT,time DATE,isread boolean,sender Text,contentpath Text,isdownloaded boolean);", [], nullDataHandler, errorHandler);
var serverUrl ="http://showmystatus.appspot.com/";

function Notification(){

	this.payload=null;
	this.contentType=null;
	this.contentName=null;
	this.time=null;
	this.isread=false;
	this.contentpath=null;
	this.isdownloaded=false;
	this.sender=null;
	this.id=null;
	this.url=null;
	this.category=null;
	this.subcategory=null;
   
    
};



var Utils = {	
		
	loadNotifications: function(callBack){
			
		initFileSystem(function(){
			
			deleteWithCondition("notifications"," WHERE contentType !='text' and url=''",function(){
			
				Utils.loadAllData(callBack);
				
			});
			
			
		});	
	},
	loadAllData: function(callBack){		
		
		console.log(serverUrl+"index.jsp?action=notifications&user="+getUser());	
		
		$.getJSON(serverUrl+"index.jsp?action=notifications&user="+getUser(),function(obj){			
			//console.log(JSON.stringify(obj));
			if(obj.length){
			$.each(obj,function(i,j){				
				readRecords("notifications","where id="+j.id,function(objects){					
					if(objects && objects.length){						
						console.log("Already Read");						
					}else{						
						if(j.id){						
							var n = new Notification();
							n.id=""+j.id;
							n.contentType=j.contentType;
							if(j.contentType && j.contentType!=""){								
								if(j.contentType.indexOf("img")!=-1 || j.contentType.indexOf("image")!=-1 || j.contentType.indexOf("png")!=-1 ||
										j.contentType.indexOf("jpeg")!=-1 || j.contentType.indexOf("jpeg")!=-1){									
									n.contentType="image";																	
								}else if(j.contentType.indexOf("audio")!=-1){									
									n.contentType="audio";										
								}else if(j.contentType.indexOf("video")!=-1){									
									n.contentType="video";										
								}else{									
									n.contentType="file";									
								}
							}else{								
								n.contentType="text";
							}
							var actFileName = j.contentName;							
							if(j.contentName){								
								if(j.contentName.indexOf(".zip::")!=-1){									
									j.contentName = j.contentName.split(".zip::")[1];									
									n.contentName=j.contentName;									
								}else{								
									n.contentName=j.contentName;									
								}								
							}
							if(j.subCategory){								
								n.subcategory=j.subCategory;								
							}							
							n.sender=j.userName;							
							if(j.category){
								//j.category = j.category.replace(/'/g,"''");
								n.category = j.category;
							}
							if(j.text){
								//j.text = j.text.replace(/'/g,"''");
								n.payload=j.text;
							}
							if(j.dataKey && j.dataKey!=""){								
								n.url="";								
								var myTurl = serverUrl+"/serve?blob-key="+j.dataKey+"&file="+actFileName;
								
								n.isdownloaded=false;								
								n.isread=false;								
								n.time=j.lastAccess;								
								console.log("Insert phase......................."+n.id+" name : " + j.contentName);
								Utils.insertRow(n,function(){
									
										console.log("Done.......................");
									
									fileTransfer(myTurl,j.contentName,n.contentType,function(path){
										console.log("Full Path Created>>> "+path);										
										var keyMap = [];
										keyMap['url']=path;
										keyMap['isdownloaded']=true;									
										Utils.updateRow(keyMap, n.id);								
										
									});
									
								});
								
								
								
																
								
								
							}else{
								
								
							}				
							
							
							
						}
					}
					
				});
				
				
				
			});
			
		}
			
			setTimeout(function(){
				

				if(callBack){
					
					callBack();
				}
				
				
			},2000);
			
			
			
		});
		
		
		
	},

	
    insertRow: function(notificationObj,callBack){	
		var kvp=[];		
		for(var key in notificationObj){			
			kvp[key]=notificationObj[key];			
		}				
		insert("notifications",kvp,callBack);
	
	},
	
	 checkIntegrity: function(notificationObj,callBack){	
			
		
	},
	
    updateRow: function(kvp,key){    	
		update("notifications",kvp,"id",key);	
	},
	fetchAllNotifications: function(status,myDataBack,type){	
		var condition = "order by time desc";	
		
		if(status=="READ"){			
			condition="where isread=true";			
		}else if(status=="UNREAD"){		
			condition="where isread=false";
		}		
		if(type){
			
			type = type.replace(/'/g,"''");
			
			//type = type.replace(/\//g,"\\/");
			
			if(type.indexOf("/")!=-1){
				type = type.split("/")[0];
				condition="where category like '"+type+"%' order by time desc";
			}else{
				
				condition="where category='"+type+"' order by time desc";
			}
			
			
		}
		
		readRecords("notifications",condition,function(objects){			
			var nots = new Array();
			if(objects && objects.length){	
				
				console.log("Num Records : " + objects.length);
				for(var i=0;i<objects.length;i++){				
					var n =new Notification();					
					for(var k in objects[i]){					
						n[k]=objects[i][k];
					}					
					if(n.contentType!=null && n.contentType){						
						
					}					
					nots[nots.length]=n;							
				}
			
			}
			console.log("Num Records is Emptyy..............");
			if(myDataBack){
				myDataBack(nots);
			}
		
		});
	
	},
	
};

function unitTests(){

	var n = new Notification();
	/*	n.payload="Test";
		n.type="text";
		n.time=new Date();
		this.isread=false;
		this.sender="admin";
		
	n.insertRow(n);*/
	
	Utils.fetchAllNotifications(null,function(nots){
		
		alert("Total Nots : " +nots.length+""+nots[0].time);
		
		
	});
}
var notsMap=[];
function readNotifications(type){
	
	
	Utils.fetchAllNotifications(null,function(nots){
		
		$("#mylist li").remove();
		
		var ma=[];
		
		for(var i=0;i<nots.length;i++){
			
			notsMap[nots[i].id]=nots[i];
			
			var tKey = nots[i].time.split(" ");
			
			tKey=tKey[0]+" "+tKey[1]+" "+tKey[2];
			
			var obj = ma[tKey];
			
			if(obj==null){
			
				obj=new Array();
			
				ma[tKey]=obj;
				
			}
			
			obj[obj.length] = nots[i];
			
			
			
		}
		
		for(var mk in ma){
		
			generateHtml(ma[mk],mk);
		}
		
		$("#mylist").listview('refresh');
		$( ".photopopup" ).on({
			popupbeforeposition: function() {
				 var maxHeight = $( window ).height() - 60 + "px";
				 var maxWidth = $( window ).width() - 60 + "px";
				 $( ".photopopup img" ).css( "max-height", maxHeight );
				 $( ".photopopup img" ).css( "max-width", maxWidth );
				 
			}
		});
   

	},type);

}

function generateHtml(obj,key){

			var data = "<li data-role=\"list-divider\">"+key+" <span class=\"ui-li-count\">"+obj.length+"</span></li>";
	
			for(var i=0;i<obj.length;i++){
			
			var popupC = "popupText";
			if(obj[i].contentType=="image"){
					popupC="popupPhotoPortrait";
			}else if(obj[i].contentType=="audio"){
					popupC="popupAudio";
			}
			var curl = "images/file.png";
			
			//data+="<li><a onclick=\"clickData('"+obj[i].contentType+"','"+obj[i].payload+"','"+obj[i].sender+"','"+obj[i].url+"');\" href=\"#"+popupC+"\" data-rel=\"popup\" data-position-to=\"window\" >";
			
			if(obj[i].contentType=="image"){
				
					
				   
				   curl = obj[i].url;
				   
				   data+="<li><a onclick=\"clickData('"+obj[i].contentType+"','"+encodeURI(obj[i].payload)+"','"+obj[i].sender+"','"+obj[i].url+"','"+obj[i].id+"');\" href=\"#"+popupC+"\" data-rel=\"popup\" data-position-to=\"window\" >";
				   
				   data+="<img class=\"smi\" src=\""+curl+"\"/>";
			   		
			}else if(obj[i].contentType=="text"){
				   
				   curl = "images/file.png";
				   
				   data+="<li><a onclick=\"clickData('"+obj[i].contentType+"','"+encodeURI(obj[i].payload)+"','"+obj[i].sender+"','"+obj[i].url+"');\" href=\"#"+popupC+"\" data-rel=\"popup\" data-position-to=\"window\" >";
			
			}else if(obj[i].contentType=="audio"){
				   
				   curl = "images/audio.png";
				   
				   data+="<li><a onclick=\"clickData('"+obj[i].contentType+"','"+encodeURI(obj[i].payload)+"','"+obj[i].sender+"','"+obj[i].url+"');\" href=\"#"+popupC+"\" data-rel=\"popup\" data-position-to=\"window\" >";
			
				   data+="<img class=\"smi\" src=\""+curl+"\"/>";
			
			}else if(obj[i].contentType=="video"){
				   
				   curl = "images/video.png";
				   
				   data+="<li><a  href=\""+obj[i].url+"\" data-rel=\"popup\" data-position-to=\"window\" >";
			
				   data+="<img class=\"smi\" src=\""+curl+"\"/>";
			}else{
				   
				   curl = "images/file.png";
				   
				   data+="<li><a  href=\""+obj[i].url+"\" data-rel=\"popup\" data-position-to=\"window\" >";
			
				   data+="<img class=\"smi\" src=\""+curl+"\"/>";
			}
			
				
			   
			var head=obj[i].category;
			
			if(obj[i].subcategory){
				
				head=obj[i].subcategory;
			}
			
			data+="<h3>"+head+"</h3>";
			   
			   data+="<p>"+obj[i].payload+"</p>";
			    
			    data+="<p class=\"ui-li-aside\"><strong>"+obj[i].time.split(" ")[3]+"</strong><br><strong>"+obj[i].sender+"</strong></p>";	
			   
			  
			   			
	           data+="</a></li>";
	           
	         }
	         
	        data+="</li>";
	        $("#mylist").append(data);
	       
}
function clickData(a,b,c,d,e){
	
	
	if(a=="text"){
	
		
	
		$("#popupText .data").html(b);
		$("#popupText .from").html(c);
		
		
	}else if(a=="image"){
		
		console.log("Url Selected to Vuew ::::::::::::::::::" +d);
		
		
		$(".extra").remove();
		
		$("#popupPhotoPortrait .textdata").html(decodeURI(b));
		
		var not=notsMap[e];
		if(!not.subcategory){
			$("#popupPhotoPortrait .imlih").html(not.category);
		}else{
			$("#popupPhotoPortrait .imlih").html(not.subcategory);
		}
		
		$("#popupPhotoPortrait img").attr("src",d);
		var extra="";
		for(var key in notsMap){
			
			if(notsMap[key].url!=d && notsMap[key].id!=e && notsMap[key].subcategory && notsMap[key].subcategory==not.subcategory && notsMap[key].category && notsMap[key].category==not.category){
				
			
				if(notsMap[key].contentType=="image"){
					
					extra = "<li class=\"extra imli\" data-role=\"fieldcontain\">";					
				
					extra+="<img src=\""+notsMap[key].url+"\" alt=\"Photo landscape\"/>";
					
					extra+="</li>";
				
				}
				
				
				
				extra+="<li><div class=\"extra textdata\" style=\"font-weight: bold; font-size: 10pt\">"+notsMap[key].payload+"</div></li>";
				
				
			}
			
		}
		$("#popupPhotoPortrait .imul").append(extra);
		$("#popupPhotoPortrait .imul").listview('refresh');
		
		
		$("#popupPhotoPortrait img").removeClass("ui-li-thumb");
		$("#popupPhotoPortrait img").css("max-width","100%");
		$("#popupPhotoPortrait img").css("max-height","100%");	
		$("#popupPhotoPortrait").css("padding","5px");
		$("#popupPhotoPortrait .imli").css("padding-left","0px");
	}
	var maxHeight = $( window ).height() - 60 + "px";
   	var maxWidth = $( window ).width() - 60 + "px";
	$( "#popupText" ).css( "height", maxHeight );
   	$( "#popupText" ).css( "width", maxWidth );
   	
   	if(a=="audio"){
   		
   		playAudio(d);
   	}
	
}

function getMessagingInfo(isOnline,type){
	if(isOnline){
		$("#refresh_data").html("Refresh in Progress....");
		Utils.loadNotifications(function(){
			readNotifications(type);
			$("#refresh_data").html("Refresh");
		});
				
	}else{
		readNotifications(type);
	}			
}		
///////////////



// Audio player
//
var my_media = null;
var mediaTimer = null;

// Play audio
//
function playAudio(src) {
    // Create Media object from src
    my_media = new Media(src, onSuccess, onError);

    // Play audio
    my_media.play();

    // Update my_media position every second
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            my_media.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                        setAudioPosition((position) + " sec");
                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
        }, 1000);
    }
}

// Pause audio
// 
function pauseAudio() {
    if (my_media) {
        my_media.pause();
    }
}

// Stop audio
// 
function stopAudio() {
    if (my_media) {
        my_media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}

// onSuccess Callback
//
function onSuccess() {
    console.log("playAudio():Audio Success");
}

// onError Callback 
//
function onError(error) {
    alert('code: '    + error.code    + '\n' + 
          'message: ' + error.message + '\n');
}

// Set audio position
// 
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}

