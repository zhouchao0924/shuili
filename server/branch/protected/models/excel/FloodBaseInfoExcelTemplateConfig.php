<?php
/**
 * 河道
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 22:40
 */
class FloodBaseInfoExcelTemplateConfig extends ExcelTemplateConfig{
    protected $itemList = array(
        'manager'=>'防汛太负责任',
        'village'=>'村(社区)',
        'dangerous_area_people_transfer_list'=>'危险区域人员转义名单',
    );

    protected $printExtraItem = array(
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpFloodBaseInfoDao::getInstance("WpFloodBaseInfo");
    }

    public function getExampleExcelFileName()
    {
        return "村社区防汛台基本情况.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "manager";
    }
}