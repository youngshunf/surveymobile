
//领取任务

mui(document).on('tap','.get-task',function(){
	var task_guid=this.getAttribute('task_guid');	
	var btns=['确定领取','取消'];				
		plus.nativeUI.confirm('您确定要领取此任务吗？',function(e){
				if(e.index==0){
					getTask(task_guid);
				}
		},'提示',btns);
	
});

function getTask(task_guid){
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
			if(!locInfo.address){
				var hloc=plus.storage.getItem('$locInfo')||'{}';
				hloc =JSON.parse(hloc);
				if(hloc.address){
					locInfo=hloc;
				}
			}
			plus.nativeUI.showWaiting('正在提交,请稍候...');
		   var data={
		   		task_guid:task_guid,
		   		locInfo:locInfo
		   };
	mui.ajax({
		url:config.getTaskUrl,
		type:'post',
		data:{
			user:app.getUserState(),
			data:data
		},
		dataType:'json',
		success:function(rs){
		console.log(JSON.stringify(rs));
			plus.nativeUI.closeWaiting();
			if(rs.result=='error'){
				plus.nativeUI.toast('任务领取失败,请稍候重试');
			}else if(rs.result=='success'){
				if(rs.data=='dist-limit'){
					mui.alert('您所在的区域已有人做了此任务，您不能再做此任务了,看看其他任务吧!');
				}else if(rs.data=='has-getted'){
					console.log(rs.data);
					mui.alert('您已领取到上限，请到首页-我的-我的任务中执行此任务或试试其他任务！');
					return ;
				}else{
				
					var btns=['立即去做','稍候去做'];				
					plus.nativeUI.confirm('任务领取成功,您要现在去做任务吗？',function(e){
							if(e.index==0){
								mui.openWindow({
									url:'../pages/me/my-task.html',
									id:'my-task.html',
									extras:{
									status:1
									}
								});
							}
					},'提示',btns);
				}
			}
		
		},
				error:function(e){
				plus.nativeUI.closeWaiting();
					console.log('任务领取失败'+JSON.stringify(e));
					plus.nativeUI.toast('任务领取失败,请稍候重试');
				}
			
			});
			
		},function(e){
			plus.nativeUI.toast("获取位置信息失败："+e.message);
			console.log("获取位置信息失败："+e.message );
			return ;
		},{provider:'baidu'});	
	


}
