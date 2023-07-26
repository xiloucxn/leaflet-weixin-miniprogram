import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as Geom from "./Util.Geom";
import proj4 from "proj4";
import * as turf from "@turf/turf";

/**
 * 经纬度字符串转度
 *
 * @param {*} input string
 * @return {*} float
 * @示例var input = "13°5′23.564″";var degrees = convertToDegrees(input);
 *  输出: 13.08987888888889
 */
function stringToDegrees(input) {
  // 使用正则表达式提取度、分、秒的值
  var regex = /([\d.]+)°([\d.]+)′([\d.]+)″/;
  var matches = input.match(regex);

  if (matches && matches.length === 4) {
    // 将提取的值转换为数字
    var degrees = parseFloat(matches[1]);
    var minutes = parseFloat(matches[2]);
    var seconds = parseFloat(matches[3]);

    // 计算度的值
    var degreesValue = degrees + minutes / 60 + seconds / 3600;

    return degreesValue;
  }

  // 如果无法匹配输入格式，则返回 null 或适当的错误提示
  return null;
}

export function numberToLetter(number) {
  if (number < 1 || number > 26) {
    return "";
  }

  return String.fromCharCode(64 + number);
}

export function letterToNumber(letter) {
  if (letter.length !== 1) {
    return 0;
  }

  const charCode = letter.charCodeAt(0);
  if (charCode < 65 || charCode > 90) {
    return 0;
  }

  return charCode - 64;
}

/**
 * 数字变成固定长度的字符
 *
 * @param {*} number
 * @param {*} length
 * @param {string} [chart='0']
 * @return {*}
 * @示例
 * numberToPaddedString(123, 6,'N') return 'NNN123'
 */
export function numberToPaddedString(number, length, chart = "0") {
  let str = number.toString();
  while (str.length < length) {
    str = chart + str;
  }
  return str;
}

export function calculate1000000TopographicMapSheet(longitude, lattitude) {
  let mapSheet;
  let a, b, lng, lat;
  lat = lattitude;
  lng = longitude;
  a = Math.floor(lattitude / 4) + 1;
  a = numberToLetter(a);
  b = Math.floor(longitude / 6) + 31;
  mapSheet = `${a}${b}`;
  return mapSheet;
}

export function calculate5000TopographicMapSheet(longitude, lattitude) {
  let mapSheet;
  let a, b, c, d, lng, lat, deltaLng, deltaLat;
  lat = lattitude;
  lng = longitude;
  deltaLat = stringToDegrees(`0°1′15″`);
  deltaLng = stringToDegrees(`0°1′52.5″`);
  a = numberToLetter(Math.floor(lattitude / 4) + 1);
  b = Math.floor(longitude / 6) + 31;
  c = 4 / deltaLat - Math.floor((lattitude % 4) / deltaLat);
  d = Math.floor((longitude % 6) / deltaLng) + 1;
  c = numberToPaddedString(c, 3);
  d = numberToPaddedString(d, 3);
  let sheetChar = "H";
  mapSheet = `${a}${b}${sheetChar}${c}${d}`;
  return mapSheet;
  // calculate5000TopographicMapSheet示例：
  // let lngStirng=`114°33′45.05″`,latString='39°22′30.07″'
  // let lng=stringToDegrees(lngStirng);
  // let lat=stringToDegrees(latString)
  // console.log(lngStirng,',',latString,':',calculate1000000TopographicMapSheet(lng,lat))
  // console.log(lngStirng,',',latString,':',calculate5000TopographicMapSheet(lng,lat))
}

export function calculate5000TopographicMapSheets(geojson) {
  let _geojson = geojson;
  if (Geom.isValidGeoJSON(_geojson) === false) {
    return false;
  }
  let bbox = Geom.geojsonToBbox(_geojson);
  let mapSheetsFeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };
  const mapSheets = [];
  let bboxFeatures = {
    type: "FeatureCollection",
    features: [],
  };
  let left = bbox[0],
    bottom = bbox[1],
    right = bbox[2],
    top = bbox[3];
  let deltaLng, deltaLat;
  deltaLat = stringToDegrees(`0°1′15″`);
  deltaLng = stringToDegrees(`0°1′52.5″`);
  let gridLeft = left - (left % deltaLng);
  let gridBottom = bottom - (bottom % deltaLat);
  for (let lat = gridBottom; lat < top; lat += deltaLat) {
    for (let lng = gridLeft; lng < right; lng += deltaLng) {
      const gridFeature = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [],
        },
        properties: {},
      };
      gridFeature.geometry.coordinates = [
        [
          [lng, lat],
          [lng + deltaLng, lat],
          [lng + deltaLng, lat + deltaLat],
          [lng, lat + deltaLat],
          [lng, lat],
        ],
      ];

      const centerPt = turf.centroid(gridFeature);
      let mapSheet = calculate5000TopographicMapSheet(
        centerPt.geometry.coordinates[0],
        centerPt.geometry.coordinates[1],
      );
      mapSheets.push(mapSheet);
      gridFeature.properties = {
        name: mapSheet,
        mapSheet: mapSheet,
        bbox: [lng, lat, lng + deltaLng, lat + deltaLat],
      };
      bboxFeatures.features.push(gridFeature);
    }
  }
  // 计算真实相交的格网，用turf.intersect
  mapSheetsFeatureCollection = Geom.intersect(_geojson, bboxFeatures);
  return mapSheetsFeatureCollection;
  // calculate5000TopographicMapSheets示例：
  // let geojson = {
  //   "type": "FeatureCollection",
  //   "features": [
  //     {
  //       "type": "Feature",
  //       "properties": {},
  //       "geometry": {
  //         "coordinates": [
  //           [
  //             [
  //               113.14150153410367,
  //               24.88233476739039
  //             ],
  //             [
  //               111.4733313965346,
  //               24.09131842460131
  //             ],
  //             [
  //               111.28895469711966,
  //               23.343764539960986
  //             ],
  //             [
  //               111.79818558121906,
  //               22.600083379993904
  //             ],
  //             [
  //               113.47513556161721,
  //               22.7944808575522
  //             ],
  //             [
  //               114.7745523003536,
  //               23.238928149091336
  //             ],
  //             [
  //               114.68675387206133,
  //               24.395528491669893
  //             ],
  //             [
  //               114.46725780132869,
  //               24.850471287432697
  //             ],
  //             [
  //               113.14150153410367,
  //               24.88233476739039
  //             ]
  //           ]
  //         ],
  //         "type": "Polygon"
  //       }
  //     }
  //   ]
  // }
  // calculate5000TopographicMapSheets(geojson)
}

export function extractAndConvertParts(str) {
  //示例console.log(extractAndConvertParts('F49H071191'))
  const regex = /([A-Z]+)(\d+)([A-Z]+)(\d{3})(\d{3})/;
  const matches = str.match(regex);

  if (!matches || matches.length !== 6) {
    return [];
  }

  const [, part1, part2, part3, part4, part5] = matches;

  return [
    letterToNumber(part1),
    parseInt(part2),
    part3,
    parseInt(part4),
    parseInt(part5),
  ];
}

/**
 *由图幅号计算左下角点坐标
 *
 * @export
 * @param {*} sheet string
 * @return {*} geojsonFeature
 */
export function mapSheetToBottomLeftPoint(sheet) {
  let bottomLeftPoint;
  let left, bottom;
  let deltaLat, deltaLng;
  deltaLat = stringToDegrees(`0°1′15″`);
  deltaLng = stringToDegrees(`0°1′52.5″`);

  if (sheet.length !== 10) {
    return;
  }

  const arrSheetSplit = extractAndConvertParts(sheet);
  let a, b, c, d;
  a = arrSheetSplit[0];
  b = arrSheetSplit[1];
  c = arrSheetSplit[3];
  d = arrSheetSplit[4];
  left = (b - 31) * 6 + (d - 1) * deltaLng;
  bottom = (a - 1) * 4 + (4 / deltaLat - c) * deltaLat;

  bottomLeftPoint = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [left, bottom],
    },
    properties: {
      sheet: sheet,
      deltaLat: deltaLat,
      deltaLng: deltaLng,
    },
  };
  return bottomLeftPoint;
}

export function mapSheetToFeature(sheet) {
  let feature = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [],
    },
    properties: {},
  };
  let bottomLeftPoint = mapSheetToBottomLeftPoint(sheet);
  let lng = bottomLeftPoint.geometry.coordinates[0];
  let lat = bottomLeftPoint.geometry.coordinates[1];
  let deltaLng = bottomLeftPoint.properties.deltaLng;
  let deltaLat = bottomLeftPoint.properties.deltaLat;
  feature.geometry.coordinates = [
    [
      [lng, lat],
      [lng + deltaLng, lat],
      [lng + deltaLng, lat + deltaLat],
      [lng, lat + deltaLat],
      [lng, lat],
    ],
  ];
  feature.properties = { ...bottomLeftPoint.properties };
  return feature;
  //示例代码
  // console.log(mapSheetToBottomLeftPoint("F49H071191"));
  // let feature = mapSheetToFeature("F49H071191");
  // console.log(feature);
  // console.log(calculate5000TopographicMapSheets(feature));
}
