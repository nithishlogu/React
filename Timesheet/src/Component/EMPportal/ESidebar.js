import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import Button from 'antd-button-color';

const Sidersbar = () => {
    const { Sider } = Layout;
    return (
        <>
            <Sider style={{ marginTop: -20, position: "fixed", height: "100%" }}>
                <Button style={{ marginTop: "85%", height: 40, width: 150, marginLeft: 20 }}><Link to="/EDashboard">Dashboard</Link></Button><br /><br />
                <Button style={{ height: 40, width: 150, marginLeft: 20 }}><Link to="/Etimesheetsummary">Timesheet summary</Link></Button><br /><br />
                <Button style={{ height: 40, width: 150, marginLeft: 20 }}><Link to="/Eaddtimesheet">Timesheet</Link></Button><br /><br />
                <Button style={{ height: 40, width: 150, marginLeft: 20 }}><Link to="/Ehrinfo">HR contact info</Link></Button><br /><br />
                <Button style={{ height: 40, width: 150, marginLeft: 20 }}><Link to="/Euserprofile">User Profile</Link></Button>
            </Sider>
        </>
    )
}

export default Sidersbar;