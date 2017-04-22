var watchId;
var loctionInfo;
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

function getPos() {
	console.log( "获取位置信息:" );
	plus.geolocation.getCurrentPosition( geoInf, function ( e ) {
		console.log( "获取位置信息失败："+e.message );
	} );
}
function watchPos() {
	
	if ( watchId ) {
		return;
	}
	watchId = plus.geolocation.watchPosition( function ( p ) {
		console.log( "监听位置变化信息:" );
		geoInf( p );
		
	}, function ( e ) {
		console.log( "监听位置变化信息失败："+e.message );
	} );
	
}
function clearWatch() {
	if ( watchId ) {
		console.log( "停止监听位置变化信息" );
		plus.geolocation.clearWatch( watchId );
		watchId = null;
	}
}