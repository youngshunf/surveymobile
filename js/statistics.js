/**
 * 统计插件
 */
	function statistics(){
		var clientUrl=window.location.href;
		var host=window.location.host;
		var serverUrl="http://api.saas.grds.cn/site/statistics";
		
		$.ajax({
			type:"get",
			url:serverUrl+"?host="+host+"&url="+clientUrl,
			async:true,
			 dataType : 'jsonp',  
        	jsonp:"jsoncallback", 
			success:function(rs){
				//console.log(rs.data);
				//rs=JSON.parse(rs);
				if(rs.result=="success"){
					if($('#static')){
						$('#static').html(rs.data);
					}
				}
			},
			error:function(e){
				console.log("统计失败:"+e.status);
			}
		});
	}
	
	$(document).ready(function(){
		statistics();
	});
		

	
	
