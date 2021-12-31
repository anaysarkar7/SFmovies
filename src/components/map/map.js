import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMapGL, {
  Marker,
  Popup,
  NavigationControl,
  FlyToInterpolator,
  WebMercatorViewport,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import x from "../../demoData.json";
import redmark from "./map-assets/map-pin.png";
import { useSelector } from "react-redux";
import Navbar from "../searchCard/navbar";
import "./map.css";
//auth token
const Mapbox_Token = process.env.REACT_APP_MAPBOX_TOKEN;
const Position_Stack_Token = process.env.REACT_APP_POSITION_STACK_TOKEN;

const Map = () => {
  var [Data, setData] = useState(x); //set it to x for testing
  //themes
  const dark = "mapbox://styles/mapbox/dark-v9";
  const light = "mapbox://styles/mapbox/streets-v11";
  const [showPopup, togglePopup] = useState(false);
  const [reset, setReset] = useState(false);
  const [reload, setReload] = useState(false);
  var [theme, setTheme] = useState(dark);
  var [allDone, setAllDone] = useState(false);
  var [text, setText] = useState("light");
  const [loader, setLoader] = useState(false);
  const [goGeoCode, setGoGeoCode] = useState();
  const store = useSelector((state) => state);
  const filter = store.store.filter.filter;
  const inputData = store.store.filter.inputdata;
  const BACKEND = "https://sfmovies-backend.herokuapp.com";

  //Setting the viewport
  const [viewport, setViewport] = useState({
    width: "fit",
    height: "100vh",
    latitude: 37.0902,
    longitude: -95.7129,
    zoom: 3,
    pitch: 0,
  });
  //for zoom buttons
  const navControlStyle = {
    right: 20,
    top: 100,
  };
  //fly over animation (to do)
  const lat = parseInt(localStorage.getItem("lat"));
  const lng = parseInt(localStorage.getItem("lng"));
  const onSelectCity = () => {
    setViewport({
      ...viewport,
      longitude: lng,
      latitude: lat,
      zoom: 7.5,
      pitch: 50,
      transitionDuration: 6000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  //fetching Data from SFmovies API
  //then
  //Geocoding the data
  //in useEffect hook
  // const [ulat, setUlat] = useState([]);
  // const [ulng, setUlng] = useState([]);

  // useEffect(() => {
  //   async function APICALL() {
  //     const res = await fetch(`${BACKEND}/update`, {
  //       method: "GET",
  //     });
  //     const data = await res.json();
  //     setData(data);
  //     setGoGeoCode(true);
  //   }//setting Data
  //     // APICALL();
  //   console.log(Data[0]);
  // }, []);

  useEffect(() => {
    if (Data[0] !== undefined) {
      const newArr = Data.map((element) => {
        return fetch(
          `http://api.positionstack.com/v1/forward?access_key=${Position_Stack_Token}&query=${element.locations}`
        ).then((res) => res.json());
      });
      console.log(newArr.length);
      const promiseCondition = Promise.all(
        newArr.map((p) => p.catch(() => "null"))
      ).then((results) => {
        results.forEach((element, i) => {
          // setUlat([...ulat, element.data[0].latitude]);
          // setUlng([...ulng, element.data[0].longitude]);
          Data[i].lat=element.data[0].latitude;
          Data[i].lng=element.data[0].longitude;
          setLoader(true);
          console.log("done");
        });
      });
      console.log(promiseCondition);
      if (promiseCondition.PromiseState === "rejected") {
        setReload(true);
      } else if(loader===true){
        setTimeout(() => setReload(true), 10000);
      }
    }
  }, []);

  // useEffect(() => {
  //   const newArr = Data.map((element) => {
  //     return fetch(
  //       `http://api.positionstack.com/v1/forward?access_key=${Position_Stack_Token}&query=${element.locations}`
  //     ).then((res) => res.json());
  //   });
  //   const promiseCondition = Promise.all(
  //     newArr.map((p) => p.catch(() => "null"))
  //   ).then((results) => {
  //     results.forEach((element, i) => {
  //       const lat = element.data[0].latitude;
  //       const lng = element.data[0].longitude;
  //       Data[i].lat = lat;
  //       Data[i].lng = lng;
  //       setLoader(true);
  //       console.log("done");
  //     });
  //   });
  //   console.log(promiseCondition);
  //   if(promiseCondition.PromiseState==="rejected"){
  //     setReload(true);
  //   }
  // }, [Data]);

  return (
    <div className="main-map">
      <Navbar />
      <ReactMapGL
        mapStyle={theme}
        scrollZoom={false}
        mapboxApiAccessToken={Mapbox_Token}
        {...viewport}
        onViewportChange={(nextViewport) =>
          setViewport({ ...nextViewport, width: "fit", height: "100vh" })
        }
      >
        <button
          className="map-button"
          onClick={() => {
            if (theme === dark) {
              setText("dark");
              setTheme(light);
            } else {
              setText("light");
              setTheme(dark);
            }
          }}
        >
          {text} mode
        </button>
        {allDone === false && loader === true && (
          <button
            className="map-button"
            onClick={() => {
              setAllDone(true);
            }}
          >
            show pointers
          </button>
        )}
        <br />
        {reset && (
          <button
            className="map-button"
            onClick={() => {
              setViewport({
                ...viewport,
                longitude: -95.7129,
                latitude: 37.0902,
                zoom: 3,
                pitch: 0,
                transitionDuration: 5000,
                transitionInterpolator: new FlyToInterpolator(),
              });
              togglePopup(false);
              setReset(false);
            }}
          >
            reset
          </button>
        )}
        {reload && <div className="reload">PLEASE WAIT/ RELOAD</div>}
        <NavigationControl style={navControlStyle} />
        <div className="all-markers">
          {loader === false && (
            <div className="lds-ripple">
              <div>Loading</div>
              <div>Data</div>
            </div>
          )}
          {allDone &&
            Data.map((element, i) => {
              var lt =35; //default
              var lg =-121; //values
              if (element.lat && element.lng) {
                lt = element.lat;
                lg = element.lng;
              }
              if (
                (filter === "" || filter === "locations") &&
                inputData === ""
              ) {
                return (
                  <div className="marker-div" id="marker-div-id" key={i}>
                    <Marker
                      latitude={lt}
                      longitude={lg}
                      offsetLeft={-20}
                      offsetTop={-10}
                    >
                      <img
                        className="redmark"
                        id="redmark-id"
                        src={redmark}
                        alt=".png"
                        style={({ height: "30px" }, { width: "30px" })}
                        onClick={() => {
                          console.log("ok");
                          localStorage.setItem("lat", lt);
                          localStorage.setItem("lng", lg);
                          localStorage.setItem("ind", i);

                          if (!showPopup) {
                            togglePopup(true);
                          } else togglePopup(false);
                        }}
                      />
                    </Marker>
                    {showPopup && (
                      <Popup
                        latitude={lt}
                        longitude={lg}
                        closeButton={false}
                        closeOnClick={false}
                        onClose={() => togglePopup(false)}
                        anchor="top"
                        offsetLeft={-5}
                        offsetTop={20}
                      >
                        <div
                          className="card-title"
                          id="card-id"
                          onClick={() => {
                            onSelectCity();
                            setReset(true);
                          }}
                        >
                          Movie:{element.title}
                        </div>
                      </Popup>
                    )}
                  </div>
                );
              }
              if (filter === "locations" && inputData != "") {
                if (inputData === element.locations) {
                  return (
                    <div className="marker-div" key={i}>
                      <Marker
                        latitude={lt}
                        longitude={lg}
                        offsetLeft={-20}
                        offsetTop={-10}
                      >
                        <img
                          className="marker-img"
                          id="redmark-id"
                          src={redmark}
                          alt=".png"
                          style={({ height: "30px" }, { width: "30px" })}
                          onClick={() => {
                            localStorage.setItem("lat", lt);
                            localStorage.setItem("lng", lg);
                            localStorage.setItem("ind", i);

                            if (!showPopup) {
                              togglePopup(true);
                            } else togglePopup(false);
                          }}
                        />
                      </Marker>
                      {showPopup && (
                        <Popup
                          latitude={lt}
                          longitude={lg}
                          closeButton={true}
                          closeOnClick={false}
                          onClose={() => togglePopup(false)}
                          anchor="top"
                          offsetLeft={-5}
                          offsetTop={20}
                        >
                          <div
                            className="card-title"
                            id={4745 + i}
                            onClick={() => {
                              onSelectCity();
                              setReset(true);
                            }}
                          >
                            {element.title}
                          </div>
                        </Popup>
                      )}
                    </div>
                  );
                }
              }
              if (filter === "title") {
                if (element.title === inputData) {
                  return (
                    <div key={i}>
                      <Marker
                        latitude={lt}
                        longitude={lg}
                        offsetLeft={-20}
                        offsetTop={-10}
                      >
                        <img
                          id="redmark-id"
                          src={redmark}
                          alt=".png"
                          style={({ height: "30px" }, { width: "30px" })}
                          onClick={() => {
                            localStorage.setItem("lat", lt);
                            localStorage.setItem("lng", lg);
                            if (!showPopup) {
                              togglePopup(true);
                            } else togglePopup(false);
                          }}
                        />
                      </Marker>
                      {showPopup && (
                        <Popup
                          latitude={lt}
                          longitude={lg}
                          closeButton={true}
                          closeOnClick={false}
                          onClose={() => togglePopup(false)}
                          anchor="top"
                          offsetLeft={-5}
                          offsetTop={20}
                        >
                          <div
                            className="card-title"
                            id={4745 + i}
                            onClick={() => {
                              onSelectCity();
                              setReset(true);
                            }}
                          >
                            {element.title}
                          </div>
                        </Popup>
                      )}
                    </div>
                  );
                }
              }
              if (filter === "director") {
                if (element.director === inputData) {
                  return (
                    <div key={i}>
                      <Marker
                        latitude={lt}
                        longitude={lg}
                        offsetLeft={-20}
                        offsetTop={-10}
                      >
                        <img
                          id="redmark-id"
                          src={redmark}
                          alt=".png"
                          style={({ height: "30px" }, { width: "30px" })}
                          onClick={() => {
                            localStorage.setItem("lat", lt);
                            localStorage.setItem("lng", lg);
                            if (!showPopup) {
                              togglePopup(true);
                            } else togglePopup(false);
                          }}
                        />
                      </Marker>
                      {showPopup && (
                        <Popup
                          latitude={lt}
                          longitude={lg}
                          closeButton={true}
                          closeOnClick={false}
                          onClose={() => togglePopup(false)}
                          anchor="top"
                          offsetLeft={-5}
                          offsetTop={20}
                        >
                          <div
                            className="card-title"
                            id={4745 + i}
                            onClick={() => {
                              onSelectCity();
                              setReset(true);
                            }}
                          >
                            {element.title}
                          </div>
                        </Popup>
                      )}
                    </div>
                  );
                }
              }
              if (filter === "release_year") {
                if (element.director === inputData) {
                  return (
                    <div key={i}>
                      <Marker
                        latitude={lt}
                        longitude={lg}
                        offsetLeft={-20}
                        offsetTop={-10}
                      >
                        <img
                          id="redmark-id"
                          src={redmark}
                          alt=".png"
                          style={({ height: "30px" }, { width: "30px" })}
                          onClick={() => {
                            localStorage.setItem("lat", lt);
                            localStorage.setItem("lng", lg);
                            if (!showPopup) {
                              togglePopup(true);
                            } else togglePopup(false);
                          }}
                        />
                      </Marker>
                      {showPopup && (
                        <Popup
                          latitude={lt}
                          longitude={lg}
                          closeButton={true}
                          closeOnClick={false}
                          onClose={() => togglePopup(false)}
                          anchor="top"
                          offsetLeft={-5}
                          offsetTop={20}
                        >
                          <div
                            className="card-title"
                            id={4745 + i}
                            onClick={() => {
                              onSelectCity();
                              setReset(true);
                            }}
                          >
                            {element.title}
                          </div>
                        </Popup>
                      )}
                    </div>
                  );
                }
              }
            })}
        </div>
      </ReactMapGL>
    </div>
  );
};
export default Map;
