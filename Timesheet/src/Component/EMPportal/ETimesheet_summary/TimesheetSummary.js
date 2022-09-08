import "antd/dist/antd.css";
import React, { Component } from 'react';
import { useState } from "react";
import { Table, Tag, Layout, Space,Button } from "antd";
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
      <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "100%", backgroundColor: "white", marginLeft: 20, marginTop: -100 }}>
        <Button type="primary" style={{ width: 200, margin: "0 10%", height: 50, marginTop: 20 }}>
        <Link to="/EDashboard">Dashboard</Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
        <Link to="/Etimesheetsummary">Timesheet summary</Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
        <Link to="/Eaddtimesheet">Timesheet</Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
        <Link to="/Ehrinfo">HR contact info</Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
        <Link to="/Euserprofile">User Profile</Link>
        </Button>
      </Sider>
      <div style={{ marginLeft: "250px" ,marginTop:"100px"}} className="App">
        <h1 style={{ color: 'Blue' }}> TIMESHEET  SUMMARY</h1>
        <header className="App-header">
          {/* <button onClick={onAdd}>add</button> */}

          <Table style={{ marginLeft: "50px" }}
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
