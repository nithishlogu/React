import React, { useEffect, useState } from "react";
import { Row, Col, Card, Space, Button, Layout } from "antd";
import axios from "axios";
import ReactDOM from "react-dom";
import { useLocation, useNavigate } from 'react-router-dom'
import { Link, useSearchParams } from 'react-router-dom';

const Userprofile = () => {
  const { Sider, Content } = Layout;
  const [searchparams] = useSearchParams();
  const toke = sessionStorage.getItem("token");
  const mail = sessionStorage.getItem("mailId");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const navig = () => { 
      navigate("/#");
     }

  useEffect(() => {
    debugger;
    axios.get(`https://timesheetjy.azurewebsites.net/api/Admin/GetUserProfile?mail_Id=${mail}`, {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
      .then(data => {
        setUsers(data.data)

      })
  }, [])

  return (
    <div style={{ backgroundColor: "white", marginTop: -30 }}>
      <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "100%", backgroundColor: "white", marginLeft: 20, marginTop: -100 }}>
        <Button style={{ width: 200, margin: "0 10%", height: 50 }}>
          <Link to="/dashboard"><b>Dashboard</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/Configuration/Client"><b>Configuration</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/timesheetstatus"><b>Timesheet Status</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/employee"><b>Employees</b></Link>
        </Button><Button type="primary" style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/userprofile"><b>User Profile</b></Link>
        </Button>
      </Sider>
      <div style={{ width: 750, height: 600, marginLeft: 250, marginTop: 30, backgroundColor: "white" }}>
        <div style={{ marginLeft: 200, marginTop: 30 }}>
          <h1>{users.map(user => (
            <h1 style={{ color: "blue", fontSize: 60, marginLeft: -50 }}>{user.name}</h1>
          ))}</h1>

          <Row>
            <Space>
              <form style={{ paddingLeft: '10%', marginLeft: 50 }}>
                <table>
                  <tbody>
                    <div style={{ marginLeft: -100, marginTop: -5, fontSize: 20, position: "fixed" }}>
                      <tr><b>HrContact Id</b><b style={{ marginLeft: 44 }}>:</b></tr><br />
                      <tr><b>Name</b><b style={{ marginLeft: 108 }}>:</b></tr><br />
                      <tr><b>Designation</b><b style={{ marginLeft: 50 }}>:</b></tr><br />
                      <tr><b>Joining Date</b><b style={{ marginLeft: 43 }}>:</b></tr><br />
                      <tr><b>Email</b><b style={{ marginLeft: 110 }}>:</b></tr><br />
                      <tr><b>Contact No</b><b style={{ marginLeft: 55 }}>:</b></tr><br />
                    </div>
                  </tbody>
                  <tbody>
                    {users.map((user) => (
                      <>
                        <div style={{ marginLeft: 110, marginTop: -4, fontSize: 20, position: "fixed" }}>
                          <tr style={{ padding: '5%', marginLeft: '-20px' }}>
                            <b>{user.hr_Contact_Id}</b>
                          </tr><br />
                          <tr>
                            <b>{user.name}</b>
                          </tr><br />
                          <tr>
                            <b>HR</b>
                          </tr><br />
                          <tr>
                            <b>{user.joining_Date}</b>
                          </tr><br />
                          <tr>
                            <b>{user.email}</b>
                          </tr><br />
                          <tr>
                            <b>{user.mobile_No}</b>
                          </tr><br />
                          <button  style={{backgroundColor:"red",color:"white"}} onClick={navig}>
logout
                          </button>
                        </div>
                      </>
                    ))}
                  </tbody>
                </table>
              </form>
            </Space>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Userprofile;