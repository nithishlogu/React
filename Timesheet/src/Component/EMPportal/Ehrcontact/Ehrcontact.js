import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Space, Button, Form, Modal, Col, Row, Table, message, Card, Layout } from "antd";
import Sidersbar from "../ESidebar";

const EHrInfo = () => {

    const { Sider } = Layout;
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [filteredClient, setFilteredClient] = useState([]);
    const toke = sessionStorage.getItem("token");

    const clientdtl = async () => {
        const response = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAll_HRcontactinfo", {
            headers: {
                'Authorization': `Bearer ${toke}`
            }
        })
        setFilteredClient(response.data);
    }
    useEffect(() => {
        clientdtl();
    }, []);


    const clientDtlColumns = [
        {
            title: 'COL_ID',
            render: (value, item, index) => (page - 1) * 8 + index + 1,
            dataIndex: 'colid',
        },
        {
            title: 'Name',
            dataIndex: 'hr_Name',
        },
        {
            title: 'Mail Id',
            dataIndex: 'hr_Email_Id',
        },
        {
            title: 'Contact No',
            dataIndex: 'hr_Contact_No',
        }

    ];


    return (
        <><Space direction="horizantal">
            <Sider style={{ height: "200%", width: 200 }}>
                <Sidersbar />
            </Sider>
            <h1 style={{ position: "fixed", marginLeft: 110, color: "blue", marginTop: 40, fontSize: 35 }}><b>HR Contact Info</b></h1>
            <Table

                style={{ position: "fixed", padding: 155, marginLeft: 50, marginTop: -20, width: '80vw', height: '20vh' }}
                columns={clientDtlColumns}
                dataSource={filteredClient}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize)
                    }
                }}
                size="middle"
                bordered
            />
        </Space>
        </>

    )
};

export default EHrInfo;