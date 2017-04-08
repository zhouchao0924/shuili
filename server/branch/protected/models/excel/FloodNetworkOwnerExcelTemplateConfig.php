<?php
/**
 * 河道
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 22:40
 */
class FloodNetworkOwnerExcelTemplateConfig extends ExcelTemplateConfig{
    public static $id = 15;
    protected $itemList = array(
        'village'=> '行政村名称',
        'network_name'=> '网络名称',
        'network_type'=> '网络类型',
        'owner'=> array(
            'name'=>'姓名',
            'post'=>'职务',
            'cell'=>'手机号',
        ),
        'desc'=> '备注',
    );

    protected $printExtraItem = array(
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpFloodNetworkOwnerDao::getInstance("WpFloodNetworkOwner");
    }

    public function getExampleExcelFileName()
    {
        return "网络负责人.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "village";
    }

    public function getServiceTypeId(){
        return self::$id;
    }
    protected function getTemplateName(){
        return "网络负责人";
    }
}