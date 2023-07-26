import React, { PureComponent } from "react";
import { connect } from "dva";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

export default connect(({}) => ({}))(Sparse);
function Sparse({ hide }) {
  return (
    <div
      style={{
        backgroundColor: "rgba(0,0,0,.3)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1052,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          overflow: "auto",
        }}
      >
        <Button
          type="primary"
          shape="circle"
          icon={<CloseOutlined />}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            fontSize: 30,
          }}
          onClick={() => {
            hide();
          }}
        />
        <iframe
          title="抽稀"
          height="595px"
          width="1000px"
          src="./mapshaper/index.html"
        />
      </div>
    </div>
  );
}
