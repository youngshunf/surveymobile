
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
	var type=$('#q'+code).attr('type');
	if(type==5){
		var str=r.split('/');
		r=str[str.length-1];
	  $('#inputcode'+code).val(str[str.length-1]);
	  queryCode(r);
	}else{
		$('#inputcode'+code).val(r);
		var that=$('#q'+code);
					var task_guid=that.attr('task_guid');
					var type=that.attr('type');
					var scode=parseInt(that.attr('code'));
					var question_guid=that.attr('question_guid');
					var answer={
						answer_guid:answer_guid,
						task_guid:task_guid,
						question_guid:question_guid,
						type:type,
						code:scode,
						answer:r,
						answer_time:Date.parse(new Date()),
						answer_address:app.getLocInfo(),
					};
					plus.storage.setItem('answer-'+answer_guid+task_guid+question_guid,JSON.stringify(answer));
	}
	
	
//	var d = new Date();
//	var h=d.getHours(),m=d.getMinutes(),s=d.getSeconds(),ms=d.getMilliseconds();
//	if ( h < 10 ) { h='0'+h; }
//	if ( m < 10 ) { m='0'+m; }
//	if ( s < 10 ) { s='0'+s; }
//	if ( ms < 10 ) { ms='00'+ms; } else if ( ms < 100 ) { ms='0'+ms; }
//	var ts = '['+h+':'+m+':'+s+'.'+ms+']';
//	var li=null,hl = document.getElementById("barcode-history"+code);
//	console.log("barcode-history"+code);
//	li = document.createElement('li');
//	li.className = 'ditem';
//	li.id = code;
//	if(blist.length > 0){
//		li = document.createElement('li');
//		li.className = 'ditem';
//		hl.insertBefore(li, hl.childNodes[0]);
//	} else{
//		li = document.getElementById('nohistory');
//	}
//	li.id = blist.length;
//	var html = '<p class="hdata mui-center">';
//	html += r;
//	html += '</p> <p class=" mui-center"><span class="btn btn-warning">点击查询</span></p>';
//	li.innerHTML = html;
//	li.setAttribute( "onclick", "queryCode("+r+");" );

}

mui(document).on('tap','.search-code',function(){
	code=$(this).attr('code');
	var qrcode=$('#inputcode'+code).val();
	if(!qrcode){
		mui.alert('请扫描或输入二维码再查询');
		return false;
	}
	queryCode(qrcode);
})

function queryCode(qrcode){
	code=localStorage.getItem('curentBarcode');
	var that=$('#barcode-history'+code);
	var task_guid=that.attr('task_guid');
	var type=that.attr('type');
	var scode=parseInt(that.attr('code'));
	var question_guid=that.attr('question_guid');
	var a=$('#barcodeQuestion'+code);
	var address=a.find('.baraddr').val();
//	if(!address){
//		mui.alert('请先输入地址再查询');
//		return false;
//	}
    
	var qdata={
		code:qrcode,
		address:address,
		locInfo:app.getLocInfo(),
		answer_guid:answer_guid,
		task_guid:task_guid,
		question_guid:question_guid,
	}
	$.ajax({
		type:"post",
		data:{
		 user:app.getUserState(),
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
				
					var answer=plus.storage.getItem('answer-'+answer_guid+task_guid+question_guid);
					if(!answer){
						var answer={
							answer_guid:answer_guid,
							task_guid:task_guid,
							question_guid:question_guid,
							type:type,
							code:scode,
							qrcode:qrcode,
							result:data,
							html:html,
							inputAddress:address,
							answer_time:Date.parse(new Date()),
							answer_address:app.getLocInfo(),
						};
					}else{
						answer=JSON.parse(answer);
						answer.qrcode=qrcode;
						answer.result=data;
						answer.html=html;
						answer.inputAddress=address;
					}
					
					console.log(JSON.stringify(answer));
					plus.storage.setItem('answer-'+answer_guid+task_guid+question_guid,JSON.stringify(answer));
				that.html(html);
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
	var a=$('#barcodeQuestion'+code);
	var address=a.find('.baraddr').val();
	if(!address){
		mui.alert('请先输入地址再扫码！');
		return false;
	}
	clicked('../pages/barcode_scan.html',false,true);
}


$(document).on('click','.img-upload',function(){
	var that=$(this);
			var btnArray = [{
				title: "拍照",
			},{
				title: "从相册选取",
			}];
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: btnArray
			}, function(event) {
				var index = event.index;
				switch (index) {
					case 1:					
						plus.camera.getCamera().captureImage(function(p){
							plus.io.resolveLocalFileSystemURL( p, function ( entry ) {
								var localUrl=entry.toLocalURL();								
								appendFile(localUrl);
							}, function ( e ) {
								console.log( "读取拍照文件错误："+e.message );
							} );
								
						});	
						break;
					case 2:
						plus.gallery.pick(function(p){
				        appendFile(p);
				    });
						
						break;
					
				}			
		}, false);
		
		var appendFile=function(p) {
		
			console.log(p);
			var html='<div class="col-xs-3 barcode-img"><span class="remove-barimg  mui-badge-danger"><span class="mui-icon mui-icon-closeempty"></span> </span><img class="img-responsive" src='+p+'></div>';
			that.before(html);
			if (p) {
				plus.nativeUI.showWaiting('正在压缩图片,请稍后..');
				//压缩图片
				  lrz(p, {
			        width: 1024
			    })
				  //处理成功
			    .then(function (rst) {
				plus.nativeUI.closeWaiting();
				var task_guid=that.attr('task_guid');
				var type=that.attr('type');
				var code=that.attr('code');
				var question_guid=that.attr('question_guid');
				
				var data=plus.storage.getItem('answer-'+answer_guid+task_guid+question_guid);
				if(!data){
					var imgs=[];
					imgs.push({imgData:rst.base64,imgLen:rst.base64Len});
					data={
					answer_guid:answer_guid,
					task_guid:task_guid,
					question_guid:question_guid,
					type:type,
					code:code,
					imgs:imgs,
					answer_time:Date.parse(new Date()),
					answer_address:app.getLocInfo(),
					}
				}else{
					data=JSON.parse(data);
					var imgs=data.imgs || [];
					imgs.push({imgData:rst.base64,imgLen:rst.base64Len});
					data.imgs=imgs;
				}
				
				
				console.log(JSON.stringify(data));
				plus.storage.setItem('answer-'+answer_guid+task_guid+question_guid,JSON.stringify(data));
			        })
			     // 处理失败
			   .catch(function (err){
			   	plus.nativeUI.closeWaiting();
           			console.log('图片压缩失败!'+err);
       			 });
			}
		};
		
		
		});
		
$(document).on('click', '.remove-barimg',function(){
	var index=$(this).parent().parent().find('.remove-barimg').index(this);
	console.log(index);
	var that=$(this).parent().parent();
	var task_guid=that.attr('task_guid');
	var type=that.attr('type');
	var code=that.attr('code');
	var question_guid=that.attr('question_guid');
	var data=plus.storage.getItem('answer-'+answer_guid+task_guid+question_guid);
	if(data){
		data=JSON.parse(data);
		data.imgs.splice(index,1);
		plus.storage.setItem('answer-'+answer_guid+task_guid+question_guid,JSON.stringify(data));
		$(this).parent().remove();
	}
})
