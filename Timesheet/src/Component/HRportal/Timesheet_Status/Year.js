import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import { Table, Button, Layout } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';


function Tb1() {
  const { Sider } = Layout;
  const toke = sessionStorage.getItem("token");
  const [dataSource, setdataSource] = useState([
  ]);
  useEffect(() => {
    axios("https://timesheetjy.azurewebsites.net/api/Admin/GetTimeSheets", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    }).then(data => setdataSource(data.data))
  }, []);
  const [year, setyear] = useState("2018");
  const columns = [
    {
      title: 'COL_ID',
      render: (COL_ID, title, index) => `${index + 1}`,
    },
    {
      title: 'Year',
      render: (data) => (<Link state={{ year: data.year }} to="/timesheet/month" >{data.year}</Link>)
    }
  ];
  return (
    <div>
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
      <div className="yertab">
        <h1 style={{ color: 'blue', fontSize: '40px', backgroundColor: "white", marginLeft: '400px', marginTop: '5%', position: "fixed" }}>TIMESHEET  STATUS</h1>
        <div>
          <Table style={{ margin: "0px 800px 900px 400px", marginTop: "10%", position: "fixed", width: '20%', height: '20%' }}
            pagefixed
            bordered
            pagination={false}
            rowKey={record => record.year}
            columns={columns}
            dataSource={dataSource}
          >
          </Table>
        </div>
      </div>
    </div>
  );
}
export default Tb1;
