import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import "leaflet.pm/dist/leaflet.pm.css"; //leaflet绘制多边形插件
// import "leaflet.pm"; //leaflet绘制多边形插件
import "./Util.Draw.less";
import "../../../components/Map/leaflet-geoman-develop/src/js/L.PM";
import * as Geom from "./Util.Geom";
import * as turf from "@turf/turf";
import jQuery from "jquery";
import { message } from "antd";
import ZkyMap from "../ZkyMap";

const $ = jQuery;

L.Map.include({
  addLeafletPM: function (options) {
    const _options = {
      position: "topleft",
      drawCircle: false,
      finishOn: "dblclick",
      // continueDrawing: "true",
      drawControls: false,
      rotateMode: false,
      removalMode: false,
    };
    L.Util.extend(_options, options);

    this.pm.addControls(_options);
    let drawOption = this._getDrawOptions();
    this.pm.Draw.Line.setOptions(drawOption);
    this.pm.Draw.Polygon.setOptions(drawOption);
    this.pm.Draw.Rectangle.setOptions(drawOption);
    this.pm.Draw.Cut.setOptions(drawOption);
    this.pm.Draw.Union.setOptions(drawOption);
  },
  _beforeDraw: function () {
    this.fire("beforeDraw", { messageInfo: "鼠标左键单击地图开始绘制" }, false);
    //改变鼠标样式为十字
    let container = this.getContainer();
    L.DomUtil.addClass(container, "leaflet-draw-ondraw");
  },
  _finishDraw: function () {
    let data = arguments.length > 1 ? arguments : arguments[0];
    this.fire("finishDraw", data, false);
    let container = this.getContainer();
    L.DomUtil.removeClass(container, "leaflet-draw-ondraw");
  },
  clearDraw: function () {
    // this._drawLayers.clearLayers();
    this.off("pm:create");
    this.pm.disableDraw();
    this.pm.disableGlobalEditMode();
    let container = this.getContainer();
    L.DomUtil.removeClass(container, "leaflet-draw-ondraw");
  },
  removeDrawPoint: function () {
    if (this.editPoint) {
      this.editPoint?.remove();
      this.editPoint = null;
    }
  },
  removeEditLayer: function () {
    if (this._editLayer) {
      this._editLayer?.remove();
      this._editLayer = null;
    }
  },
  _getDrawOptions: function (options = {}) {
    const _options = {
      finishOn: "dblclick",
      allowSelfIntersection: false,
      tooltips: true,
      snappable: false,
      // continueDrawing: "false",
      snapDistance: 1,
    };
    L.Util.extend(_options, options);
    return _options;
  },
  drawPoint: function (options, callbackFn) {
    this.fire("pm:drawstart");
    this._beforeDraw();
    const container = this.getContainer();
    container?.focus();

    this.removeDrawPoint();

    const blueIcon = L.icon({
      iconUrl: "./img/blue_mark.png",
      iconSize: [32, 32], // size of the icon
      iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    });
    this.once(
      "click",
      (e) => {
        this.fire("pm:drawend");
        let pointX, pointY;
        if (!e.latlng) {
          return {
            pointX: null,
            pointY: null,
            messageInfo: "e.latlng不存在！",
          };
        }
        pointX = e.latlng.lng;
        pointY = e.latlng.lat;

        this.editPoint = L.marker([pointY, pointX], {
          icon: blueIcon,
        }).addTo(this);
        let drawCompleteData = {
          messageInfo: "绘制完成",
          data: { pointX, pointY, layer: this.editPoint },
        };
        if (typeof callbackFn === "function") {
          callbackFn(drawCompleteData);
        }
        this._finishDraw(drawCompleteData);
      },
      this,
    );
  },
  drawLine: function (options, callbackFn) {
    let drawOptions = this._getDrawOptions(options);
    const container = this.getContainer();
    container?.focus();
    this.off("pm:create");
    this.on("pm:create", (e) => {
      // console.log("绘制完成", e);
      let drawCompleteData = {
        messageInfo: "绘制完成",
        data: e,
      };
      this._finishDraw(drawCompleteData);
      if (typeof callbackFn === "function") {
        callbackFn(drawCompleteData);
      }
      this.clearDraw();
    });
    this.pm.enableDraw("Line", drawOptions);
  },
  drawRect: function (options, callbackFn) {
    let drawOptions = this._getDrawOptions(options);
    const container = this.getContainer();
    container?.focus();
    this.off("pm:create");
    this.once("pm:create", (e) => {
      // console.log("绘制完成", e);
      let drawCompleteData = {
        messageInfo: "绘制完成",
        data: e,
      };
      this._finishDraw(drawCompleteData);
      if (typeof callbackFn === "function") {
        callbackFn(drawCompleteData);
      }
      this.clearDraw();
    });
    this.pm.enableDraw("Rectangle", drawOptions);
  },
  drawPolygon: function (options, callbackFn) {
    let drawOptions = this._getDrawOptions(options);
    const container = this.getContainer();
    container?.focus();
    this.off("pm:create");
    this.once("pm:create", (e) => {
      
      const feature = e.layer.toGeoJSON();
      const multiPolygon=Geom.polygonsToMultiPolygonFeature([feature])
      const wkt=Geom.geoJSONToWkt(multiPolygon)

      // console.log("绘制完成", e);
      let drawCompleteData = {
        messageInfo: "绘制完成",
        data: e,
        multiPolygon,
        wkt
      };
      this._finishDraw(drawCompleteData);
      if (typeof callbackFn === "function") {
        callbackFn(drawCompleteData);
      }
      this.clearDraw();
    });
    this.pm.enableDraw("Polygon", drawOptions);
  },
  getEditFeature: function () {
    let editFeature = {
      layer: null,
      feature: null,
      wktGeom: null,
      point: null,
    };
    if (!this._editLayer) {
      return editFeature;
    }
    const layer = this._editLayer;
    const feature = Geom.editLayerToMultiPolygon(layer);
    if (!Geom.isValidGeoJSON(feature)) {
      return editFeature;
    }
    const wktGeom = Geom.geoJSONToWkt(feature);

    const centerPt = Geom.getCenterInFeature(feature);
    const pointX = centerPt.geometry.coordinates[0];
    const pointY = centerPt.geometry.coordinates[1];
    const point = { pointX, pointY };
    editFeature = { layer, feature, wktGeom, point };
    return editFeature;
  },
  startEditFeature: function (feature, options, args = {}) {
    const { showMessage = true, saveWkt } = args;
    // const content = "新建图斑";
    let _options = {
      pmIgnore: false,
      style: {
        color: "red",
        fillOpacity: 0,
        weight: 2,
      },
      onEachFeature: (newFeature, layer) => {
        // 设置图形编辑
        layer.on("pm:change pm:cut", (e) => {
          e.layer.properties = { ...feature?.properties };
          this._editLayer = e.layer;
          const editFeature = this.getEditFeature();
          const { wktGeom } = editFeature;
          saveWkt && saveWkt(wktGeom);
        });
      },
    };
    L.Util.extend(_options, options);

    if (showMessage) {
      if (!this?.pm.controlsVisible()) {
        this?.pm.toggleControls();
      }
      message.info("请用地图左上角编辑工具栏编辑图形！");
    }

    //清空旧编辑图形
    this.removeEditLayer();
    console.log(feature, "feature");
    //绘制新图形，图形存在map._editLayer中
    if (Geom.isValidGeoJSON(feature)) {
      this._editLayer = this.createGeoJSON(feature, _options).addTo(this);
      this._editLayer.properties = { ...feature?.properties };
      const editFeature = this.getEditFeature();
      const { wktGeom } = editFeature;
      saveWkt && saveWkt(wktGeom);
    }
    return this;
  },
  cancelEdit: function () {
    if (this?.pm.controlsVisible()) {
      this?.pm.toggleControls();
    }
    this.clearDraw();
    this.removeEditLayer();
  },
  cancelDivide: function () {
    this.clearDraw();
    this.removeEditLayer();
    this.divideLayers = null;
    const layerGroup = this.getLayerGroup("cutResults", true);
    layerGroup && layerGroup.clearLayers();
  },
  _renderDivideLayers: function (feature, divideLayers) {
    const layerGroupName = "cutResults";
    const layerGroup = this.getLayerGroup(layerGroupName, true);
    layerGroup && layerGroup.clearLayers();
    const {
      properties: { id: spotId, reviewPlanId, mapNum, reviewPlan },
    } = feature;

    const cutStyle = {
      pmIgnore: true,
      interactive: true,
      color: "#00FF66",
      weight: 2,
      opacity: 1,
      fillColor: "#00FF66",
      fillOpacity: 0.45,
    };
    const selectedStyle = {
      color: "#FF0000", //00FF66
      weight: 2,
      opacity: 1,
      fillColor: "#FF0000",
      fillOpacity: 0.45,
    };

    if (!Array.isArray(divideLayers) || divideLayers.length !== 2) {
      return false;
    }

    const [divide1, divide2] = divideLayers;
    const divide1Area = turf.area(divide1);
    const divide2Area = turf.area(divide2);
    divide1.properties = {
      area: divide1Area,
      ...feature.properties,
    };
    divide2.properties = {
      area: divide2Area,
      ...feature.properties,
    };
    const maxArea = divide1Area > divide2Area ? divide1Area : divide2Area;
    const divide1Layer = this.createGeoJSON(divide1, {
      pmIgnore: true,
      interactive: true,
      style: divide1Area === maxArea ? selectedStyle : cutStyle,
    }).addTo(layerGroup);
    const divide2Layer = this.createGeoJSON(divide2, {
      pmIgnore: true,
      interactive: true,
      style: divide2Area === maxArea ? selectedStyle : cutStyle,
    }).addTo(layerGroup);
    divide1Layer.area = divide1Area;
    divide2Layer.area = divide2Area;

    //默认选中面积大的图形
    if (divide1Area >= divide2Area) {
      divide1Layer.isSelected = true;
      divide2Layer.isSelected = false;
    } else {
      divide2Layer.isSelected = true;
      divide1Layer.isSelected = false;
    }

    function getTooltipContent(layer, reviewPlan) {
      const content = `
      <div>
      <strong>${
        layer.isSelected ? `继承图斑：` + mapNum : `新建图斑`
      }</strong><br/>
       扰动面积:${(layer.area * 0.0001).toFixed(3)}公顷<br/>
       复核计划:${reviewPlan ? reviewPlan : "无"}
      </div>
      `;
      return content;
    }

    divide1Layer.bindTooltip(getTooltipContent(divide1Layer, reviewPlan));
    divide2Layer.bindTooltip(getTooltipContent(divide2Layer, reviewPlan));

    divide1Layer.on("click", (e) => {
      e.layer.bringToFront();
      divide1Layer.setStyle(selectedStyle);
      divide1Layer.isSelected = true;
      divide2Layer.setStyle(cutStyle);
      divide2Layer.isSelected = false;
      divide1Layer.setTooltipContent(
        getTooltipContent(divide1Layer, reviewPlan),
      );
      divide2Layer.setTooltipContent(
        getTooltipContent(divide2Layer, reviewPlan),
      );
    });
    divide2Layer.on("click", (e) => {
      e.layer.bringToFront();
      divide2Layer.setStyle(selectedStyle);
      divide2Layer.isSelected = true;
      divide1Layer.setStyle(cutStyle);
      divide1Layer.isSelected = false;
      divide1Layer.setTooltipContent(
        getTooltipContent(divide1Layer, reviewPlan),
      );
      divide2Layer.setTooltipContent(
        getTooltipContent(divide2Layer, reviewPlan),
      );
    });
    this.divideLayers = {
      spotId: spotId,
      reviewPlanId: reviewPlanId,
      reviewPlanName: reviewPlan,
      intersectLayer: divide1Layer,
      differenceLayer: divide2Layer,
    };
  },
  lineDivide: function (args) {
    const { feature, setShowConfirmDivide, cancelDivide } = args;
    const {
      properties: { id: spotId, reviewPlanId, mapNum, reviewPlan },
    } = feature;
    const layerGroupName = "cutResults";
    const layerGroup = this.getLayerGroup(layerGroupName, true);
    layerGroup && layerGroup.clearLayers();

    //不支持多部件分割a
    if (
      feature.geometry.type === "MultiPolygon" &&
      feature.geometry.coordinates.length > 1
    ) {
      message.info("只支持单个图斑，不支持多部件，请先删除多余图斑再分割！");
      return;
    }
    this.closePopup();

    this.startEditFeature(feature, {}, { showMessage: false });
    setShowConfirmDivide && setShowConfirmDivide(true);
    message.info("绘制分割线把图形一分为二，分割后只能为2个图斑", 10);
    const drawOptions = {};
    const callback = (e) => {
      const cutLineGeojson = e.data.layer.toGeoJSON();
      const bufferDist = 0.01; //1cm缓冲距离，用很薄的面模拟线切割，误差可以接受
      const bufferedLine = turf.buffer(cutLineGeojson, bufferDist, {
        units: "meters",
      });
      const cutGeojson = bufferedLine;

      e.data.layer.remove();
      const cutPolygons = Geom.cutPolygonByPolygon(feature, cutGeojson);
      // const cutPolygons=ZkyMap.cutPolygonByPolygon(feature.geometry,cutGeojson.geometry)
      const { intersect, difference } = cutPolygons;
      if (!intersect || !difference) {
        message.info("裁剪图形必须与原图形相交，请重新绘制！");
        // cancelDivide();
        cancelDivide && cancelDivide();
        const tempFetureCollection = {
          type: "FeatureCollection",
          features: [],
        };
        const arrPolyons = [cutGeojson, intersect, difference];
        arrPolyons.forEach((item) => {
          item && tempFetureCollection.features.push(item);
        });
        const hightLightOptions = { style: { weight: 2 } };
        this.createHighlight(tempFetureCollection, hightLightOptions).addTo(
          this,
        );
        return;
      }
      if (
        difference.geometry.type !== "MultiPolygon" ||
        difference.geometry.coordinates.length !== 2
      ) {
        message.info("裁剪后图形只能为2个，请重新绘制！");
        cancelDivide && cancelDivide();
        const tempFetureCollection = {
          type: "FeatureCollection",
          features: [],
        };
        const arrPolyons = [cutGeojson, intersect, difference];
        arrPolyons.forEach((item) => {
          item && tempFetureCollection.features.push(item);
        });
        const hightLightOptions = { style: { weight: 2 } };
        this.createHighlight(tempFetureCollection, hightLightOptions).addTo(
          this,
        );
        return;
      }

      //默认继承面积大的图形，点击切换继承图形
      this.removeEditLayer();
      const differencePolygonFeatures = Geom.multiPolygonToPolygonFeatures(
        difference,
      );

      const difference1 = differencePolygonFeatures[0];
      const difference2 = differencePolygonFeatures[1];

      this._renderDivideLayers(feature, [difference1, difference2]);
    };
    this.drawLine(drawOptions, callback);
  },
  polygonDivide: function (args) {
    const { feature, setShowConfirmDivide, cancelDivide } = args;
    const {
      properties: { id: spotId, reviewPlanId, mapNum, reviewPlan },
    } = feature;
    const layerGroupName = "cutResults";
    const layerGroup = this.getLayerGroup(layerGroupName, true);
    layerGroup && layerGroup.clearLayers();

    //不支持多部件分割
    if (
      feature.geometry.type === "MultiPolygon" &&
      feature.geometry.coordinates.length > 1
    ) {
      message.info("只支持单个图斑，不支持多部件，请先删除多余图斑再分割！");
      return;
    }
    this.closePopup();

    this.startEditFeature(feature, {}, { showMessage: false });
    setShowConfirmDivide && setShowConfirmDivide(true);
    message.info(
      "“面分割”绘制的面必须完整地包裹要切出来的图斑部分，且切割后只能为2个图斑",
      10,
    );
    const drawOptions = {};
    const callback = (e) => {
      const cutGeojson = e.data.layer.toGeoJSON();
      e.data.layer.remove();
      const cutPolygons = Geom.cutPolygonByPolygon(feature, cutGeojson);
      // const cutPolygons=ZkyMap.cutPolygonByPolygon(feature.geometry,cutGeojson.geometry)
      const { intersect, difference } = cutPolygons;
      if (!intersect || !difference) {
        message.info("裁剪图形必须与原图形相交，请重新绘制！");
        cancelDivide && cancelDivide();
        const tempFetureCollection = {
          type: "FeatureCollection",
          features: [],
        };
        const arrPolyons = [cutGeojson, intersect, difference];
        arrPolyons.forEach((item) => {
          item && tempFetureCollection.features.push(item);
        });
        const hightLightOptions = { style: { weight: 2 } };
        this.createHighlight(tempFetureCollection, hightLightOptions).addTo(
          this,
        );
        return;
      }
      if (
        intersect.geometry.type !== "Polygon" ||
        difference.geometry.type !== "Polygon"
      ) {
        message.info("裁剪后图形不能为多部件图形，请重新绘制！");
        cancelDivide && cancelDivide();
        const tempFetureCollection = {
          type: "FeatureCollection",
          features: [],
        };
        const arrPolyons = [cutGeojson, intersect, difference];
        arrPolyons.forEach((item) => {
          item && tempFetureCollection.features.push(item);
        });
        const hightLightOptions = { style: { weight: 2 } };
        this.createHighlight(tempFetureCollection, hightLightOptions).addTo(
          this,
        );
        return;
      }
      //默认继承面积大的图形，点击切换继承图形
      this.removeEditLayer();
      this._renderDivideLayers(feature, [intersect, difference]);
    };
    this.drawPolygon(drawOptions, callback);
  },
  getDividePayload: function () {
    const {
      spotId,
      reviewPlanId,
      intersectLayer,
      differenceLayer,
    } = this.divideLayers;
    if (!intersectLayer || !differenceLayer) {
      message.info("分割后图形不存在，请重新分割！");
      return;
    }

    let intersectFeature = Geom.geoJSONLayerToFeature(intersectLayer);
    let differenceFeature = Geom.geoJSONLayerToFeature(differenceLayer);
    if (!intersectFeature || !differenceFeature) {
      message.info("分割后图形不存在，请重新分割！");
      return;
    }
    intersectFeature = Geom.polygonsToMultiPolygonFeature([intersectFeature]);
    intersectFeature.isSelected = intersectLayer.isSelected;
    differenceFeature = Geom.polygonsToMultiPolygonFeature([differenceFeature]);
    differenceFeature.isSelected = differenceLayer.isSelected;

    const intersectWkt = Geom.geoJSONToWkt(intersectFeature);
    const intersectSpot = {
      isSelectSpot: intersectFeature.isSelected,
      geom: intersectWkt,
      interferenceArea: turf.area(intersectFeature) * 0.0001,
    };

    const differenceWkt = Geom.geoJSONToWkt(differenceFeature);
    const differenceSpot = {
      isSelectSpot: differenceFeature.isSelected,
      geom: differenceWkt,
      interferenceArea: turf.area(differenceFeature) * 0.0001,
    };

    if (!spotId) {
      message.info("图斑id不存在，请联系管理员检查图斑编号！");
      return;
    }

    const spots = [intersectSpot, differenceSpot];
    const payload = {
      id: spotId,
      spots,
      ...(reviewPlanId && {
        reviewPlanId: intersectFeature.properties.reviewPlanId,
      }),
    };
    return payload;
  },
});
