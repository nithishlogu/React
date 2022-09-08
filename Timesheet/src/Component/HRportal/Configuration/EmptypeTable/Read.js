// 

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Space, Button, Form, Modal, Col, Row, Card, Table, message, Layout,Popover } from "antd";
import { PlusCircleOutlined, EditOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import Readdeactivated from "./Readdeactivated";
import { Checkbox, Label } from 'semantic-ui-react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import {LogoutOutlined} from '@ant-design/icons';
import {  useNavigate } from 'react-router-dom';


function ReadEmpType() {


  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [toggleActivate, setToggleActivate] = useState(false);
  const [deactivate, setDeactivate] = useState(false);
  const { Sider, Content } = Layout;
  const [isActivateModal, setIsActivateModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clientDataSource, setClientDataSoure] = useState([]);
  const [filteredClient, setFilteredClient] = useState([]);
  const [search, setSearch] = useState('');
  const [addedClient, setAddedClient] = useState({ "employee_Type_Name": "", "is_Active": true });
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [edtCli, setEdtCli] = useState([]);
  const [isactive, setIsActive] = useState(false);
  const [actCli, setActCli] = useState([]);
  const [option, setOption] = useState('yes');
  const [hideOrShow, setHideOrShow] = useState(false);
  const navigate = useNavigate();
  const navig = () => {
       navigate("/#");
       }
  const toke = sessionStorage.getItem("token");

  const setMessage = (statusCode, responseMessage) => {
    debugger
    if (statusCode == 200) {
      message.success({
        content: responseMessage,
        style: {
          marginLeft: 600,
          width: 300
        }
      });
    }
    else if (statusCode == 404) {
      message.error("Error, URL Not Found");
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

  const clientdtl = async () => {
    const response = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllEmployeetype", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
    setClientDataSoure(response.data);
    setFilteredClient(response.data);
  }
  useEffect(() => {
    clientdtl();
  }, []);

  const clientDtlColumns = [
    {

      title: 'S.No',
      render: (value, item, index) => (page - 1) * 5 + index + 1,
      dataIndex: 'colid',
    },
    {
      title: 'Employee Type',
      dataIndex: 'employee_Type_Name',
    },
    {
      title: 'No of employees',
      dataIndex: 'no_of_Employees',
    },
    // {
    //   key: '11',
    //   render: (clidtl, actdtl) => {
    //     return <>

    //     </>
    //   }
    // },
  ];

  const showAddData = () => {
    setIsModalVisible(true);
  }
  const buttonOk = () => {
    setIsModalVisible(false);
    addCli();
  };
  const buttonCancel = () => {
    setIsModalVisible(false);
  };

  const AddClient = () => {
    const [employee_Type_Name, setEmployee_Type_Name] = useState('');

    const addEmployee_Type_Name = (employee_Type_Name) => {
      addedClient["employee_Type_Name"] = employee_Type_Name;
      setAddedClient(addedClient);
      setEmployee_Type_Name(employee_Type_Name);
    }

    return (
      <div>
        <Form form={form} layout="vertical" name="form_in_modal">
          <h2 className="add">ADD Employee Type</h2>
          <Row>
            <Col span={10}>
              <p style={{ marginLeft: 10, fontWeight: "bold" }}>Employee Type</p>
            </Col>
            <Col span={1}></Col>
            <Col span={10}>
              <Form.Item name="employee_Type_Name" rules={[{ required: true, message: 'Please enter the Name' }, {
                pattern: new RegExp(/^[a-zA-Z ]+$/i),
                message: "field does not accept numbers"
              }]}>
                <Input type='text' id='employee_Type_Name' value={employee_Type_Name}
                  onChange={(e) => addEmployee_Type_Name(e.target.value)}
                  required />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
  const addCli = async () => {
    await axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': `Bearer ${toke}`
      },
      url: 'https://timesheetjy.azurewebsites.net/api/Admin/Add_Employeetype',
      data: addedClient
    }).then((r) => {
      console.log(r);
      setMessage(r.request.status, addedClient.employee_Type_Name + " - Added successfully");
      axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllEmployeetype", {
        headers: {
          'Authorization': `Bearer ${toke}`
        }
      })
        .then(data => setFilteredClient(data.data))
    }).catch((error) => {
      setMessage(error.request.status, error.response.data.errors.Client_Name);
    })
  }

  const onEdit = (record) => {
    setIsEditing(true);
    setEdtCli(record);
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEdtCli([]);
  };

  // Edit employee type =======>

  const EditProjects = (dtl) => {

    const [emptypeedit] = Form.useForm();

    emptypeedit.setFieldsValue({
      employee_Type_Id: selectedRows[0].employee_Type_Id,
      employee_Type_Name: selectedRows[0].employee_Type_Name
    })

    const empsubmit = async (e) => {

      console.log(e);
      debugger;

      const data = await axios({
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Authorization': `Bearer ${toke}`
        },
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/Edit_Employeetype',
        data: {
          employee_Type_Id: e.employee_Type_Id,
          employee_Type_Name: e.employee_Type_Name
        }
      }).then((r) => {
        setIsEditing(false);
        debugger
        setMessage(r.request.status, e.employee_Type_Name + " - " + "Updated Successfully");

        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllEmployeetype", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }
        })
          .then(data => setFilteredClient(data.data))
      }).catch((error) => {
        setMessage(error.request.status, error.response.data);
        // console.log(error.message);
        // debugger
      })
    }

    return (
      <>
        <Form
          form={emptypeedit}
          onFinish={(e) => empsubmit(e)}
        >
          <Form.Item style={{ marginLeft: 10 }}
            label='Employee Type ID'
            name='employee_Type_Id'
          >
            <Input style={{ marginLeft: "27px", width: "60px" }} disabled />
          </Form.Item>
          <Form.Item
            label='Employee Type Name'
            name='employee_Type_Name'
            rules={[
              {
                required: true,
                message: 'Please input your employee_Type Name!'
              },
              {
                pattern: new RegExp(/^[a-zA-Z ]+$/i),
                message: 'field does not accept numbers'
              }
            ]}
          >
            <Input style={{ width: "200px" }} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" style={{ backgroundColor: "lightgreen" }}>Save Changes</Button>
          </Form.Item>
        </Form>
      </>
    )
  }

  const [selectedRows, setSelectedRows] = useState([]);
  const hasSelected = selectedRows.length > 0;
  const hassSelected = selectedRows.length == 1;
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRow) => {
      setSelectedRows(selectedRow);
      setSelectedRowKeys(selectedRowKeys);
      setDeactivate(true);
      setSelectedRows(selectedRow);
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

  const showDeactivateModal = () => {
    showConfirmModal();
  }
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const showConfirmModal = () => {
    setIsConfirmModalVisible(true);
  };
  const handleConfirmCancel = () => {
    setIsConfirmModalVisible(false);
  };

  const handleConfirmOk = () => {
    var activateDesignation = '';
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
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditEmployeetypeIsActive',
        data: {
          id: element.employee_Type_Id,
          is_Active: false
        },
      }).then((r) => {
        clientdtl();

        $('#clientisactive');

        if (page == 1) {

          setPage(page);

        }

        else {

          setPage(page - 1);

        }

        // setMessage(r.request.status, element.employee_Type_Name + " - Deactivated Successfully");
        // const timeout = setTimeout(() => {
        //console.log('hii after 2 seconds');
        //   window.location.reload();
        // }, 1500);
        // window.location.reload();
        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllEmployeetype", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }
        })
          .then(data => setFilteredClient(data.data));
        return () => clearTimeout();
      })
      activateDesignation = activateDesignation + element.employee_Type_Name + ', ';
    });
    activateDesignation = activateDesignation.substring(0, activateDesignation.length - 2) + " ";
    debugger
    setMessage(200, activateDesignation + " Deactivated Successfully");
    debugger
    setIsActivateModal(false);
    setToggleActivate(false);
    setSelectedRows([]);
    setSelectedRowKeys([]);
    rowSelection = ''
    setIsConfirmModalVisible(false);
  }

  useEffect(() => {
    const result = clientDataSource.filter(cliDataSource => {
      return cliDataSource.employee_Type_Name.toLowerCase().match(search.toLowerCase());
    })
    setFilteredClient(result);
  }, [search])


  $("#dctemptypetable").hide();
  $(document).ready(function () {
    $('#validemp').on('change', function () {
      if (this.value == 1) {
        $("#emptypetable").show();
        $("#srcemp").show();
        $("#add1").show();
        $('#empisactive').show();
        $("#dctemptypetable").hide();
        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetAllEmployeetype", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }
        })
          .then(data => setFilteredClient(data.data))
      } else if (this.value == 0) {
        $("#dctemptypetable").show();
        $('#empisactive').hide();
        $("#srcemp").hide();
        $("#add1").hide();
        $("#emptypetable").hide();
      }
    });
  });

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
      <Popover position="top" content='Logout'>
     <button style={{width:'5em',backgroundColor:'#f77c7c',marginLeft:'91%',marginTop:'2%'}}>
     <LogoutOutlined  onClick={navig}   />
     </button>
       </Popover>
      <div style={{ position: "fixed", width: "85%", marginLeft: 250 }}>
        <p style={{ color: "blue", fontSize: 30 }}><b>Configuration</b></p>
        <Row><Col span={2}></Col>
          <Col span={4}><Link to="/Configuration/Client"><Button style={{ width: 130 }}>Client</Button></Link></Col>
          <Col span={4}><Link to="/Configuration/Project"><Button style={{ width: 130 }}>Project</Button></Link></Col>
          <Col span={4}><Link to="/Configuration/Designation"><Button style={{ width: 130 }}>Job Title</Button></Link></Col>
          <Col span={4} stylw={{ marginLeft: 10 }}><Link to="/Configuration/EmployeeType" disabled><Button style={{ width: 130 }} type="primary">Employee Type</Button></Link></Col>
          <Col span={4}><Link to="/Configuration/HrInfo" ><Button style={{ width: 130 }} >HR Contact Info</Button></Link></Col><Col span={2}></Col>
        </Row><Card className="table_border_antd" style={{ width: 1000, borderTopColor: "blue", borderLeftColor: "black", borderRightColor: "black", borderBottomColor: "black", borderTopWidth: 5, position: "fixed" }}>
          <h3 style={{ marginLeft: 100, color: "blue", fontSize: 30 }}><p><b>Employee Type</b></p></h3>
          <div style={{ marginLeft: 200, width: 600, marginTop: -30 }}>
            <Space direction="Horizantal" style={{ marginTop: 10 }}>
              <div id="srcemp" style={{ position: "fixed" }}>
                <Input
                  type="text"
                  placeholder="Search here...."
                  className="w-25% form-control"
                  value={search}
                  suffix={<SearchOutlined />}
                  style={{ width: 150 }}
                  onChange={(e) => setSearch(e.target.value)} /></div>
              <p style={{ fontWeight: "bold", fontSize: 20, position: "fixed", marginLeft: 200 }}>Active:</p>
              <select id="validemp" style={{ width: 70, height: 30, position: "fixed", marginLeft: 270 }}>
                <option disabled>-Select One-</option>
                <option value={1} selected="selector">Yes</option>
                <option value={0}>No</option>
              </select>
              <div id="empisactive" style={{ marginLeft: 320, position: "fixed", paddingLeft: '5%', display: 'inline' }}>
                <Button
                  hidden={!hasSelected}
                  type="danger"
                  onClick={showDeactivateModal}
                  icon={<CloseCircleOutlined />}
                >
                  Deactivate
                </Button></div>
              <div style={{ marginLeft: "1700%" }}>
                <Button type="primary" icon={<EditOutlined />} title="Edit"
                  onClick={() => {

                    onEdit();
                  }}
                  hidden={!hassSelected} />
              </div>
            </Space>
            <div id="emptypetable" style={{ marginTop: 30 }}>
              <Table
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
                rowKey={record => record.employee_Type_Id}
                rowSelection={{
                  type: Checkbox,
                  ...rowSelection,
                }}
                size="small"
                bordered
              /></div>
            <Button id="add1"
              type="link" rowKey="id"
              icon={<PlusCircleOutlined />}
              onClick={showAddData}
              style={{ marginLeft: 360, fontWeight: 'bolder', fontSize: 20 }}>ADD</Button>
            <Modal onOk={() => {
              form.validateFields().then((values) => {
                buttonOk(values)
                form.resetFields();
              })
                .catch((info) => {
                  console.log('validate Field:', info);
                });
            }}
              width={400}
              onCancel={buttonCancel}
              visible={isModalVisible}
              footer={[
                <Button
                  type="danger"
                  onClick={buttonCancel}
                >Cancel</Button>,
                <Button
                  type="primary"
                  onClick={() => {
                    form.validateFields().then((values) => {
                      buttonOk(values)
                      form.resetFields();
                    })
                      .catch((info) => {
                        console.log('validate Field:', info);
                      });
                  }}
                >ok</Button>
              ]}
            >
              <AddClient />
            </Modal>
          </div>
          <Modal
            visible={isEditing}
            //  okText="Save Changes"
            // okButtonProps={{ background: "#52c41a" }}
            // width={750}
            onCancel={() => {
              resetEditing()
            }}
            // onOk={() => {
            //   editsClient(edtCli)
            //   resetEditing()
            // }}
            footer={null}
          >
            <EditProjects
              dtl={edtCli}
            />
          </Modal>
          <Modal visible={isConfirmModalVisible}
            onOk={handleConfirmOk}
            onCancel={handleConfirmCancel}
            footer={[
              <Button type='primary' onClick={handleConfirmOk}>Yes</Button>,
              <Button type='primary' onClick={handleConfirmCancel}>No</Button>
            ]}>
            <h2 className="edt">Are you sure want to Deactivate the Employee Type?</h2>
          </Modal>

          <div id="dctemptypetable">
            <Readdeactivated />
          </div></Card></div>
    </>
  )
}
export default ReadEmpType ;