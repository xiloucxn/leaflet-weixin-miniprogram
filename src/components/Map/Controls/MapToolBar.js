import React, { PureComponent } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";
import { Dropdown, Menu, Card, Tooltip, Switch } from "antd";
import {
  UnorderedListOutlined,
  GlobalOutlined,
  ToolOutlined,
  QuestionCircleOutlined,
  ColumnWidthOutlined,
  EnvironmentOutlined,
  PictureOutlined,
  MergeCellsOutlined,
} from "@ant-design/icons";
import { connect } from "dva";

import mapHelper from "../../../utils/mapHelper";
import BaseMap from "./BaseMaps";
import Overlayers from "./Overlayers";
import Legend from "./Legend";
import Measure from "./Measure";
import Locate from "./Locate";
import HistoryImage from "./HistoryImage";
import RegionLocate from "./RegionLocate";
import SideBySide from "./SideBySide";
import ZkyMap from "@/pages/ZkyMap/ZkyMap";

var $ = jQuery;

@connect(({ map }) => ({
  map,
}))
export default class MapToolBar extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  //在这里初始化state
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = {
      counter: 0,
      dropdown1Visibility: false,
      dropdown2Visibility: false,
      dropdown3Visibility: false,
      currentTool: "",
      showSwitch: true,
      switchChecked: true,
      showSideBySide: true,
      showLegend: true,
    };
    this._map = {};

    this.props.link && this.props.link(this);
  }

  //会在组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应该放在这里。
  //如需通过网络请求获取数据，此处是实例化请求的好地方。
  componentDidMount() {
    const { link, dispatch } = this.props;
    link && link(this);
    ZkyMap.getWaybackItems({ dispatch });
  }

  //组件从DOM移除时调用
  componentWillUnmount() {}

  instance = (map, options) => {
    // console.log("Instance:", map, options);
    this._map = map;
    this.setState(options);
  };

  toggleSwitchChart = (bool) => {
    this.setState({ switchChecked: bool });
  };

  render() {
    return (
      <div
        id="maptoolpanel"
        style={{
          position: "absolute",
          top: 80,
          right: 20,
          zIndex: "1000",
          display: "block",
          fontSize: "14px",
          boerder: "solid #fff",
          boxShadow: "0 1px 5px rgb(0 0 0 / 65%)",
          borderRadius: 3,
          ...this.props?.style,
        }}
      >
        <div
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
              <Overlayers
                link={(t) => {
                  this.Overlayers = t;
                }}
                instanceProps={this.OverlayersProps}
              ></Overlayers>
            }
            onVisibleChange={(e) => {
              this.setState({ dropdown1Visibility: e });
            }}
            visible={this.state.dropdown1Visibility}
          >
            <div style={{ padding: "0 15px" }}>
              <span style={{ marginRight: 5 }}>
                <UnorderedListOutlined />
              </span>
              图层
            </div>
          </Dropdown>
          <Dropdown
            overlay={
              <BaseMap
                link={(t) => {
                  this.BaseMap = t;
                }}
                instanceProps={this.BaseMapProps}
              ></BaseMap>
            }
            onVisibleChange={(e) => {
              this.setState({ dropdown2Visibility: e });
            }}
            visible={this.state.dropdown2Visibility}
          >
            <div style={{ padding: "0 15px" }}>
              <span style={{ marginRight: 5 }}>
                <GlobalOutlined />
              </span>
              底图
            </div>
          </Dropdown>
          <Dropdown
            overlay={
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  right: 0,
                  minWidth: 84,
                  maxHeight: 400,
                  padding: "0 2px",
                  border: "1px solid #ebebeb",
                  background: "white",
                  borderRadius: 3,
                  boxShadow: "0 0 4px 0 rgb(0 0 0 / 15%)",
                  flexDirection: "column",
                }}
              >
                <Menu selectable={false}>
                  {this.state.showLegend && (
                    <Menu.Item
                      key="tool-legend"
                      onClick={(e) => {
                        console.log(e);
                        this.setState({ currentTool: e.key });
                        this._map.currentTool = e.key;
                      }}
                    >
                      <span style={{ marginRight: 5 }}>
                        <QuestionCircleOutlined />
                      </span>
                      <span>图例</span>
                    </Menu.Item>
                  )}
                  <Menu.Item
                    key="tool-measure"
                    onClick={(e) => {
                      console.log(e);
                      this.setState({ currentTool: e.key });
                      this._map.currentTool = e.key;
                    }}
                  >
                    <span style={{ marginRight: 5 }}>
                      <ColumnWidthOutlined />
                    </span>
                    <span>测量</span>
                  </Menu.Item>
                  <Menu.Item
                    key="tool-locate"
                    onClick={(e) => {
                      console.log(e);
                      this.setState({ currentTool: e.key });
                      this._map.currentTool = e.key;
                    }}
                  >
                    <span style={{ marginRight: 5 }}>
                      <EnvironmentOutlined />
                    </span>
                    <span>定位</span>
                  </Menu.Item>
                  <Menu.Item
                    key="tool-history"
                    onClick={(e) => {
                      console.log(e);
                      this.setState({ currentTool: e.key });
                      this._map.currentTool = e.key;
                    }}
                  >
                    <span style={{ marginRight: 5 }}>
                      <PictureOutlined />
                    </span>
                    <span>历史</span>
                  </Menu.Item>
                  {this.state.showSideBySide && (
                    <Menu.Item
                      key="tool-sidebyside"
                      onClick={(e) => {
                        console.log(e);
                        this.setState({ currentTool: e.key });
                        this._map.currentTool = e.key;
                      }}
                    >
                      <span style={{ marginRight: 5 }}>
                        <MergeCellsOutlined />
                      </span>
                      <span>卷帘</span>
                    </Menu.Item>
                  )}
                </Menu>
                <Tooltip title={`显示、隐藏统计图`}>
                  {this.state.showSwitch && (
                    <Switch
                      style={{ width: 70, left: 7, marginBottom: 10 }}
                      checkedChildren="统计图"
                      unCheckedChildren="统计图"
                      defaultChecked
                      checked={this.state.switchChecked}
                      onClick={(v, e) => {
                        e.stopPropagation();
                        mapHelper.status.isChartOn = v;
                        window.qyjgmap && window.qyjgmap.toggleMapChart(v);
                        window.onemap && window.onemap.toggleMapChart(v);
                        this.setState({ switchChecked: v });
                      }}
                    />
                  )}
                </Tooltip>
              </div>
            }
            onVisibleChange={(e) => {
              this.setState({ dropdown3Visibility: e });
            }}
            visible={this.state.dropdown3Visibility}
          >
            <div style={{ padding: "0 15px" }}>
              <span style={{ marginRight: 5 }}>
                <ToolOutlined />
              </span>
              工具
            </div>
          </Dropdown>
        </div>
        <div
          id="tool-container"
          style={{
            position: "absolute",
            // border: "1px solid red",
            minWidth: 100,
            minHeight: 1,
            right: 0,
            top: 38,
          }}
        >
          {this.state.currentTool === "tool-legend" && (
            <div style={{ minWidth: 130 }}>
              <Card
                size="small"
                title="图例"
                type="inner"
                extra={
                  <a
                    href="javascript:void()"
                    onClick={(e) => {
                      console.log("close card");
                      this.setState({ currentTool: "" });
                      this._map.currentTool = "";
                    }}
                  >
                    X
                  </a>
                }
              >
                <Legend
                  link={(t) => {
                    this.Legend = t;
                  }}
                  instanceProps={this.LegendProps}
                ></Legend>
              </Card>
            </div>
          )}
          {this.state.currentTool === "tool-measure" && (
            <div style={{ minWidth: 130 }}>
              <Card
                size="small"
                title="测量"
                type="inner"
                extra={
                  <a
                    href="javascript:void()"
                    onClick={(e) => {
                      console.log("close");
                      this.setState({ currentTool: "" });
                      this._map.currentTool = "";
                    }}
                  >
                    X
                  </a>
                }
              >
                <Measure
                  link={(t) => {
                    this.Measure = t;
                  }}
                  instanceProps={this.MeasureProps}
                ></Measure>
              </Card>
            </div>
          )}
          {this.state.currentTool === "tool-locate" && (
            <div style={{ minWidth: 130 }}>
              <Card
                size="small"
                title="坐标定位"
                type="inner"
                extra={
                  <a
                    href="javascript:void()"
                    onClick={(e) => {
                      console.log("close");
                      this.setState({ currentTool: "" });
                      this._map.currentTool = "";
                    }}
                  >
                    X
                  </a>
                }
              >
                <Locate
                  link={(t) => {
                    this.Locate = t;
                  }}
                  instanceProps={this.LocateProps}
                ></Locate>
              </Card>
            </div>
          )}
          {/* {this.state.currentTool === "tool-regionlocate" && (
            <div style={{ minWidth: 130 }}>
              <Card
                size="small"
                title="区域导航"
                type="inner"
                extra={
                  <a
                    href="javascript:void()"
                    onClick={(e) => {
                      console.log("close");
                      this.setState({ currentTool: "" });
                      this._map.currentTool = "";
                    }}
                  >
                    X
                  </a>
                }
              >
                <RegionLocate
                  link={(t) => {
                    this.Locate = t;
                  }}
                  instanceProps={this.RegionLocateProps}
                ></RegionLocate>
              </Card>
            </div>
          )} */}
          {this.state.currentTool === "tool-history" && (
            <div style={{ minWidth: 130 }}>
              <Card
                size="small"
                title="历史影像"
                type="inner"
                extra={
                  <a
                    href="javascript:void()"
                    onClick={(e) => {
                      console.log("close");
                      this.setState({ currentTool: "" });
                      this._map.currentTool = "";
                    }}
                  >
                    X
                  </a>
                }
              >
                <HistoryImage
                  link={(t) => {
                    this.HistoryImage = t;
                  }}
                  instanceProps={this.HistoryImageProps}
                ></HistoryImage>
              </Card>
            </div>
          )}
          {this.state.currentTool === "tool-sidebyside" && (
            <div style={{ minWidth: 130 }}>
              <Card
                size="small"
                title="卷帘对比"
                type="inner"
                extra={
                  <a
                    href="javascript:void()"
                    onClick={(e) => {
                      console.log("close");
                      this.setState({ currentTool: "" });
                      this._map.currentTool = "";
                    }}
                  >
                    X
                  </a>
                }
              >
                {/* <div>卷帘对比功能升级中，暂时无法使用。</div> */}
                <SideBySide
                  link={(t) => {
                    this.HistoryImage = t;
                  }}
                  instanceProps={this.SideBySideProps}
                ></SideBySide>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }
}
