var EBingMode;
(function (EBingMode) {
    EBingMode["CURSOR"] = "Cursor";
    EBingMode["PLANE"] = "Plane";
    EBingMode["VFR"] = "Vfr";
    EBingMode["HORIZON"] = "Horizon";
    EBingMode["TOPVIEW"] = "Topview";
})(EBingMode || (EBingMode = {}));
var EBingReference;
(function (EBingReference) {
    EBingReference["SEA"] = "Sea";
    EBingReference["PLANE"] = "Plane";
    EBingReference["AERIAL"] = "Aerial";
})(EBingReference || (EBingReference = {}));
var EWeatherRadar;
(function (EWeatherRadar) {
    EWeatherRadar["OFF"] = "Off";
    EWeatherRadar["TOPVIEW"] = "Topview";
    EWeatherRadar["HORIZONTAL"] = "Horizontal";
    EWeatherRadar["VERTICAL"] = "Vertical";
})(EWeatherRadar || (EWeatherRadar = {}));
var BingMapsFlags;
(function (BingMapsFlags) {
    BingMapsFlags[BingMapsFlags["FL_BINGMAP_REF_PLANE"] = 1] = "FL_BINGMAP_REF_PLANE";
    BingMapsFlags[BingMapsFlags["FL_BINGMAP_REF_AERIAL"] = 2] = "FL_BINGMAP_REF_AERIAL";
    BingMapsFlags[BingMapsFlags["FL_BINGMAP_3D"] = 4] = "FL_BINGMAP_3D";
    BingMapsFlags[BingMapsFlags["FL_BINGMAP_3D_TOPVIEW"] = 8] = "FL_BINGMAP_3D_TOPVIEW";
})(BingMapsFlags || (BingMapsFlags = {}));
class BingMapsConfig {
}
class BingMapsBinder {
}
class BingMapElement extends HTMLElement {
    constructor() {
        super();
        this.onListenerRegistered = () => {
            if (this.m_listenerRegistered)
                return;
            console.log("NetBing Listener Registered");
            this.m_listenerRegistered = true;
            this.updateBinding();
        };
        this.onListenerBinded = (_binder, uid) => {
            if (this.m_bingId != _binder.friendlyName) {
                return;
            }
            if (this.m_listenerBinded) {
                if (this.m_listenerUId != uid) {
                    this.m_listenerUId = uid;
                }
                return;
            }
            console.log("NetBing Listener Ready");
            this.m_listenerBinded = true;
            this.m_listenerUId = uid;
            this.updateConfig();
            this.updateParams();
            this.updateTopViewParams();
            this.updateTopView();
            this.updateIsolines();
            this.updateWeather();
            this.updateVisibility();
            this.dispatchEvent(new Event('BingMapReady'));
        };
        this.updateMapImage = (_uid, _img) => {
            if (this.m_listenerBinded && this.m_listenerUId == _uid) {
                if (this.m_mapImageName != _img) {
                    this.m_mapImageName = _img;
                    if (this.m_imgElement)
                        this.m_imgElement.src = _img;
                }
            }
            else {
            }
        };
        this.OnDestroy = () => {
            if (this.m_imgElement) {
                this.m_imgElement.src = "";
                this.removeChild(this.m_imgElement);
            }
        };
        this.m_params = undefined;
        this.m_TopViewParams = undefined;
        this.m_topView = undefined;
        this.m_configs = [];
        this.m_configId = -1;
        this.m_bingRef = undefined;
        this.m_bingMode = undefined;
        this.m_bingId = undefined;
        this.m_showIsolines = undefined;
        this.m_showWeather = undefined;
        this.m_weatherCone = Math.PI * 0.5;
        this.m_isVisible = undefined;
        this.m_aspectRatio = 1.0;
        this.m_listenerRegistered = false;
        this.m_listenerBinded = false;
        this.m_listenerUId = -1;
    }
    connectedCallback() {
        if (!this.m_imgElement) {
            this.m_imgElement = document.createElement("img");
            this.appendChild(this.m_imgElement);
        }
        this.m_imgElement.src = "";
        this.m_imgElement.style.width = "100%";
        this.m_imgElement.style.height = "100%";
        this.m_listener = RegisterViewListener("JS_LISTENER_MAPS", this.onListenerRegistered);
        this.m_listener.on("MapBinded", this.onListenerBinded);
        this.m_listener.on("MapUpdated", this.updateMapImage);
        window.addEventListener('OnDestroy', this.OnDestroy);
    }
    disconnectedCallback() {
        if (this.m_listener) {
            this.m_listener.off("MapBinded", this.onListenerBinded);
            this.m_listener.off("MapUpdated", this.updateMapImage);
            if (this.m_listenerBinded) {
                this.m_listener.trigger("JS_UNBIND_BINGMAP", this.m_bingId);
            }
        }
        this.m_listenerRegistered = false;
        this.m_listenerBinded = false;
        this.m_mapImageName = "";
        this.m_imgElement.src = "";
        window.removeEventListener('OnDestroy', this.OnDestroy);
    }
    isReady() {
        return this.m_listenerBinded;
    }
    setBingId(_id) {
        if (this.m_bingId != _id) {
            this.m_bingId = _id;
            this.updateBinding();
        }
    }
    setMode(_mode) {
        if (this.m_bingMode != _mode) {
            this.m_bingMode = _mode;
            this.updateBinding();
        }
    }
    setReference(_ref) {
        if (this.m_bingRef != _ref) {
            this.m_bingRef = _ref;
            this.updateBinding();
        }
    }
    setAspectRatio(_ratio) {
        if (this.m_aspectRatio != _ratio) {
            this.m_aspectRatio = _ratio;
            this.updateConfig();
        }
    }
    getAspectRatio() {
        return this.m_aspectRatio;
    }
    addConfig(_config) {
        this.m_configs.push(_config);
    }
    setConfig(_configId) {
        if (_configId != this.m_configId && _configId >= 0 && _configId < this.m_configs.length) {
            this.m_configId = _configId;
            this.updateConfig();
        }
    }
    setParams(_value) {
        this.m_params = _value;
        this.updateParams();
    }
    setTopViewParams(_value) {
        this.m_TopViewParams = _value;
        this.updateTopViewParams();
    }
    setTopView(_value) {
        this.m_topView = _value;
        this.updateTopView();
    }
    showIsolines(_show) {
        if (this.m_showIsolines != _show) {
            this.m_showIsolines = _show;
            this.updateIsolines();
        }
    }
    getIsolines() {
        return this.m_showIsolines;
    }
    showWeather(_mode, _cone) {
        if (this.m_showWeather != _mode) {
            this.m_showWeather = _mode;
            this.m_weatherCone = _cone;
            this.updateWeather();
        }
    }
    getWeather() {
        return this.m_showWeather;
    }
    setVisible(_show) {
        if (this.m_isVisible != _show) {
            this.m_isVisible = _show;
            this.updateVisibility();
        }
    }
    is3D() {
        if (this.m_bingMode == EBingMode.HORIZON || this.m_bingMode == EBingMode.TOPVIEW) {
            return true;
        }
        return false;
    }
    getFlags() {
        let flags = 0;
        if (this.m_bingMode == EBingMode.HORIZON) {
            flags |= BingMapsFlags.FL_BINGMAP_3D;
        }
        else if (this.m_bingMode == EBingMode.TOPVIEW) {
            flags |= BingMapsFlags.FL_BINGMAP_3D | BingMapsFlags.FL_BINGMAP_3D_TOPVIEW;
        }
        if (this.m_bingRef == EBingReference.PLANE) {
            flags |= BingMapsFlags.FL_BINGMAP_REF_PLANE;
        }
        else if (this.m_bingRef == EBingReference.AERIAL) {
            flags |= BingMapsFlags.FL_BINGMAP_REF_AERIAL;
        }
        return flags;
    }
    updateBinding() {
        if (this.m_listenerRegistered && this.m_bingId != undefined) {
            this.m_listener.trigger("JS_BIND_BINGMAP", this.m_bingId, this.getFlags());
        }
    }
    updateConfig() {
        if (this.m_listenerBinded) {
            if (this.m_configId >= 0 && this.m_configId < this.m_configs.length) {
                let activeConfig = this.m_configs[this.m_configId];
                if (activeConfig.heightColors && activeConfig.heightColors.length === 61) {
                    Coherent.call("SET_MAP_HEIGHT_COLORS", this.m_listenerUId, activeConfig.heightColors).catch(reason => {
                        console.error(reason);
                    });
                    if (activeConfig.clearColor > 0) {
                        Coherent.call("SET_MAP_CLEAR_COLOR", this.m_listenerUId, activeConfig.clearColor).catch(reason => {
                            console.error(reason);
                        });
                    }
                }
                else {
                    if (!activeConfig.heightColors) {
                        console.warn("NetBingMap.updateConfig failure. No heightColors provided.");
                    }
                    else if (activeConfig.heightColors.length !== 61) {
                        console.warn("NetBingMap.updateConfig failure. Unexpected number of heightColors was provided (expected 61, provided " + activeConfig.heightColors.length + ".");
                    }
                }
                if (isFinite(activeConfig.resolution) && activeConfig.resolution > 0) {
                    var resX = activeConfig.resolution * this.getAspectRatio();
                    var resY = activeConfig.resolution;
                    Coherent.call("SET_MAP_RESOLUTION", this.m_listenerUId, resX, resY);
                }
                else {
                    console.warn("NetBingMap.updateConfig failure. No numerical positive resolution provided.");
                }
            }
            else {
                console.warn("NetBingMap.updateConfig failure. No config provided.");
            }
        }
    }
    updateParams() {
        if (this.m_listenerBinded && this.m_params) {
            let failure = false;
            if (!this.is3D()) {
                if (!this.m_params.lla) {
                    console.warn("NetBingMap.updateParams failure. Lla not provided in 3D map.");
                    failure = true;
                }
                if (!this.m_params.radius) {
                    console.warn("NetBingMap.updateParams failure. Radius not provided in 3D map.");
                    failure = true;
                }
            }
            if (!failure && isFinite(this.m_params.radius) && isFinite(this.m_params.lla.lat) && isFinite(this.m_params.lla.long)) {
                let maxLatitude = 86 - this.m_params.radius / 1852 / 60;
                this.m_params.lla.lat = Utils.Clamp(this.m_params.lla.lat, -maxLatitude, maxLatitude);
                Coherent.call("SET_MAP_PARAMS", this.m_listenerUId, this.m_params.lla, this.m_params.radius);
            }
        }
    }
    updateTopViewParams() {
        if (this.m_listenerBinded && this.m_TopViewParams) {
            if (this.m_TopViewParams.altitudeLevel == undefined)
                this.m_TopViewParams.altitudeLevel = 0;
            if (this.m_TopViewParams.pitch == undefined)
                this.m_TopViewParams.pitch = 90;
            if (this.m_TopViewParams.bank == undefined)
                this.m_TopViewParams.bank = 0;
            if (this.m_TopViewParams.relativeHeading == undefined)
                this.m_TopViewParams.relativeHeading = 0;
            if (isFinite(this.m_TopViewParams.altitudeLevel) && isFinite(this.m_TopViewParams.pitch) && isFinite(this.m_TopViewParams.bank) && isFinite(this.m_TopViewParams.relativeHeading)) {
                Coherent.call("SET_MAP_TOPVIEW_PARAMS", this.m_listenerUId, this.m_TopViewParams.altitudeLevel, this.m_TopViewParams.pitch, this.m_TopViewParams.bank, this.m_TopViewParams.relativeHeading);
            }
        }
    }
    updateTopView() {
        if (this.m_listenerBinded && this.m_topView) {
            if (isFinite(this.m_topView.altitudeMin) && isFinite(this.m_topView.altitudeMax) && isFinite(this.m_topView.altitudeLevels)) {
                Coherent.call("SET_MAP_TOPVIEW_SETTINGS", this.m_listenerUId, this.m_topView.altitudeMin, this.m_topView.altitudeMax, this.m_topView.altitudeLevels);
            }
        }
    }
    updateVisibility() {
        if (this.m_listenerBinded && this.m_isVisible != undefined) {
            Coherent.call("SHOW_MAP", this.m_listenerUId, this.m_isVisible);
        }
    }
    updateIsolines() {
        if (this.m_listenerBinded && this.m_showIsolines != undefined) {
            Coherent.call("SHOW_MAP_ISOLINES", this.m_listenerUId, this.m_showIsolines);
        }
    }
    updateWeather() {
        if (this.m_listenerBinded && this.m_showWeather != undefined) {
            Coherent.call("SHOW_MAP_WEATHER", this.m_listenerUId, this.m_showWeather, this.m_weatherCone);
        }
    }
    get topView() { return this.m_topView; }
}
BingMapElement.nullLatLong = new LatLong(0, 0);
window.customElements.define("bing-map", BingMapElement);
//# sourceMappingURL=NetBingMap.js.map