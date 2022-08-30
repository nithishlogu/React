import React, { useEffect, useState } from 'react'
import { Select } from 'antd';
import axios from 'axios';

function Project(props) {

    const [project, setProject] = useState([]);
    useEffect(() => {
        axios.get("https://timesheetjy.azurewebsites.net/api/Admin/GetAllProjects").then(r => setProject(r.data));
    }, []);

    const onProjectSelect = (value) => {
        const row = props.row;
        console.log(row);
        var dataSource = props.allRecord;
        var filteredColumn = dataSource.filter((a) => a.key === row.key)[0];
        filteredColumn.project = value;
        console.log(filteredColumn);
        console.log(dataSource);
        props.onSaveData(dataSource);
    }

    return (
        <Select
            style={{ width: '100%' }}
            defaultValue={props.row.project}
            onChange={(value) => onProjectSelect(value)}
            disabled={props.row.status.toLowerCase() === 'holiday' || props.row.status.toLowerCase() === 'leave' ? true : false}
        >
            {
                project.map(opt => (
                    <Select.Option value={opt.project_Id}>{opt.project_Name}</Select.Option>
                ))
            }
        </Select>
    )
}
export default Project
