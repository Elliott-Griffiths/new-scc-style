if (
    action === "retrieve-local-address" ||
    action === "retrieve-national-address" ||
    action === "retrieve-location-from-coordinates"
  ) {
    let {
      subProperty,
      buildingName,
      buildingNumber,
      property,
      streetName,
      locality,
      city,
      postcode,
      fullAddress,
      propertyId,
      uprn,
      easting,
      northing,
      streetId,
      usrn,
      status,
      message,
      ohmsUprn,
      propertyClass,
      managementCode,
      area,
      ward,
      officer,
      areaContact,
      officerContact,
    } = response.data;

    console.log(action, response.data);
    const currentPageId = getCurrentPageId();
    const addressSelectionSection = document.querySelector(`#${currentPageId} .address-selection-section`);
    const selectedAddressSpan = document.querySelector(`#${currentPageId} #selected-address`);

    if (status == 400 && action === "retrieve-location-from-coordinates") {
      if (addressSelectionSection) {
        addressSelectionSection.classList.add('dform_fielderror');
      }

      if (selectedAddressSpan) {
        selectedAddressSpan.textContent = message;
        selectedAddressSpan.classList.add('dform_validationMessage');
        selectedAddressSpan.style.display = 'block';
      }
      return;
    }

    const addressDataForDisplay = {
      subProperty: subProperty ? formatTitleCase(subProperty) : '',
      buildingName: buildingName ? formatTitleCase(buildingName) : '',
      buildingNumber: buildingNumber ? formatTitleCase(buildingNumber) : '',
      property: property ? formatTitleCase(property) : '',
      streetName: streetName ? formatTitleCase(streetName) : '',
      locality: locality ? formatTitleCase(locality) : '',
      city: city ? formatTitleCase(city) : '',
      postcode: postcode ? postcode.toUpperCase() : ''
    };

    const fullAddressDisplay = buildAddressMarkup(addressDataForDisplay);
    let selectedAddressContainer = document.querySelector(`#${currentPageId} .selected-address-container`);
    if (selectedAddressContainer) {
      selectedAddressContainer.innerHTML = fullAddressDisplay;
      selectedAddressContainer = selectedAddressContainer.id.replace('dform_widget_html_', '');
    }

    if (addressSelectionSection) {
      addressSelectionSection.classList.add('dform_fieldsuccess');
    }

    if (selectedAddressSpan) {
      const addressParts = Object.values(addressDataForDisplay)
        .filter(Boolean)
        .join(', ');
      selectedAddressSpan.innerHTML = addressParts;
      selectedAddressSpan.classList.remove('dform_validationMessage');
    }

    const addressearchResults = document.querySelector(`#${currentPageId} .address-search-results`);
    let setAddressButton = document.querySelector(`#${currentPageId} .set-address-btn`);
    if (setAddressButton) {
      setAddressButton = setAddressButton.id.replace('dform_widget_button_', '');
    }
    const buttonContainer = document.querySelector(`#${currentPageId} .address-search-btn-container`);
    let manualAddressElement = document.querySelector(`#${currentPageId} .manual-address-container`);
    if (manualAddressElement) {
      manualAddressElement = manualAddressElement.id.replace('dform_widget_html_', '');
    }

    property = formatTitleCase(property);
    streetName = formatTitleCase(streetName);
    fullAddress = `${formatTitleCase(property)} ${formatTitleCase(
      streetName
    )}, ${city}, ${postcode}`;

    setValuesToInputFields([
      { alias: "property", value: property },
      { alias: "streetName", value: streetName },
      { alias: "city", value: city },
      { alias: "postCode", value: postcode },
      { alias: "fullAddress", value: fullAddress },
      { alias: "uprn", value: uprn },
      { alias: "usrn", value: usrn },
      { alias: "siteName", value: streetName },
      { alias: "siteCode", value: usrn },
      { alias: "propertyId", value: propertyId },
      { alias: "streetId", value: streetId },
      { alias: "easting", value: easting },
      { alias: "northing", value: northing },
      { alias: "ohmsUprn", value: ohmsUprn },
      { alias: "propertyClass", value: propertyClass },
      { alias: "managementCode", value: managementCode },
      { alias: "area", value: area },
      { alias: "ward", value: ward },
      { alias: "officer", value: officer },
      { alias: "areaContact", value: areaContact },
      { alias: "officerContact", value: officerContact },
    ]);

    if (addressearchResults) {
      const selectElement = addressearchResults.querySelector('select');
      if (selectElement) {
        selectElement.style.display = 'none'; // Hides the element
        selectElement.classList.remove('dform_fielderror');
      }
      const validationMessage = addressearchResults?.querySelector('.dform_validationMessage');
      if (validationMessage) {
        validationMessage.style.display = "none";
        validationMessage.textContent = "Select the address";
      }
    }

    if (buttonContainer) {
      buttonContainer.style.display = 'none'; // Hides the element
    }

    let findOnMapElement = document.querySelector(`#${currentPageId} .map-container`);
    if (findOnMapElement) {
      if (easting && northing) {
        plotLocationOnMap(easting, northing);
      }
      findOnMapElement = findOnMapElement.id.replace('dform_widget_html_', '');
    }

    hideShowMultipleElements([
      { name: setAddressButton, display: "hide" },
      { name: selectedAddressContainer, display: "show" },
      { name: manualAddressElement, display: "hide" },
      { name: findOnMapElement, display: "hide" },
    ]);
  }

  do_KDF_Custom_esriMap(action, response);



var streetMapView,
  streetMapPositionLayer,
  mapPoint,
  caseLayer,
  markerSymbol,
  assetSymbol,
  esriAssetUrl,
  groupLayer;
var xminE, xmaxE, yminE, ymaxE, streetLightLayer, esrimap, highlightSelect;
var viewPointX,
  viewPointY,
  assetWatch,
  scc_boundary_ring,
  mapZoomLevel,
  streetlight_unittype,
  BG_layer;
var assetWatchStatus = false;
var viewInitialLoad = false;
var asset_init = false;
var selectedLocation = "";

const popupContent = function (feature) {
  if (feature) {
    const div = document.createElement("div");
    div.innerHTML =
      "<div class='popup' style='font-weight: bold; font-size: medium;'></br>";
    return div;
  }
  return;
};

var vmap_config = {
  mapClickType: "Normal",
  consolidated_layer_url:
    "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/42",
  featureLayers: [
    {
      number: "0",
      name: "street_light",
      title: "Street Light",
      layer_type: "Display",
      layerid: "6",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/6",
      popup: {},
    },
    {
      number: "1",
      name: "vegetation",
      title: "Vegetation",
      layer_type: "Display",
      layerid: "24",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/24",
      popup: {},
    },
    {
      number: "2",
      name: "Signs",
      title: "Signs",
      layer_type: "Display",
      layerid: "0",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/0",
      popup: {},
    },
    {
      number: "3",
      name: "Traffic Signs",
      title: "Traffic Signs",
      layer_type: "Display",
      layerid: "41",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/41",
      popup: {},
    },
    {
      number: "4",
      name: "Drains",
      title: "Drains",
      layer_type: "Display",
      layerid: "2",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/2",
      popup: {},
    },
    {
      number: "5",
      name: "Grit Bins",
      title: "Grit Bins",
      layer_type: "Display",
      layerid: "3",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/3",
      popup: {},
    },
    {
      number: "6",
      name: "Litter Bins",
      title: "Litter Bins",
      layer_type: "Display",
      layerid: "4",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/4",
      popup: {},
    },
    {
      number: "7",
      name: "Street Furniture",
      title: "Street Furniture",
      layer_type: "Display",
      layerid: "5",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/5",
      popup: {},
    },
    {
      number: "8",
      name: "Structure",
      title: "Structure",
      layer_type: "Display",
      layerid: "7",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/7",
      popup: {},
    },
    {
      number: "9",
      name: "Fences",
      title: "Fences",
      layer_type: "Display",
      layerid: "8",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/8",
      popup: {},
    },
    {
      number: "10",
      name: "Trees",
      title: "Trees",
      layer_type: "Display",
      layerid: "27",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/27",
      popup: {},
    },
    {
      number: "11",
      name: "parks",
      title: "parks",
      layer_type: "Background",
      layerid: "49",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/49",
      popup: {},
    },
    {
      number: "12",
      name: "ground maintenance sites",
      title: "ground maintenance sites",
      layer_type: "Background",
      layerid: "42",
      url: "https://utility.arcgis.com/usrsvcs/servers/25557d31a8ba43408a6ad3a0495aa290/rest/services/AGOL/Verint_PublicFaultReporting/MapServer/42",
      popup: {},
    },
  ],
};

proj4.defs([
  [
    "EPSG:4326",
    "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
  ],
  [
    "SR-ORG:7483",
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
  ],
  [
    "EPSG:27700",
    "+title=OSGB 1936 / British National Grid (UTM) +proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs",
  ],
]);

var store_layer_attr = { main_attribute: {}, background_attribute: {} };

function do_KDF_Ready_esriMap() {
  fetchSccRing();
  var symbol;
  require(["esri/symbols/PictureMarkerSymbol"], function (PictureMarkerSymbol) {
    symbol = {
      type: "picture-marker",
      url: "https://cdn.uk.empro.verintcloudservices.com/tenants/sheffield/Images/map-pin.png",
      width: 20,
      height: 35,
      yoffset: 10,
    };
  });

  markerSymbol = symbol;
  KDF.customdata("get_osmap_api_key", "do_KDF_Ready_esriMap", true, false, {});

  $("#map_container").html("");
}

function initialize_map(map_param) {
  let map, finalUrl;
  finalUrl = `https://api.os.uk/maps/raster/v1/zxy/Road_3857/{level}/{col}/{row}.png?key=${map_param}`;

  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/WebTileLayer",
    "esri/Graphic",
    "esri/layers/TileLayer",
    "esri/Basemap",
    "esri/geometry/Point",
    "esri/geometry/SpatialReference",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GroupLayer",
    "esri/widgets/Search",
    "esri/geometry/Extent",
  ], function (
    Map,
    MapView,
    WebTileLayer,
    Graphic,
    TileLayer,
    Basemap,
    Point,
    SpatialReference,
    GraphicsLayer,
    FeatureLayer,
    GroupLayer,
    Search,
    Extent
  ) {
    let positionLayer = new GraphicsLayer();
    $("#dform_widget_html_ahtm_map_container").append(
      '<div class="dform_gis_reversegeo"></div>'
    );

    const tileLayer = new WebTileLayer({ urlTemplate: finalUrl });

    let pt = new Point({
      x: 435219,
      y: 387419,
      spatialReference: {
        wkid: 27700,
      },
    });

    map = new Map({ layers: [tileLayer] });
    esrimap = map;
    map.add(positionLayer);
    streetMapView = new MapView({
      container: "map_container",
      map: map,
      zoom: 12,
      center: pt,
      constraints: {
        minZoom: 7,
        maxZoom: 20,
        rotationEnabled: false,
      },
    });

    // Define the extent for Sheffield, UK
    const sheffieldExtent = new Extent({
      xmin: -1.5311,
      ymin: 53.321,
      xmax: -1.3483,
      ymax: 53.456,
      spatialReference: { wkid: 27700 },
    });

    // Initialize the Search widget, constraining to Sheffield's extent
    const searchWidget = new Search({
      view: streetMapView,
      searchAllEnabled: false,
      popupEnabled: true,
      popupOpenOnSelect: true,
      sources: [
        {
          layer: new FeatureLayer({
            url: "https://utility.arcgis.com/usrsvcs/servers/97cfdc3a164c48219826b907c0a5064f/rest/services/AGOL/Boundaries/MapServer/0", // Sheffield boundary layer
          }),
          // searchFields: ["name"], // Replace with the field containing names if available
          displayField: "name",
          exactMatch: false,
          outFields: ["*"],
          name: "Sheffield Search",
          placeholder: "",
          filter: {
            geometry: sheffieldExtent,
          },
        },
      ],
    });

    // Add Search widget to the top-right corner of the map
    streetMapView.ui.add(searchWidget, {
      position: "top-right",
    });

    streetMapView.on("click", mapClick);

    mapZoomLevel = streetMapView.zoom;
    $(`#dform_${KDF.kdf().form.name}`).trigger("_KDF_mapReady", [
      null,
      "arcgis",
      "map_container",
      map,
      positionLayer,
      null,
      null,
      null,
    ]);

    districtLayer = new FeatureLayer({
      id: "scc_boundary",
      url: "https://utility.arcgis.com/usrsvcs/servers/97cfdc3a164c48219826b907c0a5064f/rest/services/AGOL/Boundaries/MapServer/0",
    });
    districtLayer.renderer = {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
          color: [0, 0, 0, 255],
          width: 4,
        },
      },
    };
    esrimap.add(districtLayer);

    if (KDF.kdf().form.complete !== "Y") {
      streetMapView.when(function () {
        map_extent_change();
      });
    }

    var layerGroup = new GroupLayer({
      title: "GIS Layers",
      visible: true,
    });

    groupLayer = layerGroup;
  });
}

function do_KDF_mapReady_esriMap(map, positionLayer) {
  streetMapPositionLayer = positionLayer;

  if (
    KDF.kdf().form.complete === "Y" ||
    KDF.kdf().viewmode === "U" ||
    KDF.kdf().viewmode === "R"
  ) {
    var lon = KDF.getVal("le_gis_lon");
    var lat = KDF.getVal("le_gis_lat");

    if (lon !== "" && lat !== "") {
      //showMapLocation(lon, lat, true);
      require([
        "esri/geometry/Point",
        "esri/geometry/SpatialReference",
      ], function (Point, SpatialReference) {
        centerpoint = new Point({
          x: KDF.getVal("le_gis_lon"),
          y: KDF.getVal("le_gis_lat"),
          spatialReference: new SpatialReference({ wkid: 4326 }),
        });

        streetMapView.when(function () {
          if (KDF.kdf().viewmode === "U" || KDF.kdf().viewmode === "R") {
            map_extent_change();

            if (
              typeof KDF.getVal("txt_layerid") !== "undefined" &&
              KDF.getVal("txt_layerid") != ""
            ) {
              if (!asset_init) {
                initializeAssetLayer(streetMapView.zoom);
              }
            }
          }
          streetMapView.goTo({
            center: centerpoint,
            zoom: 18,
          });
        });

        addPoint(streetMapView, centerpoint, markerSymbol);
      });

      // setSelectedAddress(KDF.getVal("txt_site_name"), "show");
      $(".popup").text(KDF.getVal("txt_site_name"));
      setRequiredStateByAlias("postcode", "not required");
    }
  }
}

function mapClick(evt) {
  console.log('mapClick', evt)
  KDF.setVal("txt_site_name", "");
  KDF.setVal("txt_site_code", "");
  KDF.setVal("txt_feature_name", "");
  KDF.setVal("txt_feature_type", "");
  KDF.setVal("txt_responsibility", "");
  KDF.setVal("txt_prestige", "");
  setValuesToInputFields([
    { alias: "property", value: "" },
    { alias: "streetName", value: "" },
    { alias: "city", value: "" },
    { alias: "postCode", value: "" },
    { alias: "fullAddress", value: "" },
    { alias: "uprn", value: "" },
    { alias: "usrn", value: "" },
    { alias: "siteName", value: "" },
    { alias: "siteCode", value: "" },
  ]);
  
  const selectedAddressSpan = document.querySelector(`#${getCurrentPageId()} #selected-address`);
  if (selectedAddressSpan) {
    selectedAddressSpan.textContent = defaultSelectedAddressMessage;
    selectedAddressSpan.classList.remove('dform_validationMessage');
  }

  $(".esriPopup").hide();
  if (KDF.kdf().form.complete !== "Y" || KDF.kdf().viewmode === "U") {
    selectedLocation = "";
    KDF.setVal("le_gis_lat", "");
    KDF.setVal("le_gis_lon", "");
    KDF.setVal("le_gis_latgeo", "");
    KDF.setVal("le_gis_longeo", "");
    KDF.setVal("txta_location_address", "");
    KDF.hideWidget("ahtm_map_location_error");
    var screenPoint = {
      x: evt.x,
      y: evt.y,
    };
    streetMapView.hitTest(screenPoint).then(function (response) {
      let graphic = response.results;
      selectedLocation = evt.mapPoint;
      var source = new proj4.Proj("SR-ORG:7483");
      var dest = new proj4.Proj("EPSG:27700");
      var dest4326 = new proj4.Proj("EPSG:4326");
      var convertPointP4 = proj4.toPoint([selectedLocation.x, selectedLocation.y]);
      var convertPoint4326 = proj4.toPoint([selectedLocation.x, selectedLocation.y]);

      proj4.transform(source, dest, convertPointP4);
      proj4.transform(source, dest4326, convertPoint4326);
      KDF.setVal("le_gis_lon", convertPoint4326.x.toString());
      KDF.setVal("le_gis_lat", convertPoint4326.y.toString());
      mapX = convertPointP4.x.toString();
      mapY = convertPointP4.y.toString();

      var mapX_4326 = convertPoint4326.x.toString();
      var mapY_4326 = convertPoint4326.y.toString();

      store_layer_attr.main_attribute = {};
      store_layer_attr.background_attribute = {};

      if (!withinSccCheck(convertPointP4)) {
        if (selectedAddressSpan) {
          selectedAddressSpan.textContent = "Choose a location inside the Sheffield area";
          selectedAddressSpan.classList.add('dform_validationMessage');
          selectedAddressSpan.style.display = 'block';
        }
        $("#map_container").addClass("map_container_error");
        //clear location information when out of our area
        selectedLocation = "";
        KDF.setVal("le_gis_lat", "");
        KDF.setVal("le_gis_lon", "");
        KDF.setVal("le_gis_latgeo", "");
        KDF.setVal("le_gis_longeo", "");
        KDF.setVal("txta_location", "");
        KDF.setVal("txt_site_name", "");
        KDF.setVal("txt_location_UPRN", "");
        KDF.setVal("txt_location_USRN", "");

        $(`#dform_${KDF.kdf().form.name}`).trigger("_KDF_mapOutsideBoundary", [
          null,
        ]);
      } else {
        $("#map_container").removeClass("map_container_error");

        if (streetMapView.zoom >= 18) {
          streetMapView.goTo({
            center: evt.mapPoint,
          });
        } else if (streetMapView.zoom < 18) {
          streetMapView.goTo({
            center: evt.mapPoint,
            zoom: 18,
          });
        }

        let foundFeatureGraphic = null;
        let sccBoundaryClicked = false;

        if (graphic && graphic.length > 0) {
          graphic.forEach(function (arrayItem) {
            if (arrayItem.layer && arrayItem.layer.id === "scc_boundary") {
              sccBoundaryClicked = true;
            } else if (arrayItem.layer && arrayItem.layer.id !== "scc_boundary" && !foundFeatureGraphic) {
              // Prioritize and save the first non-boundary graphic found
              foundFeatureGraphic = arrayItem;
            }
          });
        }

        if (foundFeatureGraphic) {
          // A specific feature (non-boundary) was clicked
          streetMapPositionLayer.removeAll();
          const layerAttributes = foundFeatureGraphic.graphic.attributes;
          const layerName = foundFeatureGraphic.layer.id.toString();

          mapX = convertPointP4.x.toString();
          mapY = convertPointP4.y.toString();
          KDF.setVal("le_gis_lon", mapX_4326);
          KDF.setVal("le_gis_lat", mapY_4326);

          store_layer_attr.main_attribute = {};
          store_layer_attr.main_attribute = layerAttributes;
          store_layer_attr.main_attribute.layername = layerName;
          setValuesToInputFields([
            { alias: "easting", value: mapX },
            { alias: "northing", value: mapY },
          ]);
          KDF.customdata("reverse_geocode_osmap", "asset_code", true, true, {
            longitude: mapX,
            latitude: mapY,
          });
        } else {
          // Only the boundary or no feature was clicked, handle as a general location click
          addPoint(streetMapView, evt.mapPoint, markerSymbol);
          $(".esriPopup").hide();
          mapPoint = evt.mapPoint;
          addPoint(streetMapView, mapPoint, markerSymbol);

          mapX = convertPointP4.x.toString();
          mapY = convertPointP4.y.toString();
          KDF.setVal("le_gis_lon", mapX_4326);
          KDF.setVal("le_gis_lat", mapY_4326);
          setValuesToInputFields([
            { alias: "easting", value: mapX },
            { alias: "northing", value: mapY },
          ]);
          KDF.customdata("reverse_geocode_osmap", "mapClick", true, true, {
            longitude: mapX,
            latitude: mapY,
          });

          if (vmap_config.mapClickType == "Background") {
            KDF.customdata("feature_layer_request", "mapClick", true, true, {
              url: vmap_config.featureLayers[BG_layer].url,
              longitude: mapX,
              latitude: mapY,
              distance: "5",
            });
          }
          $(`#dform_${KDF.kdf().form.name}`).trigger("_KDF_clearAttribute", [
            null,
          ]);
        }
      }
    });
  }
}

function retrieveAttribute() {
  console.log('retrieveAttribute', store_layer_attr)
  $(`#dform_${KDF.kdf().form.name}`).trigger("_Selected_Layer", [
    null,
    "asset_layer",
    store_layer_attr,
  ]);
}

function map_extent_change() {
  if (
    typeof KDF.getVal("txt_layerid") !== "undefined" &&
    KDF.getVal("txt_layerid") !== ""
  ) {
    var arrayCount;
    var layerId = KDF.getVal("txt_layerid").split(",");
    for (var i = 0; i < layerId.length; i++) {
      arrayCount = layerId[i];
      if (vmap_config.featureLayers[arrayCount].layer_type == "Background") {
        BG_layer = vmap_config.featureLayers[arrayCount].number;
        vmap_config.mapClickType = "Background";
      }
    }
  }

  require([
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/core/reactiveUtils",
  ], function (MapView, FeatureLayer, ReactiveUtils) {
    if (KDF.kdf().viewmode !== "R") {
      assetWatch = ReactiveUtils.when(
        () => [streetMapView.stationary, streetMapView.interacting],
        (a, b) => {
          if (!viewInitialLoad) {
            xminE = streetMapView.extent.xmin;
            xmaxE = streetMapView.extent.xmax;
            yminE = streetMapView.extent.ymin;
            ymaxE = streetMapView.extent.ymax;

            viewInitialLoad = true;
          }
          if (a[0] && !b[0]) {
            if (
              xminE !== streetMapView.extent.xmin &&
              xmaxE != streetMapView.extent.xmax &&
              yminE !== streetMapView.extent.ymin &&
              ymaxE !== streetMapView.extent.ymax
            ) {
              KDF.hideWidget("ahtm_map_location_error");

              if (parseInt(streetMapView.zoom) >= 16) {
                mapZoomLevel = streetMapView.zoom;
                if (
                  typeof KDF.getVal("txt_layerid") !== "undefined" &&
                  KDF.getVal("txt_layerid") != ""
                ) {
                  if (!asset_init) {
                    initializeAssetLayer(streetMapView.zoom);
                  } else if (asset_init) {
                    var arrayCount;

                    var layerId = KDF.getVal("txt_layerid").split(",");
                    for (var i = 0; i < layerId.length; i++) {
                      arrayCount = layerId[i];
                      if (
                        vmap_config.featureLayers[arrayCount].layer_type ==
                        "Display"
                      ) {
                        esrimap.findLayerById(
                          vmap_config.featureLayers[arrayCount].name
                        ).visible = true;
                      }
                    }
                  }
                }
              }

              if (parseInt(streetMapView.zoom) < 16) {
                var arrayCount;
                if (asset_init) {
                  var layerId = KDF.getVal("txt_layerid").split(",");
                  for (var i = 0; i < layerId.length; i++) {
                    arrayCount = layerId[i];
                    if (
                      vmap_config.featureLayers[arrayCount].layer_type ==
                      "Display"
                    ) {
                      esrimap.findLayerById(
                        vmap_config.featureLayers[arrayCount].name
                      ).visible = false;
                    }
                  }
                }
              }
            }

            xminE = streetMapView.extent.xmin;
            xmaxE = streetMapView.extent.xmax;
            yminE = streetMapView.extent.ymin;
            ymaxE = streetMapView.extent.ymax;
          }
        }
      );
    }
  });
}

function do_KDF_optionSelected_esriMap(field, label, val) {
  if (field === "ps_property_search_map_id" && val !== null) {
    if (val !== "") {
      KDF.customdata(
        "retrieve-property",
        "do_KDF_optionSelected_esriMap",
        true,
        true,
        { object_id: val }
      );
    }
  }
}

function do_KDF_Custom_esriMap(action, response) {
  console.log('do_KDF_Custom_esriMap')
  if (action === "reverse_geocode_osmap") {
    $("#map_container").removeClass("map_container_error");
    $("#map_error").remove();
    KDF.setVal("txt_location_UPRN", "");
    KDF.setVal("txt_location_USRN", "");

    if (response.actionedby == "propertySearch") {
      $("#dform_" + KDF.kdf().form.name).trigger("_KDF_clearAttribute", [null]);
    }

    if (response.data.outcome == "failed") {
      // check consolidated layer
      return;
    }

    if (response.data.return_type == "street_search") {
      var parseResult = JSON.parse(response.data.result.replace(/\\/g, ""));
      if (parseResult.features.length < 1) {
        if (!isObjEmpty(store_layer_attr.background_attribute)) {
          setValuesToInputFields([
            {
              alias: "fullAddress",
              value: store_layer_attr.background_attribute.sitename,
            },
            {
              alias: "siteName",
              value: store_layer_attr.background_attribute.sitename,
            },
            {
              alias: "siteCode",
              value: store_layer_attr.background_attribute.sitecode,
            },
            { alias: "responsibility", value: "PWC" },
          ]);
          // setSelectedAddress(
          //   store_layer_attr.background_attribute.sitename,
          //   "show"
          // );
          $(".popup").text(store_layer_attr.background_attribute.sitename);
          setRequiredStateByAlias("postcode", "not required");
          return;
        } else {
          // setSelectedAddress("", "hide");
          $(".popup").text("");
          setRequiredStateByAlias("postcode", "required");
          return;
        }
      }

      var parseFeature = parseResult.features[0].attributes;

      setValuesToInputFields([
        { alias: "streetName", value: parseFeature["streetname"] },
        { alias: "fullAddress", value: parseFeature["streetname"] },
        { alias: "uprn", value: parseFeature["usrn"] },
        { alias: "siteName", value: parseFeature["streetname"] },
      ]);
      // setSelectedAddress(parseFeature["streetname"], "show");
      $(".popup").text(parseFeature["streetname"]);
      setRequiredStateByAlias("postcode", "not required");
    } else {
      setValuesToInputFields([
        { alias: "streetName", value: response.data.description },
        { alias: "fullAddress", value: response.data.description },
        { alias: "uprn", value: response.data.UPRN },
        { alias: "siteName", value: response.data.description },
        { alias: "siteCode", value: response.data.UPRN },
      ]);

      var source = new proj4.Proj("EPSG:27700");
      var dest4326 = new proj4.Proj("EPSG:4326");
      var convertPoint4326 = new proj4.Point(
        response.data.longitude,
        response.data.latitude
      );
      proj4.transform(source, dest4326, convertPoint4326);
      KDF.setVal("le_gis_lon", convertPoint4326.x.toString());
      KDF.setVal("le_gis_lat", convertPoint4326.y.toString());

      var originCoor = proj4("EPSG:27700", "EPSG:4326", [
        response.data.longitude,
        response.data.latitude,
      ]);
      var propertyCoor = proj4("EPSG:27700", "EPSG:4326", [
        response.data.easting,
        response.data.northing,
      ]);
      var p2 = { x: originCoor[0], y: originCoor[1] };
      var p1 = { x: propertyCoor[0], y: propertyCoor[1] };

      let {
        addressNumber,
        streetName,
        town,
        postcode,
        fullAddress,
        propertyId,
        UPRN,
        streetId,
        USRN,
        easting,
        northing,
      } = response.data;

      property = formatTitleCase(addressNumber);
      streetName = formatTitleCase(streetName);
      fullAddress = `${formatTitleCase(property)} ${formatTitleCase(
        streetName
      )}, ${town}, ${postcode}`;
      setValuesToInputFields([
        { alias: "property", value: property },
        { alias: "streetName", value: streetName },
        { alias: "city", value: town },
        { alias: "postCode", value: postcode },
        { alias: "fullAddress", value: fullAddress },
        { alias: "uprn", value: UPRN },
        { alias: "usrn", value: USRN },
        { alias: "siteName", value: streetName },
        { alias: "siteCode", value: USRN },
        // { alias: "easting", value: easting },
        // { alias: "northing", value: northing },
      ]);

      const selectedAddressSpan = document.querySelector(`#${getCurrentPageId()} #selected-address`);
      if (selectedAddressSpan) {
        selectedAddressSpan.textContent = fullAddress;
      }

      // setSelectedAddress(fullAddress, "show");
      // $(".popup").text(streetName);
      setRequiredStateByAlias("postcode", "not required");
    }
  }

  if (action === "feature_layer_request") {
    console.log('feature_layer_request')
    var parseResult = JSON.parse(response.data.result.replace(/\\/g, ""));
    var parseFeature = parseResult.features;
    var nearestFeature, nearestDistance;
    var initiateLoop = true;
    var current_radius = Number(response.data.distance);

    if (parseFeature.length < 1) {
      current_radius += 10;

      if (current_radius < 100) {
        KDF.customdata(
          "feature_layer_request",
          "do_KDF_Custom_esriMap",
          true,
          true,
          {
            url: vmap_config.featureLayers[BG_layer].url,
            longitude: response.data.longitude,
            latitude: response.data.latitude,
            distance: current_radius.toString(),
          }
        );
      }
    }
    store_layer_attr.main_attribute = {};
    store_layer_attr.main_attribute = parseFeature;
  } else if (action == "get_osmap_api_key") {
    initialize_map(response.data.map_param);
  } else if (action == "gis_background_layer") {
    var parseResult = JSON.parse(response.data.result.replace(/\\/g, ""));
    var parseFeature = parseResult.features;

    store_layer_attr.background_attribute = {};

    if (parseFeature.length > 0) {
      store_layer_attr.background_attribute = parseFeature[0].attributes;
    }

    retrieveAttribute();
  }

  if (action === "retrieve-property") {
    var coor = proj4("EPSG:27700", "EPSG:4326", [
      response.data.easting,
      response.data.northing,
    ]);
    var centerpoint;
    require([
      "esri/geometry/Point",
      "esri/geometry/SpatialReference",
    ], function (Point, SpatialReference) {
      centerpoint = new Point({
        x: response.data.easting,
        y: response.data.northing,
        spatialReference: new SpatialReference({ wkid: 27700 }),
      });
    });

    streetMapView.goTo({
      center: centerpoint,
      zoom: 20,
    });
    addPoint(streetMapView, centerpoint, markerSymbol);

    if (vmap_config.mapClickType == "Background") {
      KDF.customdata(
        "feature_layer_request",
        "do_KDF_Custom_esriMap",
        true,
        true,
        {
          url: vmap_config.featureLayers[KDF.getVal("txt_layerid")].url,
          longitude: response.data.easting,
          latitude: response.data.northing,
          distance: "5",
        }
      );
    }

    KDF.customdata(
      "reverse_geocode_osmap",
      "do_KDF_Custom_esriMap",
      true,
      true,
      {
        longitude: response.data.easting,
        latitude: response.data.northing,
      }
    );

    $(".esriPopup").hide();
    // remove txt_selected_x
    KDF.setVal("txt_selected_x", centerpoint.x);
    KDF.setVal("txt_selected_y", centerpoint.y);

    KDF.setVal("le_gis_lon", coor[0]);
    KDF.setVal("le_gis_lat", coor[1]);
    KDF.setVal("le_gis_lon_alloy", coor[0]);
    KDF.setVal("le_gis_lat_alloy", coor[1]);
    KDF.setVal("le_gis_longeo", centerpoint.longitude);
    KDF.setVal("le_gis_latgeo", centerpoint.latitude);
    KDF.setVal("le_title", response.data.description);
    KDF.setVal("txt_location_UPRN", response.data.UPRN);
    KDF.setVal("txt_location_ward_code", response.data.WardRef);
    KDF.setVal("txt_location_ward_name", response.data.WardName);

    // setSelectedAddress(response.data.address, "show");
    $(".popup").text(response.data.address);
    setRequiredStateByAlias("postcode", "not required");
    KDF.hideWidget("ahtm_map_location_error");
    selectedLocation = centerpoint;

    KDF.customdata(
      "gis_background_layer",
      "do_KDF_Custom_esriMap",
      true,
      true,
      {
        url: vmap_config.consolidated_layer_url,
        longitude: response.data.easting,
        latitude: response.data.northing,
        distance: 20,
      }
    );
  }
}

function isObjEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}

function initializeAssetLayer(zoomLevel) {
  var layerId = KDF.getVal("txt_layerid").split(",");
  var arrayCount;
  require(["esri/layers/FeatureLayer"], function (FeatureLayer) {
    for (var i = 0; i < layerId.length; i++) {
      arrayCount = layerId[i];
      if (
        typeof esrimap.findLayerById(
          vmap_config.featureLayers[arrayCount].name
        ) == "undefined" &&
        vmap_config.featureLayers[arrayCount].layer_type == "Display"
      ) {
        assetObj = new FeatureLayer({
          id: vmap_config.featureLayers[arrayCount].name,
          url: vmap_config.featureLayers[arrayCount].url,
          popupTemplate: vmap_config.featureLayers[arrayCount].popup,
          title: vmap_config.featureLayers[arrayCount].title,
          outFields: "*",
        });

        groupLayer.add(assetObj);
      }
    }
  });

  esrimap.add(groupLayer);
  asset_init = true;
  if (
    KDF.kdf().access == "agent" &&
    KDF.kdf().form.name === "asset_responsibility_map"
  ) {
    initLayerList();
  }
}

function initLayerList() {
  var allLayers = esrimap.allLayers.items;
  for (var i = 0; i < allLayers.length; i++) {
    arrayCount = allLayers[i];
    if (i == 0 || i == 1 || i == 2) {
      esrimap.findLayerById(arrayCount.id).listMode = "hide";
    }
  }

  require(["esri/widgets/LayerList"], (LayerList) => {
    let layerList = new LayerList({
      view: streetMapView,
      collapsed: true,
      label: "List of GIS layer",
    });

    layerList.visibleElements = {
      collapseButton: true,
    };
    layerList.collapsed = true;
    streetMapView.ui.add(layerList, {
      position: "top-right",
    });
  });
}

function addPoint(map, point, markerSymbol) {
  streetMapPositionLayer.removeAll();

  var pointGraphic;

  require(["esri/geometry/Point", "esri/Graphic"], function (Point, Graphic) {
    pointGraphic = new Graphic(new Point(point), markerSymbol);
    streetMapPositionLayer.add(pointGraphic);
  });

  return pointGraphic;
}

function withinSccCheck(geometry) {
  var result;
  require([
    "esri/geometry/Polygon",
    "esri/geometry/geometryEngine",
    "esri/geometry/Point",
    "esri/geometry/SpatialReference",
  ], function (Polygon, geometryEngine, Point, SpatialReference) {
    var clickedPoint = new Polygon({
      hasZ: false,
      hasM: false,
      rings: [[[geometry.x, geometry.y]]],
      spatialReference: { wkid: 27700 },
    });

    let new_point = new Point(
      geometry.x,
      geometry.y,
      new SpatialReference({ wkid: "27700" })
    );
    var isWithin = geometryEngine.within(new_point, scc_boundary_ring);
    if (isWithin) {
      result = true;
    } else {
      result = false;
    }
  });
  return result;
}

function fetchSccRing() {
  var apalah;
  $.ajax({
    url: "https://utility.arcgis.com/usrsvcs/servers/97cfdc3a164c48219826b907c0a5064f/rest/services/AGOL/Boundaries/MapServer/0/query?&where=1%3D1&geometryType=esriGeometryEnvelope&f=json",
    success: function (result) {
      require([
        "esri/geometry/Polygon",
        "esri/geometry/geometryEngine",
      ], function (Polygon, geometryEngine) {
        scc_boundary_ring = new Polygon({
          hasZ: false,
          hasM: false,
          rings: result.features[0].geometry.rings[0],
          spatialReference: { wkid: 27700 },
        });
      });
    },
  });
}

function plotLocationOnMap(easting, northing) {
  require([
    "esri/geometry/Point",
    "esri/geometry/projection"
  ], function (Point, projection) {

    // Create OSGB point
    const osgbPoint = new Point({
      x: parseFloat(easting),
      y: parseFloat(northing),
      spatialReference: { wkid: 27700 }
    });

    // Project to Web Mercator (map’s spatial reference)
    projection.load().then(function () {
      const wmPoint = projection.project(osgbPoint, streetMapView.spatialReference);

      // Zoom to location
      streetMapView.goTo({ center: wmPoint, zoom: 18 }).then(() => {

        // Convert to screen coordinates
        const screenPoint = streetMapView.toScreen(wmPoint);

        // Build a realistic fake event
        const fakeEvt = {
          type: "click",
          pointerType: "mouse",
          button: 0,
          buttons: 0,
          x: screenPoint.x,
          y: screenPoint.y,
          screenPoint: { x: screenPoint.x, y: screenPoint.y },
          mapPoint: wmPoint,
          native: { isTrusted: true },
          timestamp: performance.now(),
          cancelable: false
        };

        // Trigger mapClick like a real click
        mapClick(fakeEvt);
      });
    });
  });
}