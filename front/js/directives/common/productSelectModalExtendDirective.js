//商品选择弹出框
MetronicApp.directive('productSelectExtendModal', [
    'queryBrand1',
    'ajax1',
    'getRoomTypeFilter',
    'getStyleTextFilter',
    'alertMessage',
    function(queryBrand1, ajax1, getRoomTypeFilter, getStyleTextFilter, alertMessage) {
        var linker = function(scope, elem, attrs, ctrl) {
            var selectGoodsList = [];
            var selectRoomsList = [];
            var selectSuitsList = [];
            var goodsSearched = [];
            // var conditions = [];
            var conditions_roomSearch = [];
            var conditions_suitSearch = [];
            var productNotExist = [];
            var productOffShelf = [];
            var originalCondition;
            var queryUrl = '/gateway/search/searchGoodses/1.0.0/';
            scope.types = [];
            scope.brands = [];
            scope.selectCategoryId = null;
            scope.selectColorId = null;
            scope.skuId = null;
            scope.colorName = null;
            scope.searchDetail = {};
            var searchGoodsesConditionVo = {
                // 'typeThreeId': null,
                // 'typeTwoId': null,
                // 'aijiaLowerPrice': null,
                // 'aijiaUpperPrice': null,
                // 'typeOneId': null,
                // 'brandIdOne': null,
                // 'brandIdTwo': null,
                // 'seriesId': null,
                // 'name': null,
                // 'factoryNumber': null,
                // 'spuId': null,
                // 'skuId': null,
                // 'status': null
            }

            elem.find('.form_datetime').datetimepicker({
                isRTL: Metronic.isRTL(), format: "yyyy-mm-dd", autoclose: true, todayBtn: true,
                // startDate: "2013-02-14 10:00",
                pickerPosition: (Metronic.isRTL()
                    ? "bottom-right"
                    : "bottom-left"),
                // minuteStep: 10
                minView: 2
            });
            elem.find('.modal.fade.bs-modal-lg').attr('id', scope.modalId);
            var table = elem.find('#sample_3');
            queryBrand1().then(function(data) {
                scope.brandsAll = data;
            });
            ajax1('/product/queryProductTypeTree/').then(function(data) {
                scope.categorys = data.obj;
            });
            ajax1('/style/queryStyleTree/').then(function(data) {
                scope.styles = data.obj;
            });
            ajax1('/gateway/brand/queryBrand/1.0.0/', {}).then(function(datas) {
                scope.brandTree = datas.obj.brandTreeNodeDtos;
            });

            //获取下拉框类目树数据
            ajax1('/gateway/category/queryCategory/1.0.0/', {type: '1'}).then(function(datas) {
                scope.tree = datas.obj.categoryTreeNodeDtos;
            });
            // 点击下拉框获取不同类目
            scope.querytwo = function(item) {
                scope.childrenitem = item.categoryTreeNodeDtos;
                scope.typeOneId = item.categoryDto? item.categoryDto.id: null;
                scope.typeTwoId = null;
                scope.typeThreeId = null;
            };
            scope.querythree = function(item) {
                scope.grandsonitem = item.categoryTreeNodeDtos;
                scope.typeTwoId = item.categoryDto? item.categoryDto.id: null;
                scope.typeThreeId = null;
            };
            scope.querylast = function(item) {
                scope.typeThreeId = item.categoryDto? item.categoryDto.id: null;
            };
            //品牌查询
            // ajax1('/gateway/brand/queryBrand/1.0.0/', {}).then(function(datas) {
            //  $scope.brandTree = datas.obj.brandTreeNodeDtos;
            // });
            // $scope.selectBrand = function(brandId) {
            //  ajax1('/gateway/brand/queryBrand/1.0.0/', {'id': brandId}).then(function(datas) {
            //      $scope.brand2Tree = datas.obj.brandTreeNodeDtos;
            //      $scope.searchDetail.brand2 = null;
            //  });
            // }

            scope.selectBrand = function(brandId) {
                ajax1('/gateway/brand/queryBrand/1.0.0/', {'id': brandId}).then(function(datas) {
                    scope.brand2Tree = datas.obj.brandTreeNodeDtos;
                    if (scope.brand2Tree.length == 0) {
                        scope.seriesList = [];
                        ajax1('/gateway/brand/querySeries/1.0.0/', {'id': brandId}).then(function(datas) {
                            scope.seriesList = datas.obj;
                        });
                    }
                });
                ajax1('/gateway/brand/queryBrandById/1.0.0/', 173).then(function(datas) {
                    scope.brandName = datas.obj.name;
                });
            }
            scope.selectBrand2 = function(brandId) {
                scope.seriesList = [];
                ajax1('/gateway/brand/querySeries/1.0.0/', {'id': brandId}).then(function(datas) {
                    scope.seriesList = datas.obj;
                });
            }
            scope.selectSeries = function(obj) {
                obj.seriesList.forEach((series) => {
                    if (series.id == obj.seriesId) {
                        scope.seriesName = series.name;
                        scope.series = series;
                    }
                });
                scope.seriesId = obj.seriesId;
            }

            $('#' + scope.modalId).on('show.bs.modal', function() {
                selectGoodsList = [];
                elem.find('table input').prop('checked', false);
                $.uniform.update();
            });
            if (attrs.associatedId) {
                scope.$watch('associatedId', function(newValue, oldValue) {
                    if (newValue == oldValue)
                        return;
                    originalCondition.condition = newValue;
                    table.DataTable().ajax.reload();
                });
            }
            //选择规格
            scope.chooseModel = function(e, categoryId) {
                $('.xi-product-model li').removeClass('isChoose');
                $('.xi-product-modelValue li').removeClass('isChoose');
                $(e.target).addClass('isChoose');
                scope.selectCategoryId = categoryId;
                scope.categoryList.forEach(function(category){
                    if(category.categoryId == categoryId){
                        scope.colorList = category.skuColorInfoDtos;
                    }
                })
                scope.skuId = null;
                scope.colorName = null;
            }
            //选择颜色
            scope.chooseModelValue = function(e, colorId, skuId, colorName, imageUrl){
                $('.xi-product-modelValue li').removeClass('isChoose');
                $(e.target).addClass('isChoose');
                scope.selectColorId = colorId;

                scope.productImage = imageUrl;
                scope.skuId = skuId;
                scope.colorName = colorName;
            }
            //确认选择颜色
            scope.selectGoodSku = function(){
                if(!scope.skuId){
                    alertMessage('error', '请选择颜色！');
                    return;
                }
                ajax1("/gateway/sku/querySimpleSkuById/1.0.0/", scope.skuId).then(function(data) {
                    console.log(data,"======querySimpleSkuById======");
                    selectGoodsList = [];
                    selectGoodsList.push(data.obj);
                    var oldGoodsList = ctrl.$viewValue;
                    oldGoodsData = angular.copy(oldGoodsList)
                    var skuId = scope.skuId;
                    var colorName = scope.colorName;
                    if(selectGoodsList[0]['skuId']){
                        selectGoodsList[0].skuId = skuId;
                        selectGoodsList[0].colorName = colorName;
                    }else{
                        selectGoodsList[0]['skuId'] = skuId;
                        selectGoodsList[0]['colorName'] = colorName;
                    }
                    
                    $.each(selectGoodsList, function(i, n) {
                        if (null == n.productAmount || undefined == n.productAmount) {
                            n.productAmount = 1;
                        }
                        n.isSample = 0;
                        n.productPrice = n.price;
                        n.productId = skuId;
                    });

                    if (undefined != oldGoodsData) {
                        $.each(selectGoodsList, function(i, n) {
                            var bHas = false;
                            $.each(oldGoodsData, function(index, ele) {
                                if (n.skuId == ele.skuId) {
                                    bHas = true;
                                    if (null == n.productAmount || undefined == n.productAmount) {
                                        n.productAmount = 1;
                                    }
                                    ele.productAmount = ele.productAmount + n.productAmount;
                                }
                            });
                            if (!bHas) {
                                oldGoodsData.push(n);
                            }
                        });
                        scope.selectCategoryId = null;
                        scope.productImage = null;
                        scope.skuId = null;
                        ctrl.$setViewValue(oldGoodsData);
                    } else {
                        ctrl.$setViewValue(selectGoodsList);
                    }
                    $('#deliverGoodsDialog').modal('hide');
                });
            }
            //选择商品
            scope.goodsDialogOK = function() {
                if(selectGoodsList.length > 1) {
                    alertMessage('error', '最多只能选择一件商品');
                    return;
                }
                if(selectGoodsList.length == 0) {
                    alertMessage('error', '请选择一件商品');
                    return;
                }
                var spuId = selectGoodsList[0].spuId;
                ajax1('/gateway/product/querySkuInfoBySpuId/1.0.0/', spuId).then(function(data){
                    selectGoodsList[0]['models'] = data.obj;
                    if(data.obj.skuCategoryDtos && data.obj['skuCategoryDtos'].length>0){
                        scope.productName = selectGoodsList[0].productName;
                        scope.categoryList = selectGoodsList[0]['models']['skuCategoryDtos'];
                        scope.skuMap = selectGoodsList[0]['models']['skuMap'];
                        scope.colorList = selectGoodsList[0]['models']['skuCategoryDtos'][0]['skuColorInfoDtos'];
                        $('#' + scope.modalId).modal('hide');
                        $('#deliverGoodsDialog').modal('show');
                        $('.xi-product-model li').removeClass('isChoose');
                        $('.xi-product-modelValue li').removeClass('isChoose');
                        scope.selectCategoryId = null;
                        scope.productImage = null;
                        scope.skuId = null;
                    }else{
                        scope.skuId = data.obj.skuId;
                        scope.selectGoodSku();
                        $('#' + scope.modalId).modal('hide');
                    }
                })
            };
            //快捷添加商品
            scope.addGoods = function(){
                var prdPut = $("input[name=productId]");
                var val = prdPut.val();
                var reg = /^[0-9]*$/;
                if(!reg.test(val)){
                    alertMessage('error', '请输入数字！');
                    return;
                }
                if(!val){
                    alertMessage('error', '请输入商品编号！');
                    return;
                }
                if (val) {
                    scope.canNotAdd = true;
                    var params = {
                        'page': 1,
                        'size': 10,
                        'searchGoodsesConditionVo': {
                            'spuId': val
                        }
                    }
                    ajax1('/gateway/search/searchGoodses/1.0.0/', params).then(function(data){
                        if (data.code == 1) {                   
                            if(data.obj.goodses.length == 0){
                                alertMessage('error', '该商品不存在，请重新输入！');
                                return;
                            }
                            var spuId = data.obj.goodses[0].spuId;
                            ajax1('/gateway/product/querySkuInfoBySpuId/1.0.0/', spuId).then(function(catagroyData){
                                selectGoodsList = [];
                                data.obj['models'] = catagroyData.obj;
                                selectGoodsList.push(data.obj)
                                if(catagroyData.obj.skuCategoryDtos && selectGoodsList[0]['models']['skuCategoryDtos'].length>0){
                                    scope.productName = selectGoodsList[0].productName;
                                    scope.categoryList = selectGoodsList[0]['models']['skuCategoryDtos'];
                                    scope.skuMap = selectGoodsList[0]['models']['skuMap'];
                                    scope.colorList = selectGoodsList[0]['models']['skuCategoryDtos'][0]['skuColorInfoDtos'];
                                    $('#' + scope.modalId).modal('hide');
                                    $('#deliverGoodsDialog').modal('show');
                                    $('.xi-product-model li').removeClass('isChoose');
                                    $('.xi-product-modelValue li').removeClass('isChoose');
                                    scope.selectCategoryId = null;
                                    scope.productImage = null;
                                    scope.skuId = null;
                                }else{
                                    scope.skuId = catagroyData.obj.skuId;
                                    scope.selectGoodSku();
                                    $('#' + scope.modalId).modal('hide');
                                }
                            })
                        } else if (data.code == 5) {
                            alertMessage('error', '该商品不存在，请重新输入！');
                        } else if (data.code == 3) {
                            alert(data.ext.msg);
                            window.location.href = 'login.html';
                        } else {
                            alert(data.ext.msg);
                        }
                    })
                }
            }
            //商品搜索
            scope.productSearch = function() {
            	console.log(scope.typeOneId,scope.typeTwoId,scope.typeThreeId,"===========");
                searchGoodsesConditionVo = {};
                if (scope.typeThreeId) {
                    searchGoodsesConditionVo['typeThreeId'] = scope.typeThreeId
                }
                if (scope.typeTwoId) {
                    searchGoodsesConditionVo['typeTwoId'] = scope.typeTwoId
                }
                if (scope.typeOneId) {
                    searchGoodsesConditionVo['typeOneId'] = scope.typeOneId
                }
                if (scope.searchDetail.brand) {
                    searchGoodsesConditionVo['brandIdOne'] = scope.searchDetail.brand
                }
                if (scope.searchDetail.brand2) {
                    searchGoodsesConditionVo['brandIdTwo'] = scope.searchDetail.brand2
                }
                if (scope.seriesId) {
                    searchGoodsesConditionVo['seriesId'] = scope.seriesId
                }
                if (scope.pName) {
                    searchGoodsesConditionVo['name'] = scope.pName
                }
                if (scope.factoryNumber) {
                    searchGoodsesConditionVo['factoryNumber'] = scope.factoryNumber
                }
                if (scope.lowPrice) {
                    searchGoodsesConditionVo['aijiaLowerPrice'] = scope.lowPrice
                }
                if (scope.highPrice) {
                    searchGoodsesConditionVo['aijiaUpperPrice'] = scope.highPrice
                }
                if (scope.modelNum) {
                    searchGoodsesConditionVo['spuId'] = scope.modelNum
                }
                if (scope.skuNum) {
                    searchGoodsesConditionVo['skuId'] = scope.skuNum
                }
                if (scope.status) {
                    searchGoodsesConditionVo['status'] = scope.status
                }
                table.DataTable().ajax.reload();
            };
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
                    var a = JSON.parse(window.localStorage.aijiaUserdata);
                    var params = {
                        page: data.start / data.length + 1,
                        size: data.length,
                        searchGoodsesConditionVo: searchGoodsesConditionVo
                    };
                    Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>', textOnly: true});
                    // 查询商品
                    $.ajax({
                        url: Metronic.host + queryUrl + a.userId + '/' + a.sessionId,
                        type: 'POST',
                        cache: false,
                        dataType: 'json',
                        data: JSON.stringify(params),
                        success: function(datas) {
                            if (datas.code == 1) {
                                var plan = '?imageView2/2/w/200/h/100';
                                goodsSearched = datas.obj.goodses;
                                var arr = [];
                                $.each(datas.obj.goodses, function(i, n) {
                                    var image = '';
                                    if (n.imageUrl) {
                                        image = '<img src=' + n.imageUrl + plan + ' height=100 width=200 />';
                                    }
                                    var style = n.style.join(",");
                                    style=style.substring(0,style.length-1);
                                    var color = n.color.join(",");
                                    color=color.substring(0,color.length-1);
                                    var model = '';
                                    if(style.length>0){
                                        model = '<span>类型:'+style+'</span>';
                                    }
                                    if(color.length>0){
                                        model = '<span>颜色:'+color+'</span>';
                                    }
                                    if(style.length>0 && color.length>0){
                                        model = '<span>类型:'+style+'</span><br/><span>颜色:'+color+'</span>';
                                    }
                                    var price = '￥'+n.aijiaLowerPrice + '~' + '￥' + n.aijiaUpperPrice;
                                    var brandSerie = "";
                                    if(n.brandNameOne){
                                    	brandSerie = n.brandNameOne;
                                    }
                                    if(n.brandNameTwo){
                                        brandSerie = brandSerie + "" + n.brandNameTwo;
                                    }
                                    if(n.serie){
                                        brandSerie = brandSerie + " " + n.serie;
                                    }
                                    var temp = [
                                        '',
                                        n.spuId,
                                        image,
                                        n.name,
                                        brandSerie,
                                        model,
                                        price
                                    ];
                                    // [n.productId, n.productName, n.extra, n.price, n.factoryVersion, n.fidBrand, n.brandManager, n.origin, "", n.status]
                                    arr.push(temp);
                                });
                                var d = {
                                    data: arr,
                                    recordsTotal: datas.obj.total,
                                    recordsFiltered: datas.obj.total
                                };
                                callback(d);
                                table.find('tbody tr td:first-child').each(function(i, n) {
                                    var rowData = table.api().row(i).data();
                                    if (!rowData) {
                                        return false;
                                    }
                                    var input = '<span><input type="radio" name="product" class="checkboxes" style="margin: 0px;position: relative;" value="' + rowData[1] + '" /></span> ';
                                    $(n).append(input);
                                });
                                $('input.checkboxes').uniform();
                                $('input.group-checkable').uniform();
                            } else if (datas.code == 3) {
                                window.location.href = 'login.html';
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

            table.delegate('input.checkboxes', 'change', function(e) {
                var index = $(e.target).closest('tr').index();
                selectGoodsList = []
                if (e.target.checked) {
                    selectGoodsList.push(goodsSearched[index]);
                }
            });
        };
        return {
            restrict: 'E',
            require: '?ngModel',
            scope: {
                ngModel: '=?',
                modalId: '@',
                associatedId: '=?',
                queryUrl: '=?'
            },
            templateUrl: 'tpl/common/productSelectExtendModal.html',
            link: linker
        };
    }
]);
