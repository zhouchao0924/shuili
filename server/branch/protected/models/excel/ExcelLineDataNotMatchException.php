<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 22:51
 */
class ExcelLineDataNotMatchException extends Exception{
    public function ExcelLineDataNotMatchException(){
        parent::__construct("Excel item not match config item");
    }
}