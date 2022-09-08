import { useEffect } from "react";
import axios from "axios";
// import "antd/dist/antd.css";
import { Table, Button, Layout ,Popover} from "antd";
import { renderMatches, useLocation, Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import Search from "antd/lib/input/Search";
import Highlighter from 'react-highlight-words';
import React, { useRef, useState } from 'react';
import Item from "antd/lib/list/Item";
import { fixControlledValue } from "antd/lib/input/Input";
import {LogoutOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Tb2 = () => {
  const { Sider } = Layout;
  const [dataSource, setdataSource] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const month_name = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const location = useLocation();
  const { year } = location.state;
  const currentYear = new Date().getFullYear();
  const toke = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const navig = () => {

      navigate("/#");

     }
  const currentMonth = new Date().getMonth() + 1;
  const [pagination, setPagination] = useState({
    pageSize: 6,
  });
  const employee = async () => {
    const response = await axios(`https://timesheetjy.azurewebsites.net/api/Admin/GettimesheetstatusByYear?Year=${year}`, {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    }).then(data => setdataSource(data.data))
    setdataSource(response.data);
    setFilteredEmployee(response.data);
  }
  useEffect(() => {
    employee();
    setdataSource(dataSource);
  }, []);
  const data = [];
  if (currentYear === year) {
    for (let i = 1; i <= currentMonth; i++) {
      data.push({
        monthID: i,
        month: month_name[i - 1],
        timesheetSent: 0,
        approved: 0,
        pending: 0,
        rejected: 0
      });
    }
  } else {
    for (let i = 1; i <= 12; i++) {
      data.push({
        monthID: i,
        month: month_name[i - 1],
        timesheetSent: 0,
        approved: 0,
        pending: 0,
        rejected: 0
      });
    }
  }
  dataSource.forEach(item => {
    if (item.status.toLowerCase() === "approved") {
      data.forEach(element => {
        if (element.monthID == item.monthID) {
          element.approved = item.statuscount;
        }
      });
    }
    if (item.status.toLowerCase() == "pending") {
      data.forEach(element => {
        if (element.monthID == item.monthID) {
          element.pending = item.statuscount;
        }
      });
    }
    if (item.status.toLowerCase() == "rejected") {
      data.forEach(element => {
        if (element.monthID == item.monthID) {
          element.rejected = item.statuscount;
        }
      });
    }
  });
  data.forEach(element => {
    element.timesheetSent = element.approved + element.rejected + element.pending
  });
  console.log(data);
  console.log(dataSource);
  const columns = [
    {
      title: 'COL_ID',
      dataIndex: 'monthID'
    },
    {
      title: 'Timesheet',
      render: (data) => (<Link state={{
        approved: data.approved,
        rejected: data.rejected,
        pending: data.pending,
        monthName: data.month,
        month: data.monthID,
        year: year,
        total: data.timesheetSent
      }} to="/timesheet/month/view" >{data.month}-{year}</Link>)
    },
    {
      title: 'Timesheet Sent',
      dataIndex: 'timesheetSent'
    },
    {
      title: 'Approved',
      dataIndex: 'approved'
    },
    {
      title: 'Rejected',
      dataIndex: 'rejected'
    },
    {
      title: 'Approvals Remaining',
      dataIndex: 'pending'
    },
  ];
  return (
    <>
      <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "100%", backgroundColor: "white", marginLeft: 20, marginTop: -100 }}>
        <Button style={{ width: 200, margin: "0 10%", height: 50 }}>
          <Link to="/dashboard"><b>Dashboard</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/Configuration/Client"><b>Configuration</b></Link>
        </Button><Button type="primary" style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/timesheetstatus"><b>Timesheet Status</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/employee"><b>Employees</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/userprofile"><b>User Profile</b></Link>
        </Button>
      </Sider>
      <Popover position="top" content='Logout'>
      <button style={{width:'5em',backgroundColor:'#f77c7c',marginLeft:'91%',marginTop:'2%'}}>
      <LogoutOutlined  onClick={navig}   />
      </button>
      </Popover>
      <h1 style={{ color: 'blue', margin: "5% 2% 0% 4.9%", marginLeft: 270, backgroundColor: "white", position: "fixed", fontSize: '35px' }}>{year} -TIMESHEET  STATUS</h1>
      <div style={{ marginLeft: 250 }}>
        <Table style={{ margin: "0px 800px 900px 400px", marginLeft: '5%', marginTop: "10%", position: "fixed", width: '70%', height: '40%', marginBottom: '10%' }}
          pagination={pagination}
          bordered
          columns={columns}
          dataSource={data}
          rowKey={record => record.monthID}
        >
        </Table>
      </div></>
  );
}
export default Tb2;