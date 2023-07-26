import React, { PureComponent } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";
import mapHelper from "../../../utils/mapHelper";

var $ = jQuery;

export default class BaseMap extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  constructor(props) {
    super(props);
    this.state = { layers: [] };
    this._handlingClick = false;
  }

  //会在组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应该放在这里。
  //如需通过网络请求获取数据，此处是实例化请求的好地方。
  componentDidMount() {
    this.props.link && this.props.link(this);

    this.props.instanceProps &&
      this.instance(
        this.props.instanceProps.map,
        this.props.instanceProps.options,
      );
  }

  //组件从DOM移除时调用
  componentWillUnmount() {}

  //实例化组件变量
  instance = (map, options) => {
    console.log("Instance:", map, options);
    this._map = map;
    this._layers = options.baseLayers;
    for (var i = 0; i < this._layers.length; i++) {
      this._layers[i].on("add remove", this._onLayerChange, this);
    }
    this._update();
  };

  _onLayerChange = (e) => {
    if (!this._handlingClick) {
      this._update();
    }
  };

  //更新界面
  _update = () => {
    if (!this._map) {
      return this;
    }
    let layers = this._layers.map((item) => {
      let checked = this._map.hasLayer(item);
      let id = L.Util.stamp(item);
      return {
        title: item?.title,
        picUrl: item?.picUrl,
        checked: checked,
        id: id,
      };
    });
    this.setState({ layers: layers });
  };

  //获取图层
  _getLayer = (id) => {
    for (let i = 0; i < this._layers.length; i++) {
      if (this._layers[i] && L.Util.stamp(this._layers[i]) === id) {
        return this._layers[i];
      }
    }
  };

  //点击切换底图
  _onInputClick = (id) => {
    //禁用机制：使用历史影像、卷帘对比时，禁用底图切换工具

    if (
      this._map?.currentTool === "tool-history" ||
      this._map?.currentTool === "tool-sidebyside"
    ) {
      return;
    }
    console.log(id);
    // id=parseInt(id);
    // this._handlingClick=true;

    // var inputs = this._layerControlInputs,
    //     input, layer;
    var addedLayers = [],
      removedLayers = [];

    this._handlingClick = true;

    for (let i = 0; i < this._layers.length; i++) {
      if (this._layers[i] && L.Util.stamp(this._layers[i]) === id) {
        addedLayers.push(this._layers[i]);
      } else {
        removedLayers.push(this._layers[i]);
      }
    }

    // for (var i = inputs.length - 1; i >= 0; i--) {
    // 	input = inputs[i];
    // 	layer = this._getLayer(input.layerId).layer;

    // 	if (input.checked) {
    // 		addedLayers.push(layer);
    // 	} else if (!input.checked) {
    // 		removedLayers.push(layer);
    // 	}
    // }

    // Bugfix issue 2318: Should remove all old layers before readding new ones
    for (let i = 0; i < removedLayers.length; i++) {
      if (this._map.hasLayer(removedLayers[i])) {
        this._map.removeLayer(removedLayers[i]);
      }
    }
    for (let i = 0; i < addedLayers.length; i++) {
      if (!this._map.hasLayer(addedLayers[i])) {
        this._map.addLayer(addedLayers[i]);
      }
    }

    this._handlingClick = false;
    this._update();
    // this._refocusOnMap();
  };

  //控件激活
  activate = () => {};

  //移除控件
  remove = () => {};

  render() {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          ...this.props?.style,
        }}
      >
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            background: "white",
            padding: "2px 0",
            flexWrap: "wrap",
            width: 250,
            maxHeight: 400,
            overflow: "auto",
            marginBottom: 0,
          }}
        >
          {this.state.layers.map((item) => (
            <li
              key={item.id}
              id={item.id}
              style={{
                position: "relative",
                width: 76,
                height: 76,
                padding: 0,
                margin: "5px 0 5px 5px",
                listStyle: "none",
                cursor: "pointer",
                border: item.checked
                  ? "2px solid rgb(24,144,255)"
                  : "2px solid white",
              }}
              onClick={(e) => {
                this._onInputClick(parseInt(e.target.parentNode.id));
              }}
            >
              <img src={item.picUrl} style={{ width: "100%" }} />
              <span
                style={
                  item.checked
                    ? {
                        fontSize: "12px",
                        borderTopRightRadius: "3px",
                        position: "absolute",
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        bottom: 0,
                        color: "white",
                        background: "rgb(24,144,255)",
                      }
                    : {
                        fontSize: "12px",
                        bottom: 0,
                        position: "absolute",
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        color: "white",
                        background: "black",
                      }
                }
              >
                {item.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
