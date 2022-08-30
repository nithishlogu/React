import { Modal, Space, Table, Card } from 'antd';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { Select, Input, Button, message } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import './AddTimesheet.css';
import Project from './Project';
import Status from './Status';
import Duration from './Duration';
import Sidersbar from '../ESidebar';

const setMessage = (statusCode, responseMessage) => {
    if (statusCode == 200) {
        message.success(responseMessage);
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


function AddTimesheet() {
    const month_name = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [project, setProject] = useState([]);
    const currentDate = new Date();
    const month = currentDate.getMonth() - 1;
    const year = currentDate.getFullYear();
    const Day_list = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const status_options = [
        { value: "Present", label: "Present", key: "Present" },
        { value: "Leave", label: "Leave", key: "Leave" },
        { value: "WFH", label: "WFH", key: "WFH" },
        { label: "Holiday", value: "Holiday", key: "Holiday" }
    ];
    const noOfDays = new Date(year, month + 1, 0).getDate();
    var [data, SetData] = useState([]);
    for (let i = 1; i <= noOfDays; i++) {
        data.push({
            key: i,
            date: format(new Date(year, month, i), 'yyyy-MM-dd'),
            day: Day_list[new Date(year, month, i).getDay()],
            status: Day_list[new Date(year, month, i).getDay()].toLowerCase() === 'saturday' || Day_list[new Date(year, 4 - 1, i).getDay()].toLowerCase() === 'sunday' ? "Holiday" : "",
            project: "",
            duration: null
        });
    }

    const [currentState, setCurrentState] = useState(data);
    const [daysWorked, setDaysWorked] = useState(0);
    const [leavesTaken, setLeavesTaken] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);



    useEffect(() => {
        calculateAttendance();
        calculateTotalDuration();
    }, [currentState]);

    const columns = [
        {
            key: "date",
            title: (<h4><b>Date</b></h4>),
            dataIndex: "date",
        },
        {
            key: "day",
            title: (<h4><b>Day</b></h4>),
            dataIndex: "day",
        },
        {
            key: "status",
            title: (<h4><b>Status</b></h4>),
            dataIndex: 'status',
            render: (_, record) => (
                <Status
                    allRecord={currentState}
                    defaultValue={record.status}
                    row={record}
                    onSaveData={saveCurrentState}
                    onDeleteRow={onDeleteRow}
                />
            )
        },
        {
            key: "project",
            title: (<h4><b>Project</b></h4>),
            dataIndex: 'project',
            render: (_, record) => (
                <Project
                    allRecord={currentState}
                    row={record}
                    onSaveData={saveCurrentState}
                />
            )
        },
        {
            key: "duration",
            title: (<h4><b>Duration</b></h4>),
            dataIndex: "duration",
            render: (_, record) => (
                <Duration
                    row={record}
                    allRecord={currentState}
                    onSaveData={saveCurrentState}
                />
            )
        },
        {
            key: "action",
            title: (<h4><b>Action</b></h4>),
            render: row => (
                <>
                    <Space>
                        <Button
                            type='info'
                            onClick={() => onAddProject(row)}
                            disabled={row.status.toLowerCase() === 'leave' || row.status.toLowerCase() === 'holiday' ? true : false}
                        >
                            Add Project
                        </Button>
                        {row.key > 99 ? <Button type='danger' onClick={() => onDeleteRow(row)} disabled={row.status.toLowerCase() === 'leave' || row.status.toLowerCase() === 'holiday' ? true : false}>Delete</Button> : ''}
                    </Space>
                </>
            )
        }
    ];
    const columns_summary = [
        {
            key: "summary_date",
            title: (<h4><b>Date</b></h4>),
            render: () => <Input
                value={format(new Date(), 'dd-MM-yyyy')}
                readOnly={true}
            />
        },
        {
            key: "no_of_days_worked",
            title: (<h4><b>No of Days Worked</b></h4>),
            dataIndex: 'no_of_days_worked'
        },
        {
            key: "no_of_leaves_taken",
            title: (<h4><b>No of Leaves Taken</b></h4>),
            dataIndex: 'no_of_leaves_taken'
        },
        {
            key: "no_of_leaves_taken",
            title: (<h4><b>Total Duration(hrs)</b></h4>),
            dataIndex: 'total_duration'
        }
    ];

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const saveCurrentState = (newRecord) => {
        var presentState = [...newRecord];
        console.log(presentState);
        setCurrentState(presentState);
    }

    const summary_data = [
        {
            key: "summary_data1",
            no_of_days_worked: daysWorked,
            no_of_leaves_taken: leavesTaken,
            total_duration: totalDuration
        }
    ];

    const onAddProject = (row) => {
        const newRecord = {
            key: Math.random() + 100,
            date: row.date,
            day: row.day,
            status: row.status === '' ?
                row.day.toLowerCase() === 'saturday' || row.day.toLowerCase() === 'sunday' ? "Holiday" : '' : row.status,
            project: row.project,
            duration: Number(0),
        }
        const newState = [...currentState];
        const index = currentState.indexOf(row);
        newState.splice(index + 1, 0, newRecord);
        setCurrentState(newState);
    }

    const onDeleteRow = (row) => {
        const record = [...currentState];
        const index = record.indexOf(row);
        record.splice(index, 1);
        setCurrentState(record);
    }

    const calculateAttendance = () => {
        const newCopy = [...currentState];
        var leave = 0, worked = 0;
        newCopy.forEach(element => {
            if (element.status.toLowerCase() === 'leave' && (element.key < 100)) {
                leave++;
            }
            if ((element.status.toLowerCase() === 'present' || element.status.toLowerCase() === 'wfh') && element.key < 100) {
                worked++;
            }
        });
        setLeavesTaken(leave);
        setDaysWorked(worked);
    }

    const calculateTotalDuration = () => {
        var totalHrs = 0;
        currentState.forEach(element => {
            if (element.duration > 0) {
                totalHrs += Number(element.duration);
            }
        });
        setTotalDuration(Number(totalHrs));
    }

    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    }))
            )
        },
    });

    const images = files.map((file) => (
        <div>
            <div><img src={file.preview} style={{ width: "200px" }} alt="preview" /></div>
        </div>
    ));

    const uploadApprovedTimesheet = async () => {
        await axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
            url: 'https://timesheetjy.azurewebsites.net/api/UploadfileAzure/EmployeeUploadImage',
            data: {
                Employee_Id: 23,
                Fiscol_Year_Id: 7,
                year: 2022,
                Images: files
            }
        }).then(async (r) => {
            setMessage(r.status, r.data);
        });
    }

    const downloadXL = async () => {
        await axios({
            url: `https://timesheetjy.azurewebsites.net/api/Employee/ExportExcel?id=${1}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Timeheet.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    const postData = () => {

        const newState = [];

        currentState.forEach(element =>
            newState.push({
                // project_Id: element.project,
                project_Id: element.status.toLowerCase() === 'present' || element.status.toLowerCase() === 'wfh' ? element.project : 0,
                date: element.date,
                day: element.day,
                leave: element.status.toLowerCase() === 'leave' || element.status.toLowerCase() === 'holiday' ? true : false,
                // duration_in_Hrs: element.duration === null ? parseInt(0) : parseInt(element.duration),
                duration_in_Hrs: element.status.toLowerCase() === 'present' || element.status.toLowerCase() === 'wfh' ? parseInt(element.duration) : parseInt(0),
                timesheet_summary_Id: 0
            }));

        axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
            url: 'https://timesheetjy.azurewebsites.net/api/Employee/AddTimeSheet',
            data: {
                employee_Id: 1,
                fiscalYear_Id: 6,
                year: year,
                noOfdays_Worked: summary_data[0].no_of_days_worked,
                noOfLeave_Taken: summary_data[0].no_of_leaves_taken,
                total_Working_Hours: summary_data[0].total_duration,
                addTimesheetDay: newState
            }
        })

    }



    return (
        <Space direction='horizantal'>
            <Sidersbar />
            <Card style={{ marginLeft: 300 }}>
                <React.Fragment>

                    <h1 style={{ color: 'Blue', paddingLeft: 30 }}><b>{`${month_name[month]}`}-2022 TIMESHEET</b></h1>
                    <div style={{ position: "relative", left: 250, top: -40 }}>
                        <Space>
                            <Button type="primary" onClick={downloadXL}><DownloadOutlined /> Download XL</Button>
                            <Button type="primary" onClick={showModal}><UploadOutlined /> Approved Timesheet</Button>
                            <Button type="primary"><UploadOutlined /> Approval Image</Button>
                        </Space>
                    </div>

                    <Table
                        columns={columns_summary}
                        dataSource={summary_data}
                        pagination={false}
                    />
                    <Table
                        columns={columns}
                        dataSource={currentState}
                        pagination={false}
                    />
                    <div style={{ paddingLeft: '85%', paddingTop: 10 }}>
                        <Button onClick={() => postData()} type="primary">Post</Button>
                    </div>

                    <Modal
                        title="Basic Modal"
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={[
                            <Button
                                onClick={() => {
                                    setFiles([]);
                                    setIsModalVisible(!isModalVisible);
                                }}
                                type='danger'
                            >
                                cancel</Button>,
                            <Button
                                type='success'
                                onClick={uploadApprovedTimesheet}
                            >Send</Button>
                        ]}
                    >
                        <div>
                            <h3>Upload Approval Timesheet</h3>
                            <h4>Timesheet File</h4>
                            <div className='drop-box' style={{ height: 'auto' }}>
                                {files.length === 0
                                    ?
                                    <div {...getRootProps()} style={{ Alignment: "center", paddingTop: '4%' }}>
                                        <UploadOutlined size={'large'} />
                                        <h3 style={{ color: "darkgray" }}>Drag and Drop your files</h3>

                                        <input {...getInputProps()} />
                                    </div> : ''
                                }
                                <div>
                                    {images}
                                </div>
                            </div>
                        </div>
                    </Modal>
                </React.Fragment>
            </Card>
        </Space>
    );
}

export default AddTimesheet