var LongRiverSystemAdvanced1 = function() {
	var initTable = function($scope, $compile, Shuffling) {
		var table = $('#sample_1');
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
					text: $scope.text1
				};
				Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true});
				$.ajax({
					url: Metronic.host + 'RiverManagerBase/getList',
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
									n.id,
									n.name,
									n.riverId,
									n.riversSize,
									n.start,
									n.end,
									n.riverManager,
									n.position,
									n.contactInfo,
									n.police,
									n.policeContactInfo,
									""
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.totalCount,
								recordsFiltered: datas.data.totalCount
							};
							callback(d);
							table.find('tbody tr td:last-child').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var deletex = $('<a href="javascript:;" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除 </a>');
								deletex.click(function() {
									var params = {
										id: rowData[0],
										serviceType: 7
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
								$(this).append($compile(deletex)($scope));
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
		$('#searchBtn1').click(function(e) {
			table.DataTable().ajax.reload();
		});
		//添加enter搜索的事件
		$('body').bind('keydown', function(e) {
			if (e.which == 13) { //回车键的键值为13
				$('#searchBtn1').click();
			}
		});
	}
	return {
		//main function to initiate the module
		init: function($scope, $compile, Shuffling) {
			if (!jQuery().dataTable) {
				return;
			}
			initTable($scope, $compile, Shuffling);
		}
	};
}();
var LongRiverSystemAdvanced2 = function() {
	var initTable = function($scope, $compile, Shuffling) {
		var table = $('#sample_2');
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
					text: $scope.text2
				};
				Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true});
				$.ajax({
					url: Metronic.host + 'RiverDrain/getList',
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
									n.id,
									n.riverId,
									n.riversLevel,
									n.name,
									n.rainwaterOutlet,
									n.sewageOutlet,
									n.rainwaterSewageOutlet,
									n.outletNum,
									n.image,
									"",
									""
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.totalCount,
								recordsFiltered: datas.data.totalCount
							};
							callback(d);
							table.find('tbody tr td:last-child').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var deletex = $('<a href="javascript:;" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除 </a>');
								deletex.click(function() {
									var params = {
										id: rowData[0],
										serviceType: 8
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
								$(this).append($compile(deletex)($scope));
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
		$('#searchBtn2').click(function(e) {
			table.DataTable().ajax.reload();
		});
		//添加enter搜索的事件
		$('body').bind('keydown', function(e) {
			if (e.which == 13) { //回车键的键值为13
				$('#searchBtn2').click();
			}
		});
	}
	return {
		//main function to initiate the module
		init: function($scope, $compile, Shuffling) {
			if (!jQuery().dataTable) {
				return;
			}
			initTable($scope, $compile, Shuffling);
		}
	};
}();
var LongRiverSystemAdvanced3 = function() {
	var initTable = function($scope, $compile, Shuffling) {
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
					text: $scope.text3
				};
				Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true});
				$.ajax({
					url: Metronic.host + 'WaterQualityBase/getList',
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
									n.id,
									n.name,
									n.detecionPosition,
									n.latitudeLongitude,
									"",
									"",
									"",
									n.image
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.totalCount,
								recordsFiltered: datas.data.totalCount
							};
							callback(d);
							table.find('tbody tr td:nth-child(6)').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var img = $('<a href=""> 查看 </a>');
								img.unbind('click').bind('click', function(e) {
									Shuffling(rowData[7]);
								})
								var UpImage = $('<a href="" data-toggle="modal" data-target=".bs-UpImage-modal-lg" button-show>上传图片 </a>');
								UpImage.unbind('click').bind('click', function(e) {
									$scope.imgUrlList = rowData[7];
									$scope.$apply();
									$scope.UpLoadImage = function() {
										var params = {
											id: rowData[0],
											url: $scope.imgUrlList,
											serviceType: 9
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
										id: rowData[0],
										serviceType: 9
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
								$(this).append($compile(deletex)($scope));
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
		$('#searchBtn3').click(function(e) {
			table.DataTable().ajax.reload();
		});
		//添加enter搜索的事件
		$('body').bind('keydown', function(e) {
			if (e.which == 13) { //回车键的键值为13
				$('#searchBtn3').click();
			}
		});
	}
	return {
		//main function to initiate the module
		init: function($scope, $compile, Shuffling) {
			if (!jQuery().dataTable) {
				return;
			}
			initTable($scope, $compile, Shuffling);
		}
	};
}();
var LongRiverSystemAdvanced4 = function() {
	var initTable = function($scope, $compile, Shuffling) {
		var table = $('#sample_4');
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
					text: $scope.text4
				};
				Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true});
				$.ajax({
					url: Metronic.host + 'WaterQualityDesc/getList',
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
									n.time,
									n.detecionPosition,
									n.latitudeLongitude,
									n.temperature,
									n.ph,
									n.turbidity,
									n.cdo,
									n.nh3n,
									n.p,
									n.n,
									n.other,
									n.conclusion,
									n.remarks,
									""
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.totalCount,
								recordsFiltered: datas.data.totalCount
							};
							callback(d);
							table.find('tbody tr td:last-child').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var deletex = $('<a href="javascript:;" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除 </a>');
								deletex.click(function() {
									var params = {
										id: rowData[0],
										serviceType: 10
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
								$(this).append($compile(deletex)($scope));
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
		$('#searchBtn4').click(function(e) {
			table.DataTable().ajax.reload();
		});
		//添加enter搜索的事件
		$('body').bind('keydown', function(e) {
			if (e.which == 13) { //回车键的键值为13
				$('#searchBtn4').click();
			}
		});
	}
	return {
		//main function to initiate the module
		init: function($scope, $compile, Shuffling) {
			if (!jQuery().dataTable) {
				return;
			}
			initTable($scope, $compile, Shuffling);
		}
	};
}();
var LongRiverSystemAdvanced5 = function() {
	var initTable = function($scope, $compile, Shuffling) {
		var table = $('#sample_5');
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
					text: $scope.text5
				};
				Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true});
				$.ajax({
					url: Metronic.host + 'RiverDrainExtend/getList',
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
									n.id,
									n.name,
									n.position,
									n.riverName,
									n.pollutionSource,
									n.village,
									n.dischargeMode.lianxu,
									n.dischargeMode.jianxian,
									n.inRiverMode.lianxu,
									n.inRiverMode.guandao,
									n.inRiverMode.bangzhan,
									n.inRiverMode.hanzha,
									n.inRiverMode.qianshe,
									n.inRiverMode.qita,
									n.treatmentMethod,
									"",
									n.remarks,
									"",
									n.image
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.totalCount,
								recordsFiltered: datas.data.totalCount
							};
							callback(d);
							table.find('tbody tr td:last-child').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var deletex = $('<a href="javascript:;" class="btn btn-xs red"><i class="fa fa-trash"></i> 删除 </a>');
								deletex.click(function() {
									var params = {
										id: rowData[0],
										serviceType: 11
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
								$(this).append($compile(deletex)($scope));
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
		$('#searchBtn5').click(function(e) {
			table.DataTable().ajax.reload();
		});
		//添加enter搜索的事件
		$('body').bind('keydown', function(e) {
			if (e.which == 13) { //回车键的键值为13
				$('#searchBtn5').click();
			}
		});
	}
	return {
		//main function to initiate the module
		init: function($scope, $compile, Shuffling) {
			if (!jQuery().dataTable) {
				return;
			}
			initTable($scope, $compile, Shuffling);
		}
	};
}();
