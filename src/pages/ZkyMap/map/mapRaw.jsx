import React, {
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { connect } from "dva";
import "./index.less";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ZkyMap from "@/pages/ZkyMap/ZkyMap";
import mapHelper from "../../../utils/mapHelper";
import MapToolBar from "../../../components/Map/Controls/MapToolBar";

var baseLayers = [],
  overLayers = [],
  overlayTreeData;

const mapControlName = React.forwardRef((props, ref) => {
  const { dispatch } = props; //属性解构
  const mapName = `map-spotdetail`;
  const map = useRef(null);

  const mapToolBar = useRef(null);

  useEffect(() => {
    //初始化地图对象
    createMap();
    //创建图层
    createLayers();
    //添加地图组件（待重构）
    addMapToolBar();
    //添加图形编辑组件
    addLeafletPM();
    //添加鹰眼图组件
    addMiniMap();
    //添加缩放组件
    addZoominfo();
    //添加自动获取范围内影像列表功能
    addAutoGetImagesByBounds();

    return () => {
      //卸载时清理事件、数据
    };
  }, []); // 空数组意味着这个副作用只会在组件挂载和卸载时运行

  const createMap = (options) => {
    const _options = { attributionControl: false, zoomControl: false };
    L.Util.extend(_options, options);
    const _map = (map.current = L.map(mapName, _options));
  };

  const addLeafletPM = (options) => {
    const _map = map.current;
    const _options = { drawControls: false };
    L.Util.extend(_options, options);
    _map?.addLeafletPM(_options);
  };

  const addAutoGetImagesByBounds = () => {
    const _map = map.current;
    _map.addAutoGetImagesByBounds({ dispatch });
  };

  const addZoominfo = (options) => {
    const _map = map.current;
    _map?.createZoominfo(options).addTo(_map);
  };

  const addMiniMap = (options) => {
    const _map = map.current;
    _map?.createMiniMap(options).addTo(_map);
  };

  const createLayers = (options) => {
    const _map = map.current;
    //创建panes控制底图和业务图层
    _map.createPane("baseLayer");
    _map.getPane("baseLayer").style.zIndex = 0;
    _map.createPane("overLayer");
    _map.getPane("overLayer").style.zIndex = 200;

    //底图baseLayers
    const jgImgLayer = mapHelper.createJgImg({
      pane: "baseLayer",
      maxNativeZoom: 17,
      maxZoom: 20,
    });
    const ArcGISImgLayer = mapHelper.createArcgisImg({ pane: "baseLayer" });
    const tdtImgLayer = mapHelper.createTdtImg({ pane: "baseLayer" });
    const tdtVecLayer = mapHelper.createTdtVec({ pane: "baseLayer" });
    const GeoqVecLayer = mapHelper.createGeoqVec({ pane: "baseLayer" });
    baseLayers = [
      jgImgLayer,
      ArcGISImgLayer,
      tdtImgLayer,
      tdtVecLayer,
      GeoqVecLayer,
    ];
    //添加到地图中时，设置自身为_currentBaseLayer
    baseLayers.forEach((layer) => {
      layer.on(
        "add",
        () => {
          _map._currentBaseLayer = layer;
        },
        layer,
      );
    });
    //初始底图
    tdtVecLayer.addTo(_map);
    _map.fitBounds(mapHelper.gdBounds);

    //业务图层overLayers
    const boundaryLayer = mapHelper.creatBoundaryLayer();
    const tdtCia = mapHelper.createTdtCia();
    overLayers = [boundaryLayer, tdtCia];
    overlayTreeData = [
      {
        title: "边界注记",
        key: "bjzj",
        children: [
          {
            title: tdtCia.title,
            key: L.Util.stamp(tdtCia),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/注记图标.png"
              ></img>
            ),
          },
          {
            title: boundaryLayer.title,
            key: L.Util.stamp(boundaryLayer),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/行政注记.png"
              ></img>
            ),
          },
        ],
      },
    ];
  };

  const addMapToolBar = () => {
    const _map = map.current;
    const _mapToolBar = mapToolBar.current;
    _mapToolBar.instance(_map, { showSwitch: false });
    _mapToolBar.BaseMapProps = {
      map: _map,
      options: { baseLayers: baseLayers },
    };
    _mapToolBar.OverlayersProps = {
      map: _map,
      options: { overLayers: overLayers, treeData: overlayTreeData },
    };
    _mapToolBar.LegendProps = {
      map: _map,
      options: {
        src: "./img/区域监管图例.png",
        style: {},
      },
    };
    _mapToolBar.MeasureProps = {
      map: _map,
      options: {},
    };
    _mapToolBar.LocateProps = {
      map: _map,
      options: {},
    };
    _mapToolBar.HistoryImageProps = {
      map: _map,
      options: {
        baseLayers: baseLayers,
      },
    };
    _mapToolBar.SideBySideProps = {
      map: _map,
      options: {
        baseLayers: baseLayers,
      },
    };
  };

  // 声明 getTimerID 函数和 getName 函数
  const getMap = () => map.current;
  // 使用 useImperativeHandle 来暴露 getTimerID 和 getName 函数给父组件
  useImperativeHandle(ref, () => ({
    getMap,
  }));

  return (
    <div class="container" style={{ height: `100%` }}>
      <div style={{ height: `100%` }} id={mapName}></div>
      <MapToolBar
        style={{ top: 10, right: 10 }}
        link={(t) => {
          mapToolBar.current = t;
        }}
      ></MapToolBar>
      {/* <childComponent ref={ref}></childComponent> 通过这ref向子组件传递*/}
    </div>
  );
});

// 必须用connect(mapStateToProps, null, null, { forwardRef: true })，否则无法在父组件的ref为undefined
export default connect(({ ai }) => ({ ai }), null, null, { forwardRef: true })(
  mapControlName,
);
