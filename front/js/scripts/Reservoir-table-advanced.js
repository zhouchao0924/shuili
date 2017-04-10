var ReservoirAdvanced1 = function() {
	var initTable = function($scope, $compile) {
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
			"pageLength": 30,
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
					url: Metronic.host + 'reservoirAndPool/getList',
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
									n.name,
									n.projectScale,
									n.catchmentArea,
									n.storageCapacity.xiaoheshuiwei,
									n.storageCapacity.zongkurong,
									n.storageCapacity.shejishuiwei,
									n.storageCapacity.xiangyinkurong,
									n.storageCapacity.zhengchangshuiwei,
									n.storageCapacity.zhengchangkurong,
									n.dam.baxing,
									n.dam.dibagaocheng,
									n.dam.bagao,
									n.dam.bachang,
									n.floodDischargeFcailities.xingshi,
									n.floodDischargeFcailities.dibagaocheng,
									n.floodDischargeFcailities.kuandu,
									n.conveyanceFcailities.xingshi,
									n.conveyanceFcailities.chicun,
									n.conveyanceFcailities.jinkougaocheng,
									n.conveyanceFcailities.chukougaocheng,
									n.discharge.shejibiaozhun,
									n.discharge.hexiaobiaozhun,
									n.controlLevel.meixunqi,
									n.controlLevel.taixunqi,
									n.extend,
									n.fullImage,
									n.image,
									n.manager.username,
									n.manager.phone,
									n.inspector.username,
									n.inspector.phone,
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
								var edit = $('<a href="javascript:;" class="btn btn-xs blue"><i class="fa fa-edit"></i> 编辑 </a>');
								edit.click(function(event) {
									window.location.href = '#/edit-artist/' + rowData[0] + '/' + rowData[6];
								});
								$(this).append(edit);
							});
						} else {
							alert(datas.ext.msg);
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
		init: function($scope, $compile) {
			if (!jQuery().dataTable) {
				return;
			}
			initTable($scope, $compile);
		}
	};
}();
var ReservoirAdvanced2 = function() {
	var initTable = function($scope, $compile) {
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
			"pageLength": 30,
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
					url: Metronic.host + 'hillPond/getList',
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
									n.hillPondName,
									n.catchmentArea,
									n.storageCapacity.xiaoheshuiwei,
									n.storageCapacity.zongkurong,
									n.storageCapacity.shejishuiwei,
									n.storageCapacity.xiangyinkurong,
									n.storageCapacity.zhengchangshuiwei,
									n.storageCapacity.zhengchangkurong,
									n.dam.baxing,
									n.dam.dibagaocheng,
									n.dam.bagao,
									n.dam.bachang,
									n.floodDischargeFcailities.xingshi,
									n.floodDischargeFcailities.dibagaocheng,
									n.floodDischargeFcailities.kuandu,
									n.conveyanceFcailities.xingshi,
									n.conveyanceFcailities.chicun,
									n.conveyanceFcailities.jinkougaocheng,
									n.conveyanceFcailities.chukougaocheng,
									n.image,
									n.extend,
									n.manager.username,
									n.manager.phone,
									n.inspector.username,
									n.inspector.phone,
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
		init: function($scope, $compile) {
			if (!jQuery().dataTable) {
				return;
			}
			initTable($scope, $compile);
		}
	};
}();
var ReservoirAdvanced3 = function() {
	var initTable = function($scope, $compile) {
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
					page: data.start / data.length + 1,
					text: $scope.text3
				};
				Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true});
				$.ajax({
					url: Metronic.host + 'WaterConservancy/getList',
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
									n.name,
									n.township,
									n.basin,
									n.catchmentArea,
									n.diversion,
									n.head,
									n.designCapacity,
									n.installedCapacity,
									n.plantLocation.jindu,
									n.plantLocation.weidu,
									n.commissionningDate,
									n.reform,
									n.ownership,
									n.extend,
									n.floodDischargeFcailities.dibagaocheng,
									"",
									"",
									n.manager.username,
									n.manager.phone
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
		init: function($scope, $compile) {
			if (!jQuery().dataTable) {
				return;
			}
			initTable($scope, $compile);
		}
	};
}();
