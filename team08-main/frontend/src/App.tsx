//import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';

import Admin from './Page/MainWeb/Admin/Admin';
import Recruitment from './Page/Recruitment/Recruitment';
import AdminJob from './Page/MainWeb/Admin/AdminJob';

import SignUp from './Page/SignUp/SignUp';
import MainPack from './Page/PackageMemberShip/MainPack';
import Order from './Page/Order/Order';
import './index.css'
import PackageDetail from './Page/PackageDetail/Packagedetail';
import AdminMachine from './Page/MainWeb/Admin/AdminMachine';
import AdminPackage from './Page/MainWeb/Admin/AdminPackage';
import Payment from './Page/Payment/payment';
import PaymentOK from './Page/paymentOK/paymentOK';
import Orderdetail from './Page/OrderDetail/OrderDetail';;
import AllOrderUser from './Page/CheckOrder/AllOrderUser';
import PaymentMemberShip from './Page/PaymentMembership/PaymentMemberShip';
import HistoryMembership from './Page/HistoryMembership/HistoryMembership';
import HistoryMembershipByUser from './Page/HistoryMemberShipByUser/HistoryMembership';
import MemberShipByUser from './Page/MemberShipByUser/MemberShipByUser';
import GetReward from './Page/Reward/GetReward';
import BooksTable from './Page/Books/BooksTable';
import UseReward from './Page/Reward/UseReward';
import NewLogin from './Page/newSignup/newLogin';
import Viewtable from './Page/Books/Booking';
import ReportWashingMachine from './Page/report/report';
import ReportResult from './Page/report/reportResult';
import AllReports from './Page/report/AllReports';
import AddLaundryProduct from './Page/withdraw/addLaundryProduct';
import ExchequerList from './Page/withdraw/shop';
import EditExchequer from './Page/withdraw/edit';
import SelectProduct from './Page/withdraw/select';
import WithdrawSummary from './Page/withdraw/withdrawSum';
import PayBooking from './Page/payBooking/PayBooking';

import FollowOrderPage from './Page/FollowOrderPage/FollowOrderPage';

import EmployeeOrder from './Page/EmployeeAdmin/EmployeeOrder';
import EmployeeFollowOrder from './Page/EmployeeFollowOrder/EmployeeFollowOrder';
import EmployeeManagement from './Page/ManageEmployee/ManageEmployee';
import AdminPackageDetail from './Page/MainWeb/Admin/AdminPackageDetail';

import OwnReward from './Page/Reward/OwnReward';

import MailBox from './Page/mailbox/Mailbox';
import WorkProcess from './Page/WorkProcess/WorkProcess';


import Department  from './Page/Department/Department';
import AdminManager  from './Page/AdminManager/AdminManager';
import Home from './Page/Home/Home';
import CreatePost from './Page/Post/post';
import PostList from './Page/Post/Allpost';
import ErrorPage from './Page/error404/ErrorPage';
import PrivateRoute from './Components/Protect/Protect';
import UserProfile from './Page/Profile/UserProfile';
import ProfileUseEM from './Page/Profile/ProfileUseEM';


import ManageJob from './Page/ManageJob/ManageJob';



//
const App: React.FC = () => {
  // const location = useLocation();
  // const Navbar = ["/Main","/Store","/SubStore","/BookStore","/Admin","/AdminStore","/Hall","/Inbox","/StorePayment","/BillStore","/Recruitment","/AdminJob","/AdminPackage"].includes(location.pathname);
 
  const token = localStorage.getItem('token');

  if (!token) {
    console.error("No token found. Please login.");
   
  }

  return (
    <>
      {/* {Navbar && <NavBar />} */}
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
           

            {/*ส่วนกลาง*/ }
            <Route path="/" element={<NewLogin />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/PostList" element={<PostList />} />
            {/* <Route path="/Home" element={<Home />} /> */}
            {/* <Route path="/Main" element={<Main />} /> */}
            {/*Employee*/ }
             <Route element={<PrivateRoute allowedRoles={['Admin', 'Employee']} />}>
                  <Route path="/EmHome" element={<EmployeeOrder />} />
                  <Route path="/AllReport" element={<AllReports />} />
                  <Route path="/shop" element={<SelectProduct />} />
                  <Route path="/withdraw" element={<WithdrawSummary />} />
                  <Route path="/WorkProcess" element={<WorkProcess />} />
                  <Route path="/EmployeeOrder" element={<EmployeeOrder />} />
                  <Route path="/EmployeeFollowOrder/:id" element={<EmployeeFollowOrder />} />
                  <Route path="/ProfileUserEm" element={< ProfileUseEM/>} />
              </Route>
           
             {/*admin*/ }
             
             <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
                 <Route path="/AdminHome" element={<Admin />} />
                  {/* <Route path="/Admin" element={<Admin />} /> */}
                  <Route path="/CreatePost" element={<CreatePost />} />
                  <Route path="/Exchequers" element={<ExchequerList />} />
                  <Route path="/exchequers/edit/:id" element={<EditExchequer />} />
                  <Route path="/AdminJob" element={<AdminJob />} />
                  <Route path="/AdminMachine" element={<AdminMachine />} />
                  <Route path="/AdminPackage" element={<AdminPackage />}/>
                  <Route path="/AdminPackageDetail/:id" element={<AdminPackageDetail />}/>
                  <Route path="/GetReward" element={<GetReward />} />   
                  <Route path="/Addproduct" element={<AddLaundryProduct />} />
                  <Route path="/AdminManager" element={<AdminManager />} />
                  <Route path="/Recruitment" element={<Recruitment />} />
                  <Route path="/EmployeeManagement" element={<EmployeeManagement />} /> 
                  <Route path="/Department" element={<Department />} />
                  <Route path="/HistoryMembership" element={<HistoryMembership />} /> 
                
                  <Route path="/ManageJob" element={<ManageJob />} />
                  
                
                </Route>
            
             

             {/*User*/ }
             <Route element={<PrivateRoute allowedRoles={['User','Member']} />}>
                 <Route path="/Home" element={<Home />} />
                <Route path="/Main" element={<Home />} />
                <Route path="/PaymentMember/:id" element={<PaymentMemberShip />} /> 
                <Route path="/PayBooking/:id" element={<PayBooking />} />
                <Route path="/Report" element={<ReportWashingMachine />} />
                <Route path="/ReportResult" element={<ReportResult />} />
                <Route path="/Order" element={<Order />} />
                <Route path="/package-detail/:id" element={<PackageDetail />} />
                <Route path="/Payment/:id" element={<Payment />} />
                <Route path="/Sliok/:id" element={<PaymentOK />} />
                <Route path="/OrderDetail/:id" element={<Orderdetail />} />
                <Route path="/AllOrderUser" element={<AllOrderUser />} />
                <Route path="/FollowOrder/:id" element={<FollowOrderPage />} />
                <Route path="/Usereward" element={<UseReward />} />
                <Route path="/MainPack" element={<MainPack />} />
                <Route path="/Viewtable" element={<Viewtable />} />
                <Route path="/MailBox" element={<MailBox />} />
                <Route path="/BooksTable" element={<BooksTable />} />
                <Route path="/ProfileUser" element={<UserProfile />} />
                <Route path="/HistoryMemberShipByUser" element={<HistoryMembershipByUser />} /> 
                <Route path="/MemberShipByUser" element={<MemberShipByUser />} /> 
                
                <Route path="/OwnReward" element={<OwnReward />} />
              </Route>
        <Route path="*" element={<ErrorPage />} />
        


      </Routes>
    </>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
      <App />
  </Router>
);

export default AppWrapper;


