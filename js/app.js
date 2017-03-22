/***
Metronic AngularJS App Main Script11
***/
/* Metronic App */
window.MetronicApp = angular.module("MetronicApp", ["ui.router", "ui.bootstrap", "oc.lazyLoad", "ngSanitize"]);
MetronicApp.version = '20161021';
/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config([
	'$ocLazyLoadProvider',
	function($ocLazyLoadProvider) {
		$ocLazyLoadProvider.config({
			// global configs go here
		});
	}
]);
/* Setup global settings */
MetronicApp.factory('settings', [
	'$rootScope',
	function($rootScope) {
		// supported languages
		var settings = {
			layout: {
				pageSidebarClosed: false, // sidebar menu state
				pageBodySolid: false, // solid body color state
				pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
			},
			layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
			layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
		};
		$rootScope.settings = settings;
		return settings;
	}
]);
/* Setup App Main Controller */
MetronicApp.controller('AppController', [
	'$scope',
	'$rootScope',
	'$cacheFactory',
	'$location',
	'ajaxCache',
	'$window',
	'userNow',
	function($scope, $rootScope, $cacheFactory, $location, ajaxCache, $window, userNow) {
		if (window.localStorage.aijiaUserdata) {
			var a = JSON.parse(window.localStorage.aijiaUserdata);
		} else {
			window.localStorage.removeItem('aijiaUserdata');
			window.location.href = 'login.html';
		}
		$(document).ajaxComplete(function(e, xhr) {
			var d = JSON.parse(xhr.responseText)
			if (d.code == 3) {
				userNow.timeout()
			}
		})
		$rootScope.curPage = {};
		if (!$rootScope.curPage.menuListPromise) {
			$rootScope.curPage.menuListPromise = new Promise(function(resolve, reject) {
				ajaxCache('/resource/init/', {roleCode: 0}).then(function(data) {
					resolve(data.obj.childList);
				})
			});
		}
		window.pageHistorys = []
		$rootScope.$on('$locationChangeSuccess', function() {
			window.pageHistorys.push($location.$$path);
		});
		$rootScope.$on('$viewContentLoading', function(event, viewConfig) {
			$window.scrollTo(0, 0)
			$rootScope.curPage.buttonStatusPromise = new Promise(function(resolve, reject) {
				$rootScope.curPage.menuListPromise.then(function(data) {
					$rootScope.curPage.curMenuId = getCurMenuId(data);
					$.ajax({
						url: Metronic.host + '/resource/quertyPropsByAdminId/' + userNow.userId + '/' + userNow.sessionId,
						type: 'POST',
						dataType: 'json',
						data: JSON.stringify({menuId: $rootScope.curPage.curMenuId}),
						success: function(data) {
							if (data.code == 1) {
								$rootScope.curPage.buttonStatus = data.obj;
								$rootScope.curPage.lastMenuId = $rootScope.curPage.curMenuId;
								resolve();
							}
						},
						error: function(xhr, data, status) {
							alert('请检查网络');
						}
					});
				});
			});
			// Access to all the view config properties.
			// and one special property 'targetView'
			// viewConfig.targetView
		});
		function getCurMenuId(list) {
			var result;
			var url = $location.url();
			for (var i = 0; i < list.length; i++) {
				var a = list[i].url && list[i].url.match(/[\w\-]+/);
				var b = url.match(/[\w\-]+/);
				if (a && a[0] === 'orders') {
					a = list[i].url.match(/[\w\-]+(\/\d)*/);
					b = url.match(/[\w\-]+(\/\d)*/);
				}
				if (a && a[0] === b[0]) {
					return list[i].key;
				}
				if (list[i].childList && list[i].childList.length) {
					result = getCurMenuId(list[i].childList);
				}
				if (result) {
					return result;
				}
			}
		};
		// $scope.$on('changeItem', function(event, item) {
		//     $scope.$broadcast('itemChanged', item);
		// })
		$scope.$on('$viewContentLoaded', function() {
			Metronic.initComponents(); // init core components
			//Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
			if (window.localStorage.aijiaUserdata) {
				$('.username').text(a.username);
			}
			$scope.quit = function() {
				window.localStorage.removeItem('aijiaUserdata');
				window.location.href = 'login.html';
			}
			// Metronic.scrollTo(0);
		});
	}
]);
/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/
/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', [
	'$scope',
	'$rootScope',
	function($scope, $rootScope) {
		$scope.$on('$includeContentLoaded', function() {
			var a = JSON.parse(window.localStorage.aijiaUserdata);
			$scope.menuList = a.menuList;
			Layout.initHeader(); // init header
			$scope.pushmenu = function(item) {
				$rootScope.leftmenuList = item;
				window.localStorage.childrenmenuList = JSON.stringify(item);
				$rootScope.leftmenuList = JSON.parse(window.localStorage.childrenmenuList);
			};
			$rootScope.leftmenuList = JSON.parse(window.localStorage.childrenmenuList);
		});
	}
]);
/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', [
	'$scope',
	'$rootScope',
	function($scope, $rootScope) {
		$scope.$on('$includeContentLoaded', function() {
			// // 首先渲染侧边栏
			// var a = JSON.parse(window.localStorage.aijiaUserdata);
			// // $('.page-sidebar-menu .start').hide();
			Layout.initSidebar(); // init sidebar
		});
	}
]);
/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', [
	'$scope',
	function($scope) {
		$scope.$on('$includeContentLoaded', function() {
			setTimeout(function() {
				QuickSidebar.init(); // init quick sidebar
			}, 2000)
		});
	}
]);
/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', [
	'$scope',
	function($scope) {
		$scope.$on('$includeContentLoaded', function() {
			Demo.init(); // init theme panel
		});
	}
]);
/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', [
	'$scope',
	function($scope) {
		$scope.$on('$includeContentLoaded', function() {
			Layout.initFooter(); // init footer
		});
	}
]);
// MetronicApp.provider('runtimeStates', function runtimeStates($stateProvider) {
//     // runtime dependencies for the service can be injected here, at the provider.$get() function.
//     this.$get = function($q, $timeout, $state) { // for example
//         return $stateProvider
//     }
// });
/* Setup Rounting For All Pages */
MetronicApp.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		window.$stateProviderRef = $stateProvider
		// Redirect any unmatched url
		$urlRouterProvider.otherwise("/dashboard.html");
		$stateProvider.state('dashboard', {
			url: "/dashboard.html",
			templateUrl: "views/dashboard.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '概况'
			},
			controller: "DashboardController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
							files: [
								'assets/global/plugins/morris/morris.css?v=' + MetronicApp.version,
								'assets/admin/pages/css/tasks.css?v=' + MetronicApp.version,
								'js/controllers/DashboardController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('dispatching', {
			url: "/dispatching",
			templateUrl: "views/dispatching.html?v=" + MetronicApp.version,
			data: {
				pageTitle: 'dispatching'
			},
			controller: "dispatchingController as searchDetail",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jstree/dist/jstree.min.js?v=' + MetronicApp.version,
								'js/directives/dispatchingDirective.js?v=' + MetronicApp.version,
								'js/scripts/dispatching-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/dispatchingController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('dispatching-new', {
			url: "/dispatching-new/:id",
			templateUrl: "views/dispatching_new.html?v=" + MetronicApp.version,
			data: {
				pageTitle: 'dispatching-new'
			},
			controller: "dispatchingNewController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/directives/dispatchingDirective.js?v=' + MetronicApp.version,
								'js/controllers/dispatchingNewController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('edit-dispatching-detail', {
			url: "/edit-dispatching-detail/:id",
			templateUrl: "views/edit_dispatching_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '派工单详情'
			},
			controller: "editDispatchingDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/controllers/editDispatchingDetailController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('customservice', {
			url: "/customservice",
			templateUrl: "views/customservice.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '客服记录'
			},
			controller: "customserviceController as searchDetail",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jstree/dist/jstree.min.js?v=' + MetronicApp.version,
								'js/directives/orderDirective.js?v=' + MetronicApp.version,
								'js/controllers/customserviceController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('customservice-new', {
			url: "/customservice-new",
			templateUrl: "views/customservice_new.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增客服记录'
			},
			controller: "customserviceNewController as dispatching",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: ['js/controllers/customserviceNewController.js?v=' + MetronicApp.version]
						});
					}
				]
			}
		}).state('customservice-edit', {
			url: "/customservice-edit/:id",
			templateUrl: "views/customservice_new.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '编辑客服记录'
			},
			controller: "customserviceEditController as dispatching",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: ['js/controllers/customserviceEditController.js?v=' + MetronicApp.version]
						});
					}
				]
			}
		}).state('cache-orders', {
			url: "/cache-orders",
			templateUrl: "views/cache_orders.html?v=" + MetronicApp.version,
			data: {
				pageTitle: 'cache-orders'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'js/scripts/cache-order-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/GeneralPageController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('reject-order-detail', {
			url: "/reject-order-detail/:orderId/:orderOriginId",
			templateUrl: "views/reject_order_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '订单详情'
			},
			controller: "rejectOrderDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/css/plugins.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
									'js/controllers/rejectOrderDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('edit-reject-order-detail', {
			url: "/edit-reject-order-detail/:orderId",
			templateUrl: "views/edit_reject_order_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '订单详情'
			},
			controller: "editRejectOrderDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/editRejectOrderDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		})
		// Form Tools
			.state('good-detail1', {
			url: "/good-detail1/:id",
			templateUrl: "views/good_detail1.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '商品详情'
			},
			controller: "goodDetailController1",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.css?v=' + MetronicApp.version,
									'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/handlebars.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.bundle.min.js?v=' + MetronicApp.version,
									'assets/admin/pages/scripts/components-form-tools.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/goodDetailController1.js?v=' + MetronicApp.version,
									'js/directives/assemblymanageDirective.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/themes/default/css/umeditor.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/umeditor.config.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/umeditor.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/plupload/plupload.full.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/qiniu.min.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		})
		// Form Tools
			.state('good-detail-edit', {
			url: "/good-detail-edit/:id",
			templateUrl: "views/good_detail_edit.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '商品详情'
			},
			controller: "goodDetailController1",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.css?v=' + MetronicApp.version,
									'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/handlebars.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.bundle.min.js?v=' + MetronicApp.version,
									'assets/admin/pages/scripts/components-form-tools.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/goodDetailController1.js?v=' + MetronicApp.version,
									'js/directives/assemblymanageDirective.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/themes/default/css/umeditor.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/umeditor.config.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/umeditor.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/plupload/plupload.full.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/qiniu.min.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('good-detail-confirm', {
			url: "/good-detail-confirm/:id",
			templateUrl: "views/good_detail_confirm.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '商品详情'
			},
			controller: "goodDetailController1",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.css?v=' + MetronicApp.version,
									'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/handlebars.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.bundle.min.js?v=' + MetronicApp.version,
									'assets/admin/pages/scripts/components-form-tools.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/goodDetailController1.js?v=' + MetronicApp.version,
									'js/directives/assemblymanageDirective.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/themes/default/css/umeditor.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/umeditor.config.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/umeditor.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/plupload/plupload.full.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/qiniu.min.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('good-detail-draft', {
			url: "/good-detail-draft/:id",
			templateUrl: "views/good_detail_draft.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '商品详情'
			},
			controller: "goodDetailController1",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.css?v=' + MetronicApp.version,
									'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/handlebars.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.bundle.min.js?v=' + MetronicApp.version,
									'assets/admin/pages/scripts/components-form-tools.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/goodDetailController1.js?v=' + MetronicApp.version,
									'js/directives/assemblymanageDirective.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/themes/default/css/umeditor.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/umeditor.config.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/umeditor.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/plupload/plupload.full.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/qiniu.min.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		})
		// Form Tools
			.state('good-img-detail', {
			url: "/good-img-detail/:goodId",
			templateUrl: "views/good_img_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '商品图文详情'
			},
			controller: "goodImgDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.css?v=' + MetronicApp.version,
									'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/handlebars.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.bundle.min.js?v=' + MetronicApp.version,
									'assets/admin/pages/scripts/components-form-tools.js?v=' + MetronicApp.version,
									'js/controllers/goodImgDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('estate-detail', {
			url: "/estate-detail",
			templateUrl: "views/estate_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '楼盘详情'
			},
			controller: "estateDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/directives/buildingDirective.js?v=' + MetronicApp.version,
									'js/controllers/estateDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('apartment-detail', {
			url: "/apartment-detail/:buildingId",
			templateUrl: "views/apartment_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '楼盘维护户型详情'
			},
			controller: "apartmentDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.css?v=' + MetronicApp.version,
									'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/handlebars.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.bundle.min.js?v=' + MetronicApp.version,
									'assets/admin/pages/scripts/components-form-tools.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/apartmentDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('articles', {
			url: "/articles",
			templateUrl: "views/articles.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '文章列表'
			},
			controller: "articlesController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
									'js/scripts/article-table-advanced.js?v=' + MetronicApp.version,
									'js/controllers/articlesController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('article-detail', {
			url: "/article-detail",
			templateUrl: "views/article_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '文章列表'
			},
			controller: "articleDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.css?v=' + MetronicApp.version,
									'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/handlebars.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.bundle.min.js?v=' + MetronicApp.version,
									'assets/admin/pages/scripts/components-form-tools.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/articleDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('edit-article-detail', {
			url: "/edit-article-detail/:articleId",
			templateUrl: "views/edit_article_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '文章列表'
			},
			controller: "editArticleDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.css?v=' + MetronicApp.version,
									'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/handlebars.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/typeahead/typeahead.bundle.min.js?v=' + MetronicApp.version,
									'assets/admin/pages/scripts/components-form-tools.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/editArticleDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('historic', {
			url: "/historic",
			templateUrl: "views/historic.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '历史任务'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'js/scripts/historic-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/GeneralPageController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('shopping-cart-detail', {
			url: "/shopping-cart-detail/:customerId",
			templateUrl: "views/shopping_cart_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '购物车商品'
			},
			controller: "shoppingCartDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: ['js/controllers/shoppingCartDetailController.js?v=' + MetronicApp.version]
							}
						]);
					}
				]
			}
		}).state('post-deposit-new', {
			url: "/post-deposit-new/:fidBuilding/:mobile",
			templateUrl: "views/post_deposit_new.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增定金'
			},
			controller: "postDepositNewController as customer",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
									'js/directives/customersDirective.js?v=' + MetronicApp.version,
									'js/controllers/postDepositNewController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('deposits', {
			url: "/deposits",
			templateUrl: "views/deposits.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '订金列表'
			},
			controller: "DepositsController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/scripts/deposit-table-advanced.js?v=' + MetronicApp.version,
									'js/controllers/DepositsController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('deposit-detail', {
			url: "/deposit-detail",
			templateUrl: "views/deposit_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '订金详情'
			},
			controller: "depositDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/depositDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('view-deposit-detail', {
			url: "/view-deposit-detail/:depositId",
			templateUrl: "views/view_deposit_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '订金详情'
			},
			controller: "viewDepositDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/viewDepositDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('deposit-receive-detail', {
			url: "/deposit-receive-detail/:depositId",
			templateUrl: "views/deposit_receive_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '订金详情'
			},
			controller: "depositReceiveDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/depositReceiveDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('deposit-refund-detail', {
			url: "/deposit-refund-detail/:depositId",
			templateUrl: "views/deposit_refund_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '订金详情'
			},
			controller: "depositRefundDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/depositRefundDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('feedbacks', {
			url: "/feedbacks",
			templateUrl: "views/feedbacks.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '意见反馈列表'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/scripts/feedback-table-advanced.js?v=' + MetronicApp.version,
									'js/controllers/GeneralPageController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('generate-purchase-order-detail', {
			url: "/generate-purchase-order-detail",
			templateUrl: "views/generate_purchase_order_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '生成采购单'
			},
			controller: "generatePurchaseOrderDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/controllers/generatePurchaseOrderDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('purchase-orders', {
			url: "/purchase-orders/:statusId",
			templateUrl: "views/purchase_orders.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '采购单'
			},
			controller: "PurchaseOrdersController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'js/scripts/purchase-order-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/PurchaseOrdersController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('edit-purchase-order-detail', {
			url: "/edit-purchase-order-detail/:orderId",
			templateUrl: "views/edit_purchase_order_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '采购订单详情'
			},
			controller: "editPurchaseOrderDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/fuelux/js/spinner.min.js', 'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/editPurchaseOrderDetailController.js?v=' + MetronicApp.version,
									'js/directives/invoicingProductSelect.js?v=' + MetronicApp.version,
									'js/directives/invoicingSplitStock.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('edit-purchase-order', {
			url: "/edit-purchase-order/:orderId",
			templateUrl: "views/generate_purchase_order_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '修改采购单'
			},
			controller: "generatePurchaseOrderDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/controllers/generatePurchaseOrderDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('sale-goals', {
			url: "/sale-goals",
			templateUrl: "views/sale_goals.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '销售目标'
			},
			controller: "SaleGoalsController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'js/controllers/SaleGoalsController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('sale-goal-detail', {
			url: "/sale-goal-detail",
			templateUrl: "views/sale_goal_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增销售目标'
			},
			controller: "saleGoalDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
									'js/controllers/saleGoalDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('sale-person-goal-detail', {
			url: "/sale-person-goal-detail",
			templateUrl: "views/sale_person_goal_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增销售目标'
			},
			controller: "salePersonGoalDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/salePersonGoalDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('brands', {
			url: "/brands",
			templateUrl: "views/brands.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '品牌管理'
			},
			controller: "BrandsController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#ng_load_plugins_before',
							files: ['assets/global/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js?v=' + MetronicApp.version]
						}).then(function() {
							return $ocLazyLoad.load({
								name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/fancytree/dist/skin-bootstrap/ui.fancytree.css?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/fancytree/dist/jquery.fancytree-all.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/BrandsController.js?v=' + MetronicApp.version
								]
							});
						})
					}
				]
			}
		}).state('suppliers', {
			url: "/suppliers",
			templateUrl: "views/suppliers.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '供应商管理'
			},
			controller: "suppliersController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: ['assets/global/plugins/amcharts/amcharts/amcharts.js?v=' + MetronicApp.version]
							}
						]).then(function() {
							return $ocLazyLoad.load([
								{
									name: 'MetronicApp',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/jstree/dist/themes/default/style.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/amcharts/amcharts/pie.js?v=' + MetronicApp.version,
										'assets/global/plugins/amcharts/amcharts/themes/light.js?v=' + MetronicApp.version,
										'assets/global/plugins/jstree/dist/jstree.min.js?v=' + MetronicApp.version,
										'js/controllers/suppliersController.js?v=' + MetronicApp.version
									]
								}
							]);
						})
					}
				]
			}
		}).state('supplier-detail', {
			url: "/supplier-detail/:brandId",
			templateUrl: "views/supplier_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '供应商详情'
			},
			controller: "supplierDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/supplierDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('edit-supplier-detail', {
			url: "/edit-supplier-detail/:brandId",
			templateUrl: "views/edit_supplier_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '供应商详情'
			},
			controller: "editSupplierDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/editSupplierDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('series', {
			url: "/series",
			templateUrl: "views/series.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '系列管理'
			},
			controller: "SeriesController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
									'js/scripts/series-table-advanced.js?v=' + MetronicApp.version,
									'js/controllers/SeriesController.js?v=' + MetronicApp.version
								]
							}
						])
					}
				]
			}
		}).state('series-detail', {
			url: "/series-detail",
			templateUrl: "views/series_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '系列详情'
			},
			controller: "seriesDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'ui.select',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/angularjs/plugins/ui-select/select.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/angularjs/plugins/ui-select/select.min.js?v=' + MetronicApp.version
								]
							}, {
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [ // 'assets/global/plugins/jquery.blockui.min.js?v='+MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/seriesDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('outin-warehouse', {
			url: "/outin-warehouse",
			templateUrl: "views/outin_warehouse.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '出入库明细'
			},
			controller: "OutInWarehouseController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/jstree/dist/themes/default/style.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jstree/dist/jstree.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/scripts/outin-warehouse-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/OutInWarehouseController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('view-outin-detail', {
			url: "/view-outin-detail/:stockNo",
			templateUrl: "views/view_outin_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '流转详情'
			},
			controller: "OutInWarehouseDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/jstree/dist/themes/default/style.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jstree/dist/jstree.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/scripts/outin-goodsInfoDetail-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/viewOutInDetailController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('outin-goods-info', {
			url: "/outin-goods-info",
			templateUrl: "views/outin_goods_info.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '商品信息管理'
			},
			controller: "OutinGoodsInfoController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: ['assets/global/plugins/amcharts/amcharts/amcharts.js?v=' + MetronicApp.version]
							}
						]).then(function() {
							return $ocLazyLoad.load([
								{
									name: 'MetronicApp',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/jstree/dist/themes/default/style.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/amcharts/amcharts/pie.js?v=' + MetronicApp.version,
										'assets/global/plugins/amcharts/amcharts/themes/light.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
										'js/scripts/outin-goodsInfo-table-advanced.js?v=' + MetronicApp.version,
										'js/controllers/OutinGoodsInfoController.js?v=' + MetronicApp.version
									]
								}
							]);
						})
					}
				]
			}
		}).state('view-outin-goods-info-detail', {
			url: "/view-outin-goods-info-detail/:productId",
			templateUrl: "views/view_outin_goods_info_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '商品库存详情'
			},
			controller: "OutinGoodsInfoDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: ['assets/global/plugins/amcharts/amcharts/amcharts.js?v=' + MetronicApp.version]
							}
						]).then(function() {
							return $ocLazyLoad.load([
								{
									name: 'MetronicApp',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/jstree/dist/themes/default/style.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/amcharts/amcharts/pie.js?v=' + MetronicApp.version,
										'assets/global/plugins/amcharts/amcharts/themes/light.js?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
										'js/scripts/outin-goodsInfoDetail-table-advanced.js?v=' + MetronicApp.version,
										'js/controllers/ViewOutinGoodsInfoDetailController.js?v=' + MetronicApp.version
									]
								}
							]);
						})
					}
				]
			}
		}).state('storages', {
			url: "/storages",
			templateUrl: "views/storages.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '入库单管理'
			},
			controller: "StoragesController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#ng_load_plugins_before',
							files: ['assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version]
						}).then(function() {
							return $ocLazyLoad.load([
								{
									name: 'MetronicApp',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js?v=' + MetronicApp.version,
										'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
										'js/scripts/storage-table-advanced.js?v=' + MetronicApp.version,
										'js/controllers/StoragesController.js?v=' + MetronicApp.version
									]
								}
							]);
						})
					}
				]
			}
		}).state('storage-detail', {
			url: "/storage-detail",
			templateUrl: "views/storage_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增入库单'
			},
			controller: "storageDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#ng_load_plugins_before',
							files: ['assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version]
						}).then(function() {
							return $ocLazyLoad.load([
								{
									name: 'ui.select',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/angularjs/plugins/ui-select/select.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/angularjs/plugins/ui-select/select.min.js?v=' + MetronicApp.version
									]
								}, {
									name: 'MetronicApp',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js?v=' + MetronicApp.version,
										'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
										'js/scripts/good-table-advanced.js?v=' + MetronicApp.version,
										'js/controllers/GoodsQueryController.js?v=' + MetronicApp.version,
										'js/controllers/storageDetailController.js?v=' + MetronicApp.version
									]
								}
							]);
						})
					}
				]
			}
		}).state('edit-storage-detail', {
			url: "/edit-storage-detail/:ioStockId",
			templateUrl: "views/edit_storage_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '入库单详情'
			},
			controller: "editStorageDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#ng_load_plugins_before',
							files: ['assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version]
						}).then(function() {
							return $ocLazyLoad.load([
								{
									name: 'MetronicApp',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js?v=' + MetronicApp.version,
										'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
										'js/scripts/good-table-advanced.js?v=' + MetronicApp.version,
										'js/controllers/GoodsQueryController.js?v=' + MetronicApp.version,
										'js/controllers/editStorageDetailController.js?v=' + MetronicApp.version
									]
								}
							]);
						})
					}
				]
			}
		}).state('view-storage-detail', {
			url: "/view-storage-detail/:ioStockId/:auditId",
			templateUrl: "views/view_storage_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '入库单详情'
			},
			controller: "viewStorageDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/controllers/viewStorageDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('deliveries', {
			url: "/deliveries",
			templateUrl: "views/deliveries.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '入库单管理'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/scripts/delivery-table-advanced.js?v=' + MetronicApp.version,
									'js/controllers/GeneralPageController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('delivery-detail', {
			url: "/delivery-detail",
			templateUrl: "views/delivery_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增出库单'
			},
			controller: "deliveryDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'ui.select',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/angularjs/plugins/ui-select/select.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/angularjs/plugins/ui-select/select.min.js?v=' + MetronicApp.version
								]
							}, {
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/controllers/deliveryDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('edit-delivery-detail', {
			url: "/edit-delivery-detail/:ioStockId",
			templateUrl: "views/edit_delivery_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '出库单详情'
			},
			controller: "editDeliveryDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'ui.select',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/angularjs/plugins/ui-select/select.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/angularjs/plugins/ui-select/select.min.js?v=' + MetronicApp.version
								]
							}, {
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/controllers/editDeliveryDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('view-delivery-detail', {
			url: "/view-delivery-detail/:ioStockId/:auditId",
			templateUrl: "views/view_delivery_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '入库单详情'
			},
			controller: "viewDeliveryDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/controllers/viewDeliveryDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('allocates', {
			url: "/allocates",
			templateUrl: "views/allocates.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '调拨单'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/scripts/allocate-table-advanced.js?v=' + MetronicApp.version,
									'js/controllers/GeneralPageController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('allocate-detail', {
			url: "/allocate-detail",
			templateUrl: "views/allocate_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增调拨单'
			},
			controller: "allocateDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#ng_load_plugins_before',
							files: ['assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version]
						}).then(function() {
							return $ocLazyLoad.load([
								{
									name: 'ui.select',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/angularjs/plugins/ui-select/select.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/angularjs/plugins/ui-select/select.min.js?v=' + MetronicApp.version
									]
								}, {
									name: 'MetronicApp',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js?v=' + MetronicApp.version,
										'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
										'js/scripts/good-table-advanced.js?v=' + MetronicApp.version,
										'js/controllers/GoodsQueryController.js?v=' + MetronicApp.version,
										'js/controllers/allocateDetailController.js?v=' + MetronicApp.version
									]
								}
							]);
						})
					}
				]
			}
		}).state('view-allocate-detail', {
			url: "/view-allocate-detail/:ioStockId",
			templateUrl: "views/view_allocate_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '调拨单详情'
			},
			controller: "viewAllocateDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: ['js/controllers/viewAllocateDetailController.js?v=' + MetronicApp.version]
							}
						]);
					}
				]
			}
		}).state('cases', {
			url: "/cases",
			templateUrl: "views/cases.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '案例'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/scripts/case-table-advanced.js?v=' + MetronicApp.version,
									'js/controllers/GeneralPageController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('case-detail', {
			url: "/case-detail",
			templateUrl: "views/case_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '案例详情'
			},
			controller: "caseDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css', 'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js', 'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/caseDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('edit-case-detail', {
			url: "/edit-case-detail/:caseId",
			templateUrl: "views/edit_case_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '案例详情'
			},
			controller: "editCaseDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css', 'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js', 'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/editCaseDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('case-img-detail', {
			url: "/case-img-detail/:caseId",
			templateUrl: "views/case_img_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '案例图文详情'
			},
			controller: "caseImgDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
									'js/controllers/caseImgDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('strategies', {
			url: "/strategies",
			templateUrl: "views/strategies.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '攻略'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/scripts/strategy-table-advanced.js?v=' + MetronicApp.version,
									'js/controllers/GeneralPageController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('strategy-detail', {
			url: "/strategy-detail",
			templateUrl: "views/strategy_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '攻略详情'
			},
			controller: "strategyDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css', 'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js', 'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/strategyDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('edit-strategy-detail', {
			url: "/edit-strategy-detail/:strategyId",
			templateUrl: "views/edit_strategy_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '攻略详情'
			},
			controller: "editStrategyDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css', 'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js', 'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/editStrategyDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('strategy-img-detail', {
			url: "/strategy-img-detail/:strategyId",
			templateUrl: "views/strategy_img_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '攻略图文详情'
			},
			controller: "strategyImgDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
									'js/controllers/strategyImgDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('consult', {
			url: "/consult",
			templateUrl: "views/consult.html?v=" + MetronicApp.version,
			data: {
				pageTitle: 'consult'
			},
			controller: "consultController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/scripts/table-advanced.js?v=' + MetronicApp.version,
								'assets/admin/pages/scripts/ui-confirmations.js?v=' + MetronicApp.version,
								'js/controllers/consultController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('bbc-progress-detail', {
			url: "/bbc-progress-detail/:projectId",
			templateUrl: "views/bbc_progress_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: 'BBC进度反馈详情'
			},
			controller: "bbcProgressDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/controllers/bbcProgressDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('view-bbc-detail', {
			url: "/view-bbc-detail/:projectId",
			templateUrl: "views/view_bbc_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '项目详情'
			},
			controller: "viewBbcDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: ['js/controllers/viewBbcDetailController.js?v=' + MetronicApp.version]
							}
						]);
					}
				]
			}
		}).state('view-bbc-progress-detail', {
			url: "/view-bbc-progress-detail/:projectId",
			templateUrl: "views/view_bbc_progress_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: 'BBC进度反馈详情'
			},
			controller: "viewBbcProgressDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: ['js/controllers/viewBbcProgressDetailController.js?v=' + MetronicApp.version]
							}
						]);
					}
				]
			}
		}).state('menu-manage', {
			url: "/menu-manage",
			templateUrl: "views/menu_manage.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '菜单管理'
			},
			controller: "menuManageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/jstree/dist/themes/default/style.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jstree/dist/3.2.1/jstree.min.js',
									'js/controllers/menuManageController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('printing', {
			url: "/printing",
			templateUrl: "views/printing.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '条码打印'
			},
			controller: "printingController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: ['js/controllers/printingController.js?v=' + MetronicApp.version]
							}
						]);
					}
				]
			}
		}).state('printing-small', {
			url: "/printing-small",
			templateUrl: "views/printingsmall.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '条码打印'
			},
			controller: "printingSmallController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: ['js/controllers/printingSmallController.js?v=' + MetronicApp.version]
							}
						]);
					}
				]
			}
		}).state('stockin', {
			url: "/stockin",
			templateUrl: "views/stockin.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '入库单管理'
			},
			controller: "StockinController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#ng_load_plugins_before',
							files: ['assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version]
						}).then(function() {
							return $ocLazyLoad.load([
								{
									name: 'MetronicApp',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js?v=' + MetronicApp.version,
										'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
										'js/scripts/stockin-table-advanced.js?v=' + MetronicApp.version,
										'js/controllers/StockinController.js?v=' + MetronicApp.version
									]
								}
							]);
						})
					}
				]
			}
		}).state('stockin-detail', {
			url: "/stockin-detail",
			templateUrl: "views/stockin_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增入库单'
			},
			controller: "stockinDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/stockinDetailController.js?v=' + MetronicApp.version,
									'js/directives/invoicingProductSelect.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('edit-stockin-detail', {
			url: "/edit-stockin-detail/:stockInId",
			templateUrl: "views/edit_stockin_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '入库单详情'
			},
			controller: "editStockinDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/controllers/editStockinDetailController.js?v=' + MetronicApp.version,
									'js/directives/invoicingProductSelect.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('view-stockin-detail', {
			url: "/view-stockin-detail/:stockInId",
			templateUrl: "views/view_stockin_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '入库单详情'
			},
			controller: "viewStockinDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/controllers/viewStockinDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('stockout', {
			url: "/stockout",
			templateUrl: "views/stockout.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '出库单管理'
			},
			controller: "StockoutController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#ng_load_plugins_before',
							files: ['assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version]
						}).then(function() {
							return $ocLazyLoad.load([
								{
									name: 'MetronicApp',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js?v=' + MetronicApp.version,
										'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
										'js/scripts/stockout-table-advanced.js?v=' + MetronicApp.version,
										'js/controllers/StockoutController.js?v=' + MetronicApp.version
									]
								}
							]);
						})
					}
				]
			}
		}).state('stockout-detail', {
			url: "/stockout-detail",
			templateUrl: "views/stockout_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增出库单'
			},
			controller: "stockoutDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'js/controllers/stockoutDetailController.js?v=' + MetronicApp.version,
									'js/directives/invoicingProductSelect.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('edit-stockout-detail', {
			url: "/edit-stockout-detail/:stockOutId",
			templateUrl: "views/edit_stockout_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '出库单详情'
			},
			controller: "editStockoutDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/controllers/editStockoutDetailController.js?v=' + MetronicApp.version,
									'js/directives/invoicingProductSelect.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('view-stockout-detail', {
			url: "/view-stockout-detail/:stockOutId",
			templateUrl: "views/view_stockout_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '出库单详情'
			},
			controller: "viewStockoutDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version, // 'asets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v='+MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/controllers/viewStockoutDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('allots', {
			url: "/allots",
			templateUrl: "views/allots.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '调拨单管理'
			},
			controller: "AllotsController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#ng_load_plugins_before',
							files: ['assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version]
						}).then(function() {
							return $ocLazyLoad.load([
								{
									name: 'MetronicApp',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js?v=' + MetronicApp.version,
										'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
										'js/scripts/allots-table-advanced.js?v=' + MetronicApp.version,
										'js/controllers/AllotsController.js?v=' + MetronicApp.version
									]
								}
							]);
						})
					}
				]
			}
		}).state('allot-detail', {
			url: "/allot-detail",
			templateUrl: "views/allot_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增调拨单'
			},
			controller: "allotDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#ng_load_plugins_before',
							files: ['assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version]
						}).then(function() {
							return $ocLazyLoad.load([
								{
									name: 'MetronicApp',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/fuelux/js/spinner.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js?v=' + MetronicApp.version,
										'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
										'js/controllers/allotDetailController.js?v=' + MetronicApp.version,
										'js/directives/invoicingProductSelect.js?v=' + MetronicApp.version,
										'js/directives/productsDirective.js?v=' + MetronicApp.version
									]
								}
							]);
						})
					}
				]
			}
		}).state('edit-allot-detail', {
			url: "/edit-allot-detail/:stockAllotId",
			templateUrl: "views/edit_allot_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '调拨单详情'
			},
			controller: "editAllotDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							insertBefore: '#ng_load_plugins_before',
							files: ['assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version]
						}).then(function() {
							return $ocLazyLoad.load([
								{
									name: 'MetronicApp',
									insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
									files: [
										'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
										'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js?v=' + MetronicApp.version,
										'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
										'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
										'js/controllers/editAllotDetailController.js?v=' + MetronicApp.version,
										'js/directives/invoicingProductSelect.js?v=' + MetronicApp.version,
										'js/directives/productsDirective.js?v=' + MetronicApp.version
									]
								}
							]);
						})
					}
				]
			}
		}).state('view-allot-detail', {
			url: "/view-allot-detail/:stockAllotId",
			templateUrl: "views/view_allot_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '出库单详情'
			},
			controller: "viewAllotDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version, // 'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v='+MetronicApp.version,
									'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
									'js/controllers/viewAllotDetailController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('you-are-awesome', {
			url: "/you-are-awesome",
			templateUrl: "views/you_are_awesome.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '致谢'
			},
			// controller: "viewAllotDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: []
							}
						]);
					}
				]
			}
		})
		// AngularJS plugins
			.state('fileupload', {
			url: "/file_upload.html",
			templateUrl: "views/file_upload.html",
			data: {
				pageTitle: 'AngularJS File Upload'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'angularFileUpload',
								files: ['assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js']
							}, {
								name: 'MetronicApp',
								files: ['js/controllers/GeneralPageController.js']
							}
						]);
					}
				]
			}
		})
		// UI Select
			.state('uiselect', {
			url: "/ui_select.html",
			templateUrl: "views/ui_select.html",
			data: {
				pageTitle: 'AngularJS Ui Select'
			},
			controller: "UISelectController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'ui.select',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: ['assets/global/plugins/angularjs/plugins/ui-select/select.min.css', 'assets/global/plugins/angularjs/plugins/ui-select/select.js']
							}, {
								name: 'MetronicApp',
								files: ['js/controllers/UISelectController.js']
							}
						]);
					}
				]
			}
		})
		// UI Bootstrap
			.state('uibootstrap', {
			url: "/ui_bootstrap.html",
			templateUrl: "views/ui_bootstrap.html",
			data: {
				pageTitle: 'AngularJS UI Bootstrap'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								files: ['js/controllers/GeneralPageController.js']
							}
						]);
					}
				]
			}
		})
		// Tree View
			.state('tree', {
			url: "/tree",
			templateUrl: "views/tree.html",
			data: {
				pageTitle: 'jQuery Tree View'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: ['assets/global/plugins/jstree/dist/themes/default/style.min.css', 'assets/global/plugins/jstree/dist/jstree.min.js', 'assets/admin/pages/scripts/ui-tree.js', 'js/controllers/GeneralPageController.js']
							}
						]);
					}
				]
			}
		})
		// Form Tools
			.state('formtools', {
			url: "/form-tools",
			templateUrl: "views/form_tools.html",
			data: {
				pageTitle: 'Form Tools'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
									'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
									'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
									'assets/global/plugins/typeahead/typeahead.css',
									'assets/global/plugins/fuelux/js/spinner.min.js',
									'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
									'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
									'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
									'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
									'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
									'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
									'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
									'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
									'assets/global/plugins/typeahead/handlebars.min.js',
									'assets/global/plugins/typeahead/typeahead.bundle.min.js',
									'assets/admin/pages/scripts/components-form-tools.js',
									'js/controllers/GeneralPageController.js'
								]
							}
						]);
					}
				]
			}
		})
		// Date & Time Pickers
			.state('pickers', {
			url: "/pickers",
			templateUrl: "views/pickers.html",
			data: {
				pageTitle: 'Date & Time Pickers'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/clockface/css/clockface.css',
									'assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
									'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
									'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
									'assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
									'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
									'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
									'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
									'assets/global/plugins/clockface/js/clockface.js',
									'assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
									'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
									'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
									'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
									'assets/admin/pages/scripts/components-pickers.js',
									'js/controllers/GeneralPageController.js'
								]
							}
						]);
					}
				]
			}
		})
		// Custom Dropdowns
			.state('dropdowns', {
			url: "/dropdowns",
			templateUrl: "views/dropdowns.html",
			data: {
				pageTitle: 'Custom Dropdowns'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
									'assets/global/plugins/jquery-multi-select/css/multi-select.css',
									'assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
									'assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',
									'assets/admin/pages/scripts/components-dropdowns.js',
									'js/controllers/GeneralPageController.js'
								]
							}
						]);
					}
				]
			}
		})
		// Advanced Datatables
			.state('datatablesAdvanced', {
			url: "/datatables/advanced.html",
			templateUrl: "views/datatables/advanced.html",
			data: {
				pageTitle: 'Advanced Datatables'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
								'assets/global/plugins/datatables/all.min.js',
								'js/scripts/table-advanced.js',
								'js/controllers/GeneralPageController.js'
							]
						});
					}
				]
			}
		})
		// Ajax Datetables
			.state('datatablesAjax', {
			url: "/datatables/ajax.html",
			templateUrl: "views/datatables/ajax.html",
			data: {
				pageTitle: 'Ajax Datatables'
			},
			controller: "GeneralPageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
								'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
								'assets/global/plugins/datatables/all.min.js',
								'assets/global/scripts/datatable.js',
								'js/scripts/table-ajax.js',
								'js/controllers/GeneralPageController.js'
							]
						});
					}
				]
			}
		})
		// User Profile
			.state("profile", {
			url: "/profile",
			templateUrl: "views/profile/main.html",
			data: {
				pageTitle: 'User Profile'
			},
			controller: "UserProfileController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
								'assets/admin/pages/css/profile.css',
								'assets/admin/pages/css/tasks.css',
								'assets/global/plugins/jquery.sparkline.min.js',
								'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
								'assets/admin/pages/scripts/profile.js',
								'js/controllers/UserProfileController.js'
							]
						});
					}
				]
			}
		})
		// User Profile Dashboard
			.state("profile.dashboard", {
			url: "/dashboard",
			templateUrl: "views/profile/dashboard.html",
			data: {
				pageTitle: 'User Profile'
			}
		})
		// User Profile Account
			.state("profile.account", {
			url: "/account",
			templateUrl: "views/profile/account.html",
			data: {
				pageTitle: 'User Account'
			}
		})
		// User Profile Help
			.state("profile.help", {
			url: "/help",
			templateUrl: "views/profile/help.html",
			data: {
				pageTitle: 'User Help'
			}
		})
		// Todo
			.state('todo', {
			url: "/todo",
			templateUrl: "views/todo.html",
			data: {
				pageTitle: 'Todo'
			},
			controller: "TodoController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: ['assets/global/plugins/bootstrap-datepicker/css/datepicker3.css', 'assets/admin/pages/css/todo.css', 'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js', 'assets/admin/pages/scripts/todo.js', 'js/controllers/TodoController.js']
						});
					}
				]
			}
		}).state('choice-assembly', {
			url: "/choice-assembly",
			templateUrl: "views/goods/choice-assembly.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增组件'
			},
			controller: "AssemblyNewController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: ['js/controllers/goods/ChoiceAssemblyController.js?v=' + MetronicApp.version]
						});
					}
				]
			}
		}).state('art-add', {
			url: "/art-add/",
			templateUrl: "views/goods/art-add.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新建艺术品'
			},
			controller: "ArtAddController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								name: 'MetronicApp',
								insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files: [
									'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/themes/default/css/umeditor.min.css?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/umeditor.config.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/umeditor.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/plupload/plupload.full.min.js?v=' + MetronicApp.version,
									'assets/global/plugins/umeditor/qiniu.min.js?v=' + MetronicApp.version,
									'js/controllers/goods/ArtAddController.js?v=' + MetronicApp.version
								]
							}
						]);
					}
				]
			}
		}).state('goods-manage', {
			url: "/goods-manage",
			templateUrl: "views/goods_manage.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '商品管理'
			},
			controller: "GoodsManageController as searchDetail",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'js/directives/goodsmanageDirective.js?v=' + MetronicApp.version,
								'js/controllers/GoodsManageController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('assembly-manage', {
			url: "/assembly-manage",
			templateUrl: "views/assembly_manage.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '组件管理'
			},
			controller: "AssemblyManageController as searchDetail",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'js/directives/assemblymanageDirective.js?v=' + MetronicApp.version,
								'js/controllers/AssemblyManageController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('edit-item', {
			url: "/edit-item/:categoryId",
			templateUrl: "views/edit-item.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '属性配置'
			},
			controller: "EdititemController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'js/directives/treeviewdirective.js?v=' + MetronicApp.version,
								'js/controllers/EdititemController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('edit-leaf-item', {
			url: "/edit-leaf-item/:categoryId",
			templateUrl: "views/edit-leaf-item.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '属性配置'
			},
			controller: "EditleafitemController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: ['js/controllers/EditleafitemController.js?v=' + MetronicApp.version]
						});
					}
				]
			}
		}).state('commodity-management-disposition', {
			url: "/commodity-management-disposition",
			templateUrl: "views/commodity_management_disposition.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '商品管理配置'
			},
			controller: "CommodityManagementDispositionController as demo",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/directives/treeviewdirective.js?v=' + MetronicApp.version,
								'js/controllers/CommodityManagementDispositionController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('assembly-new', {
			url: "/assembly-new",
			templateUrl: "views/assembly_new.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增组件'
			},
			controller: "AssemblyNewController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/controllers/AssemblyNewController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('linehaul-new', {
			url: "/linehaul-new/:orderId",
			templateUrl: "views/psi/lineHaul/linehaul_new.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增干线运输单'
			},
			controller: "LinehaulNewController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/controllers/psi/lineHaul/LinehaulNewController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('goods-assembly-new', {
			url: "/goods-assembly-new",
			templateUrl: "views/goods_assembly_new.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '商品新增组件'
			},
			controller: "GoodsAssemblyNewController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/controllers/GoodsAssemblyNewController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('draft', {
			url: "/draft",
			templateUrl: "views/draft.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '商品草稿'
			},
			controller: "draftController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/controllers/draftController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('editing', {
			url: "/editing",
			templateUrl: "views/editing.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '商品草稿'
			},
			controller: "editingController as searchDetail",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/directives/editingDirective.js?v=' + MetronicApp.version,
								'js/controllers/editingController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('assembly-new-create', {
			url: "/assembly-new-create/:id",
			templateUrl: "views/assembly_new_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增组件'
			},
			controller: "AssemblyNewDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/typeahead/typeahead.css?v=' + MetronicApp.version,
								'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js?v=' + MetronicApp.version,
								'assets/global/plugins/typeahead/handlebars.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/typeahead/typeahead.bundle.min.js?v=' + MetronicApp.version,
								'assets/admin/pages/scripts/components-form-tools.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/umeditor/themes/default/css/umeditor.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/umeditor/umeditor.config.js?v=' + MetronicApp.version,
								'assets/global/plugins/umeditor/umeditor.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/umeditor/plupload/plupload.full.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/umeditor/qiniu.min.js?v=' + MetronicApp.version,
								'js/controllers/AssemblyNewDetailController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('assembly-new-detail', {
			url: "/assembly-new-detail/:id",
			templateUrl: "views/assembly_new_detail1.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '新增组件'
			},
			controller: "AssemblyNewDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/typeahead/typeahead.css?v=' + MetronicApp.version,
								'assets/global/plugins/fuelux/js/spinner.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js?v=' + MetronicApp.version,
								'assets/global/plugins/typeahead/handlebars.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/typeahead/typeahead.bundle.min.js?v=' + MetronicApp.version,
								'assets/admin/pages/scripts/components-form-tools.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/umeditor/themes/default/css/umeditor.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/umeditor/umeditor.config.js?v=' + MetronicApp.version,
								'assets/global/plugins/umeditor/umeditor.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/umeditor/plupload/plupload.full.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/umeditor/qiniu.min.js?v=' + MetronicApp.version,
								'js/controllers/AssemblyNewDetailController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('psi-linehaul', {
			url: "/psi-linehaul",
			templateUrl: "views/psi/lineHaul/linehaul.html?v=" + MetronicApp.version,
			data: {
				pageTitle: 'psi-linehaul'
			},
			controller: "LinehaulController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/scripts/psi/lineHaul/linehaul-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/psi/lineHaul/LinehaulController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('psi-edit-linehaul-detail', {
			url: "/psi-edit-linehaul-detail/:lineHaulId",
			templateUrl: "views/psi/lineHaul/edit_linehaul_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: 'psi-edit-linehaul-detail'
			},
			controller: "EditLinehaulDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: ['js/controllers/psi/lineHaul/EditLineHaulDetailController.js?v=' + MetronicApp.version]
						});
					}
				]
			}
		}).state('psi-delivery-order', {
			url: "/psi-delivery-order",
			templateUrl: "views/psi/delivery/delivery_order.html?v=" + MetronicApp.version,
			data: {
				pageTitle: 'psi-delivery-order'
			},
			controller: "DeliveryOrderController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
								// 'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css?v=' + MetronicApp.version,
								'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version,
								// 'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'js/scripts/psi/drivery/delivery-order-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/psi/delivery/DeliveryOrderController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('psi-delivery-order-detail', {
			url: "/psi-delivery-order-detail/:deliveryOrderId",
			templateUrl: "views/psi/delivery/edit_delivery_order_detail.html?v=" + MetronicApp.version,
			data: {
				pageTitle: 'psi-delivery-order-detail'
			},
			controller: "EditDeliveryOrderDetailController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: ['js/controllers/psi/delivery/EditDeliveryOrderDetailController.js?v=' + MetronicApp.version]
						});
					}
				]
			}
		}).state('psi-delivery-order-new', {
			url: "/psi-delivery-order-new",
			templateUrl: "views/psi/delivery/delivery_order_new.html?v=" + MetronicApp.version,
			data: {
				pageTitle: 'psi-delivery-order-detail-new'
			},
			controller: "DeliveryOrderNewController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.js?v=' + MetronicApp.version,
								'js/controllers/psi/delivery/DeliveryOrderNewController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('mail-manage', {
			url: "/mail-manage",
			templateUrl: "views/manage/mail/mail_manage.html?v=" + MetronicApp.version,
			data: {
				pageTitle: 'mail-manage'
			},
			controller: "mailManageController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: [
								'assets/global/plugins/bootbox/bootbox.min.js?v=' + MetronicApp.version,
								'assets/global/plugins/jquery-validation/js/jquery.validate.js?v=' + MetronicApp.version,
								'js/controllers/manage/mail/MailManageController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('view-bind', {
			url: "/view-bind",
			templateUrl: "views/view-bind.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '视频绑定'
			},
			controller: "ViewBindController",
			resolve: {
				deps: [
					'$ocLazyLoad',
					function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: 'MetronicApp', insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
							files: ['js/controllers/viewBindController.js?v=' + MetronicApp.version]
						});
					}
				]
			}
		})
	}
]);
MetronicApp.run([
	"$rootScope",
	"settings",
	"$state",
	function($rootScope, settings, $state) {
		$rootScope.$state = $state; // state to be accessed from view
	}
]);
MetronicApp.controller('SupplierReconciliation', [
	'$scope',
	'$compile',
	function($scope, $compile) {
		supplierReconciliationTableAdvanced.init($compile, $scope);
	}
]);
