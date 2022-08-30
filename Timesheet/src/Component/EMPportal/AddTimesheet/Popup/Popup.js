import { Button, Input } from 'antd';
import React, { useState } from 'react'
import './Popup.css'
import { UploadOutlined } from '@ant-design/icons';

function Popup(props) {
  

  return props.trigger ? (
    <div className="popup-box">
        <div className="box">
            <button className="btn-close" onClick={()=>{ props.setTrigger(false) }}>x</button>
            {props.children}
        </div>
    </div>
  ):"";
}

export default Popup;