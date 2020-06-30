// var myapp_config = {
//   VERSION: "4.0.2",
//   root_: $("body"),
//   root_logo: $(".page-sidebar > .page-logo"),
//   throttleDelay: 450,
//   filterDelay: 150,
//   thisDevice: null,
//   isMobile: /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(
//     navigator.userAgent.toLowerCase()
//   ),
//   mobileMenuTrigger: null,
//   mobileResolutionTrigger: 992,
//   isWebkit:
//     !0 == (!!window.chrome && !!window.chrome.webstore) ||
//     0 <
//       Object.prototype.toString
//         .call(window.HTMLElement)
//         .indexOf("Constructor") ==
//       !0,
//   isChrome: /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()),
//   isIE: 0 < window.navigator.userAgent.indexOf("Trident/") == !0,
//   debugState: !0,
//   rippleEffect: !0,
//   mythemeAnchor: "#mytheme",
//   navAnchor: $("#js-primary-nav"),
//   navHooks: $("#js-nav-menu"),
//   navAccordion: !0,
//   navInitalized: "js-nav-built",
//   navFilterInput: $("#nav_filter_input"),
//   navHorizontalWrapperId: "js-nav-menu-wrapper",
//   navSpeed: 500,
//   mythemeColorProfileID: $("#js-color-profile"),
//   navClosedSign: "fal fa-angle-down",
//   navOpenedSign: "fal fa-angle-up",
//   appDateHook: $(".js-get-date"),
//   storeLocally: !0,
//   jsArray: []
// };

// function registerEvent() {
//   $("body [data-action]").off("click");
//   $("body [data-action]").on("click", function(e) {
//     var o = $(this).data("action");
//     switch (!0) {
//       case "toggle" === o:
//         var t = $(this).attr("data-target") || myapp_config.root_;
//         var n = $(this).attr("data-class");
//         var i = $(this).attr("data-focus");
//         if (-1 !== n.indexOf("mod-bg-")) {
//           $(t).removeClass(function(e, o) {
//             return (o.match(/(^|\s)mod-bg-\S+/g) || []).join(" ");
//           });
//         }
//         $(t).toggleClass(n);
//         if ($(this).hasClass("dropdown-item")) {
//           $(this).toggleClass("active");
//         }
//         if (null != i) {
//           setTimeout(function() {
//             $("#" + i).focus();
//           }, 200);
//         }
//         window.initApp.checkNavigationOrientation();
//         window.initApp.saveSettings();
//         break;
//       case "toggle-swap" === o:
//         (t = $(this).attr("data-target")), (n = $(this).attr("data-class"));
//         $(t)
//           .removeClass()
//           .addClass(n);
//         break;
//       case "panel-collapse" === o:
//         (l = $(this).closest(".panel"))
//           .children(".panel-container")
//           .collapse("toggle")
//           .on("show.bs.collapse", function() {
//             l.removeClass("panel-collapsed"),
//               myapp_config.debugState &&
//                 console.log(
//                   "panel id:" + l.attr("id") + " | action: uncollapsed"
//                 );
//           })
//           .on("hidden.bs.collapse", function() {
//             l.addClass("panel-collapsed"),
//               myapp_config.debugState &&
//                 console.log(
//                   "panel id:" + l.attr("id") + " | action: collapsed"
//                 );
//           });
//         break;
//       case "panel-fullscreen" === o:
//         (l = $(this).closest(".panel")).toggleClass("panel-fullscreen"),
//           myapp_config.root_.toggleClass("panel-fullscreen"),
//           myapp_config.debugState &&
//             console.log("panel id:" + l.attr("id") + " | action: fullscreen");
//         break;
//       case "panel-close" === o:
//         function a() {
//           l.fadeOut(500, function() {
//             $(this).remove(),
//               myapp_config.debugState &&
//                 console.log("panel id:" + l.attr("id") + " | action: removed");
//           });
//         }
//         var l = $(this).closest(".panel");
//         "undefined" != typeof bootbox
//           ? (window.initApp.playSound("media/sound", "messagebox"),
//             bootbox.confirm({
//               title:
//                 "<i class='fal fa-times-circle text-danger mr-2'></i> Do you wish to delete panel <span class='fw-500'>&nbsp;'" +
//                 l
//                   .children(".panel-hdr")
//                   .children("h2")
//                   .text()
//                   .trim() +
//                 "'&nbsp;</span>?",
//               message:
//                 "<span><strong>Warning:</strong> This action cannot be undone!</span>",
//               centerVertical: !0,
//               swapButtonOrder: !0,
//               buttons: {
//                 confirm: {
//                   label: "Yes",
//                   className: "btn-danger shadow-0"
//                 },
//                 cancel: { label: "No", className: "btn-default" }
//               },
//               className: "modal-alert",
//               closeButton: !1,
//               callback: function(e) {
//                 1 == e && a();
//               }
//             }))
//           : confirm(
//               "Do you wish to delete panel " +
//                 l
//                   .children(".panel-hdr")
//                   .children("h2")
//                   .text()
//                   .trim() +
//                 "?"
//             ) && a();
//         break;
//       case "theme-update" === o:
//         if ($(myapp_config.mythemeAnchor).length)
//           $(myapp_config.mythemeAnchor).attr(
//             "href",
//             $(this).attr("data-theme")
//           );
//         else {
//           var r = $("<link>", {
//             id: myapp_config.mythemeAnchor.replace("#", ""),
//             rel: "stylesheet",
//             href: $(this).attr("data-theme")
//           });
//           $("head").append(r);
//         }
//         null != $(this).attr("data-themesave") && window.initApp.saveSettings();
//         break;
//       case "app-reset" === o:
//         window.initApp.resetSettings();
//         break;
//       case "factory-reset" === o:
//         window.initApp.factoryReset();
//         break;
//       case "app-print" === o:
//         window.print();
//         break;
//       case "app-loadscript" === o:
//         var s = $(this).attr("data-loadurl"),
//           c = $(this).attr("data-loadfunction");
//         window.initApp.loadScript(s, c);
//         break;
//       case "lang" === o:
//         var p = $(this)
//           .attr("data-lang")
//           .toString();
//         $.i18n
//           ? i18n.setLng(p, function() {
//               $("[data-i18n]").i18n(),
//                 $("[data-lang]").removeClass("active"),
//                 $(this).addClass("active");
//             })
//           : window.initApp.loadScript("js/i18n/i18n.js", function() {
//               $.i18n.init(
//                 {
//                   resGetPath: "media/data/__lng__.json",
//                   load: "unspecific",
//                   fallbackLng: !1,
//                   lng: p
//                 },
//                 function(e) {
//                   $("[data-i18n]").i18n();
//                 }
//               );
//             });
//         break;
//       case "app-fullscreen" === o:
//         document.fullscreenElement ||
//         document.mozFullScreenElement ||
//         document.webkitFullscreenElement ||
//         document.msFullscreenElement
//           ? (document.exitFullscreen
//               ? document.exitFullscreen()
//               : document.msExitFullscreen
//               ? document.msExitFullscreen()
//               : document.mozCancelFullScreen
//               ? document.mozCancelFullScreen()
//               : document.webkitExitFullscreen &&
//                 document.webkitExitFullscreen(),
//             myapp_config.debugState &&
//               console.log(
//                 "%capp fullscreen toggle inactive! ",
//                 "color: #ed1c24"
//               ))
//           : (document.documentElement.requestFullscreen
//               ? document.documentElement.requestFullscreen()
//               : document.documentElement.msRequestFullscreen
//               ? document.documentElement.msRequestFullscreen()
//               : document.documentElement.mozRequestFullScreen
//               ? document.documentElement.mozRequestFullScreen()
//               : document.documentElement.webkitRequestFullscreen &&
//                 document.documentElement.webkitRequestFullscreen(
//                   Element.ALLOW_KEYBOARD_INPUT
//                 ),
//             myapp_config.debugState &&
//               console.log("app fullscreen toggle active"));
//         break;
//       case "playsound" === o:
//         var f = $(this).attr("data-soundpath") || "media/sound/",
//           d = $(this).attr("data-soundfile");
//         window.initApp.playSound(f, d);
//     }
//     $(this).tooltip("hide"),
//       myapp_config.debugState && console.log("data-action clicked: " + o),
//       e.stopPropagation(),
//       e.preventDefault();
//   });
// }
