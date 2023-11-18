import React from "react";
import { Map, GoogleApiWrapper, Marker, IMapProps } from "google-maps-react";

interface MapContainerProps extends IMapProps {
  google: any; // El tipo de google podría variar, asegúrate de manejarlo de manera adecuada
}

export type MapCustomProps = {
  lat: number;
  lng: number;
  onChangePos: ({ lat, lng }: { lat: number; lng: number }) => void;
  styles?: React.CSSProperties;
};

const MapContainer = ({
  lat,
  lng,
  styles = {
    position: "relative",
    height: "400px",
    width: "800px",
    top: "0px",
    left: "-400px",
  },
  onChangePos,
  ...props
}: MapContainerProps & MapCustomProps) => {
  const mapStyles: React.CSSProperties = {
    position: "relative",
    height: "100px",
    width: "200px",
    top: "0px",
    left: "-400px",
  };

  const initialPosition = {
    lat, // Latitud
    lng, // Longitud
  };

  return (
    <>
      {/*//@ts-ignore*/}
      <Map
        google={props.google}
        zoom={14}
        style={styles}
        initialCenter={initialPosition}
        onClick={(mapProps: any, map: any, clickEvent: any) => {
          onChangePos({
            lat: clickEvent.latLng.lat(),
            lng: clickEvent.latLng.lng(),
          });
        }}
      >
        <Marker
          //@ts-ignore
          position={initialPosition}
        />
      </Map>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyAUFmxLQlygxkGuhrkiFQsnPTuMo3Gv9WM", // Reemplaza con tu API Key de Google Maps
})(MapContainer);

//AIzaSyAUFmxLQlygxkGuhrkiFQsnPTuMo3Gv9WM
