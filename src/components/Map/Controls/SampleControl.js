import React, { PureComponent } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";

var $ = jQuery;

export default class SampleControl extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  //在这里初始化state
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = { counter: 0 };
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
    console.log("Instance:", map, options);
    this._map = map;
  };

  //更新界面
  _update = () => {};

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
        sampleControl
      </div>
    );
  }
}
