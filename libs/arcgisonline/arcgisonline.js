signInWithPopup:function () {
    arcgisonline.map.main.signInWithOAuth().then(function (a) {
        a && arcgisonline.map.main.mapHasChanged &&
        arcgisonline.map.role.isAllowed("tool_save") ? (arcgisonline.sharing.dijit.dialog.ChoiceDlg.prototype.statics.getInstance().show({
                title: esri.i18nBundle.viewer.webMap,
                message: esri.i18nBundle.viewer.main.unsavedChangesDoSave,
                choiceOneTitle: esri.i18nBundle.viewer.main.unsavedChangesYesBtn,
                choiceOneHandler: b.hitch(this, function () {
                    var a = arcgisonline.sharing.util.getUser();
                    null == arcgisonline.map.save_open.webMapInfo || arcgisonline.map.save_open.webMapInfo.owner !== a.email && "admin" !== arcgisonline.map.save_open.webMapInfo.itemControl &&
                    "update" !== arcgisonline.map.save_open.webMapInfo.itemControl ? arcgisonline.map.storage.canSaveWithBing() && (a = arcgisonline.sharing.dijit.dialog.SaveWebMapDlg.prototype.statics.getInstance(), b.subscribe("onWebMapSave", null, b.hitch(arcgisonline.map.storage, "onWebMapSave")), a.addWebMapItem(arcgisonline.map.main.mapLayers, arcgisonline.map.main.map.extent, arcgisonline.map.save_open.folderId, arcgisonline.map.save_open.webMapInfo, function (a) {
                            arcgisonline.map.main.redirectToCustomURL(a, !1)
                        }, function () {
                            arcgisonline.map.main.redirectToCustomURL(null,
                                !1)
                        })) : arcgisonline.map.storage.saveExistingWebMap(null, function (a) {
                            arcgisonline.map.main.redirectToCustomURL(a, !1)
                        }, function () {
                            arcgisonline.map.main.redirectToCustomURL(null, !1)
                        })
                }),
                choiceTwoTitle: esri.i18nBundle.viewer.main.unsavedChangesNoBtn,
                choiceTwoHandler: b.hitch(this, function () {
                    arcgisonline.map.main.redirectToCustomURL(null, !1)
                })
            }), a = esri.i18nBundle.viewer.main.unsavedChangesYesBtn.length + esri.i18nBundle.viewer.main.unsavedChangesNoBtn.length, b.style(b.byId("choice-dialog"), "width", Math.min(10 *
                    a + 150, 650) + "px")) : a && arcgisonline.map.main.redirectToCustomURL(null, !1)
    });
    return !1
}
,
signInWithPopupAndSave:function (a) {
    if (arcgisonline.sharing.util.isLoggedIn())return arcgisonline.map.storage.saveWebMapClick(a), !0;
    arcgisonline.map.main.signInWithOAuth().then(b.hitch(this, function (a, c) {
        if (arcgisonline.map.role.isAllowed("tool_save")) arcgisonline.map.storage.saveWebMapClick(a, function (a) {
            arcgisonline.map.main.redirectToCustomURL(a, !0)
        }, function () {
            arcgisonline.map.main.redirectToCustomURL(null, !1)
        });
        else {
            var d = arcgisonline.sharing.dijit.dialog.GeneralDlg.prototype.statics.getInstance();
            d.show({
                title: esri.i18nBundle.generalDlg.errorDlgTitle,
                message: esri.i18nBundle.viewer.error.cannotSaveMap
            });
            var e = b.connect(d, "onHide", function () {
                b.disconnect(e);
                arcgisonline.map.main.redirectToCustomURL(null, !1)
            })
        }
    }, a));
    return !1
}
,
signInWithOAuth:function (a) {
    var c = new b.Deferred;
    window.checkOAuthResponse = b.hitch(arcgisonline.map.main, "checkOAuthResponse");
    var d = esriGeowConfig.restBaseUrl.substring(0, esriGeowConfig.restBaseUrl.indexOf("/",
        8)).replace("http://", "https://");
    esriGeowConfig.self.portalHostname && (d = "https://" + esriGeowConfig.self.portalHostname);
    a = new esri.arcgis.OAuthInfo({
        appId: "arcgisonline",
        portalUrl: d,
        minTimeUntilExpiration: 525949,
        forceLogin: !0,
        locale: b.locale,
        popup: !0,
        popupCallbackUrl: "viewer_oauth-callback.html",
        popupWindowFeatures: "height\x3d480,width\x3d800,resizable,scrollbars",
        msg: esri.i18nBundle.viewer.main.oAuthSignInMsg
    });
    esri.id.registerOAuthInfos([a]);
    esri.id.useSignInPage = !1;
    esri.id.getCredential(d, {oAuthPopupConfirmation: !1}).then(function (a) {
        var e =
            new esri.arcgis.Portal(d);
        e.signIn().then(function (a) {
            arcgisonline.sharing.geow.Account.setupAfterSelf(e);
            if (arcgisonline.sharing.util.parseUrl(d).host !== arcgisonline.sharing.util.parseUrl(esriGeowConfig.restBaseUrl).host && (!esriGeowConfig.self.urlKey || !esriGeowConfig.self.customBaseUrl || arcgisonline.sharing.util.parseUrl(esriGeowConfig.restBaseUrl).host !== esriGeowConfig.self.urlKey + "." + esriGeowConfig.self.customBaseUrl)) esriGeowConfig.restBaseUrl = esriGeowConfig.restBaseUrl.replace(arcgisonline.sharing.util.parseUrl(esriGeowConfig.restBaseUrl).host,
                arcgisonline.sharing.util.parseUrl(d).host);
            arcgisonline.sharing.geow.Geow.signInHandler2(arcgisonline.map.main.oAuthInfo).then(function () {
                var a = !1, d = arcgisonline.sharing.util.parseUrl(document.location.href).host, e = esriGeowConfig.self;
                if (!e.isPortal && (d === e.portalHostname || e.urlKey && e.customBaseUrl && d !== e.urlKey + "." + e.customBaseUrl || !e.urlKey && d !== e.portalHostname)) e.urlKey && e.customBaseUrl ? -1 === d.indexOf(e.urlKey + "." + e.customBaseUrl) && (a = !0) : e.urlKey || (a = !0);
                !esriGeowConfig.userInfo.token && esriGeowConfig.userInfo.credential &&
                (esriGeowConfig.userInfo.token = esriGeowConfig.userInfo.credential.token);
                arcgisonline.map.role.clearUserActions();
                arcgisonline.map.role.setupUserActions();
                arcgisonline.map.main.loggedIn();
                arcgisonline.map.main.updateHeaderLinks();
                !arcgisonline.map.save_open.webMapInfo && !arcgisonline.map.save_open.itemCard && arcgisonline.map.leftPanel.recreateAboutStack();
                b.forEach(arcgisonline.map.main.mapLayers, function (a) {
                    a.layer && (a.serviceInfo && a.serviceInfo.ownershipBasedAccessControlForFeatures && !1 === a.serviceInfo.ownershipBasedAccessControlForFeatures.allowOthersToQuery) &&
                    arcgisonline.map.main.reloadFeatureLayer(a)
                });
                d = arcgisonline.sharing.util.getUser();
                arcgisonline.map.save_open.webMapInfo && arcgisonline.map.save_open.webMapInfo.owner !== d.email ? arcgisonline.sharing.util.getJson(esriGeowConfig.restBaseUrl + "content/items/" + arcgisonline.map.save_open.webMapInfo.id, b.hitch(this, function (b, d) {
                        arcgisonline.map.save_open.webMapItemCard = b;
                        arcgisonline.map.save_open.webMapInfo.itemControl = b.itemControl;
                        arcgisonline.map.role.updateUserActionAfterOAuth();
                        c.callback(a)
                    }), b.hitch(this,
                        function (b, d) {
                            c.callback(a)
                        })) : c.callback(a)
            })
        }).otherwise(function (a) {
            console.log("Error occurred while signing in: ", a);
            arcgisonline.sharing.dijit.dialog.GeneralDlg.prototype.statics.getInstance().show({
                title: esri.i18nBundle.generalDlg.errorDlgTitle,
                message: esri.i18nBundle.viewer.error.cannotSignInOAuth
            });
            c.errback()
        })
    }).otherwise(function (a) {
        console.log("Error occurred while getting credentials: ", a);
        "ABORTED" !== a.message && (arcgisonline.sharing.dijit.dialog.GeneralDlg.prototype.statics.getInstance().show({
            title: esri.i18nBundle.generalDlg.errorDlgTitle,
            message: esri.i18nBundle.viewer.error.cannotSignInOAuth
        }), c.errback())
    });
    return c
}
,
checkOAuthResponse:function (a) {
    a = new b._Url(a);
    a = a.fragment ? b.queryToObject(a.fragment) : null;
    a.error ? console.log("checkOAuthResponse: Error occurred while signing in: ", a.error) : arcgisonline.map.main.oAuthInfo = b.mixin(a, {token: a.access_token})
}
,
redirectToCustomURL:function (a, b) {
    var c = esriGeowConfig.self, d = document.location.href;
    a ? d = esriGeowConfig.baseUrl + esriGeowConfig.webmapViewerPath + "?webmap\x3d" + a : -1 < d.indexOf("useExisting\x3d1") &&
        (a = arcgisonline.map.save_open.webMapInfo ? arcgisonline.map.save_open.webMapInfo.id : null) && (d = esriGeowConfig.baseUrl + esriGeowConfig.webmapViewerPath + "?webmap\x3d" + a);
    var e = arcgisonline.sharing.util.parseUrl(d).host;
    if (!c.isPortal && (e === c.portalHostname || c.urlKey && c.customBaseUrl && e !== c.urlKey + "." + c.customBaseUrl || !c.urlKey && e !== c.portalHostname)) c.urlKey && c.customBaseUrl ? -1 === e.indexOf(c.urlKey + "." + c.customBaseUrl) && (arcgisonline.map.storage.deleteMapStorageNoFeedback(), d = d.replace(e, c.urlKey + "." + c.customBaseUrl)) :
        c.urlKey || (arcgisonline.map.storage.deleteMapStorageNoFeedback(), d = d.replace(e, c.portalHostname));
    d = c.allSSL ? d.replace("http:", "https:") : d;
    d !== document.location.href && (arcgisonline.sharing.util.parseUrl(d).host !== arcgisonline.sharing.util.parseUrl(document.location.href).host ? window.location = arcgisonline.sharing.util.getBridgeUrl(d, arcgisonline.sharing.util.getCookie("esri_auth")) : "undefined" !== typeof history.pushState ? window.history.pushState(null, null, d) : window.location.href !== d && (window.location =
                arcgisonline.sharing.util.getBridgeUrl(d, arcgisonline.sharing.util.getCookie("esri_auth"))))
}
,
linkToMap:function (a) {
    if (null == arcgisonline.map.save_open.webMapInfo) {
        var c = arcgisonline.sharing.dijit.dialog.GeneralDlg.prototype.statics.getInstance();
        c.show({title: esri.i18nBundle.sharingDlg.sharingDlgTitle, message: esri.i18nBundle.viewer.error.cantShare})
    } else {
        var d = !1;
        arcgisonline.map.main.mapLayers[0].layer instanceof esri.virtualearth.VETiledLayer && (d = !0);
        var e = !1;
        arcgisonline.map.save_open.openedWebMap &&
        (arcgisonline.map.save_open.openedWebMap.presentation && arcgisonline.map.save_open.openedWebMap.presentation.slides && 0 < arcgisonline.map.save_open.openedWebMap.presentation.slides.length) && (e = !0);
        var h = !1;
        b.forEach(arcgisonline.map.main.mapLayers, function (a) {
            if (a.itemCard && (-1 < b.indexOf(a.itemCard.typeKeywords, "Requires Credits") || -1 < b.indexOf(a.itemCard.typeKeywords, "Requires Subscription"))) h = !0
        });
        c = arcgisonline.sharing.util.getUser();
        !c || arcgisonline.map.save_open.webMapInfo.owner !== c.email && "admin" !==
        arcgisonline.map.save_open.webMapInfo.itemControl && "update" !== arcgisonline.map.save_open.webMapInfo.itemControl ? (c = arcgisonline.sharing.dijit.dialog.ShareMapDlg.prototype.statics.getInstance(), c.show(arcgisonline.map.save_open.webMapInfo.id, arcgisonline.map.save_open.webMapInfo.owner, arcgisonline.map.save_open.folderId, arcgisonline.map.save_open.webMapInfo.title, d, e, a, h)) : null == arcgisonline.map.save_open.folderTitle ? arcgisonline.map.storage.getItemF