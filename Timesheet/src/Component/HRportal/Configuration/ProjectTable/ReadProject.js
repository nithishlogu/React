import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Select, Typography } from 'antd';
import { PlusCircleOutlined, EditOutlined, CloseCircleOutlined, ClockCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Space, DatePicker, Form, message, Popover, Layout, Row, Col, Card } from 'antd';
import { Button } from 'antd';
import { Checkbox, Label } from 'semantic-ui-react';
import moment from 'moment';
const { Search } = Input;

function ReadProject() {

    const { Sider } = Layout;
    const [isActivateModal, setIsActivateModal] = useState(false);
    const [AddProjectForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [search, setSearch] = useState('');
    const [searchDeactive, setSearchDeactive] = useState('');
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [project_Name, setProject_Name] = useState('');
    const [project_Code, setProject_Code] = useState('');
    const [client_Id, setClient_Id] = useState(parseInt(0));
    const [is_Active, setIs_Active] = useState(false);
    const [project_Start_Date, setProject_Start_Date] = useState(new Date());
    const [project_End_Date, setProject_End_Date] = useState(new Date());
    const [create_Date, setCreate_Date] = useState(new Date());
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editProject_Id, setEditProject_Id] = useState(0);
    const [editProject_Name, setEditProject_Name] = useState('');
    const [editProject_Code, setEditProject_Code] = useState('');
    const [editClient_Id, setEditClient_Id] = useState('');
    const [editProject_Start_Date, setEditProject_Start_Date] = useState('');
    const [editProject_End_Date, setEditProject_End_Date] = useState('');
    const [deactivateValue, setDeactivateValue] = useState();
    const [option, setOption] = useState('yes');
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [deactivate, setDeactivate] = useState(false);
    const [toggleActivate, setToggleActivate] = useState(false);
    const [dataSource, setDataSource] = useState('');
    const navigate = useNavigate();
    const [startValue, setStartValue] = useState(null);
    const [endValue, setEndValue] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [page1, setPage1] = useState(1);
    const [pageSize1, setPageSize1] = useState(4);
    const toke = sessionStorage.getItem("token");

    // const addProjectForm = Form.useForm();
    // const addProjctName = Form.useWatch('addProjectName', addProjectForm);

    const setMessage = (statusCode, responseMessage) => {
        debugger;
        if (statusCode == 200) {
            message.success(responseMessage, 5);
        }
        else if (statusCode == 404) {
            message.error(responseMessage);
        }
        else if (statusCode == 400) {
            message.error(responseMessage);
        }
        else if (statusCode == 500) {
            message.error("Internal Server Error");
        }
        else {
            message.error(responseMessage);
        }
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    const onFinish = async (e) => {
        await axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': `Bearer ${toke}`
            },
            url: 'https://timesheetjy.azurewebsites.net/api/Admin/Add_Project',
            data: e
        }).then(async (r) => {
            setMessage(r.request.status, e.project_Name + " Added Successfully");
            debugger
            const response = await axios.get("https://timesheetjy.azurewebsites.net/api/Admin/GetAllProjects", {
                headers: {
                    'Authorization': `Bearer ${toke}`
                }
            });
            setFilteredClients(response.data);
            getClients();
            AddProjectForm.resetFields();
            setIsModalVisible(false);
        }).catch((error) => {
            debugger;
            setMessage(error.request.status, error.response.data)
        })
    }


    useEffect(() => {
        getClients();
    }, []);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRow) => {
            setSelectedRows(selectedRow);
            setSelectedRowKeys(selectedRowKeys);
            setDeactivate(true);
            if (selectedRow.length === 0) {
                setDeactivate(false);
            }
        }
    };

    const SelectionRow = {
        onChange: (selectedRowKeys, selectedRow) => {
            setSelectedRows(selectedRow);
            setSelectedRowKeys(selectedRowKeys);
            setDeactivate(true);
            setToggleActivate(true)
            if (selectedRow.length === 0) {
                setDeactivate(false);
                setToggleActivate(false);
            }
        }
    };

    const showEditModal = () => {
        setEditModalVisible(true)
    };

    const handleEditOk = () => {
        setEditModalVisible(false);
    };

    const handleEditCancel = () => {
        setEditProject_Id('');
        setEditProject_Name('');
        setEditProject_Code('');
        setEditClient_Id('');
        setEditProject_Start_Date('');
        setEditProject_End_Date('');
        setEditModalVisible(false)
    };

    const onOptionSelect = (event) => {
        getClients();
        setOption(`${event}`);
    }

    const editProject = (row) => {
        setEditProject_Id(row.project_Id);
        setEditClient_Id(row.client_Id);
        editForm.setFieldsValue({
            project_Id: row.project_Id,
            project_Name: row.project_Name,
            project_Code: row.project_Code,
            client_Id: row.client_Id,
            start_Date: row.start_Date,
            end_Date: row.end_Date
        });
        setStartValue(row.start_Date);
        setEndValue(row.end_Date);
        showEditModal();
    }
    const [endOpen, setEndOpen] = useState(false);
    const [deactiveProjects, setDeactivateProjects] = useState([]);
    const [deactivateProjects2, setDeactivateProjects2] = useState([]);

    const disabledStartDate = (startDate) => {
        if (!startDate || !endValue) {
            return false;
        }

        return startDate.valueOf() > endValue.valueOf();
    };

    const disabledEndDate = (endDate) => {
        if (!endDate || !startValue) {
            return false;
        }
        return endDate.valueOf() <= startValue.valueOf();
    };

    const handleStartOpenChange = (open) => {
        if (!open) {
            setEndOpen(true);
        }
    };

    const handleEndOpenChange = (open) => {
        setEndOpen(open);
    };

    const showDeactivateModal = () => {
        showConfirmModal();
    }

    const getClients = async () => {

        const response = await axios.get("https://timesheetjy.azurewebsites.net/api/Admin/GetAllProjects", {
            headers: {
                'Authorization': `Bearer ${toke}`
            }
        });
        setFilteredClients(response.data);
        setDataSource(response.data);
        const records = await axios.get('https://timesheetjy.azurewebsites.net/api/Admin/GetProjectsIs_Active', {
            headers: {
                'Authorization': `Bearer ${toke}`
            }
        });
        setDeactivateProjects(records.data);
        setDeactivateProjects2(records.data);

        const clt = await axios.get('https://timesheetjy.azurewebsites.net/api/Admin/GetAll_Clients', {
            headers: {
                'Authorization': `Bearer ${toke}`
            }
        });
        setClients(clt.data);
    };

    useEffect(() => {
        const result = filteredClients.filter(emDataSource => {
            return (
                emDataSource.project_Name.toLowerCase().match(search.toLowerCase())
            );
        });
        setFilteredClients(result);
    }, [search])

    const showActivateData = () => {
        setIsActivateModal(!isActivateModal);
    }

    const Activate = () => {
        selectedRows.forEach(element => {
            axios({
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                  'Authorization': `Bearer ${toke}`
                },
                url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditProjectIsActive',
                data: {
                    id: element.project_Id,
                    is_Active: true
                },     
              }).then((r) => {
                setMessage(r.request.status, element.project_Name + " Activated Successfully");
                debugger
            });
        });
        setIsActivateModal(false);
        getClients();
        setDeactivate(false);
        setToggleActivate(false);
        setSelectedRows([]);
        setSelectedRowKeys([]);
        rowSelection = ''
    }

    const columns_Deactivate = [
        {
            title: "COL_ID",
            render: (value, item, index) => (page1 - 1) * 4 + index + 1,
        },
        {
            title: "Project Code",
            dataIndex: 'project_Code',
        },
        {
            title: "Project Name",
            dataIndex: 'project_Name',
        },
        {
            title: "Start Date",
            dataIndex: 'project_Start_Date',
            // render: (project_Start_Date) => { return (<p style={{ paddingTop: '5%' }}>{moment(project_Start_Date).format('DD - MM - YYYY')}</p>) },
        },
        {
            title: "End Date",
            dataIndex: 'project_End_Date',
            // render: (project_End_Date) => { return (<p style={{ paddingTop: '5%' }}>{moment(project_End_Date).format('DD - MM - YYYY')}</p>) },
        }
    ];


    const columns = [
        {
            title: "COL_ID",
            render: (value, item, index) => (page - 1) * 4 + index + 1,
        },
        {
            title: "Project Code",
            dataIndex: 'project_Code',
        },
        {
            title: "Project Name",
            dataIndex: 'project_Name',
        },
        {
            title: "Start Date",
            dataIndex: 'start_Date',
            // render: (start_Date) => { return (<p style={{ paddingTop: '5%' }}>{moment(start_Date).format('DD - MM - YYYY')}</p>) },
        },
        {
            title: "End Date",
            dataIndex: 'end_Date',
            // render: (end_Date) => { return (<p style={{ paddingTop: '5%' }}>{moment(end_Date).format('DD - MM - YYYY')}</p>) },
        },
        {
            title: "Action",
            render: row => (
                <Space>
                    <Popover content={'Edit'} placement='right'>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => editProject(row)}
                        />
                    </Popover>
                </Space>
            )
        }
    ];

    const showAddData = () => {
        setIsModalVisible(!isModalVisible);
    }

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const handleStartDate = (event) => {
        setStartValue(event.target.value);
        const d = moment(new Date(event)).format("DD-MM-YYYY");
        setProject_Start_Date(d);
    }

    const handleEndDate = (event) => {
        setEndValue(event.target.value);
        const v = moment(new Date(event)).format('DD-MM-YYYY');
        setProject_End_Date(v);
    }

    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

    const showConfirmModal = () => {
        setIsConfirmModalVisible(true);
    };

    const handleConfirmOk = () => {
        setIsConfirmModalVisible(false);
        selectedRows.forEach(element => {
            axios({
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                  'Authorization': `Bearer ${toke}`
                },
                url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditProjectIsActive',
                data: {
                    id: element.project_Id,
                    is_Active: false
                },     
              }).then((r) => {
                setMessage(r.request.status, element.project_Name + "  " + "Deactivated Successfully");
                debugger
                console.log("deactivated")
                getClients();
            })
        });
        const timeset = setTimeout(() => {
            window.location.reload();
        }, 3500);
        setDeactivate(false);
        setSelectedRows([]);
        setSelectedRowKeys([]);
        setToggleActivate(false);
        return () => clearTimeout(timeset);
    };

    const handleActivateOk = () => {
        setIsActivateModal(false);
    }

    const handleActivateCancel = () => {
        setIsActivateModal(false);
    }

    const handleConfirmCancel = () => {
        setIsConfirmModalVisible(false);
    };

    const handleEditSubmit = async (e) => {
        setEditModalVisible(false);
        await axios({
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': `Bearer ${toke}`
            },
            url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditProject',
            data: {
                project_Id: editProject_Id,
                project_Name: e.project_Name,
                project_Code: e.project_Code,
                client_Id: e.client_Id,
                is_Active: true,
                //start_Date: Date(startValue),
                end_Date: endValue
            }
        }).then(r => {
            debugger;
            setMessage(r.request.status, r.data.name + " Updated Successfuly");
        })
        getClients();
        // window.location.reload(false);
    }

    const handleActivateSearch = (e) => {
        console.log(e.target.value);
        const result = dataSource.filter(emDataSource => {
            return (
                emDataSource.project_Name.toLowerCase().match(e.target.value.toLowerCase())
                || emDataSource.project_Code.toString().match(e.target.value)
                || emDataSource.project_Code.toLowerCase().match(e.target.value.toLowerCase())
                || emDataSource.start_Date.toString().toLowerCase().match(e.target.value)
            );
        });
        setFilteredClients(result);
        if (e.target.value === '') {
            getClients();
        }
    }

    const handleDeactivateSeach = (e) => {
        const searchDatas = deactivateProjects2.filter(emDataSource => {
            return (
                emDataSource.project_Name.toLowerCase().match(e.target.value.toLowerCase())
                || emDataSource.project_Code.match(e.target.value.toLowerCase())
                || emDataSource.project_Code.toLowerCase().match(e.target.value.toLowerCase())
            );
        })
        setDeactivateProjects(searchDatas);
        if (e.target.value === '') {
            getClients();
        }
    }
    // useEffect(() => {
    //     window.location.reload();
    // }, [option])

    return (
        <>
            <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "100%", backgroundColor: "white", marginLeft: 20, marginTop: -100 }}>
                <Button style={{ width: 200, margin: "0 10%", height: 50 }}>
                    <Link to="/dashboard"><b>Dashboard</b></Link>
                </Button><Button type="primary" style={{ margin: "0 10%", width: 200, height: 50 }}>
                    <Link to="/Configuration/Client"><b>Configuration</b></Link>
                </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
                    <Link to="/timesheetstatus"><b>Timesheet Status</b></Link>
                </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
                    <Link to="/employee"><b>Employees</b></Link>
                </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
                    <Link to="/userprofile"><b>User Profile</b></Link>
                </Button>
            </Sider>
            <div style={{ position: "fixed", width: "85%", marginLeft: 250 }}>
                <p style={{ color: "blue", fontSize: 30 }}><b>Configuration</b></p>
                <Row><Col span={2}></Col>
                    <Col span={4}><Link to="/Configuration/Client"><Button style={{ width: 130 }}>Client</Button></Link></Col>
                    <Col span={4}><Link to="/Configuration/Project" disabled><Button style={{ width: 130 }} type="primary">Project</Button></Link></Col>
                    <Col span={4}><Link to="/Configuration/Designation"><Button style={{ width: 130 }}>Job Title</Button></Link></Col>
                    <Col span={4} stylw={{ marginLeft: 10 }}><Link to="/Configuration/EmployeeType"><Button style={{ width: 130 }}>Employee Type</Button></Link></Col>
                    <Col span={4}><Link to="/Configuration/HrInfo" ><Button style={{ width: 130 }} >HR Contact Info</Button></Link></Col><Col span={2}></Col>
                </Row><Card className="table_border_antd" style={{ width: 1000, borderTopColor: "blue", borderLeftColor: "black", borderRightColor: "black", borderBottomColor: "black", borderTopWidth: 5, position: "fixed" }}>
                    <div className="container" style={{ width: "75%", margin: "0% 0% 0% 15%" }}>
                        <div style={{ paddingBottom: 10 }}>
                            <h1 style={{ color: 'blue', fontSize: 30, marginLeft: -80 }}><b>Project</b></h1>
                            {
                                option === 'yes' ?
                                    (
                                        <>
                                            <Popover placement="topRight" content='Search'>
                                                <Input
                                                    suffix={<SearchOutlined onClick={(e) => handleActivateSearch(e)} />}
                                                    placeholder="Search here...."
                                                    value={search}
                                                    onChange={(e) => {
                                                        handleActivateSearch(e)
                                                        setSearch(e.target.value);
                                                    }}
                                                    style={{ width: 200 }}
                                                />
                                            </Popover>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <Popover placement="topRight" content='Search'>
                                                <Input
                                                    suffix={<SearchOutlined onClick={(e) => handleActivateSearch(e)} />}
                                                    placeholder="Search here...."
                                                    value={search}
                                                    onChange={(e) => {
                                                        handleDeactivateSeach(e);
                                                        setSearch(e.target.value);
                                                    }}
                                                    style={{ width: 200 }}
                                                />
                                            </Popover>
                                        </>

                                    )
                            }
                            <label style={{ paddingRight: '2%', paddingLeft: '5%', fontSize: 20, fontWeight: 'bolder' }}>Active :</label>
                            <Popover content='Select a State' placement="right">
                                <Select style={{ width: '10%' }} defaultValue={'yes'} onChange={onOptionSelect}>
                                    <optgroup value={'yes'}>Yes</optgroup>
                                    <optgroup value={'no'}>No</optgroup>
                                </Select>
                            </Popover>
                            <div style={{ paddingLeft: '5%', display: 'inline', visibility: selectedRows === [] ? 'hidden' : 'display' }}>
                                {
                                    option === 'yes' ?
                                        (
                                            deactivate ?
                                                <Button
                                                    type="danger"
                                                    onClick={showDeactivateModal}
                                                    icon={<CloseCircleOutlined />}
                                                >
                                                    Deactivate
                                                </Button> : ''
                                        ) :
                                        (
                                            toggleActivate ?
                                                <Button
                                                    onClick={showActivateData}
                                                    style={{ color: 'white', fontWeight: 'bolder' }}
                                                    type="primary"

                                                >
                                                    Activate
                                                </Button> : ''
                                        )
                                }
                            </div>

                        </div>
                        {option === 'yes' ?
                            <Table
                                bordered
                                rowSelection={{
                                    type: Checkbox,
                                    ...rowSelection,
                                }}
                                rowKey={record => record.project_Id}
                                columns={columns}
                                dataSource={filteredClients}
                                size="small"
                                pagination={{
                                    current: page,
                                    pageSize: pageSize,
                                    onChange: (page, pageSize) => {
                                        setPage(page);
                                        setPageSize(pageSize)
                                    }
                                }}
                                scroll={{
                                    y: 300
                                  }}
                            />
                            :
                            <Table
                                bordered
                                rowSelection={{
                                    type: Checkbox,
                                    ...SelectionRow,
                                }}
                                rowKey={record => record.project_Id}
                                size="small"
                                columns={columns_Deactivate}
                                dataSource={deactiveProjects}
                                pagination={{
                                    current: page1,
                                    pageSize: pageSize1,
                                    onChange: (page1, pageSize1) => {
                                        setPage1(page1);
                                        setPageSize1(pageSize1)
                                    }
                                }}
                                scroll={{
                                    y: 250
                                  }}
                            />
                        }
                        {
                            option === 'yes' ?
                                (
                                    <Button
                                        type="link" rowKey="id"
                                        icon={<PlusCircleOutlined />}
                                        onClick={showAddData}
                                        style={{ marginLeft: "80%", fontWeight: 'bolder', fontSize: 20, marginBottom: 34 }}>ADD</Button>
                                ) :
                                ''
                        }



                        {/* <Add Project Popup Modal> */}
                        <Modal
                            title={[<h3 className='add'><b>Add Project</b></h3>]}
                            visible={isModalVisible}
                            onOk={handleOk}
                            onCancel={() => {

                                AddProjectForm.resetFields();
                                handleCancel()
                            }
                            }
                            style={{ width: '100%' }}
                            footer={[
                                <Button type="danger" onClick={() => {
                                    AddProjectForm.resetFields();
                                    setIsModalVisible(!isModalVisible);
                                }}>Cancel</Button>
                            ]}
                        >
                            <Form
                                {...formItemLayout}
                                onFinish={onFinish}
                                form={AddProjectForm}
                            >
                                <Form.Item
                                    label='Project Name:'
                                    name='project_Name'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Project Name!'
                                        },
                                        {
                                            pattern: new RegExp(/^[a-zA-Z0-9\s\- ]+$/i),
                                            message: 'Special Characters are not allowed'
                                        },
                                        {
                                            max: 25,
                                            message: ''
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label='Project Code'
                                    name='project_Code'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Project Code!'
                                        },
                                        {
                                            min: 5,
                                            message: 'Project Code must be minimum 5 characters.'
                                        },
                                        {
                                            pattern: new RegExp(/^[a-zA-Z0-9\s\- ]+$/i),
                                            message: 'field does not accept numbers'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label='Client'
                                    name='client_Id'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Select your Client!'
                                        }
                                    ]}
                                >
                                    <Select>
                                        {clients.map(clt => (
                                            <Select.Option value={clt.client_Id}>{clt.client_Name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label='Start Date'
                                    name='project_Start_Date'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Input Project Start Date!'
                                        }
                                    ]}
                                >
                                    <DatePicker
                                        min={endValue}
                                        format="YYYY-MM-DD"
                                        value={startValue}
                                        placeholder="Start Date"
                                        onChange={setStartValue}
                                        onOpenChange={handleStartOpenChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='End Date'
                                    name='project_End_Date'
                                >
                                    {/* <DatePicker
                            disabledDate={disabledEndDate}
                            format="YYYY-MM-DD"
                            value={endValue}
                            placeholder="End Date"
                            onChange={handleEndDate}
                            onOpenChange={handleEndOpenChange}
                        /> */}
                                    <DatePicker
                                        disabledDate={disabledEndDate}
                                        format="YYYY-MM-DD"
                                        value={endValue}
                                        placeholder="End Date"
                                        onChange={setEndValue}
                                        onOpenChange={handleEndOpenChange}
                                    />
                                </Form.Item>
                                <Form.Item style={{ paddingLeft: '20%' }}>
                                    <Button block type="primary" htmlType="submit">Submit</Button>
                                </Form.Item>
                            </Form>
                        </Modal>

                        {/* <Edit - Project PopUp Modal> */}
                        <Modal title={[<h3 className='add'><b>Edit Project</b></h3>]} visible={editModalVisible} onOk={handleEditOk} onCancel={handleEditCancel} footer={[<Button type="danger" onClick={handleEditCancel}>Cancel</Button>]}>
                            <Form
                                {...formItemLayout}
                                form={editForm}
                                onFinish={handleEditSubmit}
                            >
                                <Form.Item
                                    label='Project Name:'
                                    name='project_Name'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Project Name!'
                                        },
                                        {
                                            pattern: new RegExp(/^[a-zA-Z0-9\s\- ]+$/i),
                                            message: 'field does not accept special Characters'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label='Project Code'
                                    name='project_Code'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Project Code!'
                                        },
                                        {
                                            min: 5,
                                            message: 'Username must be minimum 5 characters.'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label='Client'
                                    name='client_Id'
                                >
                                    <Select>
                                        {clients.map(clt => (
                                            <Select.Option value={clt.client_Id}>{clt.client_Name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label='Start Date'
                                    name='start_Date'
                                >
                                    <Input
                                        type='text'
                                        // disabledDate={
                                        //     (current) => {
                                        //         let customDate = moment().format("YYYY-MM-DD");
                                        //         return current && current < moment(customDate, "YYYY-MM-DD");
                                        //     }
                                        // }
                                        // value={Date(startValue)}
                                        // format="dd-mm-yyyy"
                                        // placeholder="Start"
                                        // onChange={handleStartDate}
                                        // onOpenChange={handleStartOpenChange}
                                        disabled={true}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='End Date'
                                    name='end_Date'
                                >
                                    <Input
                                        type='date'
                                        time='disabled'
                                        disabledDate={disabledEndDate}
                                        min={startValue}
                                        format="YYYY-MM-DD"
                                        value={endValue}
                                        placeholder="End"
                                        onChange={handleEndDate}
                                        onOpenChange={handleEndOpenChange}
                                    />
                                </Form.Item>
                                <Form.Item style={{ paddingLeft: '50%' }}>
                                    <Button type="primary" htmlType="submit">Submit</Button>
                                </Form.Item>
                            </Form>
                        </Modal>

                        {/* <Deactive Popup> */}
                        <Modal visible={isConfirmModalVisible} onOk={handleConfirmOk} onCancel={handleConfirmCancel} footer={[<Button type='primary' onClick={handleConfirmOk}>Yes</Button>, <Button type='primary' onClick={handleConfirmCancel}>No</Button>]}>
                            <h2 className="edt">Are you sure want to Deactivate the Project?</h2>
                        </Modal>

                        {/* Activate Popup */}
                        <Modal visible={isActivateModal} onOk={handleActivateOk} onCancel={handleActivateCancel} footer={[<Button type='primary' onClick={Activate} >Yes</Button>, <Button type='primary' onClick={handleActivateCancel}>No</Button>]} >
                            <h2>Are you sure want to Activate the Project?</h2>
                        </Modal>
                    </div>
                </Card>
            </div>
        </>
    );

};

export default ReadProject;