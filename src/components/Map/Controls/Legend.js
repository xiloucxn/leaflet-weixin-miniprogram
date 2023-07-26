import React, { PureComponent } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";

var $ = jQuery;

export default class Legend extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  //在这里初始化state
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = { counter: 0, legends: [], src: "", style: {} };
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
    this.setState(options);
    this._update();
  };

  //更新界面
  _update = () => {};

  render() {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          minWidth: 100,
          ...this.props?.style,
        }}
      >
        {/* {this.state.legends.map((item) => {
          return (
            <div style={{ display: "flex", margin: "5px 0" }}>
              <span>{item.title}</span>
              <img
                src={item.img}
                style={{
                  marginLeft: 10,
                  width: item.size,
                  height: item.size,
                }}
              />
            </div>
          );
        })} */}
        <img src={this.state.src} style={{ ...this.state.style }}></img>
      </div>
    );
  }
}
