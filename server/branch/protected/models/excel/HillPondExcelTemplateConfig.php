<?php
/**
 * 山塘
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-06
 */
class HillPondExcelTemplateConfig extends ExcelTemplateConfig{

    protected $itemList = array(
        'hill_pond_name'=>'山塘名称',
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
        'extend'=>'备注',
        'image'=>'照片',
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
        return WpHillPondDao::getInstance("WpHillPondDao");
    }

    public function getExampleExcelFileName()
    {
        return "山塘模板.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "hill_pond_name";
    }
}