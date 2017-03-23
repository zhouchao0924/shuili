<?php
abstract class BaseDao{
	private static $INSTANCES = array();
	private $_lastPingTime = 0;
	private $_pingTimeSpan = 20;
	/**
	 * 获取表名
	 * @return string
	 */
	public function getTableName(){
		return "";
	}
	/**
	 * 获取实例
	 * @param string $tableName
	 */
	public static function getInstance($className){
		$className = preg_replace_callback('/(?:^|_)([a-z])/',create_function('$matches','return strtoupper(ltrim($matches[0],"_"));'),(string)$className)."Dao";
		if(!isset(self::$INSTANCES[$className])) {
			self::$INSTANCES[$className] = new $className();
		}
		return self::$INSTANCES[$className];
	}
	
	/**
	 *
	 * 检查数据库连接是否中断，如果中断则重新连接
	 * @access public
	 */
	public function setConnectionActive($db){
		if(empty($this->_lastPingTime)){
			$this->_lastPingTime = microtime(1);
			return ;
		}
		if ($this->_lastPingTime + $this->_pingTimeSpan < microtime(1)){
			$status = true;
			try{
				$status = $db->getServerInfo();
				if (empty($status) || strstr($status, 'MySQL server has gone away') !== false){
					$status = false;
				}
			}catch (Exception $e){
				$status = false;
				Yii::log($e->getMessage(),CLogger::LEVEL_WARNING,'exception.CDbException');
			}
			if (!$status){
				$db->setActive(false);
				$db->setActive(true);
			}
			$this->_lastPingTime = microtime(1);
		}
	}
}