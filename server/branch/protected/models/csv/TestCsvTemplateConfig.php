<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 22:40
 */
class TestCsvTemplateConfig extends CsvTemplateConfig{
    protected $itemList = array(
        "ab"=>"ab",
        "name"=>array(
            "name-1"=>"name-1",
            "name-2"=>"name-2"
        ),
        "desc"=>array(
            "desc-1"=>"desc-1",
            "desc-2"=>"desc-2",
            "desc-3"=>"desc-3",
        ),
        "p"=>"p",
        "xx"=>array(
            "x1"=>array(
                "x11"=>"x-11",
                "x12"=>"x-12",
            ),
        )
    );

    public function getDao(){
        return WpCsvTestDao::getInstance("WpCsvTest");
    }

    public function getExampleCsvFileName()
    {
        return "test.csv";
    }
}