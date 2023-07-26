import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.vectorgrid"; //矢量瓦片
import * as qs from "qs";
import jQuery from "jquery";
import httpUrl from "../httpUrl";
import config from "../config";

const $ = jQuery;

// var lmap=require("mapbox-gl-leaflet");

//地图对象
var homeMap = null; //首页地图对象
var qyjgMap = null; //区域监管地图对象
var dtjcMap = null; //动态监测地图对象
var oneMap = null; //一张图对象
var locationMap = null; //定位小地图
var districtList = null;
var accountDistrict = null;

// var config, httpUrl;

//公共状态
const gdBounds = L.latLngBounds([
  [25.51995137, 117.28615319],
  [20.223273205, 109.664881435],
]);
var currentTool = null;
var status = { isChartOn: true };

var mvtMinzoom = 1;
//根据域名，如果是委里域名，http://210.76.84.25/，则mvtMinzoom从1改为11。
if (
  window.location.hostname.indexOf("210.76.84.25") > -1 ||
  window.location.hostname.indexOf("stbc.gdwater.gov.cn") > -1
) {
  mvtMinzoom = 11;
}

//地图地址

/**
 *将定制化的比例尺组件L.control.scale加入指定地图
 *
 * @param {*} map 地图
 */
var createScale = (map) => {
  const scale = L.control
    .scale({ imperial: false, position: "bottomright" })
    .addTo(map);
  $(scale.getContainer()).find("div").css({
    background: "rgba(255, 255, 255, 1)",
    border: "1px solid #000",
    borderTop: "none",
  });
};

/**
 *将定制化的缩放组件L.control.zoominfo加入指定地图
 *
 * @param {*} map 地图
 */
var createZoominfo = (map) => {
  L.control.zoominfo().addTo(map);
};

/**
 *将定制化的鹰眼图组件L.control.MiniMap加入指定地图
 *
 * @param {*} map 地图
 * @param {*} layer 鹰眼图图层
 */
var createMiniMap = (map, options = {}) => {
  let layer = createTdtVec();
  let miniMap = new L.Control.MiniMap(layer, {
    toggleDisplay: true,
    minimized: false,
    ...options,
  });
  miniMap.addTo(map);
};

var createHomeButton = (map, bounds, clickFuc) => {
  let homeButton = L.easyButton(
    '<img src="./img/首页.png" style="width:15px;height:17px">',
    (btn, map) => {
      // window.map.refreshAllSpots();
      console.log("首页");

      if (clickFuc) {
        clickFuc();
        return;
      }
      if (bounds) {
        map.fitBounds(bounds, { maxZoom: 17 });
      }
    }
  )
    .addTo(map)
    .setPosition("bottomright");
  return homeButton;
};

/**
 * 将turf的bbox格式转为leaflet的latLngBounds
 *
 * @param {*} bbox
 * @return {*}
 */
var bbox2latLngBounds = (bbox) => {
  let latLngBounds = [
    [bbox[1], bbox[0]],
    [bbox[3], bbox[2]],
  ];
  return latLngBounds;
};

/**
 *返回天地图矢量电子地图（矢量+注记）的L.layerGroup图层
 *
 * @return {*}
 */
var createTdtVec = function (options) {
  let tdtVec = L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 18,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );

  let tdtCva = L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 18,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );

  let layer = L.layerGroup([tdtVec, tdtCva]);
  // let layer = L.layerGroup([tdtVec]);
  layer.title = "天地图街道";
  layer.picUrl = "./img/天地图矢量.png";
  return layer;
};

/**
 *返回天地图影像的L.tileLayer图层
 *
 * @return {*}
 */
var createTdtImg = function (options) {
  let layer = L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 18,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );
  layer.title = "天地图影像";
  layer.picUrl = "./img/天地图影像.png";
  return layer;
};

/**
 *返回MapTiler矢量的L.mapboxGL图层
 *todo:申请Mapbox的key，或者下载不用key的低版本mapbox,否则无法查看地图
 * @return {*}
 */
var createMapboxMVT = function (options) {
  let layer = L.mapboxGL({
    attribution:
      '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
    style:
      "https://api.maptiler.com/maps/ab173bec-0e9d-4467-bcf0-fb6b68af006d/style.json?key=mI6l6zNNSAX5pYYoxDwT",
    accessToken:
      "pk.eyJ1IjoieGlsb3UwNzAxIiwiYSI6ImNsM2k0c3g5aDBtYjgzaW8yc2R3NXFnNDEifQ.HDwHLVzYUem1IPbeXUjjkg",
  });
  layer.title = "MapTiler矢量";
  layer.picUrl = "./img/天地图矢量.png";
  return layer;
};

/**
 *返回osm矢量的L.tileLayer图层
 *
 * @return {*}
 */
var createOsmVec = function (options) {
  let layer = L.tileLayer(
    `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 17,
      subdomains: "abc",
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );
  layer.title = "osm矢量";
  layer.picUrl = "./img/osm矢量.png";
  return layer;
};

/**
 *返回天地图影像注记的L.tileLayer图层
 *
 * @return {*}
 */
var createTdtCia = function (options) {
  let layer = L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 18,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );
  layer.title = "路网注记";
  layer.picUrl = "./img/注记图标.png";
  return layer;
};

/**
 *返回天地图地形晕渲图的L.tileLayer图层
 *
 * @return {*}
 */
var createTdtTer = function (options) {
  let layer = L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 12,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );
  layer.title = "天地图地形";
  layer.picUrl = "./img/天地图地形.png";
  return layer;
};

/**
 *返回天地图境界的L.tileLayer图层
 *
 * @return {*}
 */
var createTdtIbo = function (options) {
  let layer = L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703`,
    {
      minZoom: 0,
      maxZoom: 20,
      // maxNativeZoom:17,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );
  layer.title = "天地图影像";
  layer.picUrl = "./img/天地图影像.png";
  return layer;
};

/**
 *返回监管影像的L.tileLayer图层
 *
 * @return {*}
 */
var createJgImg = function (options) {
  let layer = L.tileLayer(
    `${window.location.protocol}//www.stbcjg.cn/BasemapService/rest/image/latest/tile/{z}/{y}/{x}`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 17,
      subdomains: ["a"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );
  layer.title = "监管影像";
  layer.picUrl = "./img/监管影像.png";
  return layer;
};

/**
 *返回ArcGIS影像的L.tileLayer图层
 *
 * @return {*}
 */
var createArcgisImg = function (options) {
  let layer = L.tileLayer(
    `https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 17,
      subdomains: ["a"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );
  layer.title = "ArcGIS影像";
  layer.picUrl = "./img/ArcGIS影像.png";
  return layer;
};

/**
 *返回ArcGIS地形图的L.tileLayer图层
 *
 * @return {*}
 */
var createArcgisTer = function (options) {
  let layer = L.tileLayer(
    `https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 12,
      subdomains: ["a"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );
  layer.title = "ArcGIS地形图";
  layer.picUrl = "./img/ArcGIS影像.png";
  return layer;
};

/**
 *返回2018年动态监测土壤侵蚀强度的L.tileLayer图层
 *
 * @return {*}
 */
var createGovernDynamic2018 = function (options) {
  let layer = L.tileLayer(`${config.governDynamic2018.url}`, {
    minZoom: 7,
    maxZoom: 17,
    subdomains: ["a"],
    errorTileUrl: "./img/errorTileUrl.png",
    bounds: gdBounds,
    ...options,
  });
  layer.title = "2018年土壤侵蚀强度";
  layer.picUrl = "./img/trqs_img.png";
  return layer;
};

/**
 *返回2019年动态监测土壤侵蚀强度的L.tileLayer图层
 *
 * @return {*}
 */
var createGovernDynamic2019 = function (options) {
  let layer = L.tileLayer(`${config.governDynamic2019.url}`, {
    minZoom: 7,
    maxZoom: 17,
    subdomains: ["a"],
    errorTileUrl: "./img/errorTileUrl.png",
    bounds: gdBounds,
    ...options,
  });
  layer.title = "2019年土壤侵蚀强度";
  layer.picUrl = "./img/trqs_img.png";
  return layer;
};

/**
 *返回2020年动态监测土壤侵蚀强度的L.tileLayer图层
 *
 * @return {*}
 */
var createGovernDynamic2020 = function (options) {
  let layer = L.tileLayer(`${config.governDynamic2020.url}`, {
    minZoom: 7,
    maxZoom: 17,
    subdomains: ["a"],
    errorTileUrl: "./img/errorTileUrl.png",
    bounds: gdBounds,
    ...options,
  });
  layer.title = "2020年土壤侵蚀强度";
  layer.picUrl = "./img/trqs_img.png";
  return layer;
};

/**
 *返回广东省两区：水土流失重点预防区、治理区的L.tileLayer图层
 *
 * @return {*}
 */
var createGD2Zone = function (options) {
  let layer = L.tileLayer(`${config.GD2Zone.url}`, {
    minZoom: 7,
    maxZoom: 17,
    subdomains: ["a"],
    errorTileUrl: "./img/errorTileUrl.png",
    bounds: gdBounds,
    ...options,
  });
  layer.title = "广东省两区";
  layer.picUrl = "./img/trqs_img.png";
  return layer;
};

/**
 *返回google地形图的L.tileLayer图层
 *
 * @return {*}
 */
var createGoogleTer = function (options) {
  let layer = L.tileLayer(
    `https://tile2.gosurmaps.com/data/hillshade/{z}/{x}/{y}.png`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 12,
      subdomains: ["a"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );
  layer.title = "Google地形图";
  layer.picUrl = "./img/ArcGIS影像.png";
  return layer;
};

/**
 *返回google地形图pbf格式的L.tileLayer图层
 *
 * @return {*}
 */
var createGoogleTerPbf = function (options) {
  // let layer = L.tileLayer(
  //   `https://tile2.gosurmaps.com/data/v3/{z}/{x}/{y}.pbf`,
  //   {
  //     minZoom: 0,
  //     maxZoom: 18,
  //     subdomains: ["a"],
  //     errorTileUrl: "./img/errorTileUrl.png",
  //     ...options,
  //   },
  // );
  let layer = L.vectorGrid.protobuf(
    `https://tile2.gosurmaps.com/data/v3/{z}/{x}/{y}.pbf`
  );
  layer.title = "Google地形图pbf";
  layer.picUrl = "./img/osm地图.png";
  return layer;
};

/**
 *返回google地形图的L.tileLayer图层
 *
 * @return {*}
 */
var createMapboxTer = function (options) {
  let layer = L.tileLayer(
    `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1Ijoid2FuZ2hhaGExIiwiYSI6ImNqeHUycXF5ZDEweDQzYnBiOTcwZGoxMHAifQ.eCGuiA6erHJ7ew-Fkc7dRA`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 12,
      subdomains: ["a"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );
  layer.title = "Mapbox地形图";
  layer.picUrl = "./img/ArcGIS影像.png";
  return layer;
};

/**
 *返回智图彩色版的L.tileLayer图层
 *
 * @return {*}
 */
var createGeoqVec = function (options) {
  let layer = L.tileLayer(
    `http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 17,
      subdomains: ["a"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    }
  );
  layer.title = "智图彩色版";
  layer.picUrl = "./img/智图彩色版.png";
  return layer;
};

/**
 *返回行政界线的L.layerGroup图层
 *
 * @return {*}
 */
var creatBoundaryLayer = function (options) {
  let districtBoundLayer = L.tileLayer.wms(`${config.districtBound.url}/wms?`, {
    layers: config.districtBound.mapDistrictLayerName, //需要加载的图层
    format: "image/png", //返回的数据格式
    transparent: true,
    maxZoom: config.districtBound.maxZoom,
    authkey: config.authkey,
    ...options,
  });
  let districtBoundLayerNanhai = L.tileLayer.wms(
    `${config.districtBoundNanhai.url}/wms?`,
    {
      layers: config.districtBoundNanhai.mapDistrictLayerName, //需要加载的图层
      format: "image/png", //返回的数据格式
      transparent: true,
      maxZoom: config.districtBoundNanhai.maxZoom,
      authkey: config.authkey,
      ...options,
    }
  );
  let layer = L.layerGroup([districtBoundLayer, districtBoundLayerNanhai]);
  layer.title = "行政边界";
  layer.picUrl = "./img/行政注记.png";
  return layer;
};

/**
 *返回治理图斑的矢量瓦片L.vectorGrid.protobuf图层
 *
 * @param {*} options eg:createMVT({params:{YEAR:2020}})-矢量瓦片查询参数
 * @return {*}
 */
var createGovernSpotMVT = function (options) {
  //构建查询参数
  let params = "";
  if (options && options.params) {
    params += `?${qs.stringify(options.params, { arrayFormat: "repeat" })}`;
  }
  let url = `${httpUrl.tilesGovernSpotMvtUrl}/{z}/{x}/{y}${params}`;
  //矢量瓦片Options
  let mvtStyles = {
    governspot: function (properties, zoom) {
      var symbol = null;
      symbol = {
        color: "#FBF303",
        weight: 2,
        fillColor: "rgba(255,255,0,0)",
        fill: true,
      };
      return symbol;
    },
  };

  let mvtOptions = {
    rendererFactory: L.canvas.tile, //L.canvas.tile L.svg.tile
    maxZoom: 20,
    minZoom: mvtMinzoom,
    pane: "overlayPane",
    vectorTileLayerStyles: mvtStyles,
    interactive: false,
    fetchOptions: {
      credentials: "same-origin",
      // headers: {
      //   Authorization: `Bearer ${accessToken()}`,
      // },
    },
    // bounds: gdBounds,
  };
  let layer = L.vectorGrid.protobuf(url, mvtOptions);
  layer.title = "治理图斑";
  layer.picUrl = "./img/扰动图斑注记.png";
  return layer;
};

/**
 *返回项目红线的矢量瓦片L.vectorGrid.protobuf图层
 *
 * @param {*} options eg:createMVT({params:{ReviewPlanId:"9154521287203225610"}})-矢量瓦片查询参数
 * @return {*}
 */
var createProjectMVT = function (options) {
  //构建查询参数
  let params = "";
  if (options && options.params) {
    params += `?${qs.stringify(options.params, { arrayFormat: "repeat" })}`;
  }
  let url = `${httpUrl.approscopeMvtUrl}/{z}/{x}/{y}${params}`;
  //矢量瓦片Options
  let mvtStyles = {
    redline: function (properties, zoom) {
      let symbol = null;
      let width = 3;
      symbol = {
        color: "#FF0000",
        fillColor: "#FF0000",
        fillOpacity: 0,
        fill: true,
        opacity: 1,
        weight: width,
      };
      return symbol;
    },
  };
  let mvtOptions = {
    rendererFactory: L.canvas.tile, //L.canvas.tile L.svg.tile
    maxZoom: 20,
    minZoom: mvtMinzoom,
    vectorTileLayerStyles: mvtStyles,
    interactive: false,
    fetchOptions: {
      credentials: "same-origin",
      // headers: {
      //   Authorization: `Bearer ${accessToken()}`,
      // },
    },
    // bounds: gdBounds,
  };

  let layer = L.vectorGrid.protobuf(url, mvtOptions);
  layer.title = "项目红线";
  layer.picUrl = "./img/项目红线注记.png";
  return layer;
};

/**
 * 值为空时，不返回null，而返回“”
 *
 * @param {*} v
 * @return {*}
 */
var valid = function (v) {
  return v ? v : "";
};

/**
 *返回扰动图斑的矢量瓦片L.vectorGrid.protobuf图层
 *
 * @param {*} options eg:createMVT({params:{ReviewPlanId:"9154521287203225610"}})-矢量瓦片查询参数
 * @return {*}
 */
var createSpotMVT = function (options) {
  //构建查询参数
  let params = "";
  if (options && options.params) {
    params += `?${qs.stringify(options.params, { arrayFormat: "repeat" })}`;
  }
  let url = `${httpUrl.tilesSpotMvtUrl}/{z}/{x}/{y}${params}`;
  //矢量瓦片Options
  let mvtStyles = {
    spot: function (properties, zoom) {
      // console.log("图斑矢量瓦片属性:", properties);
      let symbol = null;
      let UNFINISHED_SPOT_COLOR = "#e6d933";
      let FINISHED_SPOT_COLOR = "#E09A00"; //#ff6100
      let SPOT_FILL_COLOR = "rgba(255,255,0,0.1)";
      let DASH_ARRAY = "5";
      let BORDER_WIDTH = 3;
      symbol =
        !properties.hasOwnProperty("project_id") &&
        !properties.hasOwnProperty("review_id")
          ? {
              color: UNFINISHED_SPOT_COLOR,
              dashArray: DASH_ARRAY,
              weight: BORDER_WIDTH,
              fillColor: SPOT_FILL_COLOR,
              fill: true,
            }
          : !properties.hasOwnProperty("project_id") &&
            properties.hasOwnProperty("review_id")
          ? {
              color: FINISHED_SPOT_COLOR,
              dashArray: DASH_ARRAY,
              weight: BORDER_WIDTH,
              fillColor: SPOT_FILL_COLOR,
              fill: true,
            }
          : properties.hasOwnProperty("project_id") &&
            !properties.hasOwnProperty("review_id")
          ? {
              color: UNFINISHED_SPOT_COLOR,
              weight: BORDER_WIDTH,
              fillColor: SPOT_FILL_COLOR,
              fill: true,
            }
          : properties.hasOwnProperty("project_id") &&
            properties.hasOwnProperty("review_id")
          ? {
              color: FINISHED_SPOT_COLOR,
              weight: BORDER_WIDTH,
              fillColor: SPOT_FILL_COLOR,
              fill: true,
            }
          : {
              color: UNFINISHED_SPOT_COLOR,
              dashArray: DASH_ARRAY,
              weight: BORDER_WIDTH,
              fillColor: SPOT_FILL_COLOR,
              fill: true,
            };
      return symbol;
    },
  };

  let mvtOptions = {
    rendererFactory: L.canvas.tile, //L.canvas.tile L.svg.tile
    maxZoom: 20,
    minZoom: mvtMinzoom,
    vectorTileLayerStyles: mvtStyles,
    interactive: false,
    fetchOptions: {
      credentials: "same-origin",
      // headers: {
      //   Authorization: `Bearer ${accessToken()}`,
      // },
    },
    // bounds: gdBounds,
  };
  let layer = L.vectorGrid.protobuf(url, mvtOptions);
  layer.title = "扰动图斑";
  layer.picUrl = "./img/扰动图斑注记.png";
  return layer;
};

/**
 *返回防治分区的矢量瓦片L.vectorGrid.protobuf图层
 *
 * @param {*} options eg:createMVT({params:{ReviewPlanId:"9154521287203225610"}})-矢量瓦片查询参数
 * @return {*}
 */
var createFZFQMVT = function (options) {
  //构建查询参数
  let params = "";
  if (options && options.params) {
    params += `?${qs.stringify(options.params, { arrayFormat: "repeat" })}`;
  }
  let url = `${httpUrl.prevenzoneMvtUrl}/{z}/{x}/{y}${params}`;
  //矢量瓦片Options
  let mvtStyles = {
    preven_zone: function (properties, zoom) {
      let symbol = null;
      let width = 3;
      symbol = {
        color: "#66CC66",
        fillColor: "#66CC66",
        fillOpacity: 0,
        fill: true,
        opacity: 1,
        weight: width,
      };
      return symbol;
    },
  };
  let mvtOptions = {
    rendererFactory: L.canvas.tile, //L.canvas.tile L.svg.tile
    maxZoom: 20,
    minZoom: mvtMinzoom,
    vectorTileLayerStyles: mvtStyles,
    interactive: false,
    fetchOptions: {
      credentials: "same-origin",
      // headers: {
      //   Authorization: `Bearer ${accessToken()}`,
      // },
    },
  };
  let layer = L.vectorGrid.protobuf(url, mvtOptions);
  layer.title = "防治分区";
  layer.picUrl = "./img/防治分区注记.png";
  return layer;
};

/**
 *返回取弃土场的矢量瓦片L.vectorGrid.protobuf图层
 *
 * @param {*} options eg:createMVT({params:{ReviewPlanId:"9154521287203225610"}})-矢量瓦片查询参数
 * @return {*}
 */
var createQTQZMVT = function (options) {
  //构建查询参数
  let params = "";
  if (options && options.params) {
    params += `?${qs.stringify(options.params, { arrayFormat: "repeat" })}`;
  }
  let url = `${httpUrl.projectfocusMvtUrl}/{z}/{x}/{y}${params}`;
  //矢量瓦片Options
  let mvtStyles = {
    project_focus: function (properties, zoom) {
      let symbol = null;
      let width = 3;
      symbol = {
        color: "#FF00FF",
        fillColor: "#FF00FF",
        fillOpacity: 0,
        fill: true,
        opacity: 1,
        weight: width,
      };
      return symbol;
    },
  };
  let mvtOptions = {
    rendererFactory: L.canvas.tile, //L.canvas.tile L.svg.tile
    maxZoom: 20,
    minZoom: mvtMinzoom,
    vectorTileLayerStyles: mvtStyles,
    interactive: false,
    fetchOptions: {
      credentials: "same-origin",
      // headers: {
      //   Authorization: `Bearer ${accessToken()}`,
      // },
    },
  };
  let layer = L.vectorGrid.protobuf(url, mvtOptions);
  layer.title = "取弃土场";
  layer.picUrl = "./img/取弃土场注记.png";
  return layer;
};

/**
 *根据图层唯一id，从图层列表中获取对应图层
 *
 * @param {*} id
 * @param {*} layers
 * @return {*}
 */
var getLayer = (id, layers) => {
  for (let i = 0; i < layers.length; i++) {
    if (layers[i] && L.Util.stamp(layers[i]) === id) {
      return layers[i];
    }
  }
};

/**
 *地图缩放时，级别跨越设置的级数时，自动切换底图（移除已有底图，添加指定底图），自动切换添加或移除业务图层
 *eg:mapHelper.autoSwitchLayers(this.map, {
      baseLayerOptions: {
        level: 13,
        baseLayers: this.baseLayers,
        lowerLayers: [this.tdtVecLayer],
        higherLayers: [this.jgImgLayer],
      },
      overLayerOptions: {
        level: 13,
        lowerLayers: [],
        higherLayers: [this.spotMVT],
      },
    });
 * 
 * @param {*} map
 * @param {*} options {baseLayerOptions：{}，overLayerOptions：{}}
 * @return {*} 
 */
var autoSwitchLayers = (map, options) => {
  if (!map) {
    return;
  }

  let baseKeys, lowerKeys, higherKeys;
  if (options && options.baseLayerOptions && options.baseLayerOptions.level) {
    baseKeys = options.baseLayerOptions.baseLayers.map((item) => {
      return L.Util.stamp(item);
    });
    lowerKeys = options.baseLayerOptions.lowerLayers.map((item) => {
      return L.Util.stamp(item);
    });
    higherKeys = options.baseLayerOptions.higherLayers.map((item) => {
      return L.Util.stamp(item);
    });
  }

  map.on(
    "zoomend",
    () => {
      ////禁用机制：使用历史影像、卷帘对比时，禁用底图、业务图层自动切换
      if (
        mapHelper.currentTool === "tool-history" ||
        mapHelper.currentTool === "tool-sidebyside"
      ) {
        return;
      }

      let lastZoom = map.lastZoom ? map.lastZoom : 9;
      //处理底图图层
      if (
        options &&
        options.baseLayerOptions &&
        options.baseLayerOptions.level
      ) {
        let lastZoom = map.lastZoom ? map.lastZoom : 9;
        let layer;
        if (
          map._zoom < options.baseLayerOptions.level &&
          lastZoom >= options.baseLayerOptions.level
        ) {
          baseKeys.forEach((item) => {
            if (lowerKeys.indexOf(item) < 0) {
              layer = getLayer(item, options.baseLayerOptions.baseLayers);
              if (map.hasLayer(layer)) {
                map.removeLayer(layer);
              }
            } else {
              layer = getLayer(item, options.baseLayerOptions.baseLayers);
              if (!map.hasLayer(layer)) {
                map.addLayer(layer);
              }
            }
          });
        }

        if (
          map._zoom >= options.baseLayerOptions.level &&
          lastZoom < options.baseLayerOptions.level
        ) {
          baseKeys.forEach((item) => {
            if (higherKeys.indexOf(item) < 0) {
              layer = getLayer(item, options.baseLayerOptions.baseLayers);
              if (map.hasLayer(layer)) {
                map.removeLayer(layer);
              }
            } else {
              layer = getLayer(item, options.baseLayerOptions.baseLayers);
              if (!map.hasLayer(layer)) {
                map.addLayer(layer);
              }
            }
          });
        }
      }

      //处理业务图层overLayers
      if (
        options &&
        options.overLayerOptions &&
        options.overLayerOptions.level
      ) {
        if (
          map._zoom < options.overLayerOptions.level &&
          lastZoom >= options.overLayerOptions.level
        ) {
          options.overLayerOptions.higherLayers.forEach((item) => {
            if (map.hasLayer(item)) {
              map.removeLayer(item);
            }
          });
          options.overLayerOptions.lowerLayers.forEach((item) => {
            if (!map.hasLayer(item)) {
              map.addLayer(item);
            }
          });
        }

        if (
          map._zoom >= options.overLayerOptions.level &&
          lastZoom < options.overLayerOptions.level
        ) {
          options.overLayerOptions.lowerLayers.forEach((item) => {
            if (map.hasLayer(item)) {
              map.removeLayer(item);
            }
          });
          options.overLayerOptions.higherLayers.forEach((item) => {
            if (!map.hasLayer(item)) {
              map.addLayer(item);
            }
          });
        }
      }

      map.lastZoom = map._zoom;
    },
    { name: "autoSwitchLayers" }
  );
};

/**
 *
 * 复制单行内容到粘贴板
 * @param {*} content 需要复制的内容
 * @param {*} message 复制完后的提示，不传则默认提示"复制成功"
 */
function copyToClip(content, message) {
  var aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  if (message === null) {
  } else {
  }
}

function unionBounds(arrBounds) {
  let latlngs = null;
  if (arrBounds.length > 0) {
    latlngs = L.latLngBounds(arrBounds[0]);
    arrBounds.forEach((item) => {
      let tmpLatlngs = L.latLngBounds(item);
      latlngs.extend(tmpLatlngs);
    });
  }
  return latlngs;
}

const mapHelper = {
  gdBounds,
  homeMap,
  qyjgMap,
  oneMap,
  locationMap,
  dtjcMap,
  currentTool,
  status,
  districtList,
  accountDistrict,
  createScale,
  createZoominfo,
  createMiniMap,
  createHomeButton,
  createGovernSpotMVT,
  createTdtVec,
  createTdtImg,
  createTdtCia,
  createMapboxMVT,
  createOsmVec,
  createJgImg,
  createTdtTer,
  createGoogleTerPbf,
  createMapboxTer,
  createGoogleTer,
  createArcgisTer,
  createArcgisImg,
  createGeoqVec,
  createTdtIbo,
  creatBoundaryLayer,
  createProjectMVT,
  createSpotMVT,
  createFZFQMVT,
  createQTQZMVT,
  createGovernDynamic2018,
  createGovernDynamic2019,
  createGovernDynamic2020,
  createGD2Zone,
  autoSwitchLayers,
  copyToClip,
  bbox2latLngBounds,
  valid,
  unionBounds,
};

export default mapHelper;
export { valid, unionBounds };
