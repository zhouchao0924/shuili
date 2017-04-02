<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 23:34
 */
class CsvParseFailedException extends Exception{
    public function CsvParseFailedException($msg){
        parent::__construct($msg);
    }
}