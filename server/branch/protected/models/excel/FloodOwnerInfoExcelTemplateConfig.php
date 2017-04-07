<?php
/**
 * 河道
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 22:40
 */
class FloodOwnerInfoExcelTemplateConfig extends ExcelTemplateConfig{
    protected $itemList = array(
        'village'=> '行政村名称',
        'job'=> '岗位',
        'owner'=> array(
            'name'=>'姓名',
            'post'=>'职务',
            'cell'=>'手机号',
        ),
        'desc'=> '备注',
    );

    protected $printExtraItem = array(
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpFloodOwnerInfoDao::getInstance("WpFloodOwnerInfo");
    }

    public function getExampleExcelFileName()
    {
        return "乡镇街道防汛台责任人.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "village";
    }
}