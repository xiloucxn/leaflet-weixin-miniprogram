import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../../components/Map/leaflet-geoman-develop/src/js/L.PM";

//钩子函数，地图初始化时，自动设置一些参数
L.Map.addInitHook(function () {
  // 在地图上调用pm工具绘制时，为地图赋予一个状态_handlePM=true，结束绘制时
  // _hanlePM=false
  // ... do something in constructor additionally
  // e.g. add event listeners, set custom properties etc.
  // this指向实例化的map对象
  this._handlePM = false;
  this._drawLayers = this._drawLayers || L.layerGroup().addTo(this);
  const customTranslation = {
    tooltips: {
      finishLine: "单击任何存在的标记或者双击以完成",
      finishPoly: "单击第一个标记或者双击完成以完成",
    },
  };
  this.pm.setLang("customName", customTranslation, "zh");
  this.on(
    "pm:drawstart",
    () => {
      this._handlePM = true;
    },
    this,
  );
  this.on(
    "pm:drawend pm:create",
    () => {
      this._handlePM = false;
    },
    this,
  );
});

L.Map.addInitHook(function () {
  // 点击地图自动移除高亮图层
  this.addAutoClearHighlight();
});

L.Map.addInitHook(function () {
  // 地图上的弹窗，默认允许拖拽
  this.on(
    "popupopen",
    (e) => {
      const popup = e.popup;
      const draggable = new L.Draggable(popup._container);
      draggable.enable();
      popup.on(
        "remove",
        (e) => {
          draggable.disable();
        },
        popup,
      );
    },
    this,
  );
});
