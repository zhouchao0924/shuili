<?php
/**
 * 山塘
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-06
 */
class PumpingStationExcelTemplateConfig extends ExcelTemplateConfig{
    public static $id = 6;

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
        'image'=>'图片',
	    'extend'=>'备注',
    );

    protected $printExtraItem = array(
        'full_image'=>array(),
        'image'=>array(),
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return PumpingStationDao::getInstance("PumpingStation");
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