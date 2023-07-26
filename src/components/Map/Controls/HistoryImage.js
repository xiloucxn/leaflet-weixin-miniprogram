import React, { PureComponent } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";

import { connect } from "dva";
import config from "../../../config";
import { Select, Tooltip } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import ZkyMap from "@/pages/ZkyMap/ZkyMap";

var $ = jQuery;
var selctedDateJgImg = null,
  selctedDateArcGIS = null;

//this.props.map.
@connect(({ map }) => ({
  map,
}))
export default class HistoryImage extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  //在这里初始化state
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = {
      counter: 0,
      selectHistory: null,
      isHistoryLock: true,
      imageSource: "监管影像",
      selectedWaybackItem: null,
    };
  }

  //会在组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应该放在这里。
  //如需通过网络请求获取数据，此处是实例化请求的好地方。
  componentDidMount() {
    const { link, instanceProps, dispatch } = this.props;
    link && link(this);
    instanceProps && this.instance(instanceProps.map, instanceProps.options);
    ZkyMap.getWaybackItems({ dispatch });
  }

  //组件从DOM移除时调用
  componentWillUnmount() {
    this._remove();
  }

  //重新读取属性
  reloadProps = () => {
    this.props.instanceProps &&
      this.instance(
        this.props.instanceProps.map,
        this.props.instanceProps.options,
      );
  };

  //实例化组件变量，完成2项工作：1.更新属性2.更新界面
  instance = (map, options) => {
    console.log("Instance:", map, options);
    const {
      map: { waybackItems, histories },
    } = this.props;

    this._map = map;
    this._baseLayers = options.baseLayers;
    //绑定事件
    //初始化时默认选择第一个日期
    if (this.props.map.histories[0]) {
      this.setState({ selectHistory: histories[0] });
      selctedDateJgImg = histories[0];
      this._loadHistoryImg({
        imageSource: "监管影像",
        date: this.props.map.histories[0],
      });
    }

    this._map.on("zoomend moveend", this._update, this);

    //设置初始ArcGIS历史影像Wayback初始值
    this.setState({ selectedWaybackItem: waybackItems?.[0]?.value });
    selctedDateArcGIS = waybackItems?.[0]?.value;

    //放大到13级
    this._limitMapStatus();
    this._update();
    this._map.fire("addHistoryImage", {}, this);
  };

  //更新界面
  _update = () => {
    if (!this.state.isHistoryLock && this.props.map.histories[0]) {
      this._loadHistoryImg({
        imageSource: "监管影像",
        date: this.props.map.histories[0],
      });
    }
  };

  //重置状态
  _reset = () => {};

  //移除工具
  _remove = () => {
    this._reset();
    if (this._map.hasLayer(this._historyBaseLayer)) {
      this._map.removeLayer(this._historyBaseLayer);
    }
    this._map.off("zoomend moveend", this._update, this);
    this._resetMapStatus();
    this._map.fire("removeHistoryImage", {}, this);
  };

  _limitMapStatus = () => {
    if (!this._map) {
      return;
    }
    // this._map.setMinZoom(13);
    // this._map.setMaxZoom(18);

    if (this._map._currentBaseLayer) {
      this._map.removeLayer(this._map._currentBaseLayer);
      return;
    }

    this._baseLayers.forEach((item) => {
      if (this._map.hasLayer(item)) {
        this._backBaseLayer = item;
        this._map.removeLayer(this._backBaseLayer);
      }
    });
  };

  _resetMapStatus = () => {
    if (!this._map) {
      return;
    }

    if (this._map._currentBaseLayer) {
      this._map.addLayer(this._map._currentBaseLayer);
      return;
    }

    if (this._backBaseLayer && !this._map.hasLayer(this._backBaseLayer)) {
      this._map.addLayer(this._backBaseLayer);
    }
  };

  _loadHistoryImg = (args) => {
    let { imageSource, date, imageUrl = "" } = args;
    const {
      map: { waybackItems },
    } = this.props;
    let layer = null;
    if (!this._map) {
      return;
    }

    if (imageSource === "监管影像") {
      // this.setState({ selectHistory: date });
      selctedDateJgImg = date;
      if (date) {
        imageUrl = `${config.imageBaseUrl}/${date.replace(
          /\//g,
          "-",
        )}/false/tile/{z}/{y}/{x}`;
        layer = L.tileLayer(imageUrl, {
          pane: "baseLayer",
          minZoom: 1,
          maxZoom: 20,
          maxNativeZoom: 17,
        });
      }
    }

    if (imageSource === "ArcGIS") {
      imageUrl = imageUrl ? imageUrl : waybackItems?.[0]?.value;
      selctedDateArcGIS = imageUrl;
      layer = L.tileLayer(imageUrl, {
        pane: "baseLayer",
        minZoom: 1,
        maxZoom: 20,
        maxNativeZoom: 18,
      });
    }

    if (!this._historyBaseLayer) {
      this._historyBaseLayer = layer;
      this._map.addLayer(this._historyBaseLayer);
      return;
    }
    if (this._historyBaseLayer._url === imageUrl) {
      return;
    } else {
      if (this._map.hasLayer(this._historyBaseLayer)) {
        this._map.removeLayer(this._historyBaseLayer);
      }
      this._historyBaseLayer = layer;
      this._map.addLayer(this._historyBaseLayer);
    }
  };

  render() {
    const { imageSource, selectedWaybackItem, selectHistory } = this.state;
    const {
      map: { waybackItems },
    } = this.props;

    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          ...this.props?.style,
        }}
      >
        <div style={{ textAlign: "left" }}>
          <span>影像源：</span>
          <Select
            style={{
              width: 150,
              marginTop: 10,
            }}
            defaultValue="监管影像"
            options={[
              { value: "监管影像", label: "监管影像" },
              { value: "ArcGIS", label: "ArcGIS" },
            ]}
            placeholder="请选择"
            onChange={(e) => {
              console.log(e);
              this.setState({ imageSource: e });
              if (e === "ArcGIS") {
                this.setState({ selectedWaybackItem: selctedDateArcGIS });
                this._loadHistoryImg({
                  imageSource: "ArcGIS",
                  imageUrl: selctedDateArcGIS,
                });
              }
              if (e === "监管影像") {
                this.setState({ selectHistory: selctedDateJgImg });
                this._loadHistoryImg({
                  imageSource: "监管影像",
                  date: selctedDateJgImg,
                });
              }
            }}
          />

          <div style={{ display: imageSource === "监管影像" ? null : "none" }}>
            <span>影像时间：</span>
            <Select
              style={{
                width: 150,
                marginTop: 10,
              }}
              value={selectHistory}
              placeholder="选择监管影像历史影像"
              onChange={(e) => {
                console.log(e);
                this.setState({ selectHistory: e });
                this._loadHistoryImg({ imageSource: "监管影像", date: e });
              }}
            >
              {this.props.map.histories.map((item, id) => (
                <Select.Option key={id + "first"} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
            {this.state.isHistoryLock ? (
              <Tooltip title="锁定模式下只查看选中日期的影像">
                <LockOutlined
                  style={{ width: 30, cursor: "pointer", color: "red" }}
                  onClick={() => {
                    this.setState({ isHistoryLock: false });
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="非锁定模式自动查看区域最新影像">
                <UnlockOutlined
                  style={{ width: 30, cursor: "pointer", color: "green" }}
                  onClick={() => {
                    this.setState({ isHistoryLock: true });
                  }}
                />
              </Tooltip>
            )}
          </div>

          <div style={{ display: imageSource === "ArcGIS" ? null : "none" }}>
            <span>影像时间：</span>
            <Select
              style={{
                width: 150,
                marginTop: 10,
              }}
              value={selectedWaybackItem}
              options={waybackItems}
              placeholder="选择Arcgis历史影像"
              onChange={(selectItem) => {
                console.log("selectItem", selectItem);
                this.setState({ selectedWaybackItem: selectItem });
                this._loadHistoryImg({
                  imageSource: "ArcGIS",
                  imageUrl: selectItem,
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
