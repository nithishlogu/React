import "antd/dist/antd.css";
import React, { Component } from 'react';
import { useState } from "react";
import { Table, Tag, Layout, Space } from "antd";
import axios from 'axios';
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import Sidersbar from "../ESidebar";


function TimesheetSummary() {

  const { Sider } = Layout;
  const [selected, setSelected] = useState('');
  const [dataSource, setdataSource] = useState([]);
   useEffect(() => {axios("https://timesheetjy.azurewebsites.net/api/Employee/GetAllTimeSheet_Summary?Employee_Id=1&year=2022").then((data) => setdataSource(data.data))}, []);

  const columns = [
    {
      title: 'COL_Id',
      dataIndex: 'timesheetSummary_Id',
    },
    {
      title: 'Timesheet Month',
      dataIndex: 'month'
    },
    {
      title: 'No of days worked',
      dataIndex: 'noOfdays_Worked'
    },
    {
      title: 'No of leaves',
      dataIndex: 'noOfLeave_Taken'

    },
    {
      title: 'Total Duration',
      dataIndex: 'total_Working_Hours'

    },
    {
      title: 'Uploaded Timesheet',
      render: () => (<Link state={{

      }} to="/Viewtimesheet">View Timesheet</Link>)
    },
    {
      title: 'Uploaded image',
      render: () => (<Link state={{

      }} to="/Uploadedimage">View</Link>)
    },
    {
      title: 'Year',
      dataIndex: 'year'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (tag) => {
        const color = tag.includes('complete') ? 'Green' : tag.includes('pending') ? 'Blue' : 'Red'
        return <Tag color={color} key={tag}>{tag}</Tag>
      }
    },
  ]

  return (
    <Space direction="horizantal">
      <Sider style={{ height: "200%", width: 200 }}>
        <Sidersbar />
      </Sider>
      <div className="App">
        <h1 style={{ color: 'Blue' }}> TIMESHEET  SUMMARY</h1>
        <header className="App-header">
          {/* <button onClick={onAdd}>add</button> */}

          <Table style={{ marginleft: "50px" }}
            pagination={false}
            columns={columns}
            dataSource={dataSource}
            rowSelection={false}
          />
        </header>
      </div>
    </Space>
  );

}
export default TimesheetSummary;
