<?php
/**
 * 山塘
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-06
 */
class WaterConservancyExcelTemplateConfig extends ExcelTemplateConfig{
    public static $id = 3;
    protected $itemList = array(
        'name'=>'电站名称',
	  'township'=>'所在乡镇',
	  'basin'=>'流域',
        'catchment_area'=>'集雨面积',
	  'diversion'=>'发电引水',
	  'head'=>'设计水头',
	  'design_capacity'=>'设计流量',
	  'installed_capacity'=>'装机容量',
	  'plant_location'=>array(
	  'jindu'=>'经度',
	  'weidu'=>'纬度',
  ),
	  'commissionning_date'=>'投产年月',
	  'reform'=>'改造情况',
	  'ownership'=>'所有制',
        'extend'=>'备注',
        'manager'=>array(
            'username'=>'姓名',
            'phone'=>'手机号',
        ),
    );

    protected $printExtraItem = array(
        'full_image'=>"",
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpWaterConservancyDao::getInstance("WpWaterConservancy");
    }

    public function getExampleExcelFileName()
    {
        return "小水电模板.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "name";
    }
    public function getServiceTypeId(){
        return self::$id;
    }
    protected function getTemplateName(){
        return "小水电";
    }
}