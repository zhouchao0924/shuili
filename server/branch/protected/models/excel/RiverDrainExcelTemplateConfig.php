<?php
/**
 * 河长制基础信息
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-06
 */
class RiverDrainExcelTemplateConfig extends ExcelTemplateConfig{
    public static $id = 8;

    protected $itemList = array(
        'river_id'=>'编号',
        'rivers_level'=>'河道级别',
        'name'=>'河道名称',
        'rainwater_outlet'=>'雨水口',
        'sewage_outlet'=>'污水口',
        'rainwater_sewage_outlet'=>'雨污混排口',
        'outlet_num'=>'排水口总数',
    );

    protected $printExtraItem = array(
        'image'=>array(),//污水口平面图
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpRiverDrainDao::getInstance("WpRiverDrain");
    }

    public function getExampleExcelFileName()
    {
        return "河道排水统计模板.xlsx";
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
        return "河道排水统计";
    }
}