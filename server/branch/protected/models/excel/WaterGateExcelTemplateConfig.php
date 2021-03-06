<?php
/**
 * 水闸
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-06
 */
class WaterGateExcelTemplateConfig extends ExcelTemplateConfig{
    public static $id = 5;

    protected $itemList = array(
        'name'=>'水闸名称',
	  'address'=>'地址',
	  'rivers'=>'所在河流',
        'major_function'=>'主要功能',
	  'gate_form'=>'闸门形式',
	  'sluices_num'=>'水闸孔数',
	  'brake_hole_size'=>'闸孔尺寸',
	  'design_flow'=>'设计过闸流量',
	  'hoist_num'=>'启闭机台数',
	  'hoist_location'=>'启闭机型式',
	  'completion_date'=>'建成时间',
	  'managerment'=>'管理单位',
        'manager'=>'管理者负责人',
        'manager_phone'=>'管理者负责人电话',
	    'extend'=>'备注',
    );

    protected $printExtraItem = array(
        'image'=>array(),
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpWaterGateDao::getInstance("WpWaterGate");
    }

    public function getExampleExcelFileName()
    {
        return "水闸模板.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "name";
    }

    public function getServiceTypeId(){
        return self::$id;
    }
    protected function getTemplateName(){
        return "水闸";
    }
}