<?php
/**
 * 通用空间类
 * @author lzm
 *
 */
final class CommonComponent{
	CONST USER_CMS_ADMIN = 0;//CMS管理员
	CONST USER_M_USER = 1;//网站用户
	public static $clientIp;

    public static function getValidIP($ipStr){
        if(empty($ipStr)){
            return '';
        }
        if(strstr($ipStr,",")){
            $ipArr = explode(",",$ipStr);
            foreach($ipArr as $v){
                if(self::isPrivateIp($v)==false){
                    return $v;
                }
            }
        }elseif(self::isPrivateIp($ipStr)==false){
            return $ipStr;
        }else{
            return '';
        }
    }
	
	/**
	 * 获取client ip
	 * @return Ambigous <string, unknown>
	 */
	public static function getClientIp(){
		if(self::$clientIp){
			return self::$clientIp;
		}
		//代理服务器转发的IP,这一HTTP头一般格式如下:X-Forwarded-For: client1, proxy1, proxy2
		if(isset ($_SERVER["HTTP_X_FORWARDED_FOR"])
			&&!empty($_SERVER["HTTP_X_FORWARDED_FOR"])){
			$realip = self::getValidIP($_SERVER["HTTP_X_FORWARDED_FOR"]);
			if(!empty($realip)){
				self::$clientIp = $realip;
				return self::$clientIp;
			}
		}
		//HEADER头中声明的客户端IP
		if(isset ($_SERVER["HTTP_CLIENT_IP"])){
			$realip = self::getValidIP($_SERVER["HTTP_CLIENT_IP"]);
			if(!empty($realip)){
				self::$clientIp = $realip;
				return self::$clientIp;
			}
		}
		//这个是与服务器握手的ip
		$realip = self::getValidIP($_SERVER["REMOTE_ADDR"]);
		if(!empty($realip)){
			self::$clientIp = $realip;
			return self::$clientIp;
		}
		self::$clientIp = 0;
		return self::$clientIp;
	}
	
	/**
	 * 判断是否为内网ip
	 * @param string $ip
	 */
	public static function isPrivateIp($ip){
		if(empty($ip)){
			return true;
		}
		$private10 = array("10.0.0.0","255.0.0.0");
		$private127 = array("127.0.0.0","255.0.0.0");
		$private172_16 = array("172.16.0.0","255.255.0.0");
		$private172_31 = array("172.31.0.0","255.255.0.0");
		$private192 = array("192.168.0.0","255.255.0.0");

		$ip = ip2long($ip);
		if($ip == -1 || $ip == false){
			return true;
		}
		if(($ip & ip2long($private10[1])) == ip2long($private10[0]) 
			|| ($ip & ip2long($private127[1])) == ip2long($private127[0]) 
			|| ($ip & ip2long($private192[1])) == ip2long($private192[0]) 
			|| ((($ip & ip2long($private172_16[1])) >= ip2long($private172_16[0]))
					 && (($ip & ip2long($private172_31[1])) <= ip2long($private172_31[0])))){
			return true;
		}
		return false;
	}
	/**
	 * 检查用户名字符串
	 * 用户：手机号码/邮箱
	 * 管理员：数字+字母
	 */
	public static function checkUserNameFormat($name,$userType=self::USER_CMS_ADMIN){
		$len = strlen($name);
		if($len <6 || $len > 22){
			return false;
		}
		if($userType == self::USER_CMS_ADMIN){//管理员只允许字母+数字
			if(preg_match("/^[0-9A-Za-z]+$/", $name)){
				return true;
			}
		}else{//网站注册用户手机号码 or 邮箱
			if(preg_match("/^1[0-9]{10}$/", $name)){
				return true;
			}elseif (preg_match("/^[A-Za-z]{1}[0-9A-Za-z_]*@[0-9A-Za-z_]+\.[A-Za-z_]+$/", $name)){
				return true;
			}
		}
		return false;
	}
	/**
	 * 检查密码字符串
	 */
	public static function checkUserPasswordFormat($password){
		$len = strlen($password);
		if($len < 6 || $len > 18){
			return false;
		}
		//使用的assic码表 0x21="!" & 0x7e="~"
		if(preg_match("/^[\x21-\x7e]+$/", $password)){
			return true;
		}
		return false;
	}
	/**
	 * 检查用户昵称
	 * @param string $nickname
	 */
	public static function checkUserNiacknameFormat($nickname){
		$len = mb_strlen($nickname,"utf-8");
		if($len > 10){
			$nickname = mb_substr($nickname,0,10,"utf-8");
		}
		if(preg_match("/^[\x{4e00}-\x{9fa5}\x21-\x7e]+$/u",$nickname)){
			return true;
		}
		return false;
	}
	/**
	 * 重置key
	 * @param unknown $arr
	 * @param unknown $key
	 * @return multitype:unknown
	 */
	public static function resetArrayKey($arr,$key){
		$result = array();
		foreach ($arr as $val){
			if(isset($val[$key])){
				$result[$val[$key]] = $val;
			}
		}
		return $result;
	}
	
	/**
	 * 是否是手机号
	 * @param string $cellPhone
	 */
	public static function isCellPhone($cellPhone){
	    if(preg_match("/^1[\d]{10}$/",$cellPhone)){
	        return true;
	    }
	    return false;
	}
	
	/**
	 * 是否是邮箱地址
	 * @param string $email
	 */
	public static function isEmail($email){
	    if(preg_match("/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/",$email)){
	        return true;
	    }
	    return false;
	}
	
	public static function isUrl($url){
	    $r = filter_var($url,FILTER_VALIDATE_URL);
	    if($r === false){
	        return false;
	    }
	    return true;
	}

    public static function isUrlMixed($url){
        if(is_array($url)){
            foreach ($url as $one){
                $r = CommonComponent::isUrl($one);
                if($r == false){
                    return false;
                }
            }
            return true;
        } else {
            return CommonComponent::isUrl($url);
        }
    }
	
    /**
     * 验证身份证号
     * @param $vStr
     * @return bool
     */
    public static function isCreditNo($vStr){
        $vCity = array(
            '11','12','13','14','15','21','22',
            '23','31','32','33','34','35','36',
            '37','41','42','43','44','45','46',
            '50','51','52','53','54','61','62',
            '63','64','65','71','81','82','91'
        );
     
        if (!preg_match('/^([\d]{17}[xX\d]|[\d]{15})$/', $vStr)) return false;
     
        if (!in_array(substr($vStr, 0, 2), $vCity)) return false;
     
        $vStr = preg_replace('/[xX]$/i', 'a', $vStr);
        $vLength = strlen($vStr);
     
        if ($vLength == 18)
        {
            $vBirthday = substr($vStr, 6, 4) . '-' . substr($vStr, 10, 2) . '-' . substr($vStr, 12, 2);
        } else {
            $vBirthday = '19' . substr($vStr, 6, 2) . '-' . substr($vStr, 8, 2) . '-' . substr($vStr, 10, 2);
        }
     
        if (date('Y-m-d', strtotime($vBirthday)) != $vBirthday) return false;
        if ($vLength == 18)
        {
            $vSum = 0;
            for ($i = 17 ; $i >= 0 ; $i--)
            {
                $vSubStr = substr($vStr, 17 - $i, 1);
                $vSum += (pow(2, $i) % 11) * (($vSubStr == 'a') ? 10 : intval($vSubStr , 11));
            }
     
            if($vSum % 11 != 1) return false;
        }
     
        return true;
    }

    public static function addPhotoQiniuToken($photosUrl, $size=QiniuModel::THUMB_SIZE_DEFAULT,$thumbType=5){
        if(empty($photosUrl)) {
            if (is_array($photosUrl)){
                return array();
            }else{
                return "";
            }
        }

        if(!is_array($photosUrl)){
            return QiniuModel::getImageUrl($photosUrl,$size,$thumbType);
        }
        $p = array();
        foreach($photosUrl as $photo){
            $p[] = QiniuModel::getImageUrl($photo,$size,$thumbType);
        }
        return $p;
    }
}