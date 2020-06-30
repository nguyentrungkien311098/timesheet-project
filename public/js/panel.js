(function (g, n, t, m) {
  var a;
  var o = "smartPanel";

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }

  function r(t, e) {
    this.obj = g(t);
    this.o = g.extend({}, g.fn[o].defaults, e);
    this.objId = this.obj.attr("id");
    this.panel = this.obj.find(this.o.panels);
    this.storage = {
      enabled: this.o.localStorage,
    };
    this.initialized = !1;
    this.init();
  }
  a =
    "ontouchstart" in n || (n.DocumentTouch && t instanceof DocumentTouch)
      ? "click tap"
      : "click";

  r.prototype = {
    _runPanelLoader: function (t) {
      !0 === this.o.localStorage &&
        t
          .closest(this.o.panels)
          .find(".panel-saving")
          .stop(!0, !0)
          .fadeIn(100)
          .delay(600)
          .fadeOut(100);
    },
    _loadKeys: function () {
      var t = this.o.pageKey || location.pathname;
      (this.storage.keySettings =
        "smartPanel_settings_" + t + "_" + this.objId),
        (this.storage.keyPosition =
          "smartPanel_position_" + t + "_" + this.objId);
    },
    _savePanelSettings: function () {
      var t = this.storage;
      this._loadKeys();
      var e = this.obj
          .find(this.o.panels)
          .map(function () {
            var t = {};
            return (
              (t.id = g(this).attr("id")),
              (t.style = g(this).attr("data-panel-attstyle")),
              (t.locked = g(this).hasClass("panel-locked") ? 1 : 0),
              (t.collapsed = g(this).hasClass("panel-collapsed") ? 1 : 0),
              t
            );
          })
          .get(),
        n = {
          panel: e,
        };
      if (t.enabled && t.getKeySettings != n) {
        var admin = JSON.parse(localStorage.getItem("admin") || "{}");
        if (!admin.panel) admin.panel = {};
        admin.panel[t.keySettings] = n;
        localStorage.setItem("admin", JSON.stringify(admin));
        t.getKeySettings = n;
        if ("function" == typeof this.o.onSave) {
          this.o.onSave.call(this, null, n, t.keySettings);
          myapp_config.debugState &&
            console.log("keySettings: " + t.keySettings);
        }
      }

      // t.enabled &&
      //   t.getKeySettings != n &&(
      //   (localStorage.setItem(t.keySettings, n)), (t.getKeySettings = n)),
      //   "function" == typeof this.o.onSave &&
      //     (this.o.onSave.call(this, null, n, t.keySettings),
      //     myapp_config.debugState &&
      //       console.log("keySettings: " + t.keySettings));
    },
    _savePanelPosition: function () {
      var t = this,
        e = t.storage;
      t._loadKeys();
      var n = t.obj
          .find(t.o.grid + ".sortable-grid")
          .map(function () {
            return {
              section: g(this)
                .children(t.o.panels)
                .map(function () {
                  return {
                    id: g(this).attr("id"),
                  };
                })
                .get(),
            };
          })
          .get(),
        i = {
          grid: n,
        };
      if (e.enabled && e.getKeyPosition != i) {
        var admin = JSON.parse(localStorage.getItem("admin") || "{}");
        if (!admin.panel) admin.panel = {};
        admin.panel[e.keyPosition] = i;
        localStorage.setItem("admin", JSON.stringify(admin));
        e.getKeyPosition = i;
        if ("function" == typeof this.o.onSave) {
          t.o.onSave.call(this, i, e.getKeyPosition);
          myapp_config.debugState &&
            console.log("keyPosition: " + e.keyPosition);
        }
      }
    },
    init: function () {
      var p = this;
      if (!p.initialized) {
        if (
          (p._initStorage(p.storage),
          //   g("#" + p.objId).length ||
          //     ("undefined" != typeof bootbox
          //       ? bootbox.alert("Your panel ID is missing!")
          //       : alert("Your panel ID is missing!")),
          g(p.o.grid).each(function () {
            var gid = guid();
            var panel = g(this).attr("gid", gid).find(p.o.panels).toArray();
            if (panel.length) {
              {
                panel.forEach((item, index) => {
                  $(item).data("gid", gid);
                  $(item).data("index", index);
                });
              }
              g(this).addClass("sortable-grid");
            }
          }),
          p.storage.enabled && p.storage.getKeyPosition)
        ) {
          var t = p.storage.getKeyPosition;
          p.panel.data("position", p.storage.keyPosition);
          for (var e in t.grid) {
            var n = p.obj.find(p.o.grid + ".sortable-grid").eq(e);
            for (var i in t.grid[e].section)
              n.append(g("#" + t.grid[e].section[i].id));
          }
        }
        if (p.storage.enabled && p.storage.getKeySettings) {
          var o = p.storage.getKeySettings;
          for (var e in (myapp_config.debugState &&
            console.log("Panel settings loaded: " + p.storage.getKeySettings),
          o.panel)) {
            var r = g("#" + o.panel[e].id);
            o.panel[e].style &&
              r
                .attr("data-panel-attstyle", "" + o.panel[e].style)
                .children(".panel-hdr")
                .removeClassPrefix("bg-")
                .addClass(o.panel[e].style),
              1 == o.panel[e].collapsed &&
                r
                  .addClass("panel-collapsed")
                  .children(".panel-container")
                  .addClass("collapse")
                  .removeClass("show"),
              1 == o.panel[e].locked && r.addClass("panel-locked");
          }
        }
        if (p.o.panelColors && p.o.colorButton) {
          var d = [];
          for (var e in p.o.panelColors)
            d.push(
              '<a href="#" class="btn d-inline-block ' +
                p.o.panelColors[e] +
                ' width-2 height-2 p-0 rounded-0 js-panel-color hover-effect-dot" data-panel-setstyle="' +
                p.o.panelColors[e] +
                '" style="margin:1px;"></a>'
            );
        }
        if (
          (p.panel.each(function () {
            var t,
              e,
              n,
              i,
              o,
              r,
              s,
              a,
              l = g(this),
              c = g(this).children(".panel-hdr"),
              u = g(this).children(".panel-container");
            if (!c.parent().attr("role")) {
              !0 === p.o.sortable &&
                l.data("panel-sortable") === m &&
                l.addClass("panel-sortable"),
                (t =
                  !0 === p.o.closeButton && l.data("panel-close") === m
                    ? '<a href="#" class="btn btn-panel hover-effect-dot js-panel-close" data-toggle="tooltip" data-offset="0,10" data-original-title="Xóa"></a>'
                    : ""),
                (e =
                  !0 === p.o.fullscreenButton &&
                  l.data("panel-fullscreen") === m
                    ? '<a href="#" class="btn btn-panel hover-effect-dot js-panel-fullscreen" data-toggle="tooltip" data-offset="0,10" data-original-title="Toàn màn hình"></a>'
                    : ""),
                (n =
                  !0 === p.o.collapseButton && l.data("panel-collapsed") === m
                    ? '<a href="#" class="btn btn-panel hover-effect-dot js-panel-collapse" data-toggle="tooltip" data-offset="0,10" data-original-title="Thu nhỏ / Mở rộng"></a>'
                    : ""),
                (i =
                  !0 === p.o.lockedButton && l.data("panel-locked") === m
                    ? '<a href="#" class="dropdown-item js-panel-locked"><span data-i18n="drpdwn.lockpanel">' +
                      p.o.lockedButtonLabel +
                      "</span></a>"
                    : ""),
                !0 === p.o.refreshButton && l.data("panel-refresh") === m
                  ? ((o =
                      '<a href="#" class="dropdown-item js-panel-refresh"><span data-i18n="drpdwn.refreshpanel">' +
                      p.o.refreshButtonLabel +
                      "</span></a>"),
                    u.prepend(
                      '<div class="loader"><i class="fal fa-spinner-third fa-spin-4x fs-xxl"></i></div>'
                    ))
                  : (o = ""),
                (r =
                  !0 === p.o.colorButton && l.data("panel-color") === m
                    ? ' <div class="dropdown-multilevel dropdown-multilevel-left">\t\t\t\t\t\t\t\t\t\t\t<div class="dropdown-item">\t\t\t\t\t\t\t\t\t\t\t\t<span data-i18n="drpdwn.panelcolor">' +
                      p.o.colorButtonLabel +
                      '</span>\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t<div class="dropdown-menu d-flex flex-wrap" style="min-width: 9.5rem; width: 9.5rem; padding: 0.5rem">' +
                      d.join(" ") +
                      "</div>\t\t\t\t\t\t\t\t\t\t</div>"
                    : ""),
                (s =
                  !0 === p.o.resetButton && l.data("panel-reset") === m
                    ? '<div class="dropdown-divider m-0"></div><a href="#" class="dropdown-item js-panel-reset"><span data-i18n="drpdwn.resetpanel">' +
                      p.o.resetButtonLabel +
                      "</span></a>"
                    : ""),
                (a =
                  !0 === p.o.customButton && l.data("panel-custombutton") === m
                    ? '<a href="#" class="dropdown-item js-panel-custombutton pl-4"><span data-i18n="drpdwn.custombutton">' +
                      p.o.customButtonLabel +
                      "</span></a>"
                    : ""),
                c.append(
                  '<div class="panel-saving mr-2" style="display:none"><i class="fal fa-spinner-third fa-spin-4x fs-xl"></i></div>'
                );
              var h = p.o.buttonOrder
                .replace(/%close%/g, t)
                .replace(/%fullscreen%/g, e)
                .replace(/%collapse%/g, n);
              ("" === t && "" === e && "" === n) ||
                c.append('<div class="panel-toolbar">' + h + "</div>");
              var f = p.o.buttonOrderDropdown
                .replace(/%locked%/g, i)
                .replace(/%color%/g, r)
                .replace(/%refresh%/g, o)
                .replace(/%reset%/g, s)
                .replace(/%custom%/g, a);
              ("" === i && "" === r && "" === o && "" === s && "" === a) ||
              l.data("panel-setting") !== false
                ? c.append(
                    '<div class="panel-toolbar">' +
                      `<a href="#" class="btn btn-toolbar-master" data-toggle="dropdown">
                    <i class="fal fa-ellipsis-v"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-animated dropdown-menu-right p-0">
                    ${f}
                    </div>
                    </div>`
                  )
                : "null",
                l
                  .attr("role", "widget")
                  .children("div")
                  .attr("role", "content")
                  .prev(".panel-hdr")
                  .attr("role", "heading")
                  .children(".panel-toolbar")
                  .attr("role", "menu");
            }
          }),
          !0 === p.o.sortable && jQuery.ui)
        ) {
          var s = p.obj
            .find(p.o.grid + ".sortable-grid")
            .not("[data-panel-excludegrid]");
          s.sortable({
            items: s.find(p.o.panels + ".panel-sortable"),
            connectWith: s,
            placeholder: p.o.placeholderClass,
            cursor: "move",
            opacity: p.o.opacity,
            delay: 0,
            revert: 350,
            cancel:
              ".btn-panel, .panel-fullscreen .panel-fullscreen, .mod-panel-disable .panel-sortable, .panel-locked.panel-sortable",
            zIndex: 1e4,
            handle: p.o.dragHandle,
            forcePlaceholderSize: !0,
            forceHelperSize: !0,
            update: function (t, e) {
              p._runPanelLoader(e.item.children()),
                p._savePanelPosition(),
                "function" == typeof p.o.onChange &&
                  p.o.onChange.call(this, e.item);
            },
          });
        }
        p._clickEvents(),
          p.storage.enabled &&
            (g(p.o.deleteSettingsKey).on(a, this, function (t) {
              confirm(p.o.settingsKeyLabel) &&
                localStorage.removeItem(keySettings),
                t.preventDefault();
            }),
            g(p.o.deletePositionKey).on(a, this, function (t) {
              confirm(p.o.positionKeyLabel) &&
                localStorage.removeItem(keyPosition),
                t.preventDefault();
            })),
          (initialized = !0);
      }
    },
    _initStorage: function (t) {
      t.enabled =
        t.enabled &&
        !!(function () {
          var t,
            e = +new Date();
          try {
            return (
              localStorage.setItem(e, e),
              (t = localStorage.getItem(e) == e),
              localStorage.removeItem(e),
              t
            );
          } catch (t) {}
        })();
      this._loadKeys(),
        t.enabled &&
          (t.getKeySettings =
            (JSON.parse(localStorage.getItem("admin") || "{}").panel || {})[
              t.keySettings
            ] || ""),
        (t.getKeyPosition =
          (JSON.parse(localStorage.getItem("admin") || "{}").panel || {})[
            t.keyPosition
          ] || "");
    },
    _clickEvents: function () {
      var r = this;
      var t = r.panel.children(".panel-hdr");
      t.off(a);
      t.on(a, ".js-panel-collapse", function (t) {
        var e = g(this),
          n = e.closest(r.o.panels);
        void 0 !== g.fn.tooltip && g('[data-toggle="tooltip"]').length
          ? g(this).tooltip("hide")
          : console.log("bs.tooltip is not loaded"),
          n
            .children(".panel-container")
            .collapse("toggle")
            .on("shown.bs.collapse", function () {
              n.removeClass("panel-collapsed"), r._savePanelSettings();
            })
            .on("hidden.bs.collapse", function () {
              n.addClass("panel-collapsed"), r._savePanelSettings();
            }),
          r._runPanelLoader(e),
          "function" == typeof r.o.onCollapse && r.o.onCollapse.call(this, n),
          t.preventDefault();
      });
      // t.on(off, ".js-panel-fullscreen");
      t.on(a, ".js-panel-fullscreen", function (t) {
        var e = g(this),
          n = e.closest(r.o.panels);
        void 0 !== g.fn.tooltip && g('[data-toggle="tooltip"]').length
          ? g(this).tooltip("hide")
          : console.log("bs.tooltip is not loaded"),
          n.toggleClass("panel-fullscreen"),
          myapp_config.root_.toggleClass("panel-fullscreen"),
          r._runPanelLoader(e),
          "function" == typeof r.o.onFullscreen &&
            r.o.onFullscreen.call(this, n),
          t.preventDefault();
      });
      // t.on(off, ".js-panel-close");
      t.on(a, ".js-panel-close", function (t) {
        var e = g(this),
          n = e.closest(r.o.panels),
          i = n.children(".panel-hdr").children("h2").text().trim();
        void 0 !== g.fn.tooltip && g('[data-toggle="tooltip"]').length
          ? g(this).tooltip("hide")
          : console.log("bs.tooltip is not loaded");

        function o() {
          n.fadeOut(500, function () {
            g(this).remove(),
              "function" == typeof r.o.onClosepanel &&
                r.o.onClosepanel.call(this, n);
          }),
            r._runPanelLoader(e);
        }
        window.initApp.playSound("media/sound", "messagebox"),
          "undefined" != typeof bootbox
            ? bootbox.confirm({
                title:
                  "<i class='fal fa-times-circle text-danger mr-2'></i> Do you wish to delete panel <span class='fw-500'>&nbsp;'" +
                  i +
                  "'&nbsp;</span>?",
                message:
                  "<span><strong>Cảnh báo:</strong> Panel này sẽ bị xóa khỏi khung nhìn của bạn!</span>",
                centerVertical: !0,
                swapButtonOrder: !0,
                buttons: {
                  confirm: {
                    label: "Xóa",
                    className: "btn-danger shadow-0",
                  },
                  cancel: {
                    label: "Không",
                    className: "btn-default",
                  },
                },
                className: "modal-alert",
                closeButton: !1,
                callback: function (t) {
                  1 == t && o();
                },
              })
            : confirm("Bạn có muốn xóa panel này không?") && o(),
          t.preventDefault();
      });
      t.on(a, ".js-panel-color", function (t) {
        var e = g(this),
          n = e.closest(r.o.panels),
          i = e.closest(".panel-hdr"),
          o = e.data("panel-setstyle");
        i
          .removeClassPrefix("bg-")
          .addClass(o)
          .closest(".panel")
          .attr("data-panel-attstyle", "" + o),
          "function" == typeof r.o.onColor && r.o.onColor.call(this, n),
          r._runPanelLoader(e),
          r._savePanelSettings(),
          t.preventDefault();
      }),
        t.on(a, ".js-panel-locked", function (t) {
          var e = g(this),
            n = e.closest(r.o.panels);
          n.toggleClass("panel-locked"),
            r._runPanelLoader(e),
            "function" == typeof r.o.onLocked && r.o.onLocked.call(this, n),
            r._savePanelSettings(),
            t.preventDefault();
        }),
        t.on(a, ".js-panel-refresh", function (t) {
          var e = g(this).closest(r.o.panels),
            n = e.attr("data-refresh-timer") || 1500;
          e
            .addClass("panel-refresh")
            .children(".panel-container")
            .addClass("enable-loader")
            .stop(!0, !0)
            .delay(n)
            .queue(function () {
              e
                .removeClass("panel-refresh")
                .children(".panel-container")
                .removeClass("enable-loader")
                .dequeue(),
                console.log(e.attr("id") + " refresh complete");
            }),
            "function" == typeof r.o.onRefresh && r.o.onRefresh.call(this, e),
            t.preventDefault();
        }),
        t.on(a, ".js-panel-reset", function (t) {
          var e = g(this);
          var n = e.closest(r.o.panels);
          var keyPosition = n.data("position");
          var gid = n.data("gid");
          var index = n.data("index");
          if (keyPosition) {
            var admin = JSON.parse(localStorage.getItem("admin") || "{}");
            if (!admin.panel) admin.panel = {};
            var positions = admin.panel[keyPosition] || {
              grid: [
                {
                  section: [],
                },
              ],
            };
            positions.grid = positions.grid.map((item) => {
              item.section = item.section.filter((item2) => {
                return item2.id != n.attr("id");
              });
              return item;
            });
            admin.panel[keyPosition] = positions;
            localStorage.setItem("admin", JSON.stringify(admin));
          }
          g("[gid='" + gid + "']").insertAt(index, n);

          e
            .closest(".panel-hdr")
            .removeClassPrefix("bg-")
            .closest(".panel")
            .removeClass("panel-collapsed panel-fullscreen panel-locked")
            .attr("data-panel-attstyle", "")
            .children(".panel-container")
            .collapse("show"),
            r._runPanelLoader(e),
            r._savePanelSettings(),
            "function" == typeof r.o.onReset && r.o.onReset.call(this, n),
            t.preventDefault();
        }),
        (t = null);
    },
    destroy: function () {
      var t = "." + o,
        e = this.obj
          .find(this.o.grid + ".sortable-grid")
          .not("[data-panel-excludegrid]");
      this.panel.removeClass("panel-sortable"),
        e.sortable("destroy"),
        this.panel.children(".panel-hdr").off(t),
        g(this.o.deletePositionKey).off(t),
        g(n).off(t),
        this.obj.removeData(o),
        (this.initialized = !1);
    },
  };
  g.fn.insertAt = function (index, element) {
    var lastIndex = this.children().size();
    if (index < 0) {
      index = Math.max(0, lastIndex + 1 + index);
    }
    this.append(element);
    if (index < lastIndex) {
      this.children().eq(index).before(this.children().last());
    }
    return this;
  };
  g.fn[o] = function (i) {
    return this.each(function () {
      var t = g(this);
      var e = t.data(o);
      // if (e && e.panel && e.panel.destroy) {
      //   e.panel.destroy();
      //   e = null;
      // }
      // if (!e) {
      var n = "object" == typeof i && i;
      t.data(o, (e = new r(this, n)));
      // }
      if ("string" == typeof i) e[i]();
    });
  };
  g.fn[o].defaults = {
    grid: '[class*="col-"]',
    panels: ".panel",
    placeholderClass: "panel-placeholder",
    dragHandle: "> .panel-hdr > h2",
    localStorage: !0,
    onChange: function () {},
    onSave: function () {},
    opacity: 1,
    deleteSettingsKey: "",
    settingsKeyLabel: "Reset settings?",
    deletePositionKey: "",
    positionKeyLabel: "Reset position?",
    sortable: !0,
    buttonOrder: "%collapse% %fullscreen% %close%",
    buttonOrderDropdown: "%refresh% %locked% %color% %custom% %reset%",
    customButton: !1,
    customButtonLabel: "Custom Label",
    onCustom: function () {},
    closeButton: !0,
    onClosepanel: function () {
      myapp_config.debugState &&
        console.log(g(this).closest(".panel").attr("id") + " onClosepanel");
    },
    fullscreenButton: !0,
    onFullscreen: function () {
      myapp_config.debugState &&
        console.log(g(this).closest(".panel").attr("id") + " onFullscreen");
    },
    collapseButton: !0,
    onCollapse: function () {
      myapp_config.debugState &&
        console.log(g(this).closest(".panel").attr("id") + " onCollapse");
    },
    lockedButton: !0,
    lockedButtonLabel: "Khóa vị trí",
    onLocked: function () {
      myapp_config.debugState &&
        console.log(g(this).closest(".panel").attr("id") + " onLocked");
    },
    // refreshButton: !0,
    // refreshButtonLabel: "Cập nhật nội dung",
    // onRefresh: function() {
    //   myapp_config.debugState &&
    //     console.log(
    //       g(this)
    //         .closest(".panel")
    //         .attr("id") + " onRefresh"
    //     );
    // },
    colorButton: !0,
    colorButtonLabel: "Cài đặt màu",
    onColor: function () {
      myapp_config.debugState &&
        console.log(g(this).closest(".panel").attr("id") + " onColor");
    },
    panelColors: [
      "bg-primary-700 bg-success-gradient",
      "bg-primary-500 bg-info-gradient",
      "bg-primary-600 bg-primary-gradient",
      "bg-info-600 bg-primray-gradient",
      "bg-info-600 bg-info-gradient",
      "bg-info-700 bg-success-gradient",
      "bg-success-900 bg-info-gradient",
      "bg-success-700 bg-primary-gradient",
      "bg-success-600 bg-success-gradient",
      "bg-danger-900 bg-info-gradient",
      "bg-fusion-400 bg-fusion-gradient",
      "bg-faded",
    ],
    resetButton: !0,
    resetButtonLabel: "Khôi phục cài đặt gốc",
    onReset: function () {
      myapp_config.debugState &&
        console.log(g(this).closest(".panel").attr("id") + " onReset callback");
    },
  };
})(jQuery, window, document);
$("body").smartPanel();
$("[data-original-title]").tooltip();
