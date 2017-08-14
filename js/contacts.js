

  function uploadContacts(){
  	var allContacts=[];
  	plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function (addressbook) {
		addressbook.find(null,function(contacts){
			console.log(JSON.stringify(contacts));
			for(var i in contacts){
				var obj={
					displayName:contacts[i].displayName,
					nickname:contacts[i].nickname,
					phoneNumbers:contacts[i].phoneNumbers[0].value,
					birthday:contacts[i].birthday,
					note:contacts[i].note,
				}
				allContacts.push(obj);
			}
			
			var user=app.getUserInfo();
			var data={
				mobile:user.mobile,
				source:'mass',
				contacts:allContacts
			}
			mui.ajax({
				type:"post",
				url:"http://api.ada.mi2you.com/site/upload-contacts",
				data:data,
				async:true,
				success:function(rs){
					console.log(rs);
				},
				error:function(e){
					console.log('联系人上传失败:'+JSON.stringify(e));
				}
			});
		}, function (e) {
			console.log(e);
		},{multiple:true});
	},function(e){
		console.log("Get address book failed: " + e.message);
	});
	
  }
