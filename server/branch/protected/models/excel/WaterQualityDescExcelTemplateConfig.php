<?php
/**
 * 水质监控成果
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-06
 */
class WaterQualityDescExcelTemplateConfig extends ExcelTemplateConfig{
    public static $id = 10;

    protected $itemList = array(
        'time'=>'时间',
        'detecion_position'=>'监测点',
        'latitude_longitude'=>'位置',
        'temperature'=>'水温',
        'ph'=>'ph值',
        'turbidity'=>'浊度',
        'cdo'=>'化学需氧量（cdo）',
        'nh3n'=>'氨氮（NH3-N）',
        'p'=>'总磷（以P记）',
        'n'=>'总氮（以N记）',
        'other'=>'其他',
        'conclusion'=>'结论',
        'remarks'=>'备注',
    );

    protected $printExtraItem = array(
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpWaterQualityDescDao::getInstance("WpWaterQualityDesc");
    }

    public function getExampleExcelFileName()
    {
        return "水质监测成果模板.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "detecion_position";
    }

    /**
     * 获取类型id
     * @return mixed
     */
    public function getServiceTypeId() {
        return self::$id;
    }

    protected function getTemplateName() {
        return "水质监测成果";
    }
}