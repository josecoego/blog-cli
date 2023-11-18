import React from "react";
import { Map, GoogleApiWrapper, Marker, IMapProps } from "google-maps-react";

interface MapContainerProps extends IMapProps {
  google: any;
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
  return (
    <>
      {/*//@ts-ignore*/}
      <Map
        google={props.google}
        zoom={14}
        style={styles}
        initialCenter={{
          lat,
          lng,
        }}
        onClick={(_mapProps: any, _map: any, clickEvent: any) => {
          onChangePos({
            lat: clickEvent.latLng.lat(),
            lng: clickEvent.latLng.lng(),
          });
        }}
      >
        <Marker
          //@ts-ignore
          position={{
            lat,
            lng,
          }}
        />
      </Map>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyAUFmxLQlygxkGuhrkiFQsnPTuMo3Gv9WM", //This key MUST be set as ENV VAR.!!!!!!!!!!
})(MapContainer);
