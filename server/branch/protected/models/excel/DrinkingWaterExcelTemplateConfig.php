<?php
/**
 * 河道
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 22:40
 */
class DrinkingWaterExcelTemplateConfig extends ExcelTemplateConfig{
    protected $itemList = array(
        'station_name'=>'供水站名称',
        'location' =>'所在村庄',
        'cover_range' =>'收益片区',
        'cover_people_count' =>'收益人数',
        'capacity' =>'供水规模',
        'water_source_info' =>array(//'水源情况 json'
            "name"=>"名称",
            "cat"=>"类型",
            "space"=>"集水面积",
            "capacity"=>"正常库容",
            "other"=>array(
                "irrigation"=>"灌溉",
                "electricity"=>"发电"
            ),
        ),
        'process_technology' =>array(//'水处理工艺json'
            "technology"=>"工艺",
            "cat"=>"型号"
        ),
        'disinfection_method' => array(//'消毒方式 json',
            "technology"=>"工艺",
            "cat"=>"型号"
        ),
        'pipe_diameter' =>'配水管管网直径',
        'manager_user' =>'管理人员',
        'manager_user_cell' =>'管理人员电话',
        'build_time' =>'建成时间',
        'desc'  =>'描述',
    );

    protected $printExtraItem = array(
        'full_image'=>array(),
        'image'=>array(),
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpDrinkingWaterDao::getInstance("WpDrinkingWater");
    }

    public function getExampleExcelFileName()
    {
        return "农民饮用水.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "station_name";
    }
}