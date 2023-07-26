import React, {
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { connect } from "dva";
import { Button, Popover, Modal, message } from "antd";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-side-by-side";
import ZkyMap from "@/pages/ZkyMap/ZkyMap";
import mapHelper from "../../../utils/mapHelper";
import * as turf from "@turf/turf";
import MapToolBar from "../../../components/Map/Controls/MapToolBar";
import SwitchMapScrollable from "../../../components/Map/Controls/SwitchMapScrollable";
import RegionLocate from "../../../components/Map/Controls/RegionLocateV4";

const fullcode = false;

var baseLayers = [],
  overLayers = [],
  overlayTreeData;

const MapDraw = React.forwardRef((props, ref) => {
  const { dispatch, onRefreshSpotList, onRefreshSpotInfo } = props; //属性解构
  const {
    spot: {
      spotInfo: { id: spotId, projectId },
    },
    project: { activeTabKey },
    map: { histories },
  } = props; //属性解构
  const mapName = `map-draw${ZkyMap.getMapIndex()}`;
  const map = useRef(null);
  const switchMapScrollableRef = useRef(null);
  const regionLocateRef = useRef(null);

  const mapToolBar = useRef(null);
  const valid = mapHelper.valid;
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [showConfirmDivide, setShowConfirmDivide] = useState(false);
  const [mapReviewPlanId, setMapReviewPlanId] = useState(null);
  const selectOne = ZkyMap.selectOne;

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
    //添加滚轮缩放控制插件
    addSwitchMapScrollable();
    //添加行政区划定位插件
    addRegionLocate();
    //添加点查事件
    addPierce();
    //添加掩膜
    addMask();
    //加载初始数据
    console.log("MapDraw地图初始化完成！");

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
    const spotId = _map._editLayer.properties.id;
    const feature = ZkyMap.editLayerToMultiPolygon(_map._editLayer);

    if (!feature) {
      return;
    }
    if (fullcode) {
      let feature = _map._editLayer.toGeoJSON();
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
                addSpotFeaturesById([spotId]);
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
          addSpotFeaturesById([spotId]);
          onRefreshSpotList();
        }
      },
    });
  };

  const addOverlayersById = (reviewPlanId) => {
    const _map = map.current;
    if (!_map) {
      return;
    }

    //设置地图当前复核计划，点查是会用到该值
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

  useEffect(() => {
    addOverlayersById(mapReviewPlanId);
  }, [mapReviewPlanId]);

  const addSpotFeaturesById = (spotIds) => {
    // console.log(new Date(), "spotIdChanged", spotId);
    const _map = map.current;
    if (!_map) {
      return;
    }

    _map.addSpotFeaturesById({
      spotIds,
      dispatch,
      setMapReviewPlanId,
      setShowConfirmDivide,
      cancelDivide,
      setShowConfirmEdit,
    });
  };

  const createMap = () => {
    const _options = { attributionControl: false, zoomControl: false };
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
    _map.addPierce({ dispatch });
  };

  const addSwitchMapScrollable = () => {
    const _map = map.current;
    const _switchMapScrollable = switchMapScrollableRef.current;
    _switchMapScrollable.instance(_map, { checked: true });
    //   _switchMapScrollable.setOptions({checked: true})
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
    _map.addMask({ dispatch, request: false });
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
    //项目相关
    const projectRelated = _map.getLayerGroup("projectRelated").addTo(_map); //项目红线
    const spotRelated = _map.getLayerGroup("spotRelated").addTo(_map); //扰动图斑
    const FZFQRelated = _map.getLayerGroup("FZFQRelated").addTo(_map); //防治分区
    const QTQZRelated = _map.getLayerGroup("QTQZRelated").addTo(_map); //取弃土场（弃土弃渣）
    //水土保持
    const projectMVT = _map.getLayerGroup("projectMVT"); //项目红线
    const spotMVT = _map.getLayerGroup("spotMVT"); //扰动图斑
    const FZFQMVT = _map.getLayerGroup("FZFQMVT"); //防治分区
    const QTQZMVT = _map.getLayerGroup("QTQZMVT"); //取弃土场（弃土弃渣）
    //边界注记
    const boundaryLayer = mapHelper.creatBoundaryLayer();
    const tdtCia = mapHelper.createTdtCia();
    overLayers = [
      projectRelated,
      spotRelated,
      FZFQRelated,
      QTQZRelated,
      projectMVT,
      spotMVT,
      FZFQMVT,
      QTQZMVT,
      boundaryLayer,
      tdtCia,
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
    });

    //初始加载图层
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

  const setSwitchMapScrollable = (checked) => {
    const _switchMapScrollable = switchMapScrollableRef.current;
    _switchMapScrollable.setOptions({ checked: true });
  };

  // 使用 useImperativeHandle 来暴露 getTimerID 和 getName 函数给父组件
  useImperativeHandle(ref, () => ({
    getMap,
    setSwitchMapScrollable,
  }));

  return (
    <div
      class="container"
      style={{ height: `100%`, position: "absolute", top: 0 }}
    >
      <div style={{ height: `100%` }} id={mapName}></div>
      <MapToolBar
        style={{ top: 10, right: 10 }}
        link={(t) => {
          mapToolBar.current = t;
        }}
      ></MapToolBar>
      {/* <childComponent ref={ref}></childComponent> 通过这ref向子组件传递*/}
      <SwitchMapScrollable
        style={{ top: 15, left: 53, zIndex: 900 }}
        link={(t) => {
          switchMapScrollableRef.current = t;
        }}
      ></SwitchMapScrollable>
      <RegionLocate
        link={(t) => {
          regionLocateRef.current = t;
        }}
        yOffset="-45"
      ></RegionLocate>
      {/* 新建图斑/图形编辑 */}
      <div
        style={{
          display: showConfirmEdit ? "block" : "none",
          position: "absolute",
          top: 10,
          right: 350,
          zIndex: 1000,
        }}
      >
        <Popover content={"取消编辑"}>
          <Button onClick={cancelEdit}>取消</Button>
        </Popover>
        <Popover content={"保存编辑"}>
          <Button onClick={saveEdit}>保存</Button>
        </Popover>
      </div>
      {/* 分割图斑 */}
      <div
        style={{
          display: showConfirmDivide ? "block" : "none",
          position: "absolute",
          top: 10,
          right: 350,
          zIndex: 1001,
        }}
      >
        <Button onClick={cancelDivide}>取消</Button>
        <Button
          // disabled={loading}
          onClick={() => {
            const _map = map.current;
            if (!_map || !_map.divideLayers) {
              return;
            }
            const {
              reviewPlanName,
              intersectLayer,
              differenceLayer,
            } = _map.divideLayers;
            if (!intersectLayer || !differenceLayer) {
              message.info("分割后图形不存在，请重新分割！");
              return;
            }

            let content = (
              <div>
                确实要将当前图斑分割为2个图斑吗？
                <div>
                  <span style={{ color: "red" }}>
                    (注意：红色图形继承图斑编号，绿色图形新建图斑编号)
                  </span>
                </div>
                <div>
                  {reviewPlanName && (
                    <div>
                      <span>2个图斑会纳入复核计划：</span>
                      <span style={{ color: "red" }}>{reviewPlanName}</span>
                    </div>
                  )}
                </div>
              </div>
            );
            Modal.confirm({
              title: "图斑分割",
              content: content,
              cancelText: "取消",
              zIndex: 1003, // 详情面板zIndex值为1002
              okText: "确定",
              onOk: saveDivide,
              onCancel: () => {},
            });
          }}
        >
          分割
        </Button>
      </div>
    </div>
  );
});

// 必须用connect(mapStateToProps, null, null, { forwardRef: true })，否则无法在父组件的ref为undefined
export default connect(
  ({ spot, project, map }) => ({ spot, project, map }),
  null,
  null,
  {
    forwardRef: true,
  },
)(MapDraw);
