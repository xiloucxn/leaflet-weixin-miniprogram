import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as Geom from "./Util.Geom";
import * as Common from "./Util.Common";
import "leaflet-side-by-side";
import jquery from "jquery";

const $ = jquery;

// AI解译模块

L.Map.include({
  addImageRectsByDistrictId: function (args) {
    const {
      dispatch,
      districtCodeId,
      modelType,
      task,
      setStep,
      setImageSelect,
      aiImageType = 1,
    } = args;
    let payload = {
      maxResultCount: 10e5,
      bigClass: "ai",
      forAIModelTypeId: modelType,
      forAITaskTypeId: task,
      aiRsImageType: aiImageType,
      districtCodeId: districtCodeId,
    };
    payload = Common.removeNullUndefinedProperties(payload);
    dispatch({
      type: "ai/getImageList",
      payload: payload,
      callback: (success, result) => {
        console.log(success, result);
        this.addImageRects({ images: result.items, setStep, setImageSelect });
      },
    });
  },
  addImageRectsByDrawRect: function (args) {
    const {
      dispatch,
      modelType,
      task,
      setStep,
      setImageSelect,
      aiImageType = 1,
    } = args;
    this.drawRect({}, (e) => {
      console.log(e);
      e.data.layer.remove();
      let geojson = e.data.layer.toGeoJSON();

      const wkt = Geom.geoJSONToWkt(geojson);
      let payload = {
        maxResultCount: 10e5,
        bigClass: "ai",
        forAIModelTypeId: modelType,
        forAITaskTypeId: task,
        aiRsImageType: aiImageType,
        polygon: wkt,
      };
      payload = Common.removeNullUndefinedProperties(payload);
      dispatch({
        type: "ai/getImageList",
        payload: payload,
        callback: (success, result) => {
          console.log(success, result);
          this.addImageRects({ images: result.items, setStep, setImageSelect });
        },
      });
    });
  },
  addImageRectsByDrawPolygon: function (args) {
    const {
      dispatch,
      modelType,
      task,
      setStep,
      setImageSelect,
      aiImageType = 1,
    } = args;
    this.drawPolygon({}, (e) => {
      console.log(e);
      e.data.layer.remove();
      let geojson = e.data.layer.toGeoJSON();

      const wkt = Geom.geoJSONToWkt(geojson);
      let payload = {
        maxResultCount: 10e5,
        bigClass: "ai",
        forAIModelTypeId: modelType,
        forAITaskTypeId: task,
        aiRsImageType: aiImageType,
        polygon: wkt,
      };
      payload = Common.removeNullUndefinedProperties(payload);
      dispatch({
        type: "ai/getImageList",
        payload: payload,
        callback: (success, result) => {
          console.log(success, result);
          this.addImageRects({ images: result.items, setStep, setImageSelect });
        },
      });
    });
  },
  addImageRects: function (args) {
    const { images, setStep, setImageSelect } = args;
    const layerGroup = this.getLayerGroup("imageRects", true).clearLayers();

    if (images.length > 0) {
      const featureCollection = Geom.itemsToFeatureCollection(images);
      const options = {
        style: {
          color: "red",
          fillOpacity: 0,
          weight: 2,
        },
        onEachFeature: (feature, layer) => {
          const {
            properties: { takenDate = "" },
          } = feature;

          const content = `拍摄时间:${takenDate}`;

          //点击高亮、预览影像
          layer.on("click ", (e) => {
            if (!this._handlePM) {
              this.openPopup(content, e.latlng);
              layer.bringToFront();
              this.createHighlight(feature).addTo(this);
              L.DomEvent.stopPropagation(e);
            }
          });
        },
      };
      this.createGeoJSON(featureCollection, options).addTo(layerGroup);
      this.locate(featureCollection);
    }
    setStep && setStep(4);
    setImageSelect && setImageSelect([]);
    return this;
  },
  clearImageRelatedLayers: function () {
    this.getLayerGroup("imageRects").clearLayers();
    this.getLayerGroup("imageLayers").clearLayers();
    this.getLayerGroup("imagePreviewLayers").clearLayers();
    this.getLayerGroup("AiMVTLayers").clearLayers();
    this._sideBySide && this._sideBySide.remove();
    const leftDateControl = $("#leftDate");
    const rightDateControl = $("#rightDate");
    leftDateControl && leftDateControl.css("visibility", "collapse");
    rightDateControl && rightDateControl.css("visibility", "collapse");
  },
  addImageLayers: function (args) {
    let { images } = args;
    const layerGroup = this.getLayerGroup("imageLayers", true).clearLayers();
    this.getLayerGroup("imagePreviewLayers", true).clearLayers();
    const featureCollection = Geom.itemsToFeatureCollection(images);
    if (!images || images.length === 0) {
      return;
    }
    images.forEach((item) => {
      const feature = Geom.objToFeature(item);
      const imageLayerOptions = getImageLayerOptionsByFeature({
        feature,
      });
      const { url } = imageLayerOptions;
      this.createImageLayer(url, imageLayerOptions).addTo(layerGroup);
    });
    this.locate(featureCollection);
  },
  addPreviewImageLayers: function (args) {
    let { images } = args;
    const layerGroup = this.getLayerGroup(
      "imagePreviewLayers",
      true,
    ).clearLayers();
    const featureCollection = Geom.itemsToFeatureCollection(images);

    if (!images || images.length === 0) {
      return;
    }
    images.forEach((item) => {
      const feature = Geom.objToFeature(item);
      const imageLayerOptions = getImageLayerOptionsByFeature({
        feature,
      });
      const { url } = imageLayerOptions;
      this.createImageLayer(url, imageLayerOptions).addTo(layerGroup);
    });
    this.locate(featureCollection);
  },
  addImageLayersByTask: function (args) {
    let { images, setLeftDate, setRightDate } = args;
    this.addImageLayers({ images });
    const layerGroup = this.getLayerGroup("imageLayers", true);
    const imageLayers = layerGroup.getLayers();

    if (images.length === 2 && imageLayers.length === 2) {
      setLeftDate && setLeftDate(images[1].takenDate);
      setRightDate && setRightDate(images[0].takenDate);
      this.invalidateSize();
      this._sideBySide = L.control
        .sideBySide(imageLayers[1], imageLayers[0])
        .addTo(this);
      this._sideBySide.on("dividermove", (e) => {
        // console.log("移动", e);
        const leftDateControl = $("#leftDate");
        const rightDateControl = $("#rightDate");
        if (!leftDateControl || !rightDateControl) {
          return;
        }
        let leftWidth = leftDateControl.width();
        leftDateControl.css("left", parseInt(e.x - leftWidth - 24));
        leftDateControl.css("visibility", "visible");
        rightDateControl.css("left", parseInt(e.x + 10));
        rightDateControl.css("visibility", "visible");
      });
    }
  },
  addAiLayersByTask: function (args) {
    const { selectedTasks, setLeftDate, setRightDate } = args;
    this.clearImageRelatedLayers();

    if (!selectedTasks || selectedTasks.length === 0) {
      return;
    }
    
    const selectedTask = selectedTasks[0];
    let images = [];
    selectedTask.nowService && images.push(selectedTask.nowService);
    selectedTask.historyService && images.push(selectedTask.historyService);
    const featureCollection = Geom.itemsToFeatureCollection(images);
    this.locate(featureCollection);
    this.addAiMVTLayersByTasks({ selectedTasks });
    images = [...images].sort((a, b) => {
      const dateA = new Date(a.takenDate);
      const dateB = new Date(b.takenDate);
      return dateA - dateB; // 返回小于0的值表示a在前，大于0的值表示b在前
    });
    this.addImageLayersByTask({ images, setLeftDate, setRightDate });
  },
});

/**
 * 根据feature获取imageLayerOptions
 *
 * e.g.
 *
 * const imageLayerOptions = ZkyMap.getImageLayerOptionsByFeature({feature});
 *
 * @export
 * @param {*} feature
 * @return {*}
 */
export function getImageLayerOptionsByFeature(args) {
  const { feature } = args;
  const {
    properties: { id = "", takenDate = "", levels = "5,20" },
  } = feature;
  const arrLevel = levels.split(",");
  const minZoom = parseInt(arrLevel[0]);
  const maxZoom = parseInt(arrLevel[arrLevel.length - 1]);
  const url = `https://www.stbcjg.cn/BasemapService/rest/services/${id}/MapServer/tile/{z}/{y}/{x}`;
  const latLngBounds = Geom.geojsonTolatLngBounds(feature);
  const imageLayerOptions = {
    minZoom: minZoom,
    maxNativeZoom: maxZoom,
    maxZoom: 20,
    bounds: latLngBounds,
    url: url,
  };
  return imageLayerOptions;
}
