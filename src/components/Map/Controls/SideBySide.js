import React, { PureComponent, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";
import ZkyMap from "@/pages/ZkyMap/ZkyMap";

import { connect } from "dva";
import config from "../../../config";
import { Select, Tooltip } from "antd";
import "leaflet-side-by-side";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import ReactDOM from "react-dom";
var $ = jQuery;

var leftDateJgImg = null,
  rightDateJgImg = null,
  leftDateWayback = null,
  rightDateWayback = null;
//this.props.map.
@connect(({ map }) => ({
  map,
}))
export default class SideBySide extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  //在这里初始化state
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = {
      counter: 0,
      leftDate: null,
      rightDate: null,
      isHistoryLock: true,
      yOffset: 0,
      leftOffset: 0,
      leftDateLeft: `calc(50% - 125px - 5px)`,
      rightDateLeft: `calc(50% + 5px)`,
      imageSource: "监管影像",
    };
  }
  //会在组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应该放在这里。
  //如需通过网络请求获取数据，此处是实例化请求的好地方。
  componentDidMount() {
    const { link, instanceProps, dispatch } = this.props;
    link && link(this);
    instanceProps && this.instance(instanceProps.map, instanceProps.options);
    ZkyMap.getWaybackItems({ dispatch });
  }

  componentDidUpdate(prevState) {
    const { leftDateLeft, rightDateLeft } = this.state;
    // 这相当于带有依赖的 useEffect
    const { leftDate, rightDate } = this.state;
    const { imageSource } = this.state;
    const { leftDate: _leftDate, rightDate: _rightDate } = prevState;
    if (leftDate !== _leftDate || rightDate !== _rightDate) {
      const leftContainer = ZkyMap.selectOne(
        ".side-left-data",
        this._map._container,
      );
      const rightContainer = ZkyMap.selectOne(
        ".side-right-data",
        this._map._container,
      );
      ReactDOM.render(
        this.getCustomDiv("leftDate", leftDateLeft, (e) => {
          console.log(e);

          if (imageSource === "监管影像") {
            this.setState({ leftDate: e });
            leftDateJgImg = e;
          }

          if (imageSource === "ArcGIS") {
            this.setState({ leftDate: e });
            leftDateWayback = e;
          }

          this._loadSideBySide(e, rightDate);
        }),
        leftContainer,
      );
      ReactDOM.render(
        this.getCustomDiv("rightDate", rightDateLeft, (e) => {
          console.log(e);

          if (imageSource === "监管影像") {
            this.setState({ rightDate: e });
            rightDateJgImg = e;
          }
          if (imageSource === "ArcGIS") {
            this.setState({ rightDate: e });
            rightDateWayback = e;
          }

          this._loadSideBySide(leftDate, e);
        }),
        rightContainer,
      );
    }
    // 检查特定的 props 或 state 是否发生变化，并执行相应的操作
  }
  //组件从DOM移除时调用
  componentWillUnmount() {
    this._remove();
  }

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
    const {
      map: { waybackItems, jgImageItems, histories },
    } = this.props;
    this._map = map;
    this._baseLayers = options.baseLayers;
    //绑定事件
    //初始化时默认选择第一个日期
    if (histories[0]) {
      this._loadSideBySide(histories[0], histories[0]);
      leftDateJgImg = histories[0];
      rightDateJgImg = histories[0];
      leftDateWayback = waybackItems?.[0].value;
      rightDateWayback = waybackItems?.[0].value;
      this.setState({
        leftDate: histories[0],
        rightDate: histories[0],
      });
    }
    options.yOffset && this.setState({ yOffset: options.yOffset });
    //
    if (options.leftOffset) {
      // this.setState({
      //   leftOffset: options.leftOffset,
      //   letfDateLeft: `calc(50vw + 40px)`,
      //   rightDateLeft: `calc(50vw + 185px)`,
      // });
      this.sideBySide._updateClip();
      // $("#leftDate").css(
      //   "left",
      //   `calc(50vw - 34px - 145px + ${options.leftOffset}px)`,
      // );
      // $("#rightDate").css(
      //   "left",
      //   `calc(50vw - 34px + 10px + ${options.leftOffset}px)`,
      // );
    }
    // this._map.on("zoomend moveend", this._update, this);
    //放大到13级
    this._limitMapStatus();
    this._update();
    // 初始化事件选择框
    this.initTimeSelect();
    //添加事件，设置状态
    this._map.fire("addSideBySide", {}, this);
  };

  initTimeSelect() {
    const { leftDate, rightDate, leftDateLeft, rightDateLeft } = this.state;
    const { imageSource } = this.state;
    this.leftContainer = L.DomUtil.create("div", "side-left-data");
    this.rightContainer = L.DomUtil.create("div", "side-right-data");
    this._map._container.appendChild(this.leftContainer);
    this._map._container.appendChild(this.rightContainer);
    // 使用 ReactDOM.render 把你的 JSX 渲染到新创建的 div 中
    ReactDOM.render(
      this.getCustomDiv("leftDate", leftDateLeft, (e) => {
        console.log(e);

        if (imageSource === "监管影像") {
          this.setState({ leftDate: e });
          leftDateJgImg = e;
        }

        if (imageSource === "ArcGIS") {
          this.setState({ leftDate: e });
          leftDateWayback = e;
        }

        this._loadSideBySide(e, rightDate);
      }),
      this.leftContainer,
    );
    ReactDOM.render(
      this.getCustomDiv("rightDate", rightDateLeft, (e) => {
        console.log(e);

        if (imageSource === "监管影像") {
          this.setState({ rightDate: e });
          rightDateJgImg = e;
        }
        if (imageSource === "ArcGIS") {
          this.setState({ rightDate: e });
          rightDateWayback = e;
        }

        this._loadSideBySide(leftDate, e);
      }),
      this.rightContainer,
    );
  }

  getCustomDiv(id, positionLeft, onChangeCallback) {
    const {
      leftDate,
      rightDate,
      imageSource,
      leftDateWayback,
      rightDateWayback,
    } = this.state;
    const {
      map: { waybackItems, jgImageItems },
    } = this.props;

    // const getSelectValue = (id) => {
    //   let returnValue = null;
    //   if (id === "leftDate") {
    //     if (imageSource === "监管影像") {
    //       returnValue = leftDate;
    //     }
    //     if (imageSource === "ArcGIS") {
    //       returnValue = leftDateWayback;
    //     }
    //   } else {
    //     if (imageSource === "监管影像") {
    //       returnValue = rightDate;
    //     }
    //     if (imageSource === "ArcGIS") {
    //       returnValue = rightDateWayback;
    //     }
    //   }
    //   return returnValue;
    // };

    return (
      <div
        id={id}
        style={{
          zIndex: 900,
          position: "absolute",
          top: 10 + this.state.yOffset,
          left: positionLeft,
          background: "white",
          borderRadius: 3,
          height: "auto",
          minWidth: 125,
          padding: "6px 8px",
          boxShadow: "rgb(0 0 0 / 65%) 0px 1px 5px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Select
          style={{
            width: "auto",
          }}
          value={id === "leftDate" ? leftDate : rightDate}
          options={imageSource === "监管影像" ? jgImageItems : waybackItems}
          placeholder="请选择"
          size="small"
          onChange={onChangeCallback}
        />
        {/* {imageSource==='监管影像'?this.props.map.histories.map((item, id) => (
            <Select.Option key={id + "first"} value={item}>
              {item}
            </Select.Option>
          )):} */}
        {/* </Select> */}
      </div>
    );
  }
  //更新界面
  _update = () => {
    // if (!this.state.isHistoryLock && this.props.map.histories[0]) {
    //   this._loadHistoryImg(this.props.map.histories[0]);
    // }
  };

  //重置状态
  _reset = () => {};

  //移除工具
  _remove = () => {
    this._reset();
    if (this.leftLayer && this.rightLayer) {
      if (this._map.hasLayer(this.leftLayer)) {
        this._map.removeLayer(this.leftLayer);
      }
      if (this._map.hasLayer(this.rightLayer)) {
        this._map.removeLayer(this.rightLayer);
      }
    }
    this.sideBySide && this.sideBySide.remove();
    // this._map.off("zoomend moveend", this._update, this);
    this._resetMapStatus();
    //清除组件
    $(this.leftContainer).remove();
    $(this.rightContainer).remove();
    //添加事件，设置状态
    this._map.fire("removeSideBySide", {}, this);
  };

  //移除原本底图
  _limitMapStatus = () => {
    if (!this._map) {
      return;
    }
    // this._map.setMinZoom(13);
    // this._map.setMaxZoom(18);

    if (this._map._currentBaseLayer) {
      this._map.removeLayer(this._map._currentBaseLayer);
      return;
    }

    this._baseLayers.forEach((item) => {
      if (this._map.hasLayer(item)) {
        this._backBaseLayer = item;
        this._map.removeLayer(this._backBaseLayer);
      }
    });
  };

  _resetMapStatus = () => {
    if (!this._map) {
      return;
    }

    if (this._map._currentBaseLayer) {
      this._map.addLayer(this._map._currentBaseLayer);
      return;
    }

    if (this._backBaseLayer && !this._map.hasLayer(this._backBaseLayer)) {
      this._map.addLayer(this._backBaseLayer);
    }
  };

  _loadHistoryImg = (date) => {
    this.setState({ selectHistory: date });
    if (!this._map) {
      return;
    }
    if (date) {
      let url = `${config.imageBaseUrl}/${date.replace(
        /\//g,
        "-",
      )}/false/tile/{z}/{y}/{x}`;
      let layer = L.tileLayer(url, { pane: "baseLayer", maxNativeZoom: 17 });
      if (!this._historyBaseLayer) {
        this._historyBaseLayer = layer;
        this._map.addLayer(this._historyBaseLayer);
        return;
      }
      if (this._historyBaseLayer._url === url) {
        return;
      } else {
        if (this._map.hasLayer(this._historyBaseLayer)) {
          this._map.removeLayer(this._historyBaseLayer);
        }
        this._historyBaseLayer = layer;
        this._map.addLayer(this._historyBaseLayer);
      }
    }
  };

  _createLayerByDate = (date) => {
    if (!this._map) {
      return;
    }
    let url = `${config.imageBaseUrl}/${date.replace(
      /\//g,
      "-",
    )}/false/tile/{z}/{y}/{x}`;
    let layer = L.tileLayer(url, { pane: "baseLayer", maxNativeZoom: 17 });
    return layer;
  };

  _loadSideBySide = (leftDate, rightDate) => {
    if (!this._map) {
      return;
    }

    if (this.leftLayer && this.rightLayer) {
      if (this._map.hasLayer(this.leftLayer)) {
        this._map.removeLayer(this.leftLayer);
      }
      if (this._map.hasLayer(this.rightLayer)) {
        this._map.removeLayer(this.rightLayer);
      }
    }

    const createImageLayer = (date) => {
      let layer;
      if (date.includes("http")) {
        layer = L.tileLayer(date, {
          pane: "baseLayer",
          minZoom: 1,
          maxZoom: 20,
          maxNativeZoom: 18,
        });
      } else {
        layer = this._createLayerByDate(date);
      }
      return layer;
    };

    this.leftLayer = createImageLayer(leftDate).addTo(this._map);
    this.rightLayer = createImageLayer(rightDate).addTo(this._map);

    if (!this.sideBySide) {
      this._map.invalidateSize();
      this.sideBySide = L.control
        .sideBySide(this.leftLayer, this.rightLayer)
        .addTo(this._map);
      this.sideBySide.on("dividermove", (e) => {
        // console.log("移动", e);
        let leftWidth = $("#leftDate").width();
        $("#leftDate").css(
          "left",
          parseInt(e.x - leftWidth - 24 + this.state.leftOffset),
        );
        $("#rightDate").css("left", parseInt(e.x + 10 + this.state.leftOffset));
      });
    } else {
      this.sideBySide.setLeftLayers([this.leftLayer]);
      this.sideBySide.setRightLayers([this.rightLayer]);
    }
  };

  render() {
    const { leftDate, rightDate } = this.state;
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          ...this.props?.style,
        }}
      >
        <div>
          拖动中间卷帘比较两期影像，点击卷帘两侧下拉按钮切换左右影像时间。
        </div>
        <div style={{ marginTop: 10, display: "inline-block" }}>
          <span>影像源： </span>
          <Select
            style={{
              width: 130,
              marginTop: 10,
            }}
            defaultValue="监管影像"
            options={[
              { value: "监管影像", label: "监管影像" },
              { value: "ArcGIS", label: "ArcGIS" },
            ]}
            placeholder="请选择"
            onChange={(e) => {
              console.log(e);
              this.setState({ imageSource: e });
              if (e === "监管影像") {
                this.setState({
                  leftDate: leftDateJgImg,
                  rightDate: rightDateJgImg,
                });
                this._loadSideBySide(leftDateJgImg, rightDateJgImg);
              }
              if (e === "ArcGIS") {
                this.setState({
                  leftDate: leftDateWayback,
                  rightDate: rightDateWayback,
                });
                this._loadSideBySide(leftDateWayback, rightDateWayback);
              }
            }}
          />
        </div>
      </div>
    );
  }
}
