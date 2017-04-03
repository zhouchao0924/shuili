<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/3
 * Time: 10:20
 */
class WpCsvBaseDao extends Dao {
    /**
     * @param $rowArray csv template config
     * @param $extraArray 每行都一样的扩展字段
     * @return bool
     */
    final public function transactionInsert($rowArray, $extraArray){
        $tr = $this->getDb()->beginTransaction();
        try{
            foreach ($rowArray as $key=>$value){
                $row = array();
                foreach ($value as $k=>$v){
                    if(is_array($v)){
                        $row[$k] = json_encode($v);
                    }else{
                        $row[$k] = $v;
                    }
                }
                if(!empty($extraArray)){
                    foreach ($extraArray as $k=>$v){
                        if(is_array($v)) {
                            $row[$k] = json_encode($v);
                        }else{
                            $row[$k] = $v;
                        }
                    }
                }
                $this->getDb()->createCommand()->insert($this->getTableName(),$row);
            }
            $tr->commit();
            return true;
        }catch (Exception $e){
            Yii::log("csv insert 2 db failed."+$e->getTraceAsString(),CLogger::LEVEL_ERROR,"m.csv.insert");
            $tr->rollback();
            return false;
        }
    }
}