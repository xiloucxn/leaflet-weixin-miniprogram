function dataURItoBlob(t) {
  for (
    var e = (0 <= t.split(",")[0].indexOf("base64") ? atob : unescape)(
        t.split(",")[1],
      ),
      t = t.split(",")[0].split(":")[1].split(";")[0],
      r = new Uint8Array(e.length),
      o = 0;
    o < e.length;
    o++
  )
    r[o] = e.charCodeAt(o);
  return new Blob([r], { type: t });
}
function canvasToBlobUrl(t) {
  t = dataURItoBlob(t.toDataURL("image/png"));
  return window.URL.createObjectURL(t);
}
function warpWebGl(t, h, f, d) {
  try {
    var m = fx.canvas(1500, 1500);
  } catch (t) {
    return void alert(t);
  }
  var g = document.getElementById(t),
    p = new Image();
  (p.onload = function () {
    for (
      var t = m.texture(p),
        e =
          (h[0],
          h[1],
          h[2],
          h[3],
          h[4],
          h[5],
          h[6],
          h[7],
          f[0],
          f[1],
          f[2],
          f[3],
          f[4],
          f[5],
          f[6],
          f[7],
          []),
        r = [],
        o = 0;
      o < h.length;
      o += 2
    )
      e.push(h[o]);
    for (o = 1; o < h.length; o += 2) r.push(h[o]);
    var i = Math.min.apply(null, r);
    (matrix1southmost = Math.max.apply(null, r)),
      (matrix1westmost = Math.min.apply(null, e)),
      (matrix1eastmost = Math.max.apply(null, e));
    for (var a = [], n = [], o = 0; o < f.length; o += 2) a.push(f[o]);
    for (o = 1; o < f.length; o += 2) n.push(f[o]);
    var l = Math.min.apply(null, n);
    (matrix2southmost = Math.max.apply(null, n)),
      (matrix2westmost = Math.min.apply(null, a)),
      (matrix2eastmost = Math.max.apply(null, a));
    var s = matrix2westmost - matrix1westmost,
      c = l - i;
    m.draw(t, p.width, p.height);
    for (
      var l = (matrix2southmost - l) / (matrix1southmost - i),
        i =
          (matrix2eastmost - matrix2westmost) /
          (matrix1eastmost - matrix1westmost),
        u = Math.max(i, l),
        o = 0;
      o < f.length;
      o += 2
    )
      (f[o] -= s), (f[o] /= u);
    for (o = 1; o < f.length; o += 2) (f[o] -= c), (f[o] /= u);
    m.perspective(h, f).update();
    l = canvasToBlobUrl(m);
    d ? window.open(l) : (g.src = l);
  }),
    (p.src = g.src);
}
!(function (t) {
  "use strict";
  (t.L.Toolbar2 = (L.Layer || L.Class).extend({
    statics: { baseClass: "leaflet-toolbar" },
    options: {
      className: "",
      filter: function () {
        return !0;
      },
      actions: [],
    },
    initialize: function (t) {
      L.setOptions(this, t),
        (this._toolbar_type = this.constructor._toolbar_class_id);
    },
    addTo: function (t) {
      return (
        (this._arguments = [].slice.call(arguments)), t.addLayer(this), this
      );
    },
    onAdd: function (t) {
      var e = t._toolbars[this._toolbar_type];
      0 === this._calculateDepth() &&
        (e && t.removeLayer(e), (t._toolbars[this._toolbar_type] = this));
    },
    onRemove: function (t) {
      0 === this._calculateDepth() && delete t._toolbars[this._toolbar_type];
    },
    appendToContainer: function (t) {
      var e,
        r,
        o,
        i,
        a =
          this.constructor.baseClass +
          "-" +
          this._calculateDepth() +
          " " +
          this.options.className;
      for (
        this._container = t,
          this._ul = L.DomUtil.create("ul", a, t),
          this._disabledEvents = [
            "click",
            "mousemove",
            "dblclick",
            "mousedown",
            "mouseup",
            "touchstart",
          ],
          r = 0,
          i = this._disabledEvents.length;
        r < i;
        r++
      )
        L.DomEvent.on(
          this._ul,
          this._disabledEvents[r],
          L.DomEvent.stopPropagation,
        );
      for (e = 0, o = this.options.actions.length; e < o; e++)
        new (this._getActionConstructor(this.options.actions[e]))()._createIcon(
          this,
          this._ul,
          this._arguments,
        );
    },
    _getActionConstructor: function (e) {
      var t = this._arguments,
        r = this;
      return e.extend({
        initialize: function () {
          e.prototype.initialize.apply(this, t);
        },
        enable: function (t) {
          r._active && r._active.disable(),
            (r._active = this),
            e.prototype.enable.call(this, t);
        },
      });
    },
    _hide: function () {
      this._ul.style.display = "none";
    },
    _show: function () {
      this._ul.style.display = "block";
    },
    _calculateDepth: function () {
      for (var t = 0, e = this.parentToolbar; e; )
        (t += 1), (e = e.parentToolbar);
      return t;
    },
  })),
    L.Evented || L.Toolbar2.include(L.Mixin.Events),
    (L.toolbar = {});
  var r = 0;
  (L.Toolbar2.extend = function (t) {
    var e = L.extend({}, t.statics, { _toolbar_class_id: r });
    return (r += 1), L.extend(t, { statics: e }), L.Class.extend.call(this, t);
  }),
    L.Map.addInitHook(function () {
      this._toolbars = {};
    }),
    (L.Toolbar2.Action = L.Handler.extend({
      statics: { baseClass: "leaflet-toolbar-icon" },
      options: {
        toolbarIcon: { html: "", className: "", tooltip: "" },
        subToolbar: new L.Toolbar2(),
      },
      initialize: function (t) {
        var e = L.Toolbar2.Action.prototype.options.toolbarIcon;
        L.setOptions(this, t),
          (this.options.toolbarIcon = L.extend(
            {},
            e,
            this.options.toolbarIcon,
          ));
      },
      enable: function (t) {
        t && L.DomEvent.preventDefault(t),
          this._enabled ||
            ((this._enabled = !0), this.addHooks && this.addHooks());
      },
      disable: function () {
        this._enabled &&
          ((this._enabled = !1), this.removeHooks && this.removeHooks());
      },
      _createIcon: function (t, e, r) {
        var o = this.options.toolbarIcon;
        (this.toolbar = t),
          (this._icon = L.DomUtil.create("li", "", e)),
          (this._link = L.DomUtil.create("a", "", this._icon)),
          (this._link.innerHTML = o.html),
          this._link.setAttribute("href", "#"),
          this._link.setAttribute("title", o.tooltip),
          L.DomUtil.addClass(this._link, this.constructor.baseClass),
          o.className && L.DomUtil.addClass(this._link, o.className),
          L.DomEvent.on(this._link, "click", this.enable, this),
          this._addSubToolbar(t, this._icon, r);
      },
      _addSubToolbar: function (t, e, r) {
        var o = this.options.subToolbar,
          i = this.addHooks,
          a = this.removeHooks;
        (o.parentToolbar = t),
          0 < o.options.actions.length &&
            ((r = [].slice.call(r)).push(this),
            o.addTo.apply(o, r),
            o.appendToContainer(e),
            (this.addHooks = function (t) {
              "function" == typeof i && i.call(this, t), o._show();
            }),
            (this.removeHooks = function (t) {
              "function" == typeof a && a.call(this, t), o._hide();
            }));
      },
    })),
    (L.toolbarAction = function (t) {
      return new L.Toolbar2.Action(t);
    }),
    (L.Toolbar2.Action.extendOptions = function (t) {
      return this.extend({ options: t });
    }),
    (L.Toolbar2.Control = L.Toolbar2.extend({
      statics: { baseClass: "leaflet-control-toolbar " + L.Toolbar2.baseClass },
      initialize: function (t) {
        L.Toolbar2.prototype.initialize.call(this, t),
          (this._control = new L.Control.Toolbar(this.options));
      },
      onAdd: function (t) {
        this._control.addTo(t),
          L.Toolbar2.prototype.onAdd.call(this, t),
          this.appendToContainer(this._control.getContainer());
      },
      onRemove: function (t) {
        L.Toolbar2.prototype.onRemove.call(this, t),
          this._control.remove
            ? this._control.remove()
            : this._control.removeFrom(t);
      },
    })),
    (L.Control.Toolbar = L.Control.extend({
      onAdd: function () {
        return L.DomUtil.create("div", "");
      },
    })),
    (L.toolbar.control = function (t) {
      return new L.Toolbar2.Control(t);
    }),
    (L.Toolbar2.Popup = L.Toolbar2.extend({
      statics: { baseClass: "leaflet-popup-toolbar " + L.Toolbar2.baseClass },
      options: { anchor: [0, 0] },
      initialize: function (t, e) {
        L.Toolbar2.prototype.initialize.call(this, e),
          (this._marker = new L.Marker(t, {
            icon: new L.DivIcon({
              className: this.options.className,
              iconAnchor: [0, 0],
            }),
          }));
      },
      onAdd: function (t) {
        (this._map = t),
          this._marker.addTo(t),
          L.Toolbar2.prototype.onAdd.call(this, t),
          this.appendToContainer(this._marker._icon),
          this._setStyles();
      },
      onRemove: function (t) {
        t.removeLayer(this._marker),
          L.Toolbar2.prototype.onRemove.call(this, t),
          delete this._map;
      },
      setLatLng: function (t) {
        return this._marker.setLatLng(t), this;
      },
      _setStyles: function () {
        for (
          var t,
            e,
            r = this._container,
            o = this._ul,
            i = L.point(this.options.anchor),
            a = o.querySelectorAll(".leaflet-toolbar-icon"),
            n = [],
            l = 0,
            s = 0,
            c = a.length;
          s < c;
          s++
        )
          a[s].parentNode.parentNode === o &&
            (n.push(parseInt(L.DomUtil.getStyle(a[s], "height"), 10)),
            (l += Math.ceil(parseFloat(L.DomUtil.getStyle(a[s], "width")))),
            (l += Math.ceil(
              parseFloat(L.DomUtil.getStyle(a[s], "border-right-width")),
            )));
        (o.style.width = l + "px"),
          (this._tipContainer = L.DomUtil.create(
            "div",
            "leaflet-toolbar-tip-container",
            r,
          )),
          (this._tipContainer.style.width =
            l +
            Math.ceil(parseFloat(L.DomUtil.getStyle(o, "border-left-width"))) +
            "px"),
          (this._tip = L.DomUtil.create(
            "div",
            "leaflet-toolbar-tip",
            this._tipContainer,
          )),
          (t = Math.max.apply(void 0, n)),
          (o.style.height = t + "px"),
          (e = parseInt(L.DomUtil.getStyle(this._tip, "width"), 10)),
          (e = new L.Point(l / 2, t + 1.414 * e)),
          (r.style.marginLeft = i.x - e.x + "px"),
          (r.style.marginTop = i.y - e.y + "px");
      },
    })),
    (L.toolbar.popup = function (t) {
      return new L.Toolbar2.Popup(t);
    });
})(window, document);
var fx = (function () {
  function n(t, e, r) {
    return Math.max(t, Math.min(e, r));
  }
  function e(t) {
    return {
      _: t,
      loadContentsOf: function (t) {
        (N = this._.gl), this._.loadContentsOf(t);
      },
      destroy: function () {
        (N = this._.gl), this._.destroy();
      },
    };
  }
  function r(t) {
    return e(k.fromElement(t));
  }
  function o(t, e, r) {
    return (
      (this._.isInitialized &&
        t._.width == this.width &&
        t._.height == this.height) ||
        function (t, e) {
          var r = N.UNSIGNED_BYTE;
          if (
            N.getExtension("OES_texture_float") &&
            N.getExtension("OES_texture_float_linear")
          ) {
            var o = new k(100, 100, N.RGBA, N.FLOAT);
            try {
              o.drawTo(function () {
                r = N.FLOAT;
              });
            } catch (t) {}
            o.destroy();
          }
          this._.texture && this._.texture.destroy(),
            this._.spareTexture && this._.spareTexture.destroy(),
            (this.width = t),
            (this.height = e),
            (this._.texture = new k(t, e, N.RGBA, r)),
            (this._.spareTexture = new k(t, e, N.RGBA, r)),
            (this._.extraTexture =
              this._.extraTexture || new k(0, 0, N.RGBA, r)),
            (this._.flippedShader =
              this._.flippedShader ||
              new O(
                null,
                "uniform sampler2D texture;varying vec2 texCoord;void main(){gl_FragColor=texture2D(texture,vec2(texCoord.x,1.0-texCoord.y));}",
              )),
            (this._.isInitialized = !0);
        }.call(this, e || t._.width, r || t._.height),
      t._.use(),
      this._.texture.drawTo(function () {
        O.getDefaultShader().drawRect();
      }),
      this
    );
  }
  function i() {
    return this._.texture.use(), this._.flippedShader.drawRect(), this;
  }
  function c(t, e, r, o) {
    (r || this._.texture).use(),
      this._.spareTexture.drawTo(function () {
        t.uniforms(e).drawRect();
      }),
      this._.spareTexture.swapWith(o || this._.texture);
  }
  function a(t) {
    return (
      t.parentNode.insertBefore(this, t), t.parentNode.removeChild(t), this
    );
  }
  function l() {
    var t = new k(
      this._.texture.width,
      this._.texture.height,
      N.RGBA,
      N.UNSIGNED_BYTE,
    );
    return (
      this._.texture.use(),
      t.drawTo(function () {
        O.getDefaultShader().drawRect();
      }),
      e(t)
    );
  }
  function s() {
    var t = this._.texture.width,
      e = this._.texture.height,
      r = new Uint8Array(4 * t * e);
    return (
      this._.texture.drawTo(function () {
        N.readPixels(0, 0, t, e, N.RGBA, N.UNSIGNED_BYTE, r);
      }),
      r
    );
  }
  function u(t) {
    return function () {
      return (N = this._.gl), t.apply(this, arguments);
    };
  }
  function h(t, e, r, o, i, a, n, l) {
    var s = r - i,
      c = o - a,
      u = n - i,
      h = l - a,
      f = s * h - u * c;
    return [
      r - t + (u = ((i = t - r + i - n) * h - u * (a = e - o + a - l)) / f) * r,
      o - e + u * o,
      u,
      n - t + (s = (s * a - i * c) / f) * n,
      l - e + s * l,
      s,
      t,
      e,
      1,
    ];
  }
  function f(t) {
    var e = t[0],
      r = t[1],
      o = t[2],
      i = t[3],
      a = t[4],
      n = t[5],
      l = t[6],
      s = t[7],
      c =
        e * a * (t = t[8]) -
        e * n * s -
        r * i * t +
        r * n * l +
        o * i * s -
        o * a * l;
    return [
      (a * t - n * s) / c,
      (o * s - r * t) / c,
      (r * n - o * a) / c,
      (n * l - i * t) / c,
      (e * t - o * l) / c,
      (o * i - e * n) / c,
      (i * s - a * l) / c,
      (r * l - e * s) / c,
      (e * a - r * i) / c,
    ];
  }
  function d(t) {
    var e = t.length;
    (this.xa = []),
      (this.ya = []),
      (this.u = []),
      (this.y2 = []),
      t.sort(function (t, e) {
        return t[0] - e[0];
      });
    for (var r = 0; r < e; r++) this.xa.push(t[r][0]), this.ya.push(t[r][1]);
    for (this.u[0] = 0, this.y2[0] = 0, r = 1; r < e - 1; ++r) {
      t = this.xa[r + 1] - this.xa[r - 1];
      var o = (this.xa[r] - this.xa[r - 1]) / t,
        i = o * this.y2[r - 1] + 2;
      (this.y2[r] = (o - 1) / i),
        (this.u[r] =
          ((6 *
            ((this.ya[r + 1] - this.ya[r]) / (this.xa[r + 1] - this.xa[r]) -
              (this.ya[r] - this.ya[r - 1]) / (this.xa[r] - this.xa[r - 1]))) /
            t -
            o * this.u[r - 1]) /
          i);
    }
    for (this.y2[e - 1] = 0, r = e - 2; 0 <= r; --r)
      this.y2[r] = this.y2[r] * this.y2[r + 1] + this.u[r];
  }
  function m(t, e) {
    return new O(
      null,
      t +
        "uniform sampler2D texture;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 coord=texCoord*texSize;" +
        e +
        "gl_FragColor=texture2D(texture,coord/texSize);vec2 clampedCoord=clamp(coord,vec2(0.0),texSize);if(coord!=clampedCoord){gl_FragColor.a*=max(0.0,1.0-length(coord-clampedCoord));}}",
    );
  }
  function g(t) {
    return (
      (N.noise =
        N.noise ||
        new O(
          null,
          "uniform sampler2D texture;uniform float amount;varying vec2 texCoord;float rand(vec2 co){return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);}void main(){vec4 color=texture2D(texture,texCoord);float diff=(rand(texCoord)-0.5)*amount;color.r+=diff;color.g+=diff;color.b+=diff;gl_FragColor=color;}",
        )),
      c.call(this, N.noise, { amount: n(0, t, 1) }),
      this
    );
  }
  function p(t) {
    return (
      (N.vibrance =
        N.vibrance ||
        new O(
          null,
          "uniform sampler2D texture;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float average=(color.r+color.g+color.b)/3.0;float mx=max(color.r,max(color.g,color.b));float amt=(mx-average)*(-amount*3.0);color.rgb=mix(color.rgb,vec3(mx),amt);gl_FragColor=color;}",
        )),
      c.call(this, N.vibrance, { amount: n(-1, t, 1) }),
      this
    );
  }
  function x(t, e) {
    return (
      (N.vignette =
        N.vignette ||
        new O(
          null,
          "uniform sampler2D texture;uniform float size;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float dist=distance(texCoord,vec2(0.5,0.5));color.rgb*=smoothstep(0.8,size*0.799,dist*(amount+size));gl_FragColor=color;}",
        )),
      c.call(this, N.vignette, { size: n(0, t, 1), amount: n(0, e, 1) }),
      this
    );
  }
  function v(t) {
    N.denoise =
      N.denoise ||
      new O(
        null,
        "uniform sampler2D texture;uniform float exponent;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;void main(){vec4 center=texture2D(texture,texCoord);vec4 color=vec4(0.0);float total=0.0;for(float x=-4.0;x<=4.0;x+=1.0){for(float y=-4.0;y<=4.0;y+=1.0){vec4 sample=texture2D(texture,texCoord+vec2(x,y)/texSize);float weight=1.0-abs(dot(sample.rgb-center.rgb,vec3(0.25)));weight=pow(weight,exponent);color+=sample*weight;total+=weight;}}gl_FragColor=color/total;}",
      );
    for (var e = 0; e < 2; e++)
      c.call(this, N.denoise, {
        exponent: Math.max(0, t),
        texSize: [this.width, this.height],
      });
    return this;
  }
  function b(t, e) {
    return (
      (N.brightnessContrast =
        N.brightnessContrast ||
        new O(
          null,
          "uniform sampler2D texture;uniform float brightness;uniform float contrast;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color.rgb+=brightness;if(contrast>0.0){color.rgb=(color.rgb-0.5)/(1.0-contrast)+0.5;}else{color.rgb=(color.rgb-0.5)*(1.0+contrast)+0.5;}gl_FragColor=color;}",
        )),
      c.call(this, N.brightnessContrast, {
        brightness: n(-1, t, 1),
        contrast: n(-1, e, 1),
      }),
      this
    );
  }
  function y(t) {
    t = new d(t);
    for (var e = [], r = 0; r < 256; r++)
      e.push(n(0, Math.floor(256 * t.interpolate(r / 255)), 255));
    return e;
  }
  function T(t, e, r) {
    (t = y(t)), 1 == arguments.length ? (e = r = t) : ((e = y(e)), (r = y(r)));
    for (var o = [], i = 0; i < 256; i++)
      o.splice(o.length, 0, t[i], e[i], r[i], 255);
    return (
      this._.extraTexture.initFromBytes(256, 1, o),
      this._.extraTexture.use(1),
      (N.curves =
        N.curves ||
        new O(
          null,
          "uniform sampler2D texture;uniform sampler2D map;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color.r=texture2D(map,vec2(color.r)).r;color.g=texture2D(map,vec2(color.g)).g;color.b=texture2D(map,vec2(color.b)).b;gl_FragColor=color;}",
        )),
      N.curves.textures({ map: 1 }),
      c.call(this, N.curves, {}),
      this
    );
  }
  function _(t, e) {
    return (
      (N.unsharpMask =
        N.unsharpMask ||
        new O(
          null,
          "uniform sampler2D blurredTexture;uniform sampler2D originalTexture;uniform float strength;uniform float threshold;varying vec2 texCoord;void main(){vec4 blurred=texture2D(blurredTexture,texCoord);vec4 original=texture2D(originalTexture,texCoord);gl_FragColor=mix(blurred,original,1.0+strength);}",
        )),
      this._.extraTexture.ensureFormat(this._.texture),
      this._.texture.use(),
      this._.extraTexture.drawTo(function () {
        O.getDefaultShader().drawRect();
      }),
      this._.extraTexture.use(1),
      this.triangleBlur(t),
      N.unsharpMask.textures({ originalTexture: 1 }),
      c.call(this, N.unsharpMask, { strength: e }),
      this._.extraTexture.unuse(1),
      this
    );
  }
  function w(t) {
    return (
      (N.sepia =
        N.sepia ||
        new O(
          null,
          "uniform sampler2D texture;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float r=color.r;float g=color.g;float b=color.b;color.r=min(1.0,(r*(1.0-(0.607*amount)))+(g*(0.769*amount))+(b*(0.189*amount)));color.g=min(1.0,(r*0.349*amount)+(g*(1.0-(0.314*amount)))+(b*0.168*amount));color.b=min(1.0,(r*0.272*amount)+(g*0.534*amount)+(b*(1.0-(0.869*amount))));gl_FragColor=color;}",
        )),
      c.call(this, N.sepia, { amount: n(0, t, 1) }),
      this
    );
  }
  function E(t, e) {
    return (
      (N.hueSaturation =
        N.hueSaturation ||
        new O(
          null,
          "uniform sampler2D texture;uniform float hue;uniform float saturation;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float angle=hue*3.14159265;float s=sin(angle),c=cos(angle);vec3 weights=(vec3(2.0*c,-sqrt(3.0)*s-c,sqrt(3.0)*s-c)+1.0)/3.0;float len=length(color.rgb);color.rgb=vec3(dot(color.rgb,weights.xyz),dot(color.rgb,weights.zxy),dot(color.rgb,weights.yzx));float average=(color.r+color.g+color.b)/3.0;if(saturation>0.0){color.rgb+=(average-color.rgb)*(1.0-1.0/(1.001-saturation));}else{color.rgb+=(average-color.rgb)*(-saturation);}gl_FragColor=color;}",
        )),
      c.call(this, N.hueSaturation, {
        hue: n(-1, t, 1),
        saturation: n(-1, e, 1),
      }),
      this
    );
  }
  function S(t, e, r) {
    return (
      (N.zoomBlur =
        N.zoomBlur ||
        new O(
          null,
          "uniform sampler2D texture;uniform vec2 center;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;" +
            X +
            "void main(){vec4 color=vec4(0.0);float total=0.0;vec2 toCenter=center-texCoord*texSize;float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=0.0;t<=40.0;t++){float percent=(t+offset)/40.0;float weight=4.0*(percent-percent*percent);vec4 sample=texture2D(texture,texCoord+toCenter*percent*strength/texSize);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}",
        )),
      c.call(this, N.zoomBlur, {
        center: [t, e],
        strength: r,
        texSize: [this.width, this.height],
      }),
      this
    );
  }
  function C(t, e, r, o, i, a) {
    N.tiltShift =
      N.tiltShift ||
      new O(
        null,
        "uniform sampler2D texture;uniform float blurRadius;uniform float gradientRadius;uniform vec2 start;uniform vec2 end;uniform vec2 delta;uniform vec2 texSize;varying vec2 texCoord;" +
          X +
          "void main(){vec4 color=vec4(0.0);float total=0.0;float offset=random(vec3(12.9898,78.233,151.7182),0.0);vec2 normal=normalize(vec2(start.y-end.y,end.x-start.x));float radius=smoothstep(0.0,1.0,abs(dot(texCoord*texSize-start,normal))/gradientRadius)*blurRadius;for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec4 sample=texture2D(texture,texCoord+delta/texSize*percent*radius);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}",
      );
    var n = r - t,
      l = o - e,
      s = Math.sqrt(n * n + l * l);
    return (
      c.call(this, N.tiltShift, {
        blurRadius: i,
        gradientRadius: a,
        start: [t, e],
        end: [r, o],
        delta: [n / s, l / s],
        texSize: [this.width, this.height],
      }),
      c.call(this, N.tiltShift, {
        blurRadius: i,
        gradientRadius: a,
        start: [t, e],
        end: [r, o],
        delta: [-l / s, n / s],
        texSize: [this.width, this.height],
      }),
      this
    );
  }
  function D(t, e, r) {
    N.lensBlurPrePass =
      N.lensBlurPrePass ||
      new O(
        null,
        "uniform sampler2D texture;uniform float power;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color=pow(color,vec4(power));gl_FragColor=vec4(color);}",
      );
    var o =
      "uniform sampler2D texture0;uniform sampler2D texture1;uniform vec2 delta0;uniform vec2 delta1;uniform float power;varying vec2 texCoord;" +
      X +
      "vec4 sample(vec2 delta){float offset=random(vec3(delta,151.7182),0.0);vec4 color=vec4(0.0);float total=0.0;for(float t=0.0;t<=30.0;t++){float percent=(t+offset)/30.0;color+=texture2D(texture0,texCoord+delta*percent);total+=1.0;}return color/total;}";
    (N.lensBlur0 =
      N.lensBlur0 ||
      new O(null, o + "void main(){gl_FragColor=sample(delta0);}")),
      (N.lensBlur1 =
        N.lensBlur1 ||
        new O(
          null,
          o + "void main(){gl_FragColor=(sample(delta0)+sample(delta1))*0.5;}",
        )),
      (N.lensBlur2 =
        N.lensBlur2 ||
        new O(
          null,
          o +
            "void main(){vec4 color=(sample(delta0)+2.0*texture2D(texture1,texCoord))/3.0;gl_FragColor=pow(color,vec4(power));}",
        ).textures({ texture1: 1 }));
    for (var o = [], i = 0; i < 3; i++) {
      var a = r + (2 * i * Math.PI) / 3;
      o.push([(t * Math.sin(a)) / this.width, (t * Math.cos(a)) / this.height]);
    }
    return (
      (t = Math.pow(10, n(-1, e, 1))),
      c.call(this, N.lensBlurPrePass, { power: t }),
      this._.extraTexture.ensureFormat(this._.texture),
      c.call(
        this,
        N.lensBlur0,
        { delta0: o[0] },
        this._.texture,
        this._.extraTexture,
      ),
      c.call(
        this,
        N.lensBlur1,
        { delta0: o[1], delta1: o[2] },
        this._.extraTexture,
        this._.extraTexture,
      ),
      c.call(this, N.lensBlur0, { delta0: o[1] }),
      this._.extraTexture.use(1),
      c.call(this, N.lensBlur2, { power: 1 / t, delta0: o[2] }),
      this
    );
  }
  function R(t) {
    return (
      (N.triangleBlur =
        N.triangleBlur ||
        new O(
          null,
          "uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;" +
            X +
            "void main(){vec4 color=vec4(0.0);float total=0.0;float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec4 sample=texture2D(texture,texCoord+delta*percent);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}",
        )),
      c.call(this, N.triangleBlur, { delta: [t / this.width, 0] }),
      c.call(this, N.triangleBlur, { delta: [0, t / this.height] }),
      this
    );
  }
  function F(t) {
    return (
      (N.edgeWork1 =
        N.edgeWork1 ||
        new O(
          null,
          "uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;" +
            X +
            "void main(){vec2 color=vec2(0.0);vec2 total=vec2(0.0);float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec3 sample=texture2D(texture,texCoord+delta*percent).rgb;float average=(sample.r+sample.g+sample.b)/3.0;color.x+=average*weight;total.x+=weight;if(abs(t)<15.0){weight=weight*2.0-1.0;color.y+=average*weight;total.y+=weight;}}gl_FragColor=vec4(color/total,0.0,1.0);}",
        )),
      (N.edgeWork2 =
        N.edgeWork2 ||
        new O(
          null,
          "uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;" +
            X +
            "void main(){vec2 color=vec2(0.0);vec2 total=vec2(0.0);float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec2 sample=texture2D(texture,texCoord+delta*percent).xy;color.x+=sample.x*weight;total.x+=weight;if(abs(t)<15.0){weight=weight*2.0-1.0;color.y+=sample.y*weight;total.y+=weight;}}float c=clamp(10000.0*(color.y/total.y-color.x/total.x)+0.5,0.0,1.0);gl_FragColor=vec4(c,c,c,1.0);}",
        )),
      c.call(this, N.edgeWork1, { delta: [t / this.width, 0] }),
      c.call(this, N.edgeWork2, { delta: [0, t / this.height] }),
      this
    );
  }
  function A(t, e, r) {
    return (
      (N.hexagonalPixelate =
        N.hexagonalPixelate ||
        new O(
          null,
          "uniform sampler2D texture;uniform vec2 center;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 tex=(texCoord*texSize-center)/scale;tex.y/=0.866025404;tex.x-=tex.y*0.5;vec2 a;if(tex.x+tex.y-floor(tex.x)-floor(tex.y)<1.0)a=vec2(floor(tex.x),floor(tex.y));else a=vec2(ceil(tex.x),ceil(tex.y));vec2 b=vec2(ceil(tex.x),floor(tex.y));vec2 c=vec2(floor(tex.x),ceil(tex.y));vec3 TEX=vec3(tex.x,tex.y,1.0-tex.x-tex.y);vec3 A=vec3(a.x,a.y,1.0-a.x-a.y);vec3 B=vec3(b.x,b.y,1.0-b.x-b.y);vec3 C=vec3(c.x,c.y,1.0-c.x-c.y);float alen=length(TEX-A);float blen=length(TEX-B);float clen=length(TEX-C);vec2 choice;if(alen<blen){if(alen<clen)choice=a;else choice=c;}else{if(blen<clen)choice=b;else choice=c;}choice.x+=choice.y*0.5;choice.y*=0.866025404;choice*=scale/texSize;gl_FragColor=texture2D(texture,choice+center/texSize);}",
        )),
      c.call(this, N.hexagonalPixelate, {
        center: [t, e],
        scale: r,
        texSize: [this.width, this.height],
      }),
      this
    );
  }
  function P(t, e, r, o) {
    return (
      (N.colorHalftone =
        N.colorHalftone ||
        new O(
          null,
          "uniform sampler2D texture;uniform vec2 center;uniform float angle;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;float pattern(float angle){float s=sin(angle),c=cos(angle);vec2 tex=texCoord*texSize-center;vec2 point=vec2(c*tex.x-s*tex.y,s*tex.x+c*tex.y)*scale;return(sin(point.x)*sin(point.y))*4.0;}void main(){vec4 color=texture2D(texture,texCoord);vec3 cmy=1.0-color.rgb;float k=min(cmy.x,min(cmy.y,cmy.z));cmy=(cmy-k)/(1.0-k);cmy=clamp(cmy*10.0-3.0+vec3(pattern(angle+0.26179),pattern(angle+1.30899),pattern(angle)),0.0,1.0);k=clamp(k*10.0-5.0+pattern(angle+0.78539),0.0,1.0);gl_FragColor=vec4(1.0-cmy-k,color.a);}",
        )),
      c.call(this, N.colorHalftone, {
        center: [t, e],
        angle: r,
        scale: Math.PI / o,
        texSize: [this.width, this.height],
      }),
      this
    );
  }
  function U(t) {
    return (
      (N.ink =
        N.ink ||
        new O(
          null,
          "uniform sampler2D texture;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 dx=vec2(1.0/texSize.x,0.0);vec2 dy=vec2(0.0,1.0/texSize.y);vec4 color=texture2D(texture,texCoord);float bigTotal=0.0;float smallTotal=0.0;vec3 bigAverage=vec3(0.0);vec3 smallAverage=vec3(0.0);for(float x=-2.0;x<=2.0;x+=1.0){for(float y=-2.0;y<=2.0;y+=1.0){vec3 sample=texture2D(texture,texCoord+dx*x+dy*y).rgb;bigAverage+=sample;bigTotal+=1.0;if(abs(x)+abs(y)<2.0){smallAverage+=sample;smallTotal+=1.0;}}}vec3 edge=max(vec3(0.0),bigAverage/bigTotal-smallAverage/smallTotal);gl_FragColor=vec4(color.rgb-dot(edge,edge)*strength*100000.0,color.a);}",
        )),
      c.call(this, N.ink, {
        strength: t * t * t * t * t,
        texSize: [this.width, this.height],
      }),
      this
    );
  }
  function L(t, e, r, o) {
    return (
      (N.dotScreen =
        N.dotScreen ||
        new O(
          null,
          "uniform sampler2D texture;uniform vec2 center;uniform float angle;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;float pattern(){float s=sin(angle),c=cos(angle);vec2 tex=texCoord*texSize-center;vec2 point=vec2(c*tex.x-s*tex.y,s*tex.x+c*tex.y)*scale;return(sin(point.x)*sin(point.y))*4.0;}void main(){vec4 color=texture2D(texture,texCoord);float average=(color.r+color.g+color.b)/3.0;gl_FragColor=vec4(vec3(average*10.0-5.0+pattern()),color.a);}",
        )),
      c.call(this, N.dotScreen, {
        center: [t, e],
        angle: r,
        scale: Math.PI / o,
        texSize: [this.width, this.height],
      }),
      this
    );
  }
  function I(t, e, r) {
    if (
      ((N.matrixWarp =
        N.matrixWarp ||
        m(
          "uniform mat3 matrix;uniform bool useTextureSpace;",
          "if(useTextureSpace)coord=coord/texSize*2.0-1.0;vec3 warp=matrix*vec3(coord,1.0);coord=warp.xy/warp.z;if(useTextureSpace)coord=(coord*0.5+0.5)*texSize;",
        )),
      4 == (t = Array.prototype.concat.apply([], t)).length)
    )
      t = [t[0], t[1], 0, t[2], t[3], 0, 0, 0, 1];
    else if (9 != t.length) throw "can only warp with 2x2 or 3x3 matrix";
    return (
      c.call(this, N.matrixWarp, {
        matrix: e ? f(t) : t,
        texSize: [this.width, this.height],
        useTextureSpace: 0 | r,
      }),
      this
    );
  }
  function B(t, e, r, o) {
    return (
      (N.swirl =
        N.swirl ||
        m(
          "uniform float radius;uniform float angle;uniform vec2 center;",
          "coord-=center;float distance=length(coord);if(distance<radius){float percent=(radius-distance)/radius;float theta=percent*percent*angle;float s=sin(theta);float c=cos(theta);coord=vec2(coord.x*c-coord.y*s,coord.x*s+coord.y*c);}coord+=center;",
        )),
      c.call(this, N.swirl, {
        radius: r,
        center: [t, e],
        angle: o,
        texSize: [this.width, this.height],
      }),
      this
    );
  }
  function G(t, e, r, o) {
    return (
      (N.bulgePinch =
        N.bulgePinch ||
        m(
          "uniform float radius;uniform float strength;uniform vec2 center;",
          "coord-=center;float distance=length(coord);if(distance<radius){float percent=distance/radius;if(strength>0.0){coord*=mix(1.0,smoothstep(0.0,radius/distance,percent),strength*0.75);}else{coord*=mix(1.0,pow(percent,1.0+strength*0.75)*radius/distance,1.0-percent);}}coord+=center;",
        )),
      c.call(this, N.bulgePinch, {
        radius: r,
        strength: n(-1, o, 1),
        center: [t, e],
        texSize: [this.width, this.height],
      }),
      this
    );
  }
  function M(t, e) {
    (e = h.apply(null, e)), (t = h.apply(null, t)), (e = f(e));
    return this.matrixWarp([
      e[0] * t[0] + e[1] * t[3] + e[2] * t[6],
      e[0] * t[1] + e[1] * t[4] + e[2] * t[7],
      e[0] * t[2] + e[1] * t[5] + e[2] * t[8],
      e[3] * t[0] + e[4] * t[3] + e[5] * t[6],
      e[3] * t[1] + e[4] * t[4] + e[5] * t[7],
      e[3] * t[2] + e[4] * t[5] + e[5] * t[8],
      e[6] * t[0] + e[7] * t[3] + e[8] * t[6],
      e[6] * t[1] + e[7] * t[4] + e[8] * t[7],
      e[6] * t[2] + e[7] * t[5] + e[8] * t[8],
    ]);
  }
  var N,
    t = {};
  !(function () {
    function e() {}
    try {
      var t = document.createElement("canvas").getContext("experimental-webgl");
    } catch (t) {}
    var r, o;
    t &&
      -1 === t.getSupportedExtensions().indexOf("OES_texture_float_linear") &&
      (function (t) {
        if (t.getExtension("OES_texture_float")) {
          var e = t.createFramebuffer(),
            r = t.createTexture();
          t.bindTexture(t.TEXTURE_2D, r),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE),
            t.texImage2D(
              t.TEXTURE_2D,
              0,
              t.RGBA,
              1,
              1,
              0,
              t.RGBA,
              t.UNSIGNED_BYTE,
              null,
            ),
            t.bindFramebuffer(t.FRAMEBUFFER, e),
            t.framebufferTexture2D(
              t.FRAMEBUFFER,
              t.COLOR_ATTACHMENT0,
              t.TEXTURE_2D,
              r,
              0,
            ),
            (e = t.createTexture()),
            t.bindTexture(t.TEXTURE_2D, e),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE),
            t.texImage2D(
              t.TEXTURE_2D,
              0,
              t.RGBA,
              2,
              2,
              0,
              t.RGBA,
              t.FLOAT,
              new Float32Array([
                2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ]),
            );
          var r = t.createProgram(),
            o = t.createShader(t.VERTEX_SHADER),
            i = t.createShader(t.FRAGMENT_SHADER);
          return (
            t.shaderSource(
              o,
              "attribute vec2 vertex;void main(){gl_Position=vec4(vertex,0.0,1.0);}",
            ),
            t.shaderSource(
              i,
              "uniform sampler2D texture;void main(){gl_FragColor=texture2D(texture,vec2(0.5));}",
            ),
            t.compileShader(o),
            t.compileShader(i),
            t.attachShader(r, o),
            t.attachShader(r, i),
            t.linkProgram(r),
            (o = t.createBuffer()),
            t.bindBuffer(t.ARRAY_BUFFER, o),
            t.bufferData(
              t.ARRAY_BUFFER,
              new Float32Array([0, 0]),
              t.STREAM_DRAW,
            ),
            t.enableVertexAttribArray(0),
            t.vertexAttribPointer(0, 2, t.FLOAT, !1, 0, 0),
            (o = new Uint8Array(4)),
            t.useProgram(r),
            t.viewport(0, 0, 1, 1),
            t.bindTexture(t.TEXTURE_2D, e),
            t.drawArrays(t.POINTS, 0, 1),
            t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, o),
            127 === o[0] || 128 === o[0]
          );
        }
      })(t) &&
      ((r = WebGLRenderingContext.prototype.getExtension),
      (o = WebGLRenderingContext.prototype.getSupportedExtensions),
      (WebGLRenderingContext.prototype.getExtension = function (t) {
        return (t =
          "OES_texture_float_linear" === t
            ? (void 0 === this.$OES_texture_float_linear$ &&
                Object.defineProperty(this, "$OES_texture_float_linear$", {
                  enumerable: !1,
                  configurable: !1,
                  writable: !1,
                  value: new e(),
                }),
              this.$OES_texture_float_linear$)
            : r.call(this, t));
      }),
      (WebGLRenderingContext.prototype.getSupportedExtensions = function () {
        var t = o.call(this);
        return (
          -1 === t.indexOf("OES_texture_float_linear") &&
            t.push("OES_texture_float_linear"),
          t
        );
      }));
  })(),
    (t.canvas = function () {
      var t = document.createElement("canvas");
      try {
        N = t.getContext("experimental-webgl", { premultipliedAlpha: !1 });
      } catch (t) {
        N = null;
      }
      if (!N) throw "This browser does not support WebGL";
      return (
        (t._ = {
          gl: N,
          isInitialized: !1,
          texture: null,
          spareTexture: null,
          flippedShader: null,
        }),
        (t.texture = u(r)),
        (t.draw = u(o)),
        (t.update = u(i)),
        (t.replace = u(a)),
        (t.contents = u(l)),
        (t.getPixelArray = u(s)),
        (t.brightnessContrast = u(b)),
        (t.hexagonalPixelate = u(A)),
        (t.hueSaturation = u(E)),
        (t.colorHalftone = u(P)),
        (t.triangleBlur = u(R)),
        (t.unsharpMask = u(_)),
        (t.perspective = u(M)),
        (t.matrixWarp = u(I)),
        (t.bulgePinch = u(G)),
        (t.tiltShift = u(C)),
        (t.dotScreen = u(L)),
        (t.edgeWork = u(F)),
        (t.lensBlur = u(D)),
        (t.zoomBlur = u(S)),
        (t.noise = u(g)),
        (t.denoise = u(v)),
        (t.curves = u(T)),
        (t.swirl = u(B)),
        (t.ink = u(U)),
        (t.vignette = u(x)),
        (t.vibrance = u(p)),
        (t.sepia = u(w)),
        t
      );
    }),
    (t.splineInterpolate = y);
  var k = (function () {
    function r(t, e, r, o) {
      (this.gl = N),
        (this.id = N.createTexture()),
        (this.width = t),
        (this.height = e),
        (this.format = r),
        (this.type = o),
        N.bindTexture(N.TEXTURE_2D, this.id),
        N.texParameteri(N.TEXTURE_2D, N.TEXTURE_MAG_FILTER, N.LINEAR),
        N.texParameteri(N.TEXTURE_2D, N.TEXTURE_MIN_FILTER, N.LINEAR),
        N.texParameteri(N.TEXTURE_2D, N.TEXTURE_WRAP_S, N.CLAMP_TO_EDGE),
        N.texParameteri(N.TEXTURE_2D, N.TEXTURE_WRAP_T, N.CLAMP_TO_EDGE),
        t &&
          e &&
          N.texImage2D(
            N.TEXTURE_2D,
            0,
            this.format,
            t,
            e,
            0,
            this.format,
            this.type,
            null,
          );
    }
    function n(t) {
      return (
        null == l && (l = document.createElement("canvas")),
        (l.width = t.width),
        (l.height = t.height),
        (t = l.getContext("2d")).clearRect(0, 0, l.width, l.height),
        t
      );
    }
    (r.fromElement = function (t) {
      var e = new r(0, 0, N.RGBA, N.UNSIGNED_BYTE);
      return e.loadContentsOf(t), e;
    }),
      (r.prototype.loadContentsOf = function (t) {
        (this.width = t.width || t.videoWidth),
          (this.height = t.height || t.videoHeight),
          N.bindTexture(N.TEXTURE_2D, this.id),
          N.texImage2D(N.TEXTURE_2D, 0, this.format, this.format, this.type, t);
      }),
      (r.prototype.initFromBytes = function (t, e, r) {
        (this.width = t),
          (this.height = e),
          (this.format = N.RGBA),
          (this.type = N.UNSIGNED_BYTE),
          N.bindTexture(N.TEXTURE_2D, this.id),
          N.texImage2D(
            N.TEXTURE_2D,
            0,
            N.RGBA,
            t,
            e,
            0,
            N.RGBA,
            this.type,
            new Uint8Array(r),
          );
      }),
      (r.prototype.destroy = function () {
        N.deleteTexture(this.id), (this.id = null);
      }),
      (r.prototype.use = function (t) {
        N.activeTexture(N.TEXTURE0 + (t || 0)),
          N.bindTexture(N.TEXTURE_2D, this.id);
      }),
      (r.prototype.unuse = function (t) {
        N.activeTexture(N.TEXTURE0 + (t || 0)),
          N.bindTexture(N.TEXTURE_2D, null);
      }),
      (r.prototype.ensureFormat = function (t, e, r, o) {
        var i;
        1 == arguments.length &&
          ((t = (i = arguments[0]).width),
          (e = i.height),
          (r = i.format),
          (o = i.type)),
          (t == this.width &&
            e == this.height &&
            r == this.format &&
            o == this.type) ||
            ((this.width = t),
            (this.height = e),
            (this.format = r),
            (this.type = o),
            N.bindTexture(N.TEXTURE_2D, this.id),
            N.texImage2D(
              N.TEXTURE_2D,
              0,
              this.format,
              t,
              e,
              0,
              this.format,
              this.type,
              null,
            ));
      }),
      (r.prototype.drawTo = function (t) {
        if (
          ((N.framebuffer = N.framebuffer || N.createFramebuffer()),
          N.bindFramebuffer(N.FRAMEBUFFER, N.framebuffer),
          N.framebufferTexture2D(
            N.FRAMEBUFFER,
            N.COLOR_ATTACHMENT0,
            N.TEXTURE_2D,
            this.id,
            0,
          ),
          N.checkFramebufferStatus(N.FRAMEBUFFER) !== N.FRAMEBUFFER_COMPLETE)
        )
          throw Error("incomplete framebuffer");
        N.viewport(0, 0, this.width, this.height),
          t(),
          N.bindFramebuffer(N.FRAMEBUFFER, null);
      });
    var l = null;
    return (
      (r.prototype.fillUsingCanvas = function (t) {
        return (
          t(n(this)),
          (this.format = N.RGBA),
          (this.type = N.UNSIGNED_BYTE),
          N.bindTexture(N.TEXTURE_2D, this.id),
          N.texImage2D(N.TEXTURE_2D, 0, N.RGBA, N.RGBA, N.UNSIGNED_BYTE, l),
          this
        );
      }),
      (r.prototype.toImage = function (t) {
        this.use(), O.getDefaultShader().drawRect();
        var e = 4 * this.width * this.height,
          r = new Uint8Array(e),
          o = n(this),
          i = o.createImageData(this.width, this.height);
        N.readPixels(0, 0, this.width, this.height, N.RGBA, N.UNSIGNED_BYTE, r);
        for (var a = 0; a < e; a++) i.data[a] = r[a];
        o.putImageData(i, 0, 0), (t.src = l.toDataURL());
      }),
      (r.prototype.swapWith = function (t) {
        var e = t.id;
        (t.id = this.id),
          (this.id = e),
          (e = t.width),
          (t.width = this.width),
          (this.width = e),
          (e = t.height),
          (t.height = this.height),
          (this.height = e),
          (e = t.format),
          (t.format = this.format),
          (this.format = e);
      }),
      r
    );
  })();
  d.prototype.interpolate = function (t) {
    for (var e = 0, r = this.ya.length - 1; 1 < r - e; ) {
      var o = (r + e) >> 1;
      this.xa[o] > t ? (r = o) : (e = o);
    }
    var o = this.xa[r] - this.xa[e],
      i = (this.xa[r] - t) / o;
    return (
      (t = (t - this.xa[e]) / o),
      i * this.ya[e] +
        t * this.ya[r] +
        (((i * i * i - i) * this.y2[e] + (t * t * t - t) * this.y2[r]) *
          o *
          o) /
          6
    );
  };
  var O =
      ((W.prototype.destroy = function () {
        N.deleteProgram(this.program), (this.program = null);
      }),
      (W.prototype.uniforms = function (t) {
        for (var e in (N.useProgram(this.program), t))
          if (t.hasOwnProperty(e)) {
            var r = N.getUniformLocation(this.program, e);
            if (null !== r) {
              var o = t[e];
              if ("[object Array]" == Object.prototype.toString.call(o))
                switch (o.length) {
                  case 1:
                    N.uniform1fv(r, new Float32Array(o));
                    break;
                  case 2:
                    N.uniform2fv(r, new Float32Array(o));
                    break;
                  case 3:
                    N.uniform3fv(r, new Float32Array(o));
                    break;
                  case 4:
                    N.uniform4fv(r, new Float32Array(o));
                    break;
                  case 9:
                    N.uniformMatrix3fv(r, !1, new Float32Array(o));
                    break;
                  case 16:
                    N.uniformMatrix4fv(r, !1, new Float32Array(o));
                    break;
                  default:
                    throw (
                      "dont't know how to load uniform \"" +
                      e +
                      '" of length ' +
                      o.length
                    );
                }
              else {
                if ("[object Number]" != Object.prototype.toString.call(o))
                  throw (
                    'attempted to set uniform "' +
                    e +
                    '" to invalid value ' +
                    (o || "undefined").toString()
                  );
                N.uniform1f(r, o);
              }
            }
          }
        return this;
      }),
      (W.prototype.textures = function (t) {
        for (var e in (N.useProgram(this.program), t))
          t.hasOwnProperty(e) &&
            N.uniform1i(N.getUniformLocation(this.program, e), t[e]);
        return this;
      }),
      (W.prototype.drawRect = function (t, e, r, o) {
        var i = N.getParameter(N.VIEWPORT);
        (e = void 0 !== e ? (e - i[1]) / i[3] : 0),
          (t = void 0 !== t ? (t - i[0]) / i[2] : 0),
          (r = void 0 !== r ? (r - i[0]) / i[2] : 1),
          (o = void 0 !== o ? (o - i[1]) / i[3] : 1),
          null == N.vertexBuffer && (N.vertexBuffer = N.createBuffer()),
          N.bindBuffer(N.ARRAY_BUFFER, N.vertexBuffer),
          N.bufferData(
            N.ARRAY_BUFFER,
            new Float32Array([t, e, t, o, r, e, r, o]),
            N.STATIC_DRAW,
          ),
          null == N.texCoordBuffer &&
            ((N.texCoordBuffer = N.createBuffer()),
            N.bindBuffer(N.ARRAY_BUFFER, N.texCoordBuffer),
            N.bufferData(
              N.ARRAY_BUFFER,
              new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
              N.STATIC_DRAW,
            )),
          null == this.vertexAttribute &&
            ((this.vertexAttribute = N.getAttribLocation(
              this.program,
              "vertex",
            )),
            N.enableVertexAttribArray(this.vertexAttribute)),
          null == this.texCoordAttribute &&
            ((this.texCoordAttribute = N.getAttribLocation(
              this.program,
              "_texCoord",
            )),
            N.enableVertexAttribArray(this.texCoordAttribute)),
          N.useProgram(this.program),
          N.bindBuffer(N.ARRAY_BUFFER, N.vertexBuffer),
          N.vertexAttribPointer(this.vertexAttribute, 2, N.FLOAT, !1, 0, 0),
          N.bindBuffer(N.ARRAY_BUFFER, N.texCoordBuffer),
          N.vertexAttribPointer(this.texCoordAttribute, 2, N.FLOAT, !1, 0, 0),
          N.drawArrays(N.TRIANGLE_STRIP, 0, 4);
      }),
      (W.getDefaultShader = function () {
        return (N.defaultShader = N.defaultShader || new W()), N.defaultShader;
      }),
      W),
    X =
      "float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}";
  function z(t, e) {
    t = N.createShader(t);
    if (
      (N.shaderSource(t, e),
      N.compileShader(t),
      !N.getShaderParameter(t, N.COMPILE_STATUS))
    )
      throw "compile error: " + N.getShaderInfoLog(t);
    return t;
  }
  function W(t, e) {
    if (
      ((this.texCoordAttribute = this.vertexAttribute = null),
      (this.program = N.createProgram()),
      (t =
        t ||
        "attribute vec2 vertex;attribute vec2 _texCoord;varying vec2 texCoord;void main(){texCoord=_texCoord;gl_Position=vec4(vertex*2.0-1.0,0.0,1.0);}"),
      (e =
        "precision highp float;" +
        (e =
          e ||
          "uniform sampler2D texture;varying vec2 texCoord;void main(){gl_FragColor=texture2D(texture,texCoord);}")),
      N.attachShader(this.program, z(N.VERTEX_SHADER, t)),
      N.attachShader(this.program, z(N.FRAGMENT_SHADER, e)),
      N.linkProgram(this.program),
      !N.getProgramParameter(this.program, N.LINK_STATUS))
    )
      throw "link error: " + N.getProgramInfoLog(this.program);
  }
  return t;
})();
"object" == typeof module ? (module.exports = fx) : (window.fx = fx),
  function () {
    var u = !1,
      s = function (t) {
        return t instanceof s
          ? t
          : this instanceof s
          ? void (this.EXIFwrapped = t)
          : new s(t);
      };
    "undefined" != typeof exports
      ? ("undefined" != typeof module &&
          module.exports &&
          (exports = module.exports = s),
        (exports.EXIF = s))
      : (this.EXIF = s);
    var c = (s.Tags = {
        36864: "ExifVersion",
        40960: "FlashpixVersion",
        40961: "ColorSpace",
        40962: "PixelXDimension",
        40963: "PixelYDimension",
        37121: "ComponentsConfiguration",
        37122: "CompressedBitsPerPixel",
        37500: "MakerNote",
        37510: "UserComment",
        40964: "RelatedSoundFile",
        36867: "DateTimeOriginal",
        36868: "DateTimeDigitized",
        37520: "SubsecTime",
        37521: "SubsecTimeOriginal",
        37522: "SubsecTimeDigitized",
        33434: "ExposureTime",
        33437: "FNumber",
        34850: "ExposureProgram",
        34852: "SpectralSensitivity",
        34855: "ISOSpeedRatings",
        34856: "OECF",
        37377: "ShutterSpeedValue",
        37378: "ApertureValue",
        37379: "BrightnessValue",
        37380: "ExposureBias",
        37381: "MaxApertureValue",
        37382: "SubjectDistance",
        37383: "MeteringMode",
        37384: "LightSource",
        37385: "Flash",
        37396: "SubjectArea",
        37386: "FocalLength",
        41483: "FlashEnergy",
        41484: "SpatialFrequencyResponse",
        41486: "FocalPlaneXResolution",
        41487: "FocalPlaneYResolution",
        41488: "FocalPlaneResolutionUnit",
        41492: "SubjectLocation",
        41493: "ExposureIndex",
        41495: "SensingMethod",
        41728: "FileSource",
        41729: "SceneType",
        41730: "CFAPattern",
        41985: "CustomRendered",
        41986: "ExposureMode",
        41987: "WhiteBalance",
        41988: "DigitalZoomRation",
        41989: "FocalLengthIn35mmFilm",
        41990: "SceneCaptureType",
        41991: "GainControl",
        41992: "Contrast",
        41993: "Saturation",
        41994: "Sharpness",
        41995: "DeviceSettingDescription",
        41996: "SubjectDistanceRange",
        40965: "InteroperabilityIFDPointer",
        42016: "ImageUniqueID",
      }),
      h = (s.TiffTags = {
        256: "ImageWidth",
        257: "ImageHeight",
        34665: "ExifIFDPointer",
        34853: "GPSInfoIFDPointer",
        40965: "InteroperabilityIFDPointer",
        258: "BitsPerSample",
        259: "Compression",
        262: "PhotometricInterpretation",
        274: "Orientation",
        277: "SamplesPerPixel",
        284: "PlanarConfiguration",
        530: "YCbCrSubSampling",
        531: "YCbCrPositioning",
        282: "XResolution",
        283: "YResolution",
        296: "ResolutionUnit",
        273: "StripOffsets",
        278: "RowsPerStrip",
        279: "StripByteCounts",
        513: "JPEGInterchangeFormat",
        514: "JPEGInterchangeFormatLength",
        301: "TransferFunction",
        318: "WhitePoint",
        319: "PrimaryChromaticities",
        529: "YCbCrCoefficients",
        532: "ReferenceBlackWhite",
        306: "DateTime",
        270: "ImageDescription",
        271: "Make",
        272: "Model",
        305: "Software",
        315: "Artist",
        33432: "Copyright",
      }),
      f = (s.GPSTags = {
        0: "GPSVersionID",
        1: "GPSLatitudeRef",
        2: "GPSLatitude",
        3: "GPSLongitudeRef",
        4: "GPSLongitude",
        5: "GPSAltitudeRef",
        6: "GPSAltitude",
        7: "GPSTimeStamp",
        8: "GPSSatellites",
        9: "GPSStatus",
        10: "GPSMeasureMode",
        11: "GPSDOP",
        12: "GPSSpeedRef",
        13: "GPSSpeed",
        14: "GPSTrackRef",
        15: "GPSTrack",
        16: "GPSImgDirectionRef",
        17: "GPSImgDirection",
        18: "GPSMapDatum",
        19: "GPSDestLatitudeRef",
        20: "GPSDestLatitude",
        21: "GPSDestLongitudeRef",
        22: "GPSDestLongitude",
        23: "GPSDestBearingRef",
        24: "GPSDestBearing",
        25: "GPSDestDistanceRef",
        26: "GPSDestDistance",
        27: "GPSProcessingMethod",
        28: "GPSAreaInformation",
        29: "GPSDateStamp",
        30: "GPSDifferential",
      }),
      d = (s.IFD1Tags = {
        256: "ImageWidth",
        257: "ImageHeight",
        258: "BitsPerSample",
        259: "Compression",
        262: "PhotometricInterpretation",
        273: "StripOffsets",
        274: "Orientation",
        277: "SamplesPerPixel",
        278: "RowsPerStrip",
        279: "StripByteCounts",
        282: "XResolution",
        283: "YResolution",
        284: "PlanarConfiguration",
        296: "ResolutionUnit",
        513: "JpegIFOffset",
        514: "JpegIFByteCount",
        529: "YCbCrCoefficients",
        530: "YCbCrSubSampling",
        531: "YCbCrPositioning",
        532: "ReferenceBlackWhite",
      }),
      m = (s.StringValues = {
        ExposureProgram: {
          0: "Not defined",
          1: "Manual",
          2: "Normal program",
          3: "Aperture priority",
          4: "Shutter priority",
          5: "Creative program",
          6: "Action program",
          7: "Portrait mode",
          8: "Landscape mode",
        },
        MeteringMode: {
          0: "Unknown",
          1: "Average",
          2: "CenterWeightedAverage",
          3: "Spot",
          4: "MultiSpot",
          5: "Pattern",
          6: "Partial",
          255: "Other",
        },
        LightSource: {
          0: "Unknown",
          1: "Daylight",
          2: "Fluorescent",
          3: "Tungsten (incandescent light)",
          4: "Flash",
          9: "Fine weather",
          10: "Cloudy weather",
          11: "Shade",
          12: "Daylight fluorescent (D 5700 - 7100K)",
          13: "Day white fluorescent (N 4600 - 5400K)",
          14: "Cool white fluorescent (W 3900 - 4500K)",
          15: "White fluorescent (WW 3200 - 3700K)",
          17: "Standard light A",
          18: "Standard light B",
          19: "Standard light C",
          20: "D55",
          21: "D65",
          22: "D75",
          23: "D50",
          24: "ISO studio tungsten",
          255: "Other",
        },
        Flash: {
          0: "Flash did not fire",
          1: "Flash fired",
          5: "Strobe return light not detected",
          7: "Strobe return light detected",
          9: "Flash fired, compulsory flash mode",
          13: "Flash fired, compulsory flash mode, return light not detected",
          15: "Flash fired, compulsory flash mode, return light detected",
          16: "Flash did not fire, compulsory flash mode",
          24: "Flash did not fire, auto mode",
          25: "Flash fired, auto mode",
          29: "Flash fired, auto mode, return light not detected",
          31: "Flash fired, auto mode, return light detected",
          32: "No flash function",
          65: "Flash fired, red-eye reduction mode",
          69: "Flash fired, red-eye reduction mode, return light not detected",
          71: "Flash fired, red-eye reduction mode, return light detected",
          73: "Flash fired, compulsory flash mode, red-eye reduction mode",
          77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
          79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
          89: "Flash fired, auto mode, red-eye reduction mode",
          93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
          95: "Flash fired, auto mode, return light detected, red-eye reduction mode",
        },
        SensingMethod: {
          1: "Not defined",
          2: "One-chip color area sensor",
          3: "Two-chip color area sensor",
          4: "Three-chip color area sensor",
          5: "Color sequential area sensor",
          7: "Trilinear sensor",
          8: "Color sequential linear sensor",
        },
        SceneCaptureType: {
          0: "Standard",
          1: "Landscape",
          2: "Portrait",
          3: "Night scene",
        },
        SceneType: { 1: "Directly photographed" },
        CustomRendered: { 0: "Normal process", 1: "Custom process" },
        WhiteBalance: { 0: "Auto white balance", 1: "Manual white balance" },
        GainControl: {
          0: "None",
          1: "Low gain up",
          2: "High gain up",
          3: "Low gain down",
          4: "High gain down",
        },
        Contrast: { 0: "Normal", 1: "Soft", 2: "Hard" },
        Saturation: { 0: "Normal", 1: "Low saturation", 2: "High saturation" },
        Sharpness: { 0: "Normal", 1: "Soft", 2: "Hard" },
        SubjectDistanceRange: {
          0: "Unknown",
          1: "Macro",
          2: "Close view",
          3: "Distant view",
        },
        FileSource: { 3: "DSC" },
        Components: { 0: "", 1: "Y", 2: "Cb", 3: "Cr", 4: "R", 5: "G", 6: "B" },
      });
    function i(t) {
      return t.exifdata;
    }
    function r(r, o) {
      function e(t) {
        var e = g(t);
        r.exifdata = e || {};
        e = (function (t) {
          var e = new DataView(t);
          u && console.log("Got file of length " + t.byteLength);
          if (255 != e.getUint8(0) || 216 != e.getUint8(1))
            return u && console.log("Not a valid JPEG"), !1;
          var r = 2,
            o = t.byteLength;
          for (; r < o; ) {
            if (
              (function (t, e) {
                return (
                  56 === t.getUint8(e) &&
                  66 === t.getUint8(e + 1) &&
                  73 === t.getUint8(e + 2) &&
                  77 === t.getUint8(e + 3) &&
                  4 === t.getUint8(e + 4) &&
                  4 === t.getUint8(e + 5)
                );
              })(e, r)
            ) {
              var i = e.getUint8(r + 7);
              i % 2 != 0 && (i += 1), 0 === i && (i = 4);
              var a = r + 8 + i,
                i = e.getUint16(r + 6 + i);
              return (function (t, e, r) {
                var o,
                  i,
                  a,
                  n = new DataView(t),
                  l = {},
                  s = e;
                for (; s < e + r; )
                  28 === n.getUint8(s) &&
                    2 === n.getUint8(s + 1) &&
                    (a = n.getUint8(s + 2)) in p &&
                    ((i = n.getInt16(s + 3)),
                    (o = p[a]),
                    (i = v(n, s + 5, i)),
                    l.hasOwnProperty(o)
                      ? l[o] instanceof Array
                        ? l[o].push(i)
                        : (l[o] = [l[o], i])
                      : (l[o] = i)),
                    s++;
                return l;
              })(t, a, i);
            }
            r++;
          }
        })(t);
        (r.iptcdata = e || {}),
          s.isXmpEnabled &&
            ((t = (function (t) {
              if (!("DOMParser" in self)) return;
              var e = new DataView(t);
              u && console.log("Got file of length " + t.byteLength);
              if (255 != e.getUint8(0) || 216 != e.getUint8(1))
                return u && console.log("Not a valid JPEG"), !1;
              var r = 2,
                o = t.byteLength,
                i = new DOMParser();
              for (; r < o - 4; ) {
                if ("http" == v(e, r, 4)) {
                  var a = r - 1,
                    n = e.getUint16(r - 2) - 1,
                    a = v(e, a, n),
                    n = a.indexOf("xmpmeta>") + 8,
                    n =
                      (a = a.substring(a.indexOf("<x:xmpmeta"), n)).indexOf(
                        "x:xmpmeta",
                      ) + 10;
                  return (
                    (a =
                      a.slice(0, n) +
                      'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tiff="http://ns.adobe.com/tiff/1.0/" xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" xmlns:exif="http://ns.adobe.com/exif/1.0/" xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" ' +
                      a.slice(n)),
                    (function (t) {
                      try {
                        var e = {};
                        if (0 < t.children.length)
                          for (var r = 0; r < t.children.length; r++) {
                            var o,
                              i = t.children.item(r),
                              a = i.attributes;
                            for (o in a) {
                              var n = a[o],
                                l = n.nodeName,
                                n = n.nodeValue;
                              void 0 !== l && (e[l] = n);
                            }
                            var s,
                              c = i.nodeName;
                            void 0 === e[c]
                              ? (e[c] = b(i))
                              : (void 0 === e[c].push &&
                                  ((s = e[c]), (e[c] = []), e[c].push(s)),
                                e[c].push(b(i)));
                          }
                        else e = t.textContent;
                        return e;
                      } catch (t) {
                        console.log(t.message);
                      }
                    })(i.parseFromString(a, "text/xml"))
                  );
                }
                r++;
              }
            })(t)),
            (r.xmpdata = t || {})),
          o && o.call(r);
      }
      var t, i, a, n, l;
      r.src
        ? /^data\:/i.test(r.src)
          ? e(
              (function (t, e) {
                (e = e || t.match(/^data\:([^\;]+)\;base64,/im)[1] || ""),
                  (t = t.replace(/^data\:([^\;]+)\;base64,/gim, ""));
                for (
                  var r = atob(t),
                    o = r.length,
                    t = new ArrayBuffer(o),
                    i = new Uint8Array(t),
                    a = 0;
                  a < o;
                  a++
                )
                  i[a] = r.charCodeAt(a);
                return t;
              })(r.src),
            )
          : /^blob\:/i.test(r.src)
          ? (((i = new FileReader()).onload = function (t) {
              e(t.target.result);
            }),
            (a = r.src),
            (n = function (t) {
              i.readAsArrayBuffer(t);
            }),
            (l = new XMLHttpRequest()).open("GET", a, !0),
            (l.responseType = "blob"),
            (l.onload = function (t) {
              (200 != this.status && 0 !== this.status) || n(this.response);
            }),
            l.send())
          : (((t = new XMLHttpRequest()).onload = function () {
              if (200 != this.status && 0 !== this.status)
                throw "Could not load image";
              e(t.response), (t = null);
            }),
            t.open("GET", r.src, !0),
            (t.responseType = "arraybuffer"),
            t.send(null))
        : self.FileReader &&
          (r instanceof self.Blob || r instanceof self.File) &&
          (((i = new FileReader()).onload = function (t) {
            u &&
              console.log("Got file of length " + t.target.result.byteLength),
              e(t.target.result);
          }),
          i.readAsArrayBuffer(r));
    }
    function g(t) {
      var e = new DataView(t);
      if (
        (u && console.log("Got file of length " + t.byteLength),
        255 != e.getUint8(0) || 216 != e.getUint8(1))
      )
        return u && console.log("Not a valid JPEG"), !1;
      for (var r, o = 2, i = t.byteLength; o < i; ) {
        if (255 != e.getUint8(o))
          return (
            u &&
              console.log(
                "Not a valid marker at offset " +
                  o +
                  ", found: " +
                  e.getUint8(o),
              ),
            !1
          );
        if (((r = e.getUint8(o + 1)), u && console.log(r), 225 == r))
          return (
            u && console.log("Found 0xFFE1 marker"),
            (function (t, e) {
              if ("Exif" != v(t, e, 4))
                return (
                  u && console.log("Not valid EXIF data! " + v(t, e, 4)), !1
                );
              var r,
                o,
                i,
                a,
                n,
                l = e + 6;
              if (18761 == t.getUint16(l)) r = !1;
              else {
                if (19789 != t.getUint16(l))
                  return (
                    u &&
                      console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),
                    !1
                  );
                r = !0;
              }
              if (42 != t.getUint16(l + 2, !r))
                return u && console.log("Not valid TIFF data! (no 0x002A)"), !1;
              e = t.getUint32(l + 4, !r);
              if (e < 8)
                return (
                  u &&
                    console.log(
                      "Not valid TIFF data! (First offset less than 8)",
                      t.getUint32(l + 4, !r),
                    ),
                  !1
                );
              if ((o = x(t, l, l + e, h, r)).ExifIFDPointer)
                for (i in (a = x(t, l, l + o.ExifIFDPointer, c, r))) {
                  switch (i) {
                    case "LightSource":
                    case "Flash":
                    case "MeteringMode":
                    case "ExposureProgram":
                    case "SensingMethod":
                    case "SceneCaptureType":
                    case "SceneType":
                    case "CustomRendered":
                    case "WhiteBalance":
                    case "GainControl":
                    case "Contrast":
                    case "Saturation":
                    case "Sharpness":
                    case "SubjectDistanceRange":
                    case "FileSource":
                      a[i] = m[i][a[i]];
                      break;
                    case "ExifVersion":
                    case "FlashpixVersion":
                      a[i] = String.fromCharCode(
                        a[i][0],
                        a[i][1],
                        a[i][2],
                        a[i][3],
                      );
                      break;
                    case "ComponentsConfiguration":
                      a[i] =
                        m.Components[a[i][0]] +
                        m.Components[a[i][1]] +
                        m.Components[a[i][2]] +
                        m.Components[a[i][3]];
                  }
                  o[i] = a[i];
                }
              if (o.GPSInfoIFDPointer)
                for (i in (n = x(t, l, l + o.GPSInfoIFDPointer, f, r)))
                  "GPSVersionID" === i &&
                    (n[i] =
                      n[i][0] + "." + n[i][1] + "." + n[i][2] + "." + n[i][3]),
                    (o[i] = n[i]);
              return (
                (o.thumbnail = (function (t, e, r, o) {
                  r = (function (t, e, r) {
                    var o = t.getUint16(e, !r);
                    return t.getUint32(e + 2 + 12 * o, !r);
                  })(t, e + r, o);
                  {
                    if (!r) return {};
                    if (r > t.byteLength) return {};
                  }
                  r = x(t, e, e + r, d, o);
                  if (r.Compression)
                    switch (r.Compression) {
                      case 6:
                        r.JpegIFOffset &&
                          r.JpegIFByteCount &&
                          ((o = e + r.JpegIFOffset),
                          (e = r.JpegIFByteCount),
                          (r.blob = new Blob([new Uint8Array(t.buffer, o, e)], {
                            type: "image/jpeg",
                          })));
                        break;
                      case 1:
                        console.log(
                          "Thumbnail image format is TIFF, which is not implemented.",
                        );
                        break;
                      default:
                        console.log(
                          "Unknown thumbnail image format '%s'",
                          r.Compression,
                        );
                    }
                  else
                    2 == r.PhotometricInterpretation &&
                      console.log(
                        "Thumbnail image format is RGB, which is not implemented.",
                      );
                  return r;
                })(t, l, e, r)),
                o
              );
            })(e, o + 4, e.getUint16(o + 2))
          );
        o += 2 + e.getUint16(o + 2);
      }
    }
    var p = {
      120: "caption",
      110: "credit",
      25: "keywords",
      55: "dateCreated",
      80: "byline",
      85: "bylineTitle",
      122: "captionWriter",
      105: "headline",
      116: "copyright",
      15: "category",
    };
    function x(t, e, r, o, i) {
      for (var a, n, l = t.getUint16(r, !i), s = {}, c = 0; c < l; c++)
        (a = r + 12 * c + 2),
          !(n = o[t.getUint16(a, !i)]) &&
            u &&
            console.log("Unknown tag: " + t.getUint16(a, !i)),
          (s[n] = (function (t, e, r, o) {
            var i,
              a,
              n,
              l,
              s,
              c = t.getUint16(e + 2, !o),
              u = t.getUint32(e + 4, !o),
              h = t.getUint32(e + 8, !o) + r;
            switch (c) {
              case 1:
              case 7:
                if (1 == u) return t.getUint8(e + 8, !o);
                for (i = 4 < u ? h : e + 8, a = [], n = 0; n < u; n++)
                  a[n] = t.getUint8(i + n);
                return a;
              case 2:
                return v(t, (i = 4 < u ? h : e + 8), u - 1);
              case 3:
                if (1 == u) return t.getUint16(e + 8, !o);
                for (i = 2 < u ? h : e + 8, a = [], n = 0; n < u; n++)
                  a[n] = t.getUint16(i + 2 * n, !o);
                return a;
              case 4:
                if (1 == u) return t.getUint32(e + 8, !o);
                for (a = [], n = 0; n < u; n++)
                  a[n] = t.getUint32(h + 4 * n, !o);
                return a;
              case 5:
                if (1 == u)
                  return (
                    (l = t.getUint32(h, !o)),
                    (s = t.getUint32(h + 4, !o)),
                    ((c = new Number(l / s)).numerator = l),
                    (c.denominator = s),
                    c
                  );
                for (a = [], n = 0; n < u; n++)
                  (l = t.getUint32(h + 8 * n, !o)),
                    (s = t.getUint32(h + 4 + 8 * n, !o)),
                    (a[n] = new Number(l / s)),
                    (a[n].numerator = l),
                    (a[n].denominator = s);
                return a;
              case 9:
                if (1 == u) return t.getInt32(e + 8, !o);
                for (a = [], n = 0; n < u; n++)
                  a[n] = t.getInt32(h + 4 * n, !o);
                return a;
              case 10:
                if (1 == u) return t.getInt32(h, !o) / t.getInt32(h + 4, !o);
                for (a = [], n = 0; n < u; n++)
                  a[n] =
                    t.getInt32(h + 8 * n, !o) / t.getInt32(h + 4 + 8 * n, !o);
                return a;
            }
          })(t, a, e, i));
      return s;
    }
    function v(t, e, r) {
      var o = "";
      for (n = e; n < e + r; n++) o += String.fromCharCode(t.getUint8(n));
      return o;
    }
    function b(t) {
      var e = {};
      if (1 == t.nodeType) {
        if (0 < t.attributes.length) {
          e["@attributes"] = {};
          for (var r = 0; r < t.attributes.length; r++) {
            var o = t.attributes.item(r);
            e["@attributes"][o.nodeName] = o.nodeValue;
          }
        }
      } else if (3 == t.nodeType) return t.nodeValue;
      if (t.hasChildNodes())
        for (var i = 0; i < t.childNodes.length; i++) {
          var a,
            n = t.childNodes.item(i),
            l = n.nodeName;
          null == e[l]
            ? (e[l] = b(n))
            : (null == e[l].push && ((a = e[l]), (e[l] = []), e[l].push(a)),
              e[l].push(b(n)));
        }
      return e;
    }
    (s.enableXmp = function () {
      s.isXmpEnabled = !0;
    }),
      (s.disableXmp = function () {
        s.isXmpEnabled = !1;
      }),
      (s.getData = function (t, e) {
        return (
          !(
            ((self.Image && t instanceof self.Image) ||
              (self.HTMLImageElement && t instanceof self.HTMLImageElement)) &&
            !t.complete
          ) && (i(t) ? e && e.call(t) : r(t, e), !0)
        );
      }),
      (s.getTag = function (t, e) {
        if (i(t)) return t.exifdata[e];
      }),
      (s.getIptcTag = function (t, e) {
        if (i(t)) return t.iptcdata[e];
      }),
      (s.getAllTags = function (t) {
        if (!i(t)) return {};
        var e,
          r = t.exifdata,
          o = {};
        for (e in r) r.hasOwnProperty(e) && (o[e] = r[e]);
        return o;
      }),
      (s.getAllIptcTags = function (t) {
        if (!i(t)) return {};
        var e,
          r = t.iptcdata,
          o = {};
        for (e in r) r.hasOwnProperty(e) && (o[e] = r[e]);
        return o;
      }),
      (s.pretty = function (t) {
        if (!i(t)) return "";
        var e,
          r = t.exifdata,
          o = "";
        for (e in r)
          r.hasOwnProperty(e) &&
            ("object" == typeof r[e]
              ? r[e] instanceof Number
                ? (o +=
                    e +
                    " : " +
                    r[e] +
                    " [" +
                    r[e].numerator +
                    "/" +
                    r[e].denominator +
                    "]\r\n")
                : (o += e + " : [" + r[e].length + " values]\r\n")
              : (o += e + " : " + r[e] + "\r\n"));
        return o;
      }),
      (s.readFromBinaryFile = g),
      "function" == typeof define &&
        define.amd &&
        define("exif-js", [], function () {
          return s;
        });
  }.call(this);