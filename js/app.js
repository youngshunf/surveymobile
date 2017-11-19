/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 检查用户登录
	 **/
	owner.checkLogin = function(callback) {
		callback = callback || $.noop;
		var userInfo=owner.getUserInfo();
		if(JSON.stringify(userInfo)=='{}'){
			
			$.openWindow({
				url:"../login.html",
				id:"../login.html"
			})
			return callback();
		}
		return callback('用户已登录');
	};


	/**
	 * 获取用户信息
	 **/
	owner.getUserInfo=function(){
		var user = localStorage.getItem('$user') || "{}";
		return JSON.parse(user);
	}
	
	owner.getUserState=function(){
		var userInfo=owner.getUserInfo();
		var user={
			user_guid:userInfo.user_guid,
			access_token:userInfo.access_token
		};
		return user;
	}
	
	owner.Logout=function(){
		localStorage.removeItem('$user');
	}
	
	/*-+
	 * 获取位置信息
	 */	
	owner.getLocation=function(){
		plus.geolocation.getCurrentPosition(function(position){
			var timeflag = position.timestamp;//获取到地理位置信息的时间戳；一个毫秒数；		
			var codns = position.coords;//获取地理坐标信息；
			var lat = codns.latitude;//获取到当前位置的纬度；
			var lng = codns.longitude;//获取到当前位置的经度
			var alt = codns.altitude;//获取到当前位置的海拔信息；
			var accu = codns.accuracy;//地理坐标信息精确度信息；
			
			var locInfo={
				timeflag:timeflag,
				lat:lat,
				lng:lng,
				address:position.addresses,
				city:"",
				name:"",
				alt:alt,
				accu:accu
			};
			console.log(JSON.stringify(locInfo));
			localStorage.setItem('$locInfo',JSON.stringify(locInfo));
			mui.plusReady(function(){
				plus.storage.setItem('$locInfo',JSON.stringify(locInfo));
			});
		},function(e){
			plus.nativeUI.toast("获取位置信息失败："+e.message);
			console.log("获取位置信息失败："+e.message );
			return ;
		},{provider:'baidu'});	
		
		
	}
	
	owner.getLocInfo=function(){
		owner.getLocation();	
		var locInfo=plus.storage.getItem('$locInfo')||"{}";		
		return JSON.parse(locInfo);
	}
	
	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));		
	}
	
	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	
	
	owner.getLocalNearShop=function(){
		var nearShop=localStorage.getItem('$nearShop')||"{}";
		return JSON.parse(nearShop);
	}
	
	owner.getLocalMaintainInfo=function(){
		var maintainInfo=localStorage.getItem('$maintainInfo')||"{}";
		return JSON.parse(maintainInfo);
	}
	owner.getUrlParam =function(param) {
        var url = window.location.href;
        var urlarr = url.split('#');
        url = urlarr['0'];
        var searchIndex = url.indexOf('?');
        if(searchIndex == -1) return '';
        var searchParams = url.slice(searchIndex + 1).split('&');
        for (var i = 0; i < searchParams.length; i++) {
            var items = searchParams[i].split('=');
            if (items[0].trim() == param) {
                return decodeURIComponent(items[1]).trim();
            }
        }
   };
}(mui, window.app = {}));

function checkMobile(mobile){
	var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
	if(!reg.test(mobile)){
		return false;
	}
	
	return true;
}

   
	function call(phoneNumber){
	    // 导入Activity、Intent类
	    var Intent = plus.android.importClass("android.content.Intent");
	    var Uri = plus.android.importClass("android.net.Uri");
	    // 获取主Activity对象的实例
	    var main = plus.android.runtimeMainActivity();
	    // 创建Intent
	    var uri = Uri.parse("tel:"+phoneNumber); // 拨打的电话号码
	    var call = new Intent("android.intent.action.CALL",uri);
	    // 调用startActivity方法拨打电话
	    main.startActivity( call );

	}
	//显示等待
	function showWaiting(msg){
		$('.overlay-msg').html(msg);
		$('#overlay').show();
	}
	//关闭等待
	function closeWaiting(){
		$('#overlay').hide();
	}
	
	function formatDate(now) { 
	var year=now.getFullYear(); 
	var month=now.getMonth()+1; 
	var date=now.getDate(); 
	var hour=now.getHours(); 
	var minute=now.getMinutes(); 
	var second=now.getSeconds(); 
	return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
	} 
	
	function closeSplash(){
					setTimeout(function() {
					//关闭 splash
					plus.navigator.closeSplashscreen();
					}, 500);
	}