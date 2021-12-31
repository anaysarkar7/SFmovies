import React, { useState, useEffect } from "react";
import "./navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/actions/actions";

const Navbar = () => {
  const store = useSelector((state) => state);
  const [innerData, setInnerData] = useState("");
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [filterValue, setFilterValue] = useState("locations");
  const dispatch = useDispatch();
  const filter = store.store.filter.filter;
  const inputData = store.store.filter.inputdata;
  const BACKEND = "https://sfmovies-backend.herokuapp.com";

  const helper = () => {
    var e = document.getElementById("filter");
    var x = e.value;
    dispatch(setFilter(x, innerData));
    return;
  };

  useEffect(() => {
    async function APICALLS() {
      if (filter === "locations" || filter === "") {
        await fetch(`${BACKEND}/locations`, {
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            data[8] = "null";
            setOptions(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      if (filter === "title") {
        //movie
        await fetch(`${BACKEND}/movies`, {
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setOptions(data);
          });
      }
      if (filter === "release_year") {
        await fetch(`${BACKEND}/releaseYears`, {
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setOptions(data);
          });
      }
      if (filter === "director") {
        await fetch(`${BACKEND}/directors`, {
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setOptions(data);
          });
      }
    }
    APICALLS();
  }, []);
  useEffect(() => {
    async function APICALLS() {
      if (filter === "locations" || filter === "") {
        await fetch(`${BACKEND}/locations`, {
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            data[8] = "null";
            setOptions(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      if (filter === "title") {
        //movie
        await fetch(`${BACKEND}/movies`, {
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setOptions(data);
          });
      }
      if (filter === "release_year") {
        await fetch(`${BACKEND}/releaseYears`, {
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setOptions(data);
          });
      }
      if (filter === "director") {
        await fetch(`${BACKEND}/directors`, {
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setOptions(data);
          });
      }
    }
    APICALLS();
  }, [filter]);
  useEffect(() => {
    var e = document.getElementById("filter");
    var x = e.value;
    setFilterValue(x, innerData);
  }, [filterValue]);

  //issue-> (Dropdown list pointer card component not visible) fixed
  var hideStyle = () => {
    document.getElementById("ul-id").style.visibility = "hidden";
  };
  var showStyle = () => {
    document.getElementById("ul-id").style.visibility = "visible";
  };

  return (
    <div
      className="main-navbar"
      onClick={() => {
        if (showOptions === true) {
          setShowOptions(false);
          hideStyle();
        }
      }}
    >
      <nav>
        <ul className="navbar-ul">
          <li className="logo-text">SFmovies</li>
          <li className="pre-filter-text">
            <a>Choose your Filter:</a>
          </li>
          <li className="navbar-filter">
            <a>
              <div className="navbar-select-div">
                <select
                  className="navbar-selected-option"
                  name="filter"
                  id="filter"
                  onChange={() => {
                    var e = document.getElementById("filter");
                    var x = e.value;
                    helper(x);
                  }}
                >
                  <option className="options" value="locations">
                    Location
                  </option>
                  <option className="options" value="title">
                    Movie
                  </option>
                  <option className="options" value="director">
                    Director
                  </option>
                  <option className="options" value="release_year">
                    Release Year
                  </option>
                </select>
              </div>
            </a>
          </li>
          <li className="autocomplete-search">
            <a>
              <input
                className="autocomplete-searchbar"
                type="text"
                placeholder="Type here.."
                value={innerData}
                onClick={() => {
                  if (showOptions === true) {
                    setShowOptions(false);
                    hideStyle();
                  } else if (showOptions === false) {
                    setShowOptions(true);
                    showStyle();
                  }
                }}
                onChange={(event) => {
                  var e = document.getElementById("filter");
                  var x = e.value;
                  dispatch(setFilter(x, event.target.value));
                  setInnerData(event.target.value);
                  if (showOptions === false) {
                    setShowOptions(true);
                    showStyle();
                  }
                }}
              />
            </a>
            <ul id="ul-id" className="options-ul">
              {showOptions &&
                options
                  .filter((item) => {
                    return item.indexOf(innerData.toLowerCase()) > -1;
                  })
                  .map((value, i) => {
                    return (
                      <>
                        <li
                          onClick={() => {
                            setInnerData(value);
                            var e = document.getElementById("filter");
                            var x = e.value;
                            dispatch(setFilter(x, value));
                            setShowOptions(false);
                            hideStyle();
                          }}
                          className="options"
                          key={i}
                          tabIndex="0"
                        >
                          {value},
                          <hr key={i} />
                        </li>
                        <br />
                      </>
                    );
                  })}
            </ul>
          </li>
          <li className="autocomplete-buttons">
            <a>
              <button
                className="autocomplete-go-button"
                onClick={() => {
                  setShowOptions(false);
                  helper();
                }}
                style={{ display: "none" }}
              >
                GO
              </button>
              <button
                className="autocomplete-remove-filter"
                onClick={() => {
                  setShowOptions(false);
                  setInnerData("");
                  dispatch(setFilter("locations", ""));
                }}
              >
                Remove Filters
              </button>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
