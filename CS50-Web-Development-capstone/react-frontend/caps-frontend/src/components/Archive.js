import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Space,
  Popconfirm,
  Pagination,
  Divider,
  List,
  Skeleton,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import "../css/Archive.css";
import Papa from "papaparse";

function Archive() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/user-data/scraped-data/"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const loadMoreData = () => {
    if (loading) {
      return;
    }

    setLoading(true);

    fetchData().finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const handleClickTitle = (item) => {
    setSelectedItem(item);    
    console.log(data)
  };

  const handleCloseDetail = () => {
    window.location.reload();
  };

  const handleEdit = (record) => {
    setEditing((prevEditing) =>
      prevEditing === record.key ? null : record.key
    );
  };

  const handleEditChange = (e, key, dataIndex) => {
    // Clone the selectedItem object
    const updatedSelectedItem = { ...selectedItem };

    // Find the edited item in json_data and update the value
    updatedSelectedItem.json_data = selectedItem.json_data.map((item, index) => {
      return index === key ? { ...item, [dataIndex]: e.target.value } : item;
    });

    // Update the state with the new edited json_data
    setSelectedItem(updatedSelectedItem);
  };

const handleDelete = (key) => {
  console.log(dataindex)
  const newData = dataindex.filter((item) => item.key !== key);

 setSelectedItem((prevSelectedItem) => ({
   ...prevSelectedItem,
   json_data: newData,
 }));
 
};

const handleSaveClick = async () => {
  setEditing(null);

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/savedata/",
      {
        scraped_data: selectedItem.json_data,
        url: selectedItem.url,
        title: selectedItem.title,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("Data saved successfully - over");
      message.success("Saved successfully!");
    } else {
      console.error("Error saving data:", response.data.error);
      message.error("Error saving data");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const handleDeleteTable = async () => {
  console.log(selectedItem.id);
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/delete-data/",
      {
        id: selectedItem.id,
      }, // Add a comma here
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("Data Deleted Successfully");
            localStorage.setItem(
              "deleteSuccessMessage",
              "Deleted Successfully"
            );
      window.location.reload();

    } else {
      console.error("error deleting data", response.data.error);
      message.error("Error deleting data");
    }
  } catch (error) {
    console.error("error deleting data:", error);
  }
};

const deleteSuccessMessage = localStorage.getItem("deleteSuccessMessage");
if (deleteSuccessMessage) {
  message.success(deleteSuccessMessage);
  // Clear the success message from local storage to avoid displaying it on subsequent visits
  localStorage.removeItem("deleteSuccessMessage");
}


  const handleDownload = () => {
    // Ensure there is data to download
    if (dataindex.length === 0) {
      message.warning("No data to download");
      return;
    }

    const filteredData = dataindex.map(({ key, ...rest }) => rest);

    // Convert data to CSV format
    const csvData = Papa.unparse(filteredData, {
      header: true,
      quotes: true,
    });

    // Create a Blob with the CSV data and specify UTF-8 encoding
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvData], {
      type: "text/csv;charset=utf-8;",
    });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dashboard_data.csv";

    // Append the link to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };


  const columns =
    selectedItem && selectedItem.json_data.length > 0
      ? [
          ...Object.keys(selectedItem.json_data[0])
            .filter((key) => key !== "key")
            .map((key) => ({
              title: capitalizeFirstLetter(key),
              dataIndex: key,
              key: key,
              onHeaderCell: () => ({ style: { fontWeight: "bold" } }),
              render: (text, record) => {
                const isEditing = editing === record.key;
                return isEditing ? (
                  <input
                    className="form-control"
                    value={text}
                    onChange={(e) => handleEditChange(e, record.key, key)}
                    style={{ width: "100%" }}
                  />
                ) : (
                  <div
                    className="editable-text"
                    onClick={() => handleEdit(record)}
                  >
                    {text}
                  </div>
                );
              },
            })),
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Space size="middle">
                <a
                  href="javascript:void(0);"
                  onClick={() => handleEdit(record)}
                  style={{ textDecoration: "none" }}
                >
                  Edit
                </a>
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => handleDelete(record.key)}
                >
                  <a
                    href="javascript:void(0);"
                    style={{ textDecoration: "none" }}
                  >
                    Delete
                  </a>
                </Popconfirm>
              </Space>
            ),
            onHeaderCell: () => ({ style: { fontWeight: "bold" } }),
          },
        ]
      : [];

  const dataindex = selectedItem ? selectedItem.json_data.map((item, index) => ({
    ...item,
    key: index,
  })) : [];


  return (
    <div className="archive">
      {selectedItem ? (
        <div>
          <h1>{selectedItem.title}</h1>
          <Table dataSource={dataindex} columns={columns} pagination={true} />
          <div className="dashbuttons">
            <div className="tableButtons">
              <Popconfirm title="Sure to save?" onConfirm={handleSaveClick}>
                <button className="btn btn-primary">Save</button>
              </Popconfirm>{" "}
              {/* <span></span> */}
              <Popconfirm title="Sure to delete?" onConfirm={handleDeleteTable}>
                <button className="btn btn-danger">Delete</button>{" "}
              </Popconfirm>
              <button className="btn btn-secondary" onClick={handleDownload}>
                Download
              </button>
              <br />
              <button
                className="btn btn-dark"
                onClick={handleCloseDetail}
                style={{ marginTop: "2px" }}
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="archive-name">Archive</h1>
          <div
            id="scrollableDiv"
            style={{
              height: 400,
              overflow: "auto",
              padding: "0 16px",
              border: "1px solid rgba(140, 140, 140, 0.35)",
            }}
          >
            <InfiniteScroll
              dataLength={data.length}
              next={loadMoreData}
              hasMore={data.length < 0}
              loader={
                <Skeleton
                  paragraph={{
                    rows: 1,
                  }}
                  active
                />
              }
              endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
              scrollableTarget="scrollableDiv"
            >
              <List
                dataSource={data}
                renderItem={(item) => (
                  <List.Item key={item.id}>
                    {/* Render your list item content here */}
                    <List.Item.Meta
                      title={
                        <a
                          href="javascript:void(0);"
                          style={{ textDecoration: "none" }}
                          onClick={() => handleClickTitle(item)}
                        >
                          <strong>{item.title}</strong>
                        </a>
                      }
                      description={item.url}
                    />
                    <div>{item.created_at}</div>
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          </div>
        </div>
      )}
    </div>
  );
}

export default Archive;
