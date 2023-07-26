import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as turf from "@turf/turf";
import * as Geom from "./Util.Geom";
import * as Layer from "./Util.Layer";
import * as Dom from "./Util.Dom";
import * as Common from "./Util.Common";
import mapHelper from "../../../utils/mapHelper";
import jQuery from "jquery";
import { message } from "antd";

const $ = jQuery;
const valid = mapHelper.valid;
const selectOne = Dom.selectOne;

const toPercent = (v, bit = 2) => {
  const result = v ? (v * 100).toFixed(bit) + "%" : "";
  return result;
};


// 扩展扰动图斑功能
L.Map.include({
  addSoilErosionAnaly: function (args) {
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

    const { dispatch } = args;

    //清空图层
    const layerGroup = this.getLayerGroup("soilErosionAnaly").clearLayers();

    dispatch &&
      dispatch({
        type: "dynamic/dynamicSpotList",
        payload: {
          maxResultCount: 999999,
        },
        callback: (success, result) => {
          console.log("soilErosionAnalyResults：", result);
          const featureCollection = Geom.itemsToFeatureCollection(result.items);

          const options = {
            onEachFeature: (feature, layer) => {
              const {
                properties: { id, mapNum, soilErosionRate },
              } = feature;

              const symbol = {
                color: "#e6d933",
                weight: 3,
                fillColor: "rgba(255,255,0,0.1)",
                fill: true,
              };
              layer.setStyle(symbol);

              const popupContent = this.createSoilErosionAnalyPopupContent({
                feature,
                id,
                mapNum,
                soilErosionRate,
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
          const layer = this.createGeoJSON(featureCollection, options).addTo(
            layerGroup,
          );
          //   this.locate(featureCollection);
          return layer;
        },
      });
  },
  createSoilErosionAnalyPopupContent: function (args) {
    // 创建图斑弹窗(不可编辑)
    // e.g.
    // const popupContent = this.createSoilErosionAnalyPopupContent({
    //   feature,
    //   id,
    //   mapNum,
    //   soilErosionRate,
    // });

    const { feature, id, mapNum, soilErosionRate } = args;
    const areaTurf = (turf.area(feature.geometry) * 0.0001).toFixed(3);
    const popupContainer = L.DomUtil.create("div");
    popupContainer.innerHTML = `
            <div>
              <strong>图斑编号:${mapNum}</strong><br/>
              图形面积:${valid(areaTurf)}公顷<br/>
              <strong>水土流失百分比</strong><br/>
              <div style="text-indent: 0em;">2018年:${toPercent(
                soilErosionRate,
              )}</div>
              <div style="text-indent: 0em;">2019年:${toPercent(
                soilErosionRate,
              )}</div>
              <div style="text-indent: 0em;">2020年:${toPercent(
                soilErosionRate,
              )}</div>
              <a class='js-locate'>定位</a>
              <a class='js-analy'>分析</a>
            </div>`;

    // 绑定弹窗点击事件
    // 定位按钮
    const $locate = selectOne(".js-locate", popupContainer);
    $locate &&
      L.DomEvent.on($locate, "click", (e) => {
        console.log("click .js-locate", feature);
        this.locate(feature);
        this.createHighlight(feature).addTo(this);
      });
    // 图斑详情按钮
    const $showSpotInfo = selectOne(".js-analy", popupContainer);
    $showSpotInfo &&
      L.DomEvent.on($showSpotInfo, "click", (e) => {
        console.log("click .js-analy", feature);
        this.fire('analyzeErotionRate',{feature,id: id, year: 2020},feature)
      });

    const popupContent = popupContainer;
    return popupContent;
  },
});
