// 1.单个矢量瓦片图层点查事件

// //绑定点击事件

// if (fullcode) {
//     projectLayer.on("click", (e) => {
//       if (_map._handlePM) {
//         //正在编辑图形时，不触发点击事件
//         return;
//       }
//       console.log("点击projectLayer", e);
//       const { id } = e.layer.properties;

//       const payload = { tableNames: ["ProjectScope"], id };
//       //根据id查询详情
//       dispatch({
//         type: "map/pierce",
//         payload: payload,
//         callback: (success, result) => {
//           if (result.length === 0) {
//             return;
//           }
//           const item = result[0];
//           const feature = ZkyMap.objToFeature(item);
//           //只取第一个查到的结果弹窗
//           const { id, projectId, projectName } = item;

//           //弹窗内容
//           const popupContent = _map.createProjectScopePopupContent({
//             feature,
//             projectName,
//             projectId,
//           });
//           _map.createHighlight(feature).addTo(_map);
//           _map.openPopup(popupContent, e.latlng);
//           L.DomEvent.stopPropagation(e);
//         },
//       });
//     });
//     spotLayer.on("click", (e) => {
//       if (_map._handlePM) {
//         //正在编辑图形时，不触发点击事件
//         return;
//       }
//       console.log("点击spotLayer", e);
//       const { id } = e.layer.properties;
//       const payload = { tableNames: ["Spot"], id };
//       //根据id查询详情
//       dispatch({
//         type: "map/pierce",
//         payload: payload,
//         callback: (success, result) => {
//           if (result.length === 0) {
//             return;
//           }
//           const item = result[0];
//           const feature = ZkyMap.objToFeature(item);
//           //只取第一个查到的结果弹窗
//           const {
//             id: spotId,
//             mapNum,
//             reviewPlanName,
//             reviewPlanId,
//             interferenceComplianceValue,
//             projectId,
//             projectName,
//           } = item;

//           //弹窗内容
//           const popupContent = _map.createSpotPopupContent({
//             feature,
//             mapNum,
//             reviewPlanName,
//             projectName,
//             interferenceComplianceValue,
//             spotId,
//             projectId,
//           });
//           _map.createHighlight(feature).addTo(_map);
//           _map.openPopup(popupContent, e.latlng);
//           L.DomEvent.stopPropagation(e);
//         },
//       });
//     });
//     FZFQLayer.on("click", (e) => {
//       if (_map._handlePM) {
//         //正在编辑图形时，不触发点击事件
//         return;
//       }
//       console.log("点击FZFQLayer", e);
//       const { id, name, project_id, project_name } = e.layer.properties;
//       const payload = { tableNames: ["ProjectPrevenZone"], id };
//       //根据id查询详情
//       dispatch({
//         type: "map/pierce",
//         payload: payload,
//         callback: (success, result) => {
//           if (result.length === 0) {
//             return;
//           }
//           const item = result[0];
//           const feature = ZkyMap.objToFeature(item);
//           //只取第一个查到的结果弹窗
//           const { id, description, projectId, projectName } = item;

//           const popupContent = _map.createProjectPrevenZonePopupContent({
//             feature,
//             projectName,
//             description,
//             projectId,
//           });
//           _map.createHighlight(feature).addTo(_map);
//           _map.openPopup(popupContent, e.latlng);
//           L.DomEvent.stopPropagation(e);
//         },
//       });
//     });
//     QTQZLayer.on("click", (e) => {
//       if (_map._handlePM) {
//         //正在编辑图形时，不触发点击事件
//         return;
//       }
//       console.log("点击QTQZLayer", e);
//       const { id } = e.layer.properties;

//       const payload = { tableNames: ["ProjectFocus"], id };
//       //根据id查询详情
//       dispatch({
//         type: "map/pierce",
//         payload: payload,
//         callback: (success, result) => {
//           if (result.length === 0) {
//             return;
//           }
//           const item = result[0];
//           const feature = ZkyMap.objToFeature(item);
//           //只取第一个查到的结果弹窗
//           const {
//             id,
//             name,
//             maxHeight,
//             designScope,
//             volume,
//             projectId,
//             projectName,
//           } = item;

//           const popupContent = _map.createProjectFocusPopupContent({
//             feature,
//             projectName,
//             projectId,
//             maxHeight,
//             designScope,
//             volume,
//           });

//           _map.createHighlight(feature).addTo(_map);
//           _map.openPopup(popupContent, e.latlng);
//           L.DomEvent.stopPropagation(e);
//         },
//       });
//     });
//   }
