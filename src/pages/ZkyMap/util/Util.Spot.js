import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as turf from "@turf/turf";
import * as Geom from "./Util.Geom";
import * as Layer from "./Util.Layer";
import * as Dom from "./Util.Dom";
import * as Common from "./Util.Common";
import proj4 from "proj4";
import "../../../components/Map/ZoomInfo/L.Control.Zoominfo.css";
import "../../../components/Map/ZoomInfo/L.Control.Zoominfo";
import "../../../components/Map/MiniMap/Control.MiniMap.min.css";
import "../../../components/Map/MiniMap/Control.MiniMap.min";
import mapHelper from "../../../utils/mapHelper";
import jQuery from "jquery";
import { message } from "antd";

const $ = jQuery;
const valid = mapHelper.valid;
const selectOne = Dom.selectOne;

// 扩展扰动图斑功能
L.Map.include({
  addSpotFeaturesById: function (args) {
    // 根据spotIds添加图斑图形
    // e.g.
    // _map.addSpotFeaturesById({
    //   spotIds,
    //   dispatch,
    //   setMapReviewPlanId,
    //   setShowConfirmDivide,
    //   cancelDivide,
    //   setShowConfirmEdit,
    //   activeTabKey,
    // });

    const {
      spotIds,
      dispatch,
      setMapReviewPlanId,
      setShowConfirmDivide,
      cancelDivide,
      setShowConfirmEdit,
      activeTabKey,
    } = args;

    //清空图层
    const layerGroup = this.getLayerGroup("spotRelated");
    layerGroup && layerGroup.clearLayers();

    if (!Array.isArray(spotIds) || spotIds.length === 0) {
      return;
    }
    //去掉为null或undefined的值
    const _spotIds = spotIds.filter((id) => id !== undefined && id !== null);
    if (!Array.isArray(_spotIds) || _spotIds.length === 0) {
      return;
    }

    const payload = { ids: _spotIds };
    dispatch &&
      dispatch({
        type: "spot/spotGetGeom",
        payload: payload,
        callback: (success, result) => {
          console.log("spotWithGeometry", result);
          const spotFeatureCollection = Geom.itemsToFeatureCollection(
            result.items,
          );

          const options = {
            onEachFeature: (feature, layer) => {
              const {
                properties: {
                  id: spotId,
                  reviewPlanId,
                  projectId,
                  mapNum,
                  interferenceCompliance,
                  reviewPlan: reviewPlanName,
                  projectName,
                },
              } = feature;

              //设置复核计划
              setMapReviewPlanId && setMapReviewPlanId(reviewPlanId);

              //样式设置
              const unFinishSpotColor = "#e6d933";
              const finishSpotColor = "#E09A00";
              const symbol = {
                color: reviewPlanId ? unFinishSpotColor : finishSpotColor,
                dashArray: projectId ? null : "5",
                weight: 3,
                fillColor: "rgba(255,255,0,0.1)",
                fill: true,
              };
              layer.setStyle(symbol);

              const popupContent = this.createEditSpotPopupContent({
                feature,
                mapNum,
                reviewPlanName,
                projectName,
                interferenceCompliance,
                projectId,
                activeTabKey,
                spotId,
                setShowConfirmDivide,
                cancelDivide,
                setShowConfirmEdit,
              });

              layer.on("click", (e) => {
                if (this._handlePM) {
                  //正在编辑图形时，不触发点击事件
                  return;
                }
                this.createHighlight(feature).addTo(this);
                this.openPopup(popupContent, e.latlng);
                L.DomEvent.stopPropagation(e);
              });
            },
          };
          this.createGeoJSON(spotFeatureCollection, options).addTo(layerGroup);
          this.locate(spotFeatureCollection);
        },
      });
  },
  createSpotPopupContent: function (args) {
    // 创建图斑弹窗(不可编辑)
    // e.g.
    // const popupContent = _map.createSpotPopupContent({
    //   feature,
    //   mapNum,
    //   reviewPlanName,
    //   projectName,
    //   interferenceComplianceValue,
    //   spotId,
    //   projectId,
    //   activeTabKey,
    // });

    const {
      feature,
      mapNum,
      reviewPlanName,
      projectName,
      interferenceComplianceValue,
      spotId,
      projectId,
      activeTabKey,
    } = args;
    const areaTurf = (turf.area(feature.geometry) * 0.0001).toFixed(3);
    const popupContainer = L.DomUtil.create("div");
    popupContainer.innerHTML = `
            <div>
              <strong>图斑编号:${mapNum}</strong><br/>
              复核计划:${valid(reviewPlanName)}<br/>
              图形面积:${valid(areaTurf)}公顷<br/>
              关联项目:<a class='js-show-project-info'>${valid(
                projectName,
              )}</a><br/>
              扰动合规性:${valid(interferenceComplianceValue)}<br/>
              <a class='js-locate'>定位</a>
              <a class='js-show-spot-info'>详情</a>
            </div>`;

    // 绑定弹窗点击事件
    // 关联项目按钮
    const $showProjectInfo = selectOne(".js-show-project-info", popupContainer);
    $showProjectInfo &&
      L.DomEvent.on($showProjectInfo, "click", (e) => {
        console.log("click .js-show-project-info", feature);
        const existingUrl = `#/v4-supervise/region/remote-sensing/project-detail`;
        const params = { projectId, activeTabKey };
        const url = Common.getParamString(params, existingUrl);
        window.open(url);
      });
    // 定位按钮
    const $locate = selectOne(".js-locate", popupContainer);
    $locate &&
      L.DomEvent.on($locate, "click", (e) => {
        console.log("click .js-locate", feature);
        this.locate(feature);
        this.createHighlight(feature).addTo(this);
      });
    // 图斑详情按钮
    const $showSpotInfo = selectOne(".js-show-spot-info", popupContainer);
    $showSpotInfo &&
      L.DomEvent.on($showSpotInfo, "click", (e) => {
        console.log("click .js-show-spot-info", feature);
        const existingUrl = `#/v4-supervise/region/remote-sensing/spot-detail`;
        const params = { spotId };
        const url = Common.getParamString(params, existingUrl);
        window.open(url);
      });

    const popupContent = popupContainer;
    return popupContent;
  },
  createEditSpotPopupContent: function (args) {
    // 创建图斑编辑弹窗
    // e.g.
    // const popupContent = this.createEditSpotPopupContent({
    //   feature,
    //   mapNum,
    //   reviewPlanName,
    //   projectName,
    //   interferenceCompliance,
    //   projectId,
    //   spotId,
    //   setShowConfirmDivide,
    //   cancelDivide,
    //   setShowConfirmEdit,
    // });

    const {
      feature,
      mapNum,
      reviewPlanName,
      projectName,
      interferenceCompliance,
      projectId,
      activeTabKey,
      spotId,
      setShowConfirmDivide,
      cancelDivide,
      setShowConfirmEdit,
    } = args;

    const area = (turf.area(feature.geometry) * 0.0001).toFixed(3);
    const popupContainer = L.DomUtil.create("div");
    popupContainer.innerHTML = `
        <div>
          <strong>图斑编号:${mapNum}</strong><br/>
          复核计划:${valid(reviewPlanName)}<br/>
          图形面积:${valid(area)}公顷<br/>
          关联项目:<a class='js-show-project-info'>${valid(
            projectName,
          )}</a><br/>
          扰动合规性:${valid(interferenceCompliance)}<br/>
          <a class='js-locate'>定位</a>
          <a class='js-show-spot-info'>详情</a>
          <a class='js-line-divide'>分割</a>
          <a class='js-edit-graphic'>图形编辑</a>
          <a class='js-polygon-divide'>面分割</a>
        </div>`;

    // 绑定弹窗点击事件
    // 关联项目按钮
    const $showProjectInfo = selectOne(".js-show-project-info", popupContainer);
    $showProjectInfo &&
      L.DomEvent.on($showProjectInfo, "click", (e) => {
        console.log("click .js-show-project-info", feature);
        const existingUrl = `#/v4-supervise/region/remote-sensing/project-detail`;
        const params = { projectId, activeTabKey };
        const url = Common.getParamString(params, existingUrl);
        window.open(url);
      });
    // 定位按钮
    const $locate = selectOne(".js-locate", popupContainer);
    $locate &&
      L.DomEvent.on($locate, "click", (e) => {
        console.log("click .js-locate", feature);
        this.locate(feature);
        this.createHighlight(feature).addTo(this);
      });
    // 图斑详情按钮
    const $showSpotInfo = selectOne(".js-show-spot-info", popupContainer);
    $showSpotInfo &&
      L.DomEvent.on($showSpotInfo, "click", (e) => {
        console.log("click .js-show-spot-info", feature);
        const existingUrl = `#/v4-supervise/region/remote-sensing/spot-detail`;
        const params = { spotId };
        const url = Common.getParamString(params, existingUrl);
        window.open(url);
      });
    // 分割按钮
    const $lineDivide = selectOne(".js-line-divide", popupContainer);
    $lineDivide &&
      L.DomEvent.on($lineDivide, "click", (e) => {
        console.log("click .js-line-divide", feature);
        this.lineDivide({ feature, setShowConfirmDivide, cancelDivide });
      });
    // 编辑按钮
    const $editGraphic = selectOne(".js-edit-graphic", popupContainer);
    $editGraphic &&
      L.DomEvent.on($editGraphic, "click", (e) => {
        console.log("click .js-edit-graphic", feature);
        this.closePopup();
        this.startEditFeature(feature);
        setShowConfirmEdit(true);
      });
    // 面分割按钮
    const $polygonDivide = selectOne(".js-polygon-divide", popupContainer);
    $polygonDivide &&
      L.DomEvent.on($polygonDivide, "click", (e) => {
        console.log("click .js-polygon-divide", feature);
        this.polygonDivide({ feature, setShowConfirmDivide, cancelDivide });
      });

    const popupContent = popupContainer;
    return popupContent;
  },
  locateSpotById: function (args) {
    // 根据spotIds添加图斑图形
    // e.g.
    // _map.locateFeatureById?.({
    //   spotId,
    //   dispatch,
    //   editable:true,
    //   setShowConfirmDivide,
    //   cancelDivide,
    //   setShowConfirmEdit,
    // });

    const {
      spotId,
      dispatch,
      editable = true,
      setShowConfirmDivide,
      cancelDivide,
      setShowConfirmEdit,
    } = args;

    if (!spotId) {
      return;
    }

    const payload = { ids: [spotId] };
    dispatch &&
      dispatch({
        type: "spot/spotGetGeom",
        payload: payload,
        callback: (success, result) => {
          console.log("spotWithGeometry", result);
          if (result.items.length === 0) {
            return;
          }

          const item = result.items[0];
          const feature = Geom.objToFeature(item);
          const {
            properties: {
              id: spotId,
              projectId,
              mapNum,
              interferenceCompliance,
              reviewPlan: reviewPlanName,
              projectName,
            },
          } = feature;

          const popupContent = editable
            ? this.createEditSpotPopupContent({
                feature,
                mapNum,
                reviewPlanName,
                projectName,
                interferenceCompliance,
                projectId,
                spotId,
                setShowConfirmDivide,
                cancelDivide,
                setShowConfirmEdit,
              })
            : this.createSpotPopupContent({
                feature,
                mapNum,
                reviewPlanName,
                projectName,
                interferenceComplianceValue: interferenceCompliance,
                spotId,
                projectId,
              });

          this.locate(feature);
          const centroid = Geom.getCenterInFeature(feature);
          this.openPopup(popupContent, [
            centroid.geometry.coordinates[1],
            centroid.geometry.coordinates[0],
          ]);
          this.createHighlight(feature).addTo(this);
        },
      });
  },
});
