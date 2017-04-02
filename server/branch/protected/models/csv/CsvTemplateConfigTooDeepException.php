<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 21:06
 */
class CsvTemplateConfigTooDeepException extends Exception{
    public function CsvTemplateConfigTooDeepException(){
        parent::__construct("too deep");
    }
}