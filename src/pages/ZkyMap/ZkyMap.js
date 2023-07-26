const version = "1.0.0";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./hook/index"; //钩子函数，地图初始化时自动设置参数
import * as Map from "./map/index";
import * as Control from "./control/index";
import * as Util from "./util/index";

const ZkyMap = {
  version,
  ...Map,
  ...Control,
  ...Util,
};
export default ZkyMap;
