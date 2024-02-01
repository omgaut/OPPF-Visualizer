import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {



  private map: mapboxgl.Map | null = null;
  private markers: mapboxgl.Marker[] = [];
  private data: any[] = [];
  // private data: [string, string, string, string][] = [];


  constructor() {}
  public ngOnInit(): void {
    (mapboxgl as typeof mapboxgl).accessToken = 'pk.eyJ1Ijoib21nYXV0YW0iLCJhIjoiY2xsNnYwcG1nMGlpeDNwcXByeGhzMmxwZCJ9.I-QLZzLNRblwFDomm4HibQ';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 2
    });

    this.loadData();

    this.map.on('load', () => {
      this.data.forEach(([longitude, latitude, name, address]) => {
        const lngLat: [number, number] = [parseFloat(longitude), parseFloat(latitude)];
        const popupHtml = `<h3>${name}</h3><p>${address}</p>`;
      
        const marker = new mapboxgl.Marker()
          .setLngLat(lngLat)
          .setPopup(new mapboxgl.Popup().setHTML(popupHtml))
          .addTo(this.map!);
      
        this.markers.push(marker);
        console.log("check");
      });
    });
  }

  private loadData(): void {
    const workbook = XLSX.readFile('./OPPF_Data.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    this.data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
    this.data = this.data.map((row: any[]) => {
      const [longitudeLatitude, name, address] = row;
      const [longitude, latitude] = longitudeLatitude.split(',');
  
      return [longitude, latitude, name, address];
    });
  }

  public ngOnDestroy(): void {
    this.markers.forEach(marker => marker.remove());
    this.map!.remove();
  }
}



