function initDatabase(callBack) {
	try {
	    if (!window.openDatabase) {
	        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
	    } else {
	        var shortName = 'MYDB';
	        var version = '2.0';
	        var displayName = 'MYDB Test';
	        var maxSize = 100000; // in bytes
	        DEMODB = openDatabase(shortName, version, displayName, maxSize);
			createTables(callBack);
			
	    }
	} catch(e) {
	    if (e == 2) {
	        // Version mismatch.
	        console.log("Invalid database version.");
	    } else {
	        console.log("Unknown error "+ e +".");
	    }
	    return;
	} 
}


function createTables(callBack){
	DEMODB.transaction(
        function (transaction) {
        	transaction.executeSql("CREATE TABLE IF NOT EXISTS application_data(property TEXT, value TEXT,lastaccess DATE);", [], nullDataHandler, errorHandler);
			transaction.executeSql("CREATE TABLE IF NOT EXISTS notifications(payload TEXT, contentType TEXT,contentName TEXT,time DATE,isread boolean,sender Text,contentpath Text,isdownloaded boolean,id text,url text,category text,subcategory text);", [], nullDataHandler, errorHandler);
			
			if(callBack){
				callBack();
			}
        }
    );
	
}
function readProperty(callBack){
  	DEMODB.transaction(
        		function (transaction) {
		        	transaction.executeSql("SELECT * FROM application_data", [], function(transaction, results){
			
					if(results.rows.length==0){
						
						callBack(null);
					}else{
						
						var object=[];
						
						for (var i=0; i<results.rows.length; i++) {
						
							var row = results.rows.item(i);
							
							object[row.property]=row.value;
				 			
				 		}
			 			callBack(object);
			 		}
			 	}, errorHandler);
			
			
        		}
    );
 
}

function insert(tableName,dataKVP,callBack){
	DEMODB.transaction(
	    function (transaction) {
		  
		var sqK="(";
		var app="";
		var sqV="(";
		var data=new Array();
		for(var key in dataKVP){
		
			sqK+=app+key;
			sqV+=app+"?";
			app=",";
			data[data.length]=dataKVP[key];
		}
		sqK+=") ";
		sqV+=") ;";
		
		
		
	
	
		transaction.executeSql("INSERT INTO "+tableName+sqK+" VALUES "+sqV, data,function(){
			if(callBack){
				
				callBack();
			}
			
		},errorHandler);
	    }
	);	
}

function deleteRecords(tableName,id,callBack){
	DEMODB.transaction(
	    function (transaction) {
		
	
	
		transaction.executeSql("DELETE FROM "+tableName+" WHERE id ='"+id+"'", data,function(){
			if(callBack){
				
				callBack();
			}
			
		},errorHandler);
	    }
	);	
}
function deleteWithCondition(tableName,condition,callBack){
	DEMODB.transaction(
	    function (transaction) {
		
	    var data=new Array();
	
		transaction.executeSql("DELETE FROM "+tableName+" "+condition, data,function(){
			if(callBack){
				
				callBack();
			}
			
		},errorHandler);
	    }
	);	
}

function update(tableName,dataKVP,keyName,keyVal){
	DEMODB.transaction(
	    function (transaction) {
		  
	    	var sqV="";
			var app="";
			var data=new Array();
			for(var key in dataKVP){
			
				
				sqV+=app+key+"=?";
				app=",";
				data[data.length]=dataKVP[key];
			}
			
			sqV+=" where "+keyName+"='"+keyVal+"'";
			
			
			
			transaction.executeSql("UPDATE "+tableName+" SET "+sqV+";", data,function(){
				
				console.log("DAAAAAAAAAAAA : Success");
			},function(){
				console.log("DAAAAAAAAAAAA : Fail");
				
			});
		
		
		});	
}

function errorHandler(transaction, error){
 	if (error.code==1){
 		// DB Table already exists
 	} else {
    	// Error is a human-readable string.
	    console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
 	}
    return false;
}


function nullDataHandler(){
	console.log("SQL Query Succeeded");
	
}

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};



function readRecords(tableName,condition,callBack){
  	DEMODB.transaction(
        		function (transaction) {
        			if(!condition)
        				condition="";
        			
		        	transaction.executeSql("SELECT * FROM "+tableName+" "+condition, [], function(transaction, results){
			
					if(results.rows.length==0){
						
						callBack(null);
						
					}else{
						
						var object=new Array();
						
						for (var i=0; i<results.rows.length; i++) {
						
							var row = results.rows.item(i);
							
							object[object.length]=row;
				 			
				 		}
			 			callBack(object);
			 		}
			 	}, errorHandler);
			
			
        		}
    );
 
}