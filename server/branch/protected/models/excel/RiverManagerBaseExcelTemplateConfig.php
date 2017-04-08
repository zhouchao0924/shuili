<?php
/**
 * 河长制基础信息
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-06
 */
class RiverManagerBaseExcelTemplateConfig extends ExcelTemplateConfig{

    public static $id = 7;

    protected $itemList = array(
        'name'=>'河道名称',
        'river_id'=>'编号',
        'rivers_size'=>'长度',
        'start'=>'河道起点',
        'end'=>'河道终点',
        'river_manager'=>'河长',
        'position'=>'职位',
        'contact_info'=>'联系方式',
        'police'=>'河道警长',
    );

    protected $printExtraItem = array(
        'full_image'=>array(),
        'image'=>array(),
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpRiverManagerBaseDao::getInstance("WpRiverManagerBase");
    }

    public function getExampleExcelFileName()
    {
        return "河长制基础信息模板.xlsx";
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
        return "河长制基础信息";
    }
}