<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 23:34
 */
class ExcelParseFailedException extends Exception{
    public function ExcelParseFailedException($msg){
        parent::__construct($msg);
    }
}