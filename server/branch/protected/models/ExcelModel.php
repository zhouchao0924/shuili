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
    CONST EXCEL2003 = "";
    CONST EXCEL2007 = "Excel2007";

    public static function parseExcel($skipRows, $path){
        $excelLoad = PHPExcel_IOFactory::load($path);
        //$excelLoad = $reader->load($path);
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

    public static function detectUploadFileMIME($fileName,$filePath) {
        // 1.through the file extension judgement 03 or 07
        $flag = "";
        $file_array = explode ( ".", $fileName );
        $file_extension = strtolower ( array_pop ( $file_array ) );

        // 2.through the binary content to detect the file
        switch ($file_extension) {
            case "xls" :
                // 2003 excel
                $fh = fopen ( $filePath, "rb" );
                $bin = fread ( $fh, 8 );
                fclose ( $fh );
                $strinfo = @unpack ( "C8chars", $bin );
                $typecode = "";
                foreach ( $strinfo as $num ) {
                    $typecode .= dechex ( $num );
                }
                if ($typecode == "d0cf11e0a1b11ae1") {
                    $flag = EXCEL2007;
                }
                break;
            case "xlsx" :
                // 2007 excel
                $fh = fopen ( $filePath, "rb" );
                $bin = fread ( $fh, 4 );
                fclose ( $fh );
                $strinfo = @unpack ( "C4chars", $bin );
                $typecode = "";
                foreach ( $strinfo as $num ) {
                    $typecode .= dechex ( $num );
                }
                echo $typecode;
                if ($typecode == "504b34") {
                    $flag = EXCEL2007;
                }
                break;
        }

        // 3.return the flag
        return $flag;
    }
}