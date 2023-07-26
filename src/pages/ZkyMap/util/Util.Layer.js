import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.vectorgrid"; //矢量瓦片
import * as qs from "qs";

var mvtMinzoom = 1; //矢量瓦片最小显示级别
//根据域名，如果是委里域名，http://210.76.84.25/，则mvtMinzoom从1改为11。
if (
  window.location.hostname.indexOf("210.76.84.25") > -1 ||
  window.location.hostname.indexOf("stbc.gdwater.gov.cn") > -1
) {
  mvtMinzoom = 11;
}

export function createVectorGridSlicer(geojson, options) {
  const _options = {
    rendererFactory: L.svg.tile,
    vectorTileLayerStyles: { sliced: { weight: 2, color: "red" } },
    interactive: true,
    maxZoom: 20,
    minZoom: 3,
  };
  L.Util.extend(_options, options);
  let slicerLayer;
  slicerLayer = L.vectorGrid.slicer(geojson, _options);
  return slicerLayer;
}

/**
 *创建扰动图斑的矢量瓦片L.vectorGrid.protobuf图层
 *
 * @param {*} options e.g.createMVT({params:{ReviewPlanId:"9154521287203225610"}})-矢量瓦片查询参数
 * @return {*}
 */
export function createInterSpotMVT(url, options) {
  const _options = {};
  L.Util.extend(_options, options);

  const style = {
    fillOpacity: 0, //填充透明度
    color: "#FECD78", //边框颜色
    opacity: 1, //边框透明度
    weight: 2, //边框宽度
  };

  //矢量瓦片Options
  let mvtStyles = {
    interspot: function (properties, zoom) {
      // console.log("图斑矢量瓦片属性:", properties);
      let symbol = null;
      symbol = style;
      return symbol;
    },
    spot: function (properties, zoom) {
      // console.log("图斑矢量瓦片属性:", properties);
      let symbol = null;
      symbol = style;
      return symbol;
    },
  };

  let mvtOptions = {
    rendererFactory: L.canvas.tile, //L.canvas.tile L.svg.tile
    maxZoom: 20,
    minZoom: 3,
    pane: "overlayPane",
    vectorTileLayerStyles: mvtStyles,
    interactive: true,
    fetchOptions: {
      credentials: "same-origin",
      // headers: {
      //   Authorization: `Bearer ${accessToken()}`,
      // },
    },
    // bounds: gdBounds,
  };
  let layer = L.vectorGrid.protobuf(url, mvtOptions);
  // layer.title = "扰动图斑";
  // layer.picUrl = "./img/扰动图斑注记.png";
  // layer.on("click", (e) => {
  //   console.log("点查结果", e);
  // });
  return layer;
}

/**
 *创建天地图矢量电子地图（矢量+注记）的L.layerGroup图层
 *
 * @return {*}
 */
export function createTdtVec(options) {
  const tdtVec = L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 18,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    },
  );

  const tdtCva = L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 18,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    },
  );

  const tdtVecLG = L.layerGroup([tdtVec, tdtCva]);
  tdtVecLG.title = "天地图街道";
  tdtVecLG.picUrl = "./img/天地图矢量.png";
  return tdtVecLG;
}

/**
 *创建天地图影像（不带注记）的L.tileLayer图层
 *
 * @return {*}
 */
export function createTdtImg(options) {
  const layer = L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 18,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    },
  );
  layer.title = "天地图影像";
  layer.picUrl = "./img/天地图影像.png";
  return layer;
}

/**
 *创建天地图影像注记的L.tileLayer图层
 *
 * @return {*}
 */
export function createTdtCia(options) {
  const layer = L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 18,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    },
  );
  layer.title = "路网注记";
  layer.picUrl = "./img/注记图标.png";
  return layer;
}

/**
 *创建天地图地形晕渲图的L.tileLayer图层
 *
 * @return {*}
 */
export function createTdtTer(options) {
  const layer = L.tileLayer(
    `https://t{s}.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 12,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    },
  );
  layer.title = "天地图地形";
  layer.picUrl = "./img/天地图地形.png";
  return layer;
}

/**
 *创建监管影像的L.tileLayer图层
 *
 * @return {*}
 */
export function createJgImg(options) {
  const layer = L.tileLayer(
    `${window.location.protocol}//www.stbcjg.cn/BasemapService/rest/image/latest/tile/{z}/{y}/{x}`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 17,
      subdomains: ["a"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    },
  );
  layer.title = "监管影像";
  layer.picUrl = "./img/监管影像.png";
  return layer;
}

/**
 *创建ArcGIS影像的L.tileLayer图层
 *
 * @return {*}
 */
export function createArcgisImg(options) {
  const layer = L.tileLayer(
    `https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 17,
      subdomains: ["a"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    },
  );
  layer.title = "ArcGIS影像";
  layer.picUrl = "./img/ArcGIS影像.png";
  return layer;
}

/**
 *创建ArcGIS地形图的L.tileLayer图层
 *
 * @return {*}
 */
export function createArcgisTer(options) {
  const layer = L.tileLayer(
    `https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}`,
    {
      minZoom: 0,
      maxZoom: 20,
      maxNativeZoom: 12,
      subdomains: ["a"],
      errorTileUrl: "./img/errorTileUrl.png",
      ...options,
    },
  );
  layer.title = "ArcGIS地形图";
  layer.picUrl = "./img/ArcGIS影像.png";
  return layer;
}


/**
 *创建治理图斑的矢量瓦片L.vectorGrid.protobuf图层
 *
 * @param {*} options e.g.createMVT({params:{YEAR:2020}})-矢量瓦片查询参数
 * @return {*}
 */
export function createGovernSpotMVT(options) {
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
}

/**
 *创建项目红线的矢量瓦片L.vectorGrid.protobuf图层
 *
 * @param {*} options e.g.createMVT({params:{ReviewPlanId:"9154521287203225610"}})-矢量瓦片查询参数
 * @return {*}
 */
export function createProjectMVT(options) {
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
}

/**
 *创建扰动图斑的矢量瓦片L.vectorGrid.protobuf图层
 *
 * @param {*} options e.g.createMVT({params:{ReviewPlanId:"9154521287203225610"}})-矢量瓦片查询参数
 * @return {*}
 */
export function createSpotMVT(options) {
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
    interactive: true,
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
  layer.on("click", (e) => {
    console.log("点查结果", e);
  });
  return layer;
}

/**
 *创建防治分区的矢量瓦片L.vectorGrid.protobuf图层
 *
 * @param {*} options e.g.createMVT({params:{ReviewPlanId:"9154521287203225610"}})-矢量瓦片查询参数
 * @return {*}
 */
export function createFZFQMVT(options) {
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
}

/**
 *创建取弃土场的矢量瓦片L.vectorGrid.protobuf图层
 *
 * @param {*} options e.g.createMVT({params:{ReviewPlanId:"9154521287203225610"}})-矢量瓦片查询参数
 * @return {*}
 */
export function createQTQZMVT(options) {
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
}
