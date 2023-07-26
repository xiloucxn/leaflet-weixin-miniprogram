import React, {
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { connect } from "dva";
import { Button, Popover, Modal, message, Select, Tree } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapSample.less";
import "leaflet-side-by-side";
import ZkyMap from "@/pages/ZkyMap/ZkyMap";
import mapHelper from "../../../utils/mapHelper";
import * as turf from "@turf/turf";
import MapToolBar from "../../../components/Map/Controls/MapToolBar";
import SwitchMapScrollable from "../../../components/Map/Controls/SwitchMapScrollable";
import RegionLocate from "../../../components/Map/Controls/RegionLocateV4";
import {
  qyjgStatisticOnMapApi,
  GetDistricts,
  DistrictCodeGetPolygonByIdsApi,
} from "@/services/httpApi";

const fullcode = false;

var baseLayers = [],
  overLayers = [],
  overlayTreeData;

const MapSample = React.forwardRef((props, ref) => {
  const { dispatch, refreshList } = props; //属性解构
  const {
    map: { histories },
    reviewPlan: { reviewPlanList, reviewPlanSelect },
  } = props; //属性解构

  const mapName = `map-sample${ZkyMap.getMapIndex()}`;
  const map = useRef(null);
  const regionLocateRef = useRef(null);

  const mapToolBar = useRef(null);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [showConfirmDivide, setShowConfirmDivide] = useState(false);

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
    //添加行政区划定位插件
    addRegionLocate();
    //添加点查事件
    addPierce();
    //创建掩膜图层
    addMask();
    //加载初始数据

    console.log("MapSample地图初始化完成！");

    return () => {
      //卸载时清理事件、数据
    };
  }, []); // 空数组意味着这个副作用只会在组件挂载和卸载时运行

  const cancelEdit = () => {
    const _map = map.current;
    if (!_map) {
      return;
    }

    _map?.cancelEdit();
    setShowConfirmEdit(false);
  };

  const saveEdit = () => {
    const _map = map.current;
    if (!_map) {
      return;
    }
    let feature = _map._editLayer.toGeoJSON();
    const spotId = _map._editLayer.properties.id;
    if (feature.type === "FeatureCollection") {
      feature = feature.features[0];
    }
    //接口只支持MultiPolygon，如果feature是polygon则转为MultiPolygon
    if (feature.geometry.type === "Polygon") {
      feature = ZkyMap.polygonsToMultiPolygonFeature([feature]);
    }
    //不支持多部件的MultiPolygon
    if (feature.geometry.coordinates.length > 1) {
      message.info("只支持单个图斑，不支持多部件，请删除多余图斑！");
      return;
    }
    const wkt = ZkyMap.geoJSONToWkt(feature);
    dispatch({
      type: "spot/spotInfo",
      payload: spotId,
      callback: (success, result) => {
        if (success) {
          dispatch({
            type: "spot/spotEdit",
            payload: { ...result, polygon: wkt },
            callback: (success, result) => {
              cancelEdit();
              //刷新图形
              if (success) {
                // addSpotFeaturesById([spotId]);
                addOverlayersById(_map.reviewPlanId); //刷新图斑
              }
            },
          });
        }
      },
    });
  };

  const cancelDivide = () => {
    const _map = map.current;
    if (!_map) {
      return;
    }
    _map?.cancelDivide();
    setShowConfirmDivide(false);
  };

  const saveDivide = () => {
    const _map = map.current;
    if (!_map || !_map.divideLayers) {
      return;
    }

    const payload = _map.getDividePayload();
    dispatch({
      type: "spot/spotDivide",
      payload,
      callback: (success) => {
        cancelDivide();
        if (success) {
          // addSpotFeaturesById([spotId]);
          addOverlayersById(_map.reviewPlanId); //刷新图斑
          refreshList();
        }
      },
    });
  };

  const addOverlayersById = (reviewPlanId) => {
    const _map = map.current;
    if (!_map) {
      return;
    }

    //设置地图当前复核计划，点查时会用到该值
    _map.reviewPlanId = reviewPlanId;

    //水土保持，获取图层，同时清空
    const spotMVT = _map.getLayerGroup("spotMVT").clearLayers(); //扰动图斑
    //根据复核计划添加图层
    const spotLayer = mapHelper
      .createSpotMVT({
        ...(reviewPlanId && { params: { ReviewPlanId: reviewPlanId } }),
      })
      .addTo(spotMVT);
  };

  const createMap = () => {
    const _options = {
      attributionControl: false,
      zoomControl: false,
      minZoom: 4,
      maxBounds: [
        [-6.92642684, 38.3203125],
        [57.515822865, 180],
      ],
    };

    const _map = (map.current = L.map(mapName, _options));

    _map.fitBounds(mapHelper.gdBounds);
  };

  const addLeafletPM = () => {
    const _map = map.current;
    const _options = { drawControls: false };
    _map?.addLeafletPM(_options);
    if (_map?.pm.controlsVisible()) {
      _map?.pm.toggleControls();
    }
    //修改LeafletPM组件位置
    const $topleftOld = $(".leaflet-top.leaflet-left");
    const $topleftNew = $(".leaflet-topleft-container");
    if ($topleftOld && $topleftNew) {
      $(".leaflet-top.leaflet-left").appendTo(".leaflet-topleft-container");
    }
  };

  const addAutoGetImagesByBounds = () => {
    const _map = map.current;
    _map.addAutoGetImagesByBounds({ dispatch });
  };

  useEffect(() => {
    const _map = map.current;
    if (!histories || !_map?._imageDate) {
      return;
    }
    _map._imageDate.setText(histories[0]);
  }, [histories]);

  const addPierce = () => {
    const _map = map.current;
    _map.addPierce({
      dispatch,
      editable: true,
      setShowConfirmDivide,
      cancelDivide,
      setShowConfirmEdit,
    });
  };

  const addRegionLocate = () => {
    const _map = map.current;
    const _regionLocate = regionLocateRef.current;
    _regionLocate.instance(_map, {});
  };

  const addZoominfo = (options) => {
    const _map = map.current;
    _map?.createZoominfo(options).addTo(_map);
  };

  const addMiniMap = (options) => {
    const _map = map.current;
    _map?.createMiniMap(options).addTo(_map);
  };

  const addMask = () => {
    const _map = map.current;
    _map.addMask({ dispatch });
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

    //业务图层overLayers
    //水土保持
    const projectMVT = _map.getLayerGroup("projectMVT"); //项目红线
    const spotMVT = _map.getLayerGroup("spotMVT"); //扰动图斑
    const FZFQMVT = _map.getLayerGroup("FZFQMVT"); //防治分区
    const QTQZMVT = _map.getLayerGroup("QTQZMVT"); //取弃土场（弃土弃渣）
    const soilErosion2018 = _map.getLayerGroup("soilErosion2018"); //2018年土壤侵蚀强度
    const soilErosion2019 = _map.getLayerGroup("soilErosion2019"); //2018年土壤侵蚀强度
    const soilErosion2020 = _map.getLayerGroup("soilErosion2020"); //2018年土壤侵蚀强度
    const slopeCollapse = _map.getLayerGroup("slopeCollapse"); //崩岗
    const socialGovernProject = _map.getLayerGroup(
      "socialGovernProject",
      false,
    ); //社会治理项目
    const keyGovernProject = _map.getLayerGroup("keyGovernProject"); //重点治理项目
    const smallWatershed = _map.getLayerGroup("smallWatershed"); //生态清洁小流域

    //echarts统计图层
    const spotReviewStatistic = _map
      .getLayerGroup("spotReviewStatistic")
      .addTo(_map); //图斑复核百分比统计
    _map.setLayerLevel({ layer: spotReviewStatistic, max: 9 });

    //边界注记
    const boundaryLayer = mapHelper.creatBoundaryLayer();
    const tdtCia = mapHelper.createTdtCia();
    overLayers = [
      projectMVT,
      spotMVT,
      FZFQMVT,
      QTQZMVT,
      soilErosion2018,
      soilErosion2019,
      soilErosion2020,
      slopeCollapse,
      socialGovernProject,
      keyGovernProject,
      smallWatershed,
      boundaryLayer,
      tdtCia,
      spotReviewStatistic,
    ];

    overlayTreeData = [
      {
        title: "水土保持",
        key: "stbc",
        children: [
          {
            title: "项目红线",
            key: L.Util.stamp(projectMVT),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/项目红线注记.png"
              ></img>
            ),
          },
          {
            title: "扰动图斑",
            key: L.Util.stamp(spotMVT),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/扰动图斑注记.png"
              ></img>
            ),
          },
          {
            title: "防治分区",
            key: L.Util.stamp(FZFQMVT),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/防治分区注记.png"
              ></img>
            ),
          },
          {
            title: "取弃土场",
            key: L.Util.stamp(QTQZMVT),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/取弃土场注记.png"
              ></img>
            ),
          },
          {
            title: "土壤侵蚀2018",
            key: L.Util.stamp(soilErosion2018),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/trqs_img.png"
              ></img>
            ),
          },
          {
            title: "土壤侵蚀2019",
            key: L.Util.stamp(soilErosion2019),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/trqs_img.png"
              ></img>
            ),
          },
          {
            title: "土壤侵蚀2020",
            key: L.Util.stamp(soilErosion2020),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/trqs_img.png"
              ></img>
            ),
          },
          {
            title: "崩岗",
            key: L.Util.stamp(slopeCollapse),
            icon: (
              <img style={{ width: 22, height: 22 }} src="./img/崩岗.png"></img>
            ),
          },
          {
            title: "社会治理",
            key: L.Util.stamp(socialGovernProject),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/社会治理.png"
              ></img>
            ),
          },
          {
            title: "重点治理",
            key: L.Util.stamp(keyGovernProject),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/重点工程图例.png"
              ></img>
            ),
          },
          {
            title: "生态清洁小流域",
            key: L.Util.stamp(smallWatershed),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/生态清洁小流域.png"
              ></img>
            ),
          },
        ],
      },
      {
        title: "统计图表",
        key: "tjtb",
        children: [
          {
            title: "图表复核百分比",
            key: L.Util.stamp(spotReviewStatistic),
            icon: (
              <img
                style={{ width: 22, height: 22 }}
                src="./img/统计图.png"
              ></img>
            ),
          },
        ],
      },
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

    //向地图中添加矢量瓦片
    projectMVT.clearLayers(); //项目红线
    FZFQMVT.clearLayers(); //防治分区
    QTQZMVT.clearLayers(); //取弃土场（弃土弃渣）
    const projectLayer = mapHelper
      .createProjectMVT({}, { interactive: true })
      .addTo(projectMVT);
    const FZFQLayer = mapHelper
      .createFZFQMVT({}, { interactive: true })
      .addTo(FZFQMVT);
    const QTQZLayer = mapHelper
      .createQTQZMVT({}, { interactive: true })
      .addTo(QTQZMVT);

    //向地图中添加土壤侵蚀强度图层
    mapHelper
      .createGovernDynamic2018({
        pane: "overLayer",
      })
      .addTo(soilErosion2018);
    mapHelper
      .createGovernDynamic2019({
        pane: "overLayer",
      })
      .addTo(soilErosion2019);
    mapHelper
      .createGovernDynamic2020({
        pane: "overLayer",
      })
      .addTo(soilErosion2020);

    //设置点查（穿透查询)图层
    projectMVT.tableName = `ProjectScope`;
    spotMVT.tableName = `Spot`;
    FZFQMVT.tableName = `ProjectPrevenZone`;
    QTQZMVT.tableName = `ProjectFocus`;
    const pierceLayers = [projectMVT, spotMVT, FZFQMVT, QTQZMVT];
    _map.setPierceLayers({ pierceLayers });

    //设置自动切换底图
    _map.setAutoChangeLayer({
      lastVecLayer: tdtVecLayer,
      lastImgLayer: jgImgLayer,
      vecLayers: [tdtVecLayer, GeoqVecLayer],
      imgLayers: [jgImgLayer, ArcGISImgLayer, tdtImgLayer],
      overLayers: [spotMVT],
    });

    //设置自动切换业务图层

    //初始底图
    tdtVecLayer.addTo(_map);

    //添加日期显示控件
    _map.addImageDate({ jgImgLayer, show: true });

    console.log("layers prepared", overlayTreeData);
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
        src: "./img/土壤侵蚀强度.png", //改为对应专题图图例
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
    <div class="container" style={{ height: "100%" }}>
      <div style={{ height: `100%` }} id={mapName}></div>
      <MapToolBar
        style={{ top: 10, right: 10 }}
        link={(t) => {
          mapToolBar.current = t;
        }}
      ></MapToolBar>
      {/* <childComponent ref={ref}></childComponent> 通过这ref向子组件传递*/}
      <RegionLocate
        link={(t) => {
          regionLocateRef.current = t;
        }}
        yOffset="-45"
      ></RegionLocate>
      <div
        class={"leaflet-topleft-container"}
        style={{
          position: "absolute",
          left: `${40}px`,
          transition: "all 0.3s",
          margin: "0px",
          top: 0,
        }}
      ></div>
    </div>
  );
});

// 必须用connect(mapStateToProps, null, null, { forwardRef: true })，否则无法在父组件的ref为undefined
export default connect(
  ({ spot, project, map, reviewPlan }) => ({ spot, project, map, reviewPlan }),
  null,
  null,
  {
    forwardRef: true,
  },
)(MapSample);
