<?php
/**
 * 投资模块
 * @author zhous
 *
 * @todo 1. 没有判断权限
 */

class CmsVoteController extends CmsBaseController{
    
    
    /**
     * 获取投票列表
     * @param  pageNo           页数
     * @param  voteId           投票Id
     * @param  title                    投票名称
     * @param  startTime                开始时间
     * @param  endTime                  结束时间
     * @return [Array][Dictionary] 
     * @return        voteId    投票ID
     * @return        title             投票名称
     * @return        createTime        投票创建时间
     * @return        statusName        投票状态名称
     * @return        registerCount     参加人数
     * @return        followedCount     关注人数
     * @return        isStick           是否置顶
     * @url boss/vote/list?data={"pageNo":1,"voteId":0,"title":"","startTime":"","endTime":""}
     */
    public function actionGetVoteListAjax(){
        $params = $this->getAjaxRequestParam();
        $params['pageNo'] = (intval($params['pageNo']) == 0) ? 1 : intval($params['pageNo']);
        $params['voteId'] = (intval($params['voteId']) <= 0) ? NULL : $params['voteId'];
        $params['title']  = (trim($params['title']) == '') ? NULL : $params['title'];
        $params['startTime'] = (trim($params['startTime']) == '') ? NULL : $params['startTime'];
        $params['endTime'] = (trim($params['endTime']) == '') ? NULL : $params['endTime'];
        if ( (!is_null($params['startTime']) && !$this->_checkDateIsValid($params['startTime']))
           ||(!is_null($params['endTime']) && !$this->_checkDateIsValid($params['endTime']))
           ||(!is_null($params['startTime']) && !is_null($params['endTime']) && $params['startTime'] >= $params['endTime']) ){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "时间选择错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $cmsVoteModel = new CmsVoteModel();
        $voteList = $cmsVoteModel->getVoteList($params);
        
        //获取总数和页数
        $totalCount = $cmsVoteModel->getListCount($params);
        
        $simpleInfoList = array();
        //获取idList
        $idList = array();
        foreach($voteList as $item){
            $idList[] = $item['voteId'];
        }
        
        //获取数量
        $countList = (count($idList)==0) ? array() : $cmsVoteModel->getVoteCountByIds($idList);
        foreach($voteList as $item){
            $item = array_merge($item,array(
                'registerCount' => (isset($countList[$item['voteId']][2])) ? intval($countList[$item['voteId']][2]) : 0,
                'followedCount' => (isset($countList[$item['voteId']][1])) ? intval($countList[$item['voteId']][1]) : 0,
                ));
            $simpleInfoList[] = $item;
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array(
                'count'     => $totalCount['num'],
                'pageCount' => ceil($totalCount['num']/15),
                'list'      => $simpleInfoList,
                )));
    }
    
    
    /**
     * 判断时间合法性
     * @param  [type] $date    [description]
     * @param  array  $formats [description]
     * @return [type]          [description]
     */
    private function _checkDateIsValid($date, $formats = array("Y-m-d H:i:s", "Y/m/d H:i:s")){
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
     * 置顶投票操作
     * @param  voteId           活动Id
     * @param  isStick          0-解除置顶, 1-置顶
     * @return [type] [description]
     * @url boss/vote/stickVote?data={"voteId":4,"isStick":1}
     */
    public function actionUpdateVoteStickAjax(){
        $params = $this->getAjaxRequestParam();
        $params['isStick'] = (intval($params['isStick']) == 1) ? 1 : 0;
        $params['voteId'] = (intval($params['voteId']) <= 0) ? 0 : $params['voteId'];
        if ($params['voteId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "能选择投票活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $cmsVoteModel = new CmsVoteModel();
        $cmsVoteModel->updateVoteStick($params['voteId'], $params['isStick']);
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 删除投票操作
     * @param  voteId           活动Id
     * @return [type] [description]
     */
    public function actionDeleteVoteAjax(){
        $params = $this->getAjaxRequestParam();
        $params['voteId'] = (intval($params['voteId']) <= 0) ? 0 : $params['voteId'];
        if ($params['voteId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "能选择投票活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $cmsVoteModel = new CmsVoteModel();
        $cmsVoteModel->deleteVote($params['voteId']);
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 新建投票
     * @param title         投票名称
     * @param imgUrl        头图Url
     * @param content       内容
     * @param province      省
     * @param city          市
     * @param district      区
     * @param street        街道
     * @param startTime     开始时间
     * @param endTime       结束时间
     * @param [Array] manning 人群: 0-所有用户; 1-实名认证用户; 2-法律人; 3-法律服务志愿者; 4-居民调解员; 5-法律援助律师; 6-社区律师
     * @param isShowResult  是否展示结果
     * @param [Array]voteData     投票项目格式
     * @param        subTitle     投票项标题
     * @param        voteType     投票类型: 0-单选; 1-多选
     * @param        minVoteCount 至少投几项
     * @param [Array]items        项目数据
     * @param               itemTitle   选项名
     * @param               itemImgUrl  选项图片
     * @param               itemUrl    选项超链
     * @return [type] [description]
     * @url boss/vote/addVote?data={"title":"123","imgUrl":"","content":"aaaa","province":0,"city":0,"district":0,"street":0,"startTime":"2016-07-17 00:00:00","endTime":"2016-09-17 08:00:00","manning":[0,1],"isShowResult":false,"voteData":[{"subTitle":"aaa1","voteType":0,"minVoteItems":1,"items":[{"itemTitle":"aaa12","itemImg":"","itemUrl":""}]}]}
     */
    public function actionAddVoteAjax(){
        $params = $this->getAjaxRequestParam();
        if (trim($params['title']) == ''){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "标题不能为空", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $params['startTime'] = (trim($params['startTime']) == '') ? NULL : $params['startTime'];
        $params['endTime'] = (trim($params['endTime']) == '') ? NULL : $params['endTime'];
        if (is_null($params['startTime'])
           ||is_null($params['endTime'])
           ||(!is_null($params['startTime']) && !is_null($params['endTime']) && $params['startTime'] >= $params['endTime']) ){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "时间选择错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        /**
         * @todo manning暂时不判断
         */
        if (!isset($params['voteData'])){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "请输入投票项目", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        /**
         * @todo 要判断的太多了, 先不判断voteType,minVoteCount,items的存在性
         */
        foreach($params['voteData'] as $item => $value){
            if ($value['voteType'] == 1 && $value['minVoteCount'] <= 0){  //单选程序处理
                return $this->renderAjaxResponse($this->getAjaxResponse(false, "多选至少选1个", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            }
            if (count($value['items']) == 0){
                return $this->renderAjaxResponse($this->getAjaxResponse(false, "缺少选项", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            }
            $cmsVoteModel = new CmsVoteModel();
            foreach ($value['items'] as $opt => $v) {
                $optParams = array(
                    'itemTitle'    =>  $v['itemTitle'],
                    'itemImg'      =>  $v['itemImg'],
                    'itemUrl'      =>  $v['itemUrl'],
                    );
                $optResult = $cmsVoteModel->addVoteItem($optParams);
                if ($optResult){
                    $params['voteData'][$item]['items'][$opt]['itemId'] = $optResult;
                }else{
                    return $this->renderAjaxResponse($this->getAjaxResponse(false, "标题不能为空", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
                }
            }
            /**
             * @todo 选项数<最少选择数, 没有判断
             */
        }
        
        $cmsOrgModel = new OrgModel();
        $userFullInfo = AdminModel::getLogInUserFullInfo();
        $currentOrgId = $userFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG];
        $currentOrgName = $cmsOrgModel->getOrgInfoByIdList(array($currentOrgId));
        //@todo 为0要报错
        if ($currentOrgId == 0){
            
        }
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
            'userId'    => intval($this->adminId),
            'title'     => $this->xssFilter(trim($params['title'])),
            'content'   => $this->xssFilter(trim($params['content'])),
            'province'  => intval($params['province']),
            'city'      => intval($params['city']),
            'district'  => intval($params['district']),
            'street'    => intval($params['street']),
            'crowd'     => $params['manning'],
            'startTime' => $params['startTime'],
            'endTime'   => $params['endTime'],
            'extInfo'   => array(
                'headerImg'     => $this->xssFilter(trim($params['imgUrl'])),
                'isShowResult'  => intval($params['isShowResult']),
                'authorName' => $this->adminName,
                'orgName'    => (!isset($currentOrgName[0])) ? 'system' : $currentOrgName[0]['name'],
                'voteData'      => $params['voteData'],
                'provinceName'  => $provinceName,
                'cityName'      => $cityName,
                'districtName'  => $districtName,
                ),
            );
        $result = $cmsVoteModel->addVote($data);
        /**
         * @todo 创建失败的ErrorCode没建
         */
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    
    /**
     * 获取投票信息
     * @param voteId
     * @return [type] [返回数据同actionUpdateVoteAjax入参]
     * @url boss/vote/getVote?data={"voteId":4}
     */
    public function actionGetVoteAjax(){
        $params = $this->getAjaxRequestParam();
        $params['voteId'] = (intval($params['voteId']) <= 0) ? 0 : $params['voteId'];
        if ($params['voteId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择投票活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmsVoteModel = new CmsVoteModel();
        $vote = $cmsVoteModel->getVote($params['voteId']);
        if (empty($vote) || count($vote) == 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择投票活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        /**
         * @todo 需要处理数据
         */
        $extInfo = (trim($vote['ext_info']) != '') ? json_decode(trim($vote['ext_info']), TRUE) : array();
        $data = array(
            'voteId'        => intval($vote['id']),
            'title'         => $vote['title'],
            'imgUrl'        => (isset($extInfo['headerImg']) ? $extInfo['headerImg'] : ""),
            'content'       => $vote['content'],
            'province'      => intval($vote['tjw_province']),
            'city'          => intval($vote['tjw_city']),
            'district'      => intval($vote['tjw_district']),
            'street'        => intval($vote['tjw_street']),
            'startTime'     => $vote['start_time'],
            'endTime'       => $vote['end_time'],
            'crowd'         => json_decode($vote['crowd'], TRUE),
            'isShowResult'  => (isset($extInfo['isShowResult']) ? $extInfo['isShowResult'] : ""),
            'voteData'      => (isset($extInfo['voteData']) ? $extInfo['voteData'] : array()),
            );
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, $data));
    }
    
    /**
     * 编辑投票
     * @param voteId        投票id
     * @param title         投票名称
     * @param imgUrl        头图Url
     * @param description   描述
     * @param province      省
     * @param city          市
     * @param district      区
     * @param street        街道
     * @param startTime     开始时间
     * @param endTime       结束时间
     * @param [Array] crowd 人群: 0-所有用户; 1-实名认证用户; 2-法律人; 3-法律服务志愿者; 4-居民调解员; 5-法律援助律师; 6-社区律师
     * @param isShowResult  是否展示结果
     * @param [Array]voteData     投票项目格式
     * @param        subTitle     投票项标题
     * @param        voteType     投票类型: 0-单选; 1-多选
     * @param        minVoteCount 至少投几项
     * @param [Array]items        项目数据
     * @param               itemTitle   选项名
     * @param               itemImgUrl  选项图片
     * @param               itemHref    选项超链
     * @return [type] [description]
     * @url boss/vote/updateVote?data={"voteId":4,"title":"123","imgUrl":"","content":"aaaa","province":0,"city":0,"district":0,"street":0,"startTime":"2016-07-17 00:00:00","endTime":"2016-09-17 08:00:00","manning":[0,1],"isShowResult":false,"voteData":[{"subTitle":"aaa1","voteType":0,"minVoteItems":1,"items":[{"itemTitle":"aaa12","itemImg":"","itemUrl":"","itemId":0}]}]}
     */
    public function actionUpdateVoteAjax(){
        $params = $this->getAjaxRequestParam();
        $params['voteId'] = (intval($params['voteId']) <= 0) ? 0 : $params['voteId'];
        if ($params['voteId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择投票活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        if (trim($params['title']) == ''){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "标题不能为空", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $params['startTime'] = (trim($params['startTime']) == '') ? NULL : $params['startTime'];
        $params['endTime'] = (trim($params['endTime']) == '') ? NULL : $params['endTime'];
        if ( (!is_null($params['startTime']) && !$this->_checkDateIsValid($params['startTime']))
           ||(!is_null($params['endTime']) && !$this->_checkDateIsValid($params['endTime']))
           ||(is_null($params['startTime']))
           ||(is_null($params['endTime']))
           ||(!is_null($params['startTime']) && !is_null($params['endTime']) && $params['startTime'] >= $params['endTime']) ){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "时间选择错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        /**
         * @todo manning暂时不判断
         */
        if (!isset($params['voteData'])){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "请输入投票项目", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmsVoteModel = new CmsVoteModel();
        /**
         * @todo 要判断的太多了, 先不判断voteType,minVoteCount,items的存在性
         */
        foreach($params['voteData'] as $value){
            if ($value['voteType'] == 1 && $value['minVoteCount'] <= 0){  //单选程序处理
                return $this->renderAjaxResponse($this->getAjaxResponse(false, "多选至少选1个", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            }
            if (count($value['items']) == 0){
                return $this->renderAjaxResponse($this->getAjaxResponse(false, "缺少选项", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            }
            foreach ($value['items'] as $opt => &$v) {
                $optParams = array(
                    'itemTitle'    =>  $v['itemTitle'],
                    'itemImg'      =>  $v['itemImg'],
                    'itemUrl'      =>  $v['itemUrl'],
                    'itemId'       =>  $v['itemId'],
                    );
                if ($optParams['itemId'] == 0){
                    $optResult = $cmsVoteModel->addVoteItem($optParams);
                    if (!$optResult){
                        unset($value[$opt]);
                        continue;
                    }
                    $v['itemId'] = $optResult;
                }else{
                    $optResult = $cmsVoteModel->updateVoteItem($optParams);
                }
               
            }
            /**
             * @todo 选项数<最少选择数, 没有判断
             */
        }
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
            'userId'    => intval($this->adminId),
            'title'     => $this->xssFilter(trim($params['title'])),
            'content'   => $this->xssFilter(trim($params['content'])),
            'province'  => intval($params['province']),
            'province'  => intval($params['province']),
            'province'  => intval($params['province']),
            'city'      => intval($params['city']),
            'district'  => intval($params['district']),
            'street'    => intval($params['street']),
            'crowd'     => $params['manning'],
            'startTime' => $params['startTime'],
            'endTime'   => $params['endTime'],
            'extInfo'   => array(
                'headerImg'     => $this->xssFilter(trim($params['imgUrl'])),
                'isShowResult'  => intval($params['isShowResult']),
                'voteData'      => $params['voteData'],
                'provinceName'  => $provinceName,
                'cityName'      => $cityName,
                'districtName'  => $districtName,
                ),
            );
        $result = $cmsVoteModel->updateVote($data, $params['voteId']);
        /**
         * @todo 创建失败的ErrorCode没建
         */
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
}