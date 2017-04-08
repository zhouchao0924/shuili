//商品选择弹出框
MetronicApp.directive('productSelectNoRecord', ['queryBrand1', 'ajax1', 'getRoomTypeFilter', 'getStyleTextFilter',
    function(queryBrand1, ajax1, getRoomTypeFilter, getStyleTextFilter) {
        var linker2 = function(scope, elem, attrs, ctrl) {
            var selectGoodsList = [];
            var goodsSearched = [];
            var queryUrl = '/psi/adjustOrder/queryCargoInfoByParams/';
            elem.find('.modal.fade.bs-modal-lg').attr('id', scope.modalId);
            var table = elem.find('#sample_noRecord');

            initQueryCargoCondition();

            function initQueryCargoCondition(){
               ajax1("/psi/adjustOrder/initQueryCargoCondition/").then(function(data){

                    scope.categoryList2=data.obj.categoryArr;
                    scope.susupplierList2=data.obj.susupplierArr;


                });
                //scope.categoryList=[{"code":1,"name":"衣柜1"},{"code":2,"name":"衣柜2"},{"code":3,"name":"衣柜3"}];
                //scope.susupplierList=[{"code":1,"name":"厂家1"},{"code":2,"name":"厂家2"},{"code":3,"name":"厂家3"}];
             }




            $('#' + scope.modalId).on('show.bs.modal', function() {

                selectGoodsList = [];
                elem.find('table input').prop('checked', false);
                $.uniform.update();
            });

           

            scope.goodsDialogOK = function() {
                var oldGoodsList = ctrl.$viewValue;
                var noAccountExtra={
                    "actualPurchasePrice":0,
                    "surplusCargoCount":0,
                    "surplusPacCount":0,
                    "adjustReason":''
                }
                $.each(selectGoodsList, function(i, n) {
                     Object.assign(n,noAccountExtra);
                });
                if(oldGoodsList!=undefined){
                    oldGoodsList=oldGoodsList.concat(selectGoodsList);
                    ctrl.$setViewValue(oldGoodsList);
                }else{
                    ctrl.$setViewValue(selectGoodsList);
                } 
                $('#' + scope.modalId).modal('hide');
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
                        
                    };
                    Metronic.blockUI({
                        message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>',
                        textOnly: true
                    });
                     $.extend(params, scope.noAccount);
                    // 查询所有货物
                    // /psi/adjustOrder/queryWhseCargoInfo/
                    $.ajax({
                       url: Metronic.host + queryUrl + a.userId + '/' + a.sessionId,
                        //url:"http://localhost:8080/front-end/cms-front/data/queryWhseCargoInfo.json",
                        type: 'POST',
                        cache: false,
                        dataType: 'json',
                        data: JSON.stringify(params),
                        success: function(datas) {
                            if (datas.code == 1) {
                                goodsSearched = datas.obj.list;


                                var arr = [];
                                $.each(datas.obj.list, function(i, n) {
                                    /*货号、图片、名称、分类、厂家编号、包裹数、供应商、采购价格*/
                                    var purchasePrice=(n.purchasePrice).toFixed(2);
                                    var temp = ['', n.cargoNo,"<img height='50' src='"+n.image+"'/>", n.categoryName,n.categoryName, n.supplierId,n.packageSum,n.supplierName,purchasePrice,n.productId];
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
                                    var input = '<input type="checkbox" class="checkboxes" value="' + rowData[9] + '" /> </td>';
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

                        
                    } else {
                        if ($(this).is(":checked")) {
                            $(n).click();
                        }
                       
                    }
                });
                $.uniform.update(set);
            });
            //选择盈余货物
            table.delegate('input.checkboxes', 'change', function(e) {
                var index = $(e.target).closest('tr').index();
                if (e.target.checked) {
                    var oldGoodsList = ctrl.$viewValue;
                    if(oldGoodsList){
                        var flag=true;
                        $.each(oldGoodsList,function(i,n){
                            
                            if(parseInt(n.productId) == parseInt(e.target.value)){
                                alert('此货物已经选择');
                                e.target.checked=false;
                                $.uniform.update();
                                flag=false
                                return false;
                            }
                        });
                        if(flag){

                            selectGoodsList.push(goodsSearched[index]);
                        }
                    }else{
                        //selectGoodsList.push(2);
                         selectGoodsList.push(goodsSearched[index]);
                    }
                    
                    
                    
                } else {
                    $.each(selectGoodsList, function(i, n) {
                        if (n && parseInt(n.productId) === parseInt(e.target.value)) {
                           selectGoodsList.splice(i, 1);
                        }
                    });
                }
               
            });

             $('#productSearch2').click(function(e) {
                oTable.fnDraw();
            })
            
             scope.emptyNoData=function(){
                scope.noAccount={}
            }
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
            templateUrl: 'tpl/psi/adjuststock/productSelectNoRecordModal.html',
            link: linker2
        };
    }
]);