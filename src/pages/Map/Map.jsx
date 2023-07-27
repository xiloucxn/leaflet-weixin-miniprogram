import React, { useEffect } from 'react';
import L, { geoJSON, latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapHelper from '../../utils/mapHelper';
import util from '../../utils/util';
import './Map.scss';
import jquery from 'jquery';
import { citiesPolyon } from './testData';
import * as turf from "@turf/turf";

// 插件
// import "../../components/Leaflet.Rainviewer/leaflet.rainviewer.css";
// import "../../components/Leaflet.Rainviewer/leaflet.rainviewer";
import '../../components/Leaflet.Rainviewer-master/leaflet.rainviewer.css';
import '../../components/Leaflet.Rainviewer-master/leaflet.rainviewer';
import '../../components/Leaflet.awesome-markers/leaflet.awesome-markers.css';
import '../../components/Leaflet.awesome-markers/leaflet.awesome-markers';
import '../../components/leaflet.canvas-markers/leaflet.canvas-markers';
import '../../components/Leaflet.curve-gh-pages/src/leaflet.curve';
import '../../components/leaflet-locatecontrol/L.Control.Locate.scss';
import '../../components/leaflet-locatecontrol/L.Control.Locate';
import 'leaflet-easybutton';
import '../../components/css/easy-button.css';

import ZkyMap from '../../pages/ZkyMap/ZkyMap';


const mapName = `map-test`;
var map;
var layersControl;
const $ = jquery;
const locateData = [];
var currentLocation = null;
const valid = mapHelper.valid;
const selectOne = ZkyMap.selectOne;

const publicUrl = process.env.PUBLIC_URL;
function Map(props) {
  useEffect(() => {
    map = L.map(mapName, { center: [23, 113], minNativeZoom: 1, zoom: 8 });
    map.name = mapName;

    // 添加图层组件
    layersControl = addLayers();

    map.on('click', function (e) {
      console.log('点击经纬度', e.latlng);
    });

    // 添加插件

    // // 经纬格网
    // new AutoGraticule().addTo(map);

    // 添加curve曲线
    addCurve();

    // 添加降雨图
    addRainviewer();

    // 添加canvasIcon
    addCanvasIconLayer();

    // 添加awesomeMarker
    addAwesomeMarker();

    // 添加locatecontrol
    addLocateControl();

    // 添加routeNavigate
    addRouteNavigate();

    // 添加homeButton
    addHomeButton();

    // 添加扰动图标
    addSpotLayer();

    // 数据转换
    dataTransform();

    map.defaultBounds = mapHelper.gdBounds;

    // 加载完成
    console.log('Map 初始化完成！');

    return () => {
      map?.remove();
      console.log('Map 卸载完成！');
    };
  }, []);

  const addLayers = () => {
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    const tdtVec = mapHelper.createTdtVec({ noWrap: true });
    const tdtImg = mapHelper.createTdtImg();
    const tdtCia = mapHelper.createTdtCia();
    const arcgisImg = mapHelper.createArcgisImg();

    tdtVec.addTo(map);

    const baseLayers = {
      天地图矢量: tdtVec,
      天地图影像: tdtImg,
      arcgis影像: arcgisImg,
      osm地图: osm,
    };
    const overLayers = { 注记: tdtCia };

    return L.control.layers(baseLayers, overLayers).addTo(map);
  };

  const addCurve = () => {
    const curveLG = L.layerGroup([]).addTo(map);

    layersControl.addOverlay(curveLG, 'curveLG');

    //use a mix of renderers
    var customPane = map.createPane('customPane');
    var canvasRenderer = L.canvas({ pane: 'customPane' });
    customPane.style.zIndex = 399; // put just behind the standard overlay pane which is at 400

    //动画面
    var path5 = L.curve(
      [
        'M',
        [23.548880923858757, 113.7139892578125],
        'C',
        [23.669681880942314, 113.82385253906251],
        [23.427968862308678, 114.08752441406251],
        [23.553916518321625, 114.25231933593751],
        'L',
        [23.120153621695614, 114.26879882812501],
        [22.902743425252357, 113.96118164062501],
        [23.14541110372829, 113.64807128906251],
        'Z',
      ],
      {
        color: 'red',
        fill: true,
        renderer: canvasRenderer,
        animate: { delay: 300, duration: 10000, iterations: 113 },
      }
    ).addTo(curveLG);

    // 动画线
    var path6 = L.curve(
      [
        'M',
        [23.599228183239397, 112.18139648437501],
        'Q',
        [23.77026416023979, 112.45056152343751],
        [23.473323877771172, 112.67578125],
        'T',
        [23.624394569716923, 112.93945312500001],
      ],
      {
        animate: { delay: 300, duration: 5000, iterations: 113 },
        renderer: canvasRenderer,
      }
    ).addTo(curveLG);

    //quadratic bezier curve
    var pathOne = L.curve(
      [
        'M',
        [50.14874640066278, 14.106445312500002],
        'Q',
        [51.67255514839676, 16.303710937500004],
        [50.14874640066278, 18.676757812500004],
        'T',
        [49.866316729538674, 25.0927734375],
      ],
      { animate: 3000, renderer: canvasRenderer }
    );

    //cubic bezier curve (and straight lines)
    var pathTwo = L.curve(
      [
        'M',
        [50.54136296522163, 28.520507812500004],
        'C',
        [52.214338608258224, 28.564453125000004],
        [48.45835188280866, 33.57421875000001],
        [50.680797145321655, 33.83789062500001],
        'V',
        [48.40003249610685],
        'L',
        [47.45839225859763, 31.201171875],
        [48.40003249610685, 28.564453125000004],
        'Z',
        'M',
        [49.55372551347579, 29.465332031250004],
        'V',
        [48.7822260446217],
        'H',
        [33.00292968750001],
        'V',
        [49.55372551347579],
        'Z',
      ],
      {
        color: 'red',
        fill: true,
        renderer: canvasRenderer,
        animate: { delay: 500, duration: 10000, iterations: 113 },
      }
    );

    var pathThree = L.curve(
      [
        'M',
        [49.35375571830993, 6.240234375],
        'Q',
        [49.38237278700955, 9.843750000000002],
        [47.754097979680026, 9.360351562500002],
        [46.95026224218562, 6.635742187500001],
        [45.67548217560647, 8.437500000000002],
        [44.5278427984555, 5.5810546875],
        [45.85941212790755, 3.0761718750000004],
        [47.517200697839414, 4.218750000000001],
        [49.009050809382074, 3.7353515625000004],
        [48.45835188280866, 5.800781250000001],
        [48.8936153614802, 5.493164062500001],
        'Z',
      ],
      { fill: true, color: 'orange' }
    );

    pathThree.on('click', function (e) {
      console.log('path three clicked');
    });

    var pathFour = L.curve(
      [
        'M',
        [46.86019101567027, -29.047851562500004],
        'Q',
        [50.48547354578499, -23.818359375000004],
        [46.70973594407157, -19.907226562500004],
        'T',
        [46.6795944656402, -11.0302734375],
      ],
      { dashArray: '5', animate: { duration: 3000, iterations: Infinity } }
    );

    var pathFive = L.curve(
      [
        'M',
        [42.45588764197166, -20.126953125000004],
        'L',
        [50.48547354578499, -23.774414062500004],
        [47.96050238891509, -15.644531250000002],
        'Z',
      ],
      {
        color: 'red',
        fill: true,
        dashArray: '5',
        animate: { duration: 3000, iterations: Infinity, delay: 1000 },
      }
    );
  };

  const addRainviewer = () => {
    L.control
      .rainviewer({
        position: 'bottomleft',
        nextButtonText: '>',
        playStopButtonText: 'Play/Stop',
        prevButtonText: '<',
        positionSliderLabelText: 'Hour:',
        opacitySliderLabelText: 'Opacity:',
        animationInterval: 500,
        opacity: 0.5,
      })
      .addTo(map);
  };

  const addCanvasIconLayer = () => {
    // canvasIconLayer
    // var ciLayer = L.canvasIconLayer({}).addTo(map);

    const ciLayerLG = L.layerGroup([]).addTo(map);

    var ciLayer = L.canvasIconLayer({}).addTo(ciLayerLG);

    // layersControl.addOverlay(ciLayer,'ciLayer')
    layersControl.addOverlay(ciLayerLG, 'ciLayerLG');

    // 添加测试dom方法加载点位数据
    const jsonLG = L.layerGroup([]);
    layersControl.addOverlay(jsonLG, 'DOMLayer');

    ciLayer.addOnClickListener(function (e, data) {
      console.log(data);
    });
    ciLayer.addOnHoverListener(function (e, data) {
      console.log(data[0].data._leaflet_id);
    });

    var icon = L.icon({
      iconUrl: publicUrl + '/img/pothole.png',
      iconSize: [20, 18],
      iconAnchor: [10, 9],
    });

    var markers = [];
    for (var i = 0; i < 10000; i++) {
      var marker = L.marker(
        [23 + Math.random() * 1.8, 111 + Math.random() * 3.6],
        { icon: icon }
      ).bindPopup('I Am ' + i);
      markers.push(marker);
      jsonLG.addLayer(marker);
    }
    // ciLayer.addLayers(markers);

    // 用awesomemarker添加点
    const awesomMarker = (args) => {
      const { latLng, icon = 'icon-yiyuan' } = args;
      const markerIcon = L.AwesomeMarkers.icon({
        extraClasses: 'iconfont',
        prefix: 'icon',
        icon: icon,
        markerColor: 'red',
      });
      return L.marker(latLng, { icon: markerIcon });
    };
    $.ajax({
      url: 'data/geojson样例数据/nsKzd.json',
      dataType: 'json',
      success: function (data) {
        // 处理成功获取到的数据
        console.log(data);
        L.geoJSON(data, {
          pointToLayer: (point, latLng) => {
            // ciLayer.addMarker(
            //   awesomMarker({ latLng, icon: "icon-gaozhongliuxue" })
            // );
            // return awesomMarker({ latLng, icon: "icon-gaozhongliuxue" });
            let icon = L.icon({
              iconUrl: publicUrl + '/img/控制点.png',
              iconSize: [20, 18],
              iconAnchor: [10, 9],
            });
            let marker = L.marker(latLng, { icon: icon }).bindPopup(
              'I Am ' + point.properties.工程名
            );
            markers.push(marker);
            jsonLG.addLayer(marker);
          },
        });
        ciLayer.addLayers(markers);
        map.removeLayer(ciLayerLG);
      },
      error: function (xhr, status, error) {
        // 处理错误情况
        console.error(error);
      },
    });
  };

  const addAwesomeMarker = () => {
    // // Marker definition
    // var marker = L.marker([23, 111]);
    // // Adding marker to layer
    // ciLayer.addMarker(marker);

    // awesome-markers
    // Creates a red marker with the coffee icon
    L.AwesomeMarkers.Icon.prototype.options.prefix = 'icon';

    var redMarker = L.AwesomeMarkers.icon({
      extraClasses: 'iconfont',
      prefix: 'icon',
      icon: 'icon-yiyuan',
      markerColor: '#37373D',
    });

    L.marker([23, 113], { icon: redMarker })
      .bindPopup('我是iconfont的icon绘制自定义颜色的marker！')
      .addTo(map);
  };

  const addLocateControl = () => {
    L.control.locate().addTo(map);
    const _onlocationFound = (e) => {
      // console.log('_onlocationFound',e);
      const { accuracy, bounds, latlng, latitude, longitude, timestamp } = e;
      currentLocation = e;
      locateData.push(e);
    };
    map.on('locationfound', _onlocationFound);
  };

  const addRouteNavigate = () => {
    // 中山纪念堂
    const lat = 23.136137424695043,
      lng = 113.25936555862428;

    const _onclickRouteNavigate = () => {
      // if (!currentLocation) {
      //   alert('信号不好，请先获取当前位置！');
      //   return;
      // }
      // const { accuracy, bounds, latlng, latitude, longitude, timestamp } =
      //   currentLocation;
      // // wgs84转百度坐标
      const bdLocation = util.wgs84toBd09LatLng({
        lat,
        lng,
      });
      // const url = `bdapp://map/direction?destination=${bdLocation.lat},${bdLocation.lng}`;
      // const url = `bdapp://map/direction?destination=${bdLocation.lat},${bdLocation.lng}`;
      const url = `bdapp://map/direction?destination=${lat},${lng}`;
      window.open(url);
    };

    L.easyButton(
      '<span class="iconfont icon icon-luxian"></span>',
      function () {
        console.log('you just clicked the RouteNavigate button!');
        _onclickRouteNavigate();
      }
    ).addTo(map);

    const navigate = (v1) => {
      if (v1) {
        const v2 = bd09togcj02LatLng(v1);
        const url1 = `androidamap://navi?lat=${v2.lat}&lon=${v2.lng}`;
        const url2 = `bdapp://map/direction?destination=${v1.lat},${v1.lng}`;
        operation([
          {
            text: '高德地图',
            onPress: () => {
              console.log('高德地图', url1);
              window.open(url1);
            },
          },
          {
            text: '百度地图',
            onPress: () => {
              console.log('百度地图', url2);
              window.open(url2);
            },
          },
        ]);
      } else {
        Toast.info('未发现目的地位置点！');
      }
    };
  };

  const addHomeButton = () => {
    L.easyButton('<span class="iconfont icon icon-home1"></span>', function () {
      console.log('you just clicked the Home button!');
      // _onclickRouteNavigate();
      map.defaultBounds && map.fitBounds(map.defaultBounds);
    }).addTo(map);
  };

  const addSpotLayer = () => {
    const _map = map;
    const spotMVT = _map.getLayerGroup('spotMVT'); //扰动图斑
    layersControl.addOverlay(spotMVT, '扰动图斑');

    const spotLayer = mapHelper.createSpotMVT().addTo(spotMVT);
  };

  const dataTransform = () => {
    debugger;

    const fc = ZkyMap.itemsToFeatureCollection(citiesPolyon);
    const options = {
      onEachFeature: (feature, layer) => {
        const { name, code, id, parentId } = feature.properties;

        const symbol = {
          color: '#EA562C',
          fillColor: '#ff00ff',
          fillOpacity: 0,
          fill: true,
        };
        layer.setStyle(symbol);

        const areaTurf = (turf.area(feature.geometry) * 0.0001).toFixed(3);
        const popupContainer = L.DomUtil.create('div');
        popupContainer.innerHTML = `
                     <div>
                       <strong>${name}</strong><br/>
                       图形面积:${valid(areaTurf)}公顷<br/>
                       行政区代码:${valid(code)}公顷<br/>
                       id:${valid(id)}公顷<br/>
                       父级id:${valid(parentId)}公顷<br/>
                       <a class='js-locate'>定位</a>
                     </div>`;
        // 定位按钮
        const $locate = selectOne('.js-locate', popupContainer);
        'click' &&
          L.DomEvent.on($locate, 'click', (e) => {
            console.log('click .js-locate', feature);
            map.locate(feature);
            map.createHighlight(feature).addTo(map);
          });

        const popupContent = popupContainer;

        layer.on('click', (e) => {
          if (map._handlePM) {
            //正在编辑图形时，不触发点击事件
            return;
          }
          map.createHighlight(feature).addTo(map);
          map.openPopup(popupContent, e.latlng);
          L.DomEvent.stopPropagation(e);
        });
      },
    };

    const cityLayer = map.createGeoJSON(fc, options).addTo(map);
    layersControl.addOverlay(cityLayer, '市界');
    map.locate(fc);
    console.log('fc', fc);
  };

  return (
    <div
      className='map-root'
      style={{ position: 'absolute', width: '100%', height: '100%' }}
    >
      <div className='message-root'>
        <div className='message'></div>
      </div>
      <div
        id={mapName}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      ></div>
    </div>
  );
}

export default Map;
