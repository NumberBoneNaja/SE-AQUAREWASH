import React, { useEffect, useState } from 'react';
import '../Main.css'
import PicB from '../../../assets/icon/ForPage/Store/Store3.jpg'
import PicP from '../../../assets/icon/ForPage/MainIcon/HuTaopic.jpg'

import { GetUserByStatus , UpdateUserByid , ListUser} from '../../../services/https';
import { UsersInterface } from '../../../interfaces/UsersInterface';
const AdminJob: React.FC = () => {
    const [user,setuser] = useState<UsersInterface[]>([]);
    //const [Alluser,setAlluser] = useState<UsersInterface[]>([]);
    useEffect(() => {
        //fetchData('Admin');
        fetchAlluser();
    },[])
    const fetchData = async (Status : string) => {
        try {
            const res = await GetUserByStatus(Status)
            if (res.status === 200 ) {
                setuser(res.data)
                console.log("succes!!!")
            }else {
                setuser([])
            }
        } catch (error) {
            setuser([])
            console.error("Error fetching user data:", error);
        }
    }
    const fetchAlluser = async () => {
        try {
            const res = await ListUser()
            if (res.status === 200 ) {
                setuser(res.data)
                console.log("succes!!!")
            }else {
                setuser([])
            }
        } catch (error) {
            setuser([])
            console.error("Error fetching all user data:", error);
        }
    }
    const setBtn = (state : any) => {
        if (state === 1) {
            fetchData("WaitMemberA");
        }else if (state === 2) {
            fetchData("WaitMemberB");
        }else if (state === 3) {
            fetchData("WaitMemberC");
        }else if (state === 4) {
            fetchData("WaitMemberD");
        }else if (state === 5) {
            fetchData("WaitMemberE");
        }else{
            window.location.reload();
        }
    }
    //================================== update status ===================================
    const UpdateStatus = async (userdata : UsersInterface, newStatus: string) => {
        const values : UsersInterface = {...userdata , Status: newStatus}
        try {
            const res = await UpdateUserByid(String(userdata.ID), values);
            if (res.status === 200) {
                setTimeout(() => {
                    window.location.reload();
                }, 500); //ดีเลย์ 500
            } else {

            }
        } catch (error) {

        }
    }
    const setData = (data : UsersInterface) => {
        //const newStatus = "Admin";
        if (data.Status == "WaitMemberA") {
            const newStatus = "Rank A";
            UpdateStatus(data,newStatus);
        }else if(data.Status == "WaitMemberB"){
            const newStatus = "Rank B";
            UpdateStatus(data,newStatus);
        }else if(data.Status == "WaitMemberC"){
            const newStatus = "Rank C";
            UpdateStatus(data,newStatus);
        }else if(data.Status == "WaitMemberD"){
            const newStatus = "Rank D";
            UpdateStatus(data,newStatus);
        }else if(data.Status == "WaitMemberE"){
            const newStatus = "Rank E";
            UpdateStatus(data,newStatus);
        }
    }
    const Notapproved = (data : UsersInterface) => {
        const newStatus = "User";
        UpdateStatus(data,newStatus);
    }
    return (
        <>
            <div style={{height: '110px',zIndex: '0'}}></div>
            <h1 className='headJob'>Job application results</h1>
            <div className='selcetStatus'>
                <p onClick={() => setBtn(1)}>Wait MemberA</p>
                <p onClick={() => setBtn(2)}>Wait MemberB</p>
                <p onClick={() => setBtn(3)}>Wait MemberC</p>
                <p onClick={() => setBtn(4)}>Wait MemberD</p>
                <p onClick={() => setBtn(5)}>Wait MemberE</p>
                <p onClick={() => setBtn(6)}>Get All User</p>
            </div>
            <div style={{margin: '0px 20%'}}>
                <div className='JobRQ' >
                {user.length > 0 ? (
                    user.map((data) => (
                            <div className='cardUser'key={data.ID}>
                                <img src={data.ProfileBackground||PicB} alt="" className='backgroundUserJob' />
                                <img src={data.Profile||PicP} alt="" className='ProfileUserJob' />
                                <div className='infoUser'>
                                    <p style={{fontSize: '16px' ,fontWeight: '900'}}>{data.UserName}</p>
                                    <p>{data.FirstName} {data.LastName}</p>
                                    <p>{data.Email}</p>
                                    <p>{data.Tel}</p>
                                </div>
                                <div className='StatusUser'>{data.Status}</div>
                                <div className='setButton'>
                                    {(data?.Status === 'WaitMemberA' || data?.Status === 'WaitMemberB' || data?.Status === 'WaitMemberC' || data?.Status === 'WaitMemberD' || data?.Status === 'WaitMemberE') &&
                                    <>
                                        <p onClick={() => setData(data)}>Approve</p>
                                        <p onClick={() => Notapproved(data)}>Not approved</p>
                                    </>
                                    }
                                </div>
                            </div>
                    ))
                ) : (
                    <>
                        <h1 style={{textAlign: 'center'}}>No applicants</h1>
                    </>
                )}
                </div>
            </div>
        </>
    );
};

export default AdminJob;