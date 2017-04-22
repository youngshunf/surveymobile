//var serverBaseUrl="http://api-survey.mi2you.com/";
//var photoUrl="http://upload-survey.mi2you.com/photo/";
//var avatarUrl="http://upload-survey.mi2you.com/avatar/";
var serverBaseUrl="http://api.suoxinmr.com/";
var photoUrl="http://images.suoxinmr.com/photo/";
var avatarUrl="http://images.suoxinmr.com/avatar/";
var config={
	autoLoginUrl:serverBaseUrl+'site/auto-login',
	checkUpdateUrl:serverBaseUrl+"site/check-update",//检查登录url
	checkMobile:serverBaseUrl+"site/check-mobile",//检查手机号是否注册
	checkUsername:serverBaseUrl+"site/check-username",//检查用户名是否注册
	loginUrl:serverBaseUrl+"site/login",//登录Url
	registerUrl:serverBaseUrl+"site/register",//注册Url
	sendVerifyCodeUrl:serverBaseUrl+"site/send-verify-code",//注册Url
	sendVerifyCode2Url:serverBaseUrl+"site/send-verify-code2",//修改密码发送验证码
	changePasswordUrl:serverBaseUrl+"site/change-password",//修改密码
	getRecommendTaskUrl:serverBaseUrl+'task/get-recommend-task',
	getTaskListUrl:serverBaseUrl+'task/get-task-list',//获取任务列表
	getMapTaskListUrl:serverBaseUrl+'task/get-maptask-list',//获取任务列表
	getTaskUrl:serverBaseUrl+'task/get-task',//领取任务	
	getMyTaskUrl:serverBaseUrl+'task/my-task',//已领取的任务列表
	getTaskInfoUrl:serverBaseUrl+'task/task-info',//获取任务信息
	getTaskQuestionUrl:serverBaseUrl+'task/task-question',//获取任务详情
	submitTaskAnswerUrl:serverBaseUrl+'task/submit-answer',//提交答案
	uploadHeadImgUrl:serverBaseUrl+'user/upload-headimg',//上传头像
	updateHomeInfoUrl:serverBaseUrl+'user/update-home-info',//修改家庭信息
	updatePostUrl:serverBaseUrl+'user/update-post',//修改学历与职业信息
	updateProfileUrl:serverBaseUrl+'user/update-profile',//修改个人信息
	checkUserAccountUrl:serverBaseUrl+'user/check-account',//更新用户帐户信息
	getWalletUrl:serverBaseUrl+'user/get-wallet',
	getMessageStateUrl:serverBaseUrl+'user/get-message-state',//获取消息状态
	getNotifyUrl:serverBaseUrl+'user/get-notify',
	updateAlipayUrl:serverBaseUrl+'user/update-alipay',//修改支付宝账号
	updateNameUrl:serverBaseUrl+'user/update-name',//修改姓名
	withDrawUrl:serverBaseUrl+'user/with-draw',
	delAnswerUrl:serverBaseUrl+'task/del-answer',
	uploadAudio:serverBaseUrl+'task/upload-audio',
}