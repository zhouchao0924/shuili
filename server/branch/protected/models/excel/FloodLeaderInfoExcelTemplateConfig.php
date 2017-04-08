<?php
/**
 * 河道
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 22:40
 */
class FloodLeaderInfoExcelTemplateConfig extends ExcelTemplateConfig{
    public static $id = 13;
    protected $itemList = array(
        'post'=> '岗位',
        'leader'=> '负责人',
        'job'=> '职位',
        'cell'=> '电话号码',
        'uptime'=> '更新时间',
        'desc'=> '备注',
    );

    protected $printExtraItem = array(
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpFloodLeaderInfoDao::getInstance("WpFloodLeaderInfo");
    }

    public function getExampleExcelFileName()
    {
        return "乡镇街道防汛台负责人.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "leader";
    }
    public function getServiceTypeId(){
        return self::$id;
    }
    protected function getTemplateName(){
        return "乡镇街道防汛台负责人";
    }
}