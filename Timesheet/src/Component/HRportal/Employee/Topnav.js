import { Tabs } from 'antd';
import React from 'react';
import './Topnav.css';
import Tablee from './Tablee';

const { TabPane } = Tabs;

const Topnav = () => (
  <Tablee/>
  // <div className="card-container">
  //   <Tabs type="card" >
  //     <TabPane tab="Employee Details" key="1" >
  //       <Tablee/>
  //     </TabPane>
  //     <TabPane tab="Employee Projects" key="2">
  //       <Getemployeeproject/>
  //     </TabPane>
  //   </Tabs>
  // </div>
);

export default Topnav;