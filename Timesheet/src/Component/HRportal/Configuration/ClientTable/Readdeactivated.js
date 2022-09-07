import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Row, Col, Modal, Table, message, Space } from "antd";
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Checkbox } from 'semantic-ui-react';
import $ from 'jquery';

function Readdeactivated() {

  const [clientDataSource, setClientDataSoure] = useState([]);
  const [filteredClient, setFilteredClient] = useState([]);
  const [search, setSearch] = useState('');
  const [edtCli, setEdtCli] = useState([]);
  const [isactive, setIsActive] = useState(false);
  const [actCli, setActCli] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const toke = sessionStorage.getItem("token");
  const setMessage = (statusCode, responseMessage) => {
    if (statusCode == 200) {
      message.success(responseMessage);
    }
    else if (statusCode == 404) {
      message.error("Error, URL Not Found");
    }
  }
 
  const clientdtl = async () => {
    const response = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetClientIs_Active", {
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
      title: 'COL_ID',
      render: (value, item, index) => (page - 1) * pageSize + index + 1,
      dataIndex: 'colid',
      width: "7rem"
    },
    {
      title: 'Client',
      dataIndex: 'client_Name',
      width: "20rem"
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
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditClientIsActive',
        data: {
          id: element.client_Id,
          is_Active: true
        },     
      }).then((r) => {
        //setMessage(r.request.status, element.client_Name + " Activated Successfully");
        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetClientIs_Active", {
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
      activateDesignation = activateDesignation+element.client_Name+', '; 
    });
    activateDesignation = activateDesignation.substring(0, activateDesignation.length - 2) + " ";
    debugger
    setMessage(200, activateDesignation  + " Activated Successfully");
    debugger
    setIsConfirmModalVisible(false);
  }

  useEffect(() => {
    const result = clientDataSource.filter(cliDataSource => {
      return cliDataSource.client_Name.toLowerCase().match(search.toLowerCase());
    })
    setFilteredClient(result);
  }, [search])

  return (
    <>
      <div style={{ marginLeft: 140, width: 400 }}>
        <Space direction="horizantal">
          <div style={{ marginTop: -5 }}>
            <Input
              type="text"
              title="search"
              suffix={<SearchOutlined />}
              placeholder="Search here...."
              className="w-25% form-control"
              value={search}
              style={{ width: 150 }}
              onChange={(e) => setSearch(e.target.value)} /></div>
          <div id="cliactbtn" style={{ marginLeft: 170, marginTop: -5 }}>
            <Button
              hidden={!hasSelected}
              type="primary"
              onClick={showDeactivateModal}
              icon={<CheckCircleOutlined />}
            >
              Activate
            </Button></div></Space>
        <div style={{ marginTop: 15,width:"150%" }}>
          <Table
            columns={clientDtlColumns}
            dataSource={filteredClient}
            rowKey={record => record.client_Id}
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
              y:200
            }}
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
            <h2 className="edt">Are you sure want to Activate the Client?</h2>
          </Modal>
        </div>
      </div>
    </>
  )
};
export default Readdeactivated;