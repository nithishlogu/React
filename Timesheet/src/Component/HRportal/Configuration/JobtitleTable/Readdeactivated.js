import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Row, Col, Modal, Table, message, Space } from "antd";
import { Checkbox } from 'semantic-ui-react';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import $ from 'jquery';


function Readdeactivated() {


  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [clientDataSource, setClientDataSoure] = useState([]);
  const [filteredClient, setFilteredClient] = useState([]);
  const [search, setSearch] = useState('');
  const [edtCli, setEdtCli] = useState([]);
  const [isactive, setIsActive] = useState(false);
  const [actCli, setActCli] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 5,
  });
  const toke = sessionStorage.getItem("token");
  const setMessage = (statusCode, responseMessage) => {
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
      message.error("Error, " + responseMessage);
    }
    else if (statusCode == 500) {
      message.error("Internal Server Error");
    }
    else {
      message.error(responseMessage);
    }
  }

  const clientdtl = async () => {
    const response = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetDesignationIs_Active", {
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
      title: 'Designations',
      dataIndex: 'designation_Name',
    },
    {
      title: 'No of employees',
      dataIndex: 'no_of_Employees',
    },

  ];


  const [selectedRows, setSelectedRows] = useState([]);
  const hasSelected = selectedRows.length > 0;
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRow) => {
      setSelectedRows(selectedRow);
      if (selectedRow.length === 0) {

      }
      $('#cliactbtn').show();
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
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditDesignationIsActive',
        data: {
          id: element.designation_Id,
          is_Active: true
        },     
      }).then((r) => {
       
        // setMessage(r.request.status, element.designation_Name + " - Activated Successfully");

        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetDesignationIs_Active", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }
        })
          .then(data => setFilteredClient(data.data))
          $('#cliactbtn').hide();
          if(page == 1)
          {
            setPage(page);
          }
          else{          
          setPage(page - 1);
          }
        
      })
      console.log(element.hr_Name)
      debugger
      activateDesignation = activateDesignation+element.designation_Name+', '; 
      debugger
    });
    activateDesignation = activateDesignation.substring(0, activateDesignation.length - 2) + " ";
    debugger
    setMessage(200, activateDesignation  + " Activated Successfully");
    debugger
    setIsConfirmModalVisible(false);
  }

  useEffect(() => {
    const result = clientDataSource.filter(cliDataSource => {
      return cliDataSource.designation_Name.toLowerCase().match(search.toLowerCase());
    })
    setFilteredClient(result);
  }, [search])

  return (
    <>
      <div style={{ marginLeft: 200, width: 600 }}>
        <Space direction="horizantal">
          <div style={{ marginTop: -5 }}>
            <Input
              type="text"
              placeholder="Search here...."
              suffix={<SearchOutlined />}
              className="w-25% form-control"
              value={search}
              style={{ width: 150 }} 
              onChange={(e) => setSearch(e.target.value)} /></div>
          <div id="cliactbtn" style={{ marginLeft: 270, marginTop: -9, position: "fixed" }}>
            <Button
              hidden={!hasSelected}
              type="primary"
              onClick={showDeactivateModal}
              icon={<CheckCircleOutlined />}
            >
              Activate
            </Button></div></Space>

        <div style={{ marginTop: 1 }}>
          <Table
            columns={clientDtlColumns}
            dataSource={filteredClient}
            rowKey={record => record.designation_Id}
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
          />
          <Modal
            visible={isConfirmModalVisible}
            onOk={handleConfirmOk}
            onCancel={handleConfirmCancel}
            footer={[
              <Button type='primary' onClick={handleConfirmOk}>Yes</Button>,
              <Button type='primary' onClick={handleConfirmCancel}>No</Button>
            ]}
          >
            <h2 className="edt">Are you sure want to Activate the Designation?</h2>
          </Modal>
        </div>
      </div>
    </>
  )


};
export default Readdeactivated;