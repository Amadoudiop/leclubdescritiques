"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (t, e) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.Vue2Autocomplete = e() : t.Vue2Autocomplete = e();
}(undefined, function () {
  return function (t) {
    function e(n) {
      if (s[n]) return s[n].exports;var o = s[n] = { exports: {}, id: n, loaded: !1 };return t[n].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports;
    }var s = {};return e.m = t, e.c = s, e.p = "../dist/", e(0);
  }([function (t, e, s) {
    "use strict";
    function n(t) {
      return t && t.__esModule ? t : { default: t };
    }var o = s(2),
        i = n(o);t.exports = i.default;
  }, function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), /*! Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
                                                           * Licensed Under MIT (http://opensource.org/licenses/MIT)
                                                           *
                                                           * Vue 2 Autocomplete @ Version 0.0.1
                                                           *
                                                           */
    e.default = { props: { id: String, className: String, placeholder: String, initValue: { type: String, default: "" }, anchor: { type: String, required: !0 }, label: String, url: { type: String, required: !0 }, param: { type: String, default: "q" }, customParams: Object, min: { type: Number, default: 0 }, onInput: Function, onShow: Function, onBlur: Function, onHide: Function, onFocus: Function, onSelect: Function, onBeforeAjax: Function, onAjaxProgress: Function, onAjaxLoaded: Function }, data: function data() {
        return { showList: !1, type: "", json: [], focusList: "" };
      }, methods: { clearInput: function clearInput() {
          this.showList = !1, this.type = "", this.json = [], this.focusList = "";
        }, cleanUp: function cleanUp(t) {
          return JSON.parse(JSON.stringify(t));
        }, input: function input(t) {
          this.showList = !0, this.onInput ? this.onInput(t) : null, this.getData(t);
        }, showAll: function showAll() {
          this.json = [], this.getData(""), this.onShow ? this.onShow() : null, this.showList = !0;
        }, hideAll: function hideAll(t) {
          var e = this;this.onBlur ? this.onBlur(t) : null, setTimeout(function () {
            e.onHide ? e.onHide() : null, e.showList = !1;
          }, 250);
        }, focus: function focus(t) {
          this.focusList = 0, this.onFocus ? this.onFocus(t) : null;
        }, mousemove: function mousemove(t) {
          this.focusList = t;
        }, keydown: function keydown(t) {
          var e = t.keyCode;if (this.showList) {
            switch (e) {case 40:
                this.focusList++;break;case 38:
                this.focusList--;break;case 13:
                this.selectList(this.json[this.focusList]), this.showList = !1;break;case 27:
                this.showList = !1;}var s = this.json.length - 1;this.focusList = this.focusList > s ? 0 : this.focusList < 0 ? s : this.focusList;
          }
        }, activeClass: function activeClass(t) {
          return { "focus-list": t == this.focusList };
        }, selectList: function selectList(t) {
          var e = this.cleanUp(t);this.type = e[this.anchor], this.showList = !1, this.onSelect ? this.onSelect(e) : null;
        }, getData: function getData(t) {
          var e = this,
              s = this;if (!(t.length < this.min) && null != this.url) {
            this.onBeforeAjax ? this.onBeforeAjax(t) : null;var n = new XMLHttpRequest(),
                o = "";this.customParams && Object.keys(this.customParams).forEach(function (t) {
              o += "&" + t + "=" + e.customParams[t];
            }), n.open("GET", this.url + "?" + this.param + "=" + t + o, !0), n.send(), n.addEventListener("progress", function (t) {
              t.lengthComputable && (this.onAjaxProgress ? this.onAjaxProgress(t) : null);
            }), n.addEventListener("loadend", function (t) {
              var e = JSON.parse(this.responseText);this.onAjaxLoaded ? this.onAjaxLoaded(e) : null, s.json = e;
            });
          }
        }, setValue: function setValue(t) {
          this.type = t;
        } }, created: function created() {
        this.type = this.initValue ? this.initValue : null;
      } };
  }, function (t, e, s) {
    var n, o;n = s(1);var i = s(3);o = n = n || {}, "object" != _typeof(n.default) && "function" != typeof n.default || (o = n = n.default), "function" == typeof o && (o = o.options), o.render = i.render, o.staticRenderFns = i.staticRenderFns, t.exports = n;
  }, function (t, e) {
    t.exports = { render: function render() {
        var t = this,
            e = t.$createElement,
            s = t._self._c || e;return s("div", { class: (t.className ? t.className + "-wrapper " : "") + "autocomplete-wrapper" }, [s("input", { directives: [{ name: "model", rawName: "v-model", value: t.type, expression: "type" }], class: (t.className ? t.className + "-input " : "") + "autocomplete-input", attrs: { type: "text", id: t.id, placeholder: t.placeholder, autocomplete: "off" }, domProps: { value: t._s(t.type) }, on: { input: [function (e) {
              e.target.composing || (t.type = e.target.value);
            }, function (e) {
              t.input(t.type);
            }], dblclick: t.showAll, blur: t.hideAll, keydown: t.keydown, focus: t.focus } }), t._v(" "), s("div", { directives: [{ name: "show", rawName: "v-show", value: t.showList, expression: "showList" }], class: (t.className ? t.className + "-list " : "") + "autocomplete transition autocomplete-list" }, [s("ul", t._l(t.json, function (e, n) {
          return s("li", { class: t.activeClass(n), attrs: { transition: "showAll" } }, [s("a", { attrs: { href: "#" }, on: { click: function click(s) {
                s.preventDefault(), t.selectList(e);
              }, mousemove: function mousemove(e) {
                t.mousemove(n);
              } } }, [s("b", [t._v(t._s(e[t.anchor]))]), t._v(" "), s("span", [t._v(t._s(e[t.label]))])])]);
        }))])]);
      }, staticRenderFns: [] };
  }]);
});
//# sourceMappingURL=vue2-autocomplete.js.map