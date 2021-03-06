/** @module Map */

import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";

import Minature from "./MapTools/Minature";
import Toolbar from "./MapTools/Toolbar";

import customs from "./mapimages/Customs/customs.jpg";
import customsGray from "./mapimages/Customs/customsGray.jpg";
import customsSVG from "./mapimages/Customs/Customs.svg";

import shoreline from "./mapimages/Shoreline/shoreline.jpg";
import shorelineSpawn from "./mapimages/Shoreline/shorelineSpawn.jpg";
import shorelineSVG from "./mapimages/Shoreline/Shoreline.svg";

import factory from "./mapimages/Factory/factory.jpg";
import factorySVG from "./mapimages/Factory/Factory.svg";

import woods from "./mapimages/Woods/woods.jpg";
import woodsSVG from "./mapimages/Woods/Woods.svg";

import reserve from "./mapimages/Reserve/reserve.jpg";
import reserveGray from "./mapimages/Reserve/reserveGray.jpg";
import reserveKey from "./mapimages/Reserve/reserveKey.jpg";
import reserveSVG from "./mapimages/Reserve/Reserve.svg";

import interchangeJPG from "./mapimages/Interchange/interchange.jpg";
import interchangeSVG from "./mapimages/Interchange/Interchange.svg";

import lighthouse from "./mapimages/Lighthouse/lighthouse.jpg";
import lighthouseRotated from "./mapimages/Lighthouse/lighthouseRotated.jpg";
import lighthouseFlat from "./mapimages/Lighthouse/lighthouseFlat.jpg";

import labs from "./mapimages/Labs/labs.jpg";
import labsExtract from "./mapimages/Labs/labsExtract.jpg";
import labsHorizontal from "./mapimages/Labs/labsHorizontal.jpg";
import labsVertical from "./mapimages/Labs/labsVertical.jpg";

import { UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";
import { colors } from "../../constants";

import "./styles/map.scss";

const mapStateToProps = state => {
  return { currentMap: state.drawerState.map };
};

const allMaps = {
  Customs: [
    { map: customs, about: "3D" },
    { map: customsGray, about: "3D" },
    { map: customsSVG, about: "2D" }
  ],
  Shoreline: [
    { map: shoreline, about: "3D" },
    { map: shorelineSpawn, about: "3D" },
    { map: shorelineSVG, about: "2D" }
  ],
  Factory: [
    { map: factory, about: "3D" },
    { map: factorySVG, about: "2D" }
  ],
  Woods: [
    { map: woods, about: "3D" },
    { map: woodsSVG, about: "2D" }
  ],
  Reserve: [
    { map: reserve, about: "3D" },
    { map: reserveGray, about: "3D" },
    { map: reserveKey, about: "3D" },
    { map: reserveSVG, about: "2D" }
  ],
  Interchange: [
    { map: interchangeJPG, about: "3D" },
    { map: interchangeSVG, about: "2D" }
  ],
  Lighthouse: [
    { map: lighthouse, about: "3D" },
    { map: lighthouseRotated, about: "3D" },
    { map: lighthouseFlat, about: "3D" }
  ],
  Labs: [
    { map: labs, about: "3D" },
    { map: labsHorizontal, about: "3D" },
    { map: labsVertical, about: "3D" },
    { map: labsExtract, about: "3D" }
  ]
};

const Map = props => {
  const { currentLocation, currentMap } = props;
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const mapContainerRef = useRef();
  const Viewer = useRef(null);
  
  const handleResize = () => {
    setDimensions(mapContainerRef.current.getBoundingClientRect());
  };

  useEffect(() => {
    Viewer.current.fitToViewer();
  }, [currentLocation]);

  useEffect(() => {
    if (mapContainerRef.current) {
      setDimensions(mapContainerRef.current.getBoundingClientRect());
      window.addEventListener("resize", handleResize);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mapContainerRef]);

  return (
    <div className="mapContainer" ref={mapContainerRef}>
      <UncontrolledReactSVGPanZoom
        ref={Viewer}
        width={dimensions.width}
        height={dimensions.height}
        SVGBackground="transparent"
        background={`transparent`} //colors.navColor
        onZoom={e => console.log("zoom")}
        onPan={e => console.log("pan")}
        onClick={event => console.log("click", event.x, event.y, event.originalEvent)}
        detectAutoPan={false}
        defaultTool="pan"
        customMiniature={props => (
          <Minature
            {...props}
            currentMap={currentMap}
            locationMaps={allMaps[currentLocation]}
            viewer={Viewer}
          />
        )}
        customToolbar={props => <Toolbar {...props} />}
      >
        <svg width={dimensions.width} height={dimensions.height}>
          <image
            href={allMaps[currentLocation][currentMap]?.map}
            width={dimensions.width}
            height={dimensions.height}
          />
        </svg>
      </UncontrolledReactSVGPanZoom>
    </div>
  );
};

export default connect(mapStateToProps)(Map);
