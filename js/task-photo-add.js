var oldback=mui.back;
var maxLenght=9;
var photos=[];
var placeholder=null;
$(document).on('click','.image-list',function(){
	var that=$(this);
	var photo_type=that.attr('photo_type');
	 placeholder=that.find('.image-item');
	       if(photo_type==1){
	       	 takefromCamera();
	       	 return;
	       }
			var btnArray = [{
				title: "拍照",
				title:"从相册选取"
			}];
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: btnArray
			}, function(event) {
				var index = event.index;
				switch (index) {
					case 1:					
						takefromCamera();
						break;
					case 2:
						plus.gallery.pick(function(p){
				        appendFile(p);
				    });
						
						break;
					
				}			
		}, false);
		
		var takefromCamera=function(){
			plus.camera.getCamera().captureImage(function(p){
							plus.io.resolveLocalFileSystemURL( p, function ( entry ) {
								var localUrl=entry.toLocalURL();								
								appendFile(localUrl);
							}, function ( e ) {
								console.log( "读取拍照文件错误："+e.message );
							} );
								
						});	
		}
	
		var appendFile=function(p) {
		
			console.log(p);
			placeholder.css('backgroundImage','url(' + p+ ')');
			placeholder.find('.image-close').css('display','inline-block');

			if (p) {
				plus.nativeUI.showWaiting('正在压缩图片,请稍后..');
				//压缩图片
				  lrz(p, {
			        width: 1024
			    })
				  //处理成功
			    .then(function (rst) {
				plus.nativeUI.closeWaiting();
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
			        })
			     // 处理失败
			   .catch(function (err){
			   	plus.nativeUI.closeWaiting();
           			console.log('图片压缩失败!');
       			 });
			}
		};
		
		
		});
		
	$(document).on('click','.image-close',function(e){
		e.stopPropagation();
		var that =$(this);
		var task_guid=that.parent().parent().attr('task_guid');
		var type=that.parent().parent().attr('type');
		var code=parseInt(that.parent().parent().attr('code'));
		var question_guid=that.parent().parent().attr('question_guid');
		var imageIndex=that.parent().parent().attr('imgIndex');
		plus.storage.removeItem('answer-'+answer_guid+task_guid+question_guid+imageIndex);
		that.parent().css('backgroundImage','url(../images/iconfont-tianjia.png)');
		that.css('display','none');
	});
