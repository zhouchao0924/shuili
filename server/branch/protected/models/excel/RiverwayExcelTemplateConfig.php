<?php
/**
 * 河道
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 22:40
 */
class RiverwayExcelTemplateConfig extends ExcelTemplateConfig{
    protected $itemList = array(
        'name'=>'河流名称',
        'level'=>'河流等级',
        'start'=>'起点',
        'end'=>'讫点',
        'length'=>'长度',
        'current_situation'=>array(
            'width'=>'河宽',
            'bottomHeight'=>'河底高程',
            'damHeight'=>'堤坝高程',
            'waterArea'=>'水域面积',
        ),
        'plan_situation'=>array(
            'width'=>'河宽',
            'bottomHeight'=>'河底高程',
            'damHeight'=>'堤坝高程',
            'waterArea'=>'水域面积',
        ),
        'manage_rank'=>'管理范围',
        'desc'=>'描述'
    );

    protected $printExtraItem = array(
        'full_image'=>array(),
        'image'=>array(),
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpRiverwayDao::getInstance("WpRiverway");
    }

    public function getExampleExcelFileName()
    {
        return "河道模板.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "name";
    }
}