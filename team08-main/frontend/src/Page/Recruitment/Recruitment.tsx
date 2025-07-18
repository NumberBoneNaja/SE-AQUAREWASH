import React, { useEffect, useState } from 'react';
import './Recruitment.css';
//import Stonk from '../../assets/icon/ForPage/Job/Stonk.png';
//import Wow from '../../assets/icon/ForPage/Job/Wow.png';
//import Bennett from '../../assets/icon/ForPage/Job/Bennett.png';
//import Jean from '../../assets/icon/ForPage/Job/Jean.png';
//import Noelle from '../../assets/icon/ForPage/Job/Noelle.png';
import Klee from '../../assets/icon/ForPage/Job/Klee.png';
import A from '../../assets/Rank/A.png';
import B from '../../assets/Rank/B.png';
import C from '../../assets/Rank/C.png';
import D from '../../assets/Rank/D.png';
import E from '../../assets/Rank/E.png';
import F from '../../assets/Rank/F.png';


import { UsersInterface } from '../../interfaces/UsersInterface';
import { GetUserById , UpdateUserByid} from '../../services/https';
const Recruitment: React.FC = () => {
    const images = [A,B,C,D,E,F];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); 

        return () => clearInterval(interval);
    }, []);

    const [Popup, setPopup] = useState(false);
    const SaveStatus = (S : any) => {
        if (S == 1) {
            setStatusHolder('WaitMemberE')
        }else if (S == 2) {
            setStatusHolder('WaitMemberD')
        }else if (S == 3) {
            setStatusHolder('WaitMemberC')
        }else if (S == 4) {
            setStatusHolder('WaitMemberB')
        }else if (S == 5) {
            setStatusHolder('WaitMemberA')
        }
        setPopup(true)
    };
    const ClosePopupState = () => {
        setPopup(false)
    }

    //====================================data user========================================
    const [user, setUser] = useState<UsersInterface | null>(null); // State to store user data
    const userIdstr = localStorage.getItem("id");
    useEffect(() => {
        if (userIdstr) {
            fetchUserData(userIdstr);
        } else {
            
        }
    }, [userIdstr]);
    const fetchUserData = async (userIdstr: string ) => {
        try {
            const res = await GetUserById(userIdstr);
            if (res.status === 200) {
                setUser(res.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    const [checked, setChecked] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
    }
    //================================== update status ===================================
    const UpdateStatus = async (user : UsersInterface) => {
        const values : UsersInterface = {...user , Status: StatusHolder}
        try {
            const res = await UpdateUserByid(String(userIdstr), values);
            if (res.status === 200) {
                setPopup(false)
                setTimeout(() => {
                    window.location.reload();
                }, 500); 
            } else {

            }
        } catch (error) {

        }
    }
    const [StatusHolder, setStatusHolder] = useState('');
    const SubmitStatus = () => {
        if (user) {
            UpdateStatus(user);
        }
    };
    return(
        <>
            <div style={{height: '110px',zIndex: '0'}}></div>
            <div className='JobContenner'>
                <img src={images[currentImageIndex]} width={300} height={300} />
                <div className='InfoJobPreview'>
                    <p>Lorem ipsum dolor sit amet consectetur.</p>
                    <h1>Your dream job is waiting here!</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus nesciunt laboriosam numquam <br /> nemo at ad corrupti. Quos aspernatur dolorum labore, voluptas non minus voluptatum libero <br /> laudantium! Totam quos dolores distinctio?</p>
                </div>
                
            </div>

            {/* <div style={{width: 'auto' , height: '4px' , backgroundColor: '#E8D196', margin: '40px 150px'}}></div> */}

            <div className='BoxJob'>
                <div className='BoxJobC' onClick={() => SaveStatus(1)}>
                    <img src={E} width={100} />
                    <p>299 Bath 💵</p>
                    <p style={{fontSize: '14px' , fontWeight: '100', margin: '20px'}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas hic quod sapiente ab culpa ullam.</p>
                </div>
                <div className='BoxJobC' onClick={() => SaveStatus(2)}>
                    <img src={D} width={100} />
                    <p>599 Bath 💴</p>
                    <p style={{fontSize: '14px' , fontWeight: '100', margin: '20px'}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas hic quod sapiente ab culpa ullam.</p>
                </div>
                <div className='BoxJobC' onClick={() => SaveStatus(3)}>
                    <img src={C} width={100} />
                    <p>799 Bath 💶</p>
                    <p style={{fontSize: '14px' , fontWeight: '100', margin: '20px'}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas hic quod sapiente ab culpa ullam.</p>
                </div>
                <div className='BoxJobC' onClick={() => SaveStatus(4)}>
                    <img src={B} width={100} />
                    <p>1699 Bath 💷</p>
                    <p style={{fontSize: '14px' , fontWeight: '100', margin: '20px'}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas hic quod sapiente ab culpa ullam.</p>
                </div>
                <div className='BoxJobC' onClick={() => SaveStatus(5)}>
                    <img src={A} width={100} />
                    <p>3599 Bath💎</p>
                    <p style={{fontSize: '14px' , fontWeight: '100', margin: '20px'}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas hic quod sapiente ab culpa ullam.</p>
                </div>
            </div>

            <div className='MemberA'>
                <img src={A} width={400} height={400} />
                <div className='infoA'>
                    <h1>Rank A</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel debitis repellat maiores cumque quidem consectetur soluta magni vitae, cupiditate necessitatibus explicabo vero saepe ut. Omnis incidunt vitae porro. Accusamus dolorum, expedita eligendi nostrum voluptates nam! Nulla sapiente tenetur in blanditiis ab architecto consequuntur nobis perferendis accusantium? Voluptate quia eaque delectus!</p>
                </div>
            </div>
            <div className='MemberB'>
                <div className='infoB'>
                    <h1>Rank B</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel debitis repellat maiores cumque quidem consectetur soluta magni vitae, cupiditate necessitatibus explicabo vero saepe ut. Omnis incidunt vitae porro. Accusamus dolorum, expedita eligendi nostrum voluptates nam! Nulla sapiente tenetur in blanditiis ab architecto consequuntur nobis perferendis accusantium? Voluptate quia eaque delectus!</p>
                </div>
                <img src={B} width={400} height={400} />
            </div>
            <div className='MemberA'>
                <img src={C} width={400} height={400} />
                <div className='infoA'>
                    <h1>Rank C</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel debitis repellat maiores cumque quidem consectetur soluta magni vitae, cupiditate necessitatibus explicabo vero saepe ut. Omnis incidunt vitae porro. Accusamus dolorum, expedita eligendi nostrum voluptates nam! Nulla sapiente tenetur in blanditiis ab architecto consequuntur nobis perferendis accusantium? Voluptate quia eaque delectus!</p>
                </div>
            </div>
            <div className='MemberB'>
                <div className='infoB'>
                    <h1>Rank D</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel debitis repellat maiores cumque quidem consectetur soluta magni vitae, cupiditate necessitatibus explicabo vero saepe ut. Omnis incidunt vitae porro. Accusamus dolorum, expedita eligendi nostrum voluptates nam! Nulla sapiente tenetur in blanditiis ab architecto consequuntur nobis perferendis accusantium? Voluptate quia eaque delectus!</p>
                </div>
                <img src={D} width={400} height={400} />
            </div>
            <div className='MemberA'>
                <img src={E} width={400} height={400} />
                <div className='infoA'>
                    <h1>Rank E</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel debitis repellat maiores cumque quidem consectetur soluta magni vitae, cupiditate necessitatibus explicabo vero saepe ut. Omnis incidunt vitae porro. Accusamus dolorum, expedita eligendi nostrum voluptates nam! Nulla sapiente tenetur in blanditiis ab architecto consequuntur nobis perferendis accusantium? Voluptate quia eaque delectus!</p>
                </div>
            </div>
            <div className='MemberB'>
                <div className='infoB'>
                    <h1>Rank F</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel debitis repellat maiores cumque quidem consectetur soluta magni vitae, cupiditate necessitatibus explicabo vero saepe ut. Omnis incidunt vitae porro. Accusamus dolorum, expedita eligendi nostrum voluptates nam! Nulla sapiente tenetur in blanditiis ab architecto consequuntur nobis perferendis accusantium? Voluptate quia eaque delectus!</p>
                </div>
                <img src={F} width={400} height={400} />
            </div>


            
                <div className={`Information ${Popup ? 'Open' : 'Close'}`}> 
                    <h1>Your information {StatusHolder}</h1>
                    <div className='Informationsub'>
                        <div className='datauser'>
                            <img src={Klee} width={100} height={100} />
                            <div style={{marginLeft: '10px'}}>
                                <p>User Name : {user?.UserName}</p>
                                <p>First Name : {user?.FirstName}</p>
                                <p>Last Name : {user?.LastName}</p>
                            </div>
                            <div style={{marginLeft: '15px'}}>
                                <p>Gmail : {user?.Email}</p>
                                <p>Tel : {user?.Tel}</p>
                                <p>Age : {user?.Age}</p>
                            </div>
                            <div className='Status'>{user?.Status}</div>
                        </div>
                        <div style={{margin:'50px 5%'}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis suscipit omnis voluptates iste accusantium, quibusdam nam? Cupiditate, nulla eius accusamus libero consectetur voluptatem molestiae sapiente ex accusantium alias consequatur deleniti excepturi saepe nemo similique reiciendis eos temporibus cum ea error quo nobis in facilis dolorem. Praesentium quis nesciunt atque iusto?</div>
                    </div>
                    <div style={{margin:'0px 5%'}}><label><input type="checkbox" checked={checked} onChange={handleChange} />Accept the terms and conditions of application</label></div>
                    <div className={`SubmitBB ${checked ? 'Open' : 'Close'}`} onClick={SubmitStatus}>Submit an application</div>
                </div>
            <div className={`backB ${Popup ? 'Open' : 'Close'}`}onClick={ClosePopupState}></div>
        </>

    );
};
export default Recruitment;