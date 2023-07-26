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
import { toPercent, getLabel, emphasizeKeywords } from "../../../utils/util";

const $ = jQuery;
const valid = mapHelper.valid;
const selectOne = Dom.selectOne;

// 扩展扰动图斑功能
L.Map.include({
  addProjectRainfallWarn: function (args) {
    // 根据spotIds添加图斑图形
    // e.g.

    const { dispatch } = args;

    //清空图层
    const projectInWarning = this.getLayerGroup(
      "projectInWarning",
    ).clearLayers(); // 预警中
    const projectNotInWarning = this.getLayerGroup(
      "projectNotInWarning",
    ).clearLayers(); // 无需预警

    dispatch &&
      dispatch({
        type: "rain/rainListMap",
        payload: {
          maxResultCount: 999999,
        },
        callback: (result) => {
          console.log("ProjectRainfallWarnResults：", result);
          const inWarningItems = result.items.filter(
            (item, index) => item.isWarn === true,
          );
          const notInWarningItems = result.items.filter(
            (item, index) => item.isWarn !== true,
          );

          const inWarningFC = Geom.itemsToFeatureCollection(inWarningItems);
          const notInWarningFC = Geom.itemsToFeatureCollection(
            notInWarningItems,
          );

          const options = {
            onEachFeature: (feature, layer) => {
              let {
                properties: {
                  projectName = "",
                  latestWarnTime,
                  productDepartment,
                  lastSendMsgRecord,
                  isWarn = false,
                  projectId,
                },
              } = feature;

              let { phoneNumber = "", sendMsg = "", sendTime = "" } =
                lastSendMsgRecord || {};

              const popupContent = this.createProjectRainfallWarnPopupContent({
                feature,
                projectName,
                latestWarnTime,
                productDepartment,
                isWarn,
                phoneNumber,
                sendMsg,
                sendTime,
                projectId,
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
            pointToLayer: (feature, latlng) => {
              let marker;
              const {
                properties: { isWarn = false },
              } = feature;
              if (isWarn) {
                marker = L.blinkMarker(latlng, {
                  iconSize: [15, 15],
                  color: "red",
                  diveColor: "red",
                  level: "3",
                  speedTime: 2,
                });
              } else {
                let gIcon = L.icon({
                  iconUrl: "./img/G_raw.png",
                  iconSize: [21, 33],
                  iconAnchor: [11, 32],
                });
                marker = L.marker(latlng, {
                  icon: gIcon,
                });
              }
              return marker;
            },
          };

          this.createGeoJSON(notInWarningFC, options)?.addTo(
            projectNotInWarning,
          );
          this.createGeoJSON(inWarningFC, options)?.addTo(projectInWarning);
        },
      });
  },
  createProjectRainfallWarnPopupContent: function (args) {
    // 创建图斑弹窗(不可编辑)
    // e.g.

    let {
      feature,
      projectName,
      latestWarnTime,
      productDepartment,
      isWarn,
      phoneNumber,
      sendMsg,
      sendTime,
      projectId,
    } = args;

    const keywords = ["中雨", "大雨", "暴雨"];
    // sendMsg = emphasizeKeywords(sendMsg, keywords);

    function getWarnText(isWarn) {
      const text = isWarn
        ? `<span style="font-weight: bold; color: red;">预警中</span>`
        : `<span style="font-weight: bold; color: green;">正常</span>`;
      return text;
    }

    const popupContainer = L.DomUtil.create("div");
    popupContainer.innerHTML = `
            <div>
              <strong>项目:<a class='js-show-project-info'>${valid(
                projectName,
              )}</a></strong><br/>
              建设单位:${valid(productDepartment)}<br/>
              状态：${getWarnText(isWarn)}<br/>
              预警时间:${valid(latestWarnTime)}<br/>
              发送短信时间：:${valid(sendTime)}<br/>
              发送手机号:${valid(phoneNumber)}<br/>
              预警短信:${valid(sendMsg)}<br/>
              <a class='js-locate'>定位</a>
              <a class='js-show-rainfall-info' style='display:none'>详情</a>
            </div>`;

    // 绑定弹窗点击事件
    // 关联项目按钮
    const $showProjectInfo = selectOne(".js-show-project-info", popupContainer);
    $showProjectInfo &&
      L.DomEvent.on($showProjectInfo, "click", (e) => {
        console.log("click .js-show-project-info", feature);
        const existingUrl = `#/v4-supervise/region/remote-sensing/project-detail`;
        const params = { projectId };
        const url = Common.getParamString(params, existingUrl);
        window.open(url);
      });
    // 定位按钮
    const $locate = selectOne(".js-locate", popupContainer);
    $locate &&
      L.DomEvent.on($locate, "click", (e) => {
        console.log("click .js-locate", feature);
        this.locate(feature, { maxZoom: 17 });
        this.createHighlight(feature).addTo(this);
      });
    // 图斑详情按钮
    const $showRainfallInfo = selectOne(
      ".js-show-rainfall-info",
      popupContainer,
    );
    $showRainfallInfo &&
      L.DomEvent.on($showRainfallInfo, "click", (e) => {
        console.log("click .js-analy", feature);
        this.fire("showRainfallInfo", { feature }, feature);
      });

    const popupContent = popupContainer;
    return popupContent;
  },
});
