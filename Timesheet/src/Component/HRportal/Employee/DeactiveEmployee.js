import { Button, Input, Modal, Row, Col, Table, message, Space } from "antd"
import { useState, useEffect } from "react";
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import axios from "axios";
import { Checkbox } from 'semantic-ui-react';
import $ from 'jquery';
import moment from 'moment';


function Deactivateemp() {

  const [dctemployDetails, setdctemployDetails] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const toke = sessionStorage.getItem("token");
  const setMessage = (statusCode, responseMessage) => {
    if (statusCode == 200) {
      message.success(responseMessage);
    }
    else if (statusCode == 404) {
      message.error("Error, URL Not Found");
    }
    else if (statusCode == 400) {
      message.error(responseMessage);
    }
  }


  const employ = async () => {
    const response = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetEmpIs_Active", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
    setdctemployDetails(response.data)
    setFilteredEmployee(response.data)
  }
  useEffect(() => {
    employ();
  }, []);

  const [desigDropdown, setDesigdropdown] = useState([]);
  const desig = async () => {
    const details0 = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetDesignations", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
    setDesigdropdown(details0.data);
    var optS = new Array();
    details0.data.map((ele) => {
      let optn = {
        text: ele.designation_Name,
        value: ele.designation_Name
      }
      optS.push(optn);
    })
    setFilteredoption(optS);
  }
  useEffect(() => {
    desig();
  }, []);

  const [typeDropdown, setTypeDropdown] = useState([]);
  const drptypes = async () => {
    const details1 = await axios("https://timesheetjy.azurewebsites.net/api/Admin/Get_Employeetypes", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
    setTypeDropdown(details1.data);
    var optionS = new Array();
    details1.data.map((element) => {
      let Option = {
        text: element.employee_Type_Name,
        value: element.employee_Type_Name
      }
      optionS.push(Option);
    })
    setfilteroption(optionS);
  }
  useEffect(() => {
    drptypes();
  }, []);
  // Fliter ON
  const [filteroption, setfilteroption] = useState();
  const [filteredoption, setFilteredoption] = useState();
  // FILTER OFF

  const dactiveemployDtlColumns = [
    {
      title: 'S.No',
      render: (value, item, index) => (page - 1) * 7 + index + 1,
      dataIndex: 'colid',
    },
    {
      title: 'Employee ID',
      dataIndex: 'employee_Id',
    },
    {
      title: 'Employee Name',
      render: (record) => (
        <span>{record.first_Name} {record.last_Name}</span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'employee_Type_Name',
      filters: filteroption,
      onFilter: (value, data) => data.employee_Type_Name.startsWith(value),
      filterSearch: true,
    },
    {
      title: 'Designation',
      dataIndex: 'designation_Name',
      filters: filteredoption,
      onFilter: (val, dat) => dat.designation_Name.startsWith(val),
      filterSearch: true,
    },
    {
      title: 'Reporting Manager',
      dataIndex: 'reporting_Manager1',
    },
    {
      title: 'Joining Date',
      dataIndex: 'joining_Date',
      render: (joining_Date) => { return (<p>{moment(joining_Date).format('DD - MM - YYYY')}</p>) },
    },
    {
      title: 'End Date',
      dataIndex: 'end_Date',
      render: (end_Date) => { return (<p>{moment(end_Date).format('DD - MM - YYYY')}</p>) }
    },
    {
      title: 'Official E-mail ID',
      dataIndex: 'email',
    },
    {
      title: 'Alternate E-mail ID',
      dataIndex: 'alternate_mail',
    },
    {
      title: 'Contact No',
      dataIndex: 'contact_No',
    },
  ]

  const [selectedRows, setSelectedRows] = useState([]);
  const hasSelected = selectedRows.length > 0;
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRow) => {
      setSelectedRows(selectedRow);
      if (selectedRow.length === 0) {

      }
      $("#act").show();
    }
  };
  const SelectionRow = {
    onChange: (selectedRowKeys, selectedRow) => {
      setSelectedRows(selectedRow);
      if (selectedRow.length === 0) {
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
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditEmployeIsActive',
        data: {
          id: element.employee_Id,
          is_Active: true
        }
      }).then((r) => {
        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetEmpIs_Active", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }
        })
          .then(data => setFilteredEmployee(data.data))
        debugger;
        setMessage(r.request.status, element.first_Name + element.last_Name + " Employee Activated Successfully");
        $("#act").hide();
      }).catch((error) => {
        setMessage(error.request.status);
      })
    });
  }

  useEffect(() => {
    const result = dctemployDetails.filter(emDataSource => {
      return emDataSource.employee_Id.toString().toLowerCase().match(search.toLowerCase()) ||
        emDataSource.first_Name.toLowerCase().match(search.toLowerCase()) ||
        emDataSource.last_Name.toLowerCase().match(search.toLowerCase()) ||
        emDataSource.employee_Type_Name.toLowerCase().match(search.toLowerCase()) ||
        emDataSource.designation_Name.toString().toLowerCase().match(search.toLowerCase()) ||
        emDataSource.reporting_Manager1.toLowerCase().match(search.toLowerCase()) ||
        emDataSource.email.toString().toLowerCase().match(search.toLowerCase()) ||
        emDataSource.contact_No.toLowerCase().match(search.toLowerCase())

    })
    setFilteredEmployee(result);
  }, [search])

  return (
    <div>
      <div id="emptable" style={{ marginTop: -26 }}>
        <Space>
          <Input
            type="text"
            placeholder="Search here...."
            suffix={<SearchOutlined />}
            value={search}
            style={{ width: 150, marginTop: -2 }}
            onChange={(e) => setSearch(e.target.value)} />
          <div id="act" style={{ marginLeft: 200, marginTop: -2 }}>
            <Button
              hidden={!hasSelected}
              type="primary"
              onClick={showDeactivateModal}
              icon={<CheckCircleOutlined />}
            >
              Activate
            </Button></div></Space>
        <div style={{ width: "72%" }}>
          <Table
            columns={dactiveemployDtlColumns}
            dataSource={filteredEmployee}
            style={{ marginTop: 10 }}
            rowKey={record => record.employee_Id}
            rowSelection={{
              type: Checkbox,
              ...rowSelection,
            }}
            pagination={{
              current: page,
              pageSize: pageSize,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize)
              }
            }}
            size="small"
            bordered
            scroll={{
              x: 1400
            }}
          /></div>
      </div>
      <Modal
        visible={isConfirmModalVisible}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        footer={[
          <Button type='primary' onClick={handleConfirmOk}>Yes</Button>,
          <Button type='primary' onClick={handleConfirmCancel}>No</Button>
        ]}
      >
        <h2 className="edt">Are you sure want to Activate the Employee?</h2>
      </Modal>
    </div>
  )
}
export default Deactivateemp;