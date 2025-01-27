import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'standard_fonts/',
};

function PdfViewer({ setShowViewer }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const removeTextLayerOffset = () => {
    const textLayers = document.querySelectorAll('.react-pdf__Page__textContent');
    textLayers.forEach(layer => {
      const { style } = layer;
      style.top = '0';
      style.left = '0';
      style.transform = '';
    });
  };

  return (
    <div className="pdf-viewer-container">
      <div
        style={{
          width: '100%',
          minHeight: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'black',
          color: 'white',
        }}>
        <div style={{ marginLeft: '20px' }}>Pdf Viewer</div>
        <div style={{ marginRight: '20px', cursor: 'pointer' }}>
          <CloseIcon onClick={() => setShowViewer(false)} />
        </div>
      </div>
      <Document file="sample.pdf" onLoadSuccess={onDocumentLoadSuccess} options={options}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} onLoadSuccess={removeTextLayerOffset} />
        ))}
      </Document>
    </div>
  );
}

PdfViewer.propTypes = {
  setShowViewer: PropTypes.func,
};

PdfViewer.defaultProps = {
  setShowViewer: () => {},
};

export default PdfViewer;
