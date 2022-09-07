import React from "react";
import axios from "axios";
import { Layout, Card, Button, Input, Space, Select, Divider } from 'antd';
import { useState, useEffect, element } from 'react';
import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './Edashboard.css';
import Sidersbar from "../ESidebar";

const EDashboard = () => {
    const [sts, setsts] = useState([]);
    const toke = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("id");
    const { Sider } = Layout;

    const clientdtl = async () => {
        const res = await axios('https://timesheetjy.azurewebsites.net/api/Employee/GetByDashboard?Employee_Id=3', {
            headers: {
                'Authorization': `Bearer ${toke}`
            }
        })
        setsts(res.data[0]);
    };
    useEffect(() => {
        clientdtl();
    }, []);

    const data = sts;
debugger;
    if (data.status == "Approved") {
        return (
            <div>
                <Sider style={{ height: "200%", width: 200 }}>
                    <Sidersbar />
                </Sider>
                <div style={{ marginTop: 160 }}>
                    <h1 id="xy" style={{ color: 'lightskyblue', marginLeft: -65 }}><center>Timesheet {data.month} {data.year} status</center></h1>
                </div>
                <br /><br /><br />
                <div>
                    <CheckOutlined style={{ marginTop: -90, marginLeft: 408, fontSize: 90, color: "green", position: "fixed" }} />
                </div>
                <div style={{ marginLeft: 350 }}>
                    <Space direction="horizontal">
                        <Input style={{ backgroundColor: 'green', border: "2px solid black", height: "50px", textAlign: 'center' }} value="Approved" readOnly />
                        <Input value="Pending" readOnly />
                        <Input value="Rejected" readOnly />
                    </Space>
                </div>
            </div>
        )
    }
    else if (data.status == "Rejected") {
        return (
            <div>
                <Sider style={{ height: "200%", width: 200 }}>
                    <Sidersbar />
                </Sider>
                <div style={{ marginTop: 160 }}>
                    <h1 id="xy" style={{ color: 'lightskyblue', marginLeft: -65 }}><center>Timesheet {data.month} {data.year} status</center></h1>
                </div>
                <br /><br /><br />
                <div>
                    <CloseCircleOutlined style={{ marginTop: -90, marginLeft: 780, fontSize: 80, color: "red", position: "fixed" }} />
                </div>
                <div style={{ marginLeft: 350 }}>
                    <Space direction="horizontal">
                        <Input value="Approved" readOnly />
                        <Input value="Pending" readOnly />
                        <Input style={{ backgroundColor: 'red', border: "2px solid black", height: "50px", textAlign: 'center' }} value="Rejected" readOnly />
                    </Space>
                </div>
            </div>
        )
    }
    else if (data.status == "Pending") {
        return (
            <div>
                <Sider style={{ height: "200%", width: 200 }}>
                    <Sidersbar />
                </Sider>
                <div style={{ marginTop: 160 }}>
                    <h1 id="xy" style={{ color: 'lightskyblue', marginLeft: -65 }}><center>Timesheet {data.month} {data.year} status</center></h1>
                </div>
                <br /><br /><br />
                <div>
                    <CheckOutlined style={{ marginTop: -90, marginLeft: 588, fontSize: 90, color: "skyblue", position: "fixed" }} />
                </div>
                <div style={{ marginLeft: 350 }}>
                    <Space direction="horizontal">
                        <Input value="Approved" readOnly />
                        <Input style={{
                            backgroundColor: 'skyblue',
                            border: "2px solid black",
                            height: "50px",
                            textAlign: 'center'
                        }} value="Pending" readOnly />
                        <Input value="Rejected" readOnly />
                    </Space>
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                <Sider style={{ height: "200%", width: 200 }}>
                    <Sidersbar />
                </Sider>
                <div style={{ marginTop: 160 }}>
                    <h1 id="xy" style={{ color: 'lightskyblue', marginLeft: -65 }}><center>Timesheet {data.month} {data.year} status</center></h1>
                </div>
                <br /><br /><br />
                <div>
                    <CheckOutlined style={{ marginTop: -90, marginLeft: 588, fontSize: 90, color: "skyblue", position: "fixed" }} />
                </div>
                <div style={{ marginLeft: 350 }}>
                    <Space direction="horizontal">
                        <Input value="Approved" readOnly />
                        <Input value="Pending" readOnly />
                        <Input value="Rejected" readOnly />
                    </Space>
                </div>
            </div>
        )
    }
};

export default EDashboard;