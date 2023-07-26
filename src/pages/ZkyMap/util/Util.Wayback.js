import jquery from "jquery";

//请求ArcGIS的Wayback历史影像，并将影像列表存至全局状态map中

const $ = jquery;

export function getWaybackItems(args) {
  const { dispatch } = args;
  const waybackUrl = `https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json`;
  //查询影像列表
  $.ajax({
    url: waybackUrl,
    dataType: "json",
    success: function (data) {
      // 在成功获取JSON数据后进行处理
      // console.log(JSON.stringify(data, null, 2));
      let waybackItems = [];
      const keysArray = Object.keys(data);
      for (let i = 0; i < keysArray.length; i++) {
        let id = keysArray[i];
        let item = {
          id: id,
          label: data[id].itemTitle,
          value: data[id].itemURL,
          ...data[id],
        };
        waybackItems.push(item);
      }

      // 提取并转换日期
      const dateRegex = /\d{4}-\d{2}-\d{2}/;
      waybackItems.forEach((item) => {
        const dateStr = item.label.match(dateRegex)[0];
        const [year, month, day] = dateStr.split("-");
        item.date = new Date(year, month - 1, day);
        item.label = item.date.toISOString().split("T")[0];
        item.value = item.value.replace(
          /\{level\}\/\{row\}\/\{col\}/g,
          "{z}/{y}/{x}",
        );
      });

      // 按日期从新到旧排序
      waybackItems.sort((a, b) => b.date - a.date);

      if (waybackItems.length === 0) {
        return;
      }

      dispatch({
        type: "map/save",
        payload: {
          waybackItems: waybackItems,
        },
      });
    },
    error: function (error) {
      // 处理错误情况
      console.log("发生错误:", error);
    },
  });
}
