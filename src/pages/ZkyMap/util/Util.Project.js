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
import { stringify } from "qs";
import { message } from "antd";

const $ = jQuery;
const valid = mapHelper.valid;
const selectOne = Dom.selectOne;

// 扩展项目、项目红线、防治分区、弃土弃渣场图形功能
L.Map.include({
  addProjectFeaturesById: function (args) {
    // 根据projectId添加项目红线、防治分区、取弃土场图形
    // e.g.
    // _map.addProjectFeaturesById({ projectId, dispatch, activeTabKey });

    const { projectId, dispatch, activeTabKey } = args;

    //清空图层
    const projectRelatedLayerGroup =
      this.getLayerGroup("projectRelated").clearLayers(); //项目红线
    const FZFQRelatedLayerGroup =
      this.getLayerGroup("FZFQRelated").clearLayers(); //防治分区
    const QTQZRelatedLayerGroup =
      this.getLayerGroup("QTQZRelated").clearLayers(); //取弃土场（弃土弃渣）

    if (!projectId) {
      return;
    }

    dispatch &&
      dispatch({
        type: "project/projectInfo",
        payload: projectId,
        callback: (success, result) => {
          console.log("projectInfo", result);
          const {
            projectScopes,
            projectPrevenZones,
            projectFocuss,
            name: projectName,
          } = result;
          const projectScopesFC = Geom.itemsToFeatureCollection(projectScopes); //项目红线
          const projectPrevenZonesFC =
            Geom.itemsToFeatureCollection(projectPrevenZones); //防治分区
          const projectFocussFC = Geom.itemsToFeatureCollection(projectFocuss); //取弃土场
          if (Geom.isValidGeoJSON(projectScopesFC)) {
            this.createProjectScopes({
              projectScopesFC,
              projectName,
              projectId,
              activeTabKey,
            }).addTo(projectRelatedLayerGroup);
          }

          if (Geom.isValidGeoJSON(projectPrevenZonesFC)) {
            this.createProjectPrevenZones({
              projectPrevenZonesFC,
              projectName,
              activeTabKey,
            }).addTo(FZFQRelatedLayerGroup);
          }

          if (Geom.isValidGeoJSON(projectFocussFC)) {
            this.createProjectFocuss({
              projectFocussFC,
              projectName,
              activeTabKey,
            }).addTo(QTQZRelatedLayerGroup);
          }
        },
      });
  },
  createProjectScopes: function (args) {
    // 创建项目红线图形
    // e.g.
    // this.createProjectScopes({
    //   projectScopesFC,
    //   projectName,
    //   projectId,
    //   activeTabKey,
    // })

    const { projectScopesFC, projectName, projectId, activeTabKey } = args;

    const options = {
      onEachFeature: (feature, layer) => {
        const symbol = {
          color: "#E60000",
          fillColor: "#E60000",
          fillOpacity: 0,
          fill: true,
        };
        layer.setStyle(symbol);

        const popupContent = this.createProjectScopePopupContent({
          feature,
          projectName,
          projectId,
          activeTabKey,
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
    return this.createGeoJSON(projectScopesFC, options);
  },
  createProjectPrevenZones: function (args) {
    // 创建防治分区图形
    // e.g.
    // this.createProjectPrevenZones({
    //   projectPrevenZonesFC,
    //   projectName,
    //   activeTabKey,
    // })
    const { projectPrevenZonesFC, projectName, activeTabKey } = args;
    const options = {
      onEachFeature: (feature, layer) => {
        const { description, projectId } = feature.properties;
        const symbol = {
          color: "#66CC66",
          fillColor: "#66CC66",
          fillOpacity: 0,
          fill: true,
        };
        layer.setStyle(symbol);

        const popupContent = this.createProjectPrevenZonePopupContent({
          feature,
          projectName,
          description,
          projectId,
          activeTabKey,
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
    return this.createGeoJSON(projectPrevenZonesFC, options);
  },
  createProjectFocuss: function (args) {
    // 创建弃土弃渣（取弃土场）图形
    // e.g.
    // this.createProjectFocuss({
    //   projectFocussFC,
    //   projectName,
    //   activeTabKey,
    // })
    const { projectFocussFC, projectName, activeTabKey } = args;
    const options = {
      onEachFeature: (feature, layer) => {
        const { projectId, maxHeight, designScope, volume } =
          feature.properties;

        const symbol = {
          color: "#ff00ff",
          fillColor: "#ff00ff",
          fillOpacity: 0,
          fill: true,
        };
        layer.setStyle(symbol);

        const popupContent = this.createProjectFocusPopupContent({
          feature,
          projectName,
          projectId,
          activeTabKey,
          maxHeight,
          designScope,
          volume,
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
    return this.createGeoJSON(projectFocussFC, options);
  },
  createProjectScopePopupContent: function (args) {
    //创建项目红线弹窗
    //e.g.
    // const popupContent = _map.createProjectScopePopupContent({
    //   feature,
    //   projectName,
    //   projectId,
    //   activeTabKey,
    // });

    const { feature, projectName, projectId, activeTabKey } = args;

    const areaTurf = (turf.area(feature.geometry) * 0.0001).toFixed(3);
    const popupContainer = L.DomUtil.create("div");
    popupContainer.innerHTML = `
                     <div>
                       <strong>项目红线</strong><br/>
                       图形面积:${valid(areaTurf)}公顷<br/>
                       关联项目:<a class='js-show-project-info'>${valid(
                         projectName,
                       )}</a><br/>
                       <a class='js-locate'>定位</a>
                     </div>`;
    // 定位按钮
    const $locate = selectOne(".js-locate", popupContainer);
    "click" &&
      L.DomEvent.on($locate, "click", (e) => {
        console.log("click .js-locate", feature);
        this.locate(feature);
        this.createHighlight(feature).addTo(this);
      });
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
    const popupContent = popupContainer;
    return popupContent;
  },
  createProjectPrevenZonePopupContent: function (args) {
    // 创建防治分区弹窗
    // e.g.
    // const popupContent = _map.createProjectPrevenZonePopupContent({
    //   feature,
    //   projectName,
    //   description,
    //   projectId,
    //   activeTabKey,
    // });
    const { feature, projectName, description, projectId, activeTabKey } = args;

    const areaTurf = (turf.area(feature.geometry) * 0.0001).toFixed(3);
    const popupContainer = L.DomUtil.create("div");
    popupContainer.innerHTML = `
            <div>
              <strong>防治分区</strong><br/>
              图形面积:${valid(areaTurf)}公顷<br/>
              关联项目:<a class='js-show-project-info'>${valid(
                projectName,
              )}</a><br/>
              描述：${valid(description)}<br/>
              <a class='js-locate'>定位</a>
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
    const popupContent = popupContainer;
    return popupContent;
  },
  createProjectFocusPopupContent: function (args) {
    //创建弃土弃渣（取弃土场）弹窗
    //e.g.
    // const popupContent = _map.createProjectFocusPopupContent({
    //   feature,
    //   projectName,
    //   projectId,
    //   activeTabKey,
    //   maxHeight,
    //   designScope,
    //   volume,
    // });

    const {
      feature,
      projectName,
      projectId,
      activeTabKey,
      maxHeight,
      designScope,
      volume,
    } = args;

    const areaTurf = (turf.area(feature.geometry) * 0.0001).toFixed(3);
    const popupContainer = L.DomUtil.create("div");
    popupContainer.innerHTML = `
            <div>
              <strong>取弃土场：${name}</strong><br/>
              图形面积:${valid(areaTurf)}公顷<br/>
              关联项目:<a class='js-show-project-info'>${valid(
                projectName,
              )}</a><br/>
              最大高度：${valid(maxHeight)}米<br/>
              设计规模：${valid(designScope)}<br/>
              方量：${valid(volume)}立方米<br/>
              <a class='js-locate'>定位</a>
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
        this.createHighlight(feature).addTo(this).addTo(this);
      });

    const popupContent = popupContainer;
    return popupContent;
  },
  locateProjectById: function (args) {
    const { id, dispatch, projectName } = args;
    const payload = { id };
    dispatch({
      type: "map/queryProjectPosition",
      payload: payload,
      callback: (res) => {
        const { success, result } = res;
        if (!success) {
          return;
        }
        const { pointX, pointY, id, type } = result;
        if (!pointX || !pointY) {
          message.info({
            message: "项目无可用位置信息，请先设置项目点位！",
          });
          return;
        }
        const feature = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [pointX, pointY],
          },
        };
        this.locate(feature, { maxZoom: 17 });
        if (projectName) {
          this.openPopup(projectName, [pointY, pointX], { offset: [0, -20] });
        }
        this.createHighlight(feature).addTo(this);
      },
    });
  },
});
