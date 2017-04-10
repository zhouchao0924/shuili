<?php
/**
 * 泵站
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-06
 */
class PumpingStationExcelTemplateConfig extends ExcelTemplateConfig{
    public static $id = 6;

    protected $itemList = array(
        'name'=>'泵站名称',
        'address'=>'地址',
        'rivers'=>'内河',
        'outside_rivers'=>'外江',
        'catchment_area'=>'汇水面积',
        'installed_power'=>'装机功率',
        'pumping_station'=>'水泵型号',
        'pumping_station_num'=>'台数',
        'manufacturer'=>'生产厂家',
        'gate_form'=>'闸门形式',
        'sluices_num'=>'水闸孔数',
        'brake_hole_size'=>'闸孔尺寸',
	    'managerment'=>'管理单位',
        'manager'=>'管理者负责人',
        'manager_phone'=>'管理者负责人电话',
        'completion_date'=>'建造年份',
	    'extend'=>'备注',
    );

    protected $printExtraItem = array(
        'image'=>array(),
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpPumpingStationDao::getInstance("WpPumpingStation");
    }

    public function getExampleExcelFileName()
    {
        return "泵站模板.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "name";
    }

    public function getServiceTypeId(){
        return self::$id;
    }
    protected function getTemplateName(){
        return "泵站";
    }
}