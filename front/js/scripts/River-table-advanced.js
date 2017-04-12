var RiverAdvanced = function() {
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
					url: Metronic.host + 'riverway/getList',
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
									n.level,
									n.start,
									n.end,
									n.length,
									n.currentSituation.width,
									n.currentSituation.bottomHeight,
									n.currentSituation.damHeight,
									n.currentSituation.waterArea,
									n.planSituation.width,
									n.planSituation.bottomHeight,
									n.planSituation.damHeight,
									n.planSituation.waterArea,
									n.manageRank,
									"",
									"",
									n.desc,
									n.image,
									n.fullImage
								];
								arr.push(temp);
							});
							var d = {
								data: arr,
								recordsTotal: datas.data.totalCount,
								recordsFiltered: datas.data.totalCount
							};
							callback(d);
							table.find('tbody tr td:nth-child(17)').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var img = $('<a href=""> 查看 </a>');
								img.unbind('click').bind('click', function(e) {
									Shuffling(rowData[18]);
								})
								var UpImage = $('<a href="" data-toggle="modal" data-target=".bs-UpImage-modal-lg">上传图片 </a>');
								UpImage.unbind('click').bind('click', function(e) {
									$scope.UpLoadImage = function() {
										var params = {
											id: rowData[0],
											url: $scope.imgUrlList,
											serviceType: 4
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
							table.find('tbody tr td:nth-child(16)').each(function(i, n) {
								var rowData = table.api().row(i).data();
								if (!rowData) {
									return false;
								}
								var fullimg = $('<a href="" data-toggle="modal" data-target=".bs-fullimgshow-modal-lg"> 查看 </a>');
								fullimg.unbind('click').bind('click', function(e) {
									$('#fullimage').attr('src', rowData[19])
								})
								var editfullimg = $('<a href="" data-toggle="modal" data-target=".bs-fullimg-modal-lg">编辑全景图</a>');
								editfullimg.unbind('click').bind('click', function(e) {
									$scope.fullImageOK = function() {
										var params = {
											id: rowData[0],
											url: $scope.url,
											serviceType: 4
										};
										$.ajax({
											url: Metronic.host + 'attachment/updateFullImage',
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
								$(this).append($compile(fullimg)($scope)).append($compile(editfullimg)($scope));
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
		init: function($scope, $compile, Shuffling) {
			if (!jQuery().dataTable) {
				return;
			}
			initTable3($scope, $compile, Shuffling);
		}
	};
}();
