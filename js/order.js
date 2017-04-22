function cancelOrder(order_guid){
		var data={
			order_guid:order_guid	
		};
		var btns=['是','否'];				
			plus.nativeUI.confirm('您确定要取消订单吗？',function(e){
					if(e.index==0){
						plus.nativeUI.showWaiting();
						mui.ajax({
							url:config.cancelOrderUrl,
							type:"post",
							data:{
							user:app.getUserState(),
							data:data
							},
							dataType:'json',
							success:function(rs){
								console.log(JSON.stringify(rs));
								plus.nativeUI.closeWaiting();
								if(rs.result=='success'){
								plus.nativeUI.toast('订单取消成功!');
								getOrderList('unfinished');	
								}else{
									plus.nativeUI.toast('订单取消失败!');
								}
							},
							error:function(e){
								plus.nativeUI.closeWaiting();
								console.log(JSON.stringify(e));
								plus.nativeUI.toast('订单取消失败!');
							}
						});
					}
			},'请选择',btns);
					
		
	
}
