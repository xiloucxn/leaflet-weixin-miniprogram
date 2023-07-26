import React, { PureComponent } from "react";
import { connect } from "dva";
import { List, Tooltip, message } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";

var $ = jQuery;

@connect(({ _area }) => ({ _area }))
export default class RegionLocate extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  //在这里初始化state
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = {
      counter: 0,
      nowCity: null,
      provice: null,
      citys: null,
      yOffset: 0,
      panelShow: false,
    };
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
    this.props.yOffset &&
      this.setState({ yOffset: parseInt(this.props.yOffset) });
    this.getRegionTreeData();
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

  getRegionTreeData = () => {
    let locatetimer = setInterval(() => {
      let authority = JSON.parse(localStorage.getItem("sb_user")) || {};
      if (
        authority.departmentDistrictCodeId &&
        this.props._area.areaTreeFilter.length > 0
      ) {
        this.authority = authority;
        let treeData = this.props._area.areaTreeFilter;
        this.getAccountInfo(treeData, this.authority);
        clearInterval(locatetimer);
      }
    }, 100);
  };

  getAccountInfo = (treeData, authority) => {
    treeData.forEach((item) => {
      this.getDistrictListByTreeData(
        item,
        String(authority.departmentDistrictCodeId),
        treeData,
      );
    });
  };

  getDistrictListByTreeData = (treeData, districtValue, parent) => {
    if (treeData.value === districtValue) {
      this.regionTreeData = treeData;
      this.regionTreeData.parent = parent;
      this.createContent(this.regionTreeData, this.authority);
      return;
    }
    if (!treeData.children) {
      return;
    }
    if (treeData.children) {
      treeData.children.forEach((item) => {
        this.getDistrictListByTreeData(item, districtValue, treeData);
      });
    }
  };

  createContent = (treeData, authority) => {
    console.log("区域导航", treeData, authority);
    this.setState({ nowCity: treeData });
    if (authority.level === "省级") {
      this.setState({ provice: treeData });
      this.setState({ citys: treeData.children });
    }
    if (authority.level === "市级") {
      this.setState({ citys: [treeData] });
    }
    if (authority.level === "县级") {
      //构造县级data
      console.log(treeData);
      let copyTreeData = { parent: null, ...treeData };
      treeData.parent.children = [copyTreeData];
      let cityData = { ...treeData.parent };
      // console.log(cityData)
      this.setState({ citys: [cityData] });
    }
  };

  createCityList = (arrayData) => {
    return arrayData.map((item) => {
      return (
        <div style={{ display: "flex" }}>
          <div style={{ minWidth: 45, marginRight: 10, fontWeight: "bold" }}>
            {" "}
            <a
              onClick={() => {
                this.onClickPlace(item, 9);
              }}
            >
              {item.label}
            </a>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {item.children && this.createCountyList(item.children)}
          </div>
        </div>
      );
    });
  };

  createCountyList = (arrayData) => {
    return arrayData.map((item) => {
      //过滤市辖区
      if (item.label !== "市辖区") {
        return (
          <span style={{ width: "auto", float: "left", margin: "2px 10px" }}>
            <a
              onClick={() => {
                this.onClickPlace(item, 12);
              }}
            >
              {item.label}
            </a>
          </span>
        );
      } else {
        return null;
      }
    });
  };

  onClickPlace = (place, zoomLevel) => {
    this.setState({ panelShow: false });
    if (!this._map || !place.pointY || !place.pointX) {
      return;
    }
    this.setState({ nowCity: place });
    this._map.setView([place.pointY, place.pointX], zoomLevel);
  };

  render() {
    const { isV4 } = this.props;
    return (
      <div style={{ fontSize: 14 }}>
        <div
          id="now-city"
          style={{
            background: "white",
            padding: "5px 10px",
            width: "auto",
            right: 250,
            position: "absolute",
            zIndex: 1000,
            top: 55 + this.state.yOffset,
            height: 32,
            borderRadius: 3,
            boxShadow: "rgb(0 0 0 / 65%) 0px 1px 5px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{ cursor: "pointer", display: "inline" }}
            onClick={() => {
              this.setState({ panelShow: !this.state.panelShow });
            }}
          >
            {this.state.nowCity?.label}
          </div>
          {this.state.panelShow ? (
            <UpOutlined
              style={{ padding: "5px 5px" }}
              onClick={() => {
                this.setState({ panelShow: !this.state.panelShow });
              }}
            />
          ) : (
            <DownOutlined
              style={{ padding: "5px 5px" }}
              onClick={() => {
                this.setState({ panelShow: !this.state.panelShow });
              }}
            />
          )}
        </div>
        {this.state.panelShow && (
          <div
            id="locate-panel"
            style={{
              background: "white",
              padding: 10,
              width: 350,
              minHeight: 100,
              maxHeight: 240,
              position: "absolute",
              zIndex: 1000,
              right: 250,
              fontSize: "14px",
              float: "right",
              top: 95 + this.state.yOffset,
              overflowY: "auto",
            }}
          >
            <div>
              {this.state.provice && (
                <div style={{ fontWeight: "bold" }}>
                  <a
                    onClick={() => {
                      this.onClickPlace(this.state.provice, 7);
                    }}
                  >
                    {this.state.provice?.label}
                  </a>
                </div>
              )}
              {this.state.citys && this.createCityList(this.state.citys)}
            </div>
          </div>
        )}
      </div>
    );
  }
}
