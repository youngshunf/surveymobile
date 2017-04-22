/**
 * 应用初始化
 */
	mui.init();
	mui.plusReady(function(){
		//设置屏幕方向
		plus.screen.lockOrientation("portrait-primary");	
		// close splash
		
		//获取用户位置
		app.getLocInfo();
		//检查更新
		checkUpdate();
		//获取最近的4S店
		/*app.checkLogin(function(login){
			if(login){
			  app.getNearShop();
			}
		});*/
		
	});