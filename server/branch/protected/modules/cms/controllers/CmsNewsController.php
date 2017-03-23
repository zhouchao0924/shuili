<?php
/**
 * 新闻模块
 * @author zhous
 *
 * @todo 1. 没有判断权限
 */

class CmsNewsController extends CmsBaseController{
    
    /**
     * 获取新闻列表
     * @param pageNo          页数
     * @param newsId          新闻Id
     * @param title           新闻名称
     * @param category        新闻分类
     * @param startTime       开始时间
     * @param endTime         结束时间
     * @return [Array][Dictionary] 
     * @return        newsId    新闻ID
     * @return        title             新闻名称
     * @return        categoryName      新闻分类名
     * @return        createTime        创建时间
     * @return        isStick           是否置顶
     * @url /boss/news/list?data={"pageNo":1,"newsId":0,"title":"","category":1,"startTime":"","endTime":""}
     */
    public function actionGetNewsListAjax(){
        $params = $this->getAjaxRequestParam();
        $params['pageNo'] = (intval($params['pageNo']) == 0) ? 1 : intval($params['pageNo']);
        $params['newsId'] = (intval($params['newsId']) <= 0) ? NULL : $params['newsId'];
        $params['title']  = (trim($params['title']) == '')   ? NULL : $params['title'];
        $params['category'] = (intval($params['category'])>0)? intval($params['category']) : 0;
        $params['startTime']= (trim($params['startTime']) == '') ? NULL : $params['startTime'];
        $params['endTime'] = (trim($params['endTime']) == '')? NULL : $params['endTime'];
        if ( (!is_null($params['startTime']) && !$this->_checkDateIsValid($params['startTime']))
           ||(!is_null($params['endTime']) && !$this->_checkDateIsValid($params['endTime']))
           ||(!is_null($params['startTime']) && !is_null($params['endTime']) && $params['startTime'] >= $params['endTime']) ){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "时间选择错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $cmsNewsModel = new CmsNewsModel();
        $newsList = $this->_getNewsList($params);
        $totalCount = $cmsNewsModel->getListCount($params);
        
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array(
            'count'     => $totalCount['num'],
            'pageCount' => ceil($totalCount['num']/15),
            'list'      => $newsList,
            )));
    }
    
    private function _getNewsList($params){
        $cmsNewsModel = new CmsNewsModel();
        return $cmsNewsModel->getNewsList($params);
        
    }
    
   /**
     * 判断时间合法性
     * @param  [type] $date    [description]
     * @param  array  $formats [description]
     * @return [type]          [description]
     */
    private function _checkDateIsValid($date, $formats = array("Y-m-d", "Y/m/d")){
        $unixTime = strtotime($date);
        if (!$unixTime){
            return false;
        }
        foreach ($formats as $format){
            if (date($format, $unixTime) == $date){
                return true;
            }
        }
        return false;
    }
    
    /**
     * 置顶新闻操作
     * @param  newsId
     * @return [type] 0-普通;1-置顶;2-轮播
     * @url /boss/news/stickNews?data={"newsId":1,"isStick":1}
     */
    public function actionUpdateNewsStickAjax(){
        $params = $this->getAjaxRequestParam();
        $params['isStick'] = intval($params['isStick']);
        $params['newsId'] = (intval($params['newsId']) <= 0) ? 0 : $params['newsId'];
        if ($params['newsId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "能选择新闻不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $cmsNewsModel = new CmsNewsModel();
        $cmsNewsModel->updateNewsStick($params['newsId'], $params['isStick']);
        //轮播时保证只有4个位置
        // if ($params['isStick'] == 2){
        //     $parameters = array(
        //         'isStick'   =>  2,
        //         );
        //     $cmsNewsScrollData = $this->_getNewsList($parameters);
        //     $cmsNewsScrollCount = count($cmsNewsScrollData);
        //     if ($cmsNewsScrollCount > 4){
        //         for ($i=4; $i < $cmsNewsScrollCount-4; $i++) { 
        //             $cmsNewsModel->updateNewsStick($cmsNewsScrollData[$i]['newsId'], 0);
        //         }
        //     }
        // }
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 删除新闻操作
     * @param  newsId
     * @param  isStick  0-解除置顶, 1-置顶
     * @return [type] [description]
     * @url /boss/news/delNews?data={"newsId":1}
     */
    public function actionDeleteNewsAjax(){
        $params = $this->getAjaxRequestParam();
        $params['newsId'] = (intval($params['newsId']) <= 0) ? 0 : $params['newsId'];
        if ($params['newsId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的新闻不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $cmsNewsModel = new CmsNewsModel();
        $cmsNewsModel->deleteNews($params['newsId']);
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 新建新闻
     * @param title         新闻名称
     * @param imgUrl        头图Url
     * @param category      分类
     * @param content       内容
     * @param province      省
     * @param city          市
     * @param district      区
     * @param street        街道
     * @param isPublic      是否在终端页面推送
     * @param isBold        title加粗
     * @return [type] [description]
     * @url /boss/news/addNews?data={"title":"12345","imgUrl":"","category":1,"description":"aaaa","province":0,"city":0,"district":0,"street":0,"isPublic":0, "isBold":0}
     */
    public function actionAddNewsAjax(){
       $data = $this->getAjaxRequestParam();
       $params = array(
            'title'     => isset($data['title'])?$this->xssFilter(trim($data['title'])):'',
            'imgUrl'    => isset($data['imgUrl'])?$this->xssFilter(trim($data['imgUrl'])):'',
            'category'  => abs(intval($data['category'])),
            'description'   => isset($data['description'])?$this->xssFilter(trim($data['description'])):'',
            'province'  => abs(intval($data['province'])),
            'city'      => abs(intval($data['city'])),
            'district'  => abs(intval($data['district'])),
            'street'    => abs(intval($data['street'])),
            'isPublic'  => (intval($data['isPublic'])) ? 1 : 0,
            'isBold'    => (intval($data['isBold'])) ? 1 : 0,
        );
       if (empty($params['title']) || empty($params['description'])){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, '参数错误', ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
       }
       
        /**
         * @todo 入参太多,边界判断后补
         */
        $cmsNewsModel = new CmsNewsModel();
        $cmsOrgModel = new OrgModel();
        $userFullInfo = AdminModel::getLogInUserFullInfo();
        $currentOrgId = $userFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG];
        //@todo 为0要报错
        if ($currentOrgId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, '管理机构信息错误', ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $currentOrgName = $cmsOrgModel->getOrgInfoByIdListV2(array($currentOrgId));
        /**
         * @todo 组织data
         */
        
        $areaModel = new AreaModel();
        $provinceInfo = $areaModel->getProvinceById(intval($params['province']));
        $provinceName = isset($provinceInfo['name']) ? $provinceInfo['name'] : '';
        $cityInfo     = $areaModel->getCityById(intval($params['city']));
        $cityName     = isset($cityInfo['name']) ? $cityInfo['name'] : '';
        $districtInfo = $areaModel->getDistrictById(intval($params['district']));
        $districtName = isset($districtInfo['name']) ? $districtInfo['name'] : '';
        
        $data = array(
            'userId'    =>  intval($this->adminId),
            'title'     =>  $params['title'],
            'category'  =>  $params['category'],
            'description'=> $params['description'],
            'province'   => $params['province'],
            'city'       => $params['city'],
            'district'   => $params['district'],
            'street'     => $params['street'],
            'isPublic' => $params['isPublic'],
            'extInfo'   => array(
                'headerImg'=> $params['imgUrl'],
                'isBold'   => $params['isBold'],
                'authorName' => $this->adminName,
                'orgName'    => (!isset($currentOrgName[$currentOrgId])) ? '调解网' : $currentOrgName[$currentOrgId]['name'],
                'provinceName'  => $provinceName,
                'cityName'      => $cityName,
                'districtName'  => $districtName,
                ),
            );
        $result = $cmsNewsModel->addNews($data);
        /**
         * @todo 创建失败的ErrorCode没建
         */
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array())); 
    }
    
    /**
     * 获取新闻信息
     * @param newsId
     * @return [type] [返回数据同actionUpdateNewsAjax入参]
     * @url /boss/news/getNews?data={"newsId":1}
     */
    public function actionGetNewsAjax(){
        $params = $this->getAjaxRequestParam();
        $params['newsId'] = (intval($params['newsId']) <= 0) ? 0 : $params['newsId'];
        if ($params['newsId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的新闻不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmsNewsModel = new CmsNewsModel();
        $news = $cmsNewsModel->getNews($params['newsId']);
        if (empty($news) || count($news) == 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的新闻不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        /**
         * @todo 需要处理数据
         */
        $extInfo = (trim($news['ext_info'])!= '') ? json_decode(trim($news['ext_info']), TRUE) : array();
        $data = array(
            'newsId'        => intval($news['id']),
            'title'         => $news['title'],
            'category'      => intval($news['category']),
            'imgUrl'        => (isset($extInfo['headerImg'])) ? $extInfo['headerImg'] : '',
            'description'   => htmlspecialchars_decode($news['content']),
            'province'      => intval($news['tjw_province']),
            'city'          => intval($news['tjw_city']),
            'district'      => intval($news['tjw_district']),
            'street'        => intval($news['tjw_street']),
            'isPublic'      => $news['is_public'],
            'isBold'        => (isset($extInfo['isBold'])) ? intval($extInfo['isBold']) : 0,
            );
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, $data));
    }
    
    /**
     * 编辑新闻
     * @param newsId        新闻id
     * @param title         新闻名称
     * @param imgUrl        头图Url
     * @param category      分类
     * @param description   内容
     * @param province      省
     * @param city          市
     * @param district      区
     * @param street        街道
     * @param isPublic      是否在终端页面推送
     * @param isBold        标题加粗
     * @return [type] [description]
     * @url /boss/news/updateNews?data={"newsId":1,"title":"7890","imgUrl":"","category":1,"description":"bbb","province":0,"city":0,"district":0,"street":0,"isPublic":0,"isBold":0}
     */
    public function actionUpdateNewsAjax(){
        $data = $this->getAjaxRequestParam();
        $params = array(
            'newsId'    => (intval($data['newsId']) <= 0) ? 0 : $data['newsId'],
            'title'     => isset($data['title'])?$this->xssFilter(trim($data['title'])):'',
            'imgUrl'    =>isset($data['imgUrl'])?$this->xssFilter(trim($data['imgUrl'])):'',
            'category'  => abs(intval($data['category'])),
            'description'=> isset($data['description'])?$this->xssFilter(trim($data['description'])):'',
            'province'  => abs(intval($data['province'])),
            'city'      => abs(intval($data['city'])),
            'district'  => abs(intval($data['district'])),
            'street'    => abs(intval($data['street'])),
            'isPublic'  => (intval($data['isPublic'])) ? 1 : 0,
            'isBold'    => (intval($data['isBold'])) ? 1 : 0,
        );
        /**
         * @todo 入参太多,边界判断后补
         */
        if ($params['newsId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的新闻不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        if (empty($params['title']) || empty($params['description'])){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, '参数错误', ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmsNewsModel = new CmsNewsModel();
        /**
         * @todo 组织data
         */
        $userFullInfo = AdminModel::getLogInUserFullInfo();
        $currentOrgId = $userFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG];
        //@todo 为0要报错
        if ($currentOrgId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, '管理机构信息错误', ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmsOrgModel = new OrgModel();
        $currentOrgName = $cmsOrgModel->getOrgInfoByIdListV2(array($currentOrgId));
        $areaModel = new AreaModel();
        $provinceInfo = $areaModel->getProvinceById(intval($params['province']));
        $provinceName = isset($provinceInfo['name']) ? $provinceInfo['name'] : '';
        $cityInfo     = $areaModel->getCityById(intval($params['city']));
        $cityName     = isset($cityInfo['name']) ? $cityInfo['name'] : '';
        $districtInfo = $areaModel->getDistrictById(intval($params['district']));
        $districtName = isset($districtInfo['name']) ? $districtInfo['name'] : '';
        
        $data = array(
            'userId'     => intval($this->adminId),
            'title'      => $params['title'],
            'category'   => $params['category'],
            'description'=> $params['description'],
            'province'   => $params['province'],
            'city'       => $params['city'],
            'district'   => $params['district'],
            'street'     => $params['street'],
            'isPublic' => $params['isPublic'],
            'extInfo'    => array(
                'headerImg'=> $params['imgUrl'],
                'isBold'   => $params['isBold'],
                'authorName' => $this->adminName,
                'orgName'    => (!isset($currentOrgName[$currentOrgId])) ? '调解网' : $currentOrgName[$currentOrgId]['name'],
                'provinceName'  => $provinceName,
                'cityName'      => $cityName,
                'districtName'  => $districtName,
                ),
            );
        $result = $cmsNewsModel->updateNews($data, $params['newsId']);
        /**
         * @todo 创建失败的ErrorCode没建
         */
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
}