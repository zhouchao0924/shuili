var PumpStationAdvanced = function() {
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
					page: data.start / data.length + 1,
					text: $scope.text
				};
				Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true});
				$.ajax({
					url: Metronic.host + 'PumpingStation/getList',
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
									n.address,
									n.rivers,
									n.outside_rivers,
									n.catchment_area,
									n.installed_power,
									n.pumping_station,
									n.pumping_station_num,
									n.manufacturer,
									n.gate_form,
									n.sluices_num,
									n.brake_hole_size,
									n.managerment,
									n.manager,
									n.manager_phone,
									n.completion_date,
									n.extend,
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
								var edit = $('<a href="javascript:;" class="btn btn-xs blue"><i class="fa fa-edit"></i> 编辑 </a>');
								edit.click(function(event) {
									window.location.href = '#/edit-artist/' + rowData[0] + '/' + rowData[6];
								});
								$(this).append(edit);
							});
						} else if (datas.code == 3) {
							window.location.href = 'login.html';
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
			var nickName = $('#nickName').val(),
				mobile = $('#mobile').val();
			if (nickName) {
				conditions.push({'type': 1, 'condition': nickName})
			}
			if (mobile) {
				conditions.push({'type': 2, 'condition': mobile})
			}
			table.DataTable().ajax.reload();
		});
		$("#clear").click(function(e) {
			$('#nickName').val('');
			$('#mobile').val('');
			conditions = [];
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
