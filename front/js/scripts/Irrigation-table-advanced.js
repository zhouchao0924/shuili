var IrrigationAdvanced = function() {
	var initTable3 = function($scope, $compile, Shuffling) {
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
			"pageLength": 10,
			"lengthChange": false,
			"filter": false,
			"stateSave": true,
			"serverSide": true,
			"ajax": function(data, callback, settings) {
				var params = {
					page: data.start / data.length + 1,
					text: $scope.text
				};
				Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true});
				$.ajax({
					url: Metronic.host + 'farmWaterProject/getList',
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
							$.each(datas.data.list || [], function(i, n) {
								var temp = [
									n.cat,
									n.name,
									n.location,
									n.buildArea,
									n.buildItems,
									n.buildTime,
									n.projectImage,
									"",
									n.desc,
									"",
									n.id,
									n.image,
									n.projectImage
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.totalCount,
								recordsFiltered: datas.data.totalCount
							};
							callback(d);
							table.find('tbody tr td:nth-child(8)').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var img = $('<a href=""> 查看 </a>');
								img.unbind('click').bind('click', function(e) {
									Shuffling(rowData[11]);
								})
								var UpImage = $('<a href="" data-toggle="modal" data-target=".bs-UpImage-modal-lg" button-show>上传图片 </a>');
								UpImage.unbind('click').bind('click', function(e) {
									$scope.imgUrlList = rowData[11];
									$scope.$apply();
									$scope.UpLoadImage = function() {
										var params = {
											id: rowData[10],
											url: $scope.imgUrlList,
											serviceType: 18
										};
										$.ajax({
											url: Metronic.host + 'attachment/updateImage',
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
													location.reload();
												}
											}
										});
									}
								})
								$(this).append($compile(img)($scope)).append($compile(UpImage)($scope));
							});
							table.find('tbody tr td:last-child').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var deletex = $('<a href="javascript:;" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除 </a>');
								deletex.click(function() {
									var params = {
										id: rowData[10],
										serviceType: 18
									};
									layer.confirm('确定要删除该行数据信息吗？', function(index) {
										$.ajax({
											url: Metronic.host + 'table/deleteItem',
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
										layer.close(index);
									})
								});
								$(this).append(deletex);
							});
							table.find('tbody tr td:nth-child(7)').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var img = $('<a href=""> 查看 </a>');
								img.unbind('click').bind('click', function(e) {
									Shuffling(rowData[12]);
								})
								var UpImage = $('<a href="" data-toggle="modal" data-target=".bs-UpImage-modal-lg" button-show>上传图片 </a>');
								UpImage.unbind('click').bind('click', function(e) {
									$scope.imgUrlList = rowData[12];
									$scope.$apply();
									$scope.UpLoadImage = function() {
										var params = {
											id: rowData[10],
											url: $scope.imgUrlList,
											serviceType: 18
										};
										$.ajax({
											url: Metronic.host + 'attachment/updateProjectImage',
											type: 'post',
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
													location.reload();
												}
											}
										});
									}
								})
								$(this).append($compile(img)($scope)).append($compile(UpImage)($scope));
							});
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
		init: function($scope, $compile, Shuffling) {
			if (!jQuery().dataTable) {
				return;
			}
			initTable3($scope, $compile, Shuffling);
		}
	};
}();
