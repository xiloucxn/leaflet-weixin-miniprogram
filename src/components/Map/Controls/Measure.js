import React, { PureComponent } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";

var $ = jQuery;

export default class Measure extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  //在这里初始化state
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = { counter: 0 };
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
    if (this._map && !this.measureControl) {
      this.measureControl = new L.Control.Measure({
        primaryLengthUnit: "kilometers", //meters
        secondaryLengthUnit: "undefined",
        primaryAreaUnit: "hectares",
        //secondaryAreaUnit:"hectares",//sqmeters
        activeColor: "#3388FF",
        completedColor: "#3388FF",
        position: "topright",
      }).addTo(this._map);

      //改变测量工具位置
      this.measureControl._container.remove();
      document
        .getElementById("measure")
        .appendChild(this.measureControl.onAdd(this._map));
    }
    this._update();
  };

  //更新界面
  _update = () => {};

  //重置状态
  _reset = () => {};

  //移除工具
  _remove = () => {
    this.measureControl.remove();
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
        <div id="measure"></div>
      </div>
    );
  }
}
