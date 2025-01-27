import React, { useState } from 'react';
import ReactMapGl, { Marker, Popup } from 'react-map-gl';
import ParkRoundedIcon from '@mui/icons-material/ParkRounded';
import SampleData from '../../sample-data/sample-data.json';
import { DEFAULT_MAP_STYLES, DEFAULT_VIEW_STATE } from '../../utils/constants/constants';
import PdfViewer from '../pdf-viewer/pdf-viewer';

const token = 'pk.eyJ1Ijoic29uZ3p6aDMiLCJhIjoiY2w1c24yaTkyMDExcjNjczI3cXA4bm5oYSJ9.6qOc6QUxt7rTw8zyoshn9w';
function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const filteredArray = SampleData.features.reduce((acc, el) => {
    if (!acc.some(v => v.attributes.LocationName === el.attributes.LocationName)) acc.push(el);
    return acc;
  }, []);

  return (
    <ReactMapGl
      initialViewState={DEFAULT_VIEW_STATE}
      mapboxAccessToken={token}
      style={{ width: DEFAULT_MAP_STYLES.width, height: DEFAULT_MAP_STYLES.height, zIndex: 100 }}
      mapStyle={DEFAULT_MAP_STYLES.mapboxStyle}>
      {filteredArray.map(location => (
        <Marker
          key={location.attributes.OBJECTID}
          longitude={location.geometry.rings[0][0][0]}
          latitude={location.geometry.rings[0][0][1]}
          onClick={e => {
            e.originalEvent.stopPropagation();
            setSelectedLocation(location);
          }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="marker-inner-container">
            <ParkRoundedIcon style={{ color: 'rgb(34, 117, 40)', cursor: 'pointer' }} />
          </div>
        </Marker>
      ))}
      {selectedLocation && (
        <Popup
          anchor="bottom"
          onClose={() => setSelectedLocation(null)}
          closeOnClick
          longitude={selectedLocation?.geometry?.rings[0][0][0]}
          latitude={selectedLocation?.geometry?.rings[0][0][1]}
          offset={{ bottom: [0, -8] }}>
          <div style={{ paddingTop: '10px', minHeight: '50px' }}>{selectedLocation?.attributes?.LocationName}</div>
        </Popup>
      )}
      {showViewer && <PdfViewer setShowViewer={setShowViewer} />}
    </ReactMapGl>
  );
}

export default App;
