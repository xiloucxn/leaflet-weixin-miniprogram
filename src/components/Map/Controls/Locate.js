import React, { PureComponent } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";

import { Input, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

var $ = jQuery;

export default class Locate extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  //在这里初始化state
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = { counter: 0, iLon: null, iLat: null, oLon: null, oLat: null };
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
    this._map = map;
    this._map.on("click", this._drawMarker, this);
    this._update();
  };

  _drawMarker = (e) => {
    console.log(e);
    if (this._map.hasLayer(this._pickMarker)) {
      this._map.removeLayer(this._pickMarker);
    }
    this._pickMarker = L.marker(e.latlng).addTo(this._map);
    if (e.latlng) {
      this.setState({
        oLon: e.latlng.lng.toFixed(5),
        oLat: e.latlng.lat.toFixed(5),
      });
    }
  };

  //更新界面
  _update = () => {};

  //重置状态
  _reset = () => {
    if (!this._map) {
      return;
    }
    if (this._mark) {
      this._map.removeLayer(this._mark);
    }
    if (this._map.hasLayer(this._pickMarker)) {
      this._map.removeLayer(this._pickMarker);
    }
    this.setState({ iLon: null });
    this.setState({ iLat: null });
    this.setState({ oLon: null });
    this.setState({ oLat: null });
  };

  //移除工具
  _remove = () => {
    if (!this._map) {
      return;
    }

    this._reset();
    this._map.off("click", this._drawMarker, this);
  };

  /**
   *
   * 复制单行内容到粘贴板
   * @param {*} content 需要复制的内容
   * @param {*} message 复制完后的提示，不传则默认提示"复制成功"
   */
  copyToClip = (content, message) => {
    var aux = document.createElement("input");
    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    if (message === null) {
    } else {
    }
  };

  _changeValue = (e) => {
    let o = {};
    o[e.target.name] = e.target.value;
    this.setState(o);
  };

  _locate = () => {
    if (!this._map) {
      return this;
    }
    let lon = parseFloat(this.state.iLon);
    let lat = parseFloat(this.state.iLat);
    if (lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90) {
      if (this._mark) {
        this._map.removeLayer(this._mark);
      }
      let icon = L.icon({
        iconUrl: "./img/R_raw.png",
        iconSize: [21, 33],
        iconAnchor: [10, 30],
      });
      this._mark = L.marker([lat, lon], { icon: icon })
        .bindPopup(`经度：${lon}纬度：${lat}`, {})
        .addTo(this._map);
      this._map.setView([lat, lon], 15);
    }
  };

  render() {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          ...this.props?.style,
        }}
      >
        <Input
          name="iLon"
          addonBefore="经度"
          placeholder="例 113.5283"
          value={this.state.iLon}
          onChange={this._changeValue}
        />
        <Input
          name="iLat"
          style={{ margin: "10px 0" }}
          addonBefore="纬度"
          placeholder="例 23.2845"
          value={this.state.iLat}
          onChange={this._changeValue}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            marginBottom: 10,
          }}
        >
          <Button type="primary" onClick={this._locate}>
            定位
          </Button>
          <Button type="primary" onClick={this._reset}>
            清空
          </Button>
        </div>
        {!this.state.oLon && (
          <div style={{ textAlign: "left" }}>提示：点击地图可拾取坐标</div>
        )}
        {this.state.oLon && (
          <div>
            <div style={{ textAlign: "left" }}>
              当前坐标点如下：
              {this.state.message && (
                <span style={{ color: "red" }}>{this.state.message}</span>
              )}
            </div>
            <div>
              <Input.Search
                value={`${this.state.oLon},${this.state.oLat}`}
                onSearch={() => {
                  this.copyToClip(`${this.state.oLon},${this.state.oLat}`);
                  this.setState({ message: "复制成功！" });
                  setTimeout(() => {
                    this.setState({ message: null });
                  }, 2000);
                }}
                enterButton={<CopyOutlined />}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
