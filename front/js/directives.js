/***
GLobal Directives
***/
// Route State Load Spinner(used on page or content load)
MetronicApp.directive('ngSpinnerBar', [
	'$rootScope',
	function($rootScope) {
		return {
			link: function(scope, element, attrs) {
				// by defult hide the spinner bar
				element.addClass('hide'); // hide spinner bar by default
				// display the spinner bar whenever the route changes(the content part started loading)
				$rootScope.$on('$stateChangeStart', function() {
					element.removeClass('hide'); // show spinner bar
				});
				// hide the spinner bar on rounte change success(after the content loaded)
				$rootScope.$on('$stateChangeSuccess', function() {
					element.addClass('hide'); // hide spinner bar
					$('body').removeClass('page-on-load'); // remove page loading indicator
					Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu
					// auto scorll to page top
					setTimeout(function() {
						// Metronic.scrollTop(); // scroll to the top on content load
					}, $rootScope.settings.layout.pageAutoScrollOnLoad);
				});
				// handle errors
				$rootScope.$on('$stateNotFound', function() {
					element.addClass('hide'); // hide spinner bar
				});
				// handle errors
				$rootScope.$on('$stateChangeError', function() {
					element.addClass('hide'); // hide spinner bar
				});
			}
		};
	}
]);
// Handle global LINK click
MetronicApp.directive('a', function() {
	return {
		restrict: 'E',
		link: function(scope, elem, attrs) {
			if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
				elem.on('click', function(e) {
					e.preventDefault(); // prevent link click for above criteria
				});
			}
		}
	};
});
// Handle Dropdown Hover Plugin Integration
MetronicApp.directive('dropdownMenuHover', function() {
	return {
		link: function(scope, elem) {
			elem.dropdownHover();
		}
	};
});
//set uniform automatically
MetronicApp.directive("bnUniform", function() {
	// Return the directive configuration object.
	return ({link: link, restrict: "A"});
	// I bind the JavaScript events to the view-model.
	function link(scope, element, attributes) {
		// Because we are deferring the application of the Uniform plugin,
		// this will help us keep track of whether or not the plugin has been
		// applied.
		var uniformedElement = null;
		// We don't want to link-up the Uniform plugin right away as it will
		// query the DOM (Document Object Model) layout which will cause the
		// browser to repaint which will, in turn, lead to unexpected and poor
		// behaviors like forcing a scroll of the page. Since we have to watch
		// for ngModel value changes anyway, we'll defer our Uniform plugin
		// instantiation until after the first $watch() has fired.
		scope.$watch(attributes.ngModel, handleModelChange);
		// When the scope is destroyed, we have to teardown our jQuery plugin
		// to in order to make sure that it releases memory.
		scope.$on("$destroy", handleDestroy);
		// ---
		// PRIVATE METHODS.
		// ---
		// I clean up the directive when the scope is destroyed.
		function handleDestroy() {
			// If the Uniform plugin has not yet been applied, there's nothing
			// that we have to explicitly teardown.
			if (!uniformedElement) {
				return;
			}
			uniformedElement.uniform.restore(uniformedElement);
		}
		// I handle changes in the ngModel value, translating it into an
		// update to the Uniform plugin.
		function handleModelChange(newValue, oldValue) {
			// If we try to call render right away, two things will go wrong:
			// first, we won't give the ngValue directive time to pipe the
			// correct value into ngModle; and second, it will force an
			// undesirable repaint of the browser. As such, we'll perform the
			// Uniform synchronization at a later point in the $digest.
			scope.$evalAsync(synchronizeUniform);
		}
		// I synchronize Uniform with the underlying form element.
		function synchronizeUniform() {
			// Since we are executing this at a later point in the $digest
			// life-cycle, we need to ensure that the scope hasn't been
			// destroyed in the interim period. While this is unlikely (if
			// not impossible - I haven't poured over the details of the $digest
			// in this context) it's still a good idea as it embraces the
			// nature of the asynchronous control flow.
			// --
			// NOTE: During the $destroy event, scope is detached from the
			// scope tree and the parent scope is nullified. This is why we
			// are checking for the absence of a parent scope to indicate
			// destruction of the directive.
			if (!scope.$parent) {
				return;
			}
			// If Uniform has not yet been integrated, apply it to the element.
			if (!uniformedElement) {
				return (uniformedElement = element.uniform());
			}
			// Otherwise, update the existing instance.
			uniformedElement.uniform.update(uniformedElement);
		}
	}
});
// override the default input to update on blur
MetronicApp.directive('ngModelOnblur', function() {
	return {
		restrict: 'A', require: 'ngModel', priority: 1, // needed for angular 1.2.x
		link: function(scope, elm, attr, ngModelCtrl) {
			if (attr.type === 'radio' || attr.type === 'checkbox')
				return;
			elm.unbind('input').unbind('keydown').unbind('change');
			elm.bind('blur', function() {
				scope.$apply(function() {
					ngModelCtrl.$setViewValue(elm.val());
				});
			});
			elm.bind('keyup', function(e) {
				//'enter' key
				if (e.keyCode === 13) {
					elm.blur()
				}
			});
		}
	};
});
//在元素上增加enter key事件
MetronicApp.directive('enterKey', function() {
	return {
		restrict: 'A',
		link: function(scope, elm, attr) {
			elm.bind("keydown keypress", function(event) {
				if (event.which === 13) {
					scope.$apply(function() {
						scope.$eval(attr.enterKey, {'event': event});
					});
					event.preventDefault();
				}
			});
		}
	};
});
// 当在一个元素上拖拽鼠标，阻止click事件；
// 本指令必须在该元素绑定所有click事件前compile，对DataTable需采用如下写法：
// 先.append().apply()，最后再.click()
// $(this).append($compile(n)($scope));
// $scope.$apply();
// $(n).click(function() {
//     window.location.href = '#/edit-customer-detail/' + rowData[0];
// })
MetronicApp.directive('draggable', function() {
	var isDragging = false;
	var wasDragging = false;
	return {
		terminal: true,
		restrict: 'A',
		link: function(scope, elm, attr, ctrl) {
			//因为chrome可能会在mousedown和mouseup事件同时触发一次mousemove事件（实际上鼠标应该没动）
			//通过此变量忽略mousedown事件同时触发的一次mousemove事件
			var ignoreNextMove = false;
			$(elm).mousedown(function() {
				ignoreNextMove = true;
				isDragging = false;
			}).mousemove(function() {
				if (ignoreNextMove) {
					ignoreNextMove = false;
					return;
				}
				isDragging = true;
			}).mouseup(function(e) {
				wasDragging = isDragging;
				isDragging = false;
			}).click(function(e) {
				if (wasDragging) {
					e.stopImmediatePropagation()
				}
			})
		}
	};
});
//点击一次后置灰
MetronicApp.directive('noDoubleClick', function() {
	return {
		terminal: true,
		restrict: 'A',
		priority: 100,
		link: function(scope, elm, attr, ctrl) {
			elm.click(function() {
				elm.attr('disabled', '')
			})
		}
	};
});
//底部保存按钮悬浮，在form-actions上
// <div class="form-actions" elm-float>
// </div>
MetronicApp.directive('elmFloat', function() {
	return {
		restrict: 'A',
		link: function(scope, elm, attr, ctrl) {
			elm.attr('style', 'bottom: 0;z-index: 1099;')
			var operateArea = elm,
				formBody = operateArea.prev(),
				wh = $(window).height();
			operateArea.width(operateArea.parent().width() - 20);
			if (formBody[0].getBoundingClientRect().bottom > wh) {
				operateArea.css({'position': 'fixed'})
			}
			$(window).on('scroll resize', function(e) {
				if (e.type == 'resize') {
					wh = $(window).height();
					operateArea.width(operateArea.parent().width() - 20);
				}
				if (formBody[0].getBoundingClientRect().bottom > wh) {
					operateArea.css({'position': 'fixed'})
				} else {
					operateArea.css({'position': 'static'})
				}
			})
		}
	};
});
var RegOpt = /\s+in\s+([^\s]+)/
//设置select的ngOptions
MetronicApp.directive('setOptions', [
	'$parse',
	'ajaxCache',
	'queryFilter',
	'ConfAjax',
	'ConfData',
	function($parse, ajaxCache, queryFilter, ConfAjax, ConfData) {
		return {
			require: 'ngModel',
			restrict: 'A',
			compile: function compile(tElement, tAttrs, transclude) {
				if (!tElement.children().length) {
					tElement.prepend('<option value="">请选择</option>')
				}
				if (!tAttrs.ngOptions) {
					var optionsName = tAttrs.setOptions.match(/\/([^/]*)\/$/),
						ngOptionName
					if (optionsName) {
						ngOptionName = optionsName.length
							? optionsName[1]
							: optionsName
						tAttrs.ngOptions = "m." + ConfAjax[tAttrs.setOptions][0] + " as m." + ConfAjax[tAttrs.setOptions][1] + " for m in " + ngOptionName
					} else if (typeof ConfData[tAttrs.setOptions][0] === 'string') {
						ngOptionName = tAttrs.setOptions
						tAttrs.ngOptions = '' + ngOptionName + '.indexOf(m)+1 as m for m in ' + ngOptionName
					} else {
						ngOptionName = tAttrs.setOptions
						tAttrs.ngOptions = 'm.id as m.name for m in ' + ngOptionName
					}
					tElement.attr('ng-options', tAttrs.ngOptions)
				}
				// tElement.attr('data-placeholder', "请选择")
				return function(scope, elm, attr, ctrl) {
					if (/^\/.+\/$/.test(attr.setOptions)) {
						ajaxCache(attr.setOptions).then(function(data) {
							var types = angular.copy(data.obj);
							var options = attr.ngOptions.match(RegOpt)[1]
							$parse(options).assign(scope, types)
							$parse(options).assign(scope.$parent, types)
						})
					} else {
						var options = attr.ngOptions.match(RegOpt)[1]
						$parse(options).assign(scope, queryFilter(attr.setOptions))
						$parse(options).assign(scope.$parent, queryFilter(attr.setOptions))
					}
				}
			}
		};
	}
]);
MetronicApp.directive('setOptionsDef', [
	'$parse',
	function($parse) {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elm, attr, ctrl) {
				ctrl.$setViewValue($parse(attr.setOptionsDef)())
			}
		}
	}
]);
//select设置：从配置项中获取空间类型
MetronicApp.directive('roomTypes', [
	'ajax1',
	'$parse',
	'ajaxCache',
	function(ajax1, $parse, ajaxCache) {
		// var types = []
		// var q = ajax1('/configitem/queryItemsByConfigId/12/').then(function(data) {
		//     types = data.obj;
		// })
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elm, attr, ctrl) {
				ajaxCache('/configitem/queryItemsByConfigId/12/').then(function(data) {
					var types = angular.copy(data.obj);
					types.shift()
					var options = attr.ngOptions.match(RegOpt)[1]
					$parse(options).assign(scope, types)
					$parse(options).assign(scope.$parent, types)
				})
				// if (types.length) {
				//     var options = attr.ngOptions.match(RegOpt)[1]
				//     $parse(options).assign(scope, types)
				//         //由于空间tab页是子scope，所以此处要scope.$parent
				//     $parse(options).assign(scope.$parent, types)
				//     ctrl.$setViewValue(types[0])
				// } else {
				//     q.then(function() {
				//         var options = attr.ngOptions.match(RegOpt)[1]
				//         $parse(options).assign(scope, types)
				//             //由于空间tab页是子scope，所以此处要scope.$parent
				//         $parse(options).assign(scope.$parent, types)
				//         ctrl.$setViewValue(types[0])
				//     })
				// }
			}
		};
	}
]);
//select设置：从配置项中获取适用风格
MetronicApp.directive('roomStyles', [
	'ajax1',
	'$parse',
	function(ajax1, $parse) {
		var styles = []
		var q = ajax1('/style/queryStyleTree/').then(function(data) {
			styles = data.obj;
		})
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elm, attr, ctrl) {
				if (styles.length) {
					var options = attr.ngOptions.match(RegOpt)[1]
					$parse(options).assign(scope, styles)
				} else {
					q.then(function() {
						var options = attr.ngOptions.match(RegOpt)[1]
						$parse(options).assign(scope, styles)
					})
				}
			}
		};
	}
]);
//select设置：从后台获取楼盘信息，即所属项目
MetronicApp.directive('buildHouse', [
	'ajaxCache',
	'$parse',
	'$cacheFactory',
	function(ajaxCache, $parse, $cacheFactory) {
		return {
			require: 'ngModel',
			restrict: 'A',
			priority: 10,
			compile: function compile(tElement, tAttrs, transclude) {
				if (!tAttrs.ngOptions) {
					tAttrs.ngOptions = 'm.buildingId as m.buildingName for m in buildings'
				}
				return function(scope, elm, attr, ctrl) {
					ajaxCache('/house/queryBuildHouseRel/').then(function(data) {
						var houses = angular.copy(data.obj);
						var options = attr.ngOptions.match(RegOpt)[1]
						$parse(options).assign(scope, houses)
					})
				}
			}
		};
	}
]);
//select设置：hbms获取设计师
MetronicApp.directive('designers', [
	'ajaxCache',
	'$parse',
	'$cacheFactory',
	function(ajaxCache, $parse, $cacheFactory) {
		return {
			require: 'ngModel',
			restrict: 'A',
			priority: 10,
			compile: function compile(tElement, tAttrs, transclude) {
				if (!tAttrs.ngOptions) {
					tAttrs.ngOptions = 'm.userId as m.userName for m in designers'
				}
				return function(scope, elm, attr, ctrl) {
					ajaxCache('/hbms/people/getPeople/', {userType: '0'}).then(function(data) {
						var houses = angular.copy(data.obj.list);
						var options = attr.ngOptions.match(RegOpt)[1]
						$parse(options).assign(scope, houses)
					})
				}
			}
		};
	}
]);
//select设置：hbms获取监理
MetronicApp.directive('surveyors', [
	'ajaxCache',
	'$parse',
	'$cacheFactory',
	function(ajaxCache, $parse, $cacheFactory) {
		return {
			require: 'ngModel',
			restrict: 'A',
			priority: 10,
			compile: function compile(tElement, tAttrs, transclude) {
				if (!tAttrs.ngOptions) {
					tAttrs.ngOptions = 'm.userId as m.userName for m in surveyors'
				}
				return function(scope, elm, attr, ctrl) {
					ajaxCache('/hbms/people/getPeople/', {userType: '1'}).then(function(data) {
						var houses = angular.copy(data.obj.list);
						var options = attr.ngOptions.match(RegOpt)[1]
						$parse(options).assign(scope, houses)
					})
				}
			}
		};
	}
]);
//select设置：hbms获取装修公司
MetronicApp.directive('companys', [
	'ajaxCache',
	'$parse',
	'$cacheFactory',
	function(ajaxCache, $parse, $cacheFactory) {
		return {
			require: 'ngModel',
			restrict: 'A',
			priority: 10,
			compile: function compile(tElement, tAttrs, transclude) {
				if (!tAttrs.ngOptions) {
					tAttrs.ngOptions = 'm.userId as m.userName for m in companys'
				}
				return function(scope, elm, attr, ctrl) {
					ajaxCache('/hbms/people/getPeople/', {userType: '2'}).then(function(data) {
						var houses = angular.copy(data.obj.list);
						var options = attr.ngOptions.match(RegOpt)[1]
						$parse(options).assign(scope, houses)
					})
				}
			}
		};
	}
]);
//select设置：hbms获取项目经理
MetronicApp.directive('managers', [
	'ajaxCache',
	'$parse',
	'$cacheFactory',
	function(ajaxCache, $parse, $cacheFactory) {
		return {
			require: 'ngModel',
			restrict: 'A',
			priority: 10,
			compile: function compile(tElement, tAttrs, transclude) {
				if (!tAttrs.ngOptions) {
					tAttrs.ngOptions = 'm.userId as m.userName for m in managers'
				}
				return function(scope, elm, attr, ctrl) {
					ajaxCache('/hbms/people/getPeople/', {userType: '3'}).then(function(data) {
						var houses = angular.copy(data.obj);
						var options = attr.ngOptions.match(RegOpt)[1]
						$parse(options).assign(scope, houses)
					})
				}
			}
		};
	}
]);
//select设置：从后台获取支付方式
MetronicApp.directive('payTypes', [
	'ajaxCache',
	'$parse',
	function(ajaxCache, $parse) {
		return {
			require: 'ngModel',
			restrict: 'A',
			compile: function compile(tElement, tAttrs, transclude) {
				if (!tAttrs.ngOptions) {
					tAttrs.ngOptions = 'payType.id as payType.name for payType in payTypes'
				}
				return function(scope, elm, attr, ctrl) {
					ajaxCache('/configitem/queryItemsByConfigId/3/').then(function(data) {
						var payTypes = angular.copy(data.obj);
						var options = attr.ngOptions.match(RegOpt)[1]
						$parse(options).assign(scope, payTypes)
					})
				}
			}
		};
	}
]);
//select设置：从后台获取公司员工信息
//employees="self"，则自动设置为当前登录ＩＤ
MetronicApp.directive('employees', [
	'ajax1',
	'$parse',
	function(ajax1, $parse) {
		var employees = []
		var q = ajax1('/admin/queryEmployee/').then(function(data) {
			employees = data.obj;
		})
		return {
			require: 'ngModel',
			restrict: 'A',
			priority: 5,
			link: function(scope, elm, attr, ctrl) {
				if (employees.length) {
					setList()
				} else {
					q.then(function() {
						setList()
					})
				}
				function setList() {
					var options = attr.ngOptions.match(RegOpt)[1]
					$parse(options).assign(scope, employees)
					if (attr.employees === 'self') {
						var a = JSON.parse(window.localStorage.Userdata);
						ctrl.$setViewValue(a.userId)
						ctrl.$render();
					}
				}
			}
		};
	}
]);
// select设置：从后台获取省市
// 在省份下拉框添加provinces指令，在城市下拉框添加cities指令
// 可根据楼盘自动填充地址，在楼盘下拉框添加change-building指令
MetronicApp.directive('provinces', [
	'ajax1',
	'$parse',
	function(ajax1, $parse) {
		var provices = []
		var q = ajax1('/building/queryProvice/').then(function(data) {
			provices = data.obj;
		})
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elm, attr, ctrl) {
				var options_provinces = attr.ngOptions.match(RegOpt)[1]
				var options_cities = $('[cities]').attr('ng-options').match(RegOpt)[1]
				var options_areas = $('[areas]').attr('ng-options').match(RegOpt)[1]
				var model_cities = $('[cities]').attr('ng-model')
				var model_areas = $('[areas]').attr('ng-model')
				if (provices.length) {
					$parse(options_provinces).assign(scope, provices)
				} else {
					q.then(function() {
						$parse(options_provinces).assign(scope, provices)
					})
				}
				scope.$watch(attr.ngModel, function(e) {
					if (!ctrl.$viewValue) {
						$parse(options_cities).assign(scope, null)
						$parse(options_areas).assign(scope, null)
						$parse(model_cities).assign(scope, null)
						$parse(model_areas).assign(scope, null)
						return
					}
					q.then(function() {
						var proviceSel = provices.filter(function(e) {
							return parseInt(e.provinceId) === parseInt(ctrl.$viewValue)
						})[0]
						$parse(options_cities).assign(scope, proviceSel.cityList)
						$parse(options_areas).assign(scope, null)
					})
				});
			}
		};
	}
]);
MetronicApp.directive('cities', [
	'ajax1',
	'$parse',
	function(ajax1, $parse) {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elm, attr, ctrl) {
				scope.$watch(attr.ngModel, function(e) {
					var options_areas = $('[areas]').attr('ng-options').match(RegOpt)[1]
					var model_areas = $('[areas]').attr('ng-model')
					if (!ctrl.$viewValue) {
						$parse(options_areas).assign(scope, null)
						$parse(model_areas).assign(scope, null)
						return
					}
					scope.$broadcast('getAreas', ctrl.$viewValue)
				});
			}
		};
	}
]);
MetronicApp.directive('areas', [
	'ajax1',
	'$parse',
	function(ajax1, $parse) {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elm, attr, ctrl) {
				scope.$on('getAreas', function(e, cityId) {
					var areas = []
					var q = ajax1('/building/queryDistrict/' + cityId + '/').then(function(data) {
						areas = data.obj;
						var options = attr.ngOptions.match(RegOpt)[1]
						$parse(options).assign(scope, areas)
					})
				})
			}
		};
	}
]);
MetronicApp.directive('changeBuilding', [
	'ajax1',
	'$parse',
	function(ajax1, $parse) {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elm, attr, ctrl) {
				scope.$watch(attr.ngModel, function() {
					if (!ctrl.$viewValue) {
						return
					}
					ajax1('/building/queryById/' + ctrl.$viewValue + '/').then(function(data) {
						if (!data.obj.buildingAddress) {
							return
						}
						var address = data.obj.buildingAddress.split('-')
						var modelName = $('[provinces]').attr('ng-model')
						if (modelName) {
							var m = $parse(modelName)(scope)
							// if (m === undefined || m === null || m === '') {
							$parse(modelName).assign(scope, parseInt(address[0]))
							// }
						}
						modelName = $('[cities]').attr('ng-model')
						if (modelName) {
							var m = $parse(modelName)(scope)
							// if (m === undefined || m === null || m === '') {
							$parse(modelName).assign(scope, parseInt(address[1]))
							// }
						}
						modelName = $('[areas]').attr('ng-model')
						if (modelName) {
							var m = $parse(modelName)(scope)
							// if (m === undefined || m === null || m === '') {
							$parse(modelName).assign(scope, parseInt(address[2]))
							// }
						}
					})
				})
			}
		};
	}
]);
MetronicApp.directive('addASpaceBetween', [function() {
		'use strict';
		return function(scope, element) {
			if (!scope.$last) {
				element.after('&#32;');
			}
		}
	}
]);
//增加该按键的权限控制
MetronicApp.directive('buttonSteer', [
	'$rootScope',
	'$location',
	function($rootScope, $location) {
		return {
			restrict: 'A',
			link: function(scope, elm, attr, ctrl) {
				if (!$rootScope.curPage.curMenuId) {
					return
				}
				if ($rootScope.curPage.buttonStatusPromise) {
					$rootScope.curPage.buttonStatusPromise.then(function() {
						var buttonName = $(elm).text();
						for (var i = 0; i < $rootScope.curPage.buttonStatus.length; i++) {
							if (buttonName.trim() === $rootScope.curPage.buttonStatus[i].businessName.trim()) {
								if (!$rootScope.curPage.buttonStatus[i].selected) {
									$(elm).remove();
								}
							}
						}
					});
				}
			}
		};
	}
]);
//label标签添加红色星号
MetronicApp.directive('starRequired', function() {
	return {
		restrict: 'A',
		link: function(scope, elm, attr, ctrl) {
			$(elm).prepend('<span class="required"> * </span>');
		}
	};
});
MetronicApp.directive('starRequired1', [
	'$compile',
	function($compile) {
		return {
			restrict: 'A',
			link: function(scope, elm, attr, ctrl) {
				var star = $('<span class="required" ng-if="n.isCheck"> * </span>')
				$(elm).prepend($compile(star)(scope));
			}
		};
	}
]);
//将select改为select2，自动lazyload select2插件
MetronicApp.directive('select2', [
	'$ocLazyLoad',
	function($ocLazyLoad) {
		var isloaded = $ocLazyLoad.load({
			insertBefore: '#ng_load_plugins_before',
			files: ['assets/global/plugins/select2/select2.css', 'assets/global/plugins/select2/select2.js']
		});
		return {
			require: '?ngModel',
			restrict: 'A',
			priority: 5,
			compile: function compile(tElement, tAttrs, transclude) {
				if (!tElement.children().length) {
					tElement.prepend('<option value=""></option>')
				}
				tElement.attr('data-placeholder', "请选择")
				return function(scope, elm, attr, ctrl) {
					isloaded.then(function(data) {
						linkFn()
					})
					function linkFn() {
						if ($(elm).prop('tagName') === 'SELECT') {
							if (attr.select2) {
								$(attr.select2).on('change', function() {
									ctrl.$setViewValue('');
									setSelect2()
								})
							} else {
								setSelect2()
							}
						}
						function setSelect2() {
							if (attr.ngOptions) {
								var options = attr.ngOptions.match(RegOpt)[1]
								scope.$watch(options, function(newValue, oldValue) {
									if (newValue) {
										initSel2()
									}
								})
							} else {
								initSel2()
							}
						}
						function initSel2() {
							if ($(elm).attr('multiple')) {
								//多选初始化
								$(elm).select2({allowClear: true})
								return
							} else {
								//单选初始化
								$(elm).select2({searchInputPlaceholder: "输入搜索...", allowClear: true})
							}
						}
						scope.$watch(attr.ngModel, function(newValue, oldValue) {
							if (typeof $.fn.select2 === 'undefined') {
								return
							}
							//ctrl.$viewValue为数字0时，是有用的，不能置空
							if (!ctrl || ctrl.$viewValue === null || ctrl.$viewValue === undefined) {
								$(elm).select2('val', '');
								return
							}
							initSel2()
						});
					}
				}
			}
		};
	}
]);
//input框检测输入百分比的位数和正确性
MetronicApp.directive('percentDefault', function() {
	return {
		require: '?ngModel',
		restrict: 'A',
		link: function(scope, elm, attrs, ctrl) {
			angular.element(elm).on("blur", function() {
				var a = parseFloat(this.value)
				if (a !== a) {
					ctrl.$setViewValue(attrs.percentDefault);
					this.value = attrs.percentDefault;
					return false;
				}
				if (a < 0) {
					ctrl.$setViewValue('0.0');
					this.value = '0.0';
					return false;
				}
				if (a > 100) {
					ctrl.$setViewValue('100.0');
					this.value = '100.0';
					return false;
				}
				ctrl.$setViewValue(a.toFixed(1));
				this.value = a.toFixed(1)
				return false;
			});
		}
	};
});
//input框将全角数字改为半角数字
MetronicApp.directive('toNumber', function() {
	return {
		require: 'ngModel',
		restrict: 'A',
		link: function(scope, elm, attrs, ctrl) {
			ctrl.$parsers.push(function(value) {
				if (value) {
					value = value.replace(/０/g, '0')
					value = value.replace(/１/g, '1')
					value = value.replace(/２/g, '2')
					value = value.replace(/３/g, '3')
					value = value.replace(/４/g, '4')
					value = value.replace(/５/g, '5')
					value = value.replace(/６/g, '6')
					value = value.replace(/７/g, '7')
					value = value.replace(/８/g, '8')
					value = value.replace(/９/g, '9')
					ctrl.$viewValue = value;
					ctrl.$render();
				}
				return value
			})
		}
	};
});
//textarea文本框下实时更新剩余字数
MetronicApp.directive('maxWords', function() {
	return {
		restrict: 'A',
		link: function(scope, elm, attrs, ctrl) {
			scope.$watch(attrs.ngModel, function(v) {
				elm.siblings().children('span').text('还可以输入 ' + (parseInt(attrs.maxWords) - elm.val().length) + ' 字')
			});
		}
	};
});
//显示隐藏form的按钮
MetronicApp.directive('rangeShowArrow', function() {
	return {
		restrict: 'E',
		scope: {
			rangeArea: '@'
		},
		templateUrl: 'tpl/rangeShowArrow.html',
		link: function(scope, elem, attrs) {
			scope.rangeShow = true;
			scope.changeRangeShow = function() {
				scope.rangeShow = !scope.rangeShow;
				if (scope.rangeShow) {
					$(rangeArea).slideDown();
				} else {
					$(rangeArea).slideUp();
				}
			}
		}
	};
});
//searchCache用于标记该输入框需要被记忆，以及页面跳转时从缓存中提取数据
//searchCache标记的元素上要有唯一的name属性
//searchCacheButton一般放置在搜索按钮上，用于保存被标记的输入框的状态
//如果使用dataTable factory，还需要在conditions中绑定搜索条件
MetronicApp.directive('searchCache', [
	'$rootScope',
	'$parse',
	'$cacheFactory',
	'ajaxCache',
	function($rootScope, $parse, $cacheFactory, ajaxCache) {
		if (!$cacheFactory.get('searchCacheButton'))
			$cacheFactory('searchCacheButton')
		var newState,
			oldState,
			pageName = $rootScope.$state.current.name
		$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
			oldState = from
			newState = to
		});
		return {
			restrict: 'A',
			require: '?ngModel',
			priority: 10,
			link: function(scope, elem, attrs, ctrl) {
				//如果没有name属性，则默认为ngmodel的最后对象名
				if (!attrs.name) {
					var model = elem.attr('ng-model')
					var a = /[^.]+$/.exec(model)
					attrs.name = a[0]
					elem.attr('name', a[0])
				}
				ajaxCache('/resource/init/', {roleCode: 0}).then(function(data) {
					if (!newState)
						return
					var newUrl = newState.url.match(/[^#/]+/)
					var oldUrl = oldState.url.match(/[^#/]+/)
					var cache = $cacheFactory.get('searchCacheButton')
					var search = cache.get(pageName)
					if (newUrl.length && oldUrl.length) {
						var newUrlRes = getRes(data.obj, newUrl[0])
						if (newUrlRes && newUrlRes.url) {
							var oldUrlRes = newUrlRes.childList.filter(function(e) {
								var u = e.url.match(/[^#/]+/)
								if (u && u.length)
									return u[0] === oldUrl[0]
							})
							if (oldUrlRes.length) {
								if (search) {
									ctrl.$setViewValue(search[attrs.name])
									// search[attrs.name]=''
									ctrl.$render();
									return
								}
							}
						}
					}
					cache.put(pageName, search)
				})
				function getRes(obj, url) {
					var a = /[^#/]+/.exec(obj.url)
					if ((a && a[0]) === url)
						return obj
					for (var i = 0; i < (obj.childList && obj.childList.length); i++) {
						var b = getRes(obj.childList[i], url)
						if (b)
							return b
					}
				}
			}
		};
	}
]);
MetronicApp.directive('searchCacheButton', [
	'$parse',
	'$rootScope',
	'$cacheFactory',
	function($parse, $rootScope, $cacheFactory) {
		if (!$cacheFactory.get('searchCacheButton'))
			$cacheFactory('searchCacheButton')
		var cache = $cacheFactory.get('searchCacheButton'),
			pageName = $rootScope.$state.current.name
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				$(elem).click(function() {
					var searchCache = {}
					$('[search-cache]').each(function(i, e) {
						searchCache[$(e).attr('name')] = $parse($(e).attr('ng-model'))(scope)
					})
					cache.put(pageName, searchCache)
				})
			}
		};
	}
]);
MetronicApp.directive('searchCacheBtn', [
	'$parse',
	'$rootScope',
	function($parse, $rootScope) {
		var newState,
			oldState;
		$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
			newState = to;
			oldState = from;
		})
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				var pageName = $rootScope.$state.current.name.replace(/([\-]+(.))/g, function(match, separator, letter, offset) {
					return offset
						? letter.toUpperCase()
						: letter
				});
				if (newState && oldState) {
					var detailReg = /^\/(?:(?:edit|view)-)/, //匹配详情新增/^\/(?:(?:edit|view)-)?/
						newUrl,
						oldUrl;
					newUrl = newState.url.substr(1).replace(/(ies|s)$/, function($1) {
						return $1 == 'ies'
							? 'y'
							: '';
					})
					if (detailReg.test(oldState.url)) {
						oldUrl = oldState.url.replace(detailReg, '').match(/.*(?=-)/);
						if (oldUrl && oldUrl[0] && newUrl == oldUrl[0]) {
							scope[pageName] = window[pageName + 'Condition'];
						}
					}
				}
				$(elem).click(function() {
					window[pageName + 'Condition'] = scope[pageName];
				})
			}
		}
	}
]);
//可以接收clearModel事件来清空model
//clearModelClick用于“清空”按键
//clearModel用于被清空的input和select
MetronicApp.directive('clearModel', [
	'$timeout',
	function($timeout) {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, elem, attrs, ctrl) {
				scope.$on('clearModel', function() {
					ctrl.$setViewValue('');
					ctrl.$setPristine()
					ctrl.$render();
					ctrl.$dirty = false
					$timeout(function() {
						scope.$apply()
					}, 0)
				})
			}
		};
	}
]);
MetronicApp.directive('clearModelClick', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs, ctrl) {
			elem.click(function() {
				// scope.$apply(function() {
				scope.$broadcast('clearModel')
				// })
			})
		}
	};
});
//增加img点击功能，点击后在新tab页显示原图
MetronicApp.directive('imgOrigin', function() {
	return {
		restrict: 'A',
		scope: {
			ngSrc: '@'
		},
		link: function(scope, elem, attrs) {
			elem.on('load', function() {
				var origin = scope.ngSrc.match(/(http.+)(\?imageView).+/)
				origin && elem.wrap('<a href="' + origin[1] + '" target="_blank"></a>');
			})
		}
	};
});
//错误信息提示指令
//1.使用<ng-form>指令，必须有name attribute
//2.设置被观察指令 <... ng-required="true" input-error />
//3.设置触发按钮 <... validate-all /> 验证成功后才会调用ngClick
//4.设置检查函数 <... input-test="isMobilePhoneNum"> 在ValidateFn中有统一定义
MetronicApp.directive('inputError', [
	'$compile',
	'$parse',
	function($compile, $parse) {
		return {
			restrict: 'A',
			require: 'ngModel',
			compile: function compile(tElement, tAttrs, transclude) {
				var name = tElement.attr('name');
				if (typeof name === typeof undefined || name === false) {
					var model = tElement.attr('ng-model')
					var a = /[^.]+$/.exec(model)
					if (angular.isArray(a) && a.length > 0) {
						tElement.attr('name', a[0])
						tAttrs.name = a[0]
					}
				}
				return function(scope, elem, attrs, ngModel) {
					// if (attrs.ngRequired) {
					//     if ($parse(attrs.ngRequired)(scope) === false) {
					//         return
					//     }
					// }
					// if (attrs.inputError) {
					//     if ($parse(attrs.inputError)(scope) === false) {
					//         return
					//     }
					// }
					var subScope = scope.$new(true)
					subScope.hasError = function() {
						if (ngModel.$invalid && ngModel.$dirty) {
							elem.closest('[class^="col-md"]').addClass('has-error')
						} else {
							elem.closest('[class^="col-md"]').removeClass('has-error')
						}
						return ngModel.$invalid && ngModel.$dirty
					}
					subScope.errors = function() {
						return ngModel.$error
					}
					var hint = $compile('<ul class="help-block" ng-if="hasError()" style="list-style: none;padding-left: 0;">' +
					'<li ng-repeat="(name,wrong) in errors()" ng-if="wrong">{{name | error}}</li></ul>')(subScope)
					if (elem.attr('id') === 'lofts_purchase_new') {
						elem.closest('[class^="col-md"]').append(hint)
					} else if (elem.attr('type') === 'file') {
						elem.closest('.fileinput').append(hint)
					} else {
						elem.closest('[class^="col-md"]').append(hint)
					}
					scope.$on('makeAllDirty', function() {
						ngModel.$dirty = true
					})
				}
			}
		};
	}
]);
MetronicApp.directive('validateAll', [
	'$timeout',
	function($timeout) {
		return {
			restrict: 'A', priority: 1, terminal: true,
			// scope: true,
			link: function(scope, elem, attrs, ctrl) {
				elem.click(function(e) {
					scope.$apply(function() {
						scope.$broadcast('makeAllDirty')
					})
					var invalid = Array.prototype.some.call($('ng-form[name]'), function(e) {
						return scope[$(e).attr('name')] && scope[$(e).attr('name')].$invalid
					})
					if (invalid) {
						$timeout(function() {
							Metronic.scrollTo($('.has-error'));
						})
						return
					} else {
						scope.$eval(attrs.ngClick)
					}
				})
			}
		};
	}
]);
MetronicApp.directive('inputTest', [
	'$compile',
	'$parse',
	'ValidateFn',
	function($compile, $parse, ValidateFn) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elem, attrs, ngModel) {
				if (attrs.ngRequired) {
					if ($parse(attrs.ngRequired)(scope) === false) {
						return
					}
				}
				// 1.2
				ngModel.$parsers.push(function(value) {
					ngModel.$setValidity(attrs.inputTest, ValidateFn(attrs.inputTest, value, scope))
					return ValidateFn(attrs.inputTest, value, scope)
						? value
						: undefined
				})
				scope.$watch(attrs.ngModel, function() {
					if (undefined != ngModel.$viewValue) {
						if (!ValidateFn(attrs.inputTest, ngModel.$viewValue, scope)) {
							ngModel.$setValidity(attrs.inputTest, ValidateFn(attrs.inputTest, ngModel.$viewValue, scope))
						}
					}
				})
				// 1.3
				// ngModel.$parsers.push(function(value) {
				//     return ValidateFn(attrs.inputTest, value, scope) ? value : undefined
				// })
				// ngModel.$validators[attrs.inputTest]=
				// scope.$watch(attrs.ngModel, function() {
				//     ngModel.$setValidity(attrs.inputTest, ValidateFn(attrs.inputTest, ngModel.$viewValue, scope))
				// })
			}
		};
	}
]);
MetronicApp.directive('inputTest2', [
	'$compile',
	'$parse',
	'ValidateFn',
	function($compile, $parse, ValidateFn) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elem, attrs, ngModel) {
				if (attrs.ngRequired) {
					if ($parse(attrs.ngRequired)(scope) === false) {
						return
					}
				}
				// 1.2
				ngModel.$parsers.push(function(value) {
					ngModel.$setValidity(attrs.inputTest2, ValidateFn(attrs.inputTest2, value, scope))
					return ValidateFn(attrs.inputTest2, value, scope)
						? value
						: undefined
				})
				scope.$watch(attrs.ngModel, function() {
					if (undefined != ngModel.$viewValue) {
						if (!ValidateFn(attrs.inputTest2, ngModel.$viewValue, scope)) {
							ngModel.$setValidity(attrs.inputTest2, !ValidateFn(attrs.inputTest2, ngModel.$viewValue, scope))
						}
					}
				})
				// 1.3
				// ngModel.$parsers.push(function(value) {
				//     return ValidateFn(attrs.inputTest, value, scope) ? value : undefined
				// })
				// ngModel.$validators[attrs.inputTest]=
				// scope.$watch(attrs.ngModel, function() {
				//     ngModel.$setValidity(attrs.inputTest, ValidateFn(attrs.inputTest, ngModel.$viewValue, scope))
				// })
			}
		};
	}
]);
MetronicApp.directive('ngFileDirty', function() {
	return {
		// require: '^form',
		require: 'ngModel',
		transclude: true,
		link: function($scope, elm, attrs, ctrl) {
			elm.on('change', function(e) {
				var value = elm.val()
				value
					? ctrl.$setViewValue(value)
					: ctrl.$setViewValue('')
				$scope.$apply();
			});
		}
	}
})
//数字验证
MetronicApp.directive('numberVal', [
	'$compile',
	function($compile) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elem, attrs, ngModel) {
				var isNum = function(value) {
					if (!value) {
						return true
					}
					var num = /^\d+\.?\d*$/g;
					return num.test(value)
				}
				ngModel.$parsers.push(function(value) {
					ngModel.$setValidity('number', isNum(value))
					return isNum(value)
						? value
						: undefined
				})
				scope.$watch(attrs.ngModel, function() {
					ngModel.$setValidity('number', isNum(ngModel.$viewValue))
				})
			}
		};
	}
]);
MetronicApp.directive('ngMin', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elem, attr, ctrl) {
			scope.$watch(attr.ngMin, function() {
				if (ctrl.$isDirty)
					ctrl.$setViewValue(ctrl.$viewValue);
				}
			);
			var isEmpty = function(value) {
				return angular.isUndefined(value) || value === "" || value === null;
			}
			var minValidator = function(value) {
				var min = scope.$eval(attr.ngMin) || 0;
				if (!isEmpty(value) && value < min) {
					ctrl.$setValidity('ngMin', false);
					return undefined;
				} else {
					ctrl.$setValidity('ngMin', true);
					return value;
				}
			};
			ctrl.$parsers.push(minValidator);
			ctrl.$formatters.push(minValidator);
		}
	};
});
MetronicApp.directive('ngMax', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elem, attr, ctrl) {
			scope.$watch(attr.ngMax, function() {
				if (ctrl.$isDirty)
					ctrl.$setViewValue(ctrl.$viewValue);
				}
			);
			var isEmpty = function(value) {
				return angular.isUndefined(value) || value === "" || value === null;
			}
			var maxValidator = function(value) {
				var max = scope.$eval(attr.ngMax) || Infinity;
				if (!isEmpty(value) && value > max) {
					ctrl.$setValidity('ngMax', false);
					return undefined;
				} else {
					ctrl.$setValidity('ngMax', true);
					return value;
				}
			};
			ctrl.$parsers.push(maxValidator);
			ctrl.$formatters.push(maxValidator);
		}
	};
});
//金额验证
MetronicApp.directive('rmbVal', [
	'$compile',
	function($compile) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elem, attrs, ngModel) {
				var isRmb = function(value) {
					if (!value) {
						return true
					}
					var rmb = /^\d+\.?\d*$/g;
					return rmb.test(value)
				}
				ngModel.$parsers.push(function(value) {
					ngModel.$setValidity('rmb', isRmb(value))
					return isRmb(value)
						? value
						: undefined
				})
				scope.$watch(attrs.ngModel, function() {
					ngModel.$setValidity('rmb', isRmb(ngModel.$viewValue))
				})
			}
		};
	}
]);
//pos验证
MetronicApp.directive('isPos', [
	'$compile',
	function($compile) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elem, attrs, ngModel) {
				var isRmb = function(value) {
					if (!value) {
						return true
					}
					var rmb = /^\d{12,12}$/g;
					return rmb.test(value)
				}
				ngModel.$parsers.push(function(value) {
					ngModel.$setValidity('请输入正确的交易参考号', isRmb(value))
					return isRmb(value)
						? value
						: undefined
				})
				scope.$watch(attrs.ngModel, function() {
					ngModel.$setValidity('请输入正确的交易参考号', isRmb(ngModel.$viewValue))
				})
			}
		};
	}
]);
//电话号码验证
MetronicApp.directive('isPhonenum', [
	'$compile',
	'$parse',
	function($compile, $parse) {
		return {
			restrict: 'A', require: 'ngModel',
			// priority: 5,
			link: function(scope, elem, attrs, ngModel) {
				if (attrs.ngRequired) {
					if ($parse(attrs.ngRequired)(scope) === false) {
						return
					}
				}
				var isPhonenum = function(value) {
					if (!value) {
						return true
					}
					var length = value.length;
					var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
					var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
					return tel.test(value) || (length == 11 && mobile.test(value));
				}
				ngModel.$parsers.push(function(value) {
					ngModel.$setValidity('phonenum', isPhonenum(value))
					return isPhonenum(value)
						? value
						: undefined
				})
				scope.$watch(attrs.ngModel, function() {
					ngModel.$setValidity('phonenum', isPhonenum(ngModel.$viewValue))
				})
			}
		};
	}
]);
//dataTable with tab
MetronicApp.directive('tableTab', [
	'dataTable',
	'$timeout',
	'queryFilter',
	'$compile',
	'userNow',
	function(dataTable, $timeout, queryFilter, $compile, userNow) {
		return {
			restrict: 'E', templateUrl: 'tpl/tableTab.html',
			// require: 'ngModel',
			scope: {
				tableParams: '=',
				tables: '=',
				tabIndex: '=',
				companyCond: '=',
				searchScope: '=',
				hideTab: '@'
			},
			link: function(scope, elem, attrs) {
				var tableParams = scope.tableParams
					var table0,
						table1,
						table2,
						table3
					var company = queryFilter('/company/queryAllCompany/')
					$timeout(function() {
						switch (userNow.companyCode) {
							case '7':
							case '8':
								scope.click1();
								elem.find('li:eq(1)').addClass('active');
								elem.children('div:eq(1)').removeClass('table-not-show');
								elem.children('div:eq(0)').addClass('table-not-show');
								elem.children('div:eq(2)').addClass('table-not-show');
								elem.children('div:eq(3)').addClass('table-not-show');
								break;
							case '9':
								scope.click2();
								elem.find('li:eq(2)').addClass('active');
								elem.children('div:eq(2)').removeClass('table-not-show');
								elem.children('div:eq(1)').addClass('table-not-show');
								elem.children('div:eq(0)').addClass('table-not-show');
								elem.children('div:eq(3)').addClass('table-not-show');
								break;
							case '10':
								scope.click3();
								elem.find('li:eq(3)').addClass('active');
								elem.children('div:eq(3)').removeClass('table-not-show');
								elem.children('div:eq(1)').addClass('table-not-show');
								elem.children('div:eq(2)').addClass('table-not-show');
								elem.children('div:eq(0)').addClass('table-not-show');
								break;
						}
					})
					scope.click0 = function() {
						scope.tabIndex = 0
						if (!table0) {
							tableParams.id = '#sample_0'
							if (attrs.companyCond) {
								tableParams.conditionsBig = scope.companyCond[0]
							} else {
								tableParams.conditionsBig = {}
							}
							tableParams.conditions = attrs.searchScope
								? scope.searchScope
								: scope.$parent.searchDetail;
							scope.tables[0] = table0 = dataTable.new(tableParams, scope)
						} else {
							table0.tableSearch(attrs.searchScope
								? scope.searchScope
								: scope.$parent.searchDetail)
						}
						elem.children('div:eq(0)').removeClass('table-not-show')
						elem.children('div:eq(1)').addClass('table-not-show')
						elem.children('div:eq(2)').addClass('table-not-show')
						elem.children('div:eq(3)').addClass('table-not-show')
					}
					scope.click1 = function() {
						scope.tabIndex = 1
						if (!table1) {
							tableParams.id = '#sample_1'
							if (attrs.companyCond) {
								tableParams.conditionsBig = scope.companyCond[1]
							} else {
								tableParams.conditionsBig = {
									city: 8,
									companyCode: 8,
									roleCode: 8
								}
							}
							tableParams.conditions = attrs.searchScope
								? scope.searchScope
								: scope.$parent.searchDetail;
							scope.tables[1] = table1 = dataTable.new(tableParams, scope);
						} else {
							table1.tableSearch(attrs.searchScope
								? scope.searchScope
								: scope.$parent.searchDetail)
						}
						elem.children('div:eq(1)').removeClass('table-not-show')
						elem.children('div:eq(0)').addClass('table-not-show')
						elem.children('div:eq(2)').addClass('table-not-show')
						elem.children('div:eq(3)').addClass('table-not-show')
					}
					scope.click2 = function() {
						scope.tabIndex = 2
						if (!table2) {
							tableParams.id = '#sample_2'
							if (attrs.companyCond) {
								tableParams.conditionsBig = scope.companyCond[2]
							} else {
								tableParams.conditionsBig = {
									city: 9,
									companyCode: 9,
									roleCode: 9
								}
							}
							tableParams.conditions = attrs.searchScope
								? scope.searchScope
								: scope.$parent.searchDetail;
							scope.tables[2] = table2 = dataTable.new(tableParams, scope)
						} else {
							table2.tableSearch(attrs.searchScope
								? scope.searchScope
								: scope.$parent.searchDetail)
						}
						elem.children('div:eq(2)').removeClass('table-not-show')
						elem.children('div:eq(1)').addClass('table-not-show')
						elem.children('div:eq(0)').addClass('table-not-show')
						elem.children('div:eq(3)').addClass('table-not-show')
					}
					scope.click3 = function() {
						scope.tabIndex = 3
						if (!table3) {
							tableParams.id = '#sample_3'
							if (attrs.companyCond) {
								tableParams.conditionsBig = scope.companyCond[3]
							} else {
								tableParams.conditionsBig = {
									city: 10,
									companyCode: 10,
									roleCode: 10
								}
							}
							tableParams.conditions = attrs.searchScope
								? scope.searchScope
								: scope.$parent.searchDetail;
							scope.tables[3] = table3 = dataTable.new(tableParams, scope)
						} else {
							table3.tableSearch(attrs.searchScope
								? scope.searchScope
								: scope.$parent.searchDetail)
						}
						elem.children('div:eq(3)').removeClass('table-not-show')
						elem.children('div:eq(1)').addClass('table-not-show')
						elem.children('div:eq(2)').addClass('table-not-show')
						elem.children('div:eq(0)').addClass('table-not-show')
					}
				}
			};
		}
	]);
	//table
	MetronicApp.directive('tableFormat', [
		'ajax1',
		'$timeout',
		function(ajax1, $timeout) {
			return {
				restrict: 'A',
				// require: 'ngModel',
				scope: {
					conditions: '=',
					tableEdit: '&',
					tableUrl: '=',
					tableData: '&'
				},
				link: function(scope, elem, attrs) {
					var table = $('#' + attrs.id);
					var conditions = {}
					scope.$on('tableSearch', function(e, p) {
						scope.conditions = p
						table.DataTable().ajax.reload();
					})
					$timeout(function() {
						table.dataTable({
							"language": {
								"aria": {
									"sortAscending": ": activate to sort column ascending",
									"sortDescending": ": activate to sort column descending"
								},
								"paginate": {
									"previous": "Prev",
									"next": "Next"
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
							"pagingType": "bootstrap_full_number",
							"lengthChange": false,
							"stateSave": true,
							"filter": false,
							"serverSide": true,
							"ajax": function(data, callback, settings) {
								var a = JSON.parse(window.localStorage.Userdata);
								var params = {
									"pageNo": data.start / data.length + 1,
									"pageSize": data.length
								};
								// if (status) {
								//     conditions.orderStatus = status
								// }
								$.extend(params, scope.conditions);
								ajax1(scope.tableUrl, params).then(function(datas) {
									if (datas.code == 1) {
										var arr = [];
										$.each(datas.obj.list, function(i, n) {
											var temp = []
											temp = scope.tableData({data: n})
											// scope.tableList.forEach(function(e) {
											//     e ? temp.push(n[e]) : temp.push('')
											// })
											arr.push(temp);
										})
										var d = {
											data: arr,
											recordsTotal: datas.obj.totalRecords,
											recordsFiltered: datas.obj.totalRecords
										}
										callback(d);
										scope.tableEdit({
											data: {
												table: table
											}
										})
										elem.find('td').css('vertical-align', 'middle')
										elem.find('td').css('text-align', 'center')
										elem.find('th').css('vertical-align', 'middle')
										elem.find('th').css('text-align', 'center')
									}
								})
							}
						});
					})
				}
			};
		}
	]);
	//硬装中心工艺模板
	MetronicApp.directive('craftTemplate', [
		'$timeout',
		'ajax1',
		function($timeout, ajax1) {
			return {
				restrict: 'E',
				scope: {
					templateData: '='
				},
				templateUrl: 'tpl/craftTemplate.html',
				link: function(scope, elem, attrs, ctrl, transclude) {
					scope.nodeList = ['开工交底', '水电验收', '瓦木验收', '竣工验收'];
					//tab对应数据排序
					scope.templateData.nodeTemplateVoList.sort(function(a, b) {
						return a.id - b.id
					})
					//切换tab
					scope.clickTab = function(index) {
						scope.curIndex = index;
						scope.template = scope.templateData.nodeTemplateVoList[scope.curIndex];
						scope.template.craftTemplateVoList2 = angular.copy(scope.template.craftTemplateVoList);
						addBgColor();
					}
					scope.clickTab(0);
					function addBgColor() {
						$timeout(function() {
							scope.template.craftTemplateVoList.forEach(function(m, i) {
								elem.find('.tableright tr:eq(' + (i + 1) + ') td').removeClass('background_color')
								m.dateNumberList.forEach(function(n) {
									elem.find('.tableright tr:eq(' + (i + 1) + ') td:eq(' + (n - 1) + ')').addClass('background_color')
								})
							})
						})
					}
					//添加行
					scope.addRow = function() {
						var craftTemplateVoList = scope.template.craftTemplateVoList;
						var length = craftTemplateVoList.length;
						if (length > 0 && craftTemplateVoList[length - 1].name.trim() === '') {
							layer.msg('请输入工艺名称')
							return
						}
						if (length > 0 && craftTemplateVoList[length - 1].dateNumberList.length === 0) {
							layer.msg('请输入工艺天数')
							return
						}
						craftTemplateVoList.push({name: '', dateNumberList: []})
					}
					//删除行
					scope.delRow = function() {
						var craftTemplateVoList = scope.template.craftTemplateVoList;
						console.log('delRow', scope.template.id, craftTemplateVoList[craftTemplateVoList.length - 1].id, scope.templateData.groupId)
						ajax1('/hbms/project/deleteCraft/', {
							"nodeId": scope.template.id,
							"id": craftTemplateVoList[craftTemplateVoList.length - 1].id,
							"groupId": scope.templateData.groupId
						}).then(function(data) {
							scope.$parent.init();
						})
					}
					//打开应用楼盘弹窗
					scope.openApplyBuildingDialog = function() {
						scope.dialogVisible = true;
						//获取所有楼盘
						ajax1('/hbms/project/getCraftTemplateBuildingList/', {groupId: scope.templateData.groupId}).then(function(data) {
							scope.craftTemplateBuildingList = data.obj;
						})
					}
					//应用楼盘到模板
					scope.confirmApply = function() {
						console.log('confirmApply')
						var groupId = scope.templateData.groupId;
						var buildingIds = []
						elem.find('.building-list input:not([disabled]):checked').each(function(index, el) {
							buildingIds.push(el.value)
						});
						if (!groupId) {
							//新建模板
							ajax1('/hbms/project/createCraftTemplate/', {buildingIds: buildingIds}).then(function(data) {
								scope.$parent.init();
							})
						} else {
							//编辑模板
							var params = {
								id: groupId,
								buildingIds: buildingIds
							};
							ajax1('/hbms/project/editCraftTemplate/', params).then(function(data) {
								scope.$parent.init();
							})
						}
					}
				}
			}
		}
	]);
	//单元格点选
	MetronicApp.directive('tableCellDrag', [
		'$timeout',
		'$parse',
		'ajax1',
		'$q',
		function($timeout, $parse, ajax1, $q) {
			return {
				restrict: 'A',
				// require: 'ngModel',
				link: function(scope, elem, attrs, ngModel) {
					scope.days = new Array(90);
					scope.$watch('template.craftTemplateVoList.length', function() {
						$timeout(function() {
							var cell = elem.find('td'),
								cellTh = elem.find('th'),
								cellTr = elem.find('tr'),
								titleTable = $('table.tableleft'),
								isColored,
								startPoint,
								isClicked,
								mousedown,
								works_index;
							cell.unbind('mousedown').mousedown(function(e) {
								mousedown = true
								isClicked = true
								startPoint = $(e.target)
								works_index = $(e.target).closest('tr').index() - 1
								isColored = startPoint.hasClass('background_color')
									? true
									: false
								$(e.target).toggleClass('background_color')
								return false
							})
							cellTh.unbind('mouseenter').mouseenter(dragEnter)
							cell.unbind('mouseenter').mouseenter(dragEnter)
							cell.unbind('mouseup').mouseup(dragUp)
							elem.unbind('mouseleave').mouseleave(dragEnd);
							titleTable.unbind('mouseleave').mouseleave(changeTitle);
							function dragLeave() {
								if (confirm('是否要保存更改？')) {
									var p = []
									scope.template.craftTemplateVoList.forEach(function(n, i) {
										if (scope.template.craftTemplateVoList[i].id) {
											p[i] = ajax1('/hbms/project/editCraft/', {
												"nodeId": scope.template.id,
												"id": scope.template.craftTemplateVoList[i].id,
												"name": scope.template.craftTemplateVoList[i].name.trim(),
												"dateNumberList": scope.template.craftTemplateVoList[i].dateNumberList,
												"groupId": scope.templateData.groupId
											}).then(function(data) {})
										} else {
											p[i] = ajax1('/hbms/project/createCraft/', {
												"nodeId": scope.template.id,
												"name": scope.template.craftTemplateVoList[i].name.trim(),
												"dateNumberList": scope.template.craftTemplateVoList[i].dateNumberList,
												"sort": scope.template.craftTemplateVoList.length,
												"groupId": scope.templateData.groupId
											}).then(function(data) {})
										}
									})
									$q.all(p).then(function() {
										isClicked = false
										scope.$parent.init()
									})
								} else {
									// init()
									scope.$parent.init()
								}
							}
							function dragEnter(e) {
								if (mousedown) {
									if (isColored) {
										getTarget(startPoint, $(e.target)).removeClass('background_color')
									} else {
										getTarget(startPoint, $(e.target)).addClass('background_color')
									}
								}
							}
							function changeTitle() {
								if (isTitleChanged()) {
									dragLeave()
								}
							}
							function dragUp() {
								mousedown = false
								noBreak()
							}
							function dragEnd() {
								mousedown = false
								if (!isClicked) {
									return
								}
								noBreak()
								dragLeave()
								isClicked = false
							}
							function noBreak() {
								if (!isClicked)
									return
								if (!startPoint)
									return
								scope.template.craftTemplateVoList[works_index].dateNumberList = []
								var sel = startPoint.parent().children('td[class*="background_color"]')
								if (sel.length === 0)
									return
								var first = $(sel[0]).index()
								var last = $(sel[sel.length - 1]).index()
								for (var i = first; i <= last; i++) {
									startPoint.parent().children('td:eq(' + i + ')').addClass('background_color')
									scope.template.craftTemplateVoList[works_index].dateNumberList.push(i + 1)
								}
							}
							function getTarget(startPoint, nowPoint) {
								if (startPoint.parent()[0] === nowPoint.parent()[0]) {
									return nowPoint
								} else {
									return startPoint.parent().children('td:eq(' + nowPoint.index() + ')')
								}
							}
						});
					})
					function isTitleChanged() {
						return scope.template.craftTemplateVoList2.some(function(e, i) {
							return e.name !== scope.template.craftTemplateVoList[i].name
						})
					}
				}
			};
		}
	]);
	//单元格点选
	// MetronicApp.directive('tableCellDrag', [
	// 	'$timeout',
	// 	'$parse',
	// 	'ajax1',
	// 	'$q',
	// 	function($timeout, $parse, ajax1, $q) {
	// 		return {
	// 			restrict: 'A',
	// 			// require: 'ngModel',
	// 			link: function(scope, elem, attrs, ngModel) {
	// 				var work_days_num = 90
	// 				scope.days = new Array(work_days_num)
	// 				scope.$watch('index', function() {
	// 					init()
	// 				})
	// 				scope.$watch('template.craftTemplateVoList.length', function() {
	// 					$timeout(function() {
	// 						var cell = elem.find('td'),
	// 							cellTh = elem.find('th'),
	// 							cellTr = elem.find('tr'),
	// 							titleTable = $('table.tableleft'),
	// 							isColored,
	// 							startPoint,
	// 							isClicked,
	// 							mousedown,
	// 							works_index;
	// 						cell.unbind('mousedown').mousedown(function(e) {
	// 							mousedown = true
	// 							isClicked = true
	// 							startPoint = $(e.target)
	// 							works_index = $(e.target).closest('tr').index() - 1
	// 							isColored = startPoint.hasClass('background_color')
	// 								? true
	// 								: false
	// 							$(e.target).toggleClass('background_color')
	// 							return false
	// 						})
	// 						cellTh.unbind('mouseenter').mouseenter(dragEnter)
	// 						// elem.unbind('mouseleave').mouseleave(dragLeave)
	// 						cell.unbind('mouseenter').mouseenter(dragEnter)
	// 						cell.unbind('mouseup').mouseup(dragUp)
	// 						elem.unbind('mouseleave').mouseleave(dragEnd);
	// 						titleTable.unbind('mouseleave').mouseleave(changeTitle);
	// 						function dragLeave() {
	// 							// if (works_index === undefined) return
	// 							if (confirm('是否要保存更改？')) {
	// 								var p = []
	// 								scope.template.craftTemplateVoList.forEach(function(n, i) {
	// 									if (scope.template.craftTemplateVoList[i].id) {
	// 										p[i] = ajax1('/hbms/project/editCraft/', {
	// 											"nodeId": scope.allTemplates[scope.index].id,
	// 											"id": scope.template.craftTemplateVoList[i].id,
	// 											"name": scope.template.craftTemplateVoList[i].name.trim(),
	// 											"dateNumberList": scope.template.craftTemplateVoList[i].dateNumberList
	// 										}).then(function(data) {})
	// 									} else {
	// 										var sort = 0
	// 										scope.template.craftTemplateVoList.forEach(function(n) {
	// 											if (n.sort > sort) {
	// 												sort = n.sort
	// 											}
	// 										})
	// 										p[i] = ajax1('/hbms/project/createCraft/', {
	// 											"nodeId": scope.allTemplates[scope.index].id,
	// 											"name": scope.template.craftTemplateVoList[i].name.trim(),
	// 											"dateNumberList": scope.template.craftTemplateVoList[i].dateNumberList,
	// 											sort: sort + 1
	// 										}).then(function(data) {})
	// 									}
	// 								})
	// 								$q.all(p).then(function() {
	// 									isClicked = false
	// 									init()
	// 									// layer.msg('保存成功')
	// 								})
	// 							} else {
	// 								init()
	// 							}
	// 						}
	// 						function dragEnter(e) {
	// 							if (mousedown) {
	// 								if (isColored)
	// 									getTarget(startPoint, $(e.target)).removeClass('background_color')
	// 								else
	// 									getTarget(startPoint, $(e.target)).addClass('background_color')
	// 							}
	// 						}
	// 						function dragEnd() {
	// 							mousedown = false
	// 							if (!isClicked)
	// 								return
	// 							noBreak()
	// 							dragLeave()
	// 							isClicked = false
	// 						}
	// 						function changeTitle() {
	// 							if (isTitleChanged())
	// 								dragLeave()
	// 						}
	// 						function dragUp() {
	// 							mousedown = false
	// 							noBreak()
	// 						}
	// 						function noBreak() {
	// 							if (!isClicked)
	// 								return
	// 							if (!startPoint)
	// 								return
	// 							scope.template.craftTemplateVoList[works_index].dateNumberList = []
	// 							var sel = startPoint.parent().children('td[class*="background_color"]')
	// 							if (sel.length === 0)
	// 								return
	// 							var first = $(sel[0]).index()
	// 							var last = $(sel[sel.length - 1]).index()
	// 							for (var i = first; i <= last; i++) {
	// 								startPoint.parent().children('td:eq(' + i + ')').addClass('background_color')
	// 								scope.template.craftTemplateVoList[works_index].dateNumberList.push(i + 1)
	// 							}
	// 						}
	// 						function getTarget(startPoint, nowPoint) {
	// 							if (startPoint.parent()[0] === nowPoint.parent()[0]) {
	// 								return nowPoint
	// 							} else {
	// 								return startPoint.parent().children('td:eq(' + nowPoint.index() + ')')
	// 							}
	// 						}
	// 					})
	// 				})
	// 				scope.addRow = function() {
	// 					if (scope.template.craftTemplateVoList.length > 0 && scope.template.craftTemplateVoList[scope.template.craftTemplateVoList.length - 1].name.trim() === '') {
	// 						layer.msg('请输入工艺名称')
	// 						return
	// 					}
	// 					if (scope.template.craftTemplateVoList.length > 0 && scope.template.craftTemplateVoList[scope.template.craftTemplateVoList.length - 1].dateNumberList.length === 0) {
	// 						layer.msg('请输入工艺天数')
	// 						return
	// 					}
	// 					scope.template.craftTemplateVoList.push({name: '', dateNumberList: []})
	// 				}
	// 				scope.delRow = function() {
	// 					ajax1('/hbms/project/deleteCraft/', {
	// 						"nodeId": scope.allTemplates[scope.index].id,
	// 						"id": scope.template.craftTemplateVoList[scope.template.craftTemplateVoList.length - 1].id
	// 					}).then(function(data) {
	// 						init()
	// 					})
	// 				}
	// 				function isTitleChanged() {
	// 					return scope.template.craftTemplateVoList2.some(function(e, i) {
	// 						return e.name !== scope.template.craftTemplateVoList[i].name
	// 					})
	// 				}
	// 				function init() {
	// 					ajax1('/hbms/craft/getCraftTemplate/', {templateType: '1'}).then(function(data) {
	// 						scope.allTemplates = []
	// 						$.extend(scope.allTemplates, data.obj)
	// 						scope.allTemplates.sort(function(a, b) {
	// 							return a.id - b.id
	// 						})
	// 						scope.allTemplates.forEach(function(elm) {
	// 							if (!elm.craftTemplateVoList.length) {
	// 								elm.craftTemplateVoList = [
	// 									{
	// 										name: '',
	// 										dateNumberList: []
	// 									}
	// 								]
	// 							}
	// 						})
	// 						if (scope.index === undefined) {
	// 							scope.click0()
	// 						}
	// 						scope.template.craftTemplateVoList = scope.allTemplates[scope.index].craftTemplateVoList
	// 						scope.template.craftTemplateVoList2 = angular.copy(scope.template.craftTemplateVoList)
	// 						scope.template.craftTemplateVoList.forEach(function(m, i) {
	// 							elem.find('tr:eq(' + (i + 1) + ') td').removeClass('background_color')
	// 							m.dateNumberList.forEach(function(n) {
	// 								elem.find('tr:eq(' + (i + 1) + ') td:eq(' + (n - 1) + ')').addClass('background_color')
	// 							})
	// 						})
	// 					})
	// 				}
	// 			}
	// 		};
	// 	}
	// ]);
	//通用弹出框，中等大小，transclude scope定义在scope.$parent
	MetronicApp.directive('modalM', [
		'$compile',
		function($compile) {
			return {
				restrict: 'E',
				transclude: true,
				scope: {
					modalId: '@',
					modalOk: '&',
					modalTitle: '@'
				},
				templateUrl: 'tpl/modalM.html',
				link: function(scope, elem, attrs, ctrl, transclude) {
					elem.find('.modal.fade').attr('id', scope.modalId);
					transclude(scope.$parent, function(clone, scope) {
						elem.find('.portlet-body').append(clone);
						// Metronic.initUniform()
						//由于操作了DOM，这里要重新compile
						// $compile($(clone))(scope)
					});
				}
			};
		}
	]);
	//通用弹出框，中等大小，transclude scope定义在scope
	//transclude中设置clearModel指令，可以在弹出窗关闭时清空数据
	MetronicApp.directive('modalMm', [
		'$compile',
		function($compile) {
			return {
				restrict: 'E',
				transclude: true,
				scope: {
					modalId: '@',
					modalConfirm: '&',
					modalTitle: '@'
				},
				templateUrl: 'tpl/modalM.html',
				link: function(scope, elem, attrs, ctrl, transclude) {
					elem.find('.modal.fade').attr('id', scope.modalId);
					transclude(scope, function(clone, scope) {
						elem.find('.portlet-body').append(clone);
						// Metronic.initUniform()
						//由于操作了DOM，这里要重新compile
						// $compile(clone)(scope)
					});
					scope.modalOk = function() {
						scope.modalConfirm({data: scope})
					}
					elem.on('hide.bs.modal', function() {
						scope.$broadcast('clearModel')
					})
				}
			};
		}
	]);
	//通用弹出框，中等大小，transclude scope定义在scope
	//不清空数据并且不因为修改了弹出层的数据而改变原始数据，暂时使用刷新页面解决
	MetronicApp.directive('modalMmNoclear', [
		'$compile',
		function($compile) {
			return {
				restrict: 'E',
				transclude: true,
				scope: {
					modalId: '@',
					modalConfirm: '&',
					modalTitle: '@'
				},
				templateUrl: 'tpl/modalM.html',
				link: function(scope, elem, attrs, ctrl, transclude) {
					elem.find('.modal.fade').attr('id', scope.modalId);
					transclude(scope, function(clone, scope) {
						elem.find('.portlet-body').append(clone);
						// Metronic.initUniform()
						//由于操作了DOM，这里要重新compile
						// $compile(clone)(scope)
					});
					scope.modalOk = function() {
						scope.modalConfirm({data: scope})
					}
					elem.on('hide.bs.modal', function() {
						window.location.reload();
						// scope.$broadcast('clearModel')
					})
				}
			};
		}
	]);
	MetronicApp.directive('modalCargo', [
		'$compile',
		'ajax1',
		'dataTableall',
		function($compile, ajax1, dataTableall) {
			return {
				restrict: 'E',
				transclude: true,
				scope: {
					modalId: '@',
					modalConfirm: '&',
					modalTitle: '@',
					modalNum: '='
				},
				templateUrl: 'tpl/modalCargo.html',
				link: function(scope, elem, attrs, ctrl, transclude) {
					elem.find('.modal.fade').attr('id', scope.modalId);
					transclude(scope, function(clone, scope) {
						elem.find('.portlet-body').append(clone);
						// Metronic.initUniform()
						//由于操作了DOM，这里要重新compile
						// $compile(clone)(scope)
					});
					ajax1('/supplier/querySuppliers/', {
						"pageNo": "1",
						"pageSize": "10000"
					}).then(function(data) {
						scope.supplierList = data.obj.list
					})
					//拼接N个空格
					function getNbsp(num) {
						var str = "";
						for (var i = 1; i <= num; i++) {
							str += "　";
						}
						return str;
					}
					//初始化分类下拉框
					scope.ccSelectList = new Array();
					function initCargoCategorySelect(ccList) {
						for (var i = 0; i < ccList.length; i++) {
							ccList[i].name2 = getNbsp(ccList[i].level - 1) + ccList[i].name;
							scope.ccSelectList.push(ccList[i]);
							if (ccList[i].children.length > 0) {
								initCargoCategorySelect(ccList[i].children);
							}
						}
					}
					//获取分类名称
					function getCargoCategoryName(id) {
						for (var i = 0; i < scope.ccSelectList.length; i++) {
							if (scope.ccSelectList[i].id == id) {
								return scope.ccSelectList[i].name;
							}
						}
						return "";
					}
					//获取供应商名称
					function getSupplierName(id) {
						for (var i = 0; i < scope.supplierList.length; i++) {
							if (scope.supplierList[i].suppliersId == id) {
								return scope.supplierList[i].name;
							}
						}
						return "";
					}
					ajax1('/gateway/cargoCategory/queryCargoCategoryTree/1.0.0/', {"parentId": 0}).then(function(data) {
						var ccList = data.obj.cargoCategoryVoList;
						console.log(ccList);
						initCargoCategorySelect(ccList);
					})
					scope.modalOk = function() {
						scope.modalConfirm({data: scope})
					}
					scope.choiceCargos = new Map(); //已选择货品
					if (scope.modalNum) {}
					//选择货品
					scope.checkedCargo = function(id, name) {
						if (scope.choiceCargos.has(id)) {
							scope.choiceCargos.delete(id);
						} else {
							scope.choiceCargos.set(id, name);
						}
						console.log(scope.choiceCargos);
					}
					ajax1('/admin/queryEmployee/').then(function() {
						var tableParams = {
							id: '#sample_3',
							url: '/gateway/cargo/queryCargo/1.0.0/',
							allList: 'list',
							data: function(d) {
								return [
									'', d.id, d.cargoNo, d.name, "<img src='" + d.image + "' height='50'/>",
									getCargoCategoryName(d.categoryId),
									getSupplierName(d.supplierId),
									d.manufacturerModel,
									d.specificationNote,
									d.purchasePrice,
									d.packageSum
								]
							},
							render: function(self) {
								self.table.find('tbody tr td:first-child').each(function(i, n) {
									var rowData = self.table.api().row(i).data();
									if (rowData) {
										//已经选择的货品设置成选中状态
										var str = "";
										if (scope.choiceCargos.has(rowData[1] + "")) {
											str = "checked=checked";
										}
										var excel = $('<input type="checkbox" ' + str + ' class="checkboxes" ng-click="checkedCargo(\'' + rowData[1] + '\',\'' + rowData[3] + '\')" ng-true-value="' + rowData[2] + '" bn-uiform/>');
										$(this).append($compile(excel)(scope));
									}
								});
							},
							conditions: null
						}
						table = dataTableall.new(tableParams, scope)
					})
					scope.searchCargoes = function() {
						setConditions()
						table.tableSearch(scope.conditions)
					};
					function setConditions() {
						var obj = scope.searchDetail;
						for (var p in obj) { // 方法
							if (typeof(obj[p]) == " function ") {
								obj[p]();
							} else { // p 为属性名称，obj[p]为对应属性的值
								if (obj[p] == '') {
									obj[p] = null
								}
							}
						}
						console.log(obj);
						scope.conditions = obj;
					}
					scope.pushData = function(d) {
						layer.msg(d);
					}
					elem.on('hide.bs.modal', function() {
						scope.$broadcast('clearModel')
					})
				}
			};
		}
	]);
	MetronicApp.directive('modalPsi', [
		'$compile',
		'ajax1',
		function($compile, ajax1) {
			return {
				restrict: 'E',
				transclude: true,
				scope: {
					modalId: '@',
					modalConfirm: '&',
					modalModify: '=',
					modalTitle: '@',
					supplierId: '='
				},
				templateUrl: 'tpl/modalPsi.html',
				link: function(scope, elem, attrs, ctrl, transclude) {
					elem.find('.modal.fade').attr('id', scope.modalId);
					transclude(scope, function(clone, scope) {
						elem.find('.portlet-body').append(clone);
						// Metronic.initUniform()
						//由于操作了DOM，这里要重新compile
						// $compile(clone)(scope)
					});
					scope.$watch('supplierId', function(newValue, oldValue) {
						if (undefined != newValue) {
							ajax1('/psi/purchase/queryPurchaseOrderNumList/', {"supplierId": newValue}).then(function(datas) {
								scope.listDatas = datas.obj;
							})
						}
					}, true);
					scope.$watch('modalModify', function(newValue, oldValue) {
						if (scope.modalModify) {
							scope.modalDatas = scope.modalModify.modalDatas;
							scope.orderNum = scope.modalModify.orderNum;
							scope.orderName = scope.modalModify.orderName;
							scope.$apply();
						}
					}, true);
					scope.selectorderNum = function(orderNum) {
						if (!orderNum) {
							return
						} else {
							ajax1('/psi/purchase/queryPurchaseOrderByOrderNum/', {"orderNum": orderNum}).then(function(datas) {
								scope.orderName = datas.obj.orderName;
							});
							ajax1('/psi/purchase/queryLineHaulProducts/', {"orderNum": orderNum}).then(function(datas) {
								scope.modalDatas = datas.obj;
							});
						}
					}
					scope.modalOk = function() {
						var temp = [];
						scope.modalDatas.forEach((n) => {
							temp.push(n.isSelected);
						})
						if (temp.indexOf(true) === -1) {
							layer.msg('请选择采购单商品')
						} else {
							scope.productAmount = 0;
							scope.packageAmount = 0;
							scope.priceAmount = 0;
							scope.productTypeAmount = 0;
							$.each(scope.modalDatas, function(i1, n1) {
								if (n1.isSelected) {
									scope.productTypeAmount++;
								}
								n1.productAmount = 0;
								n1.packageAmount = 0;
								$.each(n1.lineHualPackage, function(i2, n2) {
									if (n2.isSelected) {
										$.each(n2.uidList, function(i3, n3) {
											if (n3.isSelected) {
												scope.packageAmount++;
												n1.packageAmount++;
											}
										});
										n1.productAmount++;
										scope.productAmount++;
										scope.priceAmount += n1.purchasePrice;
									}
								});
							});
							scope.modalConfirm({data: scope})
							if (scope.modalTitle === '添加采购单商品') {
								scope.orderNum = null;
							}
						}
					}
					elem.on('hide.bs.modal', function() {
						scope.$broadcast('clearModel')
					});
					//全选时将事件$event和本身对象传入改变isSelected属性
					scope.allchecked = (enent, datas) => {
						if (event.target.checked) {
							datas.forEach((m) => {
								m.isSelected = true;
								m.lineHualPackage.forEach((c) => {
									c.isSelected = true;
									c.uidList.forEach((d) => {
										d.isSelected = true;
									})
								})
							})
						} else {
							datas.forEach((m) => {
								m.isSelected = false;
								m.lineHualPackage.forEach((c) => {
									c.isSelected = false;
									c.uidList.forEach((d) => {
										d.isSelected = false;
									})
								})
							})
						}
					}
					scope.Mselect = (event, mitem, all) => {
						if (event.target.checked) {
							var temp = [];
							mitem.isSelected = true;
							all.forEach((n) => {
								temp.push(n.isSelected);
							})
							if (temp.indexOf(false) === -1 && temp.indexOf(undefined) === -1) {
								scope.all = true;
							}
							mitem.lineHualPackage.forEach((n) => {
								n.isSelected = true;
								n.uidList.forEach((m) => {
									m.isSelected = true;
								})
							})
						} else {
							var temp = [];
							mitem.isSelected = false;
							all.forEach((n) => {
								temp.push(n.isSelected);
							})
							if (temp.indexOf(true) === -1) {
								scope.all = false;
							}
							mitem.lineHualPackage.forEach((n) => {
								n.isSelected = false;
								n.uidList.forEach((m) => {
									m.isSelected = false;
								})
							})
						}
					};
					scope.Cselect = (event, citem, mitem, all) => {
						if (event.target.checked) {
							var temp = [];
							mitem.isSelected = true;
							citem.isSelected = true;
							citem.uidList.forEach((n) => {
								n.isSelected = true;
							})
							all.forEach((m) => {
								temp.push(m.isSelected);
							})
							var map = {};
							for (var i = 0; i < temp.length; i++) {
								var ai = temp[i];
								if (!map[ai]) {
									map[ai] = 1;
								} else {
									map[ai]++;
								}
							}
							if (map.true === temp.length) {
								scope.all = true;
							}
						} else {
							var temp = [];
							var temp2 = [];
							citem.isSelected = false;
							mitem.lineHualPackage.forEach((n) => {
								temp2.push(n.isSelected);
							})
							if (temp2.indexOf(true) === -1) {
								mitem.isSelected = false;
							}
							citem.uidList.forEach((n) => {
								n.isSelected = false;
							})
							all.forEach((m) => {
								temp.push(m.isSelected);
							})
							var map = {};
							for (var i = 0; i < temp.length; i++) {
								var ai = temp[i];
								if (!map[ai]) {
									map[ai] = 1;
								} else {
									map[ai]++;
								}
							}
							if (map.true === temp.length) {
								scope.all = true;
							} else {
								scope.all = false;
							}
						}
					};
					scope.Dselect = (ditem, citem, mitem, all) => {
						var temp = [];
						if (ditem.isSelected) {
							ditem.isSelected = false;
							citem.uidList.forEach((n) => {
								temp.push(n.isSelected);
							})
							if (temp.indexOf(true) === -1) {
								var arr = [];
								citem.isSelected = false;
								mitem.lineHualPackage.forEach((q) => {
									arr.push(q.isSelected);
								})
								if (arr.indexOf(true) === -1) {
									mitem.isSelected = false;
									scope.all = false;
								}
							}
						} else {
							if (!ditem.isSelected) {
								var temp = [];
								citem.isSelected = true;
								mitem.isSelected = true;
								all.forEach((m) => {
									temp.push(m.isSelected);
								})
								var map = {};
								for (var i = 0; i < temp.length; i++) {
									var ai = temp[i];
									if (!map[ai]) {
										map[ai] = 1;
									} else {
										map[ai]++;
									}
								}
								if (map.true === temp.length) {
									scope.all = true;
								}
							}
						}
					};
				}
			};
		}
	]);
	MetronicApp.directive('modalDeliveryPsi', [
		'$compile',
		'ajax1',
		function($compile, ajax1) {
			return {
				restrict: 'E',
				transclude: true,
				scope: {
					modalId: '@',
					modalConfirm: '&',
					modalModify: '=',
					modalTitle: '@',
					orderProductList: '='
				},
				templateUrl: 'tpl/psi/delivery/modalDeliveryPsi.html',
				link: function(scope, elem, attrs, ctrl, transclude) {
					elem.find('.modal.fade').attr('id', scope.modalId);
					transclude(scope, function(clone, scope) {
						elem.find('.portlet-body').append(clone);
						//Metronic.initUniform()
						//由于操作了DOM，这里要重新compile
						//$compile(clone)(scope)
					});
					scope.$watch('orderProductList', function(newValue, oldValue) {
						if (scope.orderProductList) {
							scope.modalDatas = scope.orderProductList;
							//scope.$apply();
						}
					}, true);
					scope.$watch('modalModify', function(newValue, oldValue) {
						if (scope.modalModify) {
							scope.modalDatas = scope.modalModify.modalDatas;
							scope.orderNum = scope.modalModify.orderNum;
							//scope.$apply();
						}
					}, true);
					// scope.modalDatas = scope.orderProductList;
					scope.deliveryOrderOK = function() {
						var temp = [];
						scope.modalDatas.forEach((n) => {
							temp.push(n.isSelected);
						})
						if (temp.indexOf(true) === -1) {
							layer.msg('请选择采购单商品')
						} else {
							scope.modalConfirm({data: scope})
							if (scope.modalTitle === '添加采购单商品') {
								scope.orderNum = null;
							}
						}
					}
					elem.on('hide.bs.modal', function() {
						scope.$broadcast('clearModel')
					});
					//全选时将事件$event和本身对象传入改变isSelected属性
					scope.allchecked = (enent, datas) => {
						if (event.target.checked) {
							datas.forEach((m) => {
								if (m.unDeliveryPackage) {
									m.isSelected = true;
									m.unDeliveryPackage.forEach((c) => {
										c.isSelected = true;
										c.uidList.forEach((d) => {
											d.isSelected = true;
										})
									})
								}
							})
						} else {
							datas.forEach((m) => {
								m.isSelected = false;
								m.unDeliveryPackage.forEach((c) => {
									c.isSelected = false;
									c.uidList.forEach((d) => {
										d.isSelected = false;
									})
								})
							})
						}
					}
					scope.Mselect = (event, mitem, all) => {
						if (event.target.checked) {
							var temp = [];
							mitem.isSelected = true;
							all.forEach((n) => {
								temp.push(n.isSelected);
							})
							if (temp.indexOf(false) === -1 && temp.indexOf(undefined) === -1) {
								scope.all = true;
							}
							mitem.unDeliveryPackage.forEach((n) => {
								n.isSelected = true;
								n.uidList.forEach((m) => {
									m.isSelected = true;
								})
							})
						} else {
							var temp = [];
							mitem.isSelected = false;
							all.forEach((n) => {
								temp.push(n.isSelected);
							})
							if (temp.indexOf(true) === -1) {
								scope.all = false;
							}
							mitem.unDeliveryPackage.forEach((n) => {
								n.isSelected = false;
								n.uidList.forEach((m) => {
									m.isSelected = false;
								})
							})
						}
					};
					scope.Cselect = (event, citem, mitem, all) => {
						if (event.target.checked) {
							var temp = [];
							mitem.isSelected = true;
							citem.isSelected = true;
							citem.uidList.forEach((n) => {
								n.isSelected = true;
							})
							all.forEach((m) => {
								temp.push(m.isSelected);
							})
							var map = {};
							for (var i = 0; i < temp.length; i++) {
								var ai = temp[i];
								if (!map[ai]) {
									map[ai] = 1;
								} else {
									map[ai]++;
								}
							}
							if (map.true === temp.length) {
								scope.all = true;
							}
						} else {
							var temp = [];
							var temp2 = [];
							citem.isSelected = false;
							mitem.unDeliveryPackage.forEach((n) => {
								temp2.push(n.isSelected);
							})
							if (temp2.indexOf(true) === -1) {
								mitem.isSelected = false;
							}
							citem.uidList.forEach((n) => {
								n.isSelected = false;
							})
							all.forEach((m) => {
								temp.push(m.isSelected);
							})
							var map = {};
							for (var i = 0; i < temp.length; i++) {
								var ai = temp[i];
								if (!map[ai]) {
									map[ai] = 1;
								} else {
									map[ai]++;
								}
							}
							if (map.true === temp.length) {
								scope.all = true;
							} else {
								scope.all = false;
							}
						}
					};
					scope.Dselect = (ditem, citem, mitem, all) => {
						var temp = [];
						if (ditem.isSelected) {
							ditem.isSelected = false;
							citem.uidList.forEach((n) => {
								temp.push(n.isSelected);
							})
							if (temp.indexOf(true) === -1) {
								var arr = [];
								citem.isSelected = false;
								mitem.unDeliveryPackage.forEach((q) => {
									arr.push(q.isSelected);
								})
								if (arr.indexOf(true) === -1) {
									mitem.isSelected = false;
									scope.all = false;
								}
							}
						} else {
							if (!ditem.isSelected) {
								var temp = [];
								citem.isSelected = true;
								mitem.isSelected = true;
								all.forEach((m) => {
									temp.push(m.isSelected);
								})
								var map = {};
								for (var i = 0; i < temp.length; i++) {
									var ai = temp[i];
									if (!map[ai]) {
										map[ai] = 1;
									} else {
										map[ai]++;
									}
								}
								if (map.true === temp.length) {
									scope.all = true;
								}
							}
						}
					};
				}
			};
		}
	]);
	//通用弹出框，小号，transclude scope定义在scope
	//transclude中设置clearModel指令，可以在弹出窗关闭时清空数据
	MetronicApp.directive('modalSs', [
		'$compile',
		function($compile) {
			return {
				restrict: 'E',
				transclude: true,
				scope: {
					modalId: '@',
					modalConfirm: '&',
					modalTitle: '@'
				},
				templateUrl: 'tpl/modalSs.html',
				link: function(scope, elem, attrs, ctrl, transclude) {
					elem.find('.modal.fade').attr('id', scope.modalId);
					transclude(scope, function(clone, scope) {
						elem.find('.portlet-body').append(clone);
						// Metronic.initUniform()
						//由于操作了DOM，这里要重新compile
						// $compile($(clone))(scope)
					});
					scope.modalOk = function() {
						scope.modalConfirm({data: scope})
					}
					elem.on('hide.bs.modal', function() {
						scope.$broadcast('clearModel')
					})
				}
			};
		}
	]);
	//通用弹出框，小号，只能显示提示信息，点击OK无回调方法，只是隐藏该modal
	MetronicApp.directive('modalS', function() {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				modalId: '@',
				modalTitle: '@'
			},
			templateUrl: 'tpl/modalS.html',
			link: function(scope, elem, attrs, ctrl) {
				elem.find('.modal.fade').attr('id', scope.modalId);
				scope.modalOk = function() {
					$('#' + scope.modalId).modal('hide');
				}
			}
		};
	});
	//时间输入框，自动加载，中文
	MetronicApp.directive('timeInput', [
		'$compile',
		'$ocLazyLoad',
		'dateFilter',
		function($compile, $ocLazyLoad, dateFilter) {
			var isloaded = $ocLazyLoad.load({
				insertBefore: '#ng_load_plugins_before',
				files: ['assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css', 'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js']
			}).then(function(data) {
				return $ocLazyLoad.load({insertBefore: '#ng_load_plugins_before', files: ['assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js']})
			})
			return {
				restrict: 'E',
				require: 'ngModel',
				scope: {
					ngModel: '=',
					format: '@',
					minView: '@',
					startDate: '=',
					endDate: '=',
					initNow: '@',
					bChange: '@'
				},
				templateUrl: 'tpl/inputTime.html',
				link: function(scope, elem, attrs, ctrl) {
					var picker = $(elem.children('.form_datetime'))
					isloaded.then(function(data) {
						if ('true' == scope.bChange || undefined == scope.bChange) {
							picker.datetimepicker({
								language: 'zh-CN',
								isRTL: Metronic.isRTL(),
								format: scope.format,
								autoclose: true,
								todayBtn: true,
								startDate: scope.startDate,
								endDate: scope.endDate,
								pickerPosition: (Metronic.isRTL()
									? "bottom-right"
									: "bottom-left"),
								// minuteStep: 10,
								minView: scope.minView || '2'
							})
						}
						if (!scope.ngModel) {
							var now = eval(scope.initNow)
							if (now) {
								switch (scope.minView) {
									case '2':
										scope.ngModel = dateFilter(now, 'yyyy-MM-dd');
										break;
									case '1':
									case '0':
									default:
										scope.ngModel = dateFilter(now, 'yyyy-MM-dd HH:mm');
										break;
								}
							}
						}
					})
					//startDate一般是绑定前一个时间输入框
					scope.$watch('startDate', function() {
						if (!scope.startDate) {
							return
						}
						if (scope.startDate > scope.ngModel) {
							scope.ngModel = ''
						}
						picker.datetimepicker('setStartDate', scope.startDate);
					})
				}
			};
		}
	]);
	//图片选择框，自动加载，
	MetronicApp.directive('inputImage', [
		'$compile',
		'$ocLazyLoad',
		'dateFilter',
		'qiniuimage',
		function($compile, $ocLazyLoad, dateFilter, qiniuimage) {
			var isloaded = $ocLazyLoad.load({
				insertBefore: '#ng_load_plugins_before',
				files: [
					'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
					'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version
				]
			})
			return {
				restrict: 'E',
				require: 'ngModel',
				scope: {
					ngModel: '='
				},
				templateUrl: 'tpl/inputImage.html',
				link: function(scope, elem, attrs, ctrl) {
					elem.on('change.bs.fileinput', function(e) {
						var file = elem.find('.fileupload')[0]
						if (file.files.length) {
							qiniuimage(file).then(function(data) {
								ctrl.$setViewValue(data)
							})
						}
					})
					elem.on('clear.bs.fileinput', function(e) {
						ctrl.$setViewValue('')
						scope.ngModel = ''
						ctrl.$render();
						scope.$apply()
					})
					scope.$watch('ngModel', function() {
						if (scope.ngModel) {
							elem.find('div.fileinput').removeClass('fileinput-new').addClass('fileinput-preview fileinput-exists')
						}
					})
				}
			};
		}
	]);
	MetronicApp.directive('inputFiles', [
		'$compile',
		'$ocLazyLoad',
		'dateFilter',
		'qiniu',
		function($compile, $ocLazyLoad, dateFilter, qiniu) {
			var isloaded = $ocLazyLoad.load({
				insertBefore: '#ng_load_plugins_before',
				files: [
					'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
					'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version
				]
			})
			return {
				restrict: 'E',
				require: 'ngModel',
				scope: {
					ngModel: '=',
					ngUrl: "@",
					makeSure: "="
				},
				templateUrl: 'tpl/inputFiles.html',
				link: function(scope, elem, attrs, ctrl) {
					scope.$watch('makeSure', function() {
						if (scope.makeSure) {
							var file = elem.find('.fileupload')[0]
							if (file.files.length) {
								qiniu(file, Metronic.host + scope.ngUrl).then(function(data) {
									ctrl.$setViewValue(data);
									location.reload();
								})
							}
						}
					})
					elem.on('clear.bs.fileinput', function(e) {
						ctrl.$setViewValue('')
						scope.ngModel = ''
						ctrl.$render();
						scope.$apply()
					})
					scope.$watch('ngModel', function() {
						if (scope.ngModel) {
							elem.find('div.fileinput').removeClass('fileinput-new').addClass('fileinput-preview fileinput-exists')
						}
					})
				}
			};
		}
	]);
	//图片选择框，自动加载，
	MetronicApp.directive('inputImageHard', [
		'$compile',
		'$ocLazyLoad',
		'dateFilter',
		'userNow',
		'ajax1',
		function($compile, $ocLazyLoad, dateFilter, userNow, ajax1) {
			var isloaded = $ocLazyLoad.load({
				insertBefore: '#ng_load_plugins_before',
				files: [
					'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
					'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version
				]
			})
			return {
				restrict: 'E',
				require: 'ngModel',
				scope: {
					ngModel: '='
				},
				templateUrl: 'tpl/inputImageHard.html',
				link: function(scope, elem, attrs, ctrl) {
					elem.on('change.bs.fileinput', function(e) {
						var file = elem.find('.fileupload')[0]
						if (file.files.length) {
							var formData = new FormData();
							formData.append("datum", file.value);
							formData.append("datum", file.files[0]);
							// formData.append("datum", "text/plain");
							$.ajax({
								url: Metronic.host + '/hbms/pushDatum/' + userNow.userId + '/' + userNow.sessionId,
								type: 'POST',
								dataType: 'json',
								data: formData,
								processData: false,
								contentType: false,
								success: function(data) {
									ctrl.$setViewValue(data.obj)
									ajax1('/hbms/relateDatum/', {
										"kind": attrs.type,
										"relationId": scope.$parent.$state.params.id,
										"type": "0",
										"url": 'http://' + data.obj
									}).then(function(data) {})
								},
								error: function() {
									console.debug('请检查网络');
								}
							});
						}
						scope;
					})
					elem.on('clear.bs.fileinput', function(e) {
						ctrl.$setViewValue('')
						scope.ngModel = ''
						ctrl.$render();
						scope.$apply()
					})
					scope.$watch('ngModel', function() {
						if (scope.ngModel) {
							elem.find('div.fileinput').removeClass('fileinput-new').addClass('fileinput-preview fileinput-exists')
						}
					})
				}
			};
		}
	]);
	//上传文件，自动加载，
	MetronicApp.directive('inputFileHard', [
		'$compile',
		'$ocLazyLoad',
		'dateFilter',
		'ajax1',
		'userNow',
		function($compile, $ocLazyLoad, dateFilter, ajax1, userNow) {
			var isloaded = $ocLazyLoad.load({
				insertBefore: '#ng_load_plugins_before',
				files: [
					'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
					'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version
				]
			})
			return {
				restrict: 'E',
				// require: 'ngModel',
				scope: {
					callback: '&'
				},
				templateUrl: 'tpl/inputFile.html',
				link: function(scope, elem, attrs) {
					elem.on('change.bs.fileinput', function(e) {
						var file = elem.find('.inputFile')[0]
						if (file.files.length) {
							var formData = new FormData();
							formData.append("datum", file.value);
							formData.append("datum", file.files[0]);
							// formData.append("datum", "text/plain");
							$.ajax({
								url: Metronic.host + '/hbms/pushDatum/' + userNow.userId + '/' + userNow.sessionId,
								type: 'POST',
								dataType: 'json',
								data: formData,
								processData: false,
								contentType: false,
								success: function(data) {
									// ctrl.$setViewValue(data.obj)
									ajax1('/hbms/relateDatum/', {
										"kind": attrs.type,
										"relationId": scope.$parent.$state.params.id,
										"type": "0",
										"url": 'http://' + data.obj
									}).then(function(data) {
										scope.callback()
									})
								},
								error: function() {
									console.debug('请检查网络');
								}
							});
						}
					})
					// elem.on('clear.bs.fileinput', function(e) {
					//     ctrl.$setViewValue('')
					//     scope.ngModel = ''
					//     ctrl.$render();
					//     scope.$apply()
					// })
					// scope.$watch('ngModel', function() {
					//     if (scope.ngModel) {
					//         elem.find('div.fileinput').removeClass('fileinput-new').addClass('fileinput-preview fileinput-exists')
					//     }
					// })
				}
			};
		}
	]);
	//加减数量输入框
	MetronicApp.directive('inputNumber', [
		'$timeout',
		function($timeout) {
			return {
				restrict: 'E',
				require: 'ngModel',
				scope: {
					max: '=',
					min: '='
				},
				templateUrl: 'tpl/inputNumber.html',
				link: function(scope, elem, attrs, ctrl) {
					$timeout(function() {
						scope.inputValue = ctrl.$viewValue
					})
					scope.reduceAmount = function() {
						if (scope.min !== undefined && scope.inputValue <= scope.min)
							return
						scope.inputValue--;
						ctrl.$setViewValue(scope.inputValue)
					}
					scope.addAmount = function() {
						if (scope.max !== undefined && scope.inputValue >= scope.max)
							return
						scope.inputValue++;
						ctrl.$setViewValue(scope.inputValue)
					}
					scope.modifyAmount = function() {
						if (parseInt(scope.inputValue) !== parseInt(scope.inputValue)) {
							scope.inputValue = 0
						}
						if (scope.min !== undefined && scope.inputValue <= scope.min) {
							scope.inputValue = scope.min
						}
						if (scope.max !== undefined && scope.inputValue >= scope.max) {
							scope.inputValue = scope.max
						}
						ctrl.$setViewValue(parseInt(scope.inputValue))
					}
				}
			};
		}
	]);
	//加减数量输入框
	MetronicApp.directive('select3', [
		'$timeout',
		'$rootScope',
		function($timeout, $rootScope) {
			return {
				restrict: 'E',
				scope: {
					repeatOptions: '=',
					selectedOptions: '=',
					urlId: '@'
				},
				templateUrl: 'tpl/select3.html',
				link: function($scope, elem, attrs, ctrl) {
					$scope.$watch('$parent.artworkDetail.roomList', function() {
						if ($rootScope.$state.$current.data.pageTitle === '艺术品详情' && $scope.selectedOptions) {
							$scope.checklabels = $scope.selectedOptions;
							$.each($scope.checklabels, function(i, value) {
								var same1 = '';
								same1 = value.attValue;
								$.each($scope.repeatOptions, function(j, value) {
									var same2 = '';
									same2 = value.valueDesc;
									if (same1 == same2) {
										return elem.find("input[type='button']").eq(j).addClass("end");
									}
								})
							});
						}
					});
					//打开适用空间下拉框
					$scope.showspace = function() {
						elem.find('.space').show();
					}
					$scope.hidespace = function() {
						elem.find('.space').hide();
					};
					//已有标签选中改变颜色并加入伪DIV数组,删除标签改变下方标签选中状态
					var labels = [];
					$scope.changecolor = function(index) {
						if ($rootScope.$state.$current.data.pageTitle === '艺术品详情') {
							labels = $scope.checklabels;
							if ($scope.checklabels.length >= 3) {
								layer.msg("已添加三个标签,无法继续添加!");
								return false;
							};
						};
						if (labels.length >= 3) {
							layer.msg("已添加三个标签,无法继续添加!");
							return false;
						};
						if (elem.find("input[type='button']").eq(index).hasClass("end")) {
							return
						};
						var addelem = {
							attrKey: '',
							attValue: ''
						};
						elem.find("input[type='button']").eq(index).addClass("end");
						addelem.attrKey = elem.find("input[type='button']").eq(index).attr('status');
						addelem.attValue = elem.find("input[type='button']").eq(index).val();
						labels.push(addelem);
						$scope.selectedOptions = $scope.checklabels = labels;
					}
					$scope.dellabel = function(index) {
						if ($rootScope.$state.$current.data.pageTitle === '艺术品详情') {
							$.each($scope.checklabels, function(i, value) {
								if (elem.find('.new').eq(index).val() == value.attrKey) {
									$scope.checklabels.splice(i, 1);
								}
							})
						}
						$.each(elem.find("input[type='button']"), function(i, n) {
							if (elem.find(n).attr('status') === elem.find('.new').eq(index).val()) {
								elem.find(n).removeClass("end");
							}
						})
						$.each(labels, function(i, value) {
							if (elem.find('.new').eq(index).val() === value.attrKey) {
								labels.splice(i, 1);
							}
						})
					}
					//新增标签输入框操作
					$scope.addbiaoqian = function() {
						elem.find('.newbiaoqian').show();
					}
					$scope.hidenewlabel = function() {
						elem.find('.newbiaoqian').hide();
					}
					$scope.savenewlabel = function() {
						var newlabel = {
							valueDesc: ""
						};
						newlabel.valueDesc = elem.find('#newlabel').val();
						$scope.repeatOptions.push(newlabel);
						elem.find('.newbiaoqian').hide();
						var params = {
							type: $scope.urlId,
							content: newlabel.valueDesc
						};
						var a = JSON.parse(window.localStorage.Userdata);
						$.ajax({
							url: Metronic.host + '/art/addCondition/' + $scope.urlId + '/' + a.userId + '/' + a.sessionId,
							type: 'POST',
							dataType: 'json',
							data: JSON.stringify(params),
							success: function(data) {
								if (data.code == 1) {
									console.log(data, '添加标签成功');
								}
							},
							error: function(xhr, data, status) {
								console.log('添加标签失败�');
							}
						});
					}
				}
			};
		}
	]);
	//商品页container
	MetronicApp.directive('container', [
		'RecursionHelper',
		function(RecursionHelper) {
			return {
				restrict: "E",
				scope: {
					vm: '=',
					checkFn: '&'
				},
				templateUrl: 'tpl/container.html',
				compile: function(element) {
					return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
						scope.addComponent = function() {
							window.addComponentIndex = $('button[name="adddetail"]').index(iElement.find('button[name="adddetail"]'))
							$('#addComponent').modal({keyboard: true});
						}
						scope.IsTheme = function(event, mdata, ndata, vm) {
							var checked = event.target.checked;
							if (checked == false) {
								var select = confirm("取消勾选可能会导致sku数据丢失？");
								if (select) {
									scope.checkFn({event: event, mdata: mdata, ndata: ndata, vmdata: vm})
								} else {
									event.target.checked = true;
								}
							} else {
								scope.checkFn({event: event, mdata: mdata, ndata: ndata, vmdata: vm})
							}
						}
					});
				}
			};
		}
	]);
	//商品页container
	MetronicApp.directive('containerEdit', [
		'RecursionHelper',
		function(RecursionHelper) {
			return {
				restrict: "E",
				scope: {
					vm: '=',
					checkFn: '&'
				},
				templateUrl: 'tpl/containerEdit.html',
				compile: function(element) {
					return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
						scope.addComponent = function() {
							window.addComponentIndex = $('button[name="adddetail"]').index(iElement.find('button[name="adddetail"]'))
							$('#addComponent').modal({keyboard: true});
						}
						scope.IsTheme = function(event, mdata, ndata, vm) {
							var checked = event.target.checked;
							if (checked == false) {
								var select = confirm("取消勾选可能会导致sku数据丢失？");
								if (select) {
									scope.checkFn({event: event, mdata: mdata, ndata: ndata, vmdata: vm})
								} else {
									event.target.checked = true;
								}
							} else {
								scope.checkFn({event: event, mdata: mdata, ndata: ndata, vmdata: vm})
							}
						}
					});
				}
			};
		}
	]);
	MetronicApp.directive('changeCategory', [
		'ajax1',
		function(ajax1) {
			return {
				restrict: 'A',
				templateUrl: 'tpl/goods_assembly_new.html',
				controller: function($scope, $element) {
					// 下拉框和单选按钮的切换
					$scope.visibility = true;
					$scope.selectassembly = function() {
						$scope.visibility = true;
					};
					//获取下拉框类目树数据
					ajax1('/gateway/category/queryCategory/1.0.0/', {}).then(function(datas) {
						datas.obj.categoryTreeNodeDtos.forEach((obj) => {
							if (obj.categoryDto.id == $scope.rootCategoryId) {
								$scope.tree = [];
								$scope.tree.push(obj);
							}
						});;
					});
					// 点击下拉框获取不同类目
					$scope.querytwo = function(item) {
						$scope.childrenitem = item[0].categoryTreeNodeDtos;
						$scope.urlId = ($scope.selectone && $scope.selectone[0].categoryDto.id) || ($scope.selecttwo && $scope.selecttwo[0].categoryDto.id) && ($scope.selectthree && $scope.selectthree[0].categoryDto.id);
						$scope.categoryName = ($scope.selectone && $scope.selectone[0].categoryDto.name) || ($scope.selecttwo && $scope.selecttwo[0].categoryDto.name) && ($scope.selectthree && $scope.selectthree[0].categoryDto.name);
					};
					$scope.querythree = function(item) {
						$scope.grandsonitem = item[0].categoryTreeNodeDtos;
						$scope.urlId = ($scope.selectone && $scope.selectone[0].categoryDto.id) && ($scope.selecttwo && $scope.selecttwo[0].categoryDto.id) || ($scope.selectthree && $scope.selectthree[0].categoryDto.id);
						$scope.categoryName = ($scope.selectone && $scope.selectone[0].categoryDto.name) && ($scope.selecttwo && $scope.selecttwo[0].categoryDto.name) || ($scope.selectthree && $scope.selectthree[0].categoryDto.name);
					};
					$scope.querylast = function() {
						$scope.urlId = ($scope.selectone && $scope.selectone[0].categoryDto.id) && ($scope.selecttwo && $scope.selecttwo[0].categoryDto.id) && ($scope.selectthree && $scope.selectthree[0].categoryDto.id);
						$scope.categoryName = ($scope.selectone && $scope.selectone[0].categoryDto.name) && ($scope.selecttwo && $scope.selecttwo[0].categoryDto.name) && ($scope.selectthree && $scope.selectthree[0].categoryDto.name);
					};
					// 查询后的类目全路径
					$scope.searchassembly = function() {
						$scope.visibility = false;
						var params = {
							name: $scope.searchname
						};
						ajax1('/gateway/category/queryCategoryFullPath/1.0.0/', params).then(function(datas) {
							$scope.items = datas.obj.categoryTreeNodeDtos;
							$scope.namelist = [];
							$scope.idlist = [];
							$scope.totallist = [];
							$scope.items.forEach(function(n) {
								$scope.namelist = $scope.namelist.concat(queryFullPath(n));
								$scope.idlist = $scope.idlist.concat(queryFullPathid(n));
							});
							function queryFullPath(items) {
								var name = [];
								if (items.categoryTreeNodeDtos.length) {
									items.categoryTreeNodeDtos.forEach(function(m, i) {
										var child = queryFullPath(m).map(function(k, j) {
											return items.categoryDto.name + '>>' + k;
										});
										if (child.length) {
											name = name.concat(child);
										} else {
											name.push(items.categoryDto.name);
										}
									});
									return name;
								} else {
									return [items.categoryDto.name];
								}
							}
							function queryFullPathid(items) {
								var id = [];
								if (items.categoryTreeNodeDtos.length) {
									items.categoryTreeNodeDtos.forEach(function(m, i) {
										var child = queryFullPathid(m).map(function(k, j) {
											return k;
										});
										if (child.length) {
											id = id.concat(child);
										} else {
											id.push(items.categoryDto.id);
										}
									});
									return id;
								} else {
									return [items.categoryDto.id];
								}
							}
						}).then(function() {
							$.each($scope.namelist, function(i, n) {
								var objlist = {
									id: "",
									name: ""
								};
								objlist.id = $scope.idlist[i];
								objlist.name = $scope.namelist[i];
								$scope.totallist.push(objlist);
							});
						});
					};
					$scope.todetail = function(id) {
						$scope.urlId = id;
					};
				}
			}
		}
	]);
	MetronicApp.directive('tableTabStatus', [
		'dataTable',
		'$timeout',
		'queryFilter',
		'$compile',
		'userNow',
		function(dataTable, $timeout, queryFilter, $compile, userNow) {
			return {
				restrict: 'E', templateUrl: 'tpl/tableTabStatus.html',
				// require: 'ngModel',
				scope: {
					tableParams: '=',
					tables: '=',
					tabIndex: '=',
					companyCond: '=',
					searchScope: '=',
					hideTab: '@'
				},
				link: function(scope, elem, attrs) {
					var tableParams = scope.tableParams
						var table0,
							table1,
							table2,
							table3
						var company = queryFilter('/company/queryAllCompany/')
						$timeout(function() {
							switch ('8') {
								case '7':
								case '8':
									scope.click1();
									elem.find('li:eq(1)').addClass('active');
									elem.children('div:eq(1)').removeClass('table-not-show');
									elem.children('div:eq(0)').addClass('table-not-show');
									elem.children('div:eq(2)').addClass('table-not-show');
									elem.children('div:eq(3)').addClass('table-not-show');
									break;
								case '9':
									scope.click2();
									elem.find('li:eq(2)').addClass('active');
									elem.children('div:eq(2)').removeClass('table-not-show');
									elem.children('div:eq(1)').addClass('table-not-show');
									elem.children('div:eq(0)').addClass('table-not-show');
									elem.children('div:eq(3)').addClass('table-not-show');
									break;
								case '10':
									scope.click3();
									elem.find('li:eq(3)').addClass('active');
									elem.children('div:eq(3)').removeClass('table-not-show');
									elem.children('div:eq(1)').addClass('table-not-show');
									elem.children('div:eq(2)').addClass('table-not-show');
									elem.children('div:eq(0)').addClass('table-not-show');
									break;
							}
						})
						scope.click0 = function() {
							scope.tabIndex = 0
							if (!table0) {
								tableParams.id = '#sample_0'
								if (attrs.companyCond) {
									tableParams.conditionsBig = scope.companyCond[0]
								} else {
									tableParams.conditionsBig = {}
								}
								tableParams.conditions = attrs.searchScope
									? scope.searchScope
									: scope.$parent.searchDetail;
								scope.tables[0] = table0 = dataTable.new(tableParams, scope)
							} else {
								table0.tableSearch(attrs.searchScope
									? scope.searchScope
									: scope.$parent.searchDetail)
							}
							elem.children('div:eq(0)').removeClass('table-not-show')
							elem.children('div:eq(1)').addClass('table-not-show')
							elem.children('div:eq(2)').addClass('table-not-show')
							elem.children('div:eq(3)').addClass('table-not-show')
						}
						scope.click1 = function() {
							scope.tabIndex = 1
							if (!table1) {
								tableParams.id = '#sample_1'
								if (attrs.companyCond) {
									tableParams.conditionsBig = scope.companyCond[1]
								} else {
									tableParams.conditionsBig = {
										status: 0
									}
								}
								tableParams.conditions = attrs.searchScope
									? scope.searchScope
									: scope.$parent.searchDetail;
								scope.tables[1] = table1 = dataTable.new(tableParams, scope);
							} else {
								table1.tableSearch(attrs.searchScope
									? scope.searchScope
									: scope.$parent.searchDetail)
							}
							elem.children('div:eq(1)').removeClass('table-not-show')
							elem.children('div:eq(0)').addClass('table-not-show')
							elem.children('div:eq(2)').addClass('table-not-show')
							elem.children('div:eq(3)').addClass('table-not-show')
						}
						scope.click2 = function() {
							scope.tabIndex = 2
							if (!table2) {
								tableParams.id = '#sample_2'
								if (attrs.companyCond) {
									tableParams.conditionsBig = scope.companyCond[2]
								} else {
									tableParams.conditionsBig = {
										status: 2
									}
								}
								tableParams.conditions = attrs.searchScope
									? scope.searchScope
									: scope.$parent.searchDetail;
								scope.tables[2] = table2 = dataTable.new(tableParams, scope)
							} else {
								table2.tableSearch(attrs.searchScope
									? scope.searchScope
									: scope.$parent.searchDetail)
							}
							elem.children('div:eq(2)').removeClass('table-not-show')
							elem.children('div:eq(1)').addClass('table-not-show')
							elem.children('div:eq(0)').addClass('table-not-show')
							elem.children('div:eq(3)').addClass('table-not-show')
						}
						scope.click3 = function() {
							scope.tabIndex = 3
							if (!table3) {
								tableParams.id = '#sample_3'
								if (attrs.companyCond) {
									tableParams.conditionsBig = scope.companyCond[3]
								} else {
									tableParams.conditionsBig = {
										status: 1
									}
								}
								tableParams.conditions = attrs.searchScope
									? scope.searchScope
									: scope.$parent.searchDetail;
								scope.tables[3] = table3 = dataTable.new(tableParams, scope)
							} else {
								table3.tableSearch(attrs.searchScope
									? scope.searchScope
									: scope.$parent.searchDetail)
							}
							elem.children('div:eq(3)').removeClass('table-not-show')
							elem.children('div:eq(1)').addClass('table-not-show')
							elem.children('div:eq(2)').addClass('table-not-show')
							elem.children('div:eq(0)').addClass('table-not-show')
						}
					}
				};
			}
		]);
		MetronicApp.directive('modalPrinting', [
			'$compile',
			'ajax1',
			'$rootScope',
			'intoBarcode',
			function($compile, ajax1, $rootScope, intoBarcode) {
				return {
					restrict: 'E',
					transclude: true,
					scope: {
						modalId: '@',
						modalTitle: '@',
						modalDetail: '=',
						modalUrl: '@',
						modalType: '='
					},
					templateUrl: 'tpl/modalPrinting.html',
					link: function(scope, elem, attrs, ctrl, transclude) {
						elem.find('.modal.fade').attr('id', scope.modalId);
						transclude(scope, function(clone, scope) {
							elem.find('.portlet-body').append(clone);
							// Metronic.initUniform()
							//由于操作了DOM，这里要重新compile
							// $compile(clone)(scope)
						});
						scope.barcodeTypeList = [
							{
								id: 1,
								name: '包裹大码'
							},
							// {
							// 	id: 2,
							// 	name: '货物小码'
							// }
							{
								id: 3,
								name: '包裹小码'
							}
						]
						scope.$watch('modalType', function(newvalue, oldvalue) {
							scope.barcodeType = parseInt(scope.modalType);
						}, true);
						scope.modalOk = function() {
							ajax1(scope.modalUrl, {
								"barcodeType": scope.barcodeType,
								"relateId": scope.modalDetail.id
							}).then(function(data) {
								data.obj.forEach((n) => {
									n.url = intoBarcode.new(n.uid);
								})
								window.localStorage.printingDetail = JSON.stringify(data.obj);
								if (scope.barcodeType === 1) {
									window.open('#/printing', '_blank');
								} else {
									window.open('#/printing-small', '_blank');
								}
							});
						}
						elem.on('hide.bs.modal', function() {
							scope.$broadcast('clearModel')
						})
					}
				};
			}
		]);
		MetronicApp.directive('modalPrintingOut', [
			'$compile',
			'ajax1',
			'$rootScope',
			'intoBarcode',
			function($compile, ajax1, $rootScope, intoBarcode) {
				return {
					restrict: 'E',
					transclude: true,
					scope: {
						modalId: '@',
						modalTitle: '@',
						modalDetail: '=',
						modalUrl: '@',
						modalType: '='
					},
					templateUrl: 'tpl/modalPrintingOut.html',
					link: function(scope, elem, attrs, ctrl, transclude) {
						elem.find('.modal.fade').attr('id', scope.modalId);
						transclude(scope, function(clone, scope) {
							elem.find('.portlet-body').append(clone);
							// Metronic.initUniform()
							//由于操作了DOM，这里要重新compile
							// $compile(clone)(scope)
						});
						scope.barcodeTypeList = [
							{
								id: 1,
								name: '包裹大码'
							}, {
								id: 2,
								name: '货物小码'
							}, {
								id: 3,
								name: '包裹小码'
							}
						]
						scope.$watch('modalType', function(newvalue, oldvalue) {
							scope.barcodeType = parseInt(scope.modalType);
						}, true);
						scope.modalOk = function() {
							ajax1(scope.modalUrl, scope.modalDetail[9]).then(function(data) {
								data.obj.forEach((n) => {
									n.url = intoBarcode.new(n.uid);
								})
								window.localStorage.printingDetail = JSON.stringify(data.obj);
								if (scope.barcodeType === 1) {
									window.open('#/printing', '_blank');
								} else {
									window.open('#/printing-small', '_blank');
								}
							});
						}
						elem.on('hide.bs.modal', function() {
							scope.$broadcast('clearModel')
						})
					}
				};
			}
		]);
		MetronicApp.directive('modalPrintingOut2', [
			'$compile',
			'ajax1',
			'$rootScope',
			'intoBarcode',
			function($compile, ajax1, $rootScope, intoBarcode) {
				return {
					restrict: 'E',
					transclude: true,
					scope: {
						modalId: '@',
						modalTitle: '@',
						modalDetail: '=',
						modalUrl: '@',
						modalType: '='
					},
					templateUrl: 'tpl/modalPrintingOut2.html',
					link: function(scope, elem, attrs, ctrl, transclude) {
						elem.find('.modal.fade').attr('id', scope.modalId);
						transclude(scope, function(clone, scope) {
							elem.find('.portlet-body').append(clone);
							// Metronic.initUniform()
							//由于操作了DOM，这里要重新compile
							// $compile(clone)(scope)
						});
						scope.barcodeTypeList = [
							{
								id: 1,
								name: '包裹大码'
							}, {
								id: 2,
								name: '货物小码'
							}, {
								id: 3,
								name: '包裹小码'
							}
						]
						scope.$watch('modalType', function(newvalue, oldvalue) {
							scope.barcodeType = parseInt(scope.modalType);
						}, true);
						scope.modalOk = function() {
							ajax1(scope.modalUrl, {
								"barcodeType": scope.barcodeType,
								"whseId": scope.modalDetail[9],
								"productId": scope.modalDetail[10]
							}).then(function(data) {
								data.obj.forEach((n) => {
									n.url = intoBarcode.new(n.uid);
								})
								window.localStorage.printingDetail = JSON.stringify(data.obj);
								if (scope.barcodeType === 1) {
									window.open('#/printing', '_blank');
								} else {
									window.open('#/printing-small', '_blank');
								}
							});
						}
						elem.on('hide.bs.modal', function() {
							scope.$broadcast('clearModel')
						})
					}
				};
			}
		]);
		// MetronicApp.directive('toBarcode', [
		// 	'$compile',
		// 	'$rootScope',
		// 	'intoBarcode',
		// 	function($compile, $rootScope, intoBarcode) {
		// 		return {
		// 			restrict: 'E',
		// 			transclude: true,
		// 			scope: {
		// 				modalDetail: '='
		// 			},
		// 			templateUrl: 'tpl/tobarcode.html',
		// 			link: function(scope, elem, attrs, ctrl, transclude) {
		// 				elem.find('.modal.fade').attr('id', scope.modalId);
		// 				transclude(scope, function(clone, scope) {
		// 					elem.find('.portlet-body').append(clone);
		// 					// Metronic.initUniform()
		// 					//由于操作了DOM，这里要重新compile
		// 					// $compile(clone)(scope)
		// 					intoBarcode.new(elem, scope.modalDetail);
		// 				});
		// 			}
		// 		};
		// 	}
		// ]);
		/*
dialog(created by sunhan on 2017/02/14)
	example:
		<vi-dialog title="test" width="600" ng-if="dialogVisible">
			<div class="dialog-content">...</div> //dialog正文
			<div class="dialog-footer">...</div>  //dialog底部
		</vi-dialog>
 */
		MetronicApp.directive('viDialog', [
			'$compile',
			function($compile) {
				return {
					restrict: 'E',
					transclude: true,
					scope: {
						title: '@',
						width: '@'
					},
					templateUrl: 'tpl/common/viDialog.html',
					link: function(scope, elem, attrs, ctrl, transclude) {
						var dialogWidth = scope.width || 650;
						elem.find('.vi-dialog').css({
							'width': dialogWidth,
							'left': ($('body').width() - dialogWidth) / 2
						})
						transclude(scope, function(clone, scope) {
							elem.find('.vi-dialog-content div').append(clone[1])
							elem.find('.vi-dialog-footer').append(clone[3])
						});
						scope.hide = function() {
							scope.$parent.$parent.dialogVisible = false;
						}
					}
				};
			}
		]);
		/*
new dataTable (created by sunhan on 2017/02/18)
	example:
		<table-tab2
	        table-params="tableParams"
	        table="table"
	        tabs="[{
                'index': 1,
                'name': 'tab1'
            }, {
                'index': 2,
                'name': 'tab2'
            }]"
	        active="1">
	    </table-tab2>
 */
		MetronicApp.directive('tableTab2', [
			'dataTable',
			'$timeout',
			'queryFilter',
			'$compile',
			'userNow',
			function(dataTable, $timeout, queryFilter, $compile, userNow) {
				return {
					restrict: 'E',
					templateUrl: 'tpl/tableTab2.html',
					scope: {
						tableParams: '=',
						table: '=',
						hideTab: '@',
						tabs: '=',
						active: '@'
					},
					link: function(scope, elem, attrs) {
						var tableParams = scope.tableParams;
						$timeout(function() {
							scope.click(parseInt(scope.active));
						})
						var tableInstance;
						scope.click = function(index) {
							scope.active = index;
							tableParams.conditionsBig = {
								tabIndex: index //传给后台的tab参数
							}
							if (!tableInstance) {
								tableParams.id = '#sample_1'
								tableParams.conditions = scope.$parent.searchDetail;
								scope.table = tableInstance = dataTable.new(tableParams, scope);
							} else {
								tableInstance.tableSearch(scope.$parent.searchDetail, tableParams.conditionsBig)
							}
						};
					}
				};
			}
		]);
