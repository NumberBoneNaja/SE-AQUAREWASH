import React from 'react';

import Home from '../../../assets/icon/ForPage/Admin/HomePage.png'
import Hall from '../../../assets/icon/ForPage/Admin/CityHall.png'
import Package from '../../../assets/icon/ForPage/Admin/StoreSetting.png'
import Job from '../../../assets/icon/ForPage/Admin/JobSeeker.png'
import '../Main.css';

import { useNavigate } from 'react-router-dom';
import EmployeeBar from '../../../Components/Nav_bar/EmployeeBar';
import EmSidebar from '../../../Components/Nav_bar/EmSidebar';

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const handleClickToPackage = () => {
        navigate('/AdminPackage');
    };
    const handleClickToJob = () => {
        navigate('/AdminJob');
    };

    const handleClickToAdminMachine = () => {
        navigate('/AdminMachine');
    };

    return(
        <div>
            <EmployeeBar page="AllOrderUser"/>
            <EmSidebar page="EmAllOrder"/>
            <div style={{height: '110px',zIndex: '0'}}></div>
            <h1 className='H1Management'>Welcome to Management</h1>
            <p className='PManagement'>What do you want to do?</p>
            <div className='Mainpage'>
                <p className='ManageMainPage'><img src={Home} alt="Home" />Manage Main Page</p>
            </div>
            <div className='Management'>
            <span className='ManagementSpan' onClick={handleClickToAdminMachine}>
                    <img src={Hall} alt="Hall" />
                    <span>Manage Machine</span>
                </span>
                <span className='ManagementSpan' onClick={handleClickToPackage}>
                    <img src={Package} alt="Package" />
                    <span>Manage Package</span>
                </span>
                <span className='ManagementSpan' onClick={handleClickToJob} >
                    <img src={Job} alt="Job" />
                    <span>Manage Job</span>
                </span>
            </div>

        </div>

    );

};

export default Admin;