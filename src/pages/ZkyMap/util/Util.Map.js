import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as turf from "@turf/turf";
import * as Geom from "./Util.Geom";
import * as Layer from "./Util.Layer";
import * as Dom from "./Util.Dom";
import proj4 from "proj4";
import "../../../components/Map/ZoomInfo/L.Control.Zoominfo.css";
import "../../../components/Map/ZoomInfo/L.Control.Zoominfo";
import "../../../components/Map/MiniMap/Control.MiniMap.min.css";
import "../../../components/Map/MiniMap/Control.MiniMap.min";
import mapHelper from "../../../utils/mapHelper";
import jQuery from "jquery";

const $ = jQuery;

L.Map.include({
  locate: function (geojson, options) {
    if (!Geom.isValidGeoJSON(geojson)) {
      console.warn("该数据缺少空间信息", geojson);
      return false;
    }
    const _options = {};
    L.Util.extend(_options, options);
    let bbox = turf.bbox(geojson);
    let bounds = Geom.bbox2latLngBounds(bbox);
    if (bbox[0] === Infinity) {
      return this;
    }
    this.fitBounds(bounds, _options);
    return this;
  },
  createHighlight: function (geojson, options = {}) {
    this.clearHighlight();
    if (!Geom.isValidGeoJSON(geojson)) {
      return false;
    }
    // 区分点、线、面的高亮效果
    if (geojson.type === "Feature" && geojson.geometry.type === "Point") {
      const blueIcon = L.icon({
        iconUrl: "./img/blue_mark.png",
        iconSize: [32, 32], // size of the icon
        iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
      });
      const pointX = geojson.geometry.coordinates[0];
      const pointY = geojson.geometry.coordinates[1];
      this._highlight = L.marker([pointY, pointX], {
        icon: blueIcon,
      }).addTo(this);
    } else {
      //高亮样式符号style
      const highlightStyle = {
        fillColor: "#e6d933", //填充颜色
        fillOpacity: 0, //填充透明度
        stroke: true, //是否显示边框
        fill: true, //是否填充颜色
        color: "#00bfff", //边框颜色
        opacity: 1, //边框透明度
        weight: 4, //边框宽度
      };
      const _options = {
        interactive: false,
        style: highlightStyle,
        pmIgnore: true,
      };
      options.style = L.Util.extend({}, _options.style, options.style);
      L.Util.extend(_options, options);
      this._highlight = L.geoJSON(geojson, _options);
    }
    return this._highlight;
  },
  createHighlightPoint: function ([pointX, pointY], options = {}) {
    this.clearHighlight();
    if (!pointX || !pointY) {
      return;
    }
    const geojson = Geom.createPointFeature({
      pointX: pointX,
      pointY: pointY,
    });

    if (!Geom.isValidGeoJSON(geojson)) {
      return;
    }

    const blueIcon = L.icon({
      iconUrl: "./img/blue_mark.png",
      iconSize: [32, 32], // size of the icon
      iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    });

    this._highlight = L.marker([pointY, pointX], {
      icon: blueIcon,
    });
    return this._highlight;
  },
  clearHighlight: function () {
    this._highlight && this._highlight?.remove();
    return this;
  },
  addAutoClearHighlight: function () {
    this.on("click popupclose", this.clearHighlight, this);
    return this;
  },
  removeClickClearHighlight: function () {
    this.off("click", this.clearHighlight, this);
    return this;
  },
  createMarker: function (geojson, options) {
    const blueIcon = L.icon({
      iconUrl: "./img/blue_mark.png",
      iconSize: [32, 32], // size of the icon
      iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    });
    const _options = {
      icon: blueIcon,
    };
    L.Util.extend(_options, options);
    let geojsonLayer = null;
    //如果是点，用L.marker绘制返回
    if (geojson.type === "Feature" && geojson.geometry.type === "Point") {
      geojsonLayer = L.marker(
        [geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]],
        _options,
      );
    }
    return geojsonLayer;
  },
  createGeoJSON: function (geojson, options) {
    if (!Geom.isValidGeoJSON(geojson)) {
      return;
    }
    const _options = {
      pmIgnore: true,
      interactive: true,
    };
    L.Util.extend(_options, options);
    let geojsonLayer = null;
    geojsonLayer = L.geoJSON(geojson, _options);
    return geojsonLayer;
  },
  openPopupByGeojson: function (geojson, popupContent, options) {
    const _options = {};
    L.Util.extend(_options, options);

    let centerPoint = turf.center(geojson);
    let centerPointLatLng = Geom.lngLatToLatLngPoint(centerPoint);
    if (centerPointLatLng) {
      this.openPopup(popupContent, centerPointLatLng);
    }
    return this;
  },
  getLayerGroup: function (name, addToMap = false) {
    if (!("layerGroups" in this)) {
      this["layerGroups"] = {};
    }
    let layerGroups = this["layerGroups"];
    if (!(name in layerGroups)) {
      layerGroups[name] = L.layerGroup();
    }
    addToMap && layerGroups[name].addTo(this);
    return layerGroups[name];
  },
  createImageLayer: function (url, options) {
    const _options = {};
    L.Util.extend(_options, options);
    let imageLayer = L.tileLayer(url, _options);
    return imageLayer;
  },
  removeTmpGeoJSONLayer: function () {
    this.tmpGeoJSONLayer && this.tmpGeoJSONLayer.remove();
  },
  getListeners: function (type) {
    if (typeof type !== "string") {
      console.warn('"string" type argument expected');
    }

    var listeners = this._events && this._events[type];
    if (listeners && listeners.length) {
      return listeners;
    }

    return [];
  },
  createZoominfo: function (options) {
    const _options = {};
    L.Util.extend(_options, options);
    const zoomInfo = L.control.zoominfo();
    return zoomInfo;
  },
  createMiniMap: function (options) {
    const _options = { toggleDisplay: true, minimized: true };
    L.Util.extend(_options, options);
    const tdtVec = mapHelper.createTdtVec();
    const miniMap = L.control.minimap(tdtVec, _options);
    return miniMap;
  },
  addAutoGetImagesByBounds: function (args) {
    const { dispatch } = args;
    this.on(
      "moveend zoomend",
      () => {
        let zoom = this.getZoom();
        const bounds = this.getBounds();
        zoom > 17 ? (zoom = 17) : null;
        let xyMin = proj4("EPSG:4326", "EPSG:3857", [
          bounds.getSouthWest().lng,
          bounds.getSouthWest().lat,
        ]);
        let xyMax = proj4("EPSG:4326", "EPSG:3857", [
          bounds.getNorthEast().lng,
          bounds.getNorthEast().lat,
        ]);
        let params = {
          level: zoom, //地图当前范围级别
          xmin: xyMin[0], //地图当前范围x最小值
          xmax: xyMax[0], //地图当前范围x最大值
          ymin: xyMin[1], //地图当前范围y最小值
          ymax: xyMax[1], //地图当前范围y最大值
        };
        dispatch &&
          dispatch({
            type: "map/getInfoByExtent",
            payload: params,
          });
      },
      this,
    );
    this.fire("zoomend"); //主动触发1次，防止一开始历史影像无法使用
    this.fire("zoomend"); //主动触发2次，防止一开始历史影像无法使用
    return this;
  },
  addScale: function (options) {
    //将定制化的比例尺组件L.control.scale加入指定地图
    const _options = {
      imperial: false,
      position: "bottomright",
    };
    L.Util.extend(_options, options);
    const scale = L.control.scale(_options).addTo(this);
    $(scale.getContainer()).find("div").css({
      background: "rgba(255, 255, 255, 1)",
      border: "1px solid #000",
      borderTop: "none",
    });
    return this;
  },
  addZoomInfo: function (options) {
    const _options = {};
    L.Util.extend(_options, options);
    L.control.zoominfo().addTo(this);
    return this;
  },
  addMiniMap: function (options) {
    const _options = {
      toggleDisplay: true,
      minimized: false,
    };
    L.Util.extend(_options, options);
    const layer = Layer.createTdtVec();
    const miniMap = new L.Control.MiniMap(layer, _options);
    miniMap.addTo(this);
    return this;
  },
  addImageDate: function (args) {
    const { style, jgImgLayer, show } = args;
    this.removeImageDate();
    const container = L.DomUtil.create("div");
    const containerStyle = {
      display: "block",
      position: "absolute",
      bottom: "5px",
      right: "250px",
      zIndex: 1000,
      background: "#fff",
      padding: "0 5px",
      ...style,
    };

    L.DomUtil.addClass(container, "image-date");
    Object.assign(container.style, containerStyle);

    const spanStyle = {
      padding: "10px",
    };

    container.innerHTML = `
    <span class='image-date-text' style=${JSON.stringify(spanStyle)}>
      影像时间:
    </span>
    `;
    const mapContainer = this.getContainer();
    mapContainer.appendChild(container);
    container.setText = (date) => {
      Dom.selectOne(".image-date-text", container).innerHTML = `影像时间:${
        date ? date : ""
      }`;
    };
    container.hide = () => {
      $(container).hide();
    };
    container.show = () => {
      $(container).show();
    };
    this._imageDate = container;

    //设置是否显示日期
    jgImgLayer.on("add", () => {
      this._imageDate.show();
    });
    jgImgLayer.on("remove", () => {
      this._imageDate.hide();
    });

    this.on(
      "addSideBySide addHistoryImage",
      () => {
        this._imageDate.hide();
      },
      this,
    );

    this.on(
      "removeSideBySide removeHistoryImage",
      () => {
        if (this.hasLayer(jgImgLayer)) {
          this._imageDate.show();
        }
      },
      this,
    );

    this.on(
      "zoomend moveend",
      () => {
        if (this.hasLayer(jgImgLayer)) {
          this._imageDate.show();
        } else {
          this._imageDate.hide();
        }
      },
      this,
    );

    show ? this._imageDate.show() : this._imageDate.hide();
    return container;
  },
  removeImageDate: function () {
    this._imageDate && L.DomUtil.remove(this._imageDate);
    this._imageDate = null;
    this.off(
      "addSideBySide addHistoryImage removeSideBySide removeHistoryImage",
    );
  },
  setAutoChangeLayer: function (args) {
    let {
      lastZoom = 0,
      changeLevel = 12.5,
      lastVecLayer,
      lastImgLayer,
      vecLayers,
      imgLayers,
      overLayers,
    } = args;
    vecLayers.forEach((layer) => {
      layer.on(
        "add",
        () => {
          lastVecLayer = layer;
        },
        layer,
      );
    });
    imgLayers.forEach((layer) => {
      layer.on(
        "add",
        () => {
          lastImgLayer = layer;
        },
        layer,
      );
    });

    this.on("zoomend", (e) => {
      const zoom = this.getZoom();
      if (lastZoom < changeLevel && zoom > changeLevel) {
        // 地图放大至超过changeLevel时，切换影像地图
        this.addLayer(lastImgLayer);
        this.removeLayer(lastVecLayer);
        overLayers &&
          overLayers.forEach((layer) => {
            this.addLayer(layer);
          });
      }
      if (lastZoom > changeLevel && zoom < changeLevel) {
        // 地图缩小至超过changeLevel时，切换矢量地图
        this.addLayer(lastVecLayer);
        this.removeLayer(lastImgLayer);
        overLayers &&
          overLayers.forEach((layer) => {
            this.removeLayer(layer);
          });
      }
      lastZoom = zoom;
    });
    return this;
  },
  updatePierceTableNames: function () {
    this.pierceTableNames = [];
    this.pierceLayers.forEach((layer) => {
      this.hasLayer(layer) && this.pierceTableNames.push(layer.tableName);
    });

    function removeDuplicates(arr) {
      return arr.filter((item, index) => arr.indexOf(item) === index);
    }

    this.pierceTableNames = removeDuplicates(this.pierceTableNames);
    return this.pierceTableNames;
  },
  setPierceLayers: function (args) {
    const { pierceLayers } = args;
    this.pierceLayers = pierceLayers;
    this.updatePierceTableNames();

    pierceLayers.forEach((layer) => {
      layer.on(
        "add remove",
        (e) => {
          this.updatePierceTableNames();
        },
        this,
      );
    });
    return this.pierceLayers;
  },
  addPierce: function (args) {
    const {
      dispatch,
      editable = false,
      setShowConfirmDivide,
      cancelDivide,
      setShowConfirmEdit,
    } = args;
    this.on("click", (e) => {
      if (this._handlePM || this.divideLayers) {
        //正在编辑图形时，不触发点击事件
        return;
      }
      const tableNames = this.pierceTableNames;
      if (!tableNames || tableNames.length === 0) {
        return;
      }
      const reviewPlanId = this.reviewPlanId;
      const payload = {
        tableNames,
        reviewPlanId,
        pointX: e.latlng.lng,
        pointY: e.latlng.lat,
      };
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

          result.forEach((item) => {
            const { tableName } = item;
            const feature = Geom.objToFeature(item);
            if (tableName === "ProjectScope") {
              //项目红线
              const { id, projectId, projectName } = item;

              //弹窗内容
              const itemPopupContent = this.createProjectScopePopupContent({
                feature,
                projectName,
                projectId,
              });
              $(popupContent).append(itemPopupContent);
            }
            if (tableName === "Spot") {
              // 扰动图斑
              const {
                id: spotId,
                mapNum,
                reviewPlanName,
                reviewPlanId,
                interferenceComplianceValue,
                projectId,
                projectName,
              } = item;

              //弹窗内容
              const itemPopupContent = editable
                ? this.createEditSpotPopupContent({
                    feature,
                    mapNum,
                    reviewPlanName,
                    projectName,
                    interferenceCompliance: interferenceComplianceValue,
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
                    interferenceComplianceValue,
                    spotId,
                    projectId,
                  });
              $(popupContent).append(itemPopupContent);
            }
            if (tableName === "ProjectPrevenZone") {
              // 防治分区
              const { id, description, projectId, projectName } = item;

              const itemPopupContent = this.createProjectPrevenZonePopupContent(
                {
                  feature,
                  projectName,
                  description,
                  projectId,
                },
              );
              $(popupContent).append(itemPopupContent);
            }
            if (tableName === "ProjectFocus") {
              // 弃土弃渣
              const {
                id,
                name,
                maxHeight,
                designScope,
                volume,
                projectId,
                projectName,
              } = item;
              const itemPopupContent = this.createProjectFocusPopupContent({
                feature,
                projectName,
                projectId,
                maxHeight,
                designScope,
                volume,
              });
              $(popupContent).append(itemPopupContent);
            }
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
          });

          const resultFC = Geom.itemsToFeatureCollection(result);
          this.createHighlight(resultFC).addTo(this);
          this.openPopup(popupContent, e.latlng);
          L.DomEvent.stopPropagation(e);
        },
      });
    });
  },
  addMask: function (args) {
    const { dispatch, request = true, locate = true } = args;
    if (request) {
      dispatch({
        //登录进入地图页面，获取当前账号的行政区划范围
        type: "map/GetBoundAsync",
        callback: (res) => {
          const { result, success, error } = res;
          console.log("bounds", res);
          const userBound = {
            type: "Feature",
            geometry: JSON.parse(result),
          };

          //初始定位至行政区划范围
          if (locate) {
            this.locate(userBound);
          }
          this.userBound = userBound;

          const wordBound = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-180, -90],
                  [180, -90],
                  [180, 90],
                  [-180, 90],
                  [-180, -90],
                ],
              ],
            },
          };

          let maskFeature = turf.difference(wordBound, userBound);
          localStorage.setItem("maskFeature", JSON.stringify(maskFeature));
          this.createPane("maskPane");
          this.getPane("maskPane").style.zIndex = 500;
          const maskLayer = this.createGeoJSON(maskFeature, {
            style: {
              color: "#0070FF",
              weight: 3,
              opacity: 1,
              fillColor: "rgba(0, 0, 0, 0.45)",
              fillOpacity: 1,
            },
            pane: "maskPane",
          }).addTo(this);
          $(maskLayer.getPane()).find("path").css({
            cursor: "not-allowed",
          });
        },
      });
    } else {
      let maskFeature = localStorage.getItem("maskFeature");
      if (!maskFeature) {
        dispatch({
          //登录进入地图页面，获取当前账号的行政区划范围
          type: "map/GetBoundAsync",
          callback: (res) => {
            const { result, success, error } = res;
            console.log("bounds", res);
            const userBound = {
              type: "Feature",
              geometry: JSON.parse(result),
            };

            //初始定位至行政区划范围
            if (locate) {
              this.locate(userBound);
            }
            this.userBound = userBound;

            const wordBound = {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [-180, -90],
                    [180, -90],
                    [180, 90],
                    [-180, 90],
                    [-180, -90],
                  ],
                ],
              },
            };

            let maskFeature = turf.difference(wordBound, userBound);
            localStorage.setItem("maskFeature", JSON.stringify(maskFeature));
            this.createPane("maskPane");
            this.getPane("maskPane").style.zIndex = 500;
            const maskLayer = this.createGeoJSON(maskFeature, {
              style: {
                color: "#0070FF",
                weight: 3,
                opacity: 1,
                fillColor: "rgba(0, 0, 0, 0.45)",
                fillOpacity: 1,
              },
              pane: "maskPane",
            }).addTo(this);
            $(maskLayer.getPane()).find("path").css({
              cursor: "not-allowed",
            });
          },
        });
        return;
      }

      if (this.userBound && locate) {
        //初始定位至行政区划范围
        if (locate) {
          this.locate(this.userBound);
        }
      }

      maskFeature = JSON.parse(maskFeature);
      this.createPane("maskPane");
      this.getPane("maskPane").style.zIndex = 500;
      const maskLayer = this.createGeoJSON(maskFeature, {
        style: {
          color: "#0070FF",
          weight: 3,
          opacity: 1,
          fillColor: "rgba(0, 0, 0, 0.45)",
          fillOpacity: 1,
        },
        pane: "maskPane",
      }).addTo(this);
      $(maskLayer.getPane()).find("path").css({
        cursor: "not-allowed",
      });
    }
  },
  addPhotoLocation: function (args) {
    const { show, data } = args;
    if (!data) {
      return;
    }
    const { longitude, latitude, fileName = "", description = "" } = data;
    if (!longitude || !latitude) {
      return;
    }
    const layerGroup = this.getLayerGroup("imageLocate", true).clearLayers();
    const pointFeature = Geom.createPointFeature({
      pointX: longitude,
      pointY: latitude,
    });
    /*
     * 根据方位角获取对应的图片
     */
    const getPicByAzimuth = (azimuth) => {
      let pic;
      pic =
        azimuth === 0
          ? "north"
          : azimuth < 90
          ? "east_north"
          : azimuth === 90
          ? "east"
          : azimuth < 180
          ? "east_south"
          : azimuth === 180
          ? "south"
          : azimuth < 270
          ? "west_south"
          : azimuth === 270
          ? "west"
          : azimuth < 360
          ? "west_north"
          : "north";
      return pic;
    };

    if (show) {
      if (data.latitude && data.longitude) {
        let latLng = [data.latitude, data.longitude];
        //direction 方位角
        let picName = getPicByAzimuth(data.azimuth);
        let myIcon = L.icon({
          iconUrl: "./img/" + picName + ".png",
          iconSize: [60, 60],
        });
        L.marker(latLng, { icon: myIcon })
          .addTo(layerGroup)
          .on("click", (e) => {
            console.log("点击照片", args);
            if (this._handlePM) {
              return;
            }
            this.openPopup(`图片名：${fileName}`, e.latlng, {
              offset: [0, -20],
            });
          });
        let cameraIcon = L.icon({
          iconUrl: "./img/camer.png",
          iconSize: [32, 32],
          iconAnchor: [14, 32],
        });
        L.marker(latLng, {
          icon: cameraIcon,
        })
          .addTo(layerGroup)
          .on("click", (e) => {
            console.log("点击照片", args);
            this.openPopup(`图片名：${fileName}`, e.latlng, {
              offset: [0, -20],
            });
            // emitter.emit("showPanorama", {
            //   show: true,
            //   fullviewURL: fullviewURL,
            // });
          });
        this.locate(pointFeature, { maxZoom: 17 });
      } else {
        // message.info({
        //   message: "照片无可用位置信息！",
        // });
      }
    }
  },
  selectPoint: function (args) {
    const { callback, point } = args;
    if (point) {
      const { pointY, pointX } = point;
      const pointFeature = Geom.createPointFeature({
        pointX: pointX,
        pointY: pointY,
      });
      pointFeature && this.locate(pointFeature, { maxZoom: 17 });
    }

    this._handlePM = true;
    const container = this.getContainer();
    container?.focus();
    L.DomUtil.addClass(container, "leaflet-draw-ondraw");

    this.once("click", (e) => {
      if (!this._handlePM) {
        return;
      } //如果中途撤销点选功能，则不触发后续流程
      console.log(e);
      const selectPt = { pointX: e.latlng.lng, pointY: e.latlng.lat };
      this.cancelSelectPoint();
      if (typeof callback === "function") {
        callback(selectPt);
      }
    });
  },
  cancelSelectPoint: function () {
    this._handlePM = false;
    const container = this.getContainer();
    L.DomUtil.removeClass(container, "leaflet-draw-ondraw");
  },
  setLayerLevel: function (args) {
    let { layer, min = 0, max = 20, lastZoom = 7 } = args;
    if (!layer) {
      return;
    }
    this.on(
      "zoomend moveend",
      (e) => {
        const zoom = this.getZoom();
        if (
          (lastZoom < min && zoom >= min) ||
          (lastZoom > max && zoom <= max)
        ) {
          this.addLayer(layer);
        }
        if (
          (lastZoom >= min && zoom < min) ||
          (lastZoom <= max && zoom > max)
        ) {
          this.removeLayer(layer);
        }
        lastZoom = zoom;
      },
      layer,
    );
  },
});
