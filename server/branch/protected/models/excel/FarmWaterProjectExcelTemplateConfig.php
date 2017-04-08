<?php
/**
 * 河道
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 22:40
 */
class FarmWaterProjectExcelTemplateConfig extends ExcelTemplateConfig{
    public static $id = 18;
    protected $itemList = array(
        'cat' =>'项目类型',
        'name' =>'项目名称',
        'location' =>'建设地点',
        'build_area' =>'建设面积',
        'build_items' =>'建设内容',
        'build_time' =>'建设年份',
        'desc' =>'备注',
    );

    protected $printExtraItem = array(
        'project_image'=>array(),
        'image'=>array(),
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpFarmWaterProjectDao::getInstance("WpFarmWaterProject");
    }

    public function getExampleExcelFileName()
    {
        return "农田水利.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "name";
    }

    public function getServiceTypeId(){
        return self::$id;
    }

    protected function getTemplateName(){
        return "农田水利";
    }

    protected function getProjectImageColName(){
        return "project_image";
    }
}