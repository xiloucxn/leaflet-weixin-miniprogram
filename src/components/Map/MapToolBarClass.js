import React, { PureComponent, useEffect, useState } from "react";
import { connect } from "dva";
import {
  Tree,
  Card,
  Dropdown,
  Menu,
  Form,
  Input,
  Button,
  Select,
  Tooltip,
} from "antd";
import {
  UnorderedListOutlined,
  GlobalOutlined,
  ToolOutlined,
  BorderOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  BorderHorizontalOutlined,
  FileImageOutlined,
  QuestionCircleOutlined,
  PictureOutlined,
  ColumnWidthOutlined,
  MergeCellsOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import L from "leaflet";
import config from "../../config";
import request from "../../utils/request";
import emitter from "../../utils/event";
//地图测量控件
import "./Measure/leaflet-measure.css";
import "./Measure/leaflet-measure.cn";
import jQuery from "jquery";
import { render } from "react-dom";
//地图切换控件
import "./BasemapSwitch/L.switchBasemap.css";
import "./BasemapSwitch/L.switchBasemap";

@connect(({ map, reviewPlan }) => ({ map, reviewPlan }))
export default class MapToolBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rootStyle: {
        position: "absolute",
        top: 355,
        right: 100,
        zIndex: "900",
        display: "block",
        fontSize: "14px",
      },
    };
  }

  componentDidMount() {
    const { link, style } = this.props;
    //暴露自身
    link && link(this);
    //修改样式
    style && this.updateStyle(style);
  }

  /**
   *更新root节点style
   *
   * @param {*} style 样式
   * @memberof MapToolBar
   */
  updateStyle = (style) => {
    let rootStyle = { ...this.state.rootStyle, ...style };
    this.setState({ rootStyle });
  };
  /**
   *初始化地图，初始化所有控件
   *
   * @param {*} map
   * @param {*} options
   * @memberof MapToolBar
   */
  initialize = (map, options) => {
    console.log("地图组件初始化", map);
  };

  render() {
    const { rootStyle } = this.state;
    return (
      <div style={rootStyle}>
        <div
          id="map-tool-menu"
          style={{
            display: "flex",
            background: "white",
            height: "32px",
            lineHeight: "32px",
            fontSize: "14px",
            userSelect: "none",
            borderRadius: 3,
          }}
        >
          <Dropdown
            overlay={
              <div
                style={{ backgroundColor: "white" }}
                id="basemapSwitcher-container"
              >
                容器
              </div>
            }
          >
            <div style={{ padding: "0 15px" }}>
              <span style={{ marginRight: 5 }}>
                <GlobalOutlined />
              </span>
              底图
            </div>
          </Dropdown>
        </div>
      </div>
    );
  }
}
