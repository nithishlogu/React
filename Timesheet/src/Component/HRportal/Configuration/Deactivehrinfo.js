import { Table, Input, Modal, Radio, Row, Col, message, Space } from "antd"
import React, { useState, useEffect } from "react";
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import axios from "axios";
import Button from 'antd-button-color';
import { Checkbox, Label } from 'semantic-ui-react';
import $ from 'jquery';
import 'antd-button-color/dist/css/style.css';

function Deactivatehrinfo() {

  const [clientDataSource, setClientDataSoure] = useState([]);
  const [filteredClient, setFilteredClient] = useState([]);
  const [search, setSearch] = useState('');
  const [edtCli, setEdtCli] = useState([]);
  const [isactive, setIsActive] = useState(false);
  const [actCli, setActCli] = useState([]);
  const toke = sessionStorage.getItem("token");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const setMessage = (statusCode, responseMessage) => {
    if (statusCode == 200) {
      message.success(responseMessage, 2);
    }
    else if (statusCode == 404) {
      message.error("Error, URL Not Found");
    }
    else if (statusCode == 400) {
      message.error(responseMessage);
    }
  }

  const clientdtl = async () => {
    const response = await axios("https://timesheetjy.azurewebsites.net/api/Admin/GetHrContactInfoeIs_Active", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
    setClientDataSoure(response.data);
    setFilteredClient(response.data);
    console.log(response.data)
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
      title: 'Name',
      dataIndex: 'hr_Name',
    },
    {
      title: 'Mail_id',
      dataIndex: 'hr_Email_Id',
    },
    {
      title: 'Contactinfo',
      dataIndex: 'hr_Contact_No',
    },
  ];

  const [selectedRows, setSelectedRows] = useState([]);
  const hasSelected = selectedRows.length > 0;
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRow) => {
      setSelectedRows(selectedRow);
      if (selectedRow.length === 0) {

      }
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
        url: 'https://timesheetjy.azurewebsites.net/api/Admin/EditHrContactInfoIsActive',
        data: {
          id: element.hr_Contact_Id,
          is_Active: true
        },     
      }).then((r) => {
        setMessage(r.request.status, element.hr_Name + "Activated Successfully");
        $("#hractbtn").hide();
        const timeout = setTimeout(() => {
          window.location.reload();
        }, 1500);

        axios("https://timesheetjy.azurewebsites.net/api/Admin/GetHrContactInfoeIs_Active", {
          headers: {
            'Authorization': `Bearer ${toke}`
          }
        })
          .then(data => setFilteredClient(data.data))
        return () => clearTimeout(timeout);

      })
    });
  }

  useEffect(() => {
    const result = clientDataSource.filter(cliDataSource => {
      return cliDataSource.hr_Name.toLowerCase().match(search.toLowerCase()) ||
        cliDataSource.hr_Contact_No.toString().toLowerCase().match(search.toLowerCase()) ||
        cliDataSource.hr_Email_Id.toString().toLowerCase().match(search.toLowerCase())
    })
    setFilteredClient(result);
  }, [search])
  return (
    <>
      <div style={{ marginLeft: 110, width: 400 }}>
        <Space direction="horizantal">
          <div style={{ marginTop: -5 }}>
            <Input
              type="text"
              placeholder="Search here...."
              className="w-25% form-control"
              suffix={<SearchOutlined />}
              value={search}
              style={{ width: 150 }}
              onChange={(e) => setSearch(e.target.value)} /></div>
          <div id="hractbtn" style={{ marginLeft: 190, marginTop: -8 }}>
            <Button
              hidden={!hasSelected}
              type="primary"
              onClick={showDeactivateModal}
              icon={<CheckCircleOutlined />}
            >
              Activate
            </Button></div></Space>
        <div style={{ marginTop: 1, width: "150%" }}>
          <Table
            columns={clientDtlColumns}
            dataSource={filteredClient}
            rowKey={record => record.hr_Contact_Id}
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
            <h2 className="edt">Are you sure want to Activate the Hr?</h2>
          </Modal>
        </div>
      </div>
    </>
  )
};

export default Deactivatehrinfo;