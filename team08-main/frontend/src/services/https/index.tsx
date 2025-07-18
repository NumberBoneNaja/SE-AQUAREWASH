
import { SignUpInterface } from "../../interfaces/SignUp";
import { UsersInterface } from "../../interfaces/UsersInterface";

import { BooksInterface ,} from "../../interfaces/Books";
import{MembershipPayment,HistoryPaymentMembership} from "../../interfaces/MembershipPayment";
import { BooksDetailsInterface ,} from "../../interfaces/BooksDetails";
import { MachinesInterface ,} from "../../interfaces/Machine";

import { HistoryRewardInterface } from "../../interfaces/IHistoryReward";
import {  HistoryInterface} from "../../interfaces/IMachineHistory"

import { ReportDetailInterface } from "../../interfaces/reportDetailInteface";
import { ReportInterface } from "../../interfaces/reportInterface";
import { ReportResultInterface } from "../../interfaces/reportResultInterface";

import { exchequerInterface } from "../../interfaces/exchequerInterface";
import { withdrawInterface } from "../../interfaces/withdrawInterface";
import { withdrawDetailInterface } from "../../interfaces/withdrawDetailInterface";

import { Employee, Department ,JobInterface} from "../../interfaces/IEmployee";


import axios from 'axios';
import { OrderInterface } from "../../interfaces/IOrder";
import { OrderDetailInterface } from "../../interfaces/IOrderDetail";
import { PaymentInterface } from "../../interfaces/IPayment";
import { formqr } from "../../Components/paymentCom/paymentcom";
import { SlipOKInterface } from "../../Components/paymentCom/slipOK";
import { RewardInterface } from "../../interfaces/IReward";
import { PostInterface } from "../../interfaces/PostInterface";

import { PackageInterface } from "../../interfaces/IPackage";
import { ClothType } from "../../interfaces/IClothType";
import { AddOnInterface } from "../../interfaces/IAddOn";
export const apiUrl = "https://api.aqua-wash.online";
// const Authorization = localStorage.getItem("token");


export const Bearer = localStorage.getItem("token_type");


export const requestOptions = {

  headers: {

    "Content-Type": "application/json",

    Authorization: `${Bearer} ${localStorage.getItem("token")}`,

  },

};

 //=========================== Department ===========================
async function GetAllDepartments() {

  return await axios

    .get(`${apiUrl}/department`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

// get Department by ID
async function GetDepartmentById(id: number) {

  return await axios

    .get(`${apiUrl}/department/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

// create Department
async function CreateDepartment(data: Department) {

  return await axios

    .post(`${apiUrl}/department`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

// update Department
async function UpdateDepartment(id: number, data: Department) {

  return await axios

    .put(`${apiUrl}/department/Update/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

// update SoftDeleteDepartment
async function SoftDeleteDepartment(id: number) {

  return await axios

    .put(`${apiUrl}/department/Delete/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

// restore Department
async function RestoreDepartment(id: number) {

  return await axios

    .put(`${apiUrl}/department/Restore/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}



// get Employee //=========================== Employee ===========================
async function GetAllEmployees() {

  return await axios

    .get(`${apiUrl}/employee`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

// get Employee by ID
async function GetEmployee(id: string) {

  return await axios

    .get(`${apiUrl}/employee/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

// create Employee
async function CreateEmployee(data: Employee) {

  return await axios

    .post(`${apiUrl}/employee`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

// update Employee
async function UpdateEmplyeeByid(id: number, data: Employee) {

  return await axios

    .put(`${apiUrl}/employee/update/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}





// delete Employee
async function DeleteEmployee(id: string) {

  return await axios

    .delete(`${apiUrl}/employee/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


// get User by status
async function GetUserByStatus(Status: string) {

  return await axios

    .get(`${apiUrl}/job/${Status}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
// get Users
async function ListUser() {

  return await axios

    .get(`${apiUrl}/users`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

// update Employee
async function UpdateUserStatusEmployee(id: number) {

  return await axios

    .put(`${apiUrl}/UpdateUserStatus/Employee/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}
//======================================================Job=====================================


//Get All Job
async function GetAllJob() {

  return await axios

    .get(`${apiUrl}/job2`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

//Get Job By ID
async function GetJobById(id: number) {

  return await axios

    .get(`${apiUrl}/job2/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

//Create Job
async function CreateJob(data: JobInterface) {

  return await axios

    .post(`${apiUrl}/job2/create`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

//Update Job
async function UpdateJob(id: number, data: JobInterface) {

  return await axios

    .put(`${apiUrl}/job2/update/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}



//Delete Job 
async function SoftDeleteJob(id: number) {

  return await axios

    .delete(`${apiUrl}/job2/delete/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}



//====================================================== history membership payment =====================================

//get by id
async function GetMembershipPaymentByIDHistory(id:number) {

  return await axios

    .get(`${apiUrl}/HistoryMembership/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

//get by user id
async function GetMembershipPaymentByUserIDHistory(id:number) {

  return await axios

    .get(`${apiUrl}/HistoryMembership/user/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

// create history
async function CreateMembershipPaymentHistory(data: HistoryPaymentMembership) {

  return await axios

    .post(`${apiUrl}/HistoryMembership`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

//get all for employee management
async function GetMembershipPaymentsHistory() {

  return await axios

    .get(`${apiUrl}/HistoryMembership`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

//============================User========================================
//login
async function SignIn(data: any) {

  return await axios
    .post(`${apiUrl}/signin`, data, requestOptions)
    .then((res) => {
      // if (res.status === 200) {
      //   // ตัวอย่างกำหนดข้อความสำเร็จ
      //   alert("Sign-in successful! Welcome back.");
      // } else {
      //   // กรณีอื่นที่ไม่ใช่ 200
      //   alert(`Unexpected status: ${res.status}`);
      // }
      return res;
    })
    .catch((e) => {
      if (e.response) {
        // ตรวจสอบสถานะของ error response
        switch (e.response.status) {
          case 400:
            alert("Bad Request: Please check your input.");
            break;
          case 401:
            alert("Unauthorized: Invalid username or password.");
            break;
          case 500:
            alert("Server Error: Please try again later.");
            break;
          default:
            alert(`Error: ${e.response.data.message || "Something went wrong."}`);
        }
      } else {
        // กรณีที่ไม่มี response จาก server
        alert("Network error: Please check your connection.");
      }
      return e.response;
    });


}

async function CreateUser(data: UsersInterface) {
  return await axios
    .post(`${apiUrl}/signup`, data, requestOptions)
    .then((response) => {
      if (response.status === 201) {
        return {
          success: true,
          message: "Resource created successfully",
          data: response.data,
        };
      }
      return {
        success: false,
        message: `Request completed with status: ${response.status}`,
        data: response.data,
      };
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // แสดงข้อความจากเซิร์ฟเวอร์
          return {
            success: false,
            message: error.response.data?.error || `Error with status: ${error.response.status}`,
            data: error.response.data,
          };
        }
        return {
          success: false,
          message: "No response from server. Network error or server is unreachable.",
          data: null,
        };
      }
      return {
        success: false,
        message: "An unexpected error occurred.",
        data: null,
      };
    });
}


async function SignUp(data: SignUpInterface) {
  try {
    const response = await fetch(`${apiUrl}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.status === 201) {
      return await response.json(); // User created successfully
    } else if (response.status === 409) {
      const errorData = await response.json(); // Try to parse the error response
      const errorMessage = errorData?.message || "User already exists"; // Provide a default message
      throw new Error(errorMessage); // Re-throw with user friendly message
    } else {
      // Handle other errors (400, 500 etc.)
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Signup error:", error);
    // Display the error to the user (e.g., in a <p> tag)
    // Example:  setError(error.message) where setError is a state updater in your React component
    return false; //
  }
}

//============================Admin========================================
// get Store WaitingForApproval
async function GetStoreWaiting(status: string) {

  return await axios

    .get(`${apiUrl}/storeWaiting/${status}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


// get user by id
async function GetUserById(id: string) {

  return await axios

    .get(`${apiUrl}/user/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


// update User
async function UpdateUserByid(id: string, data: UsersInterface) {

  return await axios

    .put(`${apiUrl}/user/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

// update User
async function UpdateUserStatus(id: string) {

  return await axios

    .put(`${apiUrl}/UpdateUserStatus/user/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}



// async function UpdatePointByid(id: string) {

//   return await axios

//     .patch(`${apiUrl}/UpdatePointByid/${id}`, requestOptions)

//     .then((res) => res)

//     .catch((e) => e.response);
// }



//=========================== package Member ship =============

async function ListPackageMemberships() {
  return await axios
    .get(`${apiUrl}/packageM`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPackageMembershipById(id: string) {
  return await axios
    .get(`${apiUrl}/packageM/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}




//=========================== payment Member ship =============

async function CreateMemberShipPayment(data: MembershipPayment) {
  return await axios
    .post(`${apiUrl}/paymentMembership`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetMembershipPaymentsByUserID(id: string) { //get payment by user id
  return await axios
    .get(`${apiUrl}/paymentMembership/userID/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// async function GetReportByUserID(id: string) {
//   return await axios
//     .get(`${apiUrl}/report/${id}`, requestOptions)
//     .then((res) => res)
//     .catch((e) => e.response);
// }

async function SoftDeleteMembershipPayment(id: string){
  return await axios
    .delete(`${apiUrl}/paymentMembership/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}


async function GetMembershipPayments() {
  return await axios
    .get(`${apiUrl}/paymentMembership`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


export const getLast = async () => {
  try {
    const response = await axios.get('https://api.aqua-wash.online/paymentMembership/last');  // เรียก API ที่ backend
    // const response = await axios.get('http//localhost:8000/paymentMembership/last');  // เรียก API ที่ backend
    return response.data;  // คืนค่าข้อมูลหนังสือล่าสุด
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลการจองได้');
  }
};
//============================JoJo================================


async function GetBooks() {
  return await axios
    .get(`${apiUrl}/books`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ดึงข้อมูลการจองตาม ID
async function GetBooksById(id: string) {
  return await axios
    .get(`${apiUrl}/books/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// อัปเดตข้อมูลการจองตาม ID
async function UpdateBooksById(id: string, data: BooksInterface) {
  return await axios
    .put(`${apiUrl}/books/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ลบการจองตาม ID
async function DeleteBooksById(id: string) {
  return await axios
    .delete(`${apiUrl}/books/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// สร้างการจองใหม่
async function CreateBooks(data: BooksInterface) {
  return await axios
    .post(`${apiUrl}/books`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetBooking() {
  return await axios
    .get(`${apiUrl}/booking`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ดึงข้อมูลการจองตาม ID
async function GetBookingById(id: string) {
  return await axios
    .get(`${apiUrl}/booking/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// อัปเดตข้อมูลการจองตาม ID
async function UpdateBookingById(id: string, data: BooksDetailsInterface) {
  return await axios
    .put(`${apiUrl}/booking/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ลบการจองตาม ID
async function DeleteBookingById(id: string) {
  return await axios
    .delete(`${apiUrl}/booking/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


async function CreateBooking(data: BooksDetailsInterface[]) {
  return await axios
    .post(`${apiUrl}/booking`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAllMachine() {
  return await axios
    .get(`${apiUrl}/machine`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export const getLastBooks = async () => {
  try {
    const response = await axios.get(`${apiUrl}/books/last`);  // เรียก API ที่ backend
    return response.data;  // คืนค่าข้อมูลหนังสือล่าสุด
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลการจองได้');
  }
};


async function CreateReward(data: RewardInterface) {
  return await axios
    .post(`${apiUrl}/Order/CreateReward`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}




async function UpdateMachineStatus(id: string, data: MachinesInterface) {
  return await axios
    .put(`${apiUrl}/machine/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


export async function GetAllReward() {
  const apiUrl = "https://api.aqua-wash.online";
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // ปรับ token ตามที่ต้องใช้
    },
  };

  try {
    const response = await axios.get(`${apiUrl}/Order/GetAllRewards`, requestOptions); // URL ต้องตรงกับ backend
    console.log("Raw Response:", response); // ดูโครงสร้าง response
    return response; // ตรวจสอบว่า response.data มีข้อมูลหรือไม่
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return null; // กรณีเกิดข้อผิดพลาด
  }
}

export const updateMachineStatus = async (id: string): Promise<any> => {
  try {
    const response = await axios.patch(`${apiUrl}/UpdateMachineStatus/${id}`);
    return response.data; // Return the updated machine data
  } catch (error: any) {
    console.error("Failed to update machine status:", error.response || error.message);
    throw error;
  }
};


export const updateBookStatus = async (id: string): Promise<any> => {
  try {
    // ส่งคำขอ PATCH ไปยัง API เพื่ออัปเดตสถานะของการจอง
    const response = await axios.patch(`${apiUrl}/UpdateBookStatus/${id}`);
    return response.data; 
  } catch (error: any) {
    console.error("Failed to update book status:", error.response || error.message);
    throw error; 
  }
};


//============================JoJo================================




// Order API
export const ApiUrlOrder = "https://api.aqua-wash.online/Order"
// export const ApiUrlOrder = "http//localhost:8000//Order"
export async function GetAllPackage() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },
    // <--- Add this type annotation
  };

  try {
    const res = await fetch(`${ApiUrlOrder}/GetAllPackage`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      console.log(token)

      // window.location.href = '/login';
      return false
    }
    else {
      console.log(token)
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export async function GetClothByPackageID(id: any) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/GetClothByPackageID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      console.log(token)
      window.location.href = '/login';
      return false
    }
    else {
      console.log(token)
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function GetAddOnByPackID(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/GetAddOnByPackageID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      console.log(token)
      window.location.href = '/login';
      return false
    }
    else {
      console.log(token)
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export async function GetImageID(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/GetImagesByOrderID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      console.log(token)
      window.location.href = '/login';
      return false
    }
    else {
      console.log(token)
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export async function UploadImageByOrderID(id: number, files: FileList) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // ส่ง Authorization header
    },

    body: formData, // ใช้ FormData ตรงๆ
  };

  try {
    const res = await fetch(`${ApiUrlOrder}/mutipleupload/${id}`, requestOptions);

    if (res.ok) {
      return await res.json(); // ถ้า upload สำเร็จ ให้ส่งผลลัพธ์จาก server
    } else if (res.status === 401) {
      console.log(token);
      window.location.href = '/login'; // ถ้า session หมดอายุหรือไม่มีสิทธิ์ให้ไปหน้า login
      return false;
    } else {
      console.log("Failed to fetch data:", res.status, res.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function CreateOrder(data: OrderInterface) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${ApiUrlOrder}/CreateOrder`, requestOptions);

    if (res.status == 201) {
      return await res.json(); // ถ้า upload สำเร็จ ให้ส่งผลลัพธ์จาก server
    } else if (res.status === 401) {
      console.log(token);
      window.location.href = '/login'; // ถ้า session หมดอายุหรือไม่มีสิทธิ์ให้ไปหน้า login
      return false;
    } else {
      console.log("Failed to fetch data:", res.status, res.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export async function CreateOrderDetail(data: OrderDetailInterface) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${ApiUrlOrder}/CreateOrderDetail`, requestOptions);

    if (res.status == 201) {
      return await res.json(); // ถ้า upload สำเร็จ ให้ส่งผลลัพธ์จาก server
    } else if (res.status === 401) {
      console.log(token);
      window.location.href = '/login'; // ถ้า session หมดอายุหรือไม่มีสิทธิ์ให้ไปหน้า login
      return false;
    } else {
      console.log("Failed to fetch data:", res.status, res.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export async function CreateAddOnDetail(data: OrderDetailInterface) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${ApiUrlOrder}/CreateAddOnDetail`, requestOptions);

    if (res.status == 201) {
      return await res.json(); // ถ้า upload สำเร็จ ให้ส่งผลลัพธ์จาก server
    } else if (res.status === 401) {
      console.log(token);
      window.location.href = '/login'; // ถ้า session หมดอายุหรือไม่มีสิทธิ์ให้ไปหน้า login
      return false;
    } else {
      console.log("Failed to fetch data:", res.status, res.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function GetPackageById(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/GetPackageByID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      console.log(token)
      window.location.href = '/login';
      return false
    }
    else {
      console.log(token)
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function GetDiscountByUserID(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

  };


  try {
    const res = await fetch(`${ApiUrlOrder}/GetHistoryRewardByUserID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      console.log(token)
      window.location.href = '/login';
      return false
    }
    else {
      console.log(token)
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function GetRewardByRewardID(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/GetRewardByRewardID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      console.log(token)
      window.location.href = '/login';
      return false
    }
    else {
      console.log(token)
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export async function DeleteReward(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // แก้ไขการใส่ Bearer Token
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/DeleteHistoryRewardByID/${id}`, requestOptions);

    if (res.ok) {
      const data = await res.json();
      console.log("Delete successful:", data);
      return data; // ส่งผลลัพธ์กลับ
    } else if (res.status === 401) {
      console.log("Unauthorized access. Redirecting to login...");
      window.location.href = '/login'; // redirect ไปหน้า login
      return false;
    } else {
      console.error("Delete failed:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Delete request failed:", error);
    return null;
  }
}


export async function DeleteRewards(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // แก้ไขการใส่ Bearer Token
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/DeleteRewards/${id}`, requestOptions);

    if (res.ok) {
      const data = await res.json();
      console.log("Delete successful:", data);
      return data; // ส่งผลลัพธ์กลับ
    } else if (res.status === 401) {
      console.log("Unauthorized access. Redirecting to login...");
      window.location.href = '/login'; // redirect ไปหน้า login
      return false;
    } else {
      console.error("Delete failed:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Delete request failed:", error);
    return null;
  }
}



async function UpdateReward(id: string, data: RewardInterface) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(`${ApiUrlOrder}/UpdateReward/${id}`, data, requestOptions);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Error updating reward: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      throw new Error(error.response.data.message || "Failed to update reward.");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
}





export async function GetSCBToken() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("resourceOwnerId", "l72ed2137c85724b61be9eee4dcef83734"); //api key
  myHeaders.append("requestUId", "ae2f7a65-ab6d-4f59-8728-a4d0a40abc0f");
  myHeaders.append("accept-language", "EN");

  const raw = JSON.stringify({
    "applicationKey": "l72ed2137c85724b61be9eee4dcef83734",
    "applicationSecret": "776221e9c2204ccb9c92b52ea0728829" //  api secret
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  try {
    const res = await fetch("https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token", requestOptions);
    if (res.ok) {
      return await res.json();
    }
    else {
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.log(error);
  }

}

export async function CreateQRCode(acctoken: string, data: formqr) {
  try {
    // const data = {
    //   qrType: "PP",
    //   ppType: "BILLERID",
    //   ppId: "261664370863177",
    //   amount: "10",
    //   ref1: "062",
    //   ref2: "175",
    //   ref3: "UJE"
    // };

    console.log("Sending data to backend:", data);
    // const response = await fetch("http//localhost:8000/Order/Genqr",
    const response = await fetch("https://api.aqua-wash.online/Order/Genqr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${acctoken}`,
        // "requestUId": "28dae489-3a4b-4ea1-8995-7488cff1826b",  // เพิ่ม Headers ตามที่ backend ต้องการ
        // "resourceOwnerId": "l72ed2137c85724b61be9eee4dcef83734"  // เพิ่ม Headers ตามที่ backend ต้องการ
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      console.log("API Response:", result);
      return result;
    } else {
      console.error("API call failed:", response.status);
      const errorResponse = await response.text();
      console.error("Error response:", errorResponse);
      return null;
    }
  } catch (error) {
    console.error("Request Error:", error);
  }
}

export async function CheckStatusPayment(transactionID: string, access_token: string) {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      // "requestUId": "28dae489-3a4b-4ea1-8995-7488cff1826b",
      // "resourceOwnerId": "l72ed2137c85724b61be9eee4dcef83734"
    }
  };

  try {
    const res = await fetch(`https://api.aqua-wash.online/Order/proxy/CheckStatusPayment/${transactionID}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } else {
      console.log("acess: ", access_token);
      console.error("API call failed:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Request Error:", error);
    return null;
  }
}
export async function CreatePayment(data: PaymentInterface) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${ApiUrlOrder}/Createpayment`, requestOptions);

    if (res.status == 201) {
      return await res.json(); // ถ้า upload สำเร็จ ให้ส่งผลลัพธ์จาก server
    } else if (res.status === 401) {
      console.log(token);
      window.location.href = '/login'; // ถ้า session หมดอายุหรือไม่มีสิทธิ์ให้ไปหน้า login
      return false;
    } else {
      console.log("Failed to fetch data:", res.status, res.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export async function CreatePaymentFromBooking(data: PaymentInterface) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${ApiUrlOrder}/CreatepaymentfromBooking`, requestOptions);

    if (res.status == 201) {
      return await res.json(); // ถ้า upload สำเร็จ ให้ส่งผลลัพธ์จาก server
    } else if (res.status === 401) {
      console.log(token);
      window.location.href = '/login'; // ถ้า session หมดอายุหรือไม่มีสิทธิ์ให้ไปหน้า login
      return false;
    } else {
      console.log("Failed to fetch data:", res.status, res.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export async function GetPaymentByOrderID(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/GetPaymentByOrderID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      console.log(token)
      window.location.href = '/login';
      return false
    }
    else {
      console.log(token)
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export async function UpdateStatusByOrderID(id: number, data: PaymentInterface) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${ApiUrlOrder}/c/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      console.log(token)
      // window.location.href = '/login';
      return false
    }
    else {
      console.log(token)
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function UpdateStatusOrderByID(id: number, data: OrderInterface) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${ApiUrlOrder}/UpdateOrder/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      console.log(token)
      window.location.href = '/login';
      return false
    }
    else {
      console.log(token)
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }

}
export async function SlipOKCheck(file: File) {
  const myHeaders = new Headers();
  myHeaders.append("x-authorization", "SLIPOKEIQF7NT");

  const formdata = new FormData();
  formdata.append("files", file); // ส่งไฟล์จริง

  console.log("FormData content:", [...formdata.entries()]); // Debugging

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  try {
    const response = await fetch("https://api.slipok.com/api/line/apikey/35849", requestOptions);
    if (response.ok) {
      const result = await response.json();
      console.log("API Response:", result);
      return result;
    } else {
      const errorText = await response.text();
      console.error(`Error ${response.status}: ${errorText}`); // แสดงข้อความ Error
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error("Error in SlipOKCheck:", error);
    throw error;
  }
}
export async function SlipOKCheckBody(data: SlipOKInterface) {
  const myHeaders = new Headers();
  myHeaders.append("x-authorization", "SLIPOKEIQF7NT");
  myHeaders.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: "follow",
  };

  try {
    const response = await fetch("https://api.slipok.com/api/line/apikey/35849", requestOptions);
    if (response.ok) {
      const result = await response.json();
      console.log("API Response:", result);
      return result;
    }

    else if (response.status == 400) {
      const errorText = await response.json();
      console.error(`Error ${response.status}: ${errorText}`); // แสดงข้อความ Error
      return errorText
    }
  } catch (error) {
    console.error("Error in SlipOKCheck:", error);
    throw error;
  }
}



export async function GetClothDetailByOrderID(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/GetClothDetailByOrderID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      console.log(token)
      window.location.href = '/login';
      return false
    }
    else {
      console.log(token)
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export async function GetAddOnByOrderID(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/GetAddOnDetailByOrderID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      console.log(token)
      window.location.href = '/login';
      return false
    }
    else {
      console.log(token)
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function DecodeQRSlip(file: File) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const formdata = new FormData();
  formdata.append("slip", file);

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // ส่ง Authorization header
    },

    body: formdata, // ใช้ FormData ตรงๆ
  };

  try {
    const res = await fetch(`${ApiUrlOrder}/Qrdecode`, requestOptions);

    if (res.ok) {
      return await res.json(); // ถ้า upload สำเร็จ ให้ส่งผลลัพธ์จาก server
    } else if (res.status === 401) {
      console.log(token);
      window.location.href = '/login'; // ถ้า session หมดอายุหรือไม่มีสิทธิ์ให้ไปหน้า login
      return false;
    } else {
      console.log("Failed to fetch data:", res.status, res.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
//ยกเลิก Order
export async function CancelOrder(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // แก้ไขการใส่ Bearer Token
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/DeleteOrderByID/${id}`, requestOptions);

    if (res.ok) {
      const data = await res.json();
      console.log("Delete successful:", data);
      return data; // ส่งผลลัพธ์กลับ
    } else if (res.status === 401) {
      console.log("Unauthorized access. Redirecting to login...");
      window.location.href = '/login'; // redirect ไปหน้า login
      return false;
    } else {
      console.error("Delete failed:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Delete request failed:", error);
    return null;
  }

}

export async function DeleteOrderDetailByOrderID(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // แก้ไขการใส่ Bearer Token
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/DeleteOrderDetailByOrderID/${id}`, requestOptions);

    if (res.ok) {
      const data = await res.json();
      // console.log("Delete successful:", data);
      return data; // ส่งผลลัพธ์กลับ
    } else if (res.status === 401) {
      console.log("Unauthorized access. Redirecting to login...");
      window.location.href = '/login'; // redirect ไปหน้า login
      return false;
    } else {
      console.error("Delete failed:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Delete request failed:", error);
    return null;
  }

}

export async function DeleteAddOnByOrderID(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // แก้ไขการใส่ Bearer Token
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/DeleteOrderAddOnByOrderID/${id}`, requestOptions);

    if (res.ok) {
      const data = await res.json();
      // console.log("Delete successful:", data);
      return data; // ส่งผลลัพธ์กลับ
    } else if (res.status === 401) {
      console.log("Unauthorized access. Redirecting to login...");
      window.location.href = '/login'; // redirect ไปหน้า login
      return false;
    } else {
      console.error("Delete failed:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Delete request failed:", error);
    return null;
  }
}

export async function CancelPaymentByOrderID(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // แก้ไขการใส่ Bearer Token
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/CancelPaymetByID/${id}`, requestOptions);

    if (res.ok) {
      const data = await res.json();
      // console.log("Delete successful:", data);
      return data; // ส่งผลลัพธ์กลับ
    } else if (res.status === 401) {
      console.log("Unauthorized access. Redirecting to login...");
      window.location.href = '/login'; // redirect ไปหน้า login
      return false;
    } else {
      console.error("Delete failed:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Delete request failed:", error);
    return null;
  }
}

export async function DeleteImageByOrderID(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // แก้ไขการใส่ Bearer Token
    },

  };

  try {
    const res = await fetch(`${ApiUrlOrder}/DeleteImageByOrderID/${id}`, requestOptions);

    if (res.ok) {
      const data = await res.json();
      // console.log("Delete successful:", data);
      return data; // ส่งผลลัพธ์กลับ
    } else if (res.status === 401) {
      console.log("Unauthorized access. Redirecting to login...");
      window.location.href = '/login'; // redirect ไปหน้า login
      return false;
    } else {
      console.error("Delete failed:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Delete request failed:", error);
    return null;
  }
}

/////////////////////////////jab////////////////////////
async function CreateReport(data: ReportInterface) {
  return await axios
    .post(`${apiUrl}/report/`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
export const GetLastReport = async () => {
  try {
    const response = await axios.get(`${apiUrl}/report/last`);
    return response.data;
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลรายงาน');
  }
};

export const CreateReportDetail = async (data: ReportDetailInterface) => {
  return await axios
    .post(`${apiUrl}/report/detail`, data)
    .then((res) => res)
    .catch((e) => e.response);
};

async function CreateReportResult(data: ReportResultInterface) {
  return await axios
    .post(`${apiUrl}/report/resultC/`, data)
    .then((res) => res)
    .catch((e) => e.response);
};

export async function GetMachines() {
  return await axios
    .get(`${apiUrl}/report`, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function GetAllReports() {
  return await axios
    .get(`${apiUrl}/report/`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}



async function UpdateReportById(id: string, data: ReportInterface) {
  return await axios
    .put(`${apiUrl}/report/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteReportById(id: string) {
  return await axios
    .delete(`${apiUrl}/report/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetReportByUserID(id: string) {
  return await axios
    .get(`${apiUrl}/report/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetReportDetailByReportID(id: string) {
  return await axios
    .get(`${apiUrl}/report/detail/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetReportResultByReportID(id: string) {
  return await axios
    .get(`${apiUrl}/report/result/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateReportResultByReportID(id: string, data: ReportResultInterface) {
  return await axios
    .put(`${apiUrl}/report/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


async function CreateExchequer(data: exchequerInterface) {
  return await axios
    .post(`${apiUrl}/withdraw/exchequer`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateWithdraw(data: withdrawInterface) {
  return await axios
    .post(`${apiUrl}/withdraw/wd`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateWithdrawDetail(data: withdrawDetailInterface) {
  return await axios
    .post(`${apiUrl}/withdraw/detail`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAllExchequers() {
  return await axios
    .get(`${apiUrl}/withdraw`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAllTypeLaundryProducts() {
  return await axios
    .get(`${apiUrl}/withdraw/`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateExchequer(id: number, data: exchequerInterface) {
  return await axios
    .put(`${apiUrl}/withdraw/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteExchequer(id: number) {
  return await axios
    .delete(`${apiUrl}/withdraw/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetExchequerByID(id: number) {
  return await axios
    .get(`${apiUrl}/withdraw/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreatePost(data: PostInterface) {
  return await axios
    .post(`${apiUrl}/news/posts`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPosts() {
  return await axios
    .get(`${apiUrl}/news/posts`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPostByID(id: number) {
  return await axios
    .get(`${apiUrl}/news/posts/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdatePost(id: number, data: PostInterface) {
  return await axios
    .put(`${apiUrl}/news/posts/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeletePost(id: number) {
  return await axios
    .delete(`${apiUrl}/news/posts/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}



////////////////jab////////////////////////////////////////

////////////////////Pattt/////////////////////////////

//สร้าง
export const CreateMachine = async (data: MachinesInterface) => {
  try {
    const response = await axios.post(`${apiUrl}/machines`,data,requestOptions);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error Response Data:", error.response?.data); // Log server's error response
    }
    throw error;
  }
};

//อัพเดท
async function UpdateMachine(id: number, data: MachinesInterface) {
  return await axios
    .put(`${apiUrl}/machines/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

//ลบ
async function DeleteMachineById(id: number) {
  return await axios
    .delete(`${apiUrl}/machines/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

export const GetHistoryByMachineID = async (id: number) => {
  try {
    const response = await axios.get(`${apiUrl}/m_histories/machines/${id}`, requestOptions);
    return response.data;
  } catch (error) {
    console.error("Error fetching machine history:", error);
    throw error;
  }
};


export const CreateHistory = async (data: HistoryInterface) => {
  try {
    const response = await axios.post(`${apiUrl}/m_histories`, data, requestOptions);
    return response.data;
  } catch (error) {
    console.error("Error creating history:", error);
    throw error;
  }
};

async function CreatePackage(data: PackageInterface) {
  return await axios
    .post(`${apiUrl}/package`, data, requestOptions)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error creating package:", err);
      throw err;
    });
}

export async function UpdatePackage(id: number, data:PackageInterface) {
  return await axios
    .put(`${apiUrl}/package/${id}`, data, requestOptions)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error updating package:", err);
      throw err;
    });
}

export async function DeletePackage(id:number) {
  return await axios
    .delete(`${apiUrl}/package/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error deleting package:", err);
      throw err;
    });
}

export async function CreateClothType(data: ClothType) {
  return await axios
    .post(`${apiUrl}/cloth-type`, data, requestOptions)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error creating cloth type:", err);
      throw err;
    });
}

export async function GetClothTypesByPackageID(id: number) {
  return await axios
    .get(`${apiUrl}/cloth-types/${id}`, requestOptions)
    .then((res) => res.data.data) // Assume the data is in `data.data`
    .catch((err) => {
      console.error("Error fetching cloth types:", err);
      throw err;
    });
}

export async function UpdateClothType(id: number, data: { TypeName: string; Price: number; PackageID: number }) {
  return await axios
    .put(`${apiUrl}/cloth-type/${id}`, data, requestOptions)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error updating cloth type:", err);
      throw err;
    });
}


export async function DeleteClothType(id:number) {
  return await axios
    .delete(`${apiUrl}/cloth-type/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error deleting package:", err);
      throw err;
    });
}

export async function CreateAddOn(data: AddOnInterface) {
  return await axios
      .post(`${apiUrl}/addon`, data, requestOptions)
      .then((res) => res.data)
      .catch((err) => {
          console.error("Error creating add-on:", err);
          throw err;
      });
}

export async function GetAddOnsByPackageID(id: number) {
  return await axios
      .get(`${apiUrl}/addons/${id}`, requestOptions)
      .then((res) => res.data || [])
      .catch((err) => {
          console.error("Error fetching add-ons:", err);
          throw err;
      });
}

export async function UpdateAddOn(id: number, data: AddOnInterface) {
  return await axios
      .put(`${apiUrl}/addon/${id}`, data, requestOptions)
      .then((res) => res.data)
      .catch((err) => {
          console.error("Error updating add-on:", err);
          throw err;
      });
}

export async function DeleteAddOn(id: number) {
  return await axios
      .delete(`${apiUrl}/addon/${id}`, requestOptions)
      .then((res) => res.data)
      .catch((err) => {
          console.error("Error deleting add-on:", err);
          throw err;
      });
}

// Get history by ID
export async function GetHistoryById(id: number) {
  try {
    const response = await axios.get(`${apiUrl}/histories/${id}`, requestOptions);
    return response.data; // Return the specific history record
  } catch (error) {
    console.error(`Error fetching history with ID ${id}:`, error);
    return null;
  }
}



// Delete a history by ID
export async function DeleteHistoryById(id: number) {
  try {
    const response = await axios.delete(`${apiUrl}/histories/${id}`, requestOptions);
    return response.data; // Return the result of the deletion
  } catch (error) {
    console.error(`Error deleting history with ID ${id}:`, error);
    return null;
  }
}



async function GetActiveReward() {
  try {
    const response = await axios.get(`${apiUrl}/GetActiveReward`, requestOptions);
    return response.data; // คืนค่าเฉพาะข้อมูลจาก API
  } catch (error: any) {
    console.error("Error fetching active rewards:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch active rewards"
    );
  }
}
export async function CreateHistoryReward(data: HistoryRewardInterface) {
  try {
    const response = await axios.post(`${apiUrl}/CreateHistoryReward`, data, requestOptions);
    if (response.status === 200) {
      console.log("History Reward Created:", response.data);
      return response.data; // Return the created record
    } else {
      console.error("Failed to create history reward:", response.status, response.data);
      return null; // Return null on failure
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error creating history reward:", error.response.data);
    } else {
      console.error("Unexpected error:", error);
    }
    return null; // Return null on error
  }
}


export async function CheckRewardClaimed(userId: string, rewardId: string) {
  try {
    const response = await axios.get(`${apiUrl}/CheckRewardClaimed/${userId}/${rewardId}`, requestOptions);
    return response.data; // จะส่งคืน { claimed: true } หรือ { claimed: false }
  } catch (error) {
    console.error("Error checking reward claim status:", error);
    return null;
  }
}





export async function GetUserBookings(userId: string) {
  try {
    const response = await axios.get(`${apiUrl}/GetUserBookings/${userId}`, requestOptions);
    if (response.status === 200) {
      return response.data; // คืนค่าข้อมูลการจอง
    } else {
      console.error(`Unexpected status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return null;
  }
}


export async function GetRewardsWithHistoryByUserID(id:string) {
  try {
    const response = await axios.get(`${ApiUrlOrder}/GetRewardsWithHistoryByUserID/${id}`, requestOptions);
    console.log(response);  // ตรวจสอบข้อมูลทั้งหมดจาก response
    return response.data;  // ส่งคืนข้อมูลที่ต้องการ
  } catch (error) {
    console.error("Error fetching rewards with history:", error);
    throw new Error("Failed to fetch rewards with history");
  }  
}



export async function UsedRewardByBarcode(barcode: string) {
  const token = localStorage.getItem("token"); // Get the token from localStorage
  if (!token) {
    console.error("No token found. Please login.");
    return { success: false, message: "Authentication token is missing." };
  }

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.patch(`${apiUrl}/UsedRewardByBarcode/${barcode}`, {

      ...requestOptions,
      params: { barcode }, // Pass the barcode as a query parameter
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: response.data.message || "Failed to delete reward." };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error deleting reward:", error.response.data);
      return { success: false, message: error.response.data.message || "An error occurred." };
    } else {
      console.error("Unexpected error:", error);
      return { success: false, message: "Unexpected error occurred." };
    }
  }
}



export const getRewardsBooking = async (id: string) => {
  try {
    // Make a GET request to the API endpoint with the userId as a parameter
    const response = await axios.get(`${apiUrl}/GetRewardsBooking/${id}`);
    return response.data; // Return the API response data
  } catch (error: any) {
    console.error('Failed to fetch rewards booking:', error);
    throw new Error(error.response?.data?.error || 'An unexpected error occurred');
  }
};


export const getMachineBookingInfo = async () => {
  try {
    const response = await fetch(`${apiUrl}/GetMachineBookingInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data) {
        console.log("Machine booking info:", data); // ตรวจสอบข้อมูลที่ได้จาก API
        return data;
      } else {
        //message.error("ไม่มีข้อมูลการจองเครื่อง");
        return null;
      }
    } else {
      //message.error("ไม่สามารถดึงข้อมูลการจองเครื่องได้");
      return null;
    }
  } catch (error) {
    console.error("Error fetching machine booking info:", error);
    //message.error("เกิดข้อผิดพลาดในการดึงข้อมูลการจองเครื่อง");
    return null;
  }
};



export {

  //jojo
  GetBooks,
  GetBooksById,
  UpdateBooksById,
  DeleteBooksById,
  CreateBooks,
  UpdateMachineStatus,
  CreateReward,
  GetBooking,
  GetBookingById,
  UpdateBookingById,
  DeleteBookingById,
  CreateBooking,
  UpdateReward,
  GetAllMachine,
  GetActiveReward,

  //jojo

  SignIn,
  SignUp,

  //user
  CreateUser,
  GetUserById,
  UpdateUserByid,
  GetUserByStatus,
  ListUser,
  UpdateUserStatus,

  UpdateUserStatusEmployee,
  


  // ไม่รู้จะทำยังไงเอาไว้นี้แหละ ประดับๆไว้
  GetStoreWaiting,

  //package
  ListPackageMemberships,
  GetPackageMembershipById,
  SoftDeleteMembershipPayment,

  //Payment ยังไม่ทำสักอัน แต่ API เสร็จแล้วครับ
  CreateMemberShipPayment,
  GetMembershipPayments,
  GetMembershipPaymentsByUserID,

  //history payment membership
  CreateMembershipPaymentHistory,
  GetMembershipPaymentsHistory,
  GetMembershipPaymentByIDHistory,
  GetMembershipPaymentByUserIDHistory,



  ///// employee
  GetAllEmployees,
  GetEmployee,
  CreateEmployee,
  UpdateEmplyeeByid,
  DeleteEmployee,

  /// job
  GetAllJob,
  GetJobById,
  CreateJob,
  UpdateJob,
  SoftDeleteJob,

  //// department
  GetAllDepartments,
  UpdateDepartment,
  GetDepartmentById,
  CreateDepartment,
  SoftDeleteDepartment,
  RestoreDepartment,


  // สร้าง API สำหรับการเรียกข้อมูลจาก Backend

  ////////////////////////////
  GetAllReports,
  UpdateReportById,
  DeleteReportById,
  CreateReport,
  CreateReportResult,
  GetReportByUserID,
  GetReportDetailByReportID,
  GetReportResultByReportID,
  UpdateReportResultByReportID,

  CreateExchequer,
  CreateWithdraw,
  CreateWithdrawDetail,

  GetAllExchequers,
  GetAllTypeLaundryProducts,

  UpdateExchequer,
  DeleteExchequer,
  GetExchequerByID,
  CreatePackage,
  // Machine
  UpdateMachine,
  DeleteMachineById,
  CreatePost,
  GetPosts,
  GetPostByID,
  UpdatePost,
  DeletePost,
}