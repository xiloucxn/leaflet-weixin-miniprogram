import React, { useEffect, useState } from "react";
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
import "./Measure/leaflet-measure.css";
import "./Measure/leaflet-measure.cn";
import jQuery from "jquery";

//Styles
const menuItemStyle = { padding: "0 20px", cursor: "pointer" };
const currentMenuItemStyle = {
  padding: "0 20px",
  cursor: "pointer",
  color: "#579AFC",
};
const baseLayerItemStyle = {
  position: "relative",
  width: 76,
  height: 76,
  padding: 0,
  margin: "5px 0 5px 5px",
  listStyle: "none",
  cursor: "pointer",
  border: "2px solid white",
};
const currentBaseLayerItemStyle = {
  position: "relative",
  width: 76,
  height: 76,
  padding: 0,
  margin: "5px 0 5px 5px",
  listStyle: "none",
  cursor: "pointer",
  border: "2px solid rgb(24,144,255)",
};

//实例化为Layer的基础底图
let mapBaseLayers = [];

let currentBaseLayer = null;
let lastTool = null;

//实例化为Layer的业务图层
let mapOverlayLayers = [];

let measureControl = null;

let _layer = null;

let _ImgListLayer = null;

//menuData
const menuData = [
  { title: "图层", icon: <UnorderedListOutlined /> },
  { title: "底图", icon: <GlobalOutlined /> },
  { title: "工具", icon: <ToolOutlined /> },
];

//toolData
const toolData = [
  {
    title: "图例",
    icon: <QuestionCircleOutlined />,
  },
  {
    title: "测量",
    icon: <ColumnWidthOutlined />,
  },
  {
    title: "定位",
    icon: <EnvironmentOutlined />,
  },
  {
    title: "历史影像",
    icon: <PictureOutlined />,
  },
  // {
  //   title: "卷帘对比",
  //   icon: <MergeCellsOutlined />,
  // },
];

let rdtbLayersData = [];

let overlayLayersRawData = [
  {
    title: "边界注记",
    key: "bjzj",
    children: [
      {
        title: "路网注记",
        key: "lwzj",
        icon: (
          <img style={{ width: 22, height: 22 }} src="./img/注记图标.png"></img>
        ),
      },
      {
        title: "行政边界",
        key: "xzbj",
        icon: (
          <img style={{ width: 22, height: 22 }} src="./img/行政注记.png"></img>
        ),
      },
    ],
  },
];

function getParentInnerText(node) {
  if (node.innerText) {
    return node.innerText;
  }
  if (node.parentNode) {
    if (node.parentNode.innerText) {
      return node.parentNode.innerText;
    } else {
      return getParentInnerText(node.parentNode);
    }
  } else {
    return null;
  }
}

// 构建图层标题及图例
function getTitle(text, borderColor, fillColor, isBorderDashed, className) {
  if (className) {
    return `<i style='display:inline-block;border:${
      isBorderDashed ? "dashed" : "solid"
    } 2px ${borderColor};background:${fillColor};width:20px;height:20px;position:relative;top:4px;'></i><span style='padding-left:1px;'>${text}</span><div class='${className}'></div>`;
  } else {
    return `<i style='display:inline-block;border:${
      isBorderDashed ? "dashed" : "solid"
    } 2px ${borderColor};background:${fillColor};width:20px;height:20px;position:relative;top:4px;'></i><span style='padding-left:1px;'>${text}</span>`;
  }
}

export default connect(({ map, reviewPlan }) => ({ map, reviewPlan }))(
  MapToolBarAi,
);
function MapToolBarAi({ dispatch, _style, map: { histories }, reviewPlan }) {
  // function getReviewPlanList() {
  //   return new Promise(function (resolve, reject) {
  //     props.dispatch({
  //       type: "reviewPlan/reviewPlanList",
  //       payload: {
  //         maxResultCount: 100,
  //       },
  //       callback: (success, result) => {
  //         //
  //         // console.log(result);
  //         if (success) {
  //           resolve(result);
  //           // if (result.totalCount !== 0) {
  //           //   let reviewPlanList=result.items.map(item=>{return {key:`rdtb${item.id}`,title:item.name}})
  //           //   console.log("reviewPlanList",result,reviewPlanList);
  //           //   rdtbLayersData=reviewPlanList;
  //           //   overlayLayersRawData.find(item=>item.key==="stbc").children.find(item=>item.key==="rdtb").children=reviewPlanList;
  //           //   setOverlayLayersData(overlayLayersRawData);
  //           //   setCheckedKeys(["rdtb"]);

  //           //   //更新地图
  //           //   reloadOverlayers();
  //           // }
  //         }
  //       },
  //     });
  //   });
  // }
  const _map = config.aiMap;
  const _overlayers = config.lstOverLayers;

  const [baseLayers, setBaseLayers] = useState([]);
  useEffect(() => {
    //构建底图实例
    mapBaseLayers = baseLayers.map((item) => {
      //特殊处理天地图，返回组合图层
      if (item.id === "tdt_vec") {
        let tdtvec = L.tileLayer(`${item.url}`, {
          minZoom: 0,
          maxZoom: 20,
          maxNativeZoom: 18,
          subdomains: item.subdomains,
          pane: "tileLayerZIndex",
          errorTileUrl: item.errorTileUrl,
        });

        let tdtCva = L.tileLayer(
          `https://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=52eb0376ca0a56c6f6ed72ac8302a703`,
          {
            minZoom: 0,
            maxZoom: 20,
            maxNativeZoom: 18,
            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
            // pane: "",
            errorTileUrl: "./img/errorTileUrl.png",
          },
        );

        let tdtVecGroup = L.layerGroup([tdtvec, tdtCva]);

        tdtVecGroup.id = item.id;
        tdtVecGroup.layerType = "baselayer";
        tdtVecGroup.icon = item.icon;
        tdtVecGroup.title = item.title;
        return tdtVecGroup;
      }
      if (item.layertype === "TileLayer") {
        let layer = L.tileLayer(`${item.url}`, {
          minZoom: 0,
          maxZoom: 20,
          maxNativeZoom: 18,
          subdomains: item.subdomains,
          pane: "tileLayerZIndex",
          errorTileUrl: item.errorTileUrl,
        });
        layer.id = item.id;
        layer.layerType = "baselayer";
        layer.icon = item.icon;
        layer.title = item.title;
        return layer;
      }
    });
  }, [baseLayers]);

  const [overlayLayers, setOverlayLayers] = useState(overlayLayersRawData);
  useEffect(() => {
    //构建业务图层实例
    //;
    mapOverlayLayers = overlayLayers.map((item) => {
      if (item.layertype === "TileLayer") {
        let layer = L.tileLayer(`${item.url}`, {
          minZoom: item.minZoom,
          maxZoom: item.maxZoom,
          subdomains: item.subdomains,
          pane: "tileLayerZIndex",
          errorTileUrl: item.errorTileUrl,
        });
        layer.id = item.id;
        layer.layerType = "overlayer";
        layer.icon = item.icon;
        layer.title = item.title;
        return layer;
      }
    });
  }, [overlayLayers]);

  async function Initialize() {
    //获取地图配置
    let configUrl = `./config.json`;
    let configData = await request(configUrl, { method: "GET" });
    //设置底图列表
    setBaseLayers(configData.data.mapConfig.baseLayers);
    //
    //获取复核计划列表
    // let result = await getReviewPlanList();
    // if (result.totalCount !== 0) {
    //   let reviewPlanList = result.items.map((item) => {
    //     return { key: `rdtb${item.id}`, title: item.name };
    //   });
    //   console.log("reviewPlanList", result, reviewPlanList);
    //   rdtbLayersData = reviewPlanList;
    //   overlayLayersRawData
    //     .find((item) => item.key === "stbc")
    //     .children.find((item) => item.key === "rdtb").children = reviewPlanList;
    //   setOverlayLayers(overlayLayersRawData);
    //   setCheckedKeys(["rdtb"]);
    //   //更新地图
    //   // reloadOverlayers();
    // }
    // //;
  }

  //componentDidMount，初始化
  useEffect(() => {
    Initialize();
    emitter.addListener("addCheckedKeys", (e) => {
      let set = new Set(checkedKeys);
      e.forEach((item) => {
        set.add(item);
      });
      setCheckedKeys(Array.from(set));
    });
    emitter.addListener("removeCheckedKeys", (e) => {
      let set = new Set(checkedKeys);
      e.forEach((item) => {
        set.delete(item);
      });
      setCheckedKeys(Array.from(set));
    });
    emitter.addListener("setCurrentBaseLayerId", (e) => {
      //不处于历史影像时才切换底图
      setcurrentBaseLayerId(e);
    });
    //;
    // getReviewPlanList();
    // childMethod();
    // console.log("reviewPlanList",props.reviewPlanList);
    return () => {
      emitter.removeAllListeners("setCheckedKeys");
      emitter.removeAllListeners("removeCheckedKeys");
      emitter.removeAllListeners("setCurrentBaseLayerId");
      //;
    };
  }, []);

  function reloadOverlayers() {
    console.log(
      "reloadOverlay",
      "overlays:",
      overlayLayers,
      "checkedkeys:",
      checkedKeys,
      "selectedkeys:",
      selectedKeys,
    );
  }

  const [style, setStyle] = useState(() => {
    let defaultStyle = {
      position: "absolute",
      top: 55,
      right: 100,
      zIndex: "900",
      display: "block",
      fontSize: "14px",
    };
    return { ...defaultStyle, ..._style };
  });

  const [current, setCurrent] = useState();

  function handleMouseEneter(e) {
    // console.log("over", e);
    setCurrent(e.target.innerText);
  }

  function handleMouseLeave(e) {
    // console.log("leave", e);
    setCurrent(null);
  }

  function clickTool(e) {
    closeToolPanel();
    //隐藏菜单
    setCurrentTool(null);
    lastTool = e;
    if (e === "图例") {
      setCurrentTool(e);
    }
    //
    if (e === "测量") {
      setCurrentTool(e);
      if (_map && !measureControl) {
        measureControl = new L.Control.Measure({
          primaryLengthUnit: "kilometers", //meters
          secondaryLengthUnit: "undefined",
          primaryAreaUnit: "hectares",
          //secondaryAreaUnit:"hectares",//sqmeters
          activeColor: "#3388FF",
          completedColor: "#3388FF",
          position: "topright",
        }).addTo(_map);

        //改变测量工具位置
        measureControl._container.remove();
        document
          .getElementById("measure")
          .appendChild(measureControl.onAdd(_map));
      }
    }
    if (e === "定位") {
      setCurrentTool(e);
    }
    if (e === "历史影像") {
      console.log(histories);
      //开启历史影像功能时，卸载底图
      // ;
      if (_map) {
        _map.eachLayer((layer) => {
          if (layer.layerType === "baselayer") {
            currentBaseLayer = layer;
            currentBaseLayer.removeFrom(_map);
          }
        });
        //加载第一个影像
        if (histories[0]) {
          onChangeSelectImg(histories[0]);
        }
        //打开历史影像事件
        _map.fire("historyMap", { isHistoryOn: true });
      }

      setCurrentTool(e);
      // if (_map) {
      //   _map.fire("historymap", null, false);
      // }
    }
    if (e === "卷帘对比") {
      if (_map) {
        _map.fire("sidebyside", null, false);
      }
    }
  }

  const [currentPanel, setCurrentPanel] = useState();

  function clickMenu(e) {
    // console.log("click ", e);
    // let clickedMenu = getParentInnerText(e.target);
    if (e && e !== currentPanel) {
      setCurrentPanel(e);
    } else {
      setCurrentPanel(null);
    }
  }

  const [currentTool, setCurrentTool] = useState(null);

  const [currentBaseLayerId, setcurrentBaseLayerId] = useState("tdt_vec");

  useEffect(() => {
    let clickedBaseLayer = mapBaseLayers.filter((layer) => {
      return layer.id === currentBaseLayerId;
    })[0];
    currentBaseLayer = clickedBaseLayer;
    if (_map) {
      _map.eachLayer((layer) => {
        if (layer.layerType === "baselayer") {
          console.log(layer);
          if (layer.id !== currentBaseLayerId && clickedBaseLayer) {
            //remove old layer
            _map.removeLayer(layer);
          }
        }
      });
      //add new layer
      if (clickedBaseLayer) {
        _map.addLayer(clickedBaseLayer);
        //触发底图改变事件
        _map.fire("myBaseMapChange", clickedBaseLayer);
      }
    }
  }, [currentBaseLayerId]);

  function clickBaseLayer(e) {
    let clickedBaseMapId = e.target.parentNode.id;
    setcurrentBaseLayerId(clickedBaseMapId);
    // console.log("clickBaseLayer", e, clickedBaseMapId);
  }

  const [expandedKeys, setExpandedKeys] = useState(["stbc", "bjzj"]);
  const [checkedKeys, setCheckedKeys] = useState(["xzbj"]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  useEffect(() => {
    // console.log("selectedKeysChange", selectedKeys);
  }, [selectedKeys]);

  useEffect(() => {
    // console.log("checkedKeysChange", checkedKeys);
    let set = new Set(checkedKeys);
    //如果绑定的地图存在，则改变业务图层
    if (_map && _overlayers) {
      _overlayers.forEach((item) => {
        //存在于checkedkeys,且地图未加载的加入地图
        if (set.has(item.key) && !_map.hasLayer(item)) {
          item.addTo(_map);
        }
        //不存在checkedkeys的移除地图
        if (!set.has(item.key) && _map.hasLayer(item)) {
          item.removeFrom(_map);
        }
      });
    }
  }, [checkedKeys]);

  const onExpand = (expandedKeysValue) => {
    console.log("onExpand", expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.

    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    console.log("onCheck", checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    console.log("onSelect", info);
    setSelectedKeys(selectedKeysValue);
  };

  const onMapLocate = (values) => {
    console.log("success:", values);
    //初始化定位的图层
    let map = _map;
    let resultFeature;
    if (_layer === null && map) {
      _layer = L.layerGroup().addTo(map);
    }

    let x = parseFloat(values["lng"]);
    let y = parseFloat(values["lat"]);
    if (x >= -180 && x <= 180 && y >= -90 && y <= 90) {
      if (_map) {
        resultFeature = L.marker([y, x]);
        resultFeature.addTo(_layer);
        const popupContainer = L.DomUtil.create("div", "");
        popupContainer.innerHTML = `<div>
        <h3>定位</h3>
        <p>经度:${x}纬度:${y}</p>
        <button  id="deletelocatemark">删除标记</button>
         </div>`;

        resultFeature.bindPopup(popupContainer, {
          // standard leaflet popup options http://leafletjs.com/reference-1.3.0.html#popup-option
          className: "leaflet-measure-resultpopup",
          autoPanPadding: [10, 10],
        });

        resultFeature.on(
          "popupopen",
          () => {
            console.log("open");
            document.getElementById("deletelocatemark").onclick = function () {
              _layer.removeLayer(resultFeature);
            };
          },
          resultFeature,
        );

        if (resultFeature.getLatLng) {
          map.panTo(resultFeature.getLatLng());
          resultFeature.openPopup(resultFeature.getLatLng());
        }
      }
    } else {
    }
  };

  const closeToolPanel = () => {
    if (lastTool === "历史影像") {
      //卸载历史影像
      if (_ImgListLayer && _map) {
        _ImgListLayer.removeFrom(_map);
      }

      //如果是从历史影像关闭面板，则根据当前id加载底图
      if (currentBaseLayer && _map) {
        if (!_map.hasLayer(currentBaseLayer)) {
          _map.addLayer(currentBaseLayer);
        }
      }
      //打开历史影像事件
      _map.fire("historyMap", { isHistoryOn: false });
    }
  };

  const [selectHistory, setSelectHistory] = useState("");
  const [isHistoryLock, setIsHistoryLock] = useState(true);

  const onChangeSelectImg = (v) => {
    if (v !== selectHistory) {
      setSelectHistory(v);
      //刷新选择影像列表对应影像
      if (v) {
        loadImgLayerByselectIMG(v);
      }
    }
  };

  //histories变化的时候
  useEffect(() => {
    // console.log("newhistor",histories);
    if (currentTool === "历史影像") {
      if (!isHistoryLock && histories[0]) {
        onChangeSelectImg(histories[0]);
      }
    }
  }, [histories]);

  const loadImgLayerByselectIMG = (v) => {
    let map = _map;
    //刷新选择影像列表对应影像
    if (v) {
      let leftLayerUrl =
        config.imageBaseUrl +
        "/" +
        v.replace(/\//g, "-") +
        // "/false/tile/{z}/{y}/{x}";
        "/tile/{z}/{y}/{x}";
      if (_ImgListLayer) {
        map.removeLayer(_ImgListLayer);
      }
      _ImgListLayer = loadMapbaseLayer(map, leftLayerUrl); //影像
    }
  };

  const loadMapbaseLayer = (map, url) => {
    let layer = L.tileLayer(url, {
      pane: "tileLayerZIndex",
      minZoom: config.tdtImageLabel.minZoom,
      maxZoom: config.tdtImageLabel.maxZoom,
      errorTileUrl: config.tdtImageLabel.errorTileUrl,
    }).addTo(map); //影像图
    return layer;
  };

  return (
    <div style={style}>
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
              style={{
                position: "absolute",
                background: "white",
                width: 250,
                maxHeight: 400,
                padding: 3,
                overflow: "auto",
                border: "1px solid #ebebeb",
                boxShadow: "0 0 4px 0 rgb(0 0 0 / 15%)",
                borderRadius: 3,
                // visibility: currentPanel === "图层" ? "visible" : "collapse",
              }}
            >
              <Tree
                showIcon
                defaultExpandAll
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                treeData={overlayLayers}
              />
            </div>
          }
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
            <div id="base-map-panel">
              <ul
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "white",
                  padding: "2px 0",
                  flexWrap: "wrap",
                  width: 250,
                  maxHeight: 400,
                  overflow: "auto",
                  marginBottom: 0,
                }}
              >
                {baseLayers.map((item, index) => (
                  <li
                    key={item.id}
                    id={item.id}
                    style={
                      currentBaseLayerId === item.id
                        ? currentBaseLayerItemStyle
                        : baseLayerItemStyle
                    }
                    onClick={clickBaseLayer}
                  >
                    <img src={item.icon} style={{ width: "100%" }} />
                    <span
                      style={
                        currentBaseLayerId === item.id
                          ? {
                              fontSize: "12px",
                              borderTopRightRadius: "3px",
                              position: "absolute",
                              display: "block",
                              width: "100%",
                              textAlign: "center",
                              bottom: 0,
                              color: "white",
                              background: "rgb(24,144,255)",
                            }
                          : {
                              fontSize: "12px",
                              bottom: 0,
                              position: "absolute",
                              display: "block",
                              width: "100%",
                              textAlign: "center",
                              color: "white",
                              background: "black",
                            }
                      }
                    >
                      {item.title}
                    </span>
                  </li>
                ))}
              </ul>
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

                // visibility: currentPanel === "工具" ? "visible" : "collapse",
              }}
            >
              <Menu selectable={false}>
                {toolData.map((item) => (
                  <Menu.Item
                    key={item.title}
                    // className="maptoolbar-toolItem"
                    // style={toolItemStyle}
                    onClick={() => {
                      clickTool(item.title);
                    }}
                  >
                    <span style={{ marginRight: 5 }}>{item.icon}</span>
                    <span>{item.title}</span>
                  </Menu.Item>
                ))}
              </Menu>
              {/* {toolData.map((item) => (
                <div
                  className="maptoolbar-toolItem"
                  style={toolItemStyle}
                  onClick={() => {
                    clickTool(item.title);
                  }}
                >
                  <span style={{ marginRight: 5 }}>{item.icon}</span>
                  <span>{item.title}</span>
                </div>
              ))} */}
            </div>
          }
        >
          <div style={{ padding: "0 15px" }}>
            <span style={{ marginRight: 5 }}>
              <ToolOutlined />
            </span>
            工具
          </div>
        </Dropdown>
      </div>
      <div id="maptool-content" style={{ marginTop: 10 }}>
        {
          <div
            style={{
              position: "absolute",
              background: "white",
              right: 0,
              minWidth: 84,
              maxHeight: 400,
              display: "flex",
              border: "1px solid #ebebeb",
              boxShadow: "0 0 4px 0 rgb(0 0 0 / 15%)",
              borderRadius: 3,
              flexDirection: "column",
              visibility: currentTool !== null ? "visible" : "hidden",
            }}
          >
            <Card
              title={currentTool}
              size="small"
              extra={
                <a
                  onClick={() => {
                    setCurrentTool(null);
                    closeToolPanel();
                  }}
                  href="Javascript:void(0)"
                >
                  X
                </a>
              }
              style={{ width: 300 }}
            >
              {currentTool === "图例" && <img src="./img/AI识别图例.png"></img>}
              {
                <div
                  id="measure"
                  style={{
                    visibility: currentTool === "测量" ? "visible" : "hidden",
                    height: currentTool === "测量" ? "auto" : "0",
                  }}
                ></div>
              }
              {currentTool === "定位" && (
                <div>
                  <Form
                    name="basic"
                    labelCol={{
                      span: 8,
                    }}
                    wrapperCol={{
                      span: 16,
                    }}
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={onMapLocate}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="经度"
                      name="lng"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="纬度"
                      name="lat"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      wrapperCol={{
                        offset: 8,
                        span: 16,
                      }}
                    >
                      <Button type="primary" htmlType="submit">
                        定位
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          if (_layer) {
                            _layer.clearLayers();
                          }
                        }}
                        style={{ marginLeft: 10 }}
                      >
                        清空
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              )}
              {currentTool === "历史影像" && (
                <div>
                  <span style={{ marginLeft: 20 }}>影像时间：</span>
                  <Select
                    value={selectHistory}
                    placeholder="请选择"
                    onChange={onChangeSelectImg}
                    style={{
                      width: 150,
                    }}
                  >
                    {histories.map((item, id) => (
                      <Select.Option key={id + "first"} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                  {isHistoryLock ? (
                    <Tooltip title="锁定模式下只查看选中日期的影像">
                      <LockOutlined
                        style={{ width: 30, cursor: "pointer", color: "red" }}
                        onClick={() => {
                          setIsHistoryLock(false);
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="非锁定模式自动查看区域最新影像">
                      <UnlockOutlined
                        style={{ width: 30, cursor: "pointer", color: "green" }}
                        onClick={() => {
                          setIsHistoryLock(true);
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
              )}
            </Card>
          </div>
        }
      </div>
    </div>
  );
}
