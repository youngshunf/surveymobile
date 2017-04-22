function getRecommendList(){
	var user=app.getUserState();
	if(!user){
		retun;
	}
	mui.ajax({
	type:"post",
	url:config.getRecommendTaskUrl,
	async:true,
	data:{
		user:app.getUserState(),
		data:{
			locInfo:app.getLocInfo()
		}
	},
	success:function(rs){
		if(rs.indexOf('errcode')>0){
			document.getElementById('recommend-task').innerHTML='暂时没有数据';
		}else{
			document.getElementById('recommend-task').innerHTML=rs;
		}
		
	},
	error:function(e){
		console.log("推荐任务失败!");
	}
});
}
