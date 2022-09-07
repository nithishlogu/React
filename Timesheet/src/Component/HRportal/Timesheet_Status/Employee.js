import "antd/dist/antd.css";
import React, { useEffect } from 'react';
import { Input, Table, Checkbox, Menu, Space, Tooltip, Tag, Button, message, Row, Popover, Layout,} from "antd";
import { useState } from 'react';
import { type } from "@testing-library/user-event/dist/type";
import Search from "antd/lib/input/Search";
import { SearchOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { Select } from "antd";
import axios from 'axios';
import { Dropdown } from "antd";
import { Option } from "antd/lib/mentions";
import { useLocation, Link } from "react-router-dom";
import Datatable from 'react-data-table-component'
import Title from "antd/lib/skeleton/Title";
import { data } from "jquery";
import { fixControlledValue } from "antd/lib/input/Input";
import {LogoutOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function Tb3() {
  function refreshPage() {
    window.location.reload();
  }
  const { Sider } = Layout;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const month = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const setMessage = (statusCode, responseMessage) => {
    if (statusCode == 200) {
      message.success(responseMessage + " ");
    }
    else if (statusCode == 404) {
      message.error("Error, URL Not Found");
    }
    else if (statusCode == 400) {
      message.error("Bad Request, You have given Incorrect details");
    }
  }
  const statusOption = [
    { value: "Approved", label: "Approved", color: "green" },
    { value: "Rejected", label: "Rejected", color: "orange" },
    { value: "Pending", label: "Pending", color: "blue" }
  ];
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  const navig = () => {

      navigate("/#");

     }
  const [dataSource, setdataSource] = useState(new Array);
  const [filteredEmployee, setFilteredEmployee] = useState(new Array);
  const [fruit, setFruit] = useState();
  const [filteroption, setfilteroption] = useState();
  const location = useLocation();
  const year = location.state.year;
  const month_id = location.state.month;
  const employee_Id = location.state.employee_Id;
  const monthName = location.state.monthName;
  const total = location.state.total;
  const pending = location.state.pending;
  const approved = location.state.approved;
  const rejected = location.state.rejected;
  const toke = sessionStorage.getItem("token");

  const exportExcel = async () => {
    await axios({
      url: `https://timesheetjy.azurewebsites.net/api/Admin/ExportExcel?year=${year}&Fiscial_Year_Id=${month_id}`,
      headers: {
        'Authorization': `Bearer ${toke}`
      },
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Timeheet.xlsx'); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  }
  useEffect(() => {
    const dataFromAPi = async () => {
      const response = await axios(`https://timesheetjy.azurewebsites.net/api/Admin/GettimesheetstatusByMonth?month_id=${month_id}&year=${year}`, {
        headers: {
          'Authorization': `Bearer ${toke}`
        }
      })
      //you have data on response use it and ensure the status code is 200 if not just show the meaasge from the api
      setdataSource(response.data);
      setFilteredEmployee(response.data);
    };
    dataFromAPi();
  }, []);
  const [search, setSearch] = useState('');
  //types 
  useEffect(() => {
    const dataFromAPi = async () => {
      const response = await axios(`https://timesheetjy.azurewebsites.net/api/Admin/Get_Employeetypes`, {
        headers: {
          'Authorization': `Bearer ${toke}`
        }
      })
      var optionS = new Array();
      response.data.map((element) => {
        let Option = {
          text: element.employee_Type_Name,
          value: element.employee_Type_Name
        }
        optionS.push(Option);
      })
      setfilteroption(optionS)
    };
    dataFromAPi();
  }, []);
  const [currentTotal, setCurrentTotal] = useState(total);
  const [currentPending, setCurrentPending] = useState(pending);
  const [currentRejected, setCurrentRejected] = useState(rejected);
  const [currentApproved, setCurrentApproved] = useState(approved);
  const [selectedData, setSelectedData] = React.useState();
  const handleChange = (state) => {
    setSelectedData(state.selectedRows);
    console.log(selectedData);
  }
  const calculate = () => {
    var approved = 0, rejected = 0, pending = 0, status = '';
    dataSource.forEach(element => {
      if (element.status.toLowerCase() === 'approved') {
        approved++;
      }
      if (element.status.toLowerCase() === 'rejected') {
        rejected++;
      }
      if (element.status.toLowerCase() === "pending") {
        pending++;
      }
    });
    setCurrentApproved(approved);
    setCurrentPending(pending);
    setCurrentRejected(rejected);
  }
  const onSelect = (event, row) => {
    var filtercolumn = dataSource.filter(a => a.mailId === row.mailId)[0];
    filtercolumn.status = event;
    setdataSource(dataSource);
    console.log(filtercolumn);
    calculate();
  }
  const columns = [
    {
      title: 'COL_ID',
      render: (value, item, index) => (page - 1) * 4 + index + 1,
      width: 80,
      fixed: 'left'
    },
    {
      title: 'Employee ID',
      dataIndex: 'employee_Id',
      width: 100,
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeName',
      width: 100
    },
    {
      title: 'Type',
      dataIndex: 'employeetype',
      width: 100,
      filters: filteroption,
      onFilter: (value, data) => data.employeetype.startsWith(value),
      filterSearch: true,
    },
    {
      title: 'Mail ID',
      dataIndex: 'mailId',
      width: 100
    },
    {
      title: 'Reporting Manager',
      dataIndex: 'reportingManager',
      width: 100
    },
    {
      title: 'No of days Worked',
      dataIndex: 'noDaysWorked',
      width: 100
    },
    {
      title: 'No of Leaves Taken',
      dataIndex: 'noLeaveTaken',
      width: 100
    },
    {
      title: 'Total Duration',
      dataIndex: 'totalHours',
      width: 100
    },
    {
      title: 'Approved Timesheet',
      width: 100,
      render: (data, element) => (<Link state={{
        Fiscol_Year_id: month_id,
        year: year,
        employee_Id: element.employee_Id,
      }} to="/Viewtimesheet">View Timesheet</Link>)
    },
    {
      title: 'Approval Image',
      width: 100,
      render: (data, element) => (<Link state={{
        Fiscol_Year_id: month_id,
        year: year,
        employee_Id: element.employee_Id,
      }} to="/Viewimage">View Image</Link>)
    },
    {
      title: 'Timesheet Status',
      dataIndex: 'status',
      width: 150,
      filters: [{
        text: 'Approved',
        value: 'Approved',
      },
      {
        text: 'Rejected',
        value: 'Rejected',
      },
      {
        text: 'Pending',
        value: 'Pending',
      },
      ],
      onFilter: (value, data) => data.status.startsWith(value.toString()),
      filterSearch: true,
      render: (status, row) => (
        <Select defaultValue={status} style={{ width: 100 }} onChange={(event) => {
          console.log(event)
          onSelect(event, row)
        }}>
          {statusOption.map(option => (<Option value={option.value} style={{ color: `${option.color}` }}>{option.label}</Option>))}
        </Select>
      )
    },
  ];
  const [selectedRow, setSelectedRow] = useState();
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRows);
      setSelectedRow(selectedRows);
    }
  };
  const edit = () => {
    selectedRow.forEach(element => {
      var values = {
        timesheet_Status: element.status,
        edittimesheetmodel2: [
          {
            employee_id: element.employee_Id,
            month_Id: month_id,
            year: year
          }
        ]
      }
      console.log(values);
      console.log(element.employee_Id)
      const data = axios({
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Authorization': `Bearer ${toke}`
        },
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/EdittimesheetStatus',
        data: values
      }).then((r) => {
        setMessage(r.request.status, " Updated Successfully");
      })
    })
  }
  useEffect(() => {
    const result = dataSource.filter(dataSource => {
      return dataSource.employeName.toLowerCase().match(search.toLowerCase()) ||
        dataSource.mailId.toString().toLowerCase().match(search.toLowerCase()) ||
        dataSource.reportingManager.toLowerCase().match(search.toLowerCase()) ||
        dataSource.noDaysWorked.toString().toLowerCase().match(search.toLowerCase()) ||
        dataSource.noLeaveTaken.toString().toLowerCase().match(search.toLowerCase()) ||
        dataSource.totalHours.toString().toLowerCase().match(search.toLowerCase()) ||
        dataSource.status.toString().toLowerCase().match(search.toLowerCase()) ||
        dataSource.employeetype.toString().toLowerCase().match(search.toLowerCase())
    })
    setFilteredEmployee(result);
  }, [search])
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
      <Popover position="top" content='Logout'>
      <button style={{width:'5em',backgroundColor:'#f77c7c',marginLeft:'91%',marginTop:'2%'}}>
      <LogoutOutlined  onClick={navig}   />
      </button>
      </Popover>
      <div className="App" style={{ marginLeft: 250, width: 1000 }}>
        <h1 style={{ color: 'Blue', margin: "5% 0% 0% 2%", fontSize: '200%' }}> {month[month_id].toUpperCase()} - {year} TIMESHEET  STATUS</h1>
        <header className="App-header"><br></br><br></br>
          <div style={{ marginBottom: '-6.2%', marginLeft: '90%' }}>
            <Button style={{ backgroundColor: "lightblue", }} onClick={exportExcel}>ExportExcel</Button>
          </div><br></br><br></br>
          <div >
            <div style={{ marginTop: '-1.4%' }} >
              <Popover position="top" content={"Search"} >
                <Input
                  type="text"
                  placeholder="Search "
                  value={search}
                  suffix={<SearchOutlined />}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: 200, position: "fixed" }}
                />
              </Popover>
            </div>
            <Input
              style={{
                width: '10%',
                marginLeft: 220,
                color: 'black',
                fontWeight: 'bolder'
              }}
              defaultValue="Total"
              readOnly={true} />
            <Input
              style={{
                width: '4%',
              }}
              value={currentTotal}
              readOnly={true} />
            <Input
              style={{
                width: '10%',
                marginLeft: '2%',
                color: 'green',
                fontWeight: 'bolder'
              }}
              value="Approved"
              readOnly={true} />
            <Input
              style={{
                width: '4%',
              }}
              value={currentApproved}
              readOnly={true} />
            <Input
              style={{
                width: '10%',
                marginLeft: '2%',
                color: 'blue',
                fontWeight: 'bolder'
              }}
              value="Pending"
              readOnly={true} />
            <Input
              style={{
                width: '4%',
              }}
              value={currentPending}
              readOnly={true} />
            <Input
              style={{
                width: '10%',
                marginLeft: '2%',
                color: 'orangered',
                fontWeight: 'bolder'
              }}
              value="Rejected"
              readOnly={true} />
            <Input
              style={{
                width: '4%',
              }}
              value={currentRejected}
              readOnly={true} />
          </div><br></br>
          <div style={{ width: "79%", position: "fixed" }}>
            <Table
              header="fixed"
              pagination={{
                current: page,
                pageSize: pageSize,
                onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize)
                }
              }}
              columns={columns}
              onChange={onchange}
              dataSource={filteredEmployee}
              rowSelection={{
                type: Checkbox,
                ...rowSelection,
              }}
              rowKey={record => record.employee_Id}
              scroll={{
                x: 1100
              }}
              size="small"
            />
          </div>
          <Space direction="horizantal" style={{ marginTop: 380, marginLeft: 800 }}>
            <Button style={{ backgroundColor: "orangered", border: '1px solid red' }} onClick={refreshPage}>Cancel</Button>
            <Button style={{ backgroundColor: "lightblue", border: 'solid blue' }} onClick={edit}>Save Changes</Button>
          </Space>
        </header >
      </div >
    </div>
  );
}
export default Tb3;