import { Tabs, Button } from 'antd';
import React from 'react';
import ClientRead from './ClientTable/ClientRead';
import './configuration.css';
import ReadEmpType from './EmptypeTable/Read';
import Hrinfo from './Hrinfo';
import ReadJob from './JobtitleTable/Read';
import { Link } from 'react-router-dom';


const { TabPane } = Tabs;

const Configurations = () => {
    return (
        <div>
            <Link to="/Configuration/Client"><Button>Client</Button></Link>
            <Link to=""><Button>Project</Button></Link>
            <Link to="/Configuration/Designation"><Button>Job Title</Button></Link>
            <Link to="/Configuration/EmployeType"><Button>Employee Type</Button></Link>
            <Link to="/Configuration/HrInfo"><Button>HR Contact Info</Button></Link>
      </div>
    );
  }
  export default Configurations;