var gentry=null,hl=null,le=null;
var er=null,ep=null;

// H5 plus事件处理
function plusReady(){
	// 获取音频目录对象
	plus.io.resolveLocalFileSystemURL( "_doc/", function ( entry ) {
		entry.getDirectory( "audio", {create:true}, function ( dir ) {
			gentry = dir;
			updateHistory();
		}, function ( e ) {
			console.log( "Get directory \"audio\" failed: "+e.message );
		} );
	}, function ( e ) {
		console.log( "Resolve \"_doc/\" failed: "+e.message );
	} );
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}
// DOMContentLoaded事件处理
document.addEventListener("DOMContentLoaded",function(){
	// 获取DOM元素对象
	
	le = document.getElementById("empty");
	er = document.getElementById("record");
	rt = document.getElementById("rtime");
	ep = document.getElementById("play");
	pt = document.getElementById("ptime");
	pp = document.getElementById("progress")
	ps = document.getElementById("schedule");
},false);

function getDOMItem(){
	
	le = document.getElementById("empty");
	er = document.getElementById("record");
	rt = document.getElementById("rtime");
	ep = document.getElementById("play");
	pt = document.getElementById("ptime");
	pp = document.getElementById("progress")
	ps = document.getElementById("schedule");
}

// 添加播放项
function createItem( entry,code ) {
	var ah=document.getElementById('audio-history'+code);
	console.log(ah);
	var li = document.createElement("li");
	li.className = "ditem";
	li.innerHTML = '<span class="iplay"><font class="aname"></font><br/><font class="ainf"></font></span>';
	li.setAttribute( "onclick", "playAudio(this);" );
	ah.innerHTML=li;
	li.querySelector(".aname").innerText = entry.name;
	li.querySelector(".ainf").innerText = "...";
	li.entry = entry;
	updateInformation( li );
	// 设置空项不可见
	le.style.display = "none";
}
// 开始录音
var r=null,t=0,ri=null,rt=null,isR=false;
var elm=null;
function startRecord(question_guid,code) {
	console.log( "开始录音：" );
	code=code;
	//getDOMItem();
	var elm=$('#record'+code);
	elm.find('.start').addClass('hide');
	elm.find('.stop-record').removeClass('hide');
	isR=true;
	r = plus.audio.getRecorder();
	if ( r == null ) {
		plus.nativeUI.toast( "录音对象未获取" );
		return;
	}
	r.record( {filename:"_doc/audio/"}, function ( p ) {
		console.log(p);
		uploadAudio(question_guid,code,p);
		plus.nativeUI.toast( "录音完成："+p );
		plus.io.resolveLocalFileSystemURL( p, function ( entry ) {
			console.log(entry);
			//createItem( entry ,code);
		}, function ( e ) {
			plus.nativeUI.toast( "读取录音文件错误："+e.message );
		} );
	}, function ( e ) {
		plus.nativeUI.toast( "录音失败："+e.message );
	} );
//	er.style.display = "block";
//	t = 0;
//	ri = setInterval( function () {
//		t++;
//		rt.innerText = timeToStr(t);
//	}, 1000 );
}
// 停止录音
function stopRecord(){
//	er.style.display = "none";
//	rt.innerText = "00:00:00";
//	clearInterval( ri );
   console.log(elm);
	if(elm){
		elm.find('.stop-record .stop').remove();
	    elm.find('.stop-record #rec-text').html('录音已结束');
	}

   isR=false;
	ri = null;
	r.stop();
	w = null;
	r = null;
	t = 0;
}
// 清除历史记录
function cleanHistory() {
	hl.innerHTML = '<li id="empty" class="ditem-empty">无历史记录</li>';
	le = document.getElementById( "empty" );
	// 删除音频文件
	console.log( "清空录音历史记录：" );
	gentry.removeRecursively( function () {
		// Success
		plus.nativeUI.toast( "操作成功！" );
	}, function ( e ) {
		console.log( "操作失败："+e.message );
	});
}
// 获取录音历史列表
function updateHistory() {
	if ( !gentry ) {
		return;
	}
  	var reader = gentry.createReader();
  	reader.readEntries( function ( entries ) {
  		for ( var i in entries ) {
  			if ( entries[i].isFile ) {
  				createItem( entries[i] );
  			}
  		}
  	}, function ( e ) {
  		plus.nativeUI.toast( "读取录音列表失败："+e.message );
  	} );
}
// 获取录音文件信息
function updateInformation( li ) {
	if ( !li || !li.entry ) {
		return;
	}
	var entry = li.entry;
	entry.getMetadata( function ( metadata ) {
		li.querySelector( ".ainf" ).innerText = dateToStr( metadata.modificationTime );
	}, function ( e ) {
		plus.nativeUI.toast( "获取文件\""+entry.name+"\"信息失败："+e.message );
	} );
}
// 播放音频文件
function playAudio( li ) {
	if ( !li || !li.entry ) {
		ouSet( "无效的音频文件" );
		return;
	}
	console.log( "播放音频文件："+li.entry.name );
	startPlay( "_doc/audio/"+li.entry.name );
}
// 播放文件相关对象
var p=null,pt=null,pp=null,ps=null,pi=null;
// 开始播放
function startPlay( url ) {
	ep.style.display = "block";
	var L = pp.clientWidth;
	p = plus.audio.createPlayer( url );
	p.play( function () {
		plus.nativeUI.toast( "播放完成！" );
		// 播放完成
		pt.innerText = timeToStr(d)+"/"+timeToStr(d);
		ps.style.webkitTransition = "all 0.3s linear";
		ps.style.width = L+"px";
		stopPlay();
	}, function ( e ) {
		plus.nativeUI.toast('播放音频失败!');
	} );
	// 获取总时长
	var d = p.getDuration();
	if ( !d ) {
		pt.innerText = "00:00:00/"+timeToStr(d);
	}
	pi = setInterval( function () {
		if ( !d ) { // 兼容无法及时获取总时长的情况
			d = p.getDuration();
		}
		var c = p.getPosition();
		if ( !c ) {  // 兼容无法及时获取当前播放位置的情况
			return;
		}
		pt.innerText = timeToStr(c)+"/"+timeToStr(d);
		var pct = Math.round(L*c/d);
		if ( pct < 8 ) {
			pct = 8;
		}
		ps.style.width = pct+"px";
	}, 1000 );
}
// 停止播放
function stopPlay() {
	clearInterval(pi);
	pi=null;
	setTimeout(resetPlay,500);
	// 操作播放对象
	if(p){
		p.stop();
		p=null;
	}
}
// 重置播放页面内容
function resetPlay() {
	ep.style.display = "none";
	ps.style.width = "8px";
	ps.style.webkitTransition = "all 1s linear";
	pt.innerText = "00:00:00/00:00:00";	
}
// 重写关闭
var _back=window.back;
function resetback(){
	// 停止播放
	if(ep.style.display == "block"){
		stopPlay();
	}else if(er.style.display == "block"){
		stopRecord();
	}else{
		_back();
	}
}


window.back=resetback;

// 上传文件
function uploadAudio(question_guid,code,p){
	var loc=app.getLocInfo();
	console.log('开始上传音频文件:',question_guid,code,p);
	var task=plus.uploader.createUpload(config.uploadAudio,
		{method:"POST"},
		function(t,status){ //上传完成
			console.log(JSON.stringify(t),status);
			if(status==200){
				console.log("上传成功："+status);
			}else{
				console.log("上传失败："+status);
			}
		}
	);
	task.addData("task_guid",task_guid);
	task.addData("question_guid",question_guid);
	task.addData("answer_guid",answer_guid);
	task.addData("loc",loc);
	task.addData("user",JSON.stringify(app.getUserState()));
	task.addData("code",code);
	task.addFile(p,{key:'audio'});
	task.start();
}