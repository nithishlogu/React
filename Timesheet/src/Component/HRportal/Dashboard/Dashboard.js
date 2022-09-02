import { VictoryPie } from "victory-pie";
import axios from "axios";
import { Layout, Card, Col, Space, Select, Divider, Button } from 'antd';
import { useState, useEffect, React } from 'react';
import { Link, useLocation, useSearchParams } from "react-router-dom";
import './Dashboard.css';

const { Option } = Select;
const { Sider, Content } = Layout;

const Dashboard = (props) => {

  const [timesheetStatus, setTimesheetStatus] = useState([]);
  const [colorScale, setColorScale] = useState([]);
  // const currentDate = new Date();
  const [year, setYear] = useState((new Date().getFullYear()));
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [count, setCount] = useState(0);
  const toke = sessionStorage.getItem("token");
  const [yrDropdown, setYrDropdown] = useState([]);
  const dphrs = async () => {
    const details1 = await axios.get("https://timesheetjy.azurewebsites.net/api/Admin/GetTimeSheets", {
      headers: {
        'Authorization': `Bearer ${toke}`
      }
    })
    setYrDropdown(details1.data);
  }
  useEffect(() => {
    dphrs();
  }, []);

  useEffect(() => {
    const empdtl = axios({
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': `Bearer ${toke}`
      },
      url: `https://timesheetjy.azurewebsites.net/api/Admin/GetbyDashboard?year=${parseInt(year)}&month_id=${parseInt(month)}`,
    }).then((response) => {
      var appCnt = 0, penCnt = 0, rejCnt = 0;
      if (response.data.length > 0) {
        const data = response.data;
        const scale = [];
        data.forEach(element => {
          if (element.x.toLowerCase() == 'approved') {
            appCnt = element.y;
            scale.push('blue')

          } else if (element.x.toLowerCase() == 'pending') {
            penCnt = element.y;
            scale.push('rgb(233, 127, 41)')
          } else if (element.x.toLowerCase() == 'rejected') {
            rejCnt = element.y;
            scale.push('rgba(119, 136, 153, 0.849)')
          }

        });
        setCount(appCnt + penCnt + rejCnt);
        setColorScale(scale);

        setTimesheetStatus(data);
        console.log(response.data);


      }
      else {
        const data = [
          { x: " ", y: 0 },
          { x: " ", y: 0 },
          { x: " ", y: 0 },
        ];
        setCount(0);
        setTimesheetStatus(data);
        console.log(response.data);
      }
    });
  }, [year, month,]);

  useEffect(() => {
    const empdtl = axios({
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': `Bearer ${toke}`
      },
      url: `https://timesheetjy.azurewebsites.net/api/Admin/GetbyDashboard?year=${parseInt(year)}&month_id=${parseInt(month)}`,
    }).then((response) => {
      var appCnt = 0;
      var penCnt = 0;
      var rejCnt = 0;
      if (response.data.length > 0) {
        const data = response.data;
        const scale = [];
        data.forEach(element => {

          if (element.x.toLowerCase() == 'approved') {
            appCnt = element.y;
            scale.push('blue')
          } else if (element.x.toLowerCase() == 'pending') {
            penCnt = element.y
            scale.push('rgb(233, 127, 41)')
          } else if (element.x.toLowerCase() == 'rejected') {
            rejCnt = element.y
            scale.push('rgba(119, 136, 153, 0.849)')
          }
        });
        setCount(appCnt + penCnt + rejCnt);
        setColorScale(scale);

        setTimesheetStatus(data);
        console.log(response.data);
      }
      else {
        const data = [
          { x: " ", y: 0 },
          { x: " ", y: 0 },
          { x: " ", y: 0 },
        ];
        setTimesheetStatus(data);
        console.log(response.data);
      }
    });

  }, []);


  return (
    <div style={{ backgroundColor: "white", marginTop: 0 }}>
      <Sider style={{ padding: " 16% 0%", position: "fixed", maxHeight: "100%", backgroundColor: "white", marginLeft: 20, marginTop: -100 }}>
        <Button type="primary" style={{ width: 200, margin: "0 10%", height: 50, marginTop: 20 }}>
          <Link to="/dashboard"><b>Dashboard</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/Configuration/Client"><b>Configuration</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/timesheetstatus"><b>Timesheet Status</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/employee"><b>Employees</b></Link>
        </Button><Button style={{ margin: "0 10%", width: 200, height: 50 }}>
          <Link to="/userprofile"><b>User Profile</b></Link>
        </Button>
      </Sider>
      <div style={{ width: 750, height: 600, marginLeft: 250, marginTop: -20, backgroundColor: "white" }}>
        <Layout>
          <Space direction="horizontal">
            <Space direction="horizantal">
              <div style={{ marginTop: "30px", marginLeft: "60px", padding: 70, position: "fixed" }}>
                <Link to="/timesheet/month/view" state={{ year: year, month: month }}>
                  <Button style={{
                    marginLeft: 10,
                    marginTop: 85,
                    width: '210px',
                    height: '310px',
                    border: "2.5px solid black",
                    borderRadius: '50%',
                    fontSize: '28px',
                    color: 'red',
                    fontWeight: 'bold',
                    lineHeight: '50px',
                    textAlign: 'center',
                    background: 'lightskyblue'
                  }}
                    variant="contained" color="secondary">
                    {count} Employees
                  </Button> </Link>

              </div>
            </Space>

            <Space>
              <div class="Year" style={{ position: "fixed", margin: "65px 0px 0px 500px" }}>

                <Select value={year} onChange={(value) => { setYear(value) }} style={{ width: 76, border: "1.5px solid black" }} placeholder="Year">
                  {(yrDropdown && yrDropdown.length > 0) && yrDropdown.map((hpDown) => {
                    return <Select.Option value={hpDown.year}>
                      {hpDown.year}</Select.Option>
                  })}
                </Select>
              </div>


              <div class="Month" style={{ margin: "65px 0px 0px 590px", position: "fixed" }}>

                {/* <Select  value = {month} onChange={(value) => { setMonth(value) }} style={{ width: 73,border: "1.5px solid black"}}  placeholder="Month">
                              {(monDropdown && monDropdown.length > 0) && monDropdown.map((hpDownn) => {
                                return <Select.Option value={hpDownn.monthID}>
                                  {hpDownn.month}</Select.Option>
                              })}
                            </Select> */}
                <Select value={month} onChange={setMonth} style={{ width: 73, border: "1.5px solid black" }} placeholder="Month">

                  <Option value={1}><b>Jan</b></Option>
                  <Option value={2}><b>Feb</b></Option>
                  <Option value={3}><b>Mar</b></Option>
                  <Option value={4}><b>Apr</b></Option>
                  <Option value={5}><b>May</b></Option>
                  <Option value={6}><b>Jun</b></Option>
                  <Option value={7}><b>Jul</b></Option>
                  <Option value={8}><b>Aug</b></Option>
                  <Option value={9}><b>Sep</b></Option>
                  <Option value={10}><b>Oct</b></Option>
                  <Option value={11}><b>Nov</b></Option>
                  <Option value={12}><b>Dec</b></Option>
                </Select>
              </div>
            </Space>
            <div style={{ position: "fixed", border: "2px solid black", marginTop: 120, marginLeft: 450 }}>
              <div id="ef">
                <h1 id="xy" style={{ color: 'lightskyblue', }}>Timesheet {month} - {year} status</h1>
                <div style={{ marginTop: -50, marginLeft: 10 }}>
                  <VictoryPie
                    data={timesheetStatus}

                    style={{
                      data: {
                        stroke: "white", strokeWidth: 1
                      },
                      labels: { fontSize: 18, fill: "white" }

                    }}
                    labels={({ datum }) => datum.x + "\n" + datum.y}
                    labelRadius={53}
                    colorScale={colorScale}
                    radius={145}
                  /></div>
                <div style={{ marginTop: -30 }} id="ij">
                  <h2 id="ab" style={{ color: 'lightskyblue', marginLeft: 50 }}>Sent : {count} </h2>

                </div>
              </div>
            </div>
          </Space>


        </Layout>
      </div>
    </div>

  );

};

export default Dashboard;
