import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import axios from "axios";
import { Row, Col, Card, Space, Layout } from 'antd';
import Sidersbar from "../ESidebar";

const EUserprofile = () => {
    const { Sider } = Layout;
    const [users, setUsers] = useState([]);
    const mail = sessionStorage.getItem("mailId");
    const toke = sessionStorage.getItem("token");

    useEffect(() => {
        axios(`https://timesheetjy.azurewebsites.net/api/Employee/GetUserProfile?mail_id=${mail}`, {
            headers: {
                'Authorization': `Bearer ${toke}`
            }
        })
            .then(data => setUsers(data.data))
    }, [])

    return (
        <><Space>
            <Sider style={{ height: "200%", width: 200 }}>
                <Sidersbar />
            </Sider>
            {/* <h1 style={{ position: "fixed", marginLeft: 70, color: "blue", marginTop: 20, fontSize: 35 }}><b>Employee Userprofile</b></h1> */}
            <Card style={{ width: 630, height: 550, marginLeft: 140, marginTop: 20, position: "fixed" }}>
                <div style={{ marginLeft: 190, marginTop: 10, position: "fixed" }}>
                    <h1>{users.map(user => (
                        <h1 style={{ color: "blue", fontSize: 40, marginLeft: -50 }}>{user.employee_Name}</h1>
                    ))}</h1>

                    <Row>
                        <Space>
                            <form style={{ paddingLeft: '10%', marginLeft: 50 }}>
                                <table>
                                    <tbody>
                                        <div style={{ marginLeft: -100, marginTop: -5, fontSize: 20, position: "fixed" }}>
                                            <tr><b>Employee Id</b><b style={{ marginLeft: 51 }}>:</b></tr><br />
                                            <tr><b>Employee Name</b><b style={{ marginLeft: 14 }}>:</b></tr><br />
                                            <tr><b>Designation</b><b style={{ marginLeft: 52 }}>:</b></tr><br />
                                            <tr><b>Joining Date</b><b style={{ marginLeft: 47 }}>:</b></tr><br />
                                            <tr><b>Email</b><b style={{ marginLeft: 115 }}>:</b></tr><br />
                                            <tr><b>Mobile No</b><b style={{ marginLeft: 65 }}>:</b></tr><br />
                                        </div>
                                    </tbody>
                                    <tbody>
                                        {users.map((user) => (
                                            <>
                                                <div style={{ marginLeft: 110, marginTop: -4, fontSize: 20, position: "fixed" }}>
                                                    <tr style={{ padding: '5%', marginLeft: '-20px' }}>
                                                        <b>{user.employee_ID}</b>
                                                    </tr><br />
                                                    <tr>
                                                        <b>{user.employee_Name}</b>
                                                    </tr><br />
                                                    <tr>
                                                        <b>{user.designation}</b>
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
                                                </div>
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </form>
                        </Space>
                    </Row>
                </div>
            </Card>
        </Space>
        </>
    );
};

export default EUserprofile;