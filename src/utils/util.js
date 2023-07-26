import coordtransform from 'coordtransform';

// 国测局转wgs84
const gcj02towgs84 = (longitude, latitude) => {
  const v = coordtransform.gcj02towgs84(longitude, latitude);
  return v;
};

// wgs84转国测局
const wgs84togcj02 = (longitude, latitude) => {
  const v = coordtransform.wgs84togcj02(longitude, latitude);
  return v;
};

// 百度坐标系转高德经纬度
const bd09togcj02LatLng = (latlng) => {
  // 百度经纬度坐标转国测局坐标
  const bd09togcj02 = coordtransform.bd09togcj02(latlng.lng, latlng.lat);

  // eslint-disable-next-line
  return L.latLng(bd09togcj02[1], bd09togcj02[0]);
};

// 百度坐标系转wgs84经纬度
const bd09toWgs84LatLng = (latlng) => {
  // 百度经纬度坐标转国测局坐标
  const bd09togcj02 = coordtransform.bd09togcj02(latlng.lng, latlng.lat);

  // 国测局坐标转wgs84坐标
  const gcj02towgs84 = coordtransform.gcj02towgs84(
    bd09togcj02[0],
    bd09togcj02[1]
  );

  // eslint-disable-next-line
  return L.latLng(gcj02towgs84[1], gcj02towgs84[0]);
};

// wgs84经纬度转百度坐标系
const wgs84toBd09LatLng = (latlng) => {
  // wgs84坐标转国测局坐标
  const wgs84togcj02 = coordtransform.wgs84togcj02(latlng.lng, latlng.lat);

  // 国测局坐标转百度经纬度
  const gcj02tobd09 = coordtransform.gcj02tobd09(
    wgs84togcj02[0],
    wgs84togcj02[1]
  );

  // eslint-disable-next-line
  return L.latLng(gcj02tobd09[1], gcj02tobd09[0]);
};

/**
 * 把句子中的关键字加粗。如“明天，下暴雨，请带伞”变成“明天，下<b>暴雨</b>，请带伞”
 *
 * @param {*} text
 * @param {*} keywords
 * @return {*}
 */
function emphasizeKeywords(text, keywords) {
  // 将关键词数组转换为以竖线（|）分隔的正则表达式
  const regex = new RegExp(keywords.join('|'), 'gi');

  // 使用 replace 方法替换匹配到的关键词，使用 <b> 标签加粗显示
  const emphasizedText = text.replace(
    regex,
    '<span style="font-weight: bold; color: red;">$&</span>'
  );

  return emphasizedText;
}

const getLabel = (v = "", list = [], label = "label", value = "value") => {
  if (v || v === 0 || v === false) {
    const result = list.filter((i) => i[value] === v);
    return result.length ? result[0][label] : "";
  } else {
    return "";
  }
};

const toPercent = (v, bit = 2) => {
  const result = v ? (v * 100).toFixed(bit) + "%" : "";
  return result;
};

export default {
  bd09toWgs84LatLng,
  wgs84toBd09LatLng,
  gcj02towgs84,
  bd09togcj02LatLng,
  emphasizeKeywords,
  getLabel,
  toPercent
};
