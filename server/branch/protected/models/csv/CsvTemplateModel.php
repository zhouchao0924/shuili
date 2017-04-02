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

    public function parse($lineArray) {
        try{
            foreach ($lineArray as $key=>$value){
                $this->config->setConfigLine($value);
            }
        }catch (Exception $e){
            Yii::log("parse csv data failed."+$e->getTraceAsString(),CLogger::LEVEL_ERROR,"m.csv.parse");
            throw new CsvParseFailedException($e->getMessage());
        }

        return $this->config->getData();
    }
}