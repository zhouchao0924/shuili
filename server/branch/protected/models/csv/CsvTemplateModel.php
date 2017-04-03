<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 20:31
 */
class CsvTemplateModel{
    protected $headSkipLine = 1;
    /**
     * @var CsvTemplateConfig
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
            Yii::log("parse csv data failed.".$e->getTraceAsString(),CLogger::LEVEL_ERROR,"m.csv.parse");
            throw new CsvParseFailedException($e->getMessage());
        }
    }

    public function data2Db($lineArray,$extra = array()){
        $this->parse($lineArray);
        $result = $this->config->data2Db($extra);
        if(!$result){
            throw new CsvDataImport2DBFailedException();
        }

        return ;
    }
}