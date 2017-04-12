<?php
/**
 * 河长制基础信息
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-06
 */
class WaterQualityBaseExcelTemplateConfig extends ExcelTemplateConfig{
    public static $id = 9;

    protected $itemList = array(
        'name'=>'河道名称',
        'detecion_position'=>'监测点位置',
        'latitude_longitude'=>'经纬度',
    );

    protected $printExtraItem = array(
        'image'=>array(),
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpWaterQualityBaseDao::getInstance("WpWaterQualityBase");
    }

    public function getExampleExcelFileName()
    {
        return "水质监测基本情况模板.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "name";
    }

    /**
     * 获取类型id
     * @return mixed
     */
    public function getServiceTypeId() {
        return self::$id;
    }

    protected function getTemplateName() {
        return "水质监测基本情况";
    }
}