<?php
class SiteFooter extends CWidget{
	
	public $params = array();
	
	public function __set($name, $value){
		$this->params[$name] = $value;
	}
	public function __get($name){
		if(isset($name)){
			return $this->params[$name];
		}
		return false;
	}
    public function run(){
        if(isset($this->params['show']) && $this->params['show']==true){
            $this->render($this->params['prefix'].'_'.$this->params['footerName'],$this->params);
        }
    }
}