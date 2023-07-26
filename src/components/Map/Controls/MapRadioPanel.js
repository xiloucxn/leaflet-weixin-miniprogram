import React, { PureComponent } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jQuery from "jquery";
import { Radio, Space } from "antd";

var $ = jQuery;

export default class MapRadioPanel extends PureComponent {
  //1.constructor() -> 2.static getDerivedStateFromProps()
  // -> 3.render() -> 4.componentDidMount()
  //在这里初始化state
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = {
      counter: 0,
      options: [
        { label: "方案核查", value: "方案核查" },
        { label: "监督检查", value: "监督检查" },
        { label: "验收核查", value: "验收核查" },
        { label: "待办事项", value: "待办事项" },
      ],
    };
  }

  //会在组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应该放在这里。
  //如需通过网络请求获取数据，此处是实例化请求的好地方。
  componentDidMount() {
    this.props.link && this.props.link(this);
  }

  //组件从DOM移除时调用
  componentWillUnmount() {}

  instance = (map, options) => {
    console.log("Instance:", map, options);
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
        <Radio.Group
          onChange={(e) => {
            // setType(e.target.value);
            // map?.onChangeType({ year, type: e.target.value });
            this.props?.onChange(e.target.value);
          }}
          defaultValue="监督检查"
          optionType="button"
        >
          <Space direction="vertical">
            {this.state.options.map((item) => {
              return <Radio value={item.value}>{item.label}</Radio>;
            })}
          </Space>
        </Radio.Group>
      </div>
    );
  }
}
