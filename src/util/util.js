import coordtransform from 'coordtransform'

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

  export default {
    bd09toWgs84LatLng,
    wgs84toBd09LatLng,
    gcj02towgs84,
    bd09togcj02LatLng
  }