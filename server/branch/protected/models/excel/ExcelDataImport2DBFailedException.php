<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/3
 * Time: 10:29
 */
class ExcelDataImport2DBFailedException extends Exception{
    public function ExcelDataImport2DBFailedException(){
        parent::__construct("Excel import 2 db failed.");
    }
}