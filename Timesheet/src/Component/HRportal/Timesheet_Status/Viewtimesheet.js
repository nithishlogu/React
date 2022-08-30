import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";

function Viewtimesheet() {
    const navig = () => {
        navigate(-1);
        const timeout = setTimeout(() => {
            window.location.reload();
        }, 500);
        return () => clearTimeout(timeout);
    }
    const navigate = useNavigate();
    const [employee_Id, setemployee_Id] = useState(useLocation())
    const loc = useLocation();
    const location = useLocation();
    console.log(employee_Id);
    debugger
    class Preview extends React.Component {
        state = {
            image: null,
            loading: false,
            location: loc,
        };
        async componentDidMount() {
            const { year } = loc.state;
            const { Fiscol_Year_id } = loc.state;
            const { employee_Id } = loc.state;
            console.log(year, Fiscol_Year_id, employee_Id)
            const token =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2FjMjRhMWJmN2YzMjRhNTA4ZjhhMjYiLCJvcmdhbml6YXRpb25JZCI6IjVjYWMyNDY3ODAxZDAwNGEyZDNmMTk4OSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTU1NjgwMzg1NywiZXhwIjoxNTU5Mzk1ODU3fQ.4xfmVVWv5Cnr4FVleKLrzbstVq-63zCVUyeB-pQ0d1s";
            try {
                var t0 = performance.now();
                this.setState({ loading: true });
                const response = await axios.get(`https://timesheetjy.azurewebsites.net/api/UploadfileAzure/DownloadTimesheetimage?Employee_Id=${employee_Id}&Fiscal_year_Id=${Fiscol_Year_id}&Year=${year}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        responseType: "blob"
                    }
                );
                const reader = new FileReader();
                reader.readAsDataURL(response.data);
                const self = this;
                reader.onloadend = function () {
                    const base64data = reader.result;
                    self.setState({ image: base64data, loading: false });
                };
            } catch (error) {
                console.log(error);
            }
        }
        render() {
            const { loading, image } = this.state;
            return (
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ color: 'blue' }}>Approved Timesheet</h1>
                    {loading && (
                        <strong>
                            <h3>Timesheet not found ...</h3>
                        </strong>
                    )}
                    {!loading && <img src={`${image}`} />}
                    <button onClick={() => navig()}>BACK</   button>
                </div>
            );
        }
    }
    function App() {
        return (
            <div >
                <Preview />
            </div>
        );
    }
    const rootElement = document.getElementById("root");
    ReactDOM.render(<App />, rootElement);
}
export default Viewtimesheet;