import {  Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ngx-google-maps-popup-dialog',
  templateUrl: './googleMapsLocatiePopup.component.html',
  styleUrls: ['./googleMapsLocatiePopup.component.css']
})
export class GoogleMapsLocatiePopupComponent implements OnInit {
  markerOptions: google.maps.MarkerOptions;
  markerPosition: google.maps.LatLngLiteral;
  center: google.maps.LatLngLiteral;
  map: google.maps.Map;


  geschatteLocatie: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: { xCoord: number; yCoord: number, soort: string }) {
  }

  ngOnInit(): void {
    if (this.data.xCoord && this.data.yCoord) {
      this.center = {
        lng: this.data.xCoord,
        lat: this.data.yCoord
      };
      this.markerOptions = { draggable: false };
      // Marker position
      this.markerPosition = this.center;
    }
  }

  getEstimatedLocation() {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.data.yCoord},${this.data.xCoord}&key=AIzaSyDmXtchjlshzF2PShb3vEdlzEY4Vkkh-nw`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const address = data.results[0].formatted_address;
          this.geschatteLocatie = address;
          // You can parse the address to extract street name and huisnummer
        }
      });
  }
}
