import httpUrl from './httpUrl';
import request from './request';
import { stringify } from 'qs';

const accessToken = () => {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjU4NzUwMTU3OTQ3NzcxMjg5NyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiLlub_kuJzotJ_otKPkuroiLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IkxQSVFGWFJHTk4yQ0FGSTJJVTZXVkpQVTRSTlJJTFdYIiwic3ViIjoiNTg3NTAxNTc5NDc3NzEyODk3IiwianRpIjoiZGI2NTRjZTAtMzdhNC00MTAxLWJiYmYtNDI5NzQ3MTM0ZDNiIiwiaWF0IjoxNjkwMzU5MzQwLCJuYmYiOjE2OTAzNTkzNDAsImV4cCI6MTY5MDQ0NTc0MCwiaXNzIjoiWmt5V3IiLCJhdWQiOiJaa3lXciJ9.1EKwmKib-YuNfzXXO0ggt3iUBx5_bgYdpo8nzBoGWTI';
};

// @function extend(dest: Object, src?: Object): Object
// Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
function extend(dest) {
  var i, j, len, src;

  for (j = 1, len = arguments.length; j < len; j++) {
    src = arguments[j];
    for (i in src) {
      dest[i] = src[i];
    }
  }
  return dest;
}

// 微服务 sys 系统管理-------------------------------------------------------------------------- start

// 初始化
export async function initApi() {
  return request(`${httpUrl.sysUrl}AbpUserConfiguration/GetAll`, {
    method: 'GET',
  });
}

// setCookie
export async function setCookieApi(params) {
  return request(`${httpUrl.sysUrl}api/AntiForgery/SetCookie`, {
    method: 'POST',
    headers: params
      ? {
          Authorization: 'Bearer ' + params,
        }
      : {},
  });
}

// 注册
export async function registerApi(params) {
  return request(`${httpUrl.sysUrl}api/TokenAuth/RegisterAuthenticate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

// 登录
export async function loginApi(params) {
  params.password = params.password
    ? CryptoJS.MD5(params.password).toString()
    : null;
  return request(`${httpUrl.sysUrl}api/TokenAuth/Authenticate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

// 账号_获取验证码
export async function getCodeApi(phoneNumber) {
  return request(
    `${httpUrl.sysApi}Account/SendPhoneCodeV1?phoneNumber=${phoneNumber}`,
    {
      method: 'GET',
    }
  );
}

// 账号_获取权限
export async function authorityApi(accessToken) {
  return request(`${httpUrl.sysApi}Session/GetCurrentLoginInformations`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// 账号_获取账号信息
export async function getAccessTokenApi(params) {
  return request(
    `${httpUrl.sysUrl}api/TokenAuth/AuthenticateExternal?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 角色_获取所有权限
export function getAllPermissionsApi(params) {
  return request(`${httpUrl.sysApi}Role/GetAllPermissions`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer `,
    },
  });
}

// 动态监测附件_列表
export async function dynamicFileListApi(params) {
  return request(
    `${httpUrl.sysApi}Attachment/GetInfos?FileSource=${
      params.type || 'ErosionMap&FileSource=StatisticsTable'
    }&${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 附件_列表
export async function annexListApi(params) {
  return request(
    `${httpUrl.sysApi}Attachment/GetFileSourceList?SourceType=${
      params?.sourceType || ''
    }`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${params?.accessToken || accessToken()}`,
      },
    }
  );
}

// 附件_删除
export async function annexDeleteApi(params) {
  return request(
    `${httpUrl.sysApi}File/Delete?FileId=${params.FileId}&Id=${
      params.Id || ''
    }`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 行政单位/社会单位_列表
export async function govCompanyListApi(params) {
  return request(
    `${httpUrl.sysApi}Department/GetAll?name=${params.name}&kind=${
      params.kind
    }&hasUser=${params.hasUser || false}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 字典类型_列表
export async function dictTypeListApi() {
  return request(
    `${httpUrl.sysApi}DictType/GetAll?skipCount=0&maxResultCount=1000`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 字典类型_编辑
export async function dictTypeEditApi(params) {
  return request(
    `${httpUrl.sysApi}DictType/${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 字典类型_删除
export async function dictTypeDeleteApi(id) {
  return request(`${httpUrl.sysApi}DictType/Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 字典类型_批量删除
export async function dictTypeDeleteMulApi(params) {
  return request(`${httpUrl.sysApi}DictType/DeleteBatch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params.id),
  });
}

// 字典_列表
export async function dictListApi(params) {
  return request(`${httpUrl.sysApi}DictTable/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 字典_编辑
export async function dictEditApi(params) {
  return request(
    `${httpUrl.sysApi}DictTable/${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 字典_删除
export async function dictDeleteApi(id) {
  return request(`${httpUrl.sysApi}DictTable/Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 字典_批量删除
export async function dictDeleteMulApi(params) {
  return request(`${httpUrl.sysApi}DictTable/DeleteBatch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params.id),
  });
}

// 行政区划_编辑
export async function areaEditApi(params) {
  return request(
    `${httpUrl.sysApi}DistrictCode/${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 行政区划_删除
export async function areaDeleteApi(id) {
  return request(`${httpUrl.sysApi}DistrictCode/Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 行政区划_批量删除
export async function areaDeleteMulApi(params) {
  return request(`${httpUrl.sysApi}DistrictCode/DeleteBatch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params.id),
  });
}

// 根据行政区划id获取边界
export async function DistrictCodeGetPolygonApi(districtId) {
  return request(
    `${httpUrl.sysApi}DistrictCode/GetPolygons?ids=${districtId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 根据筛选条件查询行政区划
export async function GetDistricts(params) {
  const filters = { MaxResultCount: 999, ...params };
  return request(
    `${httpUrl.sysApi}DistrictCode/GetAll?${stringify(filters, {
      arrayFormat: 'repeat',
    })}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 根据行政区划ids获取边界
export async function DistrictCodeGetPolygonByIdsApi(params) {
  return request(
    `${httpUrl.sysApi}DistrictCode/GetPolygons?${stringify(params, {
      arrayFormat: 'repeat',
    })}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 行政单位_树状列表
export async function govTreeApi(params) {
  return request(
    `${httpUrl.sysApi}GovDepartment/GetTree?isFilter=${
      params.isFilter || false
    }`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 行政单位_列表
export async function govListApi(params) {
  return request(`${httpUrl.sysApi}GovDepartment/GetAll?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 行政单位_编辑
export async function govEditApi(params) {
  return request(
    `${httpUrl.sysApi}GovDepartment/${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 行政单位_删除
export async function govDeleteApi(id) {
  return request(`${httpUrl.sysApi}GovDepartment/Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 行政单位_批量删除
export async function govDeleteMulApi(params) {
  return request(`${httpUrl.sysApi}GovDepartment/DeleteBatch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params.id),
  });
}

// 社会单位_列表
export async function companyListApi(params) {
  return request(
    `${httpUrl.sysApi}SocialDepartment/GetAll?skipCount=${
      params.skipCount
    }&maxResultCount=${params.maxResultCount}&Name=${params.Name || ''}${
      params.isBuild
        ? '&DepTypes=1'
        : '&DepTypes=2&DepTypes=3&DepTypes=4&DepTypes=5&DepTypes=6&DepTypes=7'
    }&IsGetProject=${Boolean(params.IsGetProject)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 社会单位_详情
export async function companyInfoApi(id) {
  return request(`${httpUrl.sysApi}SocialDepartment/Get?Id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 社会单位_编辑
export async function companyEditApi(params) {
  return request(
    `${httpUrl.sysApi}SocialDepartment/${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 社会单位_删除
export async function companyDeleteApi(id) {
  return request(`${httpUrl.sysApi}SocialDepartment/Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 社会单位_批量删除
export async function companyDeleteMulApi(params) {
  return request(`${httpUrl.sysApi}SocialDepartment/DeleteBatch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params.id),
  });
}

// 获取通知
export async function getNoticeApi(params) {
  return request(
    `${httpUrl.sysApi}Notification/GetNotices?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 意见反馈录入
export async function feedbackApi(params) {
  return request(`${httpUrl.sysApi}Feedback/Create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 意见反馈列表
export async function feedbackListApi(params) {
  return request(`${httpUrl.sysApi}Feedback/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 流程服务 —— 获取我的待办列表
export async function getUserTodoListApi(params) {
  return request(
    `${httpUrl.workFlowInstanceUrl}/GetUserTodoList?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 流程服务 —— 获取我的待办详情
export async function getProcessApi(params) {
  return request(
    `${httpUrl.workFlowInstanceUrl}/GetProcess?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 流程服务 —— 流程流转
export async function transitionProcessApi(params) {
  return request(`${httpUrl.workFlowInstanceUrl}/ProcessTransitionFlow`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}
// 微服务 sys 系统管理-------------------------------------------------------------------------- end

// 微服务 rsimage AI遥感智能-------------------------------------------------------------------------- start

// AI_影像列表
export async function imageListApi(params) {
  return request(`${httpUrl.rsimageApi}ImageServices/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// AI_任务批次列表
export async function taskBatchListApi(params) {
  return request(`${httpUrl.rsimageApi}AITask/GetAITaskBatchs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// AI_任务批次新建编辑
export async function taskBatchEditApi(params) {
  return request(
    `${httpUrl.rsimageApi}AITask/CreateAITaskBatch?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// AI_任务列表
export async function taskListApi(params) {
  return request(`${httpUrl.rsimageApi}AITask/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// AI_任务新建编辑
export async function taskEditApi(params) {
  return request(
    `${httpUrl.rsimageApi}AITask/${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// AI_任务执行
export async function taskSubmitApi(params) {
  return request(`${httpUrl.rsimageApi}AITask/SubmitRun?${stringify(params)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// AI_任务导出
export async function taskExportApi(params) {
  return request(`${httpUrl.rsimageApi}AITask/Export?${stringify(params)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// AI_任务删除
export async function taskDeleteApi(params) {
  return request(`${httpUrl.rsimageApi}AITask/Delete?${stringify(params)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 推送解译平台
export async function pushInterpretApi(params) {
  return request(
    `${httpUrl.rsimageApi}AITask/PushTaskToInter?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 协同解译_任务列表
export async function interpretTaskListApi(params) {
  return request(`${httpUrl.rsimageApi}InterTask/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 协同解译_任务详情
export async function interpretTaskInfoApi(id) {
  return request(`${httpUrl.rsimageApi}InterTask/Get?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 协同解译_任务编辑
export async function interpretTaskEditApi(params) {
  return request(
    `${httpUrl.rsimageApi}InterTask/${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 协同解译_任务删除
export async function interpretTaskDeleteApi(params) {
  return request(`${httpUrl.rsimageApi}InterTask/DeleteBatch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 协同解译_任务导出
export async function interpretTaskExportApi(params) {
  return request(
    `${httpUrl.rsimageApi}InterTask/ExportShp?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 协同解译_图斑编辑
export async function interpretSpotEditApi(params) {
  return request(
    `${httpUrl.rsimageApi}InterSpot/${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 协同解译_图斑列表
export async function interpretSpotListApi(params) {
  return request(
    `${httpUrl.rsimageApi}InterSpot/GetSpot?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 协同解译_图斑列表
export async function interpretSpotListWithGeomApi(params) {
  let _params = {
    maxResultCount: 9999999,
  };
  extend(_params, params);
  return request(
    `${httpUrl.rsimageApi}InterSpot/GetSpot?${stringify(_params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 协同解译_图斑详情
export async function interpretSpotInfoApi(id) {
  return request(`${httpUrl.rsimageApi}InterSpot/Get?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 协同解译_图斑审核
export async function interpretSpotProcessApi(params) {
  return request(
    `${httpUrl.rsimageApi}InterSpot/VerifyBatch?isPass=${params.isPass}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params.ids),
    }
  );
}

// 协同解译_图斑删除
export async function interpretSpotDeleteApi(params) {
  return request(`${httpUrl.rsimageApi}InterSpot/DeleteBatch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 协同解译_格网导入
export async function interpretGridImportApi(params) {
  return request(`${httpUrl.rsimageApi}InterGrid/BatchCreate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 协同解译_格网列表
export async function interpretGridListApi(params) {
  return request(`${httpUrl.rsimageApi}InterGrid/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 协同解译_格网完成
export async function interpretGridFinishApi(params) {
  return request(`${httpUrl.rsimageApi}InterGrid/FinishBatch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 协同解译_格网审核
export async function interpretGridProcessApi(params) {
  return request(
    `${httpUrl.rsimageApi}InterGrid/VerifyBatch?isPass=${params.isPass}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params.ids),
    }
  );
}

// 协同解译_格网删除
export async function interpretGridDeleteApi(params) {
  return request(`${httpUrl.rsimageApi}InterGrid/DeleteBatch`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 微服务 rsimage AI遥感智能-------------------------------------------------------------------------- end

// 微服务 stbc 水土保持-------------------------------------------------------------------------- start

// 根据地图当前范围获取对应历史影像数据接口
export async function getInfoByExtent(params) {
  return request(
    `https://www.stbcjg.cn/BasemapService/rest/image/latest/getInfoByExtent?${stringify(
      params
    )}`,
    {
      method: 'GET',
      dataType: 'json',
      mode: 'cors',
      headers: {},
    }
  );
}

// 点查地图服务后台接口
export async function queryWFSLayer(params) {
  return request(`${httpUrl.queryWFSLayer}`, {
    method: 'POST',
    dataType: 'json',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify({
      method: 'get',
      url: params.geojsonUrl,
    }),
  });
}

// 项目_列表
export async function projectListApi(params) {
  return request(`${httpUrl.projectUrl}GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 项目_详情
export async function projectInfoApi(id) {
  return request(`${httpUrl.projectUrl}GetInfo?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 项目_所有红线图形
export async function projectGetGeomApi(params) {
  return request(`${httpUrl.redLineUrl}GetGeom`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 项目_删除
export async function projectDeleteApi(id) {
  return request(`${httpUrl.projectUrl}Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 项目_位置
export async function projectPositionApi(id) {
  return request(`${httpUrl.projectUrl}GetPoint?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 项目_流域机构列表
export async function basinListApi() {
  return request(`${httpUrl.projectUrl}GetRiverBasinOU`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 项目_获取项目查处信息
export async function getInvestigateApi(params) {
  return request(`${httpUrl.projectUrl}GetInvestigate?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 项目_设置项目查处信息
export async function setInvestigateApi(params) {
  return request(`${httpUrl.projectUrl}SetInvestigate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 项目_保存二次下发
export async function againEditApi(params) {
  return request(`${httpUrl.againUrl}Update`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 二次下发_详情
export async function againInfoApi(params) {
  return request(`${httpUrl.againUrl}Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 项目_合并
export async function projectMergeApi(params) {
  return request(`${httpUrl.projectUrl}Merge?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 项目_根据图斑获取查处信息
export async function getInvestigateBySpotIdApi(params) {
  return request(
    `${httpUrl.projectUrl}GetInvestigateBySpotId?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 倾斜模型_编辑
export async function tiltEditApi(params) {
  return request(
    `${httpUrl.projectUrl}${params.id ? 'UpdateTiltModel' : 'CreateTiltModel'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 倾斜模型_删除
export async function tiltDeleteApi(params) {
  return request(`${httpUrl.projectUrl}DeleteTiltModel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 方案_列表
export async function planListApi(params) {
  return request(`${httpUrl.planUrl}GetAll`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 方案_核查列表
export async function planCheckListApi(params) {
  return request(`${httpUrl.planUrl}GetAll4PlanInspect`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 项目编辑
export async function projectEditApi(params) {
  return request(`${httpUrl.projectUrl}${params.id ? 'Update' : 'Create'}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 项目编辑_行政审批
export async function projectEditPlanApi(params) {
  return request(
    `${httpUrl.planUrl}${params.id ? 'UpdateProject' : 'CreateProject'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 方案_项目基本信息编辑
export async function projectBaseEditApi(params) {
  return request(
    `${httpUrl.planUrl}${
      params.id ? 'UpdateProjectBase' : 'CreateProjectBase'
    }`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 方案_编辑
export async function planEditApi(params) {
  return request(
    `${httpUrl.planUrl}${
      params.approvalStatus === '待提交' || !params.approvalStatus
        ? 'CreateProjectPlan'
        : 'UpdateProjectPlan'
    }`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 方案编辑_区域监管
export async function planRegionEditApi(params) {
  return request(
    `${httpUrl.planRegionEditUrl}${params.id ? 'UpdatePlan' : 'CreatePlan'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 建设情况_编辑
export async function buildInfoEditApi(params) {
  return request(`${httpUrl.buildInfoEditUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 设计/施工单位_编辑
export async function depsEditApi(params) {
  return request(`${httpUrl.depsEditUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 方案_查看初始密码
export async function planLookPasswordApi(id) {
  return request(`${httpUrl.planUrl}GetInitRandomPwd?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 方案_提交
export async function planSubmitApi(id) {
  return request(`${httpUrl.planUrl}PlanSubmit?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 方案_撤回提交
export async function planCancelSubmitApi(id) {
  return request(`${httpUrl.planUrl}PlanCancelSubmit?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 方案_审批
export async function planApprovalApi(params) {
  return request(
    `${httpUrl.planUrl}SetPlanApproval?id=${params.id}&isPass=${params.isPass}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 方案_变更
export async function planChangeApi(params) {
  return request(`${httpUrl.planUrl}ArchiveProjectPlan`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 方案_变更撤销
export async function planChangeCancelApi(params) {
  return request(
    `${httpUrl.planUrl}ArchiveRollbackProjectPlan?projectId=${params.projectId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 方案_核查编辑
export async function planCheckEditApi(params) {
  return request(
    `${httpUrl.planUrl}${
      params.id ? 'UpdatePlanInspect' : 'CreatePlanInspect'
    }`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 方案_核查删除
export async function planCheckDeleteApi(id) {
  return request(`${httpUrl.planUrl}DeletePlanInspect?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 红线_列表
export async function redLineListApi(params) {
  return request(`${httpUrl.redLineUrl}GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 红线_编辑
export async function redLineEditApi(params) {
  return request(`${httpUrl.redLineUrl}${params.id ? 'Update' : 'Create'}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 红线_删除
export async function redLineDeleteApi(id) {
  return request(`${httpUrl.redLineUrl}Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 防治分区_列表
export async function zoneListApi(params) {
  return request(`${httpUrl.zoneUrl}GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 防治分区_编辑
export async function zoneEditApi(params) {
  return request(`${httpUrl.zoneUrl}${params.id ? 'Update' : 'Create'}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 防治分区_删除
export async function zoneDeleteApi(id) {
  return request(`${httpUrl.zoneUrl}Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 取弃土场_列表
export async function spoilListApi(params) {
  return request(`${httpUrl.spoilUrl}GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 取弃土场_编辑
export async function spoilEditApi(params) {
  return request(`${httpUrl.spoilUrl}${params.id ? 'Update' : 'Create'}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 取弃土场_删除
export async function spoilDeleteApi(id) {
  return request(`${httpUrl.spoilUrl}Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 防治措施_新增
export async function preventionCreateApi(params) {
  return request(`${httpUrl.preventionUrl}${params.id ? 'Update' : 'Create'}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 防治措施_删除
export async function preventionDeleteApi(id) {
  return request(`${httpUrl.preventionUrl}Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 方案评审_编辑
export async function reviewEditApi(params) {
  return request(
    `${httpUrl.reviewUrl}${
      params.id ? 'UpdateTechReview' : 'CreateTechReview'
    }`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 批复_编辑
export async function replyEditApi(params) {
  return request(
    `${httpUrl.replyUrl}${
      params.id ? 'UpdatePlanApproval' : 'CreatePlanApproval'
    }`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 批复_修改方案批复信息_区域监管
export async function replyRegSupEditApi(params) {
  return request(`${httpUrl.replyUrl}UpdatePlanApprovalRegSup`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 监督检查_列表
export async function inspectListApi(params) {
  return request(httpUrl.inspectListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 监督检查_编辑
export async function inspectEditApi(params) {
  return request(
    `${httpUrl.inspectEditUrl}${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 监督检查_详情
export async function inspectInfoApi(id) {
  return request(`${httpUrl.inspectInfoUrl}?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 监督检查_删除
export async function inspectDeleteApi(id) {
  return request(`${httpUrl.inspectDeleteUrl}?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 监督检查_配置
export async function inspectConfigApi(id) {
  return request(`${httpUrl.inspectConfigUrl}?id=${id || ''}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 监督检查_打印
export async function inspectPrintApi(id) {
  return request(`${httpUrl.inspectPrintUrl}?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 验收报备_备案记录列表
export async function acceptanceDisposeListApi(params) {
  return request(`${httpUrl.acceptanceDisposeListUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 验收报备_项目列表
export async function acceptanceListApi(params) {
  return request(httpUrl.acceptanceListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 验收报备_编辑
export async function acceptanceEditApi(params) {
  return request(
    `${httpUrl.acceptanceEditUrl}${
      params.id ? 'UpdateAcceptance' : 'CreateAcceptance'
    }`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 验收报备_删除
export async function acceptanceDeleteApi(id) {
  return request(`${httpUrl.acceptanceEditUrl}Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 验收报备_方案提交
export async function acceptanceSubmitApi(params) {
  return request(`${httpUrl.acceptanceSubmitUrl}?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 验收报备_详情
export async function acceptanceInfoApi(params) {
  return request(`${httpUrl.acceptanceInfoUrl}?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 验收报备_设置受理状态
export async function acceptanceSetStatusApi(params) {
  return request(`${httpUrl.acceptanceSetStatusUrl}?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 验收报备_获取验收期项目信息和方案中对应的信息
export async function acceptanceProjectAnPlanApi(params) {
  return request(`${httpUrl.acceptanceProjectAnPlanUrl}?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 验收核查_核查记录列表
export async function acceptanceCheckListApi(params) {
  return request(`${httpUrl.acceptanceCheckListUrl}?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 验收核查_编辑
export async function acceptanceCheckEditApi(params) {
  return request(
    `${httpUrl.acceptanceCheckEditUrl}${
      params.id || params.id === 0
        ? 'UpdateAcceptanceCheck'
        : 'CreateAcceptanceCheck'
    }`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 验收核查_详情
export async function acceptanceCheckInfoApi(params) {
  return request(`${httpUrl.acceptanceCheckInfoUrl}?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 验收核查_删除
export async function acceptanceCheckDeleteApi(id) {
  return request(`${httpUrl.acceptanceCheckEditUrl}Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 重点部位_编辑
export async function placeEditApi(params) {
  return request(
    `${httpUrl.projectUrl}${
      params.id ? 'UpdateFocusPlace' : 'CreateFocusPlace'
    }`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 重点部位_删除
export async function placeDeleteApi(params) {
  return request(`${httpUrl.projectUrl}DeleteFocusPlace`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 全景图_列表
export async function panoramaListApi(params) {
  return request(`${httpUrl.panoramaEdit}GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 全景图_详情
export async function panoramaInfoApi(id) {
  return request(`${httpUrl.panoramaEdit}Get?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 全景图_编辑
export async function panoramaEditApi(params) {
  return request(`${httpUrl.panoramaEdit}${params.id ? 'Update' : 'Create'}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 全景图_删除
export async function panoramaDeleteApi(id) {
  return request(`${httpUrl.panoramaEdit}Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 项目监测--------------------------------------------------------------

// 监测_待监测
export async function monitorListApi(params) {
  return request(`${httpUrl.stbcApi}ProjectMonitor/ToMoProjectList`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 监测_监测中
export async function monitoringListApi(params) {
  return request(`${httpUrl.stbcApi}ProjectMonitor/GetAll`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 监测_报告未提交
export async function monitorOverdueListApi(params) {
  return request(`${httpUrl.stbcApi}ProjectMonitor/GetOverdueAll`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 监测_实施方案编辑
export async function monitorImplementEditApi(params) {
  return request(
    `${httpUrl.stbcApi}ProjectMonitor/${
      params.id ? 'UpdateImpleInfo' : 'CreateImpleInfo'
    }`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 监测_总结报告编辑
export async function monitorSummaryEditApi(params) {
  return request(`${httpUrl.stbcApi}ProjectMonitor/UpdateSummaryInfo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 监测_详情
export async function monitorInfoApi(params) {
  return request(`${httpUrl.stbcApi}ProjectMonitor/Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 季度监测_编辑
export async function monitorQuarterEditApi(params) {
  return request(
    `${httpUrl.monitorQuarterUrl}${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 季度监测_详情
export async function monitorQuarterInfoApi(id) {
  return request(`${httpUrl.monitorQuarterUrl}Get?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 季度监测_删除
export async function monitorQuarterDeleteApi(id) {
  return request(`${httpUrl.monitorQuarterUrl}Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 治理项目_列表
export async function governProjectListApi(params) {
  return request(httpUrl.governProjectListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 治理项目_编辑
export async function governProjectEditApi(params) {
  return request(
    `${httpUrl.governProjectUrl}${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 治理项目_详情
export async function governProjectInfoApi(id) {
  return request(`${httpUrl.governProjectInfoUrl}?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 治理项目_删除
export async function governProjectDeleteApi(id) {
  return request(`${httpUrl.governProjectDeleteUrl}?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 治理图斑_列表
export async function governSpotListApi(params) {
  return request(httpUrl.governSpotListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 治理图斑_编辑
export async function governSpotEditApi(params) {
  return request(
    `${httpUrl.governSpotEditUrl}${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 治理图斑_详情
export async function governSpotInfoApi(id) {
  return request(`${httpUrl.governSpotInfoUrl}?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 治理图斑_删除
export async function governSpotDeleteApi(id) {
  return request(`${httpUrl.governSpotDeleteUrl}?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 治理图斑_提交
export async function governSpotSubmitApi(id) {
  return request(`${httpUrl.governSpotSubmitUrl}?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 治理图斑_撤回提交
export async function governSpotCancelSubmitApi(id) {
  return request(`${httpUrl.governSpotCancelSubmitUrl}?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 治理图斑_审批
export async function governSpotApprovalApi(params) {
  return request(
    `${httpUrl.governSpotApprovalUrl}?id=${params.id}&isPass=${params.isPass}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 重点工程点_列表
export async function governEnginListApi(params) {
  return request(httpUrl.governEnginListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 重点工程点_编辑
export async function governEnginEditApi(params) {
  return request(
    `${httpUrl.governEnginEditUrl}${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 重点工程点_详情
export async function governEnginInfoApi(id) {
  return request(`${httpUrl.governEnginInfoUrl}?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 重点工程点_删除
export async function governEnginDeleteApi(id) {
  return request(`${httpUrl.governEnginDeleteUrl}?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 重点工程点_提交
export async function governEnginSubmitApi(id) {
  return request(`${httpUrl.governEnginSubmitUrl}?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 重点工程点_撤回提交
export async function governEnginCancelSubmitApi(id) {
  return request(`${httpUrl.governEnginCancelSubmitUrl}?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 重点工程点_审批
export async function governEnginApprovalApi(params) {
  return request(
    `${httpUrl.governEnginApprovalUrl}?id=${params.id}&isPass=${params.isPass}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 动态监测图斑_列表
export async function dynamicSpotListApi(params) {
  return request(`${httpUrl.dynamicSpotUrl}GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 动态监测图斑_编辑
export async function dynamicSpotEditApi(params) {
  return request(
    `${httpUrl.dynamicSpotUrl}${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 动态监测图斑_分析
export async function dynamicSpotAnalyseApi(params) {
  return request(
    `${httpUrl.dynamicSpotUrl}ErosionAnalyze?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 动态监测图斑_清空
export async function dynamicSpotClearApi() {
  return request(`${httpUrl.dynamicSpotUrl}Clear`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 图斑_列表
export async function spotListApi(params) {
  return request(httpUrl.spotListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 图斑_遥感监管全部列表
export async function spotRegionalAllListApi(params) {
  return request(httpUrl.spotRegionalAllListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 图斑_信息
export async function spotInfoApi(id) {
  return request(`${httpUrl.spotInfoUrl}?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 图斑__根据项目获取扰动查处列表
export async function spotGetSpotInvestApi(id) {
  return request(`${httpUrl.spotGetSpotInvestUrl}?projectId=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 图斑_历史
export async function spotHistoryApi(id) {
  return request(`${httpUrl.spotEditUrl}GetHistorySpots?spotId=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 图斑_编辑
export async function spotEditApi(params) {
  return request(`${httpUrl.spotEditUrl}${params.id ? 'Update' : 'Create'}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 图斑_恢复
export async function spotRecoveryApi(params) {
  return request(`${httpUrl.stbcApi}Spot/RollBackGeom?id=${params.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 图斑_删除
export async function spotDeleteApi(params) {
  return request(`${httpUrl.spotDeleteUrl}?id=${params.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 图斑_解译期次
export async function spotTermApi() {
  return request(httpUrl.spotTermUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 图斑_分割
export async function spotDivideApi(params) {
  return request(`${httpUrl.spotDivideUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 图斑_区域调整申请
export async function createSpotAdjustmentApplyApi(params) {
  return request(`${httpUrl.spotAdjustmentApplyUrl}/Create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 图斑_获取区域调整申请详情
export async function getSpotAdjustmentDetailApi(params) {
  return request(`${httpUrl.spotAdjustmentApplyUrl}/Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 图斑_创建图斑撤销通过流程
export async function createSpotCancelApplyApi(params) {
  return request(`${httpUrl.spotCancelApplyUrl}/Create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 图斑_获取图斑撤销通过流程详情
export async function getSpotCancelApplyDetailApi(params) {
  return request(`${httpUrl.spotCancelApplyUrl}/Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 复核计划_列表
export async function reviewPlanListApi(params) {
  return request(httpUrl.reviewPlanListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 复核计划_关联图斑列表
export async function reviewPlanSpotListApi(params) {
  return request(`${httpUrl.reviewPlanSpotListUrl}?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 复核计划_新增关联图斑列表
export async function reviewPlanSetSpotApi(params) {
  return request(`${httpUrl.reviewPlanSetSpotUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 复核计划_移除关联图斑列表
export async function reviewPlanRemoveSpotApi(params) {
  return request(`${httpUrl.reviewPlanRemoveSpotUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 复核计划_未关联图斑列表
export async function reviewPlanNoTagSpotListApi(params) {
  return request(`${httpUrl.reviewPlanNoTagSpotListUrl}?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 复核计划_信息
export async function reviewPlanInfoApi(params) {
  return request(`${httpUrl.reviewPlanInfoUrl}?id=${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 复核计划_编辑
export async function reviewPlanEditApi(params) {
  return request(
    `${httpUrl.reviewPlanEditUrl}${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 复核计划_任务记录列表
export async function reviewPlanTaskRecordApi(params) {
  return request(`${httpUrl.reviewPlanTaskRecordUrl}?${stringify(params)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 复核计划_获取任务下达的单位
export async function reviewPlanTaskReleaseGovDepApi(params) {
  return request(
    `${httpUrl.reviewPlanTaskReleaseGovDepUrl}?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 复核计划_任务下达
export async function reviewPlanTaskReleaseApi(params) {
  return request(`${httpUrl.reviewPlanTaskReleaseUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 检查计划_列表
export async function checkPlanListApi(params) {
  return request(httpUrl.checkPlanListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 检查计划_关联项目列表
export async function checkPlanProjectListApi(params) {
  return request(httpUrl.checkPlanProjectListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 检查计划_新增关联项目列表
export async function checkPlanSetProjectApi(params) {
  return request(`${httpUrl.checkPlanSetProjectUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 检查计划_移除关联项目列表
export async function checkPlanRemoveProjectApi(params) {
  return request(httpUrl.checkPlanRemoveProjectUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 检查计划_未关联项目列表
export async function checkPlanNoTagProjectListApi(params) {
  return request(httpUrl.checkPlanNoTagProjectListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 检查计划_清理无用查处记录
export async function checkPlanClearExamineApi(CheckPlanId) {
  return request(
    `${httpUrl.checkPlanClearExamineUrl}?CheckPlanId=${CheckPlanId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 检查计划_信息
export async function checkPlanInfoApi(params) {
  return request(`${httpUrl.checkPlanInfoUrl}?id=${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 检查计划_编辑
export async function checkPlanEditApi(params) {
  return request(
    `${httpUrl.checkPlanEditUrl}${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 视频监控_列表
export async function videoListApi(params) {
  return request(httpUrl.videoListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 视频监控_信息
export async function videoInfoApi(params) {
  return request(`${httpUrl.videoInfoUrl}?id=${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 视频监控_编辑
export async function videoEditApi(params) {
  return request(`${httpUrl.videoEditUrl}${params.id ? 'Update' : 'Create'}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 聚合点
export async function makerClusterApi(params) {
  // console.log('聚合点接口参数:',params);
  return request(
    `${httpUrl.makerClusterUrl}/${params.tableName}?lonmin=${params.lonmin}&lonmax=${params.lonmax}&latmin=${params.latmin}&latmax=${params.latmax}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 首页统计工作进展
export async function statisticWorkApi(params) {
  return request(`${httpUrl.statisticUrl}WorkProgressStatistics`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 首页统计遥感监管
export async function statisticSuperviseApi(params) {
  return request(
    `${httpUrl.statisticUrl}InvestiSimpleStatistic?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

//统计接口
//审批一张图统计—地图饼图数据
export async function spyztStatisticOnMapApi(params) {
  return request(`${httpUrl.spyztStatisticOnMapUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

//审批一张图统计-某行政区数据
export async function spyztStatisticByDistrictApi(params) {
  return request(
    `${httpUrl.spyztStatisticByDistrictUrl}?DistrictCode=${params.DistrictCode}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

//监管一张图统计—地图饼图数据
export async function jgyztStatisticOnMapApi(params) {
  return request(`${httpUrl.jgyztStatisticOnMapUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

//监管一张图统计-某行政区数据
export async function jgyztStatisticByDistrictApi(params) {
  return request(
    `${httpUrl.jgyztStatisticByDistrictUrl}?DistrictCode=${params.DistrictCode}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

//违规一张图统计—地图饼图数据
export async function wgyztStatisticOnMapApi(params) {
  return request(`${httpUrl.wgyztStatisticOnMapUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

//违规一张图统计-某行政区数据
export async function wgyztStatisticByDistrictApi(params) {
  return request(
    `${httpUrl.wgyztStatisticByDistrictUrl}?DistrictCode=${params.DistrictCode}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

//治理图斑一张图统计—地图饼图数据
export async function zlyztStatisticOnMapApi(params) {
  return request(`${httpUrl.zlyztStatisticOnMapUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

//治理图斑一张图统计-某行政区数据
export async function zlyztStatisticByDistrictApi(params) {
  return request(
    `${httpUrl.zlyztStatisticByDistrictUrl}?DistrictCode=${params.DistrictCode}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

//区域监管统计—地图饼图数据
export async function qyjgStatisticOnMapApi(params) {
  return request(
    `${httpUrl.qyjgStatisticOnMapUrl}?ReviewPlanId=${params.ReviewPlanId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

//区域监管统计-某行政区数据
export async function qyjgStatisticByDistrictApi(params) {
  return request(
    `${httpUrl.qyjgStatisticByDistrictUrl}?ReviewPlanId=${params.ReviewPlanId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

//区域监管统计-获取广东省所有复核计划
export async function qyjgGetAllReviewPlanApi() {
  return request(`${httpUrl.qyjgGetAllReviewPlanUrl}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 统计分析_图斑核查与项目认定查处
export async function statisticExamineApi(reviewPlanId) {
  return request(
    `${httpUrl.statisticExamineUrl}?reviewPlanId=${reviewPlanId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 统计分析_二次下发
export async function statisticAgainApi() {
  return request(`${httpUrl.statisticUrl}SecondReleaseInvestiStatistic`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 审核
export async function approveApi(params) {
  return request(`${httpUrl.stbcApi}${params.url}?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 导出
export async function exportApi(params) {
  return request(`${httpUrl.stbcApi}${params._url}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// geoserver_洞穿搜索
export async function geoserverPierceApi(params) {
  return request(
    `${httpUrl.geoserverPierceUrl}?${stringify(params, {
      arrayFormat: 'repeat',
    })}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 区域监管_待办
export async function regionWorkApi(params) {
  return request(`${httpUrl.spotEditUrl}RegionalToDoList`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 区域监管_待完成
export async function regionCloseApi(params) {
  return request(`${httpUrl.spotEditUrl}RegionalToClose`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 二次下发
export async function againCloseApi(params) {
  return request(`${httpUrl.againUrl}GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 非本辖区
export async function regionNonApi(params) {
  return request(`${httpUrl.spotEditUrl}SpotNoJurisdTaskList`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 任务_列表
export async function workTaskListApi(params) {
  return request(`${httpUrl.workTaskUrl}GetToDoList?${stringify(params)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 任务_编辑
export async function workTaskEditApi(params) {
  return request(`${httpUrl.workTaskUrl}${params.id ? 'Update' : 'Create'}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 任务_详情
export async function workTaskInfoApi(params) {
  return request(`${httpUrl.workTaskUrl}Get?${stringify(params)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 任务_删除
export async function workTaskDeleteApi(id) {
  return request(`${httpUrl.workTaskUrl}Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 任务_下发单位列表
export async function workTaskIssueGovListApi(params) {
  return request(
    `${httpUrl.workTaskUrl}GetTaskIssueGovDep?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 任务_下发
export async function workTaskIssueApi(params) {
  return request(`${httpUrl.workTaskUrl}IssueTaskRecord`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 任务_下发记录列表
export async function workTaskIssueListApi(params) {
  return request(
    `${httpUrl.workTaskUrl}GetTaskRecordList?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 任务_下发记录详情
export async function workTaskIssueInfoApi(params) {
  return request(
    `${httpUrl.workTaskUrl}GetTaskRecordInfo?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 任务_下发记录编辑
export async function workTaskIssueEditApi(params) {
  return request(
    `${httpUrl.workTaskUrl}SetTaskRecordComp?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 任务_设置完成
export async function workTaskSetCompleteApi(params) {
  return request(`${httpUrl.workTaskUrl}SetTaskComp?${stringify(params)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 任务_取消完成
export async function workTaskCancelCompleteApi(params) {
  return request(`${httpUrl.workTaskUrl}CancelTaskComp?${stringify(params)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 整改抽检_列表
export async function sampleListApi(params) {
  return request(`${httpUrl.sampleUrl}GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 整改抽检_详情
export async function sampleInfoApi(params) {
  return request(`${httpUrl.sampleUrl}Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 整改抽检_编辑
export async function sampleEditApi(params) {
  return request(`${httpUrl.sampleUrl}${params.id ? 'Update' : 'Create'}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 整改抽检_抽检项目列表
export async function sampleExtractListApi(params) {
  return request(`${httpUrl.sampleUrl}GetInvesList`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 整改抽检_抽检项目
export async function sampleExtractAddApi(params) {
  return request(`${httpUrl.sampleUrl}AddInvesSampl`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 整改抽检_项目下发
export async function sampleIssueApi(params) {
  return request(`${httpUrl.sampleUrl}SamplIssue`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 检查项目是否存在
export async function checkProjectApi(params) {
  return request(`${httpUrl.planUrl}VaildProject?${stringify(params)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 方案审批_校验必填项
export async function setProjectValidPassedApi(id) {
  return request(`${httpUrl.planUrl}SetProjectValidPassed?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 法律法规模块 --- 获取列表
export async function getAllLawListApi(params) {
  return request(`${httpUrl.lawUrl}GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 法律法规模块 --- 新增法律法规
export async function createLawApi(params) {
  return request(`${httpUrl.lawUrl}Create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 法律法规模块 --- 更新法律法规
export async function updateLawApi(params) {
  return request(`${httpUrl.lawUrl}Update`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 法律法规模块 --- 删除法律法规
export async function lawDeleteApi(id) {
  return request(`${httpUrl.lawUrl}Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 法律法规模块 --- 获取法律法规详情
export async function getLawDetailApi(id) {
  return request(`${httpUrl.lawUrl}Get?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 预警项目_列表
export async function rainListApi(params) {
  return request(`${httpUrl.rainUrl}GetWarnProjectList`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 预警项目（带预警短信记录）_列表
export async function rainListWithRecordsApi(params) {
  return request(`${httpUrl.rainUrl}GetWarnProjectListWithSendRecord`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 其他项目_列表
export async function rainNoListApi(params) {
  return request(`${httpUrl.rainUrl}GetOtherProjectList`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 纳入预警
export async function rainAddApi(params) {
  return request(`${httpUrl.rainUrl}CreateWarnProject`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 移除预警
export async function rainDeleteApi(params) {
  return request(`${httpUrl.rainUrl}RemoveWarnProject`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 预警历史
export async function rainHistoryApi(params) {
  return request(
    `${httpUrl.rainUrl}GetWarnProjectDetail?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 编辑联系信息
export async function phoneEditApi(params) {
  return request(`${httpUrl.rainUrl}UpdateContactInfo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 发送即时短信
export async function sendMessageApi(params) {
  return request(`${httpUrl.rainUrl}ExcuteWarnWork?${stringify(params)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 动态监测
export async function publicMonitorApi(params) {
  return request(
    `${httpUrl.stbcApi}SoilErosion/StbcRateStatistics?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 水土流失治理-治理面积
export async function publicGovernApi(params) {
  return request(
    `${httpUrl.stbcApi}GovernSpot/GetGovernSpotArea?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 水土流失治理_重点工程
export async function publicGovernEngineerApi(params) {
  return request(
    `${httpUrl.stbcApi}GovernProject/GetAll?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 整改抽检-统计分析
export async function sampleStatisticApi(params) {
  return request(`${httpUrl.stbcApi}InvestigationSampl/Statistic`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 生产建设项目_方案审批
export async function planApprovalStaApi(params) {
  return request(
    `${httpUrl.stbcApi}MainStatistic/Statistic1?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 生产建设项目_方案核查
export async function planCheckStaApi(params) {
  return request(
    `${httpUrl.stbcApi}MainStatistic/Statistic2?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 生产建设项目_监管情况
export async function projectSuperviseApi(params) {
  return request(
    `${httpUrl.stbcApi}MainStatistic/Statistic3?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 生产建设项目_验收报备
export async function acceptanceStaApi(params) {
  return request(
    `${httpUrl.stbcApi}MainStatistic/Statistic4?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 生产建设项目_验收核查
export async function acceptanceCheckStaApi(params) {
  return request(
    `${httpUrl.stbcApi}MainStatistic/Statistic5?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 生产建设项目_核认查改
export async function regionSuperviseApi(params) {
  return request(
    `${httpUrl.stbcApi}MainStatistic/Statistic6?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 地图上单个图斑：根据spotIds获取图斑编码、项目、是否复核、图形
export async function spotGetGeomApi(params) {
  return request(`${httpUrl.stbcApi}Spot/GetGeom`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 生态清洁小流域_列表
export async function smallWaterListApi(params) {
  return request(`${httpUrl.stbcApi}SmallWatersh/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 生态清洁小流域_详情
export async function smallWaterInfoApi(id) {
  return request(`${httpUrl.stbcApi}SmallWatersh/Get?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 生态清洁小流域_编辑
export async function smallWaterEditApi(params) {
  return request(
    `${httpUrl.stbcApi}SmallWatersh/${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 生态清洁小流域_删除
export async function smallWaterDeleteApi(id) {
  return request(`${httpUrl.stbcApi}SmallWatersh/Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 生态清洁小流域_其他项目_编辑
export async function smallWaterProjectEditApi(params) {
  return request(
    `${httpUrl.stbcApi}SmallWatersh/${
      params.id ? 'UpdateSmallWatershOtherProject' : 'CreateOtherProject'
    }`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 生态清洁小流域_其他项目_删除
export async function smallWaterProjectDeleteApi(id) {
  return request(
    `${httpUrl.stbcApi}SmallWatersh/DeleteSmallWatershOtherProject?id=${id}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 生态清洁小流域_措施矢量_删除
export async function smallWaterMeasureDeleteApi(params) {
  return request(
    `${httpUrl.stbcApi}SmallWatersh/${params.url}?id=${params.id}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 补偿费列表
export async function payListApi(_params) {
  const { listType, ...params } = _params;
  return request(
    `${httpUrl.stbcApi}ProjectCharge/GetToChargeProject?${stringify(
      listType ? _params : params
    )}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 补偿费详情
export async function payInfoApi(id) {
  return request(`${httpUrl.stbcApi}ProjectCharge/Get?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 补偿费新建编辑
export async function payEditApi(params) {
  return request(
    `${httpUrl.stbcApi}ProjectCharge/${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 缴费记录详情
export async function payRecordInfoApi(id) {
  return request(`${httpUrl.stbcApi}PayCompensation/Get?id=${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 缴费记录新建编辑
export async function payRecordEditApi(params) {
  return request(
    `${httpUrl.stbcApi}PayCompensation/${params.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 缴费记录删除
export async function payRecordDeleteApi(id) {
  return request(`${httpUrl.stbcApi}PayCompensation/Delete?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 项目认定查处数据
export async function projectIdentifyApi(params) {
  return request(
    `${httpUrl.stbcApi}Statistic/QyyztStatisticProject?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

// 图斑复核数据
export async function spotReviewApi(params) {
  return request(
    `${httpUrl.stbcApi}Statistic/QyyztStatisticSpot?${stringify(params)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
  );
}

//日志服务 --- 列表
export async function getAuditLogListApi(params) {
  return request(`${httpUrl.auditLogUrl}GetAll?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

//日志服务 --- 详情
export async function getAuditLogDetailApi(params) {
  return request(`${httpUrl.auditLogUrl}Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 用户_修改密码
export async function changePasswordApi(params) {
  params.currentPassword = params.currentPassword
    ? CryptoJS.MD5(params.currentPassword).toString()
    : null;
  return request(httpUrl.changePasswordUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken()}`,
    },
    body: JSON.stringify(params),
  });
}

// 用户_列表
export async function userListApi(params) {
  return request(httpUrl.userListUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 用户_详情
export async function userDetailApi(params) {
  return request(`${httpUrl.userDetailUrl}?id=${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 用户_编辑
export async function userEditApi(params) {
  const { password, confirm, ...rest } = params;
  const data = params.id ? rest : params;
  return request(`${httpUrl.userEditUrl}${params.id ? 'Update' : 'Create'}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(data),
  });
}

// 用户_删除
export async function userDeleteApi(id) {
  return request(`${httpUrl.userDeleteUrl}?id=${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
  });
}

// 用户_设置权限
export async function jurisSetApi(params) {
  return request(httpUrl.jurisSetUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 行政区划_树状列表
export async function areaTreeApi(params) {
  return request(`${httpUrl.areaTreeUrl}?isFilter=${params.isFilter}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 获取边界
export async function boundaryApi() {
  return request(`${httpUrl.boundaryUrl}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 学会管理 —— 通知公告列表
export async function getLearnNoticeListApi(params) {
  return request(`${httpUrl.learnNoticeUrl}/GetAll`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 学会管理 —— 获取通知公告详情
export async function getLearnNoticeApi(params) {
  return request(`${httpUrl.learnNoticeUrl}/Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 学会管理 —— 通知公告新增/编辑
export async function editLearnNoticeApi(params) {
  return request(
    `${httpUrl.learnNoticeUrl}/${params?.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 学会管理 —— 删除通知公告
export async function deleteLearnNoticeApi(params) {
  return request(`${httpUrl.learnNoticeUrl}/Delete?id=${params?.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    // body: JSON.stringify(params),
  });
}

// 学会管理 —— 学术活动列表
export async function getLearnAcademicListApi(params) {
  return request(`${httpUrl.learnAcademicUrl}/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 学会管理 —— 学术活动新增/编辑
export async function editLearnAcademicApi(params) {
  return request(
    `${httpUrl.learnAcademicUrl}/${params?.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 学会管理 —— 删除学术活动
export async function deleteLearnAcademicApi(params) {
  return request(`${httpUrl.learnAcademicUrl}/Delete?id=${params?.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    // body: JSON.stringify(params),
  });
}

// 学会管理 —— 获取学术活动详情
export async function getLearnAcademicApi(params) {
  return request(`${httpUrl.learnAcademicUrl}/Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 学会管理 —— 培训活动列表
export async function getLearnTrainingListApi(params) {
  return request(`${httpUrl.learnTrainingUrl}/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 学会管理 —— 培训活动新增/编辑
export async function editLearnTrainingApi(params) {
  return request(
    `${httpUrl.learnTrainingUrl}/${params?.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 学会管理 —— 删除培训活动
export async function deleteLearnTrainingApi(params) {
  return request(`${httpUrl.learnTrainingUrl}/Delete?id=${params?.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    // body: JSON.stringify(params),
  });
}

// 学会管理 —— 获取培训活动详情
export async function getLearnTrainingApi(params) {
  return request(`${httpUrl.learnTrainingUrl}/Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 学会管理 —— 专家库列表
export async function getLearnExpertListApi(params) {
  return request(`${httpUrl.learnExpertUrl}/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 学会管理 —— 行政用户获取全部已审核通过的专家列表
export async function getLearnExpertAllPassedListApi(params) {
  return request(`${httpUrl.learnExpertUrl}/GetAllPass?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 学会管理 —— 专家新增/编辑
export async function editLearnExpertApi(params) {
  return request(
    `${httpUrl.learnExpertUrl}/${params?.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 学会管理 —— 删除专家
export async function deleteLearnExpertApi(params) {
  return request(`${httpUrl.learnExpertUrl}/Delete?id=${params?.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    // body: JSON.stringify(params),
  });
}

// 学会管理 —— 获取专家详情
export async function getLearnExpertApi(params) {
  return request(`${httpUrl.learnExpertUrl}/Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 学会管理 —— 培训活动申请列表
export async function getLearnTrainingRegListApi(params) {
  return request(`${httpUrl.learnTrainingRegUrl}/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 学会管理 —— 培训活动申请
export async function editLearnTrainingRegApi(params) {
  return request(
    `${httpUrl.learnTrainingRegUrl}/${params?.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 学会管理 —— 取消教育培训申请
export async function deleteLearnTrainingRegApi(params) {
  return request(`${httpUrl.learnTrainingRegUrl}/Delete?id=${params?.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    // body: JSON.stringify(params),
  });
}

// 学会管理 —— 获取教育培训申请详情
export async function getLearnTrainingRegDetailApi(params) {
  return request(`${httpUrl.learnTrainingRegUrl}/Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 学会管理 —— 获取个人会员列表
export async function getLearnIndividualMemberListApi(params) {
  return request(
    `${httpUrl.learnIndividualMemberUrl}/GetAll?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 学会管理 —— 行政单位获取所有审核已通过的个人会员列表
export async function getLearnIndividualMemberPassedListApi(params) {
  return request(
    `${httpUrl.learnIndividualMemberUrl}/GetAllPass?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 学会管理 —— 个人会员申请
export async function editLearnIndividualMemberApi(params) {
  return request(
    `${httpUrl.learnIndividualMemberUrl}/${params?.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 学会管理 —— 删除个人会员
export async function deleteLearnIndividualMemberApi(params) {
  return request(
    `${httpUrl.learnIndividualMemberUrl}/Delete?id=${params?.id}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      // body: JSON.stringify(params),
    }
  );
}

// 学会管理 —— 学术活动申请列表
export async function getLearnAcademicRegListApi(params) {
  return request(`${httpUrl.learnAcademicRegUrl}/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 学会管理 —— 学术活动申请
export async function editLearnAcademicRegApi(params) {
  return request(
    `${httpUrl.learnAcademicRegUrl}/${params?.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 学会管理 —— 获取学术活动申请详情
export async function getLearnAcademicRegDetailApi(params) {
  return request(`${httpUrl.learnAcademicRegUrl}/Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 学会管理 —— 获取个人会员详情
export async function getLearnIndividualMemberDetailApi(params) {
  return request(
    `${httpUrl.learnIndividualMemberUrl}/Get?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 学会管理 —— 获取团体会员列表
export async function getLearnGroupMemberListApi(params) {
  return request(`${httpUrl.learnGroupMemberUrl}/GetAll?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 学会管理 —— 行政单位获取所有审核通过团体会员列表
export async function getLearnPassedGroupMemberListApi(params) {
  return request(
    `${httpUrl.learnGroupMemberUrl}/GetAllPass?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 学会管理 —— 团体会员申请
export async function editLearnGroupMemberApi(params) {
  return request(
    `${httpUrl.learnGroupMemberUrl}/${params?.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 学会管理 —— 删除团体会员
export async function deleteLearnGroupMemberApi(params) {
  return request(`${httpUrl.learnGroupMemberUrl}/Delete?id=${params?.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    // body: JSON.stringify(params),
  });
}

// 学会管理 —— 获取团体会员详情
export async function getLearnGroupMemberDetailApi(params) {
  return request(`${httpUrl.learnGroupMemberUrl}/Get?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
    },
  });
}

// 学会管理 —— 获取社会用户团体会员信息
export async function checkIsGroupMemberApi(params) {
  return request(
    `${httpUrl.learnGroupMemberUrl}/IsGroupMember?${stringify(params)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  );
}

// 学会管理 —— 表彰奖励 —— 获取相关文件列表
export async function getLearnRelevantFileListApi(params) {
  return request(`${httpUrl.learnRelevantFileUrl}/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 学会管理 —— 表彰奖励 ——相关文件新增/编辑
export async function editLearnRelevantFileApi(params) {
  return request(
    `${httpUrl.learnRelevantFileUrl}/${params?.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 学会管理 —— 表彰奖励 ——删除相关文件
export async function deleteLearnRelevantFileApi(params) {
  return request(`${httpUrl.learnRelevantFileUrl}/Delete?id=${params?.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    // body: JSON.stringify(params),
  });
}

// 学会管理 —— 表彰奖励 —— 获取获奖情况列表
export async function getLearnAwardListApi(params) {
  return request(`${httpUrl.learnAwardSituationUrl}/GetAllByPost`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(params),
  });
}

// 学会管理 —— 表彰奖励 ——获奖情况新增/编辑
export async function editLearnAwardApi(params) {
  return request(
    `${httpUrl.learnAwardSituationUrl}/${params?.id ? 'Update' : 'Create'}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(params),
    }
  );
}

// 学会管理 —— 表彰奖励 ——删除获奖情况
export async function deleteLearnAwardApi(params) {
  return request(`${httpUrl.learnAwardSituationUrl}/Delete?id=${params?.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      'Content-Type': 'application/json-patch+json',
    },
    // body: JSON.stringify(params),
  });
}

// 微服务 stbc 水土保持-------------------------------------------------------------------------- end
