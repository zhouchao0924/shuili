//商品选择弹出框
MetronicApp.directive('productSelectIsRecord', ['queryBrand1', 'ajax1', 'getRoomTypeFilter', 'getStyleTextFilter',
    function(queryBrand1, ajax1, getRoomTypeFilter, getStyleTextFilter) {
        var linker = function(scope, elem, attrs, ctrl) {
           
            var selectGoodsList = [];
            var goodsSearched = [];
            scope.orderList=[];
            var queryUrl = '/psi/adjustOrder/queryWhseCargoInfo/';
          
            elem.find('.modal.fade.bs-modal-lg').attr('id', scope.modalId);
            var table = elem.find('#sample_haveCount');
            
           
           
            initQueryCargoCondition();

            function initQueryCargoCondition(){
               ajax1("/psi/adjustOrder/initQueryCargoCondition/").then(function(data){

                    scope.categoryList=data.obj.categoryArr;
                    scope.susupplierList=data.obj.susupplierArr;


                });
                //scope.categoryList=[{"code":1,"name":"衣柜1"},{"code":2,"name":"衣柜2"},{"code":3,"name":"衣柜3"}];
                //scope.susupplierList=[{"code":1,"name":"厂家1"},{"code":2,"name":"厂家2"},{"code":3,"name":"厂家3"}];
             }
          

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

            scope.goodsRecord = function() {
                var oldGoodsList = ctrl.$viewValue;
              
                var haveAccountExtra={
                    "adjustType":1,
                    "surPlusPacCount":1,
                    "adjustReason":''
                }
                $.each(selectGoodsList, function(i, n) {
                     Object.assign(n,haveAccountExtra);
                });
              if(oldGoodsList!=undefined){
                oldGoodsList=oldGoodsList.concat(selectGoodsList);
                 ctrl.$setViewValue(oldGoodsList);
              }else{
                ctrl.$setViewValue(selectGoodsList);
              }
                
                
                
                
                $('#' + scope.modalId).modal('hide');
            };
            var warehouseId2;
           scope.$watch("warehouseId",function(){
                          
                 table.DataTable().ajax.reload();
                  warehouseId2=scope.warehouseId;
           },true);

            //function intitTable(){

               
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
                        whseId:scope.warehouseId                        
                    };
                    Metronic.blockUI({
                        message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在加载...</div>',
                        textOnly: true
                    });

                    // 查询商品
                    $.extend(params, scope.haveAccount);
                    $.ajax({
                        url: Metronic.host + queryUrl + a.userId + '/' + a.sessionId,
                        //url:"http://localhost:8080/front-end/cms-front/data/queryWhseCargoInfo.json",
                        type: 'POST',
                        cache: false,
                        dataType: 'json',
                        data: JSON.stringify(params),
                        success: function(datas) {

                            if(datas.obj.list==null){
                                datas.obj.list=[];
                            }
                            if (datas.code == 1) {
                                goodsSearched = datas.obj.list;
                                var arr = [];
                                $.each(datas.obj.list, function(i, n) {
                                    if(n.purchasePrice){
                                        var purchasePrice=n.purchasePrice.toFixed(2);
                                    }else{
                                        var purchasePrice='';
                                    }
                                    
                                    var temp = ['',n.pid,n.cargoNo, "<img height='50' src='"+n.image+"'/>", n.name, n.categoryName, n.factoryModel, n.packageSum,n.supplierName,purchasePrice];
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
                                     /*if (!rowData) {
                                        return false;
                                    }*/
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
            //}
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
                       
                    }
                });
                $.uniform.update(set);
            });
            table.delegate('input.checkboxes', 'change', function(e) {
                var index = $(e.target).closest('tr').index();
                if (e.target.checked) {
                    var oldGoodsList = ctrl.$viewValue;
                    if(oldGoodsList){
                        var flag=true;
                        $.each(oldGoodsList,function(i,n){
                            
                            if(parseInt(n.pid) == parseInt(e.target.value)){
                                alert('此货物已经选择');
                                e.target.checked=false;
                                $.uniform.update();
                                flag=false
                                return false;
                            }
                        });
                        if(flag){
                            checkIsExitAdjustOrderByWhseId(e.target.value,e);
                            //selectGoodsList.push(goodsSearched[index]);
                        }
                    }else{
                        checkIsExitAdjustOrderByWhseId(e.target.value);
                         //selectGoodsList.push(goodsSearched[index]);
                    }
                    
                    
                    
                } else {
                    $.each(selectGoodsList, function(i, n) {
                        if (n && parseInt(n.pid) === parseInt(e.target.value)) {
                           selectGoodsList.splice(i, 1);
                        }
                    });
                }
                
            });

            $('#productSearch').click(function(e) {
                oTable.fnDraw();
            })
            scope.emptyHaveData=function(){
                scope.haveAccount={}
            }

            function checkIsExitAdjustOrderByWhseId(pid,e){
                var param={
                    "whseId":warehouseId2,
                    "pid":pid
                }
                ajax1("/psi/adjustOrder/queryUidInfoByWhseIdAndUid/",param).then(function (datas) {
                     if(datas.obj.code==0){
                        var tempCargoList=datas.obj;
                        selectGoodsList.push(tempCargoList);
                     }else if(datas.obj.code==1){

                        alert('此货物追踪码主码在该仓库不存在！');
                        e.target.checked=false;
                        $.uniform.update();
                        return false;
                     }else {
                        alert("此货物追踪码主码关联状态未完结的订单时，在订单结束之前不允许调整!");
                        e.target.checked=false;
                        $.uniform.update();
                        return false;
                     }       
                   
                });
            
            }

        };

        return {
            restrict: 'E',
            require: '?ngModel',
            scope: {
                ngModel: '=?',
                modalId: '@',
                associatedId: '=?',
                queryUrl: '=?',
                warehouseId:'=?'
            },
            templateUrl: 'tpl/psi/adjuststock/productSelectIsRecordModal.html',
            link: linker
        };
    }
]);