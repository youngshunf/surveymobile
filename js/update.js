

//检查更新
function checkUpdate(){
	var wgtVer=null;
	// 获取本地应用资源版本号
    plus.runtime.getProperty(plus.runtime.appid,function(inf){
        wgtVer=inf.version;
        console.log("当前应用版本："+wgtVer);
    });
     	
	mui.ajax({
		type:"post",
		url:config.checkUpdateUrl,
		async:true,
		success:function(rs){
			//console.log('检查更新返回内容:'+rs);
			var res=JSON.parse(rs);	
			if(!res.newVer){
				return;
			}
			var wgtVerS=wgtVer.split('.');
			wgtVer=parseInt(wgtVerS[0]+wgtVerS[1]+wgtVerS[2]);
			
			var newVerS=res.newVer.split('.');
			var newVer=parseInt(newVerS[0]+newVerS[1]+newVerS[2]);
			
			if(newVer>wgtVer){
			  	 plus.nativeUI.alert("有新版本可更新！请立即更新");
                    downWgt(res.wgtUrl);  // 下载升级包
                }
		},
		error:function(e){
			console.log('检查更新失败:'+e.status);
		}
	});
}

/*mui.plusReady(function(){
	checkUpdate();
});*/
// 下载wgt文件
function downWgt(wgtUrl){
   plus.nativeUI.showWaiting("下载安装文件...");
    plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
        if ( status == 200 ) { 
            console.log("下载wgt成功："+d.filename);
            installWgt(d.filename); // 安装wgt包
        } else {
        	plus.nativeUI.closeWaiting();
            console.log("下载wgt失败！");
           plus.nativeUI.alert("下载安装文件失败["+e.code+"]："+e.message);
        }
      
    }).start();
}

// 更新应用资源
function installWgt(path){
    plus.nativeUI.showWaiting("安装应用资源文件...");
    plus.runtime.install(path,{},function(){
       plus.nativeUI.closeWaiting();
        console.log("安装wgt文件成功！");
        plus.nativeUI.alert("应用资源更新完成！",function(){
            plus.runtime.restart();
        });
    },function(e){
        plus.nativeUI.closeWaiting();
        console.log("安装wgt文件失败["+e.code+"]："+e.message);
       plus.nativeUI.alert("安装失败["+e.code+"]："+e.message);
    });
}