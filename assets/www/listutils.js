var url="http://showmystatus.appspot.com/index.jsp?action=json&name=";

function createDataList(name,isOffline){
	if(isOffline){
	
			readFileData(name+".json",function(data){
			
				var jsonD = jQuery.parseJSON(data);
			    createList(jsonD);
			});
	}else{
		
		console.log(url+name+"&user="+getUser());
		
		$.getJSON(url+name+"&user="+getUser(),function(data){
	    
			console.log("Data  : " +data);
			createFile(name+".json",function(fileEntry){			
				fileEntry.createWriter(function(writer){
				
					gotFileWriter(writer,data);
				}, fail);
		
			});		
			console.log("call create"+JSON.stringify(data));		
			createList(data);	
		});
	
	}
	
	
	
			
			
}

function createList(jsol){
		
			$("#mydlist li").remove();
			
			$.each(jsol,function(k,jso){
			
				var dm = jQuery.parseJSON(jso.data);
				
				if(!dm.length){
					
					dm=dm.data;
				}
				
				$.each(dm,function(i,j){
				
				    var mk=new Array();
					
					for(var key in j){
					
						mk[mk.length]=j[key];
						
						
					}
					$("#mydlist").append(
					"<li>"+
							"<a href=\"index.html\">"+
							"<h3>"+mk[0]+"</h3>"+
							"<p><strong>"+mk[1]+"</strong></p>"+
							"<p>"+mk[2]+"</p>"+
							"<p class=\"ui-li-aside\"><strong>"+jso.ownerCategory+"@"+jso.owner+"</strong></br><strong>"+jso.lastAccessDate+"</strong></p>"+
							"</a>"+
						"</li>");
					
				});
				
				$("#header").html(jso.keyName);
			
			});
			
			
			
			$('#mydlist').listview('refresh');
		
}

var pName=null;
function createUpdateDataList(name,isOffline){
	
	pName=name;
	
	if(isOffline){
		
		readFileData(name+".json",function(data){
		
			var jsonD = jQuery.parseJSON(data);
			createUpdateList(jsonD);
			
			
		});
		
	}else{
		
		$.getJSON(url+name+"&user="+getUser(),function(data){		
			
			createFile(name+".json",function(fileEntry){			
				fileEntry.createWriter(function(writer){
				
					gotFileWriter(writer,data);
				}, fail);
		
			});
			createUpdateList(data);
			
		});
			
	}
			
			
}
var dataArray=new Array();

var jsonBas = null;

function createUpdateList(jsol){
		
			$("#mydlist .ui-grid-c").remove();
			var a=-1;
			var ar=['a','b','c','d','e'];
			
			$.each(jsol,function(k,jso){
			
				var dm = jQuery.parseJSON(jso.data);
				
				if(!dm.length){
					
					dm=dm.data;
				}
				
				$.each(dm,function(i,j){
				
				    var mk=new Array();
					
					for(var key in j){
					
						if(key!="")
						mk[mk.length]=j[key];
						
						
					}
					
					if(a==-1){
					
					 var dat="<div class=\"ui-grid-"+ar[mk.length-1]+"\">";
					 
					 
					 var ab=0;
					 for(var key in j){
						 
					 	dat+="<div class=\"ui-block-"+ar[ab]+"\"><h2 for=\"value\" style=\"margin:8px 10px 0 0; text-align:left;\">"+key+"</h2></div>";
					 	ab++;
					 	
					 }				
					dat+="</div>";
					
					$("#mydlist").append(dat);
					
					}
					a++;
					
					 var dat="<div id=\"grid_"+a+"\" class=\"datagrid ui-grid-"+ar[mk.length-1]+"\">";
					 
					 
					 
					 for(var m=0;m<mk.length;m++){
						 
					 	if(m==mk.length-1){
					 		dat+="<div class=\"ui-block-"+ar[m]+"\"><input id=\"value\" value=\""+mk[m]+"\" style=\"float:left;\"/></div>";	
					 	}else{
					 		dat+="<div class=\"ui-block-"+ar[m]+"\"><label for=\"value\" style=\"margin:8px 10px 0 0; text-align:left;\">"+mk[m]+"</label></div>";
					 	}
					 	
					 	dataArray[a]=j;
					 }				
					dat+="</div>";
					
					$("#mydlist").append(dat);
					
				});
				
				$("#header").html(jso.keyName);
			
			});
			
			
			
			$('#mydlist').listview('refresh');
		
}

function updateAll(){
	$.each($(".datagrid"),function(i,j){
	
		var index = parseInt(($(j).attr("id")).split("_")[1]);
		
		var cval = $("input",$(j)).val();
		
		var mk=new Array();
		
		var j=dataArray[index];
		
		var lk="";
					
		for(var key in j){
					
			if(key!=""){
				mk[mk.length]=j[key];
				
				lk=key;	
			}
						
		}
		
		if(mk[mk.length-1]!=cval){
		
			j[lk]=cval;
			
			
		}
	
	});
	
	updateDataToServer();
	
	
}









	function readFileData(name,callBack) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        				fileSystem.root.getFile(name, null, function(fileEntry){
        						fileEntry.file(function(file){
        						
        							readAsText(file,callBack);
        							
        						}, fail);
        				
        				}, fail);
    		}, fail);
    }

    function readAsText(file,callBack) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("Read as text");
            console.log(evt.target.result);
            callBack(evt.target.result);
        };
        reader.readAsText(file);
    }


    function createFile(name,callBack) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
        				function gotFS(fileSystem) {
        						fileSystem.root.getFile(name, {create: true, exclusive: false}, callBack, fail);
    												}, fail);
    }

    

   

    function gotFileWriter(writer,data) {
        writer.onwriteend = function(evt) {
            console.log("contents of file now 'some sample text'");
            
        };
        writer.write(JSON.stringify(data));
    }

    function fail(error) {
        console.log(error.code);
    }
    
    
    function updateDataToServer(){

		
		
		var action="updatejson";
		
	
		try{
		
			$.post("http://showmystatus.appspot.com/index.jsp",{data:JSON.stringify(dataArray),user:getUser(),name:pName,action:action},function(result){
	    		
	    		$("#back").click();	
	  		});
	    
	}catch(err){
		showAlert(err);
	}
	
	
	}
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    