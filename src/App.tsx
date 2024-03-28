import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Libraries,
} from "@react-google-maps/api";
import mapStyles from "./mapStyles";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatRelative } from "date-fns";
import AlertDialogDemo from "./_alertDialog/AlertDialog";

const libraries: Libraries = ["places"];

const mapContainerStyles = {
  width: "100vw",
  height: "100vh",
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const center = {
  lat: 41.7151,
  lng: 44.8271,
};

function App() {
  const [markers, setMarkers] = useState([
    {
      lat: 41.7151,
      lng: 44.8271,
      time: new Date(),
    },
  ]);
  const [selected, setSelected] = useState<{
    lat: number;
    lng: number;
    time: Date;
  } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBTeaj-DvuG5yHwcwNQwVtWcN8ITtXDf6A",
    libraries,
  });
  if (loadError) return <div>Loading error...</div>;
  if (!isLoaded) return <div>Loading...</div>;
  console.log(isLoaded);
  console.log(markers);
  return (
    <div>
      <h1 className="z-10 absolute px-3 py-2 left-5 top-5 bg-gray-200">
        DEERS 🦌
      </h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyles}
        zoom={10}
        center={center}
        options={options}
        onClick={(e) => {
          setMarkers((current): any => [
            ...current,
            {
              lat: e.latLng?.lat(),
              lng: e.latLng?.lng(),
              time: new Date(),
            },
          ]);
          setSelected(null);
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat || 0, lng: marker.lng || 0 }}
            icon={{
              url: "/deer.svg",
              scaledSize: new window.google.maps.Size(36, 36),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(18, 18),
            }}
            onClick={(e) => {
              setSelected({
                lat: e.latLng?.lat(),
                lng: e.latLng?.lng(),
                time: marker.time || new Date(),
              });
              console.log(marker, "clicked");
            }}
          />
        ))}
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat || 0, lng: selected.lng || 0 }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div className="flex flex-col">
              <h1>Dear Spotted!</h1>
              <span>
                {formatRelative(selected.time || new Date(), new Date())}
              </span>
              <Button
                variant="link"
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                Delete
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <AlertDialogDemo openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </div>
  );
}

export default App;
