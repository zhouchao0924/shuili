var FileInformationManagementAdvanced = function() {
	var initTable3 = function($scope, $compile) {
		var table = $('#sample_3');
		var oTable = table.dataTable({
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
			"pageLength": 30,
			"lengthChange": false,
			"filter": false,
			"stateSave": true,
			"serverSide": true,
			"ajax": function(data, callback, settings) {
				var params = {
					articleType: 2,
					searchKey: '',
					page: data.start / data.length + 1,
					pageSize: 30
				};
				Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true});
				$.ajax({
					url: Metronic.host + 'article/getArticleListAjax',
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
							var arr = [];
							$.each(datas.data.articleList || [], function(i, n) {
								var temp = [
									n.id,
									n.title,
									n.addTime,
									n.originalUrl,
									"",
									n.isStick
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.articleCount
									? datas.data.articleCount
									: 0,
								recordsFiltered: datas.data.articleCount
									? datas.data.articleCount
									: 0
							};
							callback(d);
							table.find('tbody tr td:last-child').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var edit = $('<a href="javascript:;" class="btn btn-xs blue"><i class="fa fa-edit"></i> 编辑 </a>');
								var deletex = $('<a href="javascript:;" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除 </a>');
								var up = $('<a href="javascript:;" class="btn btn-xs green"><i class="fa fa-upload"></i> 置顶 </a>');
								var quitup = $('<a href="javascript:;" class="btn btn-xs grey"><i class="fa fa-download"></i> 取消置顶 </a>');
								edit.click(function(event) {
									window.location.href = '#/EditFileInformationManagement/' + rowData[0];
								});
								up.click(function() {
									var params = {
										id: rowData[0],
										actionType: 2
									};
									$.ajax({
										url: Metronic.host + 'article/doActionAjax',
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
												oTable.fnDraw();
											}
										}
									});
								});
								quitup.click(function() {
									var params = {
										id: rowData[0],
										actionType: 3
									};
									$.ajax({
										url: Metronic.host + 'article/doActionAjax',
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
												oTable.fnDraw();
											}
										}
									});
								});
								deletex.click(function() {
									var params = {
										id: rowData[0],
										actionType: 1
									};
									if (confirm('确定删除?')) {
										$.ajax({
											url: Metronic.host + 'article/doActionAjax',
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
													oTable.fnDraw();
												}
											}
										});
									}
								});
								if (rowData[5] == 0) {
									$(this).append(edit).append(deletex).append(up);
								} else {
									$(this).append(edit).append(deletex).append(quitup);
								}
							});
						} else {
							alert(datas.message);
							Metronic.unblockUI();
						}
					},
					complete: function() {
						Metronic.unblockUI();
					}
				});
			}
		});
		var tableWrapper = $('#sample_3_wrapper');
		$('#searchBtn').click(function(e) {
			table.DataTable().ajax.reload();
		});
		//添加enter搜索的事件
		$('body').bind('keydown', function(e) {
			if (e.which == 13) { //回车键的键值为13
				$('#searchBtn').click();
			}
		});
	}
	return {
		//main function to initiate the module
		init: function($scope, $compile) {
			if (!jQuery().dataTable) {
				return;
			}
			initTable3($scope, $compile);
		}
	};
}();
