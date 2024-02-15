import React, { useState } from "react";
import axios from "axios";
import "../css/Form.css";
import Dashboard from "./Dashboard";
import { useUser } from "./UserContext";
import { Spinner } from "react-bootstrap";

function Form() {
  const [loading, setLoading] = useState(false);
  const [latestItem, setLatestItem] = useState(null);
  const { get_username } = useUser();
  const [Url, setUrl] = useState("");
  const [follow_next, setFollowNext] = useState("")
  const [CssSelector, setCssSelector] = useState("");
  const [TextSelectorFields, setTextSelectorFields] = useState([
    { TextSelector: "" },
  ]);
  const [DescriptiveFields, setDescriptiveFields] = useState([
    { DescriptiveNames: "" },
  ]);

  const handleTextSelectorChange = (event, index) => {
    let data = [...TextSelectorFields];
    data[index][event.target.name] = event.target.value;
    setTextSelectorFields(data);
  };

  const handleDescriptiveNameChange = (event, index) => {
    let data = [...DescriptiveFields];
    data[index][event.target.name] = event.target.value;
    setDescriptiveFields(data);
  };

  const addTextSelectorField = () => {
    let object = {
      TextSelector: "",
    };

    setTextSelectorFields([...TextSelectorFields, object]);
  };

  const addDescriptiveNames = () => {
    let object = {
      DescriptiveName: "",
    };
    setDescriptiveFields([...DescriptiveFields, object]);
  };

  const removeTextSelectorField = (index) => {
    let data = [...TextSelectorFields];
    data.splice(index, 1);
    setTextSelectorFields(data);
  };

  const removeDescriptiveNames = (index) => {
    let data = [...DescriptiveFields];
    data.splice(index, 1);
    setDescriptiveFields(data);
  };

  const handleUrlChange = (event) => {
    // Update the URL state when the input changes
    setUrl(event.target.value);
  };

  const handleCssSelector = (event) => {
    setCssSelector(event.target.value);
  };

  const handleFollowNext = (event) => {
    setFollowNext(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const blog = { Url, CssSelector, TextSelectorFields, DescriptiveFields };
    console.log(JSON.stringify(blog));
  };

  const handleClearAll = (event) => {
    setUrl("");
    setCssSelector("");
    const newTextSelectorFields = [{ TextSelector: "" }];
    setTextSelectorFields(newTextSelectorFields);
    const newDescriptiveNames = [{ DescriptiveName: "" }];
    setDescriptiveFields(newDescriptiveNames);
    setFollowNext("")
  };

  const submit = async (event) => {
    const blog = {
      Url,
      CssSelector,
      TextSelectorFields,
      DescriptiveFields,
      get_username,
      follow_next,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/endpoint/",
        blog, // Send the blog object directly as the request body
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include cookies
        }
      );

      // Check if the response status is OK (2xx)
      if (response.status >= 200 && response.status < 300) {
        // Request was successful
        const data = response.data;
        setLatestItem(data);
        // fetchDataFromApi();
      } else {
        // Request failed
        throw new Error("Sign-up request failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      // console.log('Loading',loading)
    }
    console.log("Loading", loading);
  };

  return (
    <div className="form-group">
      <div className="containter">
        <div className="sidecontent">
          <aside className="sidebar">
            {/* <div className="contents"> */}
            <div>
              <h1>Web Scraper</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <label>
                <b>URL</b>
              </label>
              <br />
              <input
                className="form-control"
                type="text"
                placeholder="Insert Url"
                value={Url}
                onChange={handleUrlChange}
              />
              <label>
                <b>CSS Selector</b>
              </label>
              <input
                className="form-control"
                type="text"
                placeholder="Insert CSS Selector"
                value={CssSelector}
                onChange={handleCssSelector}
              />
              <label>
                <b>Text Selector</b>
              </label>
              {TextSelectorFields.map((form, index) => {
                return (
                  <div key={index} className="form-field">
                    <input
                      className="form-control"
                      type="text"
                      name="TextSelector"
                      placeholder="Insert Text Selector"
                      onChange={(event) =>
                        handleTextSelectorChange(event, index)
                      }
                      value={form.TextSelector}
                    />
                    {index === 0 && (
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={addTextSelectorField}
                      >
                        Add More..
                      </button>
                    )}
                    {index > 0 && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeTextSelectorField(index)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })}
              <label>
                <b>Field Names</b>
              </label>
              {DescriptiveFields.map((form, index) => {
                return (
                  <div key={index} className="form-field-descriptive-names">
                    <input
                      className="form-control"
                      type="text"
                      name="DescriptiveName"
                      placeholder="Insert Descriptive Name"
                      onChange={(event) =>
                        handleDescriptiveNameChange(event, index)
                      }
                      value={form.DescriptiveName || ""}
                    />
                    {index === 0 && (
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={addDescriptiveNames}
                      >
                        Add More..
                      </button>
                    )}
                    {index > 0 && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeDescriptiveNames(index)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })}
              <lable><b>Next Page Selector</b></lable>
              <input className="form-control" type="text" placeholder="Incert Next Page Selector" onChange={handleFollowNext} value={follow_next} />
            </form>
            <br />

            <div className="form-submit">
              <button className="btn btn-primary" onClick={submit}>
                Submit
              </button>{" "}
              <span />
              <button className="btn btn-danger" onClick={handleClearAll}>
                {" "}
                Clear all
              </button>
            </div>
            {/* </div> */}
          </aside>
        </div>
        <div className="spinner-container">
          {loading && <Spinner animation="border" />}
        </div>
        {latestItem && (
          <Dashboard
            latestItem={latestItem}
            setLatestItem={setLatestItem}
            Url={Url}
          />
        )}
      </div>
    </div>
  );
}

export default Form;
