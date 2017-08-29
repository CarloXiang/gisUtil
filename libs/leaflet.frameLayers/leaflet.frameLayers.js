(function (window, document, undefined) {
L.drawVersion = '0.1.0-dev';

L.Control.FrameLayers = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topright',
		autoZIndex: true,
		proxyUrl: ''
	},

	initialize: function (Layers, options, callback) {
		L.setOptions(this, options);

		this._layers = Layers;
		this._lastZIndex = 0;
		this._currentLayer = {};
              this.callback = callback;
	},

	onAdd: function (map) {
		this._initLayout();
		this._update();

		return this._container;
	},

	onRemove: function (map) {
	},

	_initLayout: function () {
		var className = 'leaflet-control-layers',
		    container = this._container = L.DomUtil.create('div', className);

		//Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		if (!L.Browser.touch) {
			L.DomEvent
				.disableClickPropagation(container)
				.disableScrollPropagation(container);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		var form = this._form = L.DomUtil.create('form', className + '-list');

		if (this.options.collapsed) {
			if (!L.Browser.android) {
				L.DomEvent
				    .on(container, 'mouseover', this._expand, this)
				    .on(container, 'mouseout', this._collapse, this);
			}
			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Layers';

			if (L.Browser.touch) {
				L.DomEvent
				    .on(link, 'click', L.DomEvent.stop)
				    .on(link, 'click', this._expand, this);
			}
			else {
				L.DomEvent.on(link, 'focus', this._expand, this);
			}
			//Work around for Firefox android issue https://github.com/Leaflet/Leaflet/issues/2033
			// L.DomEvent.on(form, 'click', function () {
			// 	setTimeout(L.bind(this._onInputClick, this), 0);
			// }, this);

			this._map.on('click', this._collapse, this);
			// TODO keyboard accessibility
		} else {
			this._expand();
		}

		this._layersList = L.DomUtil.create('div', className + '-base', form);

		container.appendChild(form);

              this._constructFrameQuery(this._layers[0]);
              this._currentLayer = this._layers[0];
	},

	_update: function () {
		if (!this._container) {
			return;
		}

		this._layersList.innerHTML = '<lable class="frame-caption">图幅选择</lable><div class="leaflet-control-layers-separator"></div>';

		for ( var i = 0 ; i< this._layers.length; i++) {
			obj = this._layers[i];
			this._addItem(obj, i);
		}
	},

	// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
	_createRadioElement: function (name, checked) {

		var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"';
		if (checked) {
			radioHtml += ' checked="checked"';
		}
		radioHtml += '/>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = radioHtml;

		return radioFragment.firstChild;
	},

	_addItem: function(obj, i) {
		var label = document.createElement('label'),
			input,
			checked = obj.checked;

		input = this._createRadioElement('leaflet-base-layers', checked);

		input.layerId = i;

		L.DomEvent.on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		label.appendChild(input);
		label.appendChild(name);

		var container = this._layersList;
		container.appendChild(label);

		return label;
	},

	 _constructFrameQuery: function(obj){
            var _self = this;
             _self._loadShade();
            obj.checked=true;
            if(obj.layer){
            	_self._map.addLayer(obj.layer);
              _self._deleteShade();
            	return;
            }
            var query = L.esri.Tasks.query({
                url: obj.url,
                proxy: _self.options.proxyUrl
            });
            query.layer(obj.id)
                .where('1=1')
            	.fields('MapID,Style,UpdateYear,UpdateMonth');
            query.run(function(error, featureCollection, response) {
                var frameGeojson = L.geoJson(featureCollection, {
                    style: {
                        color: '#9E9E9E',
                        weight: 0.5,
                        opacity: 0.85,
                        fillOpacity: 0.2
                    },
                    onEachFeature: function(feature, layer) {
                        var content = '<h5>' + feature.properties.MapID + '<\/h5>' +
                            '<p>更新年份：' + feature.properties.UpdateYear + '年<\/p>' +
                            '<p>更新月份：' + feature.properties.UpdateMonth + '月<\/p>' +
                            '<p>采集方式：' + feature.properties.Style + '<\/p>';
                        layer.bindPopup(content);
                        layer.on({
                            mouseover: function(e) {
                                var layer = e.target;
                                layer.setStyle({
                                    weight: 2.5,
                                    color: '#63b6e5',
                                    opacity: 0.9,
                                    fillOpacity: 0.5
                                });

                                if (!L.Browser.ie && !L.Browser.opera) {
                                    layer.bringToFront();
                                }
                            },
                            mouseout: function(e) {
                                frameGeojson.resetStyle(e.target);
                            }
                        })
                    },
                    coordsToLatLng: function(coords) {
                        return _self._map.options.crs.projection.unproject({
                            x: coords[0],
                            y: coords[1]
                        });
                    }
                }).addTo(_self._map);
		obj.layer = frameGeojson;
              _self._deleteShade();
            });
        },

	_onInputClick: function () {
   
		var i, input, obj,
		    inputs = this._form.getElementsByTagName('input'),
		    inputsLen = inputs.length;
              if(this.callback)
                this.callback();
		for (i = 0; i < inputsLen; i++) {
			input = inputs[i];
			obj = this._layers[input.layerId];

			if (input.checked) {
				this._constructFrameQuery(obj);
				this._currentLayer = obj;
				console.log(obj);				
			} else if (!input.checked) {
				if(obj.layer&&obj.checked && this._map.hasLayer(obj.layer)){
					this._map.removeLayer(obj.layer);
				}
				obj.checked = false;
			}
		}
		this._refocusOnMap();

	},

	_expand: function () {
		L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
	},

	_collapse: function () {
		this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', '');
	},

      _loadShade:function(){
            $("#filterTabContent").append('<div id="shade" style="position: absolute;top:0px;left:0px;width:100%;height:100%; background-color: rgba(0, 0, 0, 0);z-index: 9999;text-align:center;"><img src="images/loading.gif" style="margin-top:28% "></div>');
      },
      _deleteShade:function(){
            $("#shade").remove();
      }

});

L.control.framelayers = function (Layers, options, callback) {
	return new L.Control.FrameLayers(Layers, options, callback);
};

}(window, document));