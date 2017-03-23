<?php
class Dao extends BaseDao{
	/**
	 * @var CDbConnection
	 */
	private $_db = NULL;
	/**
	 * 获取db
	 */
	public function getDb(){
		if(!$this->_db){
			$this->_db = Yii::app()->db;
		}
		$this->setConnectionActive($this->_db);
		return $this->_db;
	}
	
	/**
     * 更新
     */
    final public function update($columns, $conditions='', $params=array()){
    	return $this->getDb()->createCommand()->update($this->getTableName(), $columns, $conditions , $params);
    }
    /**
     * 查询
     * @param string $field
     * @param string $conditions
     * @param array $params
     * @param bool $queryAll
     * @param string $order
     * @param string $group
     * @param int $start
     * @param int $limit
     * @return Ambigous <multitype:, mixed, unknown>
     */
    final public function select($field,$conditions='',$params=array(), $queryAll = false,$order='',$group='',$start=-1, $limit=-1,$distinct=false){
    	$db = $this->getDb();
    	$cmd = $db->createCommand()->select($field)->from($this->getTableName());
    	if(!empty($conditions)){
    		$cmd->where($conditions,$params);
    	}
    	if(!empty($order)){
    		$cmd->order($order);
    	}
    	if(!empty($group)){
    		$cmd->group($group);
    	}
    	if($start != -1 && $limit != -1){
    		$cmd->limit($limit,$start);
    	}
    	$cmd->setDistinct($distinct);
    	if($queryAll){
    		return $cmd->queryAll();
    	}else {
    		return $cmd->queryRow();
    	}
    }
    /**
     * 获取最后一条插入的id
     * return int | Boolean
     */
    final public function getLastInsertId(){
    	return $this->getDb()->lastInsertId;
    }
    /**
     * insert
     * @param array $fileld
     */
    final public function baseInsert($fileld){
    	$this->getDb()->createCommand()->insert($this->getTableName(), $fileld);
    	return $this->getDb()->getLastInsertID();
    }
}