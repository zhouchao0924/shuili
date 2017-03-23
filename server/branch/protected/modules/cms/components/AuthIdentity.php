<?php
/**
 * 权限验证标签
 * @author lzm
 *
 */
class AuthIdentity{
    /* ----- 法律咨询管理 ----- */
    CONST AUTH_LEGAL_ADVICE = "l_advice";//法律咨询
    CONST AUTH_LEGAL_ADVICE_DETAIL = "l_adivce_detail";//法律咨询详情
    
    
    /* ----- 居民调解管理 ----- */
    CONST AUTH_LEGAL_MEDIATE = "l_mediate";//居民调节
    CONST AUTH_LEGAL_MEDIATE_DETAIL = "l_mediate_detail";//居民调节
    CONST AUTH_LEGAL_MEDIATE_DETAIL_NOTICE = "l_mediate_detail_notice";//提醒跟进
    CONST AUTH_LEGAL_MEDIATE_DETAIL_PROGRESS = "l_mediate_detail_progress";//催促完善案情进展
    
    
    /* ----- 法律援助管理 ----- */
    CONST AUTH_LEGAL_HELP_DETAIL = "l_help_detail";//援助详情
    CONST AUTH_LEGAL_HELP_FIXED_LAWYER = "l_help_lawyer";//律师指派
    CONST AUTH_LEGAL_HELP_NOTICE = "l_help_notice";//提醒跟进
    CONST AUTH_LEGAL_HELP_PROGRESS = "l_help_progress";//催促完善案情进展
    
    /* ----- 律师管理 ----- */
    CONST AUTH_LEGAL_LAWYER_DETAIL = "l_lawyer_detail";//律师详情
    CONST AUTH_LEGAL_LAWYER_PRJ_IN_PROGRESS = "l_lawyer_inprog";//进行中的案例
    CONST AUTH_LEGAL_LAWYER_PRJ_COMPLATE = "l_lawyer_prjok";//完成案例
    CONST AUTH_LEGAL_LAWYER_CARD_RECORDS = "l_lawyer_records";//社区打卡记录
    CONST AUTH_LEGAL_LAWYER_NOTICE_CARD_RECORDS = "l_lawyer_notice_records";//提醒打卡
    CONST AUTH_LEGAL_LAWYER_PRJ_PROGRESS = "l_lawyer_prj_progress";//提醒跟进案情
    
    /* ----- 实名认证管理 ----- */
    CONST AUTH_REALNAME_WATCH_ID_CARD = "watch_id_card";//查看身份证
    CONST AUTH_REALNAME_VERIFY = "verify_realuser";//审核认证
    
    /* ----- 法律人职业认证管理 ----- */
    CONST AUTH_WATCH_AUTH_ATTACHMENT = "watch_auth_attachment";//查看认证附件
    CONST AUTH_LAWYER_VERIFY = "verify_lawyer";//审核认证

    CONST AUTH_PUBLIC_MAN = "public_man";//公益人
    
    /* ----- 活动管理 ----- */
    CONST AUTH_EVENT_CREATE = "event_create";//新建活动
    CONST AUTH_EVENT_SIGNED = "event_signed";//活动现场签到
    CONST AUTH_EVENT_SUMMARY = "event_summary";//活动总结
    CONST AUTH_EVENT_EDIT = "event_edit";//编辑活动
    CONST AUTH_EVENT_DELETE = "event_delete";//删除活动
    CONST AUTH_EVENT_TOP = "event_top";//置顶活动
    
    /* ----- 投票管理 ----- */
    CONST AUTH_VOTE_CREATE = "vote_create";//新建投票
    CONST AUTH_VOTE_EDIT = "vote_edit";//编辑投票
    CONST AUTH_VOTE_DELETE = "vote_delete";//删除投票
    CONST AUTH_VOTE_TOP = "vote_top";//置顶投票
    
    /* ----- 新闻管理 ----- */
    CONST AUTH_NEWS_CREATE = "news_create";//添加新闻
    CONST AUTH_NEWS_EDIT = "news_edit";//编辑新闻
    CONST AUTH_NEWS_EDIT_HELP = "news_edit_help";//编辑帮助中心文档
    CONST AUTH_NEWS_EDIT_MAIN_EVENT = "news_main_event";//编辑大事记
    CONST AUTH_NEWS_DELETE = "news_delete";//删除新闻
    CONST AUTH_NEWS_TOP = "news_top";//置顶新闻
    
    /* ----- 角色管理 ----- */
    CONST AUTH_ROLE_CREATE = "role_create";//创建角色
    CONST AUTH_ROLE_EDIT = "role_edit";//编辑角色
    CONST AUTH_ROLE_DELETE = "role_delete";//删除角色
    CONST AUTH_ROLE_AUTH_ALLOC = "role_auth_alloc";//权限分配
    
    /* ----- 管理员管理 ----- */
    CONST AUTH_ADMIN_CREATE = "admin_create";//增加管理员
    CONST AUTH_ADMIN_EDIT = "admin_edit";//编辑管理员
    CONST AUTH_ADMIN_DELETE = "admin_delete";//删除管理员
    CONST AUTH_ADMIN_RESET_PWD = "admin_reset_pwd";//重置密码
    CONST AUTH_ADMIN_ALLOC_ORG = "admin_alloc_org";//分配机构
    
    /* ----- 机构管理 ----- */
    CONST AUTH_ORG_CREATE = "org_create";//新增机构
    CONST AUTH_ORG_EDIT = "org_edit";//编辑机构

    CONST AUTH_POINTS_RULE = "points_rule";//奖励规则
}