<?php
/**
 * 水库山塘小水电
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-04
 */
class ReservoirExcelTemplateConfig extends ExcelTemplateConfig{
    public static $id = 1;
    protected $itemList = array(
        'name'=>'水库名称',
        'project_scale'=>'工程规模',
        'catchment_area'=>'集雨面积',
        'storage_capacity'=>array(//泄洪设施json
            'xiaoheshuiwei'=>'校核水位（m）',
            'zongkurong'=>'总库容(万m3)',
            'shejishuiwei'=>'设计水位(m)',
            'xiangyinkurong'=>'相应库容(万m3)',
            'zhengchangshuiwei'=>'正常水位（m)',
            'zhengchangkurong'=>'正常库容(万m3)',
        ),
        'dam'=>array(//泄洪设施json
            'baxing'=>'坝形',
            'dibagaocheng'=>'堤坝高程(m)',
            'bagao'=>'坝高（m）',
            'bachang'=>'坝长（m）',
        ),
        'flood_discharge_fcailities'=>array(//泄洪设施json
            'xingshi'=>'型式',
            'dibagaocheng'=>'堤坝高程(m)',
            'kuandu'=>'宽度（m）',
        ),
        'conveyance_fcailities'=>array(//输水设施json
            'xingshi'=>'型式',
            'chicun'=>'尺寸（m）',
            'jinkougaocheng'=>'进口高程（m）',
            'chukougaocheng'=>'出口高程（m）',
        ),
        'discharge'=>array(
            'shejibiaozhun'=>'设计标准最大下泄量（m3/s）',
            'hexiaobiaozhun'=>'核校标准最大下泄量（m3/s）',
        ),
        'control_level'=>array(
            'meixunqi'=>'梅汛期',
            'taixunqi'=>'台汛期',
        ),
        'extend'=>'备注',
        'manager'=>array(
            'username'=>'姓名',
            'phone'=>'手机号',
        ),
        'inspector'=>array(
            'username'=>'姓名',
            'phone'=>'手机号',
        ),
    );

    protected $printExtraItem = array(
        'full_image'=>array(),
        'image'=>array(),
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpReservoirDao::getInstance("WpReservoir");
    }

    public function getExampleExcelFileName()
    {
        return "水库模板.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "name";
    }

    public function getServiceTypeId(){
        return self::$id;
    }
    protected function getTemplateName(){
        return "水库";
    }
}