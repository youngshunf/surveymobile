
var img = null;
var blist = [];
var code=0;

// H5 plus事件处理
function plusReady(){
	// 获取音频目录对象
	plus.io.resolveLocalFileSystemURL( "_doc/", function ( entry ) {
		entry.getDirectory( "barcode", {create:true}, function ( dir ) {
			gentry = dir;
			updateHistory();
		}, function ( e ) {
			console.log( "Get directory \"barcode\" failed: "+e.message );
		} );
	}, function ( e ) {
		console.log( "Resolve \"_doc/\" failed: "+e.message );
	} );
}

function scaned( t, r, f ) {
	code=localStorage.getItem('curentBarcode');
	var d = new Date();
	var h=d.getHours(),m=d.getMinutes(),s=d.getSeconds(),ms=d.getMilliseconds();
	if ( h < 10 ) { h='0'+h; }
	if ( m < 10 ) { m='0'+m; }
	if ( s < 10 ) { s='0'+s; }
	if ( ms < 10 ) { ms='00'+ms; } else if ( ms < 100 ) { ms='0'+ms; }
	var ts = '['+h+':'+m+':'+s+'.'+ms+']';
	var li=null,hl = document.getElementById("barcode-history"+code);
	console.log("barcode-history"+code);
	li = document.createElement('li');
	li.className = 'ditem';
	li.id = code;
	if(blist.length > 0){
		li = document.createElement('li');
		li.className = 'ditem';
		hl.insertBefore(li, hl.childNodes[0]);
	} else{
		li = document.getElementById('nohistory');
	}
	li.id = blist.length;
	var html = '<p class="hdata mui-center">';
	html += r;
	html += '</p> <p class=" mui-center"><span class="btn btn-warning">点击查询</span></p>';
	li.innerHTML = html;
	li.setAttribute( "onclick", "queryCode("+r+");" );
//	$('#barcode-history'+code).html(li);
//	hl.innerHTML=li;
//	var that=$('#barcode-history'+code);
//	var task_guid=that.attr('task_guid');
//	var type=that.attr('type');
//	var code=parseInt(that.attr('code'));
//	var question_guid=that.attr('question_guid');
//	var data={
//			answer_guid:answer_guid,
//			task_guid:task_guid,
//			question_guid:question_guid,
//			type:type,
//			code:code,
//			qrcode:r,
//			answer_time:Date.parse(new Date()),
//			answer_address:app.getLocInfo(),
//		};
//	blist[blist.length] = {type:t,result:r,file:f};
//	update( t, r, f );
}

function queryCode(qrcode){
	var that=$('#barcode-history'+code);
	var qdata={
		code:qrcode,
		locInfo:app.getLocInfo()
	}
	$.ajax({
		type:"post",
		data:{
		 data:qdata	
		},
		dataType:'json',
		url:config.queryCodeUrl,
		success:function(rs){
			console.log(rs);
			if(rs.result=='success'){
				var data=rs.data;
				console.log(data);
				data=JSON.parse(data);
				var html="";
				console.log(data.code);
				if(data.code==0){
					
					var codeInfo=data.data.codeInfo;
					console.log(codeInfo);
					html='<li class="mui-table-view-cell">商品信息</li>'
					+'<li><p>产品代码:'+qrcode+'</p>'
					+'<p>上级编码:'+codeInfo.parentCode+'</p>'
					+'<p>产品名称:'+codeInfo.materialShortName+'</p>'
					+'<p>生产批次:'+codeInfo.batchCode+'</p>'
					+'<p>生产日期:'+codeInfo.packDate+'</p></li><li class="mui-table-view-cell">流向信息</li>';
					var flowList=data.data.flowList;
					for(var i in flowList){
						html +='<li><p>发货方:'+flowList[i].srcName+'</p>'
							+'<p>收货方:'+flowList[i].destName+'</p>'
							+'<p>流向日期:'+flowList[i].operateTime+'</p>'
							+'<p>流向类型:'+flowList[i].billTypeName+'</p></li>';
					}
					
				}else{
					html='<li>'+data.errMsg+'</li>';
				}
				var task_guid=that.attr('task_guid');
					var type=that.attr('type');
					var code=parseInt(that.attr('code'));
					var question_guid=that.attr('question_guid');
					var answer={
							answer_guid:answer_guid,
							task_guid:task_guid,
							question_guid:question_guid,
							type:type,
							code:code,
							qrcode:qrcode,
							result:data,
							html:html,
							answer_time:Date.parse(new Date()),
							answer_address:app.getLocInfo(),
						};
					plus.storage.setItem('answer-'+answer_guid+task_guid+question_guid,JSON.stringify(answer));
				that.append(html);
			}
		},
		error:function(e){
			mui.alert('查询失败:'+e.status);
			console.log(e);
		}
	});
}

function selected( id ) {
	var h = blist[id];
	update( h.type, h.result, h.file );
	if ( h.result.indexOf("http://")==0  || h.result.indexOf("https://")==0 ) {
		plus.nativeUI.confirm( h.result, function ( i ) {
			if ( i.index == 0 ) {
				plus.runtime.openURL( h.result );
			}
		}, "", ["打开","取消"] );
	} else {
		plus.nativeUI.alert( h.result );
	}
}
function update( t, r, f ) {
	
	if ( !f || f=="null" ) {
		img.src = "../img/barcode.png";	
	} else {
		plus.io.resolveLocalFileSystemURL(f,function(entry){
			
			img.src=entry.toLocalURL();
		});
	}
}
function onempty() {
	if ( window.plus ) {
		plus.nativeUI.alert('无扫描记录');
	} else {
		alert( '无扫描记录' );
	}
}
function cleanHistroy(code) {
	if ( blist.length > 0 ) {
		var hl = document.getElementById("barcode-history"+code);
		hl.innerHTML = '<li id="nohistory" class="ditem" onclick="onempty();">无历史记录	</li>';
	}
	plus.io.resolveLocalFileSystemURL( "_doc/barcode/", function ( entry ) {
		entry.removeRecursively( function () {
			// Success
		}, function ( e ) {
			//alert( "failed"+e.message );
		});
	} );
}

function startScan(code){
	code=code;
	localStorage.setItem('curentBarcode',code);
	clicked('../pages/barcode_scan.html',false,true);
}
