var oldback=mui.back;
var maxLenght=9;
var photos=[];
var placeholder=null;
$(document).on('click','.image-list',function(){
	var that=$(this);
	 placeholder=that.find('.image-item');
			var btnArray = [{
				title: "拍照"
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
			if (p) {
				plus.nativeUI.showWaiting();
				//压缩图片
				  lrz(p, {
			        width: 1024
			    })
				  //处理成功
			    .then(function (rst) {
			    placeholder.css('backgroundImage','url(' + rst.base64+ ')');
				
				var task_guid=placeholder.parent().attr('task_guid');
				var type=placeholder.parent().attr('type');
				var code=parseInt(placeholder.parent().attr('code'));
				var question_guid=placeholder.parent().attr('question_guid');
				var imageIndex=placeholder.parent().attr('imgIndex');
				var answer=[];
				
				answer.push({imageIndex:imageIndex,imgData:rst.base64,imgLen:rst.base64Len});
				var data={
					answer_guid:answer_guid,
					task_guid:task_guid,
					question_guid:question_guid,
					type:type,
					code:code,
					imageIndex:imageIndex,
					answer:answer,
					answer_time:Date.parse(new Date()),
					answer_address:app.getLocInfo(),
				};
				
				console.log(JSON.stringify(data));
				plus.storage.setItem('answer-'+answer_guid+task_guid+question_guid+imageIndex,JSON.stringify(data));
				plus.nativeUI.closeWaiting();
			        })
			     // 处理失败
			   .catch(function (err){
			   	plus.nativeUI.closeWaiting();
           			console.log('图片压缩失败!');
       			 });
			}
		};
		
		
		});
		
	