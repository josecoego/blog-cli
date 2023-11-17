import React from "react";
import { Map, GoogleApiWrapper, Marker, IMapProps } from "google-maps-react";

interface MapContainerProps extends IMapProps {
  google: any; // El tipo de google podría variar, asegúrate de manejarlo de manera adecuada
}

const MapContainer = (props: MapContainerProps & { name: string }) => {
  const mapStyles: React.CSSProperties = {
    position: "relative",
    height: "400px",
    width: "800px",
    top: "0px",
    left: "-400px",
  };

  const initialPosition = {
    lat: 37.7749, // Latitud
    lng: -122.4194, // Longitud
  };

  return (
    <>
      {/*//@ts-ignore*/}
      <Map
        google={props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={initialPosition}
        onClick={(mapProps: any, map: any, clickEvent: any) => {
          console.log(clickEvent.latLng.lat(), clickEvent.latLng.lng()); // Aquí obtienes la posición donde se hizo clic en el mapa
          // Puedes hacer lo que desees con la posición obtenida, como mostrar un marcador adicional, etc.
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
