<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 21:06
 */
class ExcelTemplateConfigTooDeepException extends Exception{
    public function ExcelTemplateConfigTooDeepException(){
        parent::__construct("too deep");
    }
}