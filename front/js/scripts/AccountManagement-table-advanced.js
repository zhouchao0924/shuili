var AccountManagementAdvanced = function() {
	var initTable3 = function($scope, $compile, Shuffling, validate_filed) {
		var table = $('#sample_3');
		var oTable = table.dataTable({
			// Internationalisation. For more info refer to http://datatables.net/manual/i18n
			"language": {
				"aria": {
					"sortAscending": ": activate to sort column ascending",
					"sortDescending": ": activate to sort column descending"
				},
				"emptyTable": "表中无数据存在",
				"info": "显示 _START_ 到 _END_ ，共 _TOTAL_ 条记录", //Showing _START_ to _END_ of _TOTAL_ entries
				"infoEmpty": "", //No entries found
				"infoFiltered": "", //(filtered1 from _MAX_ total entries)
				"lengthMenu": "Show _MENU_ entries",
				"search": "Search:",
				"zeroRecords": "No matching records found"
			},
			"columnDefs": [
				{
					"orderable": false,
					"targets": [0]
				}
			],
			"order": [
				[1, 'asc']
			],
			"lengthMenu": [
				[
					5, 15, 20, -1
				],
				[5, 15, 20, "All"] // change per page values here
			],
			// set the initial value
			"pageLength": 10,
			"lengthChange": false,
			"filter": false,
			"stateSave": true,
			"serverSide": true,
			"ajax": function(data, callback, settings) {
				var params = {};
				Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true, zIndex: 10051});
				$.ajax({
					url: Metronic.host + 'user/getUserList',
					type: 'get',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					data: {
						data: JSON.stringify(params)
					},
					success: function(datas) {
						console.debug(datas, '列表数据');
						if (datas.success) {
							var arr = [];
							$.each(datas.data.userList, function(i, n) {
								var temp = [
									n.id,
									n.name,
									"******",
									n.createTime,
									"",
									n.desc
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.total,
								recordsFiltered: datas.data.total
							};
							callback(d);
							table.find('tbody tr td:nth-child(3)').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var reset = $('<a href="" data-toggle="modal" data-target=".bs-modify-modal-lg" class="btn btn-xs green"><i class="fa fa-edit"></i> 重置 </a>');
								reset.unbind('click').bind('click', function(e) {
									$('#makesure3').unbind('click').bind('click', function(e) {
										var params = {
											userId: rowData[0],
											password: $("#newpassword").val()
										};
										$.ajax({
											url: Metronic.host + 'user/resetPassword',
											type: 'GET',
											dataType: 'json',
											xhrFields: {
												withCredentials: true
											},
											crossDomain: true,
											data: {
												data: JSON.stringify(params)
											},
											success: function(datas) {
												if (datas.success) {
													layer.msg('重置密码成功');
													location.reload();
												} else {
													layer.msg(datas.message);
													Metronic.unblockUI();
												}
											}
										});
									});
								});
								$(n).append($compile(reset)($scope));
							});
							table.find('tbody tr td:nth-child(5)').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var edit = $('<a href="" data-toggle="modal" data-target=".bs-edit-modal-lg" class="btn btn-xs green"><i class="fa fa-edit"></i> 编辑 </a>');
								var deletex = $('<a href="" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除 </a>');
								var manage = $('<a href=""  class="btn btn-xs grey-cascade"><i class="fa fa-settings"></i> 可查看乡镇 </a>');
								edit.unbind('click').bind('click', function(e) {
									$.ajax({
										url: Metronic.host + 'boss/admin/info',
										type: 'GET',
										dataType: 'json',
										xhrFields: {
											withCredentials: true
										},
										crossDomain: true,
										data: {
											data: JSON.stringify({adminId: rowData[0]})
										},
										success: function(datas) {
											if (datas.success) {
												$scope.$apply(function() {
													$scope.mlogInName = datas.data.loginName;
													$scope.mrealName = datas.data.realName;
													$scope.editrole = datas.data.roleId;
												});
											} else {
												layer.msg(datas.message);
											}
										}
									});
									$('#makesure2').unbind('click').bind('click', function(e) {
										var validate = $("#articleForm1").validate(validate_filed);
										if (!validate.form()) {
											return false;
										}
										var params = {
											userId: rowData[0],
											logInName: $scope.mlogInName,
											realName: $scope.mrealName,
											password: $scope.mpassword,
											roleId: $scope.editrole
										};
										$.ajax({
											url: Metronic.host + 'boss/admin/update',
											type: 'GET',
											dataType: 'json',
											xhrFields: {
												withCredentials: true
											},
											crossDomain: true,
											data: {
												data: JSON.stringify(params)
											},
											success: function(datas) {
												if (datas.success) {
													layer.msg('编辑成功');
													location.reload();
												} else {
													layer.msg(datas.message);
													Metronic.unblockUI();
												}
											}
										});
									});
								});
								manage.unbind('click').bind('click', function(e) {
									window.location.href = "#/ManageArea/" + rowData[0]
								});
								deletex.click(function() {
									var params = {
										userId: rowData[0]
									};
									if (confirm('确定删除此管理员')) {
										$.ajax({
											url: Metronic.host + 'boss/admin/del',
											type: 'GET',
											dataType: 'json',
											xhrFields: {
												withCredentials: true
											},
											crossDomain: true,
											data: {
												data: JSON.stringify(params)
											},
											success: function(datas) {
												if (datas.success) {
													//console.log(datas, "删除成功");
													oTable.fnDraw();
												}
											}
										});
									}
								});
								$(n).append(edit).append(deletex).append($compile(manage)($scope));
								$scope.$apply();
							});
						} else if (datas.code == 50001) {
							window.location.href = 'login.html';
						} else {
							layer.msg(datas.message);
							Metronic.unblockUI();
						}
					},
					complete: function() {
						Metronic.unblockUI();
					}
				});
			}
		});
		//搜索功能
		$('#search').click(function(e) {
			conditions.loginName = $('#loginName').val();
			table.DataTable().ajax.reload();
		});
		//添加enter搜索的事件
		$('body').bind('keydown', function(e) {
			if (e.which == 13) { //回车键的键值为13
				$('#search').click();
			}
		});
	};
	return {
		//main function to initiate the module
		init: function($scope, $compile, Shuffling, validate_filed) {
			if (!jQuery().dataTable) {
				return;
			}
			//console.log('me 1');
			initTable3($scope, $compile, Shuffling, validate_filed);
			//console.log('me 2');
		}
	};
}()
