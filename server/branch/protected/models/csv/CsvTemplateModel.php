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
     * @var CmsTemplateConfig
     */
    private $config;

    public function __construct($config){
        $this->config = $config;
    }

    public function parse($lineArray) {
        foreach ($lineArray as $key=>$value){
            $this->config->setConfigLine($value);
        }

        return $this->config->printData();
    }
}