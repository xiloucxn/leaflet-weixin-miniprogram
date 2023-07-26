const TYPE = 1; // 本地运行环境：0测试 1正式 2水利厅 （线上不影响）

const origin =
  window.location.hostname === "localhost"
    ? TYPE === 2
      ? "http://stbc.gdwater.gov.cn"
      : TYPE === 1
      ? "https://www.zkygis.cn"
      : "https://www.zkygis.cn:8089"
    : window.location.origin;

const pathname = window.location.pathname;
const hostname = window.location.hostname;

const baiduKey1 = "Ohb5Iw1j3pz0Lrnbvxu7KjwIB2Au3NLQ";
const baiduKey2 = "pUIuzVmqHDR8S5ECUGnrD02zSx8mmbn4";

const isTest =
  pathname === "/stbcjgt/" || (hostname === "localhost" && TYPE === 0)
    ? "t"
    : "";

// 系统管理
const sysUrl = `${origin}/zkywr${isTest}/sys/`;
const sysApi = `${sysUrl}api/services/app/`;

// 遥感AI
const rsimageUrl = `${origin}/zkywr${isTest}/rsimage/`;
const rsimageApi = `${rsimageUrl}api/services/app/`;

// 水土保持
export const stbcUrl = `${origin}/zkywr${isTest}/stbc/`;
const stbcApi = `${stbcUrl}api/services/app/`;

console.log(`%c${sysUrl} v3.0.28`, "color:green;font-size:30px");

const httpUrl = {
  origin,

  sysUrl,
  sysApi,

  rsimageUrl,
  rsimageApi,

  stbcUrl,
  stbcApi,

  reverseGeocodeUrl: `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${
    origin === "https://www.zkygis.cn" ? baiduKey1 : baiduKey2
  }&output=json&coordtype=wgs84ll&location=`,

  baiduSearchUrl: `https://api.map.baidu.com/place/v2/search?ak=${
    origin === "https://www.zkygis.cn" ? baiduKey1 : baiduKey2
  }&output=json&coord_type=1&`,

  // 模板说明
  templateIntroUrl: `https://docs.qq.com/doc/DVXF2cFNxcXNTc21j `,

  // 模板下载
  templateDownloadUrl: `${stbcUrl}template/`,

  // ============================= 微服务 stbc =================================== start

  // 点查地图服务后台接口
  queryWFSLayer: `${stbcUrl}api/Tool/Forward`,

  // postgis动态渲染矢量瓦片接口
  tilesMvtUrl: `${stbcUrl}geo/tiles`,
  //扰动图斑
  tilesSpotMvtUrl: `${stbcUrl}geo/spot`,
  //治理图斑
  tilesGovernSpotMvtUrl: `${stbcUrl}geo/governspot`,
  //弃渣场
  tilesGovernFocusMvtUrl: `${stbcUrl}geo/governfocus`,

  // 聚合点数据源接口
  makerClusterUrl: `${stbcUrl}geo/centroid`,
  // makerClusterUrl: `${stbcUrl}centroidsv1`,

  // 审批一张图项目红线矢量瓦片接口
  approscopeMvtUrl: `${stbcUrl}geo/approscope`,

  // 防治分区矢量瓦片接口
  prevenzoneMvtUrl: `${stbcUrl}geo/prevenzone`,

  // 弃土弃渣矢量瓦片接口
  projectfocusMvtUrl: `${stbcUrl}geo/projectfocus`,

  // 弃土弃渣矢量瓦片接口
  aispotMvtUrl: `${stbcUrl}geo/aispot`,

  // 项目
  projectUrl: `${stbcApi}Project/`,

  // 建设情况_编辑
  buildInfoEditUrl: `${stbcApi}Project/UpdateBuildInfo`,

  // 设计/施工单位_编辑
  depsEditUrl: `${stbcApi}Project/UpdateDepInfo`,

  // 方案管理
  planUrl: `${stbcApi}AdminAppro/`,

  // 方案_区域监管
  planRegionEditUrl: `${stbcApi}ProjectPlan/`,

  // 红线
  redLineUrl: `${stbcApi}ProjectScope/`,

  // 防治分区
  zoneUrl: `${stbcApi}ProjectPrevenZone/`,

  // 取弃土场
  spoilUrl: `${stbcApi}ProjectFocus/`,

  //措施
  preventionUrl: `${stbcApi}ProjectPrevention/`,

  // 方案评审
  reviewUrl: `${stbcApi}TechReview/`,

  // 批复
  replyUrl: `${stbcApi}PlanApproval/`,

  // 监督检查_列表
  inspectListUrl: `${stbcApi}MonitorCheck/GetProjectAll`,

  // 监督检查_编辑
  inspectEditUrl: `${stbcApi}MonitorCheck/`,

  // 监督检查_详情
  inspectInfoUrl: `${stbcApi}MonitorCheck/Get`,

  // 监督检查_删除
  inspectDeleteUrl: `${stbcApi}MonitorCheck/Delete`,

  // 监督检查_配置
  inspectConfigUrl: `${stbcApi}MonitorCheck/Config`,

  // 监督检查_打印
  inspectPrintUrl: `${stbcApi}MonitorCheck/Print`,

  // 验收报备_备案记录列表
  acceptanceDisposeListUrl: `${stbcApi}ProjectAcceptance/GetAll`,

  // 验收报备_项目列表
  acceptanceListUrl: `${stbcApi}ProjectAcceptance/GetProjectAll`,

  // 验收报备_编辑
  acceptanceEditUrl: `${stbcApi}ProjectAcceptance/`,

  // 验收报备_方案提交
  acceptanceSubmitUrl: `${stbcApi}ProjectAcceptance/PlanSubmit`,

  // 验收报备_详情
  acceptanceInfoUrl: `${stbcApi}ProjectAcceptance/Get`,

  // 验收报备_设置受理状态
  acceptanceSetStatusUrl: `${stbcApi}ProjectAcceptance/SetAccepted`,

  // 验收报备_获取验收期项目信息和方案中对应的信息
  acceptanceProjectAnPlanUrl: `${stbcApi}ProjectAcceptance/GetAcceptanceProjectAnPlan`,

  // 验收核查_核查记录列表
  acceptanceCheckListUrl: `${stbcApi}ProjectAcceptanceCheck/GetAll`,

  // 验收核查_编辑
  acceptanceCheckEditUrl: `${stbcApi}ProjectAcceptanceCheck/`,

  // 验收核查_详情
  acceptanceCheckInfoUrl: `${stbcApi}ProjectAcceptanceCheck/Get`,

  // 全景图
  panoramaEdit: `${stbcApi}FocusPlaceCheck/`,

  // 全景图_上传
  panoramaUploadUrl: `${stbcApi}Pano/Generate`,

  // 全景图_预览
  panoramaPreviewUrl: `${stbcUrl}pano/pannellum.htm?config=`,

  // 季度监测
  monitorQuarterUrl: `${stbcApi}QuarterMonitor/`,

  // 治理项目_列表
  governProjectListUrl: `${stbcApi}GovernProject/GetAllByPost`,

  // 治理项目_编辑
  governProjectUrl: `${stbcApi}GovernProject/`,

  // 治理项目_详情
  governProjectInfoUrl: `${stbcApi}GovernProject/Get`,

  // 治理项目_删除
  governProjectDeleteUrl: `${stbcApi}GovernProject/Delete`,

  // 治理图斑_上传
  governSpotUploadUrl: `${stbcApi}GovernSpot/GovernSpotImport`,

  // 治理图斑_列表
  governSpotListUrl: `${stbcApi}GovernSpot/GetAllByPost`,

  // 治理图斑_编辑
  governSpotEditUrl: `${stbcApi}GovernSpot/`,

  // 治理图斑_详情
  governSpotInfoUrl: `${stbcApi}GovernSpot/Get`,

  // 治理图斑_删除
  governSpotDeleteUrl: `${stbcApi}GovernSpot/Delete`,

  // 治理图斑_提交
  governSpotSubmitUrl: `${stbcApi}GovernSpot/Submit`,

  // 治理图斑_撤回提交
  governSpotCancelSubmitUrl: `${stbcApi}GovernSpot/CancelSubmit`,

  // 治理图斑_审批
  governSpotApprovalUrl: `${stbcApi}GovernSpot/SetApproval`,

  // 重点工程点_上传
  governEnginUploadUrl: `${stbcApi}GovernSpot/GovernFocusProjectImport`,

  // 重点工程点_列表
  governEnginListUrl: `${stbcApi}GovernFocusProject/GetAllByPost`,

  // 重点工程点_编辑
  governEnginEditUrl: `${stbcApi}GovernFocusProject/`,

  // 重点工程点_详情
  governEnginInfoUrl: `${stbcApi}GovernFocusProject/Get`,

  // 重点工程点_删除
  governEnginDeleteUrl: `${stbcApi}GovernFocusProject/Delete`,

  // 重点工程点_提交
  governEnginSubmitUrl: `${stbcApi}GovernFocusProject/Submit`,

  // 重点工程点_撤回提交
  governEnginCancelSubmitUrl: `${stbcApi}GovernFocusProject/CancelSubmit`,

  // 重点工程点_审批
  governEnginApprovalUrl: `${stbcApi}GovernFocusProject/SetApproval`,

  // 动态监测图斑
  dynamicSpotUrl: `${stbcApi}GovernTempSpot/`,

  // 图斑_列表
  spotListUrl: `${stbcApi}Spot/GetAllByPost`,

  // 图斑_遥感监管全部列表
  spotRegionalAllListUrl: `${stbcApi}Spot/RegionalAll`,

  // 图斑_信息
  spotInfoUrl: `${stbcApi}Spot/Get`,

  // 图斑_编辑
  spotEditUrl: `${stbcApi}Spot/`,

  // 图斑_删除
  spotDeleteUrl: `${stbcApi}Spot/Delete`,

  // 图斑_解译期次
  spotTermUrl: `${stbcApi}Spot/GetTaskLevelAndInterBatch`,

  // 图斑_分割
  spotDivideUrl: `${stbcApi}Spot/SplitMultipleSpot`,

  // 图斑_导入
  spotUploadUrl: `${stbcApi}Spot/SpotImport`,

  // 图斑__根据项目获取扰动查处列表
  spotGetSpotInvestUrl: `${stbcApi}Spot/GetSpotInvest`,

  // 图斑__区域调整申请
  spotAdjustmentApplyUrl: `${stbcApi}SpotAdjustmentApply`,

  // 图斑__图斑撤销通过
  spotCancelApplyUrl: `${stbcApi}SpotCancelApply`,

  // 复核计划_列表
  reviewPlanListUrl: `${stbcApi}ReviewPlan/GetAllByPost`,

  // 复核计划_关联图斑列表
  reviewPlanSpotListUrl: `${stbcApi}ReviewPlan/ReviewPlanSpotList`,

  // 复核计划_新增关联图斑列表
  reviewPlanSetSpotUrl: `${stbcApi}ReviewPlan/SetSpotTag`,

  // 复核计划_移除关联图斑列表
  reviewPlanRemoveSpotUrl: `${stbcApi}ReviewPlan/CancelSpotTag`,

  // 复核计划_未关联图斑列表
  reviewPlanNoTagSpotListUrl: `${stbcApi}ReviewPlan/GetNoTagSpotList`,

  // 复核计划_信息
  reviewPlanInfoUrl: `${stbcApi}ReviewPlan/Get`,

  // 复核计划_编辑
  reviewPlanEditUrl: `${stbcApi}ReviewPlan/`,

  // 复核计划_任务记录列表
  reviewPlanTaskRecordUrl: `${stbcApi}ReviewPlan/GetTaskList`,

  // 复核计划_获取任务下达的单位
  reviewPlanTaskReleaseGovDepUrl: `${stbcApi}ReviewPlan/GetTaskReleaseGovDepV1`,

  // 复核计划_任务下达
  reviewPlanTaskReleaseUrl: `${stbcApi}ReviewPlan/TaskRelease`,

  // 检查计划_列表
  checkPlanListUrl: `${stbcApi}CheckPlan/GetAllByPost`,

  // 检查计划_关联项目列表
  checkPlanProjectListUrl: `${stbcApi}CheckPlan/CheckPlanProjectList`,

  // 检查计划_新增关联项目列表
  checkPlanSetProjectUrl: `${stbcApi}CheckPlan/SetProjetTag`,

  // 检查计划_移除关联项目列表
  checkPlanRemoveProjectUrl: `${stbcApi}CheckPlan/CancelProjetTag`,

  // 检查计划_未关联项目列表
  checkPlanNoTagProjectListUrl: `${stbcApi}CheckPlan/GetNoTagProjectList`,

  // 检查计划_清理无用查处记录
  checkPlanClearExamineUrl: `${stbcApi}CheckPlan/ChearInvestigation`,

  // 检查计划_信息
  checkPlanInfoUrl: `${stbcApi}CheckPlan/Get`,

  // 检查计划_编辑
  checkPlanEditUrl: `${stbcApi}CheckPlan/`,

  // 视频监控_列表
  videoListUrl: `${stbcApi}VideoPoint/GetAllByPost`,

  // 视频监控_信息
  videoInfoUrl: `${stbcApi}VideoPoint/Get`,

  // 视频监控_编辑
  videoEditUrl: `${stbcApi}VideoPoint/`,

  // 统计url
  statisticUrl: `${stbcApi}Statistic/`,

  //审批一张图统计—地图饼图数据
  spyztStatisticOnMapUrl: `${stbcApi}Statistic/SpyztStatistic`,

  //审批一张图统计—某行政区数据
  spyztStatisticByDistrictUrl: `${stbcApi}Statistic/StatisticApprove`,

  //监管一张图统计—地图饼图数据
  jgyztStatisticOnMapUrl: `${stbcApi}Statistic/JgyztStatistic`,

  //监管一张图统计—某行政区数据
  jgyztStatisticByDistrictUrl: `${stbcApi}Statistic/JgyztStatisticByYear`,

  //违规一张图统计—地图饼图数据
  wgyztStatisticOnMapUrl: `${stbcApi}Statistic/WgxmStatistic`,

  //违规一张图统计—某行政区数据
  wgyztStatisticByDistrictUrl: `${stbcApi}Statistic/StatisticApprove`,

  //治理图斑一张图统计—地图饼图数据
  zlyztStatisticOnMapUrl: `${stbcApi}Statistic/SpyztStatistic`,

  //治理图斑一张图统计—某行政区数据
  zlyztStatisticByDistrictUrl: `${stbcApi}Statistic/StatisticApprove`,

  //区域监管一张图统计—地图饼图数据
  qyjgStatisticOnMapUrl: `${stbcApi}Statistic/QyyztStatisticSpot`,

  //区域监管一张图统计—某行政区数据
  qyjgStatisticByDistrictUrl: `${stbcApi}Statistic/QyyztStatisticProject`,

  //区域监管一张图统计—地图饼图数据
  qyjgGetAllReviewPlanUrl: `${stbcApi}ReviewPlan/GetAll`,

  // 统计分析_图斑核查与项目认定查处
  statisticExamineUrl: `${stbcApi}Statistic/InvestiStatistic`,

  // 倾斜模型_上传
  tiltUploadUrl: `${stbcApi}Pano/Upload3D`,

  // 倾斜模型文件地址
  tiltUrl: `${stbcUrl}`,

  // AI任务
  geoserverGeomUrl: `${stbcApi}geo/geom/`,

  // 洞穿查询
  geoserverPierceUrl: `${stbcUrl}geo/pierce`,

  // 任务
  workTaskUrl: `${stbcApi}WorkTask/`,

  // 整改抽检
  sampleUrl: `${stbcApi}InvestigationSampl/`,

  // 二次下发
  againUrl: `${stbcApi}InvesSecondRelease/`,

  // 法律法规
  lawUrl: `${stbcApi}LawRegulService/`,

  // 降雨预警
  rainUrl: `${stbcApi}WeatherWarnService/`,

  // 日志服务
  auditLogUrl: `${stbcApi}AuditLog/`,

  // 学会管理 —— 通知公告
  learnNoticeUrl: `${stbcApi}LearnNotice`,

  // 学会管理 —— 学术活动
  learnAcademicUrl: `${stbcApi}AcademicActivityService`,

  // 学会管理 —— 学术活动申请
  learnAcademicRegUrl: `${stbcApi}ActivitySignup`,

  // 学会管理 —— 教育培训
  learnTrainingUrl: `${stbcApi}EduTraining`,

  // 学会管理 —— 教育培训申请
  learnTrainingRegUrl: `${stbcApi}EduTrainingRegister`,

  // 学会管理 —— 专家管理
  learnExpertUrl: `${stbcApi}ExpertManageService`,

  // 学会管理 —— 个人会员
  learnIndividualMemberUrl: `${stbcApi}IndividualMember`,

  // 学会管理 —— 团体会员
  learnGroupMemberUrl: `${stbcApi}GroupMember`,

  // 学会管理 —— 表彰奖励 —— 相关文件
  learnRelevantFileUrl: `${stbcApi}RelevantFile`,

  // 学会管理 —— 表彰奖励 —— 获奖情况
  learnAwardSituationUrl: `${stbcApi}AwardSituation`,

  // ============================= 微服务 stbc =================================== end

  // ============================= 微服务 sys =================================== start

  // 附件_上传
  annexUploadUrl: `${sysApi}File/Upload`,

  // 附件_预览
  annexPreviewUrl: `${sysApi}File/GetFile?id=`,

  // 下载导出数据 zip
  downloadZipUrl: `${sysApi}File/GetExportFile?id=`,

  // 下载导出数据 xls
  downloadFileUrl: `${sysApi}File/GetTempFile?fileName=`,

  // 用户_修改密码
  changePasswordUrl: `${sysApi}User/ChangePassword`,

  // 用户_列表
  userListUrl: `${sysApi}User/GetAllByPost`,

  // 用户_详情
  userDetailUrl: `${sysApi}User/Get`,

  // 用户_编辑
  userEditUrl: `${sysApi}User/`,

  // 用户_删除
  userDeleteUrl: `${sysApi}User/Delete`,

  // 用户_设置权限
  jurisSetUrl: `${sysApi}User/SetGrantedPermissions`,

  // 行政区划_树状列表
  areaTreeUrl: `${sysApi}User/GetDistrictCodesTree`,

  // 获取边界
  boundaryUrl: `${sysApi}User/GetBound`,

  // 流程实例服务
  workFlowInstanceUrl: `${sysApi}WorkFlowInstance`,
  // ============================= 微服务 sys =================================== end
};

export default httpUrl;
