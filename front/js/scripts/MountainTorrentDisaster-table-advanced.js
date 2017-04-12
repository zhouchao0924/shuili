var MountainTorrentDisasterAdvanced1 = function() {
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
					url: Metronic.host + 'flood/getBaseInfoList',
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
									n.manager,
									n.village,
									"",
									"",
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
							table.find('tbody tr td:nth-child(4)').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var see = $('<a href="javascript:;"> 查看 </a>');
								var edit = $('<a href="">  编辑</a>');
								see.click(function(event) {});
								$(this).append(see).append(edit);
							});
							table.find('tbody tr td:nth-child(5)').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var see = $('<a href="javascript:;"> 查看 </a>');
								see.click(function(event) {});
								$(this).append(see);
							});
							table.find('tbody tr td:nth-child(6)').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var see = $('<a href="javascript:;"> 查看 </a>');
								see.click(function(event) {});
								$(this).append(see);
							});
							table.find('tbody tr td:last-child').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var see = $('<a href="javascript:;"> 查看 </a>');
								see.click(function(event) {});
								$(this).append(see);
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
var MountainTorrentDisasterAdvanced2 = function() {
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
					url: Metronic.host + 'flood/getFloodLeaderInfoList',
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
									n.post,
									n.leader,
									n.job,
									n.cell,
									n.uptime,
									n.desc
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.totalCount,
								recordsFiltered: datas.data.totalCount
							};
							callback(d);
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
var MountainTorrentDisasterAdvanced3 = function() {
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
					url: Metronic.host + 'flood/getFloodOwnerInfoList',
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
									n.job,
									n.village,
									n.owner.name,
									n.owner.post,
									n.owner.cell,
									n.desc
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.totalCount,
								recordsFiltered: datas.data.totalCount
							};
							callback(d);
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
var MountainTorrentDisasterAdvanced4 = function() {
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
					url: Metronic.host + 'flood/getFloodNetworkOwnerInfoList',
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
									n.village,
									n.networkName,
									n.networkType,
									n.owner.name,
									n.owner.post,
									n.owner.cell,
									n.desc
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.totalCount,
								recordsFiltered: datas.data.totalCount
							};
							callback(d);
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
var MountainTorrentDisasterAdvanced5 = function() {
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
					url: Metronic.host + 'flood/getTransferPeopleList',
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
									n.village,
									n.dangerArea,
									n.cat,
									n.location.pos,
									n.location.longitude,
									n.location.latitude,
									n.people.householder,
									n.people.peopleCount,
									n.people.cell,
									n.transferOwner.name,
									n.transferOwner.post,
									n.transferOwner.cell,
									n.transferLocation.posName,
									n.transferLocation.secureVerify,
									n.transferLocation.manager,
									n.transferLocation.cell,
									n.desc
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.totalCount,
								recordsFiltered: datas.data.totalCount
							};
							callback(d);
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
