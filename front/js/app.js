/***
Metronic AngularJS App Main Script
***/
/* Metronic App */
var MetronicApp = angular.module("MetronicApp", ["ui.router", "ui.bootstrap", "oc.lazyLoad", "ngSanitize"]);
MetronicApp.version = '2016110502';
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
	function($scope, $rootScope, $cacheFactory) {
		$scope.$on('$viewContentLoaded', function() {
			Metronic.initComponents(); // init core components
			//Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
			if (window.localStorage.aijiaUserdata) {
				var a = JSON.parse(window.localStorage.aijiaUserdata);
				$('.username').text(a.username);
			}
			// $scope.clearCache = function(){
			//     var cache = $cacheFactory('cache');
			//     cache.removeAll();
			// }
			$scope.quit = function() {
				window.localStorage.removeItem('aijiaUserdata');
				window.location.href = 'login.html';
			};
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
			Layout.initHeader(); // init header
		});
	}
]);
/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', [
	'$scope',
	function($scope) {
		$scope.$on('$includeContentLoaded', function() {
			// 首先渲染侧边栏
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
			}, 2000);
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
/* Setup Rounting For All Pages */
MetronicApp.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect any unmatched url
		$urlRouterProvider.otherwise(function($injector, $location) {
			window.location.href = 'login.html';
		});
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
		}).state('Reservoir', {
			url: "/Reservoir",
			templateUrl: "views/Reservoir.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '水库山塘'
			},
			controller: "ReservoirController",
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
								'js/scripts/Reservoir-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/ReservoirController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('River', {
			url: "/River",
			templateUrl: "views/River.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '河道'
			},
			controller: "RiverController",
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
								'js/scripts/River-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/RiverController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('Lock', {
			url: "/Lock",
			templateUrl: "views/Lock.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '水闸'
			},
			controller: "LockController",
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
								'js/scripts/Lock-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/LockController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('PumpStation', {
			url: "/PumpStation",
			templateUrl: "views/PumpStation.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '泵站'
			},
			controller: "PumpStationController",
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
								'js/scripts/PumpStation-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/PumpStationController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('LongRiverSystem', {
			url: "/LongRiverSystem",
			templateUrl: "views/LongRiverSystem.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '河长制'
			},
			controller: "LongRiverSystemController",
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
								'js/scripts/LongRiverSystem-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/LongRiverSystemController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('MountainTorrentDisaster', {
			url: "/MountainTorrentDisaster",
			templateUrl: "views/MountainTorrentDisaster.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '山洪灾害'
			},
			controller: "MountainTorrentDisasterController",
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
								'js/scripts/MountainTorrentDisaster-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/MountainTorrentDisasterController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('DrinkingWater', {
			url: "/DrinkingWater",
			templateUrl: "views/DrinkingWater.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '农民饮用水'
			},
			controller: "DrinkingWaterController",
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
								'js/scripts/DrinkingWater-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/DrinkingWaterController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('Irrigation', {
			url: "/Irrigation",
			templateUrl: "views/Irrigation.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '农田水利'
			},
			controller: "IrrigationController",
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
								'js/scripts/Irrigation-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/IrrigationController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('Archive', {
			url: "/Archive",
			templateUrl: "views/Archive.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '档案页'
			},
			controller: "ArchiveController",
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
								'js/scripts/Archive-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/ArchiveController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('VideoMonitoring', {
			url: "/VideoMonitoring",
			templateUrl: "views/VideoMonitoring.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '视频监控'
			},
			controller: "VideoMonitoringController",
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
								'js/scripts/VideoMonitoring-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/VideoMonitoringController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('WaterLevel', {
			url: "/WaterLevel",
			templateUrl: "views/WaterLevel.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '实时水位'
			},
			controller: "WaterLevelController",
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
								'js/scripts/WaterLevel-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/WaterLevelController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('RainfallRegime', {
			url: "/RainfallRegime",
			templateUrl: "views/RainfallRegime.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '雨情'
			},
			controller: "RainfallRegimeController",
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
								'js/scripts/RainfallRegime-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/RainfallRegimeController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('AccountManagement', {
			url: "/AccountManagement",
			templateUrl: "views/AccountManagement.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '账户管理'
			},
			controller: "AccountManagementController",
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
								'js/scripts/AccountManagement-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/AccountManagementController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('CityManagement', {
			url: "/CityManagement",
			templateUrl: "views/CityManagement.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '地市管理'
			},
			controller: "CityManagementController",
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
								'js/scripts/CityManagement-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/CityManagementController.js?v=' + MetronicApp.version
							]
						});
					}
				]
			}
		}).state('InformationManagement', {
			url: "/InformationManagement",
			templateUrl: "views/InformationManagement.html?v=" + MetronicApp.version,
			data: {
				pageTitle: '基本情况及档案信息管理'
			},
			controller: "InformationManagementController",
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
								'js/scripts/InformationManagement-table-advanced.js?v=' + MetronicApp.version,
								'js/controllers/InformationManagementController.js?v=' + MetronicApp.version
							]
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
