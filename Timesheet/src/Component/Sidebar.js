import { Button, Layout } from 'antd';
import React from 'react';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import Tb1 from './HRportal/Timesheet_Status/Year';
import Tb2 from './HRportal/Timesheet_Status/Month';
import Tb3 from './HRportal/Timesheet_Status/Employee';
import Userprofile from './HRportal/UserProfile/User Profile';
import Topnav from './HRportal/Employee/Topnav';
import Previouschange from './HRportal/Employee/Previouschange';
import Readdeactivated from './HRportal/Configuration/ClientTable/Readdeactivated';
import ClientRead from './HRportal/Configuration/ClientTable/ClientRead';
import ReadJob from './HRportal/Configuration/JobtitleTable/Read';
import ReadEmpType from './HRportal/Configuration/EmptypeTable/Read';
import Hrinfo from './HRportal/Configuration/Hrinfo';
import ReadProject from './HRportal/Configuration/ProjectTable/ReadProject';
import Uploadedimage from './HRportal/Timesheet_Status/Uploadedimage';
import Viewtimesheet from './HRportal/Timesheet_Status/Viewtimesheet';
import Login from './login';
import EUserprofile from './EMPportal/Userprofile/EUserprofile';
import EHrInfo from './EMPportal/Ehrcontact/Ehrcontact';
import EDashboard from './EMPportal/EDashboard/EDashboard';
import Dashboard from './HRportal/Dashboard/Dashboard';
import AddTimesheet from './EMPportal/AddTimesheet/AddTimesheet';
import TimesheetSummary from './EMPportal/ETimesheet_summary/TimesheetSummary';

const { Content } = Layout;

const Home = () => {

    return (
        <Layout >

            <Content style={{ backgroundColor: "white" }}>
                {/* <Button type='danger' style={{ width: 100, marginLeft: "90%" }}><Link to="">logout</Link></Button> */}
                <Routes>
                    <Route path="" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route exact path='/readdeactivated' element={<Readdeactivated />}></Route>
                    <Route path='/timesheetstatus' element={<Tb1 />} />
                    <Route path="/timesheet/month" element={<Tb2 />} />
                    <Route path="/timesheet/month/view" element={<Tb3 />} />
                    <Route path="/employee" element={<Topnav />} />
                    <Route path="/userprofile" element={<Userprofile />} />
                    <Route path="/employee/Previouschange" element={<Previouschange />} />
                    <Route path="/Configuration/Client" element={<ClientRead />} />
                    <Route path="/Configuration/EmployeeType" element={<ReadEmpType />} />
                    <Route path="/Configuration/Designation" element={<ReadJob />} />
                    <Route path="/Configuration/Project" element={<ReadProject />} />
                    <Route path="/Configuration/HrInfo" element={<Hrinfo />} />
                    <Route path="/Viewimage" element={<Uploadedimage />} />
                    <Route path="/Viewtimesheet" element={<Viewtimesheet />} />

                    {/* EMPLOYEE PORTAL */}
                    <Route path="/Euserprofile" element={<EUserprofile />} />
                    <Route path="/EDashboard" element={<EDashboard />} />
                    <Route path="/Ehrinfo" element={<EHrInfo />} />
                    <Route path="/Eaddtimesheet" element={<AddTimesheet />} />
                    <Route path="/Etimesheetsummary" element={<TimesheetSummary />} />
                </Routes>
            </Content>
        </Layout>
    );
};

const Tabs1 = () => (
    <HashRouter>
        <Home />
    </HashRouter>
);

export default Tabs1;