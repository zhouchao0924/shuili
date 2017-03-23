<?php
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;
/**
 * 七牛相关处理
 * @author lzm
 *
 */

Yii::import("application.extensions.qiniu.autoload",true);
abstract class AbstractQiniuIao extends Iao{
    CONST TTL_MINUTE = 60;
    CONST TTL_HOUR = 3600;
    
    //TODO 这个地方暂时没有方式调
//     private $policy = array(
//             'callbackUrl' => 'http://127.0.0.1/store/callback',
//             'callbackBody' => '{"fname":"$(fname)", "fkey":"$(key)", "desc":"$(x:desc)", "uid":"uid"}'
//     );
    
    protected $auth = null;
    private function getGlobalConfig(){
        return Yii::app()->params['qiniu'];
    }
    abstract protected function getConfig();
    
    protected function getAuthInstance(){
        if($this->auth == null){
            $globalConfig = $this->getGlobalConfig();
            $this->auth = new Auth($globalConfig['accessKey'], $globalConfig['secretKey']);
        }
        return $this->auth;
    }
    
    public function getUploadToken($store = "public", $ttl = AbstractQiniuIao::TTL_HOUR){
        $globalConfig = $this->getGlobalConfig();
        $config = $globalConfig['bucket'][$store];
        return $this->getAuthInstance()->uploadToken($config['bucket'],null,$ttl);
    }
    
    public function upload($filePath, $fileName){
//        $token = $this->getUploadToken();
//        $upload = new UploadManager();
//        return $upload->putFile($token, $fileName, $filePath);
    }
    /**
     * 转化为图片url
     * @param string $key 文件名
     */
    public function getDownloadUrl($key,$w,$h,$thumbType, $expire=AbstractQiniuIao::TTL_MINUTE){
        $globalConfig = $this->getGlobalConfig();
        $store = $this->getConfig();
        $config = $globalConfig['bucket'][$store];
        $url = "";
        if($w == 0 && $h == 0){
            $url = $config['baseUrl'] . "/" . $key;
        }else if($w == 0){
            $url = $config['baseUrl'] . "/" . $key."?imageView2/".$thumbType."/w/".$w;
        }else if($h == 0){
            $url = $config['baseUrl'] . "/" . $key."?imageView2/".$thumbType."/h/".$h;
        }else{
            $url = $config['baseUrl'] . "/" . $key."?imageView2/".$thumbType."/w/".$w."/h/".$h;
        }

        if($config['isPublic'] == false) {
            return $this->getAuthInstance()->privateDownloadUrl($url, $expire);
        }else{
            return $url;
        }
    }
}