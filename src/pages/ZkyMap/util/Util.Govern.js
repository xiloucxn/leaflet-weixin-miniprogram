import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as turf from "@turf/turf";
import * as Geom from "./Util.Geom";
import * as Layer from "./Util.Layer";
import * as Dom from "./Util.Dom";
import * as Common from "./Util.Common";
import mapHelper from "../../../utils/mapHelper";
import jQuery from "jquery";

const $ = jQuery;
const valid = mapHelper.valid;
const selectOne = Dom.selectOne;


// 扩展治理模块功能
L.Map.include({
  addKeyGovernProject: function (args) {
    const getLabel = (v = "", list = [], label = "label", value = "value") => {
      if (v || v === 0 || v === false) {
        const result = list.filter((i) => i[value] === v);
        return result.length ? result[0][label] : "";
      } else {
        return "";
      }
    };

    // 添加重点工程

    const { dispatch, dictList, areaList, filter } = args;

    //清空图层
    const layerGroup = this.getLayerGroup("keyGovernProject").clearLayers();

    //todo：获取筛选条件
    const payload = { maxResultCount: 9999999, ...filter };
    dispatch &&
      dispatch({
        type: "govern/governEnginList",
        payload: payload,
        callback: (success, result) => {
          console.log("governEnginList:", result);
          if (!success) {
            return;
          }

          dispatch({
            type: "govern/save",
            payload: { governEnginList: result.items },
          });
          const featureCollection = Geom.itemsToFeatureCollection(
            result.items,
          );

          const options = {
            onEachFeature: (feature, layer) => {
              let {
                properties: {
                  project: { name },
                  year,
                  id,
                  districtCodeId,
                  typeId,
                },
              } = feature;

              //todo：翻译行政区和类型
              districtCodeId = districtCodeId + "";
              const district =
                getLabel(districtCodeId, areaList) || districtCodeId;
              const type = getLabel(typeId, dictList) || typeId;

              const popupContent = this.createKeyGovernProjectPopupContent({
                feature,
                name,
                year,
                id,
                district,
                type,
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
              let icon = L.icon({
                iconUrl: `./img/project_blue.png`,
                iconSize: [36 / 2, 36 / 2], // size of the icon
                // iconAnchor: [10, 28], // point of the icon which will correspond to marker's location
              });
              return L.marker(latlng, {
                icon: icon,
              });
            },
          };

          const layer = this.createGeoJSON(
            featureCollection,
            options,
          ).addTo(layerGroup);
          return layer;
          // this.locate(spotFeatureCollection);
        },
      });
  },
  createKeyGovernProjectPopupContent: function (args) {
    // 创建重点项目弹窗(不可编辑)
    // e.g.

    const { feature, name, year, id, district, type } = args;
    // const areaTurf = (turf.area(feature.geometry) * 0.0001).toFixed(3);
    const popupContainer = L.DomUtil.create("div");
    popupContainer.innerHTML = `
            <div>
              <strong>名称:${name}</strong><br/>
              行政区划:${valid(district)}<br/>
              类型:${valid(type)}<br/>
              年度:${valid(year)}<br/>
              <a class='js-locate'>定位</a>
              <a class='js-show-key-govern-project-info'>详情</a>
            </div>`;

    // 绑定弹窗点击事件
    // 定位按钮
    const $locate = selectOne(".js-locate", popupContainer);
    $locate &&
      L.DomEvent.on($locate, "click", (e) => {
        console.log("click .js-locate", feature);
        this.locate(feature, { maxZoom: 17, paddingTopLeft: [394, 0] });
        this.createHighlight(feature).addTo(this);
      });

    const $showKeyGovernProject = selectOne(
      ".js-show-key-govern-project-info",
      popupContainer,
    );
    $showKeyGovernProject &&
      L.DomEvent.on($showKeyGovernProject, "click", (e) => {
        console.log("click .js-show-key-govern-project-info", feature);
        this.fire("showKeyGovernProject", feature);
      });

    const popupContent = popupContainer;
    return popupContent;
  },
  createSocialGovernSpotPopupContent: function (args) {
    // 创建社会治理图斑弹窗(不可编辑)
    // e.g.

    const { feature, mapNum, projectName, projectId } = args;
    const areaTurf = (turf.area(feature.geometry) * 0.0001).toFixed(3);
    const popupContainer = L.DomUtil.create("div");
    popupContainer.innerHTML = `
            <div>
              <strong>图斑编号:${mapNum}</strong><br/>
              图形面积:${valid(areaTurf)}公顷<br/>
              关联项目:<a class='js-show-project-info'>${valid(
                projectName,
              )}</a><br/>
              <a class='js-locate'>定位</a>
              <a class='js-show-spot-info'>详情</a>
            </div>`;

    // 绑定弹窗点击事件
    // 关联项目按钮
    const $showProjectInfo = selectOne(".js-show-project-info", popupContainer);
    $showProjectInfo &&
      L.DomEvent.on($showProjectInfo, "click", (e) => {
        console.log("click .js-show-project-info", feature);
        this.fire("showProjectInfo", feature);
      });
    // 定位按钮
    const $locate = selectOne(".js-locate", popupContainer);
    $locate &&
      L.DomEvent.on($locate, "click", (e) => {
        console.log("click .js-locate", feature);
        this.locate(feature, { maxZoom: 17, paddingTopLeft: [394, 0] });
        this.createHighlight(feature).addTo(this);
      });
    // 图斑详情按钮
    const $showSpotInfo = selectOne(".js-show-spot-info", popupContainer);
    $showSpotInfo &&
      L.DomEvent.on($showSpotInfo, "click", (e) => {
        console.log("click .js-show-spot-info", feature);
        this.fire("showSpotInfo", feature);
      });

    const popupContent = popupContainer;
    return popupContent;
  },
  locateGovernSpotById: function (args) {
    // 根据治理图斑id高亮定位
    // e.g.

    const { spotId, dispatch, paddingTopLeft } = args;

    if (!spotId) {
      return;
    }

    const payload = { tableNames: ["GovernSpot"], id: spotId };
    dispatch &&
      dispatch({
        type: "map/pierce",
        payload: payload,
        callback: (success, result) => {
          if (result.length === 0) {
            return;
          }
          console.log(result);
          let popupContent = L.DomUtil.create("div");
          $(popupContent).css({
            maxHeight: "300px",
            overflow: "auto",
          });

          const item = result[0];

          const { tableName } = item;
          const feature = Geom.objToFeature(item);
          if (tableName === "GovernSpot") {
            // 社会治理图斑
            const { id, name, mapNum, projectId, projectName } = item;
            const itemPopupContent = this.createSocialGovernSpotPopupContent({
              feature,
              mapNum,
              projectName,
              projectId,
            });
            $(popupContent).append(itemPopupContent);
          }

          //如果没有加载图层则加载
          this.getLayerGroup("socialGovernSpot").addTo(this);

          const locateOptions = paddingTopLeft ? { paddingTopLeft } : {};
          this.locate(feature, locateOptions);
          const centroid = Geom.getCenterInFeature(feature);
          this.openPopup(popupContent, [
            centroid.geometry.coordinates[1],
            centroid.geometry.coordinates[0],
          ]);
          this.createHighlight(feature).addTo(this);
        },
      });
  },
  locateKeyGovernEnginById: function (args) {
    // 根据重点工程点id高亮定位
    // e.g.

    const { spotId, dispatch } = args;

    if (!spotId) {
      return;
    }

    const payload = { tableNames: ["GovernSpot"], id: spotId };
    dispatch &&
      dispatch({
        type: "map/pierce",
        payload: payload,
        callback: (success, result) => {
          if (result.length === 0) {
            return;
          }
          console.log(result);
          let popupContent = L.DomUtil.create("div");
          $(popupContent).css({
            maxHeight: "300px",
            overflow: "auto",
          });

          const item = result[0];

          const { tableName } = item;
          const feature = Geom.objToFeature(item);
          if (tableName === "GovernSpot") {
            // 社会治理图斑
            const { id, name, mapNum, projectId, projectName } = item;
            const itemPopupContent = this.createSocialGovernSpotPopupContent({
              feature,
              mapNum,
              projectName,
              projectId,
            });
            $(popupContent).append(itemPopupContent);
          }

          //如果没有加载图层则加载
          this.getLayerGroup("socialGovernSpot").addTo(this);

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
