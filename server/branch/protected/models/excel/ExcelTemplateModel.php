<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 20:31
 */
class ExcelTemplateModel{
    protected $headSkipLine = 1;

    //这个地方时k->类 k为excel类型 用来做统一的图片上传等
    public static $excelTypeMAP = array(
        1=>"ReservoirExcelTemplateConfig",
        2=>"HillPondExcelTemplateConfig",
        3=>"WaterConservancyExcelTemplateConfig",
        4=>"RiverwayExcelTemplateConfig",
        5=>"WaterGateExcelTemplateConfig",
        6=>"PumpingStationExcelTemplateConfig",
        7=>"RiverManagerBaseExcelTemplateConfig",
        8=>"RiverDrainExcelTemplateConfig",
        9=>"WaterQualityBaseExcelTemplateConfig",
        10=>"WaterQualityDescExcelTemplateConfig",
        11=>"RiverDrainExtendExcelTemplateConfig",
        12=>"FloodBaseInfoExcelTemplateConfig",
        13=>"FloodLeaderInfoExcelTemplateConfig",
        14=>"FloodOwnerInfoExcelTemplateConfig",
        15=>"FloodNetworkOwnerExcelTemplateConfig",
        16=>"TransferPeopExcelTemplateConfig",
        17=>"DrinkingWaterExcelTemplateConfig",
        18=>"FarmWaterProjectExcelTemplateConfig",
    );
    /**
     * @var ExcelTemplateConfig
     */
    private $config;

    public function __construct($config){
        $this->config = $config;
    }

    private function parse($lineArray) {
        try{
            $this->config->clearData();
            foreach ($lineArray as $key=>$value){
                $this->config->setConfigLine($value);
            }
        }catch (Exception $e){
            Yii::log("parse Excel data failed.".$e->getTraceAsString(),CLogger::LEVEL_ERROR,"m.excel.parse");
            throw new ExcelParseFailedException($e->getMessage());
        }
    }

    public function data2Db($lineArray,$extra = array()){
        $streetIdColName = $this->config->getStreetIdColName();
        if(isset($extra[$streetIdColName]) || $extra[$streetIdColName] <= 0){
            print_r($extra);
            throw new Exception("没有选择地区");
        }
        $this->parse($lineArray);
        $result = $this->config->data2Db($extra);
        if(!$result){
            throw new ExcelDataImport2DBFailedException();
        }
        return ;
    }

    public function queryRecords($page,$streetId,$searchText="",$perPageCount=20){
        return $this->config->getRecords($page,$streetId,$searchText,$perPageCount);
    }
}