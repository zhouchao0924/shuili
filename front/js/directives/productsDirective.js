//商品选择弹出框
MetronicApp.directive('productSelectModal', ['queryBrand1', 'ajax1', function(queryBrand1, ajax1) {
    var linker = function(scope, elem, attrs, ctrl) {
        var selectGoodsList = [];
        var goodsSearched = [];
        var conditions = [];
        var originalCondition;
        var queryUrl = scope.queryUrl ? scope.queryUrl : '/product/search/';
        scope.types = [];
        scope.brands = [];
        if (attrs.associatedId) {
            originalCondition = {
                'type': 12,
                'condition': scope.associatedId
            };
            conditions.push(originalCondition);
        } else {
            conditions.push({
                'type': 2,
                'condition': 2
            });
        }
        elem.find('.form_datetime').datetimepicker({
            isRTL: Metronic.isRTL(),
            format: "yyyy-mm-dd",
            autoclose: true,
            todayBtn: true,
            // startDate: "2013-02-14 10:00",
            pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left"),
            // minuteStep: 10
            minView: 2,
        });
        elem.find('.modal.fade.bs-modal-lg').attr('id', scope.modalId);
        var table = elem.find('#sample_3');
        queryBrand1().then(function(data) {
            scope.brandsAll = data;
            // $('#allBrands').on('change', function() {
            //     $("#secondBrands").select2('val', '')
            //     $scope.newLoft.goods.brandSecond = ''
            // })
        });
        ajax1('/product/queryProductTypeTree/').then(function(data) {
            scope.categorys = data.obj;
        });
        ajax1('/style/queryStyleTree/').then(function(data) {
            scope.styles = data.obj;
        });

        $('#' + scope.modalId).on('show.bs.modal', function() {
            selectGoodsList = [];
            elem.find('table input').prop('checked', false);
            $.uniform.update();
        });

        if (attrs.associatedId) {
            scope.$watch('associatedId', function(newValue, oldValue) {
                if (newValue == oldValue) return;
                originalCondition.condition = newValue;
                table.DataTable().ajax.reload();
            });
        }

        scope.goodsDialogOK = function() {
            ctrl.$setViewValue(selectGoodsList);
            $('#' + scope.modalId).modal('hide');
        };

        scope.search = function() {
            conditions = [];
            if (originalCondition) conditions.push(originalCondition);
            if (scope.pName) {
                conditions.push({
                    'type': 1,
                    'condition': scope.pName
                });
            }
            scope.types = scope.types.filter(function(e) {
                return (e !== '');
            });
            if (scope.types.length) {
                conditions.push({
                    'type': 2,
                    'condition': scope.types[scope.types.length - 1].typeKey
                });
            }
            if (scope.stateVal) {
                conditions.push({
                    'type': 3,
                    'condition': scope.stateVal
                });
            }
            scope.brands = scope.brands.filter(function(e) {
                return (e !== '');
            });
            if (scope.brands.length) {
                conditions.push({
                    'type': 4,
                    'condition': scope.brands[scope.brands.length - 1].brandId
                });
            }
            if (scope.styleId) {
                conditions.push({
                    'type': 5,
                    'condition': scope.styleId
                });
            }
            if (scope.serialNum) {
                conditions.push({
                    'type': 6,
                    'condition': scope.serialNum
                });
            }
            if (scope.lowPrice) {
                conditions.push({
                    'type': 7,
                    'condition': scope.lowPrice
                });
            }
            if (scope.highPrice) {
                conditions.push({
                    'type': 8,
                    'condition': scope.highPrice
                });
            }
            if (scope.stTime) {
                conditions.push({
                    'type': 9,
                    'condition': scope.stTime + ' 00:00:00'
                });
            }
            if (scope.edTime) {
                conditions.push({
                    'type': 10,
                    'condition': scope.edTime + ' 00:00:00'
                });
            }
            if (scope.modelNum) {
                conditions.push({
                    'type': 11,
                    'condition': scope.modelNum
                });
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
            "columnDefs": [{
                "orderable": false,
                "targets": [0]
            }],
            "order": [
                [1, 'asc']
            ],
            "lengthMenu": [
                [5, 15, 20, -1],
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
                    pageSize: data.length,
                    conditions: conditions
                };
                Metronic.blockUI({
                    message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>',
                    textOnly: true
                });
                $.ajax({
                    url: Metronic.host + queryUrl + a.userId + '/' + a.sessionId,
                    type: 'POST',
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(params),
                    success: function(datas) {
                        if (datas.code == 1) {
                            goodsSearched = datas.obj.list;
                            var arr = [];
                            $.each(datas.obj.list, function(i, n) {
                                // var temp = []
                                // $.each(self.name_list, function(j, o) {
                                //         if (self.name_list[j] === '') {
                                //             temp.push('')
                                //         } else {
                                //             temp.push(n[self.name_list[j]])
                                //         }
                                //     })
                                var temp = ['', n.productId, n.productName, n.extra, n.factoryVersion, n.fidBrand];
                                // [n.productId, n.productName, n.extra, n.price, n.factoryVersion, n.fidBrand, n.brandManager, n.origin, "", n.status]
                                arr.push(temp);
                            });
                            var d = {
                                data: arr,
                                recordsTotal: datas.obj.totalRecords,
                                recordsFiltered: datas.obj.totalRecords
                            };
                            callback(d);
                            table.find('tbody tr td:first-child').each(function(i, n) {
                                var rowData = table.api().row(i).data();
                                if (!rowData) {
                                    return false;
                                }
                                var input = '<input type="checkbox" class="checkboxes" value="' + rowData[1] + '" /> </td>';
                                $(n).append(input);
                            });
                            $('input.checkboxes').uniform();
                            $('input.group-checkable').uniform();

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
        var groupCheckable = table.find('input.group-checkable');
        var set = groupCheckable.attr("data-set");
        groupCheckable.change(function() {
            var checked = $(this).is(":checked");
            groupCheckable[0].value = '';
            $(set).each(function(i, n) {
                if (checked) {
                    if (!$(this).is(":checked")) {
                        $(n).click();
                    }

                    // $(n).prop("checked", true);
                    // groupCheckable[0].value += (i > 0 ? ',' : '') + $(n).val();
                } else {
                    if ($(this).is(":checked")) {
                        $(n).click();
                    }
                    // $(n).prop("checked", false);
                }
            });
            $.uniform.update(set);
        });
        table.delegate('input.checkboxes', 'change', function(e) {
            var index = $(e.target).closest('tr').index();
            if (e.target.checked) {
                selectGoodsList.push(goodsSearched[index]);
            } else {
                $.each(selectGoodsList, function(i, n) {
                    if (n && parseInt(n.productId) === parseInt(e.target.value)) {
                        selectGoodsList.splice(i, 1);
                    }
                });
            }
            // groupCheckable[0].value = selectedStaffs.join(',');
            // $scope.$apply(function() {
            //     $scope.isStaffSelected = selectedStaffs.join('');
            // })
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
        templateUrl: 'tpl/modalProductSelect.html',
        link: linker
    };
}]);
