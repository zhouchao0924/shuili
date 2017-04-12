//空间tab页
MetronicApp.directive('roomTab', [
	'$compile',
	'qiniu',
	'$q',
	'$timeout',
	function($compile, qiniu, $q, $timeout) {
		return {
			restrict: 'E',
			// transclude: true,
			// scope: {
			//     formScope: '=',
			// },
			templateUrl: 'tpl/roomTab.html',
			link: function(scope, elem, attrs, ctrl) {
				scope.roomForm.roomType.$setPristine()
				$timeout(function() {
					$('.colorpicker-default').colorpicker();
					$('.colorpicker-default').on('changeColor', function(e) {
						var index = $(e.target).index('.colorpicker-default')
						scope.$apply(function() {
							scope.tab.room.roomTags.colorStr[index] = e.target.children[0].value
						})
					})
				})
				scope.$on('clearFormDirty', function() {
					scope.roomForm.$setPristine()
				})
				scope.$on('setFormDirty', function() {
					scope.roomForm.$setDirty()
				})
				scope.isDisabled = function() {
					return scope.suitType === '组合套装' || (scope.tab && scope.tab.room && !scope.tab.room.roomType)
				}
				scope.addRoomImage = function(e) {
					scope.tab.room.roomImages || (scope.tab.room.roomImages = []);
					var roomImages = scope.tab.room.roomImages;
					roomImages.push({
						imageId: 0,
						imageUrl: '',
						description: '',
						displayOrder: roomImages.length + 1,
						inDetailPage: 0,
						status: 1
					});
					for (var j = 0; j < roomImages.length; j++) {
						roomImages[j].displayOrder = j + 1
					}
				};
				scope.moveImgUp = function(e, index) {
					var roomImages = scope.tab.room.roomImages;
					if (index > 0) {
						if ($('.fileinput-preview img').size() > 0) {
							uploadImg().then(function() {
								var a = roomImages.splice(index, 1);
								roomImages.splice(index - 1, 0, a[0]);
							})
							return
						}
						var a = roomImages.splice(index, 1);
						roomImages.splice(index - 1, 0, a[0]);
					}
					for (var j = 0; j < roomImages.length; j++) {
						roomImages[j].displayOrder = j + 1
					}
				}
				scope.moveImgDown = function(e, index) {
					var roomImages = scope.tab.room.roomImages;
					if (index < roomImages.length - 1) {
						if ($('.fileinput-preview img').size() > 0) {
							uploadImg().then(function() {
								var a = roomImages.splice(index, 1);
								roomImages.splice(index + 1, 0, a[0]);
							})
							return
						}
						var a = roomImages.splice(index, 1);
						roomImages.splice(index + 1, 0, a[0]);
					}
					for (var j = 0; j < roomImages.length; j++) {
						roomImages[j].displayOrder = j + 1
					}
				}
				scope.delImg = function(e, index) {
					var roomImages = scope.tab.room.roomImages;
					roomImages.splice(index, 1);
					for (var j = 0; j < roomImages.length; j++) {
						roomImages[j].displayOrder = j + 1
					}
				}
				function uploadImg() {
					var qs = [];
					(function() {
						var roomImages = $('.roomImages')
						roomImages.each(function(i, e) {
							var roomImagesFile = $(e).find('.fileupload')[0]
							if (roomImagesFile.files.length) {
								var q = qiniu(roomImagesFile).then(function(data) {
									scope.tab.room.roomImages[i].imageUrl = data
										? data + '?imageView2/1/w/190/h/140'
										: ''
									roomImages.fileinput('clear')
								})
								qs.push(q)
							}
						})
					})();
					return $q.all(qs)
				}
			}
		};
	}
]);
MetronicApp.directive('roomTab2', [
	'$compile',
	'qiniu',
	'$q',
	'$timeout',
	function($compile, qiniu, $q, $timeout) {
		return {
			restrict: 'E',
			// transclude: true,
			// scope: {
			//     formScope: '=',
			// },
			templateUrl: 'tpl/roomTab2.html',
			link: function(scope, elem, attrs, ctrl) {
				scope.roomForm.roomType.$setPristine()
				$timeout(function() {
					$('.colorpicker-default').colorpicker();
					$('.colorpicker-default').on('changeColor', function(e) {
						var index = $(e.target).index('.colorpicker-default')
						scope.$apply(function() {
							scope.tab.room.roomTags.colorStr[index] = e.target.children[0].value
						})
					})
				})
				scope.$on('clearFormDirty', function() {
					scope.roomForm.$setPristine()
				})
				scope.$on('setFormDirty', function() {
					scope.roomForm.$setDirty()
				})
				scope.isDisabled = function() {
					return scope.suitType === '组合套装' || (scope.tab && scope.tab.room && !scope.tab.room.roomType)
				}
				console.log(scope.tab,"=====scope.tab========");
				scope.addRoomImage = function(e) {
					scope.tab.room.roomImages || (scope.tab.room.roomImages = []);
					var roomImages = scope.tab.room.roomImages;
					roomImages.push({
						imageId: 0,
						imageUrl: '',
						description: '',
						displayOrder: roomImages.length + 1,
						inDetailPage: 0,
						status: 1
					});
					for (var j = 0; j < roomImages.length; j++) {
						roomImages[j].displayOrder = j + 1
					}
				};
				scope.moveImgUp = function(e, index) {
					var roomImages = scope.tab.room.roomImages;
					if (index > 0) {
						if ($('.fileinput-preview img').size() > 0) {
							uploadImg().then(function() {
								var a = roomImages.splice(index, 1);
								roomImages.splice(index - 1, 0, a[0]);
							})
							return
						}
						var a = roomImages.splice(index, 1);
						roomImages.splice(index - 1, 0, a[0]);
					}
					for (var j = 0; j < roomImages.length; j++) {
						roomImages[j].displayOrder = j + 1
					}
				}
				scope.moveImgDown = function(e, index) {
					var roomImages = scope.tab.room.roomImages;
					if (index < roomImages.length - 1) {
						if ($('.fileinput-preview img').size() > 0) {
							uploadImg().then(function() {
								var a = roomImages.splice(index, 1);
								roomImages.splice(index + 1, 0, a[0]);
							})
							return
						}
						var a = roomImages.splice(index, 1);
						roomImages.splice(index + 1, 0, a[0]);
					}
					for (var j = 0; j < roomImages.length; j++) {
						roomImages[j].displayOrder = j + 1
					}
				}
				scope.delImg = function(e, index) {
					var roomImages = scope.tab.room.roomImages;
					roomImages.splice(index, 1);
					for (var j = 0; j < roomImages.length; j++) {
						roomImages[j].displayOrder = j + 1
					}
				}
				function uploadImg() {
					var qs = [];
					(function() {
						var roomImages = $('.roomImages')
						roomImages.each(function(i, e) {
							var roomImagesFile = $(e).find('.fileupload')[0]
							if (roomImagesFile.files.length) {
								var q = qiniu(roomImagesFile).then(function(data) {
									scope.tab.room.roomImages[i].imageUrl = data
										? data + '?imageView2/1/w/190/h/140'
										: ''
									roomImages.fileinput('clear')
								})
								qs.push(q)
							}
						})
					})();
					return $q.all(qs)
				}
			}
		};
	}
]);
MetronicApp.directive('validateTab', [
	'$timeout',
	'qiniu',
	'$parse',
	function($timeout, qiniu, $parse) {
		return {
			restrict: 'A', priority: 1,
			// terminal: true,
			// scope: true,
			link: function(scope, elem, attrs, ctrl) {
				elem.click(function(e) {
					var newIndex = $(e.target).index('#suit_tabs a[data-toggle="tab"]')
					if (scope.tab.room && scope.tab.room.roomTypeObj && scope.tab.room.roomTypeObj.name === '未选择') {
						scope.$apply(function() {
							scope.tab.tagIndex = newIndex
							scope.tab.room = scope.suitsDetail.roomList[newIndex]
							scope.tab.room.roomTypeObj = scope.types[scope.tab.room.roomType]
						})
					} else {
						scope.beforeAddsuit()
						scope.$apply(function() {
							scope.$parent.$broadcast('makeAllDirty')
						})
						var invalid = $parse('roomForm')(scope).$invalid
						var typeInvalid = $parse('roomForm')(scope).roomType.$invalid
						var dirty = $parse('roomForm')(scope).$dirty
						if (invalid && !typeInvalid) {
							$timeout(function() {
								Metronic.scrollTo($('ng-form[name="roomForm"] .has-error'));
							})
							e.preventDefault();
							e.stopPropagation();
							$('#suit_tabs a[data-toggle="tab"]')[scope.tab.tagIndex].focus()
							layer.msg('请完善必填信息，或清空空间类型！')
							return
						}
						if (dirty && scope.isEditSuit) {
							if (confirm('该空间未保存，是否保存？')) {
								$timeout(function() {
									Metronic.scrollTo($('#save_room_button'));
								})
								e.preventDefault();
								e.stopPropagation();
								$('#suit_tabs a[data-toggle="tab"]')[scope.tab.tagIndex].focus()
							} else {
								changeTab(newIndex)
							}
							return
						}
						changeTab(newIndex)
					}
				})
				var changeTab = function(newIndex) {
					(function(tagIndex) {
						var roomDesignImage = $('.roomDesignImage')
						var roomDesignImageFile = roomDesignImage.find('.fileupload')[0]
						if (roomDesignImageFile.files.length) {
							qiniu(roomDesignImageFile).then(function(data) {
								scope.suitsDetail.roomList[tagIndex].designImage.imageUrl = data
								roomDesignImage.fileinput('clear')
							})
						}
						var roomImages = $('.roomImages')
						roomImages.each(function(i, e) {
							var roomImagesFile = $(e).find('.fileupload')[0]
							if (roomImagesFile.files.length) {
								qiniu(roomImagesFile).then(function(data) {
									scope.suitsDetail.roomList[tagIndex].roomImages[i].imageUrl = data
									roomImages.fileinput('clear')
								})
							}
						})
					})(scope.tab.tagIndex);
					scope.$apply(function() {
						scope.tab.tagIndex = newIndex
						scope.tab.room = scope.suitsDetail.roomList[newIndex]
						scope.tab.room.roomTypeObj = scope.types[scope.tab.room.roomType]
						scope.roomForm.$setPristine()
					})
				}
			}
		};
	}
]);
MetronicApp.directive('validateRoom', [
	'$timeout',
	'qiniu',
	'$parse',
	function($timeout, qiniu, $parse) {
		return {
			restrict: 'A', priority: 1,
			// terminal: true,
			// scope: true,
			link: function(scope, elem, attrs, ctrl) {
				elem.click(function() {
					validate()
				})
				var validate = function() {
					scope.$apply(function() {
						scope.$parent.$broadcast('makeAllDirty')
					})
					// var invalid = $parse('roomForm')(scope).$invalid
					// if (scope.suitType === '全新套装') {
					var invalid = $parse('suitForm')(scope).$invalid
					// }
					scope.tab.invalid = invalid
					if (invalid) {
						$timeout(function() {
							Metronic.scrollTo($('.has-error'));
						})
						return
					}
					scope.saveRoom()
					scope.roomForm.$setPristine()
				}
			}
		};
	}
]);
//空间选择弹出框
MetronicApp.directive('roomSelectModal', [
	'ajax1',
	'$compile',
	'getRoomTypeFilter',
	'getStyleTextFilter',
	function(ajax1, $compile, getRoomTypeFilter, getStyleTextFilter) {
		var linker = function(scope, elem, attrs, ctrl) {
			scope.types = []
			scope.brands = []
			var conditions = {}
			scope.searchDetail = {}
			scope.statusAll = [
				{
					name: '上架',
					id: 0
				}, {
					name: '下架',
					id: 1
				}
			]
			elem.find('.modal.fade.bs-modal-lg').attr('id', scope.modalId);
			var table = elem.find('#sample_3')
			$('#' + scope.modalId).on('show.bs.modal', function() {
				elem.find('table input').prop('checked', false);
				$.uniform.update();
			})
			//从配置项中获取空间类型
			ajax1('/configitem/queryItemsByConfigId/12/').then(function(data2) {
				scope.types = data2.obj;
				// $scope.types.length && ($scope.searchDetail.type = 0)
			})
			ajax1('/style/queryStyleTree/').then(function(data2) {
				scope.styles = data2.obj;
				// $scope.types.length && ($scope.searchDetail.type = 0)
			})
			scope.goodsDialogOK = function() {
				var roomSel = roomsSearched.filter(function(e) {
					return parseInt(e.roomId) === parseInt(scope.roomId)
				})
				ctrl.$setViewValue(roomSel[0]);
				$('#' + scope.modalId).modal('hide');
			}
			scope.search = function() {
				conditions = {
					conditions: []
				}
				if (scope.searchDetail.id) {
					conditions.conditions.push({'type': 0x01, 'condition': scope.searchDetail.id})
				}
				if (scope.searchDetail.name) {
					conditions.conditions.push({'type': 0x02, 'condition': scope.searchDetail.name})
				}
				if (scope.searchDetail.type) {
					conditions.conditions.push({'type': 0x03, 'condition': scope.searchDetail.type})
				}
				if (scope.searchDetail.style) {
					conditions.conditions.push({'type': 0x04, 'condition': scope.searchDetail.style})
				}
				if (scope.searchDetail.status !== null) {
					conditions.conditions.push({'type': 0x05, 'condition': scope.searchDetail.status})
				}
				if (scope.searchDetail.priceA) {
					conditions.conditions.push({'type': 0x06, 'condition': scope.searchDetail.priceA})
				}
				if (scope.searchDetail.priceB) {
					conditions.conditions.push({'type': 0x07, 'condition': scope.searchDetail.priceB})
				}
				if (scope.searchDetail.areaA) {
					conditions.conditions.push({'type': 0x08, 'condition': scope.searchDetail.areaA})
				}
				if (scope.searchDetail.areaB) {
					conditions.conditions.push({'type': 0x09, 'condition': scope.searchDetail.areaB})
				}
				if (scope.searchDetail.widthA) {
					conditions.conditions.push({'type': 0x0A, 'condition': scope.searchDetail.widthA})
				}
				if (scope.searchDetail.widthB) {
					conditions.conditions.push({'type': 0x0B, 'condition': scope.searchDetail.widthB})
				}
				if (scope.searchDetail.longA) {
					conditions.conditions.push({'type': 0x0C, 'condition': scope.searchDetail.longA})
				}
				if (scope.searchDetail.longB) {
					conditions.conditions.push({'type': 0x0D, 'condition': scope.searchDetail.longB})
				}
				table.DataTable().ajax.reload();
			}
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
				"stateSave": false,
				"serverSide": true,
				"ajax": function(data, callback, settings) {
					var a = JSON.parse(window.localStorage.Userdata);
					var params = {
						pageNo: data.start / data.length + 1,
						pageSize: data.length
					};
					$.extend(params, conditions);
					Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true});
					$.ajax({
						url: Metronic.host + '/room/queryAllSuitRoom/' + a.userId + '/' + a.sessionId,
						type: 'POST',
						cache: false,
						dataType: 'json',
						data: JSON.stringify(params),
						success: function(datas) {
							if (datas.code == 1) {
								roomsSearched = datas.obj.list
								var arr = [];
								$.each(datas.obj.list, function(i, n) {
									var temp = [
										'',
										n.roomId,
										n.roomName,
										getRoomTypeFilter(n.roomType),
										n.size,
										n.productCnt,
										n.roomPrice,
										n.roomTags.style.map(function(e) {
											return getStyleTextFilter(e)
										}).join('、'),
										'',
										''
									]
									arr.push(temp);
								})
								var d = {
									data: arr,
									recordsTotal: datas.obj.totalRecords,
									recordsFiltered: datas.obj.totalRecords
								}
								callback(d);
								table.find('tbody tr td:first-child').each(function(i, n) {
									var rowData = table.api().row(i).data();
									if (!rowData) {
										return false;
									}
									var input = '<input type="radio" class="radio" ng-model="roomId" value="' + rowData[1] + '" /> </td>';
									$(n).append($compile(input)(scope));
								})
								table.find('tbody tr td:nth-child(3)').each(function(i, n) {
									var rowData = table.api().row(i).data();
									if (!rowData) {
										return false;
									}
									$(n).click(function() {
										window.open('#/edit-rooms-detail/' + rowData[1], '_blank');
									})
									$(n).css("cursor", "pointer").addClass("text-primary")
								})
								// $('input.radio').uniform();
							} else if (datas.code == 3) {
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
		}
		return {
			restrict: 'E',
			require: '?ngModel',
			scope: {
				ngModel: '=?',
				modalId: '@'
			},
			templateUrl: 'tpl/modalRoomSelect.html',
			link: linker
		};
	}
]);
// //验证套装优惠价是否超过总价
// MetronicApp.directive('moneyCorrect', ['$compile', function($compile) {
//     return {
//         restrict: 'A',
//         require: 'ngModel',
//         link: function(scope, elem, attrs, ngModel) {
//             var isCorrect = function(value) {
//                 if (!value || !scope.suitsDetail.roomPriceAmount || !scope.suitsDetail.productPriceAmount) {
//                     return true
//                 }
//
//                 return parseInt(value) <= parseInt(scope.suitsDetail.roomPriceAmount) && parseInt(value) <= parseInt(scope.suitsDetail.productPriceAmount)
//             }
//             ngModel.$parsers.push(function(value) {
//                 ngModel.$setValidity('套装优惠价超过总价', isCorrect(value))
//                 return isCorrect(value) ? value : undefined
//             })
//             scope.$watch(attrs.ngModel, function() {
//                 ngModel.$setValidity('套装优惠价超过总价', isCorrect(ngModel.$viewValue))
//             })
//             scope.$watch('suitsDetail.roomPriceAmount', function() {
//                 ngModel.$setValidity('套装优惠价超过总价', isCorrect(ngModel.$viewValue))
//             })
//         }
//     };
// }]);
//验证空间优惠价是否超过总价
// MetronicApp.directive('roomMoneyCorrect', ['$compile', function($compile) {
//     return {
//         restrict: 'A',
//         require: 'ngModel',
//         link: function(scope, elem, attrs, ngModel) {
//             var isCorrect = function(value) {
//                 if (!value || !scope.tab.room.roomTotalPrice) {
//                     return true
//                 }
//
//                 return parseInt(value) <= parseInt(scope.tab.room.roomTotalPrice)
//             }
//             ngModel.$parsers.push(function(value) {
//                 ngModel.$setValidity('空间优惠价超过单品总价', isCorrect(value))
//                 return isCorrect(value) ? value : undefined
//             })
//             scope.$watch(attrs.ngModel, function() {
//                 ngModel.$setValidity('空间优惠价超过单品总价', isCorrect(ngModel.$viewValue))
//             })
//         }
//     };
// }]);
//
MetronicApp.directive('roomMoneyCorrect2', [
	'$compile',
	function($compile) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elem, attrs, ngModel) {
				var isCorrect = function(value) {
					if (!value || !scope.tab.room.purchasePriceTotal) {
						return true
					}
					return parseInt(value) >= parseInt(scope.tab.room.purchasePriceTotal)
				}
				ngModel.$parsers.push(function(value) {
					ngModel.$setValidity('空间优惠价低于单品成本价', isCorrect(value))
					return isCorrect(value)
						? value
						: undefined
				})
				scope.$watch(attrs.ngModel, function() {
					ngModel.$setValidity('空间优惠价低于单品成本价', isCorrect(ngModel.$viewValue))
				})
			}
		};
	}
]);
