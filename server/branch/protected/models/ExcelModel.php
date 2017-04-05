<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/4
 * Time: 11:46
 */
//Yii::import("application.extensions.PHPExcel-1.8.1.Classes.PHPExcel.php",true);
require_once (dirname(__FILE__).'/../extensions/PHPExcel-1.8.1/Classes/PHPExcel.php');
class ExcelModel{
    public static function parseExcel($skipRows, $path){
        $reader = PHPExcel_IOFactory::createReader('Excel2007');
        $excelLoad = $reader->load($path);
        $sheet = $excelLoad->getSheet();
        $highestRow = $sheet->getHighestRow();
        $highestCol = $sheet->getHighestColumn();
        $highestColumn= PHPExcel_Cell::columnIndexFromString($highestCol); //字母列转换为数字列 如:AA变为27

        if($highestRow == 0 || $highestColumn ==0 || $highestRow <= $skipRows){
            return array();
        }
        $excelDataArray = array();
        for ($row = ($skipRows +1); $row <= $highestRow; $row++){
            $tmp = array();
            for ($column = 0; $column < $highestColumn; $column++) {//列数是以第0列开始
                $item = $sheet->getCellByColumnAndRow($column, $row)->getValue();
                if($item instanceof PHPExcel_RichText){
                    $item = $item->__toString();
                }
                if(empty($item)){
                    $item = "";
                }
                $tmp[] = $item;
            }
            $excelDataArray[] = $tmp;
        }

        $data = array();
        if(!empty($excelDataArray)){
            foreach($excelDataArray as $value){
                foreach ($value as $k=>$v){
                    if(!empty($v)){
                        $data[] = $value;
                        break;
                    }
                }
            }
        }
        return $data;
    }
}