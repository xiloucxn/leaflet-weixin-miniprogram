import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as turf from "@turf/turf";
import { default as proj4 } from "proj4";
import { message } from "antd";

var parse = require('wellknown');

export function deepCopyGeojson(geojson) {
  // 将 GeoJSON 对象转换为字符串
  const jsonString = JSON.stringify(geojson);

  // 将字符串解析为新的 GeoJSON 对象
  const copiedGeojson = JSON.parse(jsonString);

  return copiedGeojson;
}

export function removeLargestFeatureByArea(featureCollection) {
  let _featureCollection = this.deepCopyGeojson(featureCollection);
  // 初始化最大面积和对应的特征索引
  let maxArea = 0;
  let maxAreaIndex = -1;

  // 遍历特征集合中的每个特征
  _featureCollection.features.forEach((feature, index) => {
    // 获取特征的面积
    const area = feature.properties.area || 0;

    // 检查是否为最大面积
    if (area > maxArea) {
      maxArea = area;
      maxAreaIndex = index;
    }
  });

  // 如果找到最大面积的特征
  if (maxAreaIndex !== -1) {
    // 从特征集合中移除最大面积的特征
    _featureCollection.features.splice(maxAreaIndex, 1);
  }

  // 返回更新后的特征集合
  return _featureCollection;
}

export function calculatefeatureCollectionArea(featureCollection) {
  let _featureCollection = this.deepCopyGeojson(featureCollection);
  // 遍历特征集合中的每个特征
  _featureCollection.features.forEach((feature) => {
    // 计算特征的面积
    const area = turf.area(feature);

    // 将面积值添加到特征的属性中
    feature.properties = {
      ...feature.properties,
      area: area,
    };
  });

  // 返回更新后的特征集合
  return _featureCollection;
}

export function itemsToFeatureCollection(items = []) {
  let FeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };
  if (!Array.isArray(items)) {
    return null;
  }
  items.forEach((item) => {
    try {
      let geojson = this.objToFeature(item);
      if (geojson.geometry) {
        FeatureCollection.features.push(geojson);
      }
    } catch (error) {
      console.error("Function execution failed:", item, error);
    }
  });
  return FeatureCollection;
}

export function objToFeature(obj = {}) {
  let geojsonFeature = {
    type: "Feature",
    properties: {},
    geometry: null,
  };

  let wkt =
    obj.geometry ||
    obj.geom ||
    obj.wktGeom ||
    obj.polygon ||
    obj.point ||
    obj.line;
  geojsonFeature.properties = { ...obj };
  if (!wkt) {
    //wkt不存在时，可能为点数据
    let { pointX, pointY, projectPoint } = obj;
    if (projectPoint && !pointX) {
      [pointX, pointY] = projectPoint.split(/[，,]/);
      pointX = parseFloat(pointX);
      pointY = parseFloat(pointY);
    }
    if (pointX && pointY) {
      obj = { ...obj, pointX, pointY };
      geojsonFeature = createPointFeature(obj);
    } else {
      console.log("objToFeature，该数据缺少空间信息：", obj);
    }
  } else {
    geojsonFeature.properties = { ...obj };
    geojsonFeature.geometry = this.wktToGeoJSON(wkt);
  }

  return geojsonFeature;
}

export function wktToGeoJSON(wktString) {
    // 返回GeoJSON对象
    return parse(wktString);
}

export function geoJSONToWkt(geojsonGeometry) {
  if (!isValidGeoJSON(geojsonGeometry)) {
    return null;
  }
  if (geojsonGeometry?.type === "FeatureCollection") {
    geojsonGeometry = geojsonGeometry.features[0];
  }
  const _geojsonGeometry = geojsonGeometry.geometry || geojsonGeometry;
  const geometry = wkx.Geometry.parseGeoJSON(_geojsonGeometry);
  const wkt = geometry.toWkt();
  return wkt;
}

export function geojsonToBbox(geojson) {
  return turf.bbox(geojson);
}

export function bbox2latLngBounds(bbox) {
  let latLngBounds = [
    [bbox[1], bbox[0]],
    [bbox[3], bbox[2]],
  ];
  return latLngBounds;
}
export function geojsonTolatLngBounds(geojson) {
  let bbox = this.geojsonToBbox(geojson);
  let latLngBounds = this.bbox2latLngBounds(bbox);
  return latLngBounds;
}

export function lngLatToLatLngPoint(lngLatPoint) {
  let _lngLatPoint = { ...lngLatPoint };
  if (lngLatPoint.geometry) {
    _lngLatPoint = lngLatPoint.geometry.coordinates;
  }
  return [_lngLatPoint[1], _lngLatPoint[0]];
}

export function flattenMultiPolygon(geojson) {
  // 导入所需的 Turf.js 函数
  const { featureEach, polygon } = turf;

  // 创建一个新的特征集合用于存储打散后的多边形特征
  const flattenedFeatures = [];

  // 遍历 GeoJSON 特征集合中的每个特征
  featureEach(geojson, function (feature) {
    // 检查特征的几何类型是否为 MultiPolygon
    if (feature.geometry.type === "MultiPolygon") {
      // 遍历 MultiPolygon 的每个子多边形
      feature.geometry.coordinates.forEach(function (polygonCoords) {
        // 创建单独的 Polygon 特征
        const polygonFeature = polygon(polygonCoords, feature.properties);

        // 将单独的 Polygon 特征添加到特征集合中
        flattenedFeatures.push(polygonFeature);
      });
    } else {
      // 如果特征不是 MultiPolygon，则直接将其添加到特征集合中
      flattenedFeatures.push(feature);
    }
  });

  // 创建新的 GeoJSON 对象，并设置特征集合为打散后的多边形特征
  const flattenedGeojson = {
    type: "FeatureCollection",
    features: flattenedFeatures,
  };

  return flattenedGeojson;
}

export function featuresToFeatureCollection(features) {
  // 创建一个新的 FeatureCollection 对象
  const featureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  // 将每个 Feature 添加到 FeatureCollection 的 features 数组中
  features.forEach((feature) => {
    featureCollection.features.push(feature);
  });

  return featureCollection;
}

export function featurecollectionToItems(featureCollection) {
  if (!featureCollection || !featureCollection.features) {
    return [];
  }

  return featureCollection.features.map((feature) => {
    const { type, properties, geometry } = feature;
    const wkt = geoJSONToWkt(geometry);
    return {
      type: type,
      ...properties,
      geometry: wkt,
    };
  });
}

export function polygonsToMultiPolygonFeature(polygonFeatures) {
  const multiPolygonFeature = {
    type: "Feature",
    geometry: {
      type: "MultiPolygon",
      coordinates: [],
    },
    properties: {},
  };

  polygonFeatures.forEach((polygonFeature) => {
    const _polygonFeature = { ...polygonFeature };
    Object.assign(multiPolygonFeature.properties, _polygonFeature.properties);
    multiPolygonFeature.geometry.coordinates.push(
      _polygonFeature.geometry.coordinates,
    );
  });

  return multiPolygonFeature;
}

export function multiPolygonToPolygonFeatures(multiPolygonFeature) {
  if (!isValidGeoJSON(multiPolygonFeature)) {
    return;
  }

  const polygonFeatures = [];

  multiPolygonFeature.geometry.coordinates.forEach((coordinate) => {
    const polygonFeature = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: coordinate,
      },
      properties: { ...multiPolygonFeature.properties },
    };
    polygonFeatures.push(polygonFeature);
  });

  return polygonFeatures;
}

export function intersect(geojson, featureCollection) {
  // const inFeature = turf.feature(geojson);

  if (!isValidGeoJSON(geojson) || !isValidGeoJSON(featureCollection)) {
    return false;
  }
  const inFeature = geojson;
  const intersectionFeatures = [];

  turf.featureEach(featureCollection, (feature) => {
    //如果inFeature是Point则用turf.booleanPointInPolygon

    let intersection = null;
    if (inFeature.geometry.type === "Point") {
      intersection = turf.booleanPointInPolygon(inFeature, feature);
    } else {
      // //polygon则用turf.intersect方法
      // const intersection = turf.intersect(inFeatureGeometry, featureGeometry);
      intersection = turf.intersect(inFeature, feature);
    }
    if (intersection) {
      intersectionFeatures.push(feature);
    }
  });

  if (intersectionFeatures.length === 0) {
    return null; // 如果没有相交结果，返回null或者其他适当的默认值
  }

  const intersectionFeatureCollection = turf.featureCollection(
    intersectionFeatures,
  );
  return intersectionFeatureCollection;
}

export function isValidGeoJSON(geojson) {
  //   // 示例用法
  // const geojson1 = {
  //   type: 'Point',
  //   coordinates: [0, 0]
  // };
  // console.log(isValidGeoJSON(geojson1)); // 输出: true，有效的 GeoJSON 对象

  // const geojson2 = {
  //   type: 'InvalidType',
  //   coordinates: [0, 0]
  // };
  // console.log(isValidGeoJSON(geojson2)); // 输出: false，无效的 GeoJSON 对象

  if (!geojson) {
    //geojson===null
    return;
  }

  if (typeof geojson !== "object") {
    return false; // 不是对象类型，无效
  }

  if (!geojson.type || typeof geojson.type !== "string") {
    return false; // 缺少或无效的类型属性，无效
  }

  const validTypes = [
    "Point",
    "MultiPoint",
    "LineString",
    "MultiLineString",
    "Polygon",
    "MultiPolygon",
    "GeometryCollection",
    "Feature",
    "FeatureCollection",
  ];
  if (!validTypes.includes(geojson.type)) {
    return false; // 无效的类型值，无效
  }

  if (geojson.type === "Feature") {
    if (!geojson.geometry || typeof geojson.geometry !== "object") {
      return false; // 缺少或无效的几何对象，无效
    }
    return isValidGeoJSON(geojson.geometry); // 递归判断几何对象是否有效
  }

  if (geojson.type === "FeatureCollection") {
    if (
      !geojson.features ||
      !Array.isArray(geojson.features) ||
      geojson.features.length === 0
    ) {
      return false; // 缺少或无效的要素集合，无效
    }
    return geojson.features.every((feature) => isValidGeoJSON(feature)); // 递归判断每个要素是否有效
  }

  return true; // 其他类型的 GeoJSON 对象都被视为有效
}

/**
 *
 *
 * @export
 * @param {*} point Array [x,y]
 * @return {*}
 */
export function proj4from3857to4326(point) {
  //坐标转换参数
  const fromProjection =
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
  const toProjection = "+proj=longlat +datum=WGS84 +no_defs";

  return proj4(fromProjection, toProjection, point);
}

export function cutPolygonByPolygon(sourcePolygon, cutPolygon) {
  //1.面相交求交集
  const intersect = turf.intersect(sourcePolygon, cutPolygon);
  //2.面相减求裁剪后区域
  const difference = turf.difference(sourcePolygon, cutPolygon);
  const cutPolygons = { intersect, difference };
  return cutPolygons;
}

export function cutPolygonByPolygonGpt(sourcePolygon, cutPolygon) {
  //1.面相交求交集
  const intersect = turf.intersect(sourcePolygon, cutPolygon);
  //2.面相减求裁剪后区域
  const difference = turf.difference(sourcePolygon, cutPolygon);
  const cutPolygons = { intersect, difference };
  return cutPolygons;
}

export function geoJSONLayerToFeature(geojsonLayer) {
  let feature = null;
  const featureCollection = geojsonLayer?.toGeoJSON();
  if (isValidGeoJSON(featureCollection)) {
    feature = featureCollection.features[0];
  }
  return feature;
}

export function getCenterInFeature(feature) {
  // 获取图形的中心点
  const centerPoint = turf.center(feature);

  // 检查中心点是否在图形内部
  if (turf.booleanPointInPolygon(centerPoint, feature)) {
    return centerPoint;
  }

  // 中心点不在图形内部，获取图形上的点
  const pointOnFeature = turf.pointOnFeature(feature);

  return pointOnFeature;
}

export function editLayerToMultiPolygon(editLayer) {
  let feature = editLayer.toGeoJSON();
  if (feature.type === "FeatureCollection") {
    feature = feature.features[0];
  }
  //接口只支持MultiPolygon，如果feature是polygon则转为MultiPolygon
  if (feature.geometry.type === "Polygon") {
    feature = polygonsToMultiPolygonFeature([feature]);
  }
  //不支持多部件的MultiPolygon
  if (feature.geometry.coordinates.length > 1) {
    message.info("只支持单个图斑，不支持多部件，请删除多余图斑！");
    feature = null;
  }
  return feature;
}

export function createPointFeature(args) {
  const { pointX, pointY } = args;
  const feature = {
    type: "Feature",
    properties: { ...args },
    geometry: {
      type: "Point",
      coordinates: [pointX, pointY],
    },
  };
  if (!isValidGeoJSON(feature)) {
    return null;
  }
  return feature;
}
