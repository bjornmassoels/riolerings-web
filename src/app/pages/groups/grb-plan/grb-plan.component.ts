import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { transform, fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector'; // Import VectorLayer
import VectorSource from 'ol/source/Vector'; // Import VectorSource
import Feature from 'ol/Feature'; // Import Feature
import Point from 'ol/geom/Point'; // Import Point
import { Circle, Fill, Stroke, Style } from 'ol/style'; // Import Style utilities
import { TileWMS } from 'ol/source';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { FormService } from '../../../../services/form.service';
import { Group } from '../../../../models/groups';
import { NgForOf } from '@angular/common';
import { NbCheckboxModule } from '@nebular/theme';

proj4.defs("EPSG:31370", "+proj=lcc +lat_1=49.8333339 +lat_2=51.1666672333 +lat_0=90 +lon_0=4.3569397222 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-99.059,53.322,-112.486,0.419,-0.83,1.885,-1 +units=m +no_defs");
register(proj4);

@Component({
  selector: 'grb-plan',
  standalone: true,
  templateUrl: './grb-plan.component.html',
  imports: [
    NgForOf,
    NbCheckboxModule,
  ],
  styleUrls: ['./grb-plan.component.scss'], // Correct 'styleUrl' to 'styleUrls'
})
export class GrbPlanComponent implements OnInit {
  layersConfig = {
    'Adp': { visible: false, layer: null , benaming: 'Administratieve perceel' },
    'Gbg': { visible: true, layer: null, benaming: 'Gebouw aan de grond' },
    'Gba': { visible: false, layer: null, benaming: 'Gebouwaanhorigheid' },
    'Wbn': { visible: false, layer: null, benaming: 'Wegbaan' },
    'Knw': { visible: false, layer: null, benaming: 'Kunstwerk' },
    'Wgr': { visible: false, layer: null , benaming: 'Gracht'},
    'Wtz': { visible: false, layer: null , benaming: 'Watergang'},
    'Wlas': { visible: false, layer: null, benaming: 'VHA-waterloopsgment' },
    'Trn': { visible: false, layer: null, benaming: 'Terrein' },
  };

  map: Map;
  currentGroup: Group;
  vectorSource: VectorSource; // Declare the vectorSource

  constructor(private formService: FormService) {
  }
  initializeLayers() {
    Object.keys(this.layersConfig).forEach(key => {
      const layer = new TileLayer({
        source: new TileWMS({
          url: 'http://51.20.73.63:8080/geoserver/ne/wms',
          params: {
            'LAYERS': `ne:${key}`,
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            'TILED': true,
            'SRS': 'EPSG:31370'
          },
          serverType: 'geoserver'
        }),
        visible: this.layersConfig[key].visible
      });
      this.layersConfig[key].layer = layer;
      this.map.addLayer(layer);
    });
  }
  ngOnInit(): void {
    this.currentGroup = this.formService.currentGroup;
    console.log(this.currentGroup);
    this.initMap();
    this.initializeLayers();
    this.setupLambertCoordinatesOfProject();
  }
  toggleLayer(layerKey: string) {
    const layer = this.layersConfig[layerKey].layer;
    const visibility = this.layersConfig[layerKey].visible;
    layer.setVisible(!visibility);
    this.layersConfig[layerKey].visible = !visibility;
  }

  initMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [

      ],
      view: new View({
        projection: 'EPSG:31370', // Set the projection of the view
        center: [
          +this.currentGroup.projectList[0].droogWaterAfvoer.xCoord,
          +this.currentGroup.projectList[0].droogWaterAfvoer.yCoord
        ], // Approximate center of Belgium in Lambert 2008
        zoom: 16
      })
    });

    // Prepare a vector layer and source for features like points
    this.vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: this.vectorSource
    });
    this.map.addLayer(vectorLayer);
  }

  private setupLambertCoordinatesOfProject() {
    // Loop over each project in the current group's project list
    this.currentGroup.projectList.forEach(project => {
      // Use the coordinates directly as they are already in EPSG:31370
      const lambertCoordinatesDWA = [
        +project.droogWaterAfvoer.xCoord,
        +project.droogWaterAfvoer.yCoord,
        +project.droogWaterAfvoer.zCoord
      ]; // Assuming 2D coordinates, remove zCoord if not used in positioning on the map

      // Create a point feature at the provided coordinates
      const pointFeatureDWA = new Feature({
        geometry: new Point(lambertCoordinatesDWA)
      });

      // Optionally, style the point
      pointFeatureDWA.setStyle(new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({color: 'red'}),
          stroke: new Stroke({color: 'black', width: 1})
        })
      }));

      // Add the feature to the vector source
      this.vectorSource.addFeature(pointFeatureDWA);

      const lambertCoordinatesRWA = [
        +project.regenWaterAfvoer.xCoord,
        +project.regenWaterAfvoer.yCoord,
        +project.regenWaterAfvoer.zCoord
      ]; // Assuming 2D coordinates, remove zCoord if not used in positioning on the map

      // Create a point feature at the provided coordinates
      const pointFeatureRWA = new Feature({
        geometry: new Point(lambertCoordinatesRWA)
      });

      // Optionally, style the point
      pointFeatureRWA.setStyle(new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({color: 'blue'}),
          stroke: new Stroke({color: 'black', width: 1})
        })
      }));

      // Add the feature to the vector source
      this.vectorSource.addFeature(pointFeatureRWA);
    });

    // Optionally, you might want to set the map center to the first project's coordinates
    // to ensure the map is focused on relevant area immediately after loading
    if (this.currentGroup.projectList.length > 0) {
      const firstProjectCoordinates = [
        +this.currentGroup.projectList[0].droogWaterAfvoer.xCoord,
        +this.currentGroup.projectList[0].droogWaterAfvoer.yCoord
      ];
      this.map.getView().setCenter(firstProjectCoordinates);
    }
  }

  protected readonly Object = Object;
}
