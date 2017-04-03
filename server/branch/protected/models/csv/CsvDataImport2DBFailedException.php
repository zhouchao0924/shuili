<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/3
 * Time: 10:29
 */
class CsvDataImport2DBFailedException extends Exception{
    public function CsvDataImport2DBFailedException(){
        parent::__construct("csv import 2 db failed.");
    }
}