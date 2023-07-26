import React, { PureComponent } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";
import { Switch } from "antd";

var $ = jQuery;

export default class SwitchMapScrollable extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  //在这里初始化state
  constructor(props) {
    super(props);
    this.props.link && this.props.link(this);
    // 不要在这里调用 this.setState()
    this.state = { counter: 0, checked: false, disabled: true };
    this._map = null;
  }

  //会在组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应该放在这里。
  //如需通过网络请求获取数据，此处是实例化请求的好地方。
  componentDidMount() {
    this.props.link && this.props.link(this);
  }

  //组件从DOM移除时调用
  componentWillUnmount() {}

  //实例化组件变量
  instance = (map, options) => {
    // console.log("Instance:", map, options);
    this._map = map;
    this.setState({ disabled: false, ...options });
    // this._update();
    setTimeout(() => {
      this._update();
    }, 100);
  };

  setOptions = (options) => {
    this.setState(options);
    setTimeout(() => {
      this._update();
    }, 100);
  };

  //更新界面
  _update = () => {
    let { checked } = this.state;
    checked
      ? this._map.scrollWheelZoom.enable()
      : this._map.scrollWheelZoom.disable();
  };

  //点击切换按钮
  _clickSwitch = (v) => {
    if (!this._map) {
      this.setState({ checked: false });
      return;
    }
    v
      ? this._map.scrollWheelZoom.enable()
      : this._map.scrollWheelZoom.disable();
  };

  render() {
    let { checked, disabled } = this.state;
    return (
      <div
        style={{
          position: "absolute",
          zIndex: 1001,
          ...this.props?.style,
        }}
      >
        <Switch
          checkedChildren="滚轮缩放"
          unCheckedChildren="滚轮缩放"
          disabled={disabled}
          checked={checked}
          onClick={(v, e) => {
            e.stopPropagation();
            this.setState({ checked: v });
            this._clickSwitch(v);
          }}
        />
      </div>
    );
  }
}
