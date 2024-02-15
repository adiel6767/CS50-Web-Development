import React, { useState } from "react";
import { Table, message, Space, Popconfirm,Modal, Input } from "antd";
import axios from "axios";
import Papa from 'papaparse';
import "../css/Dashboard.css";

const Dashboard = ({ latestItem, setLatestItem, Url }) => {
  const [editing, setEditing] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [titleInput, setTitleInput] = useState('');


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleSaveClick();
    setIsModalVisible(false);
    setTitleInput('');
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  }

  const handleTitleChange = (e) => {
    setTitleInput(e.target.value);
  }

  const handleSaveClick = async () => {
    setEditing(null);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/savedata/",
        {
          scraped_data: latestItem,
          url: Url,
          title: titleInput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Data saved successfully");
        message.success("Saved successfully!");
      } else {
        console.error("Error saving data:", response.data.error);
        message.error("Error saving data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDiscardClick = () => {
    setLatestItem(null);
    setEditing(null);
    message.info("Data discarded successfully!");
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  console.log('latestitem',latestItem[0])
  const columns =
    latestItem.length > 0
      ? [
          ...Object.keys(latestItem[0])
            .filter((key) => key !== "key")
            .map((key) => ({
              title: capitalizeFirstLetter(key),
              dataIndex: key,
              key: key,
              onHeaderCell: () => ({ style: { fontWeight: "bold" } }),
              render: (text, record) => {
                const isEditing = editing === record.key;
                                    console.log("key", key);


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

  const data = latestItem.map((item, index) => ({ ...item, key: index }));
  console.log('data',data)
  const handleEdit = (record) => {
    setEditing((prevEditing) =>
      prevEditing === record.key ? null : record.key
    );
  };

  const handleEditChange = (e, key, dataIndex) => {
    const newData = data.map((item) =>
      item.key === key ? { ...item, [dataIndex]: e.target.value } : item
    );
    setLatestItem(newData);
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    console.log(newData);
    setLatestItem(newData);
  };

  const handleDownload = () => {
    // Ensure there is data to download
    if (data.length === 0) {
      message.warning("No data to download");
      return;
    }

    const filteredData = data.map(({ key, ...rest }) => rest);

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



  return (
    <div className="dash">
      <h1>Dashboard</h1>
      <div className="mt-3 table-container">
        <Table columns={columns} dataSource={data} pagination={true} />
      </div>
      <div className="dashbuttons">
        <div className="tableButtons">
          <button className="btn btn-primary" onClick={showModal}>
            Save
          </button>{" "}
          <Modal
            title="Enter Title"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{ disabled: !titleInput }}
          >
            <Input
              placeholder="Enter title"
              onChange={handleTitleChange}
              value={titleInput}
            />
          </Modal>
          <button className="btn btn-danger" onClick={handleDiscardClick}>
            Discard
          </button>{" "}
          <button className="btn btn-secondary" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
