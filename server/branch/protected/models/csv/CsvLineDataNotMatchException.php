<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 22:51
 */
class CsvLineDataNotMatchException extends Exception{
    public function CsvLineDataNotMatchException(){
        parent::__construct("csv item not match config item");
    }
}