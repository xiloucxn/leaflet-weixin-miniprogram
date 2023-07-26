import React, { PureComponent } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";

import { Tree } from "antd";

var $ = jQuery;

export default class Overlayers extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  //在这里初始化state
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = {
      counter: 0,
      treeData: [],
      checkedKeys: [],
      expandedKeys: [],
    };
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

  instance = (map, options) => {
    console.log("Instance:", map, options);
    this._map = map;
    this._layers = options.overLayers;
    this._layerKeys = this._layers.map((item) => {
      return L.Util.stamp(item);
    });

    for (var i = 0; i < this._layers.length; i++) {
      this._layers[i].on("add remove", this._onLayerChange, this);
    }
    this.setState({ treeData: options.treeData });
    let expandedKeys = options.treeData.map((item) => {
      return item.key;
    });
    this.setState({ expandedKeys: expandedKeys });
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
    let checkedKeys = [];
    this._layers.forEach((item) => {
      if (this._map.hasLayer(item)) {
        checkedKeys.push(L.Util.stamp(item));
      }
    });
    this.setState({ checkedKeys: checkedKeys });
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
  _onInputClick = (e) => {
    // console.log(e);
    // id=parseInt(id);
    this._handlingClick = true;

    let treeCheckedKeys = e;
    let checkedKeys = [];
    let uncheckedKeys = [];
    this._layerKeys.forEach((item) => {
      if (treeCheckedKeys.indexOf(item) < 0) {
        uncheckedKeys.push(item);
      } else {
        checkedKeys.push(item);
      }
    });

    var addedLayers = [],
      removedLayers = [];

    for (let i = checkedKeys.length - 1; i >= 0; i--) {
      let layer = this._getLayer(checkedKeys[i]);
      layer && addedLayers.push(layer);
    }
    for (let i = uncheckedKeys.length - 1; i >= 0; i--) {
      let layer = this._getLayer(uncheckedKeys[i]);
      layer && removedLayers.push(layer);
    }
    // this._handlingClick = true;

    // for (var i = inputs.length - 1; i >= 0; i--) {
    // 	input = inputs[i];
    // 	layer = this._getLayer(input);
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
    // this._update();
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
          border: "1px solid red",
          backgroundColor: "lightgreen",
          ...this.props?.style,
        }}
      >
        <div
          style={{
            position: "absolute",
            background: "white",
            width: 230,
            maxHeight: 400,
            padding: 3,
            overflow: "auto",
            border: "1px solid #ebebeb",
            boxShadow: "0 0 4px 0 rgb(0 0 0 / 15%)",
            borderRadius: 3,
          }}
        >
          <Tree
            showIcon
            expandedKeys={this.state.expandedKeys}
            checkable
            checkedKeys={this.state.checkedKeys}
            onCheck={(e, node, extra) => {
              // console.log(e,node,extra);
              this.setState({ checkedKeys: e });

              this._onInputClick(e);
            }}
            onExpand={(e) => {
              this.setState({ expandedKeys: e });
            }}
            treeData={this.state.treeData}
          />
        </div>
      </div>
    );
  }
}
