// import { domain } from './httpUrl';
// const localBasemapService = "http://172.17.247.122/BasemapService/rest/image";
// const intenetBasemapService = "http://www.stbcjg.cn/BasemapService/rest/image";
// const imageBaseUrl =
//   window.location.hostname === "172.17.247.123"
//     ? localBasemapService
//     : intenetBasemapService;
// const imageQueryBaseUrl = `${
//   window.location.hostname === "www.zkygis.cn" ||
//   window.location.hostname === "zkygis.cn" ||
//   window.location.hostname === "localhost" ||
//   window.location.hostname === "172.17.247.123"
//     ? localBasemapService
//     : intenetBasemapService
// }`;

// const imageBaseUrl = "https://www.zkygis.cn/imgMapService";
const imageBaseUrl = `${window.location.protocol}//www.stbcjg.cn/BasemapService/rest/image`;

// const imageBaseUrl =
//   window.location.hostname === "localhost"
//     ? "https://www.zkygis.cn:8089/imgMapService"
//     : (window.location.href.split("/#")[0]).split("/")[0] + "/imgMapService";

const color_back_spot = "#fff"; //背景色-图斑
const color_back_redLine = "#fff"; //背景色-红线
const color_border_spot1 = "#ffd700"; //边框色-图斑-未复核
const color_border_spot2 = "#E09A00"; //边框色-图斑-已复核
const color_border_redLine = "#e60000"; //边框色-红线

//四维地球
const access_token = "665496c90de736b41613e6e35a6c8eeb";
const siweiImageUrl = `https://service.siweiearth.com/wmts/seis/v3/wmts/tile/1012/0?product_id=3&access_token=${access_token}`; //免费镶嵌图
//https://service.siweiearth.com/wmts/seis/v3/wmts/image_tile/1137627/1?access_token=50d040c2e998317d99fc87fafb9b2382&product_id=2 //免费日新图
const siweiRiXinImageUrl =
  "https://service.siweiearth.com/wmts/seis/v3/wmts/image_tile/";
const myOnlineImageUrl = imageBaseUrl + "/latest/tile/{z}/{y}/{x}";

const arcgisVectorUrl =
  "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}";
const arcgisImageUrl =
  "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const tdtVectorUrl =
  "http://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703";
// const tdtVectorUrl =
//   "http://t{s}.tianditu.gov.cn/vec_c/wmts?tk=52eb0376ca0a56c6f6ed72ac8302a703";
const tdtImageUrl =
  "https://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703";
// const tdtImageUrl =
//   "http://t{s}.tianditu.gov.cn/img_c/wmts?tk=52eb0376ca0a56c6f6ed72ac8302a703";
const tdtImageLabelUrl =
  // "http://t{s}.tianditu.gov.cn/cia_c/wmts?tk=52eb0376ca0a56c6f6ed72ac8302a703";
  "https://t{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703";
// "http://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703";
const googleVectorUrl =
  // "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}";
  "http://mt2.google.cn/vt/lyrs=m@258000000&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}";
const googleImageUrl =
  // "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}";
  "http://mt2.google.cn/vt/lyrs=s@258000000&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}";
const gaodeVectorUrl =
  "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}";
const gaodeImageUrl =
  "http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
// const bdVectorUrl =
//   'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles={styles}&scaler=1&p=1';
// const bdImageUrl =
//   'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46';
const OSMVectorUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const errorTileUrl = "./img/errorTileUrl.png";

// const geoserverUrl =
//   window.location.pathname === "/stbcjg/"
//     ? "https://www.zkygis.cn/geoserver/ZKYGIS"
//     : `https://www.zkygis.cn/geoserver/ZKYGIS`;

//当ip是210时用
const geoserverUrl =
  window.location.pathname === "/stbcjg/"
    ? `${window.location.origin}/geoserver/ZKYGIS`
    : `https://www.zkygis.cn/geoserver/ZKYGIS`;

const authkey = `34339bab-d376-4192-9468-222cf9e1f8d0`;

//行政边界
const districtBoundUrl = `https://www.zkygis.cn/geoserver/ZKYGIS`;

const mapProjectLayerName = `ZKYGIS:bs_project_scope_gd${
  window.location.pathname === "/stbcjg/" ? "_f" : ""
}`; //防治责任范围
const mapSpotLayerName = `ZKYGIS:v_spot_review_plan_gd${
  window.location.pathname === "/stbcjg/" ? "_f" : ""
}`; //扰动图斑 ZKYGIS:v_spot_review_plan_gd ZKYGIS:bs_spot_gd
const mapZoneLayerName = `ZKYGIS:bs_project_preven_zone_gd${
  window.location.pathname === "/stbcjg/" ? "_f" : ""
}`; //防治分区
const mapFocusLayerName = `ZKYGIS:bs_project_focus_gd${
  window.location.pathname === "/stbcjg/" ? "_f" : ""
}`; //设计重点部位
const mapPreventionLayerName = `ZKYGIS:bs_project_prevention_gd${
  window.location.pathname === "/stbcjg/" ? "_f" : ""
}`; //设计设施分布
const mapGovernFocusProjectLayerName = `ZKYGIS:govern_focus_project${
  window.location.pathname === "/stbcjg/" ? "_f" : ""
}`; //2018重点工程点
const majorProject2018LayerName = `ZKYGIS:zdgc_2018_test${
  window.location.pathname === "/stbcjg/" ? "_f" : ""
}`; //2019重点工程点
const majorProject2019LayerName = `ZKYGIS:zdgc_2019_test${
  window.location.pathname === "/stbcjg/" ? "_f" : ""
}`; //2020重点工程点
const majorProject2020LayerName = `ZKYGIS:zdgc_2020_test${
  window.location.pathname === "/stbcjg/" ? "_f" : ""
}`; //重点工程点
const mapGovernSpotLayerName = `ZKYGIS:govern_spot${
  window.location.pathname === "/stbcjg/" ? "_f" : ""
}`; //治理图斑
const mapLayersName = `${
  window.location.pathname === "/stbcjg/"
    ? "ZKYGIS:bs_project_scope_gd_f,ZKYGIS:v_spot_review_plan_gd_f,ZKYGIS:bs_project_preven_zone_gd_f,ZKYGIS:bs_project_focus_gd_f,ZKYGIS:bs_project_prevention_gd_f"
    : "ZKYGIS:bs_project_scope_gd,ZKYGIS:v_spot_review_plan_gd,ZKYGIS:bs_project_preven_zone_gd,ZKYGIS:bs_project_focus_gd,ZKYGIS:bs_project_prevention_gd"
}`; //现状库所有图层

const mapDistrictLayerName = "ZKYGIS:district_code";
const config = {
  download: `http://www.zkygis.cn/stbcjg/Template/`,
  // 工具箱模板说明
  templateDescription: `http://docs.qq.com/doc/DTEV2TGRsU0RNQUV0`,
  //方案管理模板说明
  templateDescriptionPlan: `https://docs.qq.com/doc/DTEhlbWNvd01qT0Zo`,
  true: true,
  topologyCheckUrl: `https://www.zkygis.cn/apk/lib/拓扑检测工具.zip`,
  url: {
    //视频监控设备图片接口
    //AppKey:1be8632eeef34a1b925d4188cf8645de
    //Secret:ee93460114814575edc2217e2de98e34
    //测试AccessToken:at.c8xdl4ytd8r6zspd1ad88k5z6r6qo3ct-3usvvizzxx-1fzj49h-9q8zeapk6  有效期至：2019-12-19 18:14:00
    deviceAccessToken: `https://open.ys7.com/api/lapp/token/get`,
    appKey: `1be8632eeef34a1b925d4188cf8645de`,
    appSecret: `ee93460114814575edc2217e2de98e34`,
    deviceImgList: `https://www.zkyxxhs.com/gzsj/wechat/third/imgList`,
    //获取设备直播地址
    deviceAddress: `https://open.ys7.com/api/lapp/live/address/get`,
    //视频监控设备接口
    deviceVideo: {
      1909030002: `http://hls01open.ys7.com/openlive/d7e10dab781c497e90b305ab09f16ab1.hd.m3u8`, //HLS播放地址高清  流畅地址:http://hls01open.ys7.com/openlive/d7e10dab781c497e90b305ab09f16ab1.m3u8
      //RTMP播放地址高清：rtmp://rtmp01open.ys7.com/openlive/d7e10dab781c497e90b305ab09f16ab1.hd
      //RTMP播放地址流畅：rtmp://rtmp01open.ys7.com/openlive/d7e10dab781c497e90b305ab09f16ab1
      1909030003: `http://hls01open.ys7.com/openlive/6e8eee5f3b9c4bd487a785168159bb7b.hd.m3u8`, //HLS播放地址高清  流畅地址:http://hls01open.ys7.com/openlive/6e8eee5f3b9c4bd487a785168159bb7b.m3u8
      //RTMP播放地址高清：rtmp://rtmp01open.ys7.com/openlive/6e8eee5f3b9c4bd487a785168159bb7b.hd
      //RTMP播放地址流畅：rtmp://rtmp01open.ys7.com/openlive/6e8eee5f3b9c4bd487a785168159bb7b
    },
  },

  imageBaseUrl: imageBaseUrl,

  /*----------------------------------地图配置部分-------------------------------------*/
  mapInitParams: {
    // center: [23.1441, 113.3693],
    // zoom: 14,
    center: [22.991266590272033, 113.25805664062501],
    zoom: 9,
    maxZoom: 20,
  },
  // 显示点状要素的级别
  pointLevel: 12,
  cesiumMapInitParams: {
    extent: {
      //初始化范围
      xmin: 91.262834,
      ymin: 8.178795,
      xmax: 136.851228,
      ymax: 49.517782,
    },
    spatialReference: {
      //地图空间参考坐标系
      wkid: 4326,
    },
    /*备注说明:配置底图列表
      *type代表地图服务类型(0代表ArcGisMapServerImageryProvider;1代表createOpenStreetMapImageryProvider;
                      2代表WebMapTileServiceImageryProvider;3代表createTileMapServiceImageryProvider;
                      4 代表UrlTemplateImageryProvider;5 代表WebMapServiceImageryProviderr)
      *proxyUrl代理请求服务
      *iconUrl图标
      *name显示名称
      *Url地图Url
      */
    imageryViewModels: [
      {
        label: "监管影像图",
        className: "imgType",
        type: 4,
        proxyUrl: "",
        Url: myOnlineImageUrl,
        credit: "监管影像",
        subdomains: "abc",
      },
      {
        label: "ArcGIS影像图",
        className: "imgType",
        type: 0,
        proxyUrl: "",
        Url: "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer",
      },
      //subdomains默认值'abc'
      {
        label: "天地影像图",
        className: "imgType",
        type: 2,
        proxyUrl: "",
        Url: "https://t{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&tk=52eb0376ca0a56c6f6ed72ac8302a703",
        layer: "tdtImgBasicLayer",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "tdtMap",
        subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      },
      {
        label: "天地街道图",
        className: "vecType",
        type: 2,
        proxyUrl: "",
        Url: "https://t{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&tk=52eb0376ca0a56c6f6ed72ac8302a703",
        layer: "tdtVecBasicLayer",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "tdtMap",
        subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      },
    ],
    /*地图图层菜单目录构造*/
    /*
      *name-图层名称
      *layerurl-图层服务配置
      *type代表地图服务类型:
      0代表ArcGisMapServerImageryProvider;
      1代表OpenStreetMapImageryProvider;
      2代表WebMapTileServiceImageryProvider;
      3代表TileMapServiceImageryProvider;
      4 代表UrlTemplateImageryProvider;
      5 代表WebMapServiceImageryProviderr(WMS);
      6 代表kml,kmz;
      7 代表geoJson;
      *layerid-图层id
      */

    overlayLayers: [
      { id: 1, pId: 0, name: "基础图层", checked: false },
      // {
      //   id: 11,
      //   pId: 1,
      //   name: "项目红线", //WMS
      //   layerurl: geoserverUrl + "/wms",
      //   layerid: mapProjectLayerName,
      //   IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
      //   authkey: "34339bab-d376-4192-9468-222cf9e1f8d0",
      //   type: 5,
      //   proxyUrl: "",
      //   checked: true,
      // },
      // {
      //   id: 12,
      //   pId: 1,
      //   name: "扰动图斑", //WMS
      //   layerurl: geoserverUrl + "/wms",
      //   layerid: mapSpotLayerName,
      //   IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
      //   authkey: "34339bab-d376-4192-9468-222cf9e1f8d0",
      //   type: 5,
      //   proxyUrl: "",
      //   checked: true,
      // },
      {
        id: 13,
        pId: 1,
        name: "路网注记",
        layerurl:
          "https://t{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&tk=52eb0376ca0a56c6f6ed72ac8302a703",
        layerid: "tdtImgLabelLayer",
        IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
        type: 2,
        proxyUrl: "",
        checked: false,
      },
      {
        id: 14,
        pId: 1,
        name: "行政边界", //WMS
        layerurl: geoserverUrl + "/wms",
        layerid: mapDistrictLayerName,
        IsWebMercatorTilingScheme: false, //是否创建摩卡托投影坐标系,默认是地理坐标系
        authkey: "34339bab-d376-4192-9468-222cf9e1f8d0",
        type: 5,
        proxyUrl: "",
        checked: false,
      },
    ],
    Tiles3D: {
      //三维倾斜摄影配置信息
      url: "https://www.zkygis.cn/3DTiles/pazhou/Production_3.json",
      //url: "./cesiumfile/3Dtiles/Production_1/Scene/Production_1.json",
    },
    terrainObj: {
      type: "CesiumTerrainProvider",
      url: "https://www.zkygis.cn/cesiumTerrain_GD",
      requestWaterMask: false,
      requestVertexNormals: false,
      proxyUrl: "",
    },
  },
  //天地图影像注记
  tdtImageLabel: {
    title: "路网注记",
    url: tdtImageLabelUrl,
    minZoom: 0,
    maxZoom: 18,
    // maxZoom: 21,
    subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
    picUrl: `./img/tdtImagelabel.png`,
    errorTileUrl: errorTileUrl,
  },
  //行政边界
  districtBound: {
    title: "行政边界",
    url: districtBoundUrl,
    mapDistrictLayerName: mapDistrictLayerName,
    minZoom: 0,
    maxZoom: 18,
    // maxZoom: 21,
    picUrl: `./img/districtBound.png`,
    errorTileUrl: errorTileUrl,
  },
  //行政边界-南海部分
  districtBoundNanhai: {
    title: "行政边界南海",
    url: districtBoundUrl,
    mapDistrictLayerName: "ZKYGIS:district_nanhai",
    minZoom: 0,
    maxZoom: 18,
    picUrl: `./img/districtBound.png`,
    errorTileUrl: errorTileUrl,
  },
  //行政边界
  districtBoundBlack: {
    title: "行政边界",
    url: districtBoundUrl,
    mapDistrictLayerName: "ZKYGIS:sys_district_code_blackline",
    minZoom: 0,
    maxZoom: 18,
    // maxZoom: 21,
    picUrl: `./img/districtBound.png`,
    errorTileUrl: errorTileUrl,
  },
  errorTileUrl: errorTileUrl,
  // 在线底图
  onlineBasemaps: [
    // {
    //   title: "镶嵌图",
    //   url: siweiImageUrl,
    //   tilematrixSet: "GoogleCRS84Quad",
    //   layer: "",
    //   minZoom: 0,
    //   maxZoom: 21,
    //   subdomains: "abc",
    //   picUrl: `./img/myOnlineImage.png`,
    //   errorTileUrl: errorTileUrl,
    //   layertype: "TileLayer.WMTS",
    // },
    {
      id: "jg_img",
      title: "监管影像",
      url: myOnlineImageUrl,
      minZoom: 0,
      maxZoom: 18,
      // maxZoom: 21,
      subdomains: "abc",
      picUrl: `./img/myOnlineImage.png`,
      errorTileUrl: errorTileUrl,
      layertype: "TileLayer",
      icon: `./img/监管影像.png`,
    },
    // {
    //   title: "OSM街道图",
    //   url: OSMVectorUrl,
    //   minZoom: 0,
    //   maxZoom: 21,
    //   subdomains: "abc",
    //   picUrl: `./img/OSMVector.png`,
    //   errorTileUrl: errorTileUrl,
    //   layertype: "TileLayer",
    // },
    {
      id: "arcgis_img",
      title: "ArcGIS影像",
      url: arcgisImageUrl,
      minZoom: 0,
      maxZoom: 18,
      // maxZoom: 21,
      subdomains: "abc",
      picUrl: `./img/arcgisImage.png`,
      errorTileUrl: errorTileUrl,
      layertype: "TileLayer",
      icon: `./img/ArcGIS影像.png`,
    },
    // {
    //   title: "ArcGIS街道图(有偏移)",
    //   url: arcgisVectorUrl,
    //   minZoom: 0,
    //   maxZoom: 21,
    //   subdomains: "abc",
    //   picUrl: `./img/arcgisVector.png`,
    //   errorTileUrl: errorTileUrl,
    //   layertype: "TileLayer",
    // },
    {
      id: "tdt_img",
      title: "天地图影像",
      url: tdtImageUrl,
      minZoom: 0,
      maxZoom: 18,
      // maxZoom: 21,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      picUrl: `./img/tdtImage.png`,
      errorTileUrl: errorTileUrl,
      layertype: "TileLayer",
      icon: `./img/天地图影像.png`,
    },
    // {
    //   title: "天地影像图",
    //   url: tdtImageUrl,
    //   tilematrixSet: "c",
    //   layer: "img",
    //   minZoom: 0,
    //   maxZoom: 21,
    //   subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
    //   picUrl: `./img/tdtImage.png`,
    //   errorTileUrl: errorTileUrl,
    //   layertype: "TileLayer.WMTS",
    // },
    {
      id: "tdt_vec",
      title: "天地图街道",
      url: tdtVectorUrl,
      minZoom: 0,
      maxZoom: 18,
      // maxZoom: 21,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      picUrl: `./img/tdtVector.png`,
      errorTileUrl: errorTileUrl,
      layertype: "TileLayer",
      icon: `./img/天地图矢量.png`,
    },
    // {
    //   title: "天地街道图",
    //   url: tdtVectorUrl,
    //   tilematrixSet: "c",
    //   layer: "vec",
    //   minZoom: 0,
    //   maxZoom: 21,
    //   subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
    //   picUrl: `./img/tdtVector.png`,
    //   errorTileUrl: errorTileUrl,
    //   layertype: "TileLayer.WMTS",
    // },
    // {
    //   title: "谷歌影像图(有偏移)",
    //   url: googleImageUrl,
    //   minZoom: 0,
    //   maxZoom: 21,
    //   subdomains: "abc",
    //   picUrl: `./img/googleImage.png`,
    //   errorTileUrl: errorTileUrl,
    //   layertype: "TileLayer",
    // },
    // {
    //   title: "谷歌街道图(有偏移)",
    //   url: googleVectorUrl,
    //   minZoom: 0,
    //   maxZoom: 21,
    //   subdomains: "abc",
    //   picUrl: `./img/googleVector.png`,
    //   errorTileUrl: errorTileUrl,
    //   layertype: "TileLayer",
    // },
    // {
    //   title: "高德影像图(有偏移)",
    //   url: gaodeImageUrl,
    //   minZoom: 0,
    //   maxZoom: 21,
    //   subdomains: ["1", "2", "3", "4"],
    //   picUrl: `./img/gaodeImage.png`,
    //   errorTileUrl: errorTileUrl,
    //   layertype: "TileLayer",
    // },
    // {
    //   title: "高德街道图(有偏移)",
    //   url: gaodeVectorUrl,
    //   minZoom: 0,
    //   maxZoom: 21,
    //   subdomains: ["1", "2", "3", "4"],
    //   picUrl: `./img/gaodeVector.png`,
    //   errorTileUrl: errorTileUrl,
    //   layertype: "TileLayer",
    // },

    // {
    //   title: '百度街道图',
    //   url: bdVectorUrl,
    //   minZoom: 0,
    //   maxZoom: 21,
    // },
    // {
    //   title: '百度影像图',
    //   url: bdImageUrl,
    //   minZoom: 0,
    //   maxZoom: 21,
    // },
  ],
  //2018年动态监测
  governDynamic2018: {
    title: "2018年动态监测",
    url: "https://www.zkygis.cn/BasemapService/rest/services/8ac7a9b8-2c3c-4661-b398-dc3c5888af00/MapServer/tile/{z}/{y}/{x}",
    minZoom: 7,
    maxZoom: 17,
    subdomains: "abc",
    picUrl: `./img/myOnlineImage.png`,
    errorTileUrl: errorTileUrl,
    layertype: "TileLayer",
  },
  //2019年动态监测
  governDynamic2019: {
    title: "2019年动态监测",
    url: "https://www.zkygis.cn/BasemapService/rest/services/95b71d78-4512-4911-ac38-41d755046deb/MapServer/tile/{z}/{y}/{x}",
    minZoom: 7,
    maxZoom: 17,
    subdomains: "abc",
    picUrl: `./img/myOnlineImage.png`,
    errorTileUrl: errorTileUrl,
    layertype: "TileLayer",
  },
  //2020年动态监测
  governDynamic2020: {
    title: "2020年动态监测",
    url: "https://www.zkygis.cn/BasemapService/rest/services/b1836b56-7662-43fc-b881-1e67359fa5a7/MapServer/tile/{z}/{y}/{x}",
    minZoom: 7,
    maxZoom: 17,
    subdomains: "abc",
    picUrl: `./img/myOnlineImage.png`,
    errorTileUrl: errorTileUrl,
    layertype: "TileLayer",
  },
  //广东省两区：水土流失重点预防区、治理区
  GD2Zone: {
    title: "广东省两区",
    url: "https://www.zkygis.cn/BasemapService/rest/services/58e465c5-72c7-48b8-aea7-8d0174b1941e/MapServer/tile/{z}/{y}/{x}",
    minZoom: 7,
    maxZoom: 17,
    subdomains: "abc",
    picUrl: `./img/myOnlineImage.png`,
    errorTileUrl: errorTileUrl,
    layertype: "TileLayer",
  },
  authkey: authkey,
  siweiRiXinImageUrl: siweiRiXinImageUrl, //四维地图-日新图
  access_token: access_token,
  mapUrl: {
    SHP: `./mapfile/SHP/`,
    mapshaper: `./mapshaper/index.html`,
    geoserverUrl: geoserverUrl,
    geoserverQueryUrl: `http://localhost:8080/geoserver/ZKYGIS`, //用于api查询的传递的参数，所以用localhost
    localhostGeoserver: `http://localhost:8080/geoserver/ZKYGIS`,
    //根据地图当前范围获取对应历史影像数据接口
    //getInfoByExtent: `${imageQueryBaseUrl}/latest/getInfoByExtent`,
    // getInfoByExtent:
    //   window.location.hostname === "localhost" ||
    //   window.location.hostname === "www.zkygis.cn" ||
    //   window.location.hostname === "zkygis.cn"
    //     ? `https://www.zkygis.cn/imgExtentApi`
    //     : window.location.hostname === "172.17.247.123"
    //     ? "https://" + window.location.hostname + "/imgExtentApi"
    //     : `${imageQueryBaseUrl}/latest/getInfoByExtent`,
    // getInfoByExtent: `https://www.zkygis.cn/imgExtentApi`,
    getInfoByExtent: `${window.location.protocol}//www.stbcjg.cn/BasemapService/rest/image/latest/getInfoByExtent`,
  },

  mapLayersName: mapLayersName, //所有图层
  mapProjectLayerName: mapProjectLayerName, //防治责任范围
  mapSpotLayerName: mapSpotLayerName, //扰动图斑
  //mapHistorySpotLayerName: mapHistorySpotLayerName, //历史扰动图斑
  mapZoneLayerName: mapZoneLayerName, //防治分区
  mapFocusLayerName: mapFocusLayerName, //设计重点部位
  mapPreventionLayerName: mapPreventionLayerName, //设计设施分布
  mapGovernFocusProjectLayerName: mapGovernFocusProjectLayerName, //重点工程点
  mapGovernSpotLayerName: mapGovernSpotLayerName, //治理图斑
  majorProject2018LayerName: majorProject2018LayerName,
  majorProject2019LayerName: majorProject2019LayerName,
  majorProject2020LayerName: majorProject2020LayerName,
  legend: [
    {
      title: "扰动图斑_未关联_未复核",
      background: color_back_spot,
      border: color_border_spot1,
    },
    {
      title: "扰动图斑_未关联_已复核",
      background: color_back_spot,
      border: color_border_spot2,
    },
    {
      title: "扰动图斑_已关联_未复核",
      background: color_back_spot,
      border: color_border_spot1,
    },
    {
      title: "扰动图斑_已关联_已复核",
      background: color_back_spot,
      border: color_border_spot2,
    },
    {
      title: "项目红线",
      background: color_back_redLine,
      border: color_border_redLine,
    },
  ],
  dynamicLegend: [
    {
      title: "微度",
      background: "#E6F5D4",
      border: "#E6F5D4",
    },
    {
      title: "轻度",
      background: "#FFD1B3",
      border: "#FFD1B3",
    },
    {
      title: "中度",
      background: "#FFA678",
      border: "#FFA678",
    },
    {
      title: "强烈",
      background: "#FF804D",
      border: "#FF804D",
    },
    {
      title: "极强烈",
      background: "#E65900",
      border: "#E65900",
    },
    {
      title: "剧烈",
      background: "#CC4D00",
      border: "#CC4D00",
    },
  ],
  legend_xmjg: [
    {
      title: "项目总数",
      imgUrl: `./img/projectPoint_XMZS.png`,
    },
    {
      title: "立项级别",
      imgUrl: `./img/projectPoint_LXJB.png`,
    },
    {
      title: "合规性",
      imgUrl: `./img/projectPoint_HGX.png`,
    },
    {
      title: "项目类别",
      imgUrl: `./img/projectPoint_XMLB.png`,
    },
    {
      title: "项目性质",
      imgUrl: `./img/projectPoint_XMXZ.png`,
    },
    {
      title: "建设状态",
      imgUrl: `./img/projectPoint_JSZT.png`,
    },
  ],
  // 从属性表定位要素的级别
  locateFeatureLevel: 14,
  aiMap: null,
  lstOverLayers: null,
  // 地图默认值
  mapDefault: {
    // 纬度、经度 广州
    center: [23.42, 113.35],
    // 纬度、经度 贵州
    //center: [26.7407, 106.6827],
    zoom: 5,
    minZoom: 5,
    maxZoom: 18,
  },
};

export default config;
