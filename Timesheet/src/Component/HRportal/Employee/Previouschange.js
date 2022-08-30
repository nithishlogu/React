import { Card, Table, Layout, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const Previouschange = () => {
  const { Sider, Content } = Layout;
  const [dataPrevious, setDataPrevious] = useState([]);
  const location = useLocation();
  const { id } = location.state;
  const { editEmployee_Name } = location.state;

  useEffect(() => {
    console.log(id, location.state);
    debugger
    axios(`https://timesheetjy.azurewebsites.net/api/Admin/Getviewpreviouschanges?id=${parseInt(id)}`)
      .then(data => setDataPrevious(data.data))
  }, [])

  const columns = [
    {
      title: 'S.No',
      render: (colid, title, index) => `${index + 1}`,
      dataIndex: 'colid',
    },
    {
      key: '2',
      title: 'Employee ID',
      dataIndex: 'employee_Id'
    },
    {
      key: '3',
      title: 'Employee Name',
      dataIndex: 'employee_Name'
    },
    {
      key: '4',
      title: 'Type',
      dataIndex: 'employee_Type_Name'
    },
    {
      key: '5',
      title: 'Joining Date',
      dataIndex: 'joining_Date'
    },
    {
      key: '6',
      title: 'Modified Date',
      dataIndex: 'modified_Date'
    },
    {
      key: '7',
      title: 'Designation',
      dataIndex: 'designation_Name'
    },
    {
      key: '8',
      title: 'Reporting Manager',
      dataIndex: 'reporting_Manager1'
    },
    {
      key: '9',
      title: 'Mail ID',
      dataIndex: 'email'
    },
    {
      key: '10',
      title: 'Contact No',
      dataIndex: 'contact_No'
    }
  ];

  return (
    <div style={{ color: "white" }}>
      <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "100%", backgroundColor: "white", marginLeft: 20, marginTop: -100 }}>
        <Button style={{ width: 200, margin: "0 10%", height: 50 }}>
          <Link to="/dashboard"><b>Dashboard</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/Configuration/Client"><b>Configuration</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/tb1"><b>Timesheet Status</b></Link>
        </Button><Button type="primary" style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/employee"><b>Employees</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/userprofile"><b>User Profile</b></Link>
        </Button>
      </Sider>
      <Card style={{ marginLeft: 250 }}>
        <div>
          <h1 style={{ color: "blue", fontSize: 25 }}><span>{editEmployee_Name}</span>'s Previous Changes</h1>
        </div>

        <Table columns={columns}
          dataSource={dataPrevious}
          bordered
          size="middle"
          className="table_border_antd"
        />
      </Card>
    </div>
  )
}
export default Previouschange;