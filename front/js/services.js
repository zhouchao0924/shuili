//自定义配置项，用于queryFilter
//下列数组对应id和后台约定都是从1开始，在读写时请注意!
MetronicApp.constant('ConfData', {
	CustomerOrigins: [
		'自然到访', '开盘认筹', '邀约到访', '线上引流', '400电话'
	],
	CustomerSteps: [
		'预约',
		'到访',
		'需求设计',
		'设计确认',
		'签约',
		'施工开始',
		'验收'
	],
	CustomerIntentions: [
		'较高', '犹豫', '一般', '无兴趣'
	],
	PrePayStatus: [
		'待确认收款',
		'已确认收款',
		'待确认退款',
		'已取消',
		'已退款',
		'已转化'
	],
	PostPayStatus: [
		'待确认收款',
		'已确认收款',
		'待确认退款',
		'已取消',
		'已退款',
		'已转化',
		'部分收款'
	],
	OrderTypes: [
		'软装', '硬装', '全品家'
	],
	FinanceAttr: [
		"有收款", "有退款", "正常"
	],
	HardOrderStatus: [
		{
			id: 4,
			name: "待付款"
		}, {
			id: 8,
			name: "施工中"
		}, {
			id: 2,
			name: "已完成"
		}, {
			id: 3,
			name: "已取消"
		}, {
			id: 9,
			name: "待退款"
		}
	],
	DispatchingserviceType: [
		"提货", "送货安装", "维修", "拆卸", "换货安装"
	],
	FacilitatorNames: [
		"云捷物流",
		"居家通",
		"日日顺",
		"乐宜家",
		"董师傅",
		"蚁安居",
		"卡行天下",
		"红背心"
	],
	ArtOrderStatus: [
		{
			id: 4,
			name: "待付款"
		}, {
			id: 6,
			name: "部分付款"
		}, {
			id: 10,
			name: "待发货"
		}, {
			id: 5,
			name: "待收货"
		}, {
			id: 2,
			name: "已完成"
		}, {
			id: 3,
			name: "已取消"
		}
	],
	Productfamilydetailstatus: [
		"待采购", "待提货", "待入库", "待出库", "已送货"
	],
	SoftOrderStatus: [
		{
			id: -1,
			name: '已取消'
		}, {
			id: 0,
			name: '待采购'
		}, {
			id: 1,
			name: '采购中'
		}, {
			id: 2,
			name: '待送货'
		}, {
			id: 3,
			name: '送货中'
		}, {
			id: 4,
			name: '送货完成'
		}
	],
	FamilyOrderStatus: [
		{
			id: 7,
			name: '待施工'
		}, {
			id: 8,
			name: '施工中'
		}, {
			id: 11,
			name: '待结款'
		}, {
			id: 5,
			name: '待收货'
		}, {
			id: 2,
			name: '已完成'
		}, {
			id: 3,
			name: '已取消'
		}
	],
	DispatchingStatus: [
		{
			id: 0,
			name: '等待接单'
		}, {
			id: 1,
			name: '已接单'
		}, {
			id: 2,
			name: '已完成'
		}, {
			id: 3,
			name: '已取消'
		}
	],
	CommitMoneyTypes: [
		{
			id: 3,
			name: '首付款'
		}, {
			id: 4,
			name: '尾款'
		}
	],
	AfterSellStatus: [
		'待退款', '已完成', '已取消'
	],
	AfterSellTypes: [
		'退货退款', '仅退款', '换货', '维修'
	],
	CommitMoneySoftTypes: [
		{
			id: 3,
			name: '首付款'
		}, {
			id: 4,
			name: '尾款'
		}
	]
})
//不同接口对于id和name的字段名，为空数组即id和name
MetronicApp.constant('ConfAjax', {
	'/house/queryBuildHouseRel/': [
		'buildingId', 'buildingName'
	],
	'/configitem/queryItemsByConfigId/3/': [], //支付方式
	'/configitem/queryItemsByConfigId/12/': [
		'serialnum', 'name'
	], //空间类型
	'/admin/queryEmployee/': [
		'uId', 'name'
	],
	'/company/queryAllCompany/': [
		'companyCode', 'companyName'
	], //所有公司
	'/salesupport/queryServiceTypeList/': [
		'key', 'value'
	], //客服记录 查询服务类型
	'/salesupport/queryStatusList/': [
		'key', 'value'
	], //客服记录 查询完成状态
})
//对于ConfData里的数据，对应id和后台约定都是从1开始，在读写时请注意!
MetronicApp.filter('query', [
	'ConfData',
	'ajaxCache',
	'ConfAjax',
	function(ConfData, ajaxCache, ConfAjax) {
		return function(input, name) {
			if (input === null)
				return input
			if (input === undefined) {
				if (/^\/.+\/$/.test(name))
					ajaxCache(name)
				return input
			}
			var queryAll = false
			if (!name) {
				queryAll = true
				name = input
			}
			if (/^\/.+\/$/.test(name)) {
				var outputs
				ajaxCache(name).then(function(data) {
					outputs = data.obj
				})
				if (!outputs)
					return
				if (queryAll)
					return outputs
				var output = outputs.filter(function(e) {
					return parseInt(e[ConfAjax[name] && ConfAjax[name][0] || 'id']) === parseInt(input)
				})
				return output.length
					? output[0] && output[0][ConfAjax[name] && ConfAjax[name][1] || 'name']
					: ''
			}
			if (queryAll)
				return ConfData[name]
			if (typeof ConfData[name][0] === 'string') {
				return ConfData[name][input - 1]
			} else {
				var output = ConfData[name].filter(function(e) {
					return parseInt(e.id) === parseInt(input)
				})
				return output.length
					? output[0] && output[0].name
					: ''
			}
		};
	}
]);
MetronicApp.filter('NoToChinese', [
	'ConfData',
	'ajaxCache',
	'ConfAjax',
	function(ConfData, ajaxCache, ConfAjax) {
		return function(n) {
			if (150000) {
				if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(150000))
					return "数据非法";
				var unit = "千百拾亿千百拾万千百拾元角分",
					str = "";
				n += "00";
				var p = n.indexOf('.');
				if (p >= 0)
					n = n.substring(0, p) + n.substr(p + 1, 2);
				unit = unit.substr(unit.length - n.length);
				for (var i = 0; i < n.length; i++)
					str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
				return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
			}
		}
	}
]);
//ajax服务，请使用ajax1
MetronicApp.factory('ajax', function() {
	return function(url_key, params, callback) {
		if (!url_key || !params) {
			return;
		}
		if (!callback) {
			callback = params;
			params = {};
		}
		if (window.localStorage) {
			var a = JSON.parse(window.localStorage.Userdata);
		} else {
			window.location.href = 'login.html';
		}
		$.ajax({
			url: Metronic.host + url_key + a.userId + '/' + a.sessionId,
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(params),
			success: function(data) {
				if (data.code == 1) {
					callback(data);
				} else if (data.code == 3) {
					window.location.href = 'login.html';
				} else {
					alert(data.ext.msg);
				}
			},
			error: function(xhr, data, status) {
				alert('请检查网络');
			}
		})
	};
});
//ajax服务，使用$http,$q，成功和失败方法中不需要使用$scope.$apply()
MetronicApp.factory('ajax1', [
	'$http',
	'$q',
	'blockUI',
	'userNow',
	function($http, $q, blockUI, userNow) {
		return function(url_key, params, isNoStringify, isFullUrl) {
			blockUI.block()
			var deferred = $q.defer();
			if (!url_key) {
				return;
			}
			if (!params) {
				params = {};
			}
			var url = isFullUrl
				? Metronic.host + url_key
				: Metronic.host + url_key + userNow.userId + '/' + userNow.sessionId
			var config = {
				responseType: 'json',
				headers: {
					// 'Cache-Control': 'no-cache',
					'Content-Type': 'text/plain'
				}
			}
			params = JSON.stringify(params)
			if (isNoStringify) {
				params = JSON.parse(params)
				config.transformRequest = function(data) {
					return $.param(data);
				}
				config.headers = {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}
			$http.post(url, params, config).then(function(data) {
				if (data.data.code == 1) {
					//前台过滤'艾佳总部'
					if (url_key === '/company/queryAllCompany/') {
						data.data.obj = data.data.obj.filter(function(e) {
							return e.companyName !== '艾佳总部'
						})
					}
					deferred.resolve(data.data);
				} else if (data.data.code == 3) {
					userNow.timeout()
					window.location.href = 'login.html';
				} else {
					deferred.reject(data.data);
					alert(data.data.ext.msg);
				}
			}, function(data, status) {
				deferred.reject(data.data);
				// alert('请检查网络');
				console.error('method: ' + data.config.method + '\nstatus: ' + data.status + '\nstatusText: ' + data.statusText + '\nurl: ' + data.config.url);
			}). finally(function() {
				blockUI.unblock()
			})
			return deferred.promise;
		};
	}
]);
//ajax服务，使用$http,$q，成功和失败方法中不需要使用$scope.$apply()
MetronicApp.factory('ajax2', [
	'$http',
	'$q',
	'blockUI',
	'userNow',
	function($http, $q, blockUI, userNow) {
		return function(options) {
			blockUI.block()
			var deferred = $q.defer();
			if (!options.url)
				return
			if (!options.data)
				options.data = {}
			if (!options.host)
				options.host = 'host'
			var url = options.isFullUrl
				? Metronic[options.host] + options.url
				: Metronic[options.host] + options.url + userNow.userId + '/' + userNow.sessionId
			var config = {
				responseType: 'json',
				headers: {
					// 'Cache-Control': 'no-cache',
					'Content-Type': 'text/plain'
				}
			}
			options.data = JSON.stringify(options.data)
			if (options.isNoStringify) {
				options.data = JSON.parse(options.data)
				config.transformRequest = function(data) {
					return $.param(data);
				}
				config.headers = {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}
			$http({
				method: options.method || 'POST',
				url: url,
				data: options.data,
				responseType: 'json',
				headers: {
					// 'Cache-Control': 'no-cache',
					'Content-Type': 'text/plain'
				}
			}).then(function(data) {
				if (data.data.code == 1) {
					//前台过滤'艾佳总部'
					if (options.url === '/company/queryAllCompany/') {
						data.data.obj = data.data.obj.filter(function(e) {
							return e.companyName !== '艾佳总部'
						})
					}
					deferred.resolve(data.data);
				} else if (data.data.code == 3) {
					userNow.timeout()
					window.location.href = 'login.html';
				} else {
					alert(data.data.ext.msg);
				}
			}, function(data, status) {
				deferred.reject(data.data);
				// alert('请检查网络');
				console.error('method: ' + data.config.method + '\nstatus: ' + data.status + '\nstatusText: ' + data.statusText + '\nurl: ' + data.config.url);
			}). finally(function() {
				blockUI.unblock()
			})
			return deferred.promise;
		};
	}
]);
//获得当前user的相关信息，如a.userId和a.sessionId
MetronicApp.factory('userNow', [
	'$window',
	function($window) {
		if (!$window.localStorage || !$window.localStorage.Userdata) {
			// $window.location.href = 'login.html';
			return
		}
		return {
			get userId() {
				return JSON.parse($window.localStorage.Userdata).userId
			},
			get sessionId() {
				return JSON.parse($window.localStorage.Userdata).sessionId
			},
			companyCode: JSON.parse($window.localStorage.Userdata).companyCode,
			timeout: function() {
				$window.localStorage.sessionOut = true
			},
			timeout_del: function() {
				delete $window.localStorage.sessionOut
			}
		}
	}
]);
//ajax服务，使用$http,$q，成功和失败方法中不需要使用$scope.$apply()
MetronicApp.factory('ajax', [
	'$http',
	'$q',
	'blockUI',
	'userNow',
	function($http, $q, blockUI) {
		return function(url_key, params, isNoStringify, isFullUrl) {
			blockUI.block()
			var deferred = $q.defer();
			if (!url_key) {
				return;
			}
			if (!params) {
				params = {};
			}
			var url = Metronic.host + url_key
			var config = {
				responseType: 'json',
				headers: {
					// 'Cache-Control': 'no-cache',
					'Content-Type': 'text/plain'
				}
			}
			params = JSON.stringify(params)
			if (isNoStringify) {
				params = JSON.parse(params)
				config.transformRequest = function(data) {
					return $.param(data);
				}
				config.headers = {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}
			$http.get(url, params, config).then(function(data) {
				if (data.data.code == 1) {
					//前台过滤'艾佳总部'
					if (url_key === '/company/queryAllCompany/') {
						data.data.obj = data.data.obj.filter(function(e) {
							return e.companyName !== '艾佳总部'
						})
					}
					deferred.resolve(data.data);
				} else if (data.data.code == 3) {
					userNow.timeout()
					window.location.href = 'login.html';
				} else {
					deferred.reject(data.data);
					alert(data.data.ext.msg);
				}
			}, function(data, status) {
				deferred.reject(data.data);
				console.error('method: ' + data.config.method + '\nstatus: ' + data.status + '\nstatusText: ' + data.statusText + '\nurl: ' + data.config.url);
			}). finally(function() {
				blockUI.unblock()
			})
			return deferred.promise;
		};
	}
]);
MetronicApp.factory('ajaxforjson', [
	'$http',
	'$q',
	'blockUI',
	'userNow',
	function($http, $q, blockUI, userNow) {
		return function(url_key, params, isNoStringify, isFullUrl) {
			blockUI.block()
			var deferred = $q.defer();
			if (!url_key) {
				return;
			}
			if (!params) {
				params = {};
			}
			var url = isFullUrl
				? Metronic.host + url_key
				: Metronic.host + url_key + userNow.userId + '/' + userNow.sessionId
			var config = {
				responseType: 'json',
				headers: {
					'Content-Type': 'application/json'
				}
			}
			params = JSON.stringify(params)
			if (isNoStringify) {
				params = JSON.parse(params)
				config.transformRequest = function(data) {
					return $.param(data);
				}
				config.headers = {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}
			$http.post(url, params, config).then(function(data) {
				if (data.data.code == 1) {
					//前台过滤'艾佳总部'
					if (url_key === '/company/queryAllCompany/') {
						data.data.obj = data.data.obj.filter(function(e) {
							return e.companyName !== '艾佳总部'
						})
					}
					deferred.resolve(data.data);
				} else if (data.data.code == 3) {
					userNow.timeout()
					window.location.href = 'login.html';
				} else {
					deferred.reject(data.data);
					//alert(data.data.ext.msg);
				}
			}, function(data, status) {
				deferred.reject(data.data);
				// alert('请检查网络');
				console.error('method: ' + data.config.method + '\nstatus: ' + data.status + '\nstatusText: ' + data.statusText + '\nurl: ' + data.config.url);
			}). finally(function() {
				blockUI.unblock()
			})
			return deferred.promise;
		};
	}
]);
//可传入string和array
//为string时，会给ajax1做缓存
//为array时，会等待array中所有的string请求都返回，再执行all中调用的方法
MetronicApp.factory('ajaxCache', [
	'ajax1',
	'$cacheFactory',
	'$q',
	function(ajax1, $cacheFactory, $q) {
		$cacheFactory('ajaxCache')
		return function(url, params) {
			if (!angular.isArray(url)) {
				var cache = $cacheFactory.get('ajaxCache'),
					p = params === undefined
						? ''
						: JSON.stringify(params)
				if (!cache.get(url + p)) {
					cache.put(url + p, ajax1(url, params).then(function(data) {
						return cache.put(url + p, data)
					}))
				}
				return {
					then: function(fn) {
						var a = url + p
						if (typeof cache.get(url + p).then === 'function') {
							cache.get(url + p).then(fn)
						} else {
							fn(cache.get(url + p))
						}
					}
				}
			} else {
				var cache = $cacheFactory.get('ajaxCache')
				return {
					all: function(fn) {
						if (!angular.isArray(url))
							return
						var qs = []
						url.forEach(function(e) {
							if (!cache.get(e)) {
								cache.put(e, ajax1(e)).then(function(d) {
									return cache.put(e, d)
								})
								qs.push(cache.get(e))
							} else if (typeof cache.get(e).then === 'function') {
								qs.push(cache.get(e))
							}
						})
						return $q.all(qs).then(fn)
					}
				}
			}
		};
	}
])
//自动保存和恢复vm
MetronicApp.factory('vmCache', [
	'$document',
	'$rootScope',
	'userNow',
	function($document, $rootScope, userNow) {
		return {
			init: function($scope, vm) {
				$scope.$watch(function() {
					return vm
				}, function() {
					this.SaveState(vm)
				}.bind(this), true)
				if (this.hasCache() && localStorage.sessionOut) {
					var vmCache = this.RestoreState()
					if (vmCache && vmCache.url === window.location.href)
						vm = $.extend(true, vm, vmCache.cache)
				}
				setTimeout(function() {
					userNow.timeout_del()
				}, 2000);
				$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
					this.clear()
				}.bind(this));
			},
			clear: function() {
				delete localStorage.vmCache
			},
			SaveState: function($scope) {
				localStorage.vmCache = angular.toJson({url: window.location.href, cache: $scope})
			},
			RestoreState: function() {
				return angular.fromJson(localStorage.vmCache);
			},
			hasCache: function() {
				return localStorage.vmCache
					? true
					: false
			}
		}
	}
])
MetronicApp.filter('jsonParse', function() {
	return function(obj) {
		if (!obj)
			return ''
		return JSON.parse(obj)[0] + '?imageView2/1/w/110/h/90'
	}
})
//图片剪切
MetronicApp.filter('imageTrim', function() {
	return function(obj) {
		if (!obj)
			return ''
		return obj + '?imageView2/2/w/150/h/120'
	}
})
//七牛上传
MetronicApp.factory('qiniu', [
	'$q',
	'blockUI',
	function($q, blockUI) {
		return function(file, url) {
			blockUI.block()
			var deferred = $q.defer();
			var formData = new FormData();
			formData.append("efile", file.files[0]);
			$.ajax({
				url: url,
				type: 'POST',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				processData: false,
				contentType: false,
				data: formData,
				success: function(data) {
					deferred.resolve(data);
				},
				complete: function() {
					blockUI.unblock()
				}
			});
			return deferred.promise;
		};
	}
]);
MetronicApp.factory('blockUI', function() {
	var blockNum = 0
	return {
		block: function() {
			if (!blockNum) {
				Metronic.blockUI({
					message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true, zIndex: 12000 //大于modal窗口的zIndex
				});
			}
			blockNum++
		},
		unblock: function() {
			blockNum--;
			if (!blockNum) {
				Metronic.unblockUI();
			}
		}
	};
})
//set all null to undefined
MetronicApp.factory('setAllUndef', function() {
	return function setUn(obj) {
		for (i in obj) {
			if (obj[i] === null) {
				obj[i] = undefined
				continue;
			}
			if (typeof obj[i] === 'object')
				obj[i] = setUn(obj[i])
		}
		return obj
	}
})
//生成品牌对象
MetronicApp.factory('queryBrand', [
	'ajax',
	function(ajax) {
		return function() {
			return new Promise(function(resolve, reject) {
				ajax('/product/queryBrand/', function(data) {
					if (data.obj.length > 0) {
						var brandIds = [];
						var allBrands = []
						$.each(data.obj, function(i, n) {
							if (n.parentId == 0) {
								brandIds.push(n.brandId);
								allBrands.push({brandId: n.brandId, name: n.name, nodes: []})
							}
						})
						$.each(data.obj, function(k, o) {
							if (o.parentId != 0) {
								var index = $.inArray(o.parentId, brandIds);
								allBrands[index].nodes.push({brandId: o.brandId, name: o.name})
							}
						})
					}
					resolve(allBrands)
				})
			})
		};
	}
]);
//生成品牌对象queryBrand1，使用$http,$q，成功和失败方法中不需要使用$scope.$apply(),类似ajax1和ajax的关系
MetronicApp.factory('queryBrand1', [
	'$q',
	'ajax1',
	function($q, ajax1) {
		return function() {
			var deferred = $q.defer();
			ajax1('/product/queryBrand/').then(function(data) {
				if (data.obj.length > 0) {
					var brandIds = [];
					var allBrands = []
					$.each(data.obj, function(i, n) {
						if (n.parentId == 0) {
							brandIds.push(n.brandId);
							allBrands.push({brandId: n.brandId, name: n.name, nodes: []})
						}
					})
					$.each(data.obj, function(k, o) {
						if (o.parentId != 0) {
							var index = $.inArray(o.parentId, brandIds);
							allBrands[index].nodes.push({brandId: o.brandId, name: o.name})
						}
					})
				}
				deferred.resolve(allBrands)
			})
			return deferred.promise;
		};
	}
]);
//filter
//从时间字符串中返回年月日，如'2016年3月21日 14时30分28秒'返回'2016年3月21日'
MetronicApp.filter('yearMonthDay', function() {
	return function(input) {
		input = input || '';
		input = input.trim()
		return input.match(/(^[^\s]+)\s/) && input.match(/(^[^\s]+)\s/)[1];
	};
});
//从对象数组中删除重复的对象，id为对象属性名，如果有两个对象的该属性值相等，则认为重复，后一个会被删除
MetronicApp.filter('noRepeat', function() {
	var out = function(input, id) {
		var a = input;
		input = input.filter(function(e, i, arr) {
			var test = arr.slice(0, i).every(function(el) {
				return (el[id] !== e[id])
			})
			if (test) {
				return e
			}
		});
		return input
	};
	return out;
});
//error提示信息
MetronicApp.filter('error', function() {
	var message = {
		'required': '此项不能为空',
		'isMobilePhoneNum': '请填写正确的联系电话',
		'isPhonenum': '请填写正确的联系电话',
		'phonenum': '请填写正确的联系电话',
		'rmb': '请输入正确的金额',
		'number': '请输入整数',
		'isNumber2': '请输入正确的数字(最多两位小数)',
		'price': '请输入正确的金额(最多两位小数)',
		'min': '输入的数字超限',
		'ngMin': '输入的数字超下限',
		'max': '输入的数字超限',
		'ngMax': '输入的数字超上限',
		'isRoomSel': '空间类型未选择',
		'isProductSel': '商品列表不能为空',
		'isPosNum': '请输入12位POS单号',
		'isPosNum18': '请输入18位POS单号'
	}
	return function(input) {
		if (input === 'parse')
			return '' //1.3
		return message[input] || input
	};
});
//roomType值转化为对应文字
MetronicApp.filter('getRoomType', [
	'ajax1',
	function(ajax1) {
		var roomTypes
		ajax1('/configitem/queryItemsByConfigId/12/').then(function(data2) {
			roomTypes = data2.obj;
		})
		return function(input) {
			return roomTypes.filter(function(e) {
				return parseInt(e.serialnum) === parseInt(input)
			})[0].name
		};
	}
]);
//适用风格转化为对应文字
MetronicApp.filter('getStyleText', [
	'ajaxCache',
	function(ajaxCache) {
		var styles
		ajaxCache('/style/queryStyleTree/').then(function(data) {
			styles = data.obj;
		})
		return function(input) {
			if (!styles) {
				return input
			}
			var styleName = styles.filter(function(e) {
				return parseInt(e.styleId) === parseInt(input) || (e.styleName && e.styleName.trim() === input)
			})
			if (styleName.length) {
				return styleName[0].styleName
			} else {
				return input
			}
		};
	}
]);
//员工ID转化为员工姓名
MetronicApp.filter('getEmployeeName', [
	'ajaxCache',
	function(ajaxCache) {
		var employees
		ajaxCache('/admin/queryEmployee/').then(function(data) {
			employees = data.obj;
		})
		return function(input) {
			if (!employees) {
				return input
			}
			var name = employees.filter(function(e) {
				return parseInt(e.uId) === parseInt(input)
			})
			if (name.length) {
				return name[0].name
			} else {
				return input
			}
		};
	}
]);
MetronicApp.factory('dataTable', [
	'ajax2',
	'$compile',
	'$ocLazyLoad',
	'$cacheFactory',
	'$q',
	'searchCond',
	'ajaxCache',
	function(ajax2, $compile, $ocLazyLoad, $cacheFactory, $q, searchCond, ajaxCache) {
		$ocLazyLoad.load({
			insertBefore: '#ng_load_plugins_before',
			files: [
				'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version
			]
		});
		return {
			new: function(table, $scope) {
				return new DataTable(table, $scope)
			}
		}
		function DataTable(table, $scope) {
			var tableId = table.id,
				tablelistStatus = table.listStatus,
				tableData = table.data,
				tableUrl = table.url,
				href = table.href,
				conditions = table.conditions,
				conditionsBig = table.conditionsBig,
				buttonFunc = table.buttonFunc,
				isConditions = table.isConditions,
				handelHistoryFunc = table.handelHistoryFunc,
				method = table.method;
			this.table = angular.element(tableId);
			if (table.conditions) {
				this.conditions = table.conditions
			} else {
				this.conditions = {}
			}
			this.tableSearch = function(p, cb) {
				if (cb) {
					conditionsBig = cb;
				}
				this.conditions = p
				this.table.DataTable().ajax.reload();
			}
			var deferred = $q.defer();
			this.then = function(fn) {
				deferred.promise.then(fn)
			}
			var self = this
			if (tableData) {
				var ajaxArray = tableData.toString().match(/\/.*?\/.*?\//g)
			}
			if (angular.isArray(ajaxArray)) {
				ajaxCache(ajaxArray).all(function(d) {
					init()
				})
			} else {
				init()
			}
			function init() {
				var isloaded = $cacheFactory.get('ocLazyLoad').get('assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version)
				isloaded.then(function(data) {
					self.table.dataTable({
						"colReorder": true,
						"language": {
							"aria": {
								"sortAscending": ": activate to sort column ascending",
								"sortDescending": ": activate to sort column descending"
							},
							"paginate": {
								"previous": "Prev",
								"next": "Next"
							},
							"emptyTable": "未找到满足搜索条件的数据",
							"info": "显示 _START_ 到 _END_ ，共 _TOTAL_ 条记录", //Showing _START_ to _END_ of _TOTAL_ entries
							"infoEmpty": "", //No entries found
							"infoFiltered": "", //(filtered1 from _MAX_ total entries)
							"lengthMenu": "Show _MENU_ entries",
							"search": "Search:",
							"zeroRecords": "No matching records found"
						},
						"aaSorting": [],
						// "aoColumnDefs": [{
						//     "aTargets": [2],
						//     "mData": {
						//         "pageNo": 1,
						//         "pageSize": 30,
						//         "conditions": [],
						//         "sortCondition": {
						//             "type": 1,
						//             "condition": "asc"
						//         }
						//     },
						//     "mRender": function(data, type, full) {
						//         return data[2];
						//     }
						// }],
						// "columnDefs": [{
						//     "orderable": true,
						//     "targets": [10]
						// }],
						// "order": [
						//     [1, 'asc']
						// ],
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
						"stateSave": false,
						"filter": false,
						"serverSide": true,
						"ajax": function(data, callback, settings) {
							var params = {
								"pageNo": data.start / data.length + 1,
								"pageSize": data.length,
								'userType': 1,
								'listStatus': tablelistStatus
							}
							if (isConditions) {
								$.extend(params, {
									conditions: searchCond(self.conditions).concat(conditionsBig)
								});
							} else {
								$.extend(params, self.conditions, conditionsBig);
							}
							if (data.order.length) {
								params.sortCondition = {
									type: data.order[0].column,
									condition: data.order[0].dir
								}
							}
							ajax2({
								method: method || 'POST',
								url: tableUrl,
								data: table.params || params
							}).then(function(datas) {
								if (datas.code == 1) {
									var arr = [];
									if (typeof table.setData === 'function') {
										arr = table.setData(datas)
									} else {
										if (datas.obj && datas.obj.list) {
											$.each(datas.obj.list, function(i, n) {
												var temp = []
												temp = tableData(n)
												// scope.tableList.forEach(function(e) {
												//     e ? temp.push(n[e]) : temp.push('')
												// })
												arr.push(temp);
											})
										}
									}
									var d = {
										data: arr,
										recordsTotal: datas.obj
											? datas.obj.totalRecords
											: 0,
										recordsFiltered: datas.obj
											? datas.obj.totalRecords
											: 0
									}
									callback(d);
									self.table.find('tbody tr').each(function(i, n) {
										var rowData = self.table.api().row(i).data();
										if (!rowData) {
											return false;
										}
										angular.element(n).attr('draggable', '')
										angular.element(n).css("cursor", "pointer")
										$compile(n)($scope)
										// $(self).append($compile(n)($scope));
										// $scope.$apply();
										if (typeof href === 'function') {
											angular.element(n).click(function(e) {
												if (e.target.localName === 'td') {
													//进入详情页保存列表页查询数据和分页
													if (typeof handelHistoryFunc === 'function') {
														handelHistoryFunc()
													}
													window.location.href = href(rowData);
												}
											})
										}
									});
									if (buttonFunc) {
										if (typeof buttonFunc === 'function') {
											self.table.find('tbody tr td:last-child').each(buttonFunc(self))
										} else if (typeof buttonFunc === 'object') {
											if (buttonFunc.selector && buttonFunc.func) {
												self.table.find(buttonFunc.selector).each(buttonFunc.func(self))
											}
										}
									}
									if (typeof table.render === 'function') {
										table.render(self)
									}
									self.table.find('td').css('vertical-align', 'middle')
									self.table.find('td').css('text-align', 'center')
									self.table.find('th').css('vertical-align', 'middle')
									self.table.find('th').css('text-align', 'center')
									deferred.resolve()
								}
							})
						}
					});
				})
			}
		}
	}
]);
//验证规则都在这里
MetronicApp.factory('ValidateFn', function() {
	var allFn = {
		//11位手机号
		isMobilePhoneNum: function(value) {
			var length = value.length;
			var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
			return (length == 11 && mobile.test(value));
		},
		//所有电话号码
		isPhonenum: function(value) {
			var length = value.length;
			var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
			var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
			return tel.test(value) || (length == 11 && mobile.test(value));
		},
		//校验空间类型是否未选择
		isRoomSel: function(value) {
			return value !== 0
		},
		//校验商品是否选择
		isProductSel: function(value, scope) {
			return scope.orderList.length !== 0
		},
		//pos单号
		isPosNum: function(value) {
			var posReg = /^\d{12}$/
			return posReg.test(value)
		},
		//pos单号
		isPosNum18: function(value) {
			var posReg = /^\d{18}$/
			return posReg.test(value)
		},
		number: function(value) {
			var posReg = /^[0-9]*$/
			return posReg.test(value)
		},
		price: function(value) {
			var posReg = /^[0-9]+(.[0-9]{1,2})?$/;
			return posReg.test(value);
		},
		isNumber2: function(value) {
			var posReg = /^[0-9]+(.[0-9]{1,2})?$/
			return posReg.test(value);
		}
	}
	return function(name, value, scope) {
		if (value === undefined || value === null) {
			return true
		}
		return allFn[name](value);
	}
})
//搜索参数转化
MetronicApp.factory('searchCond', function() {
	return function(input) {
		var conditions = []
		if (!input) {
			return
		}
		if (input.type1) {
			conditions.push({'type': 0x01, 'condition': input.type1})
		}
		// if (input.type2) {
		// 	conditions.push({'type': 0 X02, 'condition': input.type2})
		// }
		// if (input.type3) {
		// 	conditions.push({'type': 0 X03, 'condition': input.type3})
		// }
		if (input.type2) {
			conditions.push({'type': 0x02, 'condition': input.type2})
		}
		if (input.type3) {
			conditions.push({'type': 0x03, 'condition': input.type3})
		}
		if (input.type4) {
			conditions.push({'type': 0x04, 'condition': input.type4})
		}
		if (input.type5) {
			conditions.push({'type': 0x05, 'condition': input.type5})
		}
		if (input.type6) {
			conditions.push({'type': 0x06, 'condition': input.type6})
		}
		if (input.type7) {
			conditions.push({'type': 0x07, 'condition': input.type7})
		}
		if (input.type8) {
			conditions.push({'type': 0x08, 'condition': input.type8})
		}
		if (input.type9) {
			conditions.push({'type': 0x09, 'condition': input.type9})
		}
		return conditions
	}
})
MetronicApp.filter('trusted', [
	'$sce',
	function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	}
]);
//保留两位小数
MetronicApp.filter('number2', function() {
	return function(number) {
		return number.toFixed(2);
	};
});
// websocket获取电话状态
MetronicApp.factory('wsCustomerPhone', [
	'$window',
	function($window) {
		return function(scope, messageFn) {
			return new function() {
				if (window.location.host === 'boss.ihomefnt.com') {
					var ws = new WebSocket("ws://" + window.location.host + ":8280/api/callnotice");
				} else {
					var ws = new WebSocket("ws://192.168.1.11:10014/cms-web/callnotice");
				}
				ws.onopen = function() {
					console.log('ws opened')
				};
				ws.onmessage = function(message) {
					console.log(message)
					messageFn(message)
				};
				// this.send = function(message) {
				//     ws.send(message);
				// }
				scope.$on("$destroy", function() {
					console.log('ws closed')
					ws.close();
				});
			}
		}
	}
]);
MetronicApp.factory('RecursionHelper', [
	'$compile',
	function($compile) {
		return {
			compile: function(element, link) {
				if (angular.isFunction(link)) {
					link = {
						post: link
					};
				}
				var contents = element.contents().remove();
				var compiledContents;
				return {
					pre: (link && link.pre)
						? link.pre
						: null,
					post: function(scope, element) {
						if (!compiledContents) {
							compiledContents = $compile(contents);
						}
						compiledContents(scope, function(clone) {
							element.append(clone);
						});
						if (link && link.post) {
							link.post.apply(null, arguments);
						}
					}
				};
			}
		};
	}
]);
MetronicApp.factory('dataTable2', [
	'ajax2',
	'$compile',
	'$ocLazyLoad',
	'$cacheFactory',
	'$q',
	'searchCond',
	'ajaxCache',
	function(ajax2, $compile, $ocLazyLoad, $cacheFactory, $q, searchCond, ajaxCache) {
		$ocLazyLoad.load({
			insertBefore: '#ng_load_plugins_before',
			files: [
				'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version
			]
		});
		return {
			new: function(table, $scope) {
				return new DataTable(table, $scope);
			}
		};
		function DataTable(table, $scope) {
			var tableId = table.id,
				tableData = table.data,
				tableUrl = table.url,
				href = table.href,
				conditions = table.conditions,
				conditionsBig = table.conditionsBig,
				buttonFunc = table.buttonFunc,
				isConditions = table.isConditions,
				method = table.method;
			this.table = angular.element(tableId);
			if (table.conditions) {
				this.conditions = table.conditions;
			} else {
				this.conditions = {};
			}
			this.tableSearch = function(p) {
				this.conditions = p;
				this.table.DataTable().ajax.reload();
			};
			var deferred = $q.defer();
			this.then = function(fn) {
				deferred.promise.then(fn);
			};
			var self = this;
			if (tableData) {
				var ajaxArray = tableData.toString().match(/\/.*?\/.*?\//g);
			}
			if (angular.isArray(ajaxArray)) {
				ajaxCache(ajaxArray).all(function(d) {
					init();
				});
			} else {
				init();
			}
			function init() {
				var isloaded = $cacheFactory.get('ocLazyLoad').get('assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version);
				isloaded.then(function(data) {
					self.table.dataTable({
						"colReorder": true,
						"language": {
							"aria": {
								"sortAscending": ": activate to sort column ascending",
								"sortDescending": ": activate to sort column descending"
							},
							"paginate": {
								"previous": "Prev",
								"next": "Next"
							},
							"emptyTable": "未找到满足搜索条件的数据",
							"info": "显示 _START_ 到 _END_ ，共 _TOTAL_ 条记录", //Showing _START_ to _END_ of _TOTAL_ entries
							"infoEmpty": "", //No entries found
							"infoFiltered": "", //(filtered1 from _MAX_ total entries)
							"lengthMenu": "Show _MENU_ entries",
							"search": "Search:",
							"zeroRecords": "No matching records found"
						},
						"aaSorting": [],
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
						"stateSave": false,
						"filter": false,
						"serverSide": true,
						"ajax": function(data, callback, settings) {
							var params = {
								"page": data.start / data.length + 1,
								"size": data.length,
								"searchGoodsesConditionVo": self.conditions
							};
							if (isConditions) {
								$.extend(params, {
									conditions: searchCond(self.conditions).concat(conditionsBig)
								});
							} else {
								$.extend(params, self.conditions, conditionsBig);
							}
							if (data.order.length) {
								params.sortCondition = {
									type: data.order[0].column,
									condition: data.order[0].dir
								};
							}
							ajax2({
								method: method || 'POST',
								url: tableUrl,
								data: table.params || params
							}).then(function(datas) {
								if (datas.code == 1) {
									table.ajaxData = datas.obj
									var arr = [];
									if (typeof table.setData === 'function') {
										arr = table.setData(datas);
									} else {
										if (datas.obj && datas.obj.goodses) {
											$.each(datas.obj.goodses, function(i, n) {
												var temp = [];
												temp = tableData(n);
												// scope.tableList.forEach(function(e) {
												//     e ? temp.push(n[e]) : temp.push('')
												// })
												arr.push(temp);
											});
										}
										if (datas.obj && datas.obj.componentVos) {
											$.each(datas.obj.componentVos, function(i, n) {
												var temp = [];
												temp = tableData(n);
												// scope.tableList.forEach(function(e) {
												//     e ? temp.push(n[e]) : temp.push('')
												// })
												arr.push(temp);
											});
										}
									}
									var d = {
										data: arr,
										recordsTotal: datas.obj
											? datas.obj.currentSize
											: 0,
										recordsFiltered: datas.obj
											? datas.obj.currentSize
											: 0
									};
									callback(d);
									self.table.find('tbody tr').each(function(i, n) {
										var rowData = self.table.api().row(i).data();
										if (!rowData) {
											return false;
										}
										angular.element(n).attr('draggable', '');
										angular.element(n).css("cursor", "pointer");
										$compile(n)($scope);
										// $(self).append($compile(n)($scope));
										// $scope.$apply();
										if (typeof href === 'function') {
											angular.element(n).click(function(e) {
												if (e.target.localName === 'td') {
													window.location.href = href(rowData);
												}
											});
										}
									});
									if (buttonFunc) {
										if (typeof buttonFunc === 'function') {
											self.table.find('tbody tr td:last-child').each(buttonFunc(self));
										} else if (typeof buttonFunc === 'object') {
											if (buttonFunc.selector && buttonFunc.func) {
												self.table.find(buttonFunc.selector).each(buttonFunc.func(self));
											}
										}
									}
									if (typeof table.render === 'function') {
										table.render(self);
									}
									self.table.find('td').css('vertical-align', 'middle');
									self.table.find('td').css('text-align', 'center');
									self.table.find('th').css('vertical-align', 'middle');
									self.table.find('th').css('text-align', 'center');
									deferred.resolve();
								}
							});
						}
					});
				});
			}
		}
	}
]);
MetronicApp.factory('dataTable3', [
	'ajax2',
	'$compile',
	'$ocLazyLoad',
	'$cacheFactory',
	'$q',
	'searchCond',
	'ajaxCache',
	function(ajax2, $compile, $ocLazyLoad, $cacheFactory, $q, searchCond, ajaxCache) {
		$ocLazyLoad.load({
			insertBefore: '#ng_load_plugins_before',
			files: [
				'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version
			]
		});
		return {
			new: function(table, $scope) {
				return new DataTable(table, $scope);
			}
		};
		function DataTable(table, $scope) {
			var tableId = table.id,
				tableData = table.data,
				tableUrl = table.url,
				href = table.href,
				conditions = table.conditions,
				conditionsBig = table.conditionsBig,
				buttonFunc = table.buttonFunc,
				isConditions = table.isConditions,
				method = table.method;
			this.table = angular.element(tableId);
			if (table.conditions) {
				this.conditions = table.conditions;
			} else {
				this.conditions = {};
			}
			this.tableSearch = function(p) {
				this.conditions = p;
				this.table.DataTable().ajax.reload();
			};
			var deferred = $q.defer();
			this.then = function(fn) {
				deferred.promise.then(fn);
			};
			var self = this;
			if (tableData) {
				var ajaxArray = tableData.toString().match(/\/.*?\/.*?\//g);
			}
			if (angular.isArray(ajaxArray)) {
				ajaxCache(ajaxArray).all(function(d) {
					init();
				});
			} else {
				init();
			}
			function init() {
				var isloaded = $cacheFactory.get('ocLazyLoad').get('assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version);
				isloaded.then(function(data) {
					self.table.dataTable({
						"colReorder": true,
						"language": {
							"aria": {
								"sortAscending": ": activate to sort column ascending",
								"sortDescending": ": activate to sort column descending"
							},
							"paginate": {
								"previous": "Prev",
								"next": "Next"
							},
							"emptyTable": "未找到满足搜索条件的数据",
							"info": "显示 _START_ 到 _END_ ，共 _TOTAL_ 条记录", //Showing _START_ to _END_ of _TOTAL_ entries
							"infoEmpty": "", //No entries found
							"infoFiltered": "", //(filtered1 from _MAX_ total entries)
							"lengthMenu": "Show _MENU_ entries",
							"search": "Search:",
							"zeroRecords": "No matching records found"
						},
						"aaSorting": [],
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
						"stateSave": false,
						"filter": false,
						"serverSide": true,
						"ajax": function(data, callback, settings) {
							var params = {
								"page": data.start / data.length + 1,
								"size": data.length,
								"searchComponmentsConditionParamVo": self.conditions
							};
							if (isConditions) {
								$.extend(params, {
									conditions: searchCond(self.conditions).concat(conditionsBig)
								});
							} else {
								$.extend(params, self.conditions, conditionsBig);
							}
							if (data.order.length) {
								params.sortCondition = {
									type: data.order[0].column,
									condition: data.order[0].dir
								};
							}
							ajax2({
								method: method || 'POST',
								url: tableUrl,
								data: table.params || params
							}).then(function(datas) {
								if (datas.code == 1) {
									table.ajaxData = datas.obj
									var arr = [];
									if (typeof table.setData === 'function') {
										arr = table.setData(datas);
									} else {
										if (datas.obj && datas.obj.goodses) {
											$.each(datas.obj.goodses, function(i, n) {
												var temp = [];
												temp = tableData(n);
												// scope.tableList.forEach(function(e) {
												//     e ? temp.push(n[e]) : temp.push('')
												// })
												arr.push(temp);
											});
										}
										if (datas.obj && datas.obj.componentVos) {
											$.each(datas.obj.componentVos, function(i, n) {
												var temp = [];
												temp = tableData(n);
												// scope.tableList.forEach(function(e) {
												//     e ? temp.push(n[e]) : temp.push('')
												// })
												arr.push(temp);
											});
										}
									}
									var d = {
										data: arr,
										recordsTotal: datas.obj
											? datas.obj.currentSize
											: 0,
										recordsFiltered: datas.obj
											? datas.obj.currentSize
											: 0
									};
									callback(d);
									self.table.find('tbody tr').each(function(i, n) {
										var rowData = self.table.api().row(i).data();
										if (!rowData) {
											return false;
										}
										angular.element(n).attr('draggable', '');
										angular.element(n).css("cursor", "pointer");
										$compile(n)($scope);
										// $(self).append($compile(n)($scope));
										// $scope.$apply();
										if (typeof href === 'function') {
											angular.element(n).click(function(e) {
												if (e.target.localName === 'td') {
													window.location.href = href(rowData);
												}
											});
										}
									});
									if (buttonFunc) {
										if (typeof buttonFunc === 'function') {
											self.table.find('tbody tr td:last-child').each(buttonFunc(self));
										} else if (typeof buttonFunc === 'object') {
											if (buttonFunc.selector && buttonFunc.func) {
												self.table.find(buttonFunc.selector).each(buttonFunc.func(self));
											}
										}
									}
									if (typeof table.render === 'function') {
										table.render(self);
									}
									self.table.find('td').css('vertical-align', 'middle');
									self.table.find('td').css('text-align', 'center');
									self.table.find('th').css('vertical-align', 'middle');
									self.table.find('th').css('text-align', 'center');
									deferred.resolve();
								}
							});
						}
					});
				});
			}
		}
	}
]);
MetronicApp.factory('dataTable4', [
	'ajax2',
	'$compile',
	'$ocLazyLoad',
	'$cacheFactory',
	'$q',
	'searchCond',
	'ajaxCache',
	function(ajax2, $compile, $ocLazyLoad, $cacheFactory, $q, searchCond, ajaxCache) {
		$ocLazyLoad.load({
			insertBefore: '#ng_load_plugins_before',
			files: [
				'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version
			]
		});
		return {
			new: function(table, $scope) {
				return new DataTable(table, $scope);
			}
		};
		function DataTable(table, $scope) {
			var tableId = table.id,
				tableData = table.data,
				tableUrl = table.url,
				href = table.href,
				conditions = table.conditions,
				conditionsBig = table.conditionsBig,
				buttonFunc = table.buttonFunc,
				isConditions = table.isConditions,
				method = table.method;
			this.table = angular.element(tableId);
			if (table.conditions) {
				this.conditions = table.conditions;
			} else {
				this.conditions = {};
			}
			this.tableSearch = function(p) {
				this.conditions = p;
				this.table.DataTable().ajax.reload();
			};
			var deferred = $q.defer();
			this.then = function(fn) {
				deferred.promise.then(fn);
			};
			var self = this;
			if (tableData) {
				var ajaxArray = tableData.toString().match(/\/.*?\/.*?\//g);
			}
			if (angular.isArray(ajaxArray)) {
				ajaxCache(ajaxArray).all(function(d) {
					init();
				});
			} else {
				init();
			}
			function init() {
				var isloaded = $cacheFactory.get('ocLazyLoad').get('assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version);
				isloaded.then(function(data) {
					self.table.dataTable({
						"colReorder": true,
						"language": {
							"aria": {
								"sortAscending": ": activate to sort column ascending",
								"sortDescending": ": activate to sort column descending"
							},
							"paginate": {
								"previous": "Prev",
								"next": "Next"
							},
							"emptyTable": "未找到满足搜索条件的数据",
							"info": "显示 _START_ 到 _END_ ，共 _TOTAL_ 条记录", //Showing _START_ to _END_ of _TOTAL_ entries
							"infoEmpty": "", //No entries found
							"infoFiltered": "", //(filtered1 from _MAX_ total entries)
							"lengthMenu": "Show _MENU_ entries",
							"search": "Search:",
							"zeroRecords": "No matching records found"
						},
						"aaSorting": [],
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
						"stateSave": false,
						"filter": false,
						"serverSide": true,
						"ajax": function(data, callback, settings) {
							var params = {
								"pageNo": data.start / data.length + 1,
								"pageSize": data.length,
								'reviewStatus': ''
							};
							if (isConditions) {
								$.extend(params, {
									conditions: searchCond(self.conditions).concat(conditionsBig)
								});
							} else {
								$.extend(params, self.conditions, conditionsBig);
							}
							if (data.order.length) {
								params.sortConndition = {
									type: data.order[0].column,
									condition: data.order[0].dir
								};
							}
							ajax2({
								method: method || 'POST',
								url: tableUrl,
								data: table.params || params
							}).then(function(datas) {
								if (datas.code == 1) {
									var arr = [];
									if (typeof table.setData === 'function') {
										arr = table.setData(datas);
									} else {
										if (datas.obj && datas.obj.list) {
											$.each(datas.obj.list, function(i, n) {
												var temp = [];
												temp = tableData(n);
												// scope.tableList.forEach(function(e) {
												//     e ? temp.push(n[e]) : temp.push('')
												// })
												arr.push(temp);
											});
										}
										if (datas.obj && datas.obj.componentVos) {
											$.each(datas.obj.componentVos, function(i, n) {
												var temp = [];
												temp = tableData(n);
												// scope.tableList.forEach(function(e) {
												//     e ? temp.push(n[e]) : temp.push('')
												// })
												arr.push(temp);
											});
										}
									}
									var d = {
										data: arr,
										recordsTotal: datas.obj
											? datas.obj.count
											: 0,
										recordsFiltered: datas.obj
											? datas.obj.count
											: 0
									};
									callback(d);
									self.table.find('tbody tr').each(function(i, n) {
										var rowData = self.table.api().row(i).data();
										if (!rowData) {
											return false;
										}
										angular.element(n).attr('draggable', '');
										angular.element(n).css("cursor", "pointer");
										$compile(n)($scope);
										// $(self).append($compile(n)($scope));
										// $scope.$apply();
										if (typeof href === 'function') {
											angular.element(n).click(function(e) {
												if (e.target.localName === 'td') {
													window.location.href = href(rowData);
												}
											});
										}
									});
									if (buttonFunc) {
										if (typeof buttonFunc === 'function') {
											self.table.find('tbody tr td:last-child').each(buttonFunc(self));
										} else if (typeof buttonFunc === 'object') {
											if (buttonFunc.selector && buttonFunc.func) {
												self.table.find(buttonFunc.selector).each(buttonFunc.func(self));
											}
										}
									}
									if (typeof table.render === 'function') {
										table.render(self);
									}
									self.table.find('td').css('vertical-align', 'middle');
									self.table.find('td').css('text-align', 'center');
									self.table.find('th').css('vertical-align', 'middle');
									self.table.find('th').css('text-align', 'center');
									deferred.resolve();
								}
							});
						}
					});
				});
			}
		}
	}
]);
MetronicApp.factory('dataTableall', [
	'ajax2',
	'$compile',
	'$ocLazyLoad',
	'$cacheFactory',
	'$q',
	'searchCond',
	'ajaxCache',
	function(ajax2, $compile, $ocLazyLoad, $cacheFactory, $q, searchCond, ajaxCache) {
		$ocLazyLoad.load({
			insertBefore: '#ng_load_plugins_before',
			files: [
				'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css?v=' + MetronicApp.version,
				'assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version
			]
		});
		return {
			new: function(table, $scope) {
				return new DataTable(table, $scope);
			}
		};
		function DataTable(table, $scope) {
			var tableId = table.id,
				tableData = table.data,
				tableUrl = table.url,
				href = table.href,
				allList = table.allList,
				conditions = table.conditions,
				conditionsBig = table.conditionsBig,
				buttonFunc = table.buttonFunc,
				isConditions = table.isConditions,
				method = table.method;
			var pageSize = 30;
			if (table.pageSize) {
				pageSize = table.pageSize;
			}
			this.table = angular.element(tableId);
			if (table.conditions) {
				this.conditions = table.conditions;
			} else {
				this.conditions = {};
			}
			this.tableSearch = function(p) {
				this.conditions = p;
				this.table.DataTable().ajax.reload();
			};
			var deferred = $q.defer();
			this.then = function(fn) {
				deferred.promise.then(fn);
			};
			var self = this;
			if (tableData) {
				var ajaxArray = tableData.toString().match(/\/.*?\/.*?\//g);
			}
			if (angular.isArray(ajaxArray)) {
				ajaxCache(ajaxArray).all(function(d) {
					init();
				});
			} else {
				init();
			}
			function init() {
				var isloaded = $cacheFactory.get('ocLazyLoad').get('assets/global/plugins/datatables/all.min.js?v=' + MetronicApp.version);
				isloaded.then(function(data) {
					self.table.dataTable({
						"colReorder": true,
						"language": {
							"aria": {
								"sortAscending": ": activate to sort column ascending",
								"sortDescending": ": activate to sort column descending"
							},
							"paginate": {
								"previous": "Prev",
								"next": "Next"
							},
							"emptyTable": "未找到满足搜索条件的数据",
							"info": "显示 _START_ 到 _END_ ，共 _TOTAL_ 条记录", //Showing _START_ to _END_ of _TOTAL_ entries
							"infoEmpty": "", //No entries found
							"infoFiltered": "", //(filtered1 from _MAX_ total entries)
							"lengthMenu": "Show _MENU_ entries",
							"search": "Search:",
							"zeroRecords": "No matching records found"
						},
						ordering: false,
						"aaSorting": [],
						"lengthMenu": [
							[
								5, 15, 20, -1
							],
							[5, 15, 20, "All"] // change per page values here
						],
						// set the initial value
						"pageLength": pageSize,
						"pagingType": "bootstrap_full_number",
						"lengthChange": false,
						"stateSave": true,
						"filter": false,
						"serverSide": true,
						"ajax": function(data, callback, settings) {
							var params = {
								"pageNo": data.start / data.length + 1,
								"pageSize": data.length,
								'reviewStatus': ''
							};
							if (isConditions) {
								$.extend(params, {
									conditions: searchCond(self.conditions).concat(conditionsBig)
								});
							} else {
								$.extend(params, self.conditions, conditionsBig);
							}
							if (data.order.length) {
								params.sortConndition = {
									type: data.order[0].column,
									condition: data.order[0].dir
								};
							}
							ajax2({
								method: method || 'POST',
								url: tableUrl,
								data: table.params || params
							}).then(function(datas) {
								if (datas.code == 1) {
									var arr = [];
									if (typeof table.setData === 'function') {
										arr = table.setData(datas);
									} else {
										if (datas.obj && datas.obj[allList]) {
											$.each(datas.obj[allList], function(i, n) {
												var temp = [];
												temp = tableData(n);
												// scope.tableList.forEach(function(e) {
												//     e ? temp.push(n[e]) : temp.push('')
												// })
												arr.push(temp);
											});
										}
									}
									var allCount = 0;
									if (undefined != datas.obj.totalRecords) {
										allCount = datas.obj.totalRecords;
									}
									if (undefined != datas.obj.count) {
										allCount = datas.obj.count;
									}
									var d = {
										data: arr,
										recordsTotal: datas.obj
											? allCount
											: 0,
										recordsFiltered: datas.obj
											? allCount
											: 0
									};
									callback(d);
									self.table.find('tbody tr').each(function(i, n) {
										var rowData = self.table.api().row(i).data();
										if (!rowData) {
											return false;
										}
										angular.element(n).attr('draggable', '');
										angular.element(n).css("cursor", "pointer");
										$compile(n)($scope);
										// $(self).append($compile(n)($scope));
										// $scope.$apply();
										if (typeof href === 'function') {
											angular.element(n).click(function(e) {
												if (e.target.localName === 'td') {
													window.location.href = href(rowData);
												}
											});
										}
									});
									if (buttonFunc) {
										if (typeof buttonFunc === 'function') {
											self.table.find('tbody tr td:last-child').each(buttonFunc(self));
										} else if (typeof buttonFunc === 'object') {
											if (buttonFunc.selector && buttonFunc.func) {
												self.table.find(buttonFunc.selector).each(buttonFunc.func(self));
											}
										}
									}
									if (typeof table.render === 'function') {
										table.render(self);
									}
									self.table.find('td').css('vertical-align', 'middle');
									self.table.find('td').css('text-align', 'center');
									self.table.find('th').css('vertical-align', 'middle');
									self.table.find('th').css('text-align', 'center');
									deferred.resolve();
								}
							});
						}
					});
				});
			}
		}
	}
]);
MetronicApp.factory("DialogService", [
	"$http",
	"$document",
	"$rootScope",
	"$compile",
	'$q',
	function($http, $document, $rootScope, $compile, $q) {
		var zIndex = 1050;
		var dialogCounter = 0;
		var dialogMap = {};
		return {
			modal: function(param, data) {
				var defer = $q.defer();
				$http.get(param.url).then(function(result) {
					dialogCounter += 2;
					dialogMap[param.key] = param;
					//console.log(dialogMap)
					dialogMap[param.key].promise = defer.promise;
					//console.log(dialogMap)
					var mask = angular.element('<div class="modal-backdrop fade in"></div>');
					$document.find("body").append(mask).addClass('overflow-hidden');
					mask.css("z-index", zIndex + dialogCounter);
					dialogMap[param.key].mask = mask;
					var dialog = angular.element(result.data);
					var newScope = $rootScope.$new();
					if (data) {
						angular.extend(newScope, data);
					}
					var element = $compile(dialog)(newScope);
					$document.find("body").append(element);
					element.css("display", "block");
					element.css("z-index", zIndex + dialogCounter + 1);
					element.css("top", '100px');
					dialogMap[param.key].dialog = element;
					defer.resolve();
				});
			},
			accept: function(key, result) {
				this.dismiss(key);
				if (dialogMap[key].accept) {
					dialogMap[key].accept(result);
				}
			},
			refuse: function(key, reason) {
				this.dismiss(key);
				if (dialogMap[key].refuse) {
					dialogMap[key].refuse(reason);
				}
			},
			dismiss: function(key) {
				dialogMap[key].mask.remove();
				dialogMap[key].dialog.remove();
				$document.find("body").removeClass('overflow-hidden');
				//            delete dialogMap[key];
			},
			hide: function(key) {
				dialogMap[key].promise.then(function() {
					dialogMap[key].mask.hide();
					dialogMap[key].dialog.hide();
				});
			},
			show: function(key) {
				dialogMap[key].mask && dialogMap[key].mask.show();
				dialogMap[key].dialog && dialogMap[key].dialog.show();
			},
			dismissAll: function() {
				for (var key in dialogMap) {
					this.dismiss(key);
				}
			},
			postMessage: function(key, type, message) {
				if (dialogMap[key].messageHandler) {
					if (dialogMap[key].messageHandler[type]) {
						dialogMap[key].messageHandler[type](message);
					}
				}
			}
		};
	}
]);
MetronicApp.factory('intoBarcode', [
	'$compile',
	'$ocLazyLoad',
	'$cacheFactory',
	'$q',
	function($compile, $ocLazyLoad, $cacheFactory, $q) {
		$ocLazyLoad.load({
			insertBefore: '#ng_load_plugins_before',
			files: ['assets/global/plugins/JsBarcode.all.min.js?v=' + MetronicApp.version]
		});
		return {
			new: function(uid) {
				var elem = $('<img id="barcodeDom">');
				var options2 = {
					format: "CODE128",
					displayValue: false
					// fontSize: 18,
					// height: 100
				};
				elem.JsBarcode(uid, options2);
				return elem[0].src
			}
		}
	}
]);
// MetronicApp.factory('$exceptionHandler', ['userNow', function(userNow) {
//     return function(exception, cause) {
//         window.open('mailto:test@example.com');
//         throw exception;
//     };
// }]);
/*
confirm弹框(created by sunhan on 2017/02/13)
example:
	confirmMessage({
	  	el: event.target,
	  	title: '想要删除吗？',
	  	confirmCallback: function() {
	    	//确定按钮回调
	  	}
	})
 */
MetronicApp.factory('confirmMessage', [
	"$document",
	function($document) {
		return function(options) {
			var triggerBtn = options.el;
			var btnOffset = $(triggerBtn).offset();
			var title = options.title || '确定要删除吗？';
			var confirmMessage = angular.element('<div class="confirm-message">' +
			'<div class="confirm-message-arrow"></div>' +
			'<div>' +
			'<div class="confirm-message-title">' + title + '</div>' + '<div class="confirm-message-btn-container">' + '<button class="btn primary btn-xs cancel-btn mr10">取消</button>' + '<button class="btn blue btn-xs confirm-btn">确定</button>' + '</div>' + '</div>' + '</div>');
			$('.confirm-message').remove();
			$document.find('body').append(confirmMessage);
			var $confirmMsg = $('.confirm-message');
			var confirmWidth = $confirmMsg.outerWidth();
			var confirmHeight = $confirmMsg.outerHeight();
			var confirmTop = btnOffset.top - (confirmHeight - triggerBtn.clientHeight) / 2;
			if (btnOffset.left > confirmWidth + 50) {
				//弹窗在按钮左侧
				$confirmMsg.offset({
					'top': confirmTop,
					'left': btnOffset.left - confirmWidth - 10
				});
				$confirmMsg.find('.confirm-message-arrow').css({'transform': 'rotate(135deg)', 'right': '-6px', 'top': '46px'});
			} else {
				//弹窗在按钮右侧
				$confirmMsg.offset({
					'top': confirmTop,
					'left': btnOffset.left + triggerBtn.clientWidth + 10
				});
				$confirmMsg.find('.confirm-message-arrow').css({'transform': 'rotate(-45deg)', 'left': '-6px', 'top': '46px'});
			}
			$confirmMsg.find('.confirm-btn').click(function(event) {
				options.confirmCallback();
				$confirmMsg.remove();
			});
			$confirmMsg.find('.cancel-btn').click(function(event) {
				$confirmMsg.remove();
			});
			$confirmMsg.click(function(e) {
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
			});
			$document.click(function(e) {
				if (e.target.dataset.confirm == undefined) {
					$confirmMsg.remove();
				}
			});
		};
	}
]);
/*
alert提示(created by sunhan on 2017/02/13)
example:
	message(type, content) //type:['success', 'info', 'warn', 'error']
 */
MetronicApp.factory('alertMessage', [
	"$document",
	function($document) {
		return function(type, content) {
			var msgClass = 'vi-message' +
			'-' + type;
			var messaage = angular.element('<div class="vi-message ' + msgClass + '">' + '<div class="vi-message-content">' + content + '</div>' + '</div>');
			$('.vi-message').remove();
			$document.find('body').append(message);
			$message = $('.vi-message');
			$message.css('left', ($('body').width() - $message.outerWidth()) / 2);
			setTimeout(function() {
				$message.remove();
			}, 3000);
		};
	}
]);
//轮播图片
MetronicApp.factory('Shuffling', function() {
	//传入的必须是字符串数组List
	return function(List) {
		var layerImageJson = {
			"title": "", //相册标题
			"id": "", //相册id
			"start": 0, //初始显示的图片序号，默认0
			"data": []
		}
		List.forEach(function(n) {
			var obj = { //相册包含的图片，数组格式
				"alt": "",
				"pid": "", //图片id
				"src": "", //原图地址
				"thumb": "" //缩略图地址
			}
			obj.src = n;
			erImageJson.data.push(obj);
		});
		layer.photos({photos: layerImageJson, anim: 5});
	}
});
