	var map = new BMap.Map("map");
	mui.plusReady(function(){
	var loc=app.getLocInfo();	
		var point = new BMap.Point(loc.lng, loc.lat);
		map.centerAndZoom(point, 12);
		var marker = new BMap.Marker(point);  // 创建标注
		map.addOverlay(marker);               // 将标注添加到地图中
		marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	
	});
	