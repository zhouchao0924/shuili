<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 20:43
 */
abstract class CsvTemplateConfig{
    protected $itemList = array();//输出按照key做输出
    protected $itemIndex = array();
    protected $data = array();
    protected $newLine = false;

    private function parseKey($key){
        $keys = array();
        $tmp = explode(",",$key);
        if(isset($tmp[0])){
            $keys[0] = $tmp[0];
        }
        if(isset($tmp[1])){
            $keys[1] = $tmp[1];
        }
        if(isset($tmp[2])){
            $keys[2] = $tmp[2];
        }
        return $keys;
    }

    private function _setData($keys, $value, $pos){
        $cnt = count($keys);
        if($cnt == 1){
            $this->data[$pos][$keys[0]] = $value;
        }elseif ($cnt == 2){
            $this->data[$pos][$keys[0]][$keys[1]] = $value;
        }else{
            $this->data[$pos][$keys[0]][$keys[1]][$keys[2]] = $value;
        }
    }

    public function __set($key,$value){
        $keys = $this->parseKey($this->itemIndex[$key]);
        $count = count($this->data) - 1;
        if($this->newLine){
            $count += 1;
            $this->newLine = false;
        }
        $this->_setData($keys,$value,$count);
    }

    private function makeItemIndex(){
        foreach ($this->itemList as $key=>$value){
            if(is_array($value)){
                foreach ($value as $k=>$v){
                    if(is_array($v)){
                        foreach ($v as $kk=>$vv){
                            if(is_array($vv)){
                                throw new CsvTemplateConfigTooDeepException();
                            }
                            $this->itemIndex[count($this->itemIndex)] = $key.",".$k.",".$kk;
                        }
                    }else{
                        $this->itemIndex[count($this->itemIndex)] = $key.",".$k;
                    }
                }
            }else{
                $this->itemIndex[count($this->itemIndex)] = $key;
            }
        }
    }

    public function setConfigLine($lineArray){
        if(empty($this->itemIndex)){
            $this->makeItemIndex();
        }
        if(count($lineArray) != count($this->itemIndex)){
            throw new CsvLineDataNotMatchException();
        }

        $this->newLine = true;
        foreach ($lineArray as $k => $v){
            $this->$k = $v;
        }
    }

    public function clearData(){
        $this->data = array();
    }

    public function printData(){
        print_r($this->data);
    }

    public function getData(){
        return $this->data;
    }

    /**
     * @return WpCsvBaseDao
     */
    public abstract function getDao();

    public function data2Db($extra = array()){
        return $this->getDao()->transactionInsert($this->data, $extra);
    }
}