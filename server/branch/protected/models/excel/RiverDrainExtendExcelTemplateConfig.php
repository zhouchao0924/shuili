<?php
/**
 * 入河排污口统计
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-06
 */
class RiverDrainExtendExcelTemplateConfig extends ExcelTemplateConfig{

    public static $id = 11;

    protected $itemList = array(
        'name'=>'排污口名称',
        'position'=>'排污口位置',
        'river_name'=>'排入水体名称',
        'pollution_source'=>'污染源',
        'village'=>'所在村',
        'discharge_mode'=>'排放方式',
        'treatment_method'=>'排水口处理方式',
        'remarks'=>'备注',
    );

    protected $printExtraItem = array(
        'full_image'=>array(),
        'image'=>array(),
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpRiverDrainExtendDao::getInstance("WpRiverDrainExtend");
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