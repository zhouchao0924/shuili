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
	//权限控制按钮隐藏显示
	MetronicApp.directive('buttonShow', [
		'$rootScope',
		function($rootScope) {
			return {
				restrict: 'A',
				link: function(scope, elem, attrs, ctrl) {
					if ($rootScope.adminID == 0) {
						elem.css('display', 'none');
					}
				}
			};
		}
	]);
	//权限控制按钮隐藏显示
	MetronicApp.directive('sidebarShow', [
		'$rootScope',
		function($rootScope) {
			return {
				restrict: 'A',
				link: function(scope, elem, attrs, ctrl) {
					var b = JSON.parse(window.localStorage.Userdata);
					if (b.roleId == 0 || b.roleId == 1) {
						elem.css('display', 'none');
					}
				}
			};
		}
	]);
