import React, { PureComponent } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";
import { Button } from "antd";

import { CloseOutlined, RollbackOutlined } from "@ant-design/icons";

var $ = jQuery;

export default class EchartContainer extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  //在这里初始化state
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = { counter: 0, yOffset: 0 };
  }

  //会在组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应该放在这里。
  //如需通过网络请求获取数据，此处是实例化请求的好地方。
  componentDidMount() {
    this.props.link && this.props.link(this);
    if (this.props.yOffset) {
      this.setState({ yOffset: parseInt(this.props.yOffset) });
    }
  }

  //组件从DOM移除时调用
  componentWillUnmount() {}

  //实例化组件变量
  instance = (map, options) => {
    console.log("Instance:", map, options);
  };

  //更新界面
  _update = () => {};

  //切换本组件隐藏显示
  toggle = (bool) => {
    bool ? $("#chart-root").show() : $("#chart-root").hide();
  };

  toggleReturnButton = (bool) => {
    bool ? $("#btn-return").show() : $("#btn-return").hide();
  };

  /**
   *控制每个面板隐藏显示
   *
   * @param {*} panelId 面板id
   * @param {*} bool 是否信使
   * @memberof EchartContainer
   */
  togglePanel = (panelId, bool) => {
    bool ? $(panelId).show() : $(panelId).hide();
  };

  render() {
    return (
      <div id="chart-root" style={{ display: "none" }}>
        <div
          id="chart-right1"
          style={{
            width: 230,
            height: 230,
            borderRadius: 3,
            position: "absolute",
            zIndex: 700,
            backgroundColor: "white",
            right: 11,
            top: 95 + this.state.yOffset,
          }}
        ></div>
        <div
          id="chart-right1-nodata"
          style={{
            width: 230,
            height: 230,
            borderRadius: 3,
            position: "absolute",
            zIndex: 700,
            backgroundColor: "white",
            right: 11,
            top: 95 + this.state.yOffset,
          }}
        >
          <img
            src="./img/暂无数据.png"
            style={{ marginTop: 37, marginLeft: 59 }}
          ></img>
          <div style={{ textAlign: "center", marginLeft: 25 }}>
            抱歉，暂无数据！
          </div>
        </div>
        <div
          id="chart-right2"
          style={{
            width: 230,
            height: 230,
            borderRadius: 3,
            position: "absolute",
            zIndex: 700,
            backgroundColor: "white",
            right: 11,
            top: 330 + this.state.yOffset,
          }}
        ></div>
        <div
          id="chart-bottom"
          style={{
            width: "calc(100vw - 292px)",
            height: 221,
            borderRadius: 3,
            position: "absolute",
            zIndex: 700,
            backgroundColor: "white",
            left: "45px",
            bottom: 5,
          }}
        ></div>
        <Button
          id="btn-close"
          style={{
            position: "absolute",
            right: 11,
            top: 93 + this.state.yOffset,
            zIndex: 701,
          }}
          type="link"
          icon={<CloseOutlined />}
          onClick={() => {
            console.log("close all");
            this.toggle(false);
          }}
        ></Button>
        <Button
          id="btn-close2"
          style={{
            position: "absolute",
            left: "calc(100vw - 281px)",
            bottom: 194,
            zIndex: 701,
          }}
          type="link"
          icon={<CloseOutlined />}
          onClick={() => {
            console.log("close all");
            this.toggle(false);
          }}
        ></Button>
        <Button
          id="btn-return"
          style={{
            position: "absolute",
            right: 32,
            top: 92 + this.state.yOffset,
            zIndex: 701,
          }}
          type="link"
          icon={<RollbackOutlined />}
          onClick={() => {
            console.log("return to provice");
            // this.props.onReturn("return to provice!");
          }}
        ></Button>
      </div>
    );
  }
}
