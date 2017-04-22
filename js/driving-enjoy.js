/**
 * 驾享模式实现
 */
 
 var watchId;
 var loctionInfo;
 var locWriter;
 var routeInfo={};
 var i=0;
 function startDrivingEnjoy(){
 	
 	plus.nativeUI.showWaiting("请稍后...");
 	$.ajax({
 		type:"post",
 		url:config.startDrivingEnjoyUrl,
 		data:{
 			user:app.getUserState(),
 			data:app.getLocInfo()
 		},
 		dataType:'json',
 		success:function(rs){
 			console.log(JSON.stringify(rs));
 			if(rs.result=='success'){
 				plus.nativeUI.closeWaiting();
 				localStorage.setItem('$route_guid',rs.data);
 				
 				watchPos();
 				$('#driving-enjoy').addClass('hide');
 				$('#stop-driving').removeClass('hide');
 				getCircleList('down');
 			}else{
 				plus.nativeUI.closeWaiting();
 				plus.nativeUI.toast('开启驾享模式失败!');
 			   console.log('开启驾享模式失败!');
 			}
 		},
 		error:function(e){
 			plus.nativeUI.closeWaiting();
 			plus.nativeUI.toast('开启驾享模式失败!'+e.status);
 			console.log('开启驾享模式失败!'+e.status);
 		}
 	});
 }
 
 function stopDrivingEnjoy(){
 	clearWatch();	
 	var user=app.getUserState();
 	var data={
 		routeInfo:localStorage.getItem('$route_data'),
 		route_guid:localStorage.getItem('$route_guid'),
 		endLoc:app.getLocInfo()
 	};
 	plus.nativeUI.showWaiting('正在上传路线数据,请稍候...');
 	var route_guid=localStorage.getItem('$route_guid');
 	$.ajax({
 		type:"post",
 		url:config.stopDrivingEnjoyUrl,
 		data:{
 			user:user,
 			data:data
 		},
 		dataType:'json',
 		success:function(rs){
 			console.log(JSON.stringify(rs));
 			if(rs.result=='success'){
 				plus.nativeUI.toast('路线数据上传成功!');
 				localStorage.removeItem('$route_guid');
 				localStorage.removeItem('$route_data');
 				localStorage.setItem('$latestRouteGuid',JSON.stringify(rs.data));
 				plus.nativeUI.closeWaiting();
 				$('#driving-enjoy').removeClass('hide');
 				$('#stop-driving').addClass('hide');
 				mui.openWindow({
 					url:'circle-driving-list.html',
 					id:'circle-driving-list.html',
 					extras:{
 						route_guid:route_guid
 					},
 					showWaiting:{
 						autoShow:false
 					}
 				});
 			}else{
 				plus.nativeUI.closeWaiting();
 				plus.nativeUI.toast('路线数据上传失败,系统将在WIFI网络下自动提交!');
 				
 			}
 		},
 		error:function(e){
 			plus.nativeUI.closeWaiting();
 			plus.nativeUI.toast('路线数据上传失败,系统将在WIFI网络下自动提交!');
 			console.log('路线数据上传失败,系统将在WIFI网络下自动提交!'+JSON.stringify(e));
 		}
 	});
 }
 

function geoInf( position ) {
	
	var timeflag = position.timestamp;//获取到地理位置信息的时间戳；一个毫秒数；
	var codns = position.coords;//获取地理坐标信息；
	var lat = codns.latitude;//获取到当前位置的纬度；
	var lng = codns.longitude;//获取到当前位置的经度
	var alt = codns.altitude;//获取到当前位置的海拔信息；
	var accu = codns.accuracy;//地理坐标信息精确度信息；
	var altAcc = codns.altitudeAccuracy;//获取海拔信息的精确度；
	var head = codns.heading;//获取设备的移动方向；
	var sped = codns.speed;//获取设备的移动速度；
	loctionInfo={
		timeflag:timeflag,
		lat:lat,
		lng:lng,
		alt:alt,
		accu:accu,
		altAcc:altAcc,
		head:head,
		sped:sped
	};
	return loctionInfo;
}

function watchPos() {
	
	if ( watchId ) {
		return;
	}
	watchId = plus.geolocation.watchPosition( function ( p ) {
		console.log( "监听位置变化信息:" );
		
		var locInfo=geoInf( p );
		
		var oldData=localStorage.getItem('$route_data',JSON.stringify(routeInfo));
		var newData=new Array();
		if(oldData!=null){
			newData=JSON.parse(oldData);
		}
		newData.push(locInfo);
		
		console.log('新数据:'+JSON.stringify(newData));
		localStorage.setItem('$route_data',JSON.stringify(newData));							
		
	}, function ( e ) {
		console.log( "监听位置变化信息失败："+e.message );
	} );
	
}
function clearWatch() {
	if ( watchId ) {
		console.log( "停止监听位置变化信息" );
		i=0;
		plus.geolocation.clearWatch( watchId );
		watchId = null;
	}
}


function checkDrivingStatus(){
		
		var routeData=localStorage.getItem('$route_data');
		
		var routeGuid=localStorage.getItem('$route_guid');
		console.log('开始检查驾享状态,routeData='+routeData+"----routeGuid="+routeGuid);
		if(routeGuid!=null&&routeData!=null){
			$('#driving-enjoy').addClass('hide');
			$('#stop-driving').removeClass('hide');
			watchPos();			
		}else{
			$('#driving-enjoy').removeClass('hide');
			$('#stop-driving').addClass('hide');
		}
		
	}
		
	
		
