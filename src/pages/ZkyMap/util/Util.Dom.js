// DOM元素操作模块

/**
 * 从某个节点选择子节点元素
 * 
 * e.g.
 * 
 * const leftContainer = ZkyMap.selectOne(
        ".side-left-data",
        this._map._container,
      );
 *
 * @export
 * @param {*} selector
 * @param {*} el
 * @return {*} 
 */
export function selectOne(selector, el = document) {
  return el.querySelector(selector);
}

export function selectAll(selector, el = document) {
  return Array.from(el.querySelectorAll(selector));
}

export function hide(el) {
  if (el) {
    el.style.display = "none";
  }
  return el;
}

export function show(el) {
  if (el) {
    el.style.display = "";
  }
  return el;
}
