<?php
/**
 * 河道
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 22:40
 */
class TransferPeopExcelTemplateConfig extends ExcelTemplateConfig{
    protected $itemList = array(
        'village'=>'乡村名称',
        'danger_area'=> '危险区名称',
        'cat'=> '类型',
        'location'=>array(//'地点json'
            'pos'=>'位置',
            'longitude'=>'经度',
            'latitude'=>'纬度'
        ),
        'people'=> array(//'危险区影响人员 json',
            'householder'=>'户主姓名',
            'peopleCount'=>'居住人数',
            'cell'=>'户主手机号'
        ),
        'transfer_owner'=> array(//'转移责任人json',
            'name'=>'姓名',
            'post'=>'职务',
            'cell'=>'手机号'
        ),
        'transfer_location'=> array(//'转移地点 json',
            'posName'=>'避灾场所名称',
            'secureVerify'=>'有无安全鉴定',
            'manager'=>'避灾场所管理员',
            'cell'=>'手机号'
        ),
        'desc'=> '备注',
    );

    protected $printExtraItem = array(
        'create_time'=>'',
        'id'=>''
    );

    public function getDao(){
        return WpTransferPeopleInfoDao::getInstance("WpTransferPeopleInfo");
    }

    public function getExampleExcelFileName()
    {
        return "转移人员清单.xlsx";
    }

    public function getSearchTextTableColName()
    {
        return "village";
    }
}