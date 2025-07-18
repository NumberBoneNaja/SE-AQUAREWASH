import { data } from "framer-motion/client";
import { apiUrl, ApiUrlOrder, Bearer} from ".";
import { PaymentInterface } from "../../interfaces/IPayment";
import { MembershipPayment } from "../../interfaces/MembershipPayment";

import { NotificationInterface } from "../../interfaces/INotification";
import { MachinesInterface } from "../../interfaces/Machine";

import { HistoryRewardInterface } from "../../interfaces/IHistoryReward";

export async function PatchStatus(id:number,data:PaymentInterface){

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
    const res = await fetch(`${ApiUrlOrder}/OrderSuccess/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      // console.log(token)
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

export async function GetALLOrderByUserID(id: number) {
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
    const res = await fetch(`${ApiUrlOrder}/GetOrderByUserID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      // console.log(token)
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

export async function GetOrderByID(id: number) {
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
    const res = await fetch(`${ApiUrlOrder}/GetOrderByID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      // console.log(token)
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

export async function GetPayMemberShipByID(id: number) {
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
    const res = await fetch(`${apiUrl}/paymentMembership/payment/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      // console.log(token)
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


export async function UpdateStatusMemberShip(id: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const requestOptions: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${token}`,
    },
 
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${apiUrl}/paymentMembership/${id}/status`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      
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
export async function UpdateNameMemberShip(id: number, data: MembershipPayment) {
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
    const res = await fetch(`${apiUrl}/paymentMembership/UpdateName/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      
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
export async function UpdateSlipMemberShip(file:File,id : number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null; // ไม่มี token ส่งกลับ null
  }

  const formdata = new FormData();
  formdata.append("file", file);

  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`, // ส่ง Authorization header
    },

    body: formdata, // ใช้ FormData ตรงๆ
  };

  try {
    const res = await fetch(`${apiUrl}/paymentMembership/UpdateImage/${id}`, requestOptions);

    if (res.ok) {
      return await res.json(); // ถ้า upload สำเร็จ ให้ส่งผลลัพธ์จาก server
    } else if (res.status === 401) {
      
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

export async function CreateNotificationFromOrder(data: NotificationInterface) {

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
      const res = await fetch(`${ApiUrlOrder}/CreateNotification`, requestOptions);
  
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
export async function GetNotificationByUserID(id: number) {
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
    const res = await fetch(`${ApiUrlOrder}/GetNotificationByUserID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      // console.log(token)
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
export async function UpdateStatusNotification(id:number,data:NotificationInterface){

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
  const res = await fetch(`${ApiUrlOrder}/UpdateStatusNotification/${id}`, requestOptions);

  if (res.ok) {
    return await res.json();
  } if (res.status == 401) {
    // console.log(token)
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

// Employee
export async function GetAllOrder() {
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
    const res = await fetch(`${ApiUrlOrder}/GetALLOrder`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      // console.log(token)
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
export async function GetEMOrderByID(id: number) {
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
    const res = await fetch(`${ApiUrlOrder}/GetEMOrderByID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      // console.log(token)
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
export async function GetNotificationByID(id: number) {
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
    const res = await fetch(`${ApiUrlOrder}/GetNotificationbyID/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      // console.log(token)
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

export async function FindID(id: number) {
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
    const res = await fetch(`${ApiUrlOrder}/FindPayment/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      // console.log(token)
      // window.location.href = '/login';
      return false
    }
    else if (res.status == 404) {
       return await res.status
    }
    else  {
    
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function UpdateStateMachine(id:number,data:MachinesInterface){

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
  const res = await fetch(`${apiUrl}/UpdateMachineStatus/${id}`, requestOptions);

  if (res.ok) {
    return await res.json();
  } if (res.status == 401) {
    // console.log(token)
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
export async function GetbookDetailByBID(id:number){

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
    const res = await fetch(`${apiUrl}/booking/bookingdetail/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      // console.log(token)
      // window.location.href = '/login';
      return false
    }
    else if (res.status == 404) {
       return await res.status
    }
    else  {
    
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function UpdateStateBook(id:number){

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
    const res = await fetch(`${apiUrl}/UpdateBookStatus/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
     
      return false
    }
    else {
     
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function GetUserID(id:number){

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
    const res = await fetch(`${apiUrl}/preloaduser/${id}`, requestOptions);

    if (res.ok) {
      return await res.json();
    } if (res.status == 401) {
      // console.log(token)
      // window.location.href = '/login';
      return false
    }
    else if (res.status == 404) {
       return await res.status
    }
    else  {
    
      console.error("Failed to fetch data:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function PatchStateHis(id:number,state:HistoryRewardInterface){

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

  body: JSON.stringify(state),
};

try {
  const res = await fetch(`${ApiUrlOrder}/ChangeStateReward/${id}`, requestOptions);

  if (res.ok) {
    return await res.json();
  } if (res.status == 401) {
    // console.log(token)
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

export async function PatchProfile(id: number, file: File) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null;
  }

  const formdata = new FormData();
  formdata.append("file", file);

  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`, // ห้ามเพิ่ม Content-Type
    },
    body: formdata,
  };

  try {
    const res = await fetch(`${apiUrl}/PatchProfile/${id}`, requestOptions);
    if (res.ok) {
      return await res.json();
    } else {
      const errorText = await res.text(); // อ่านรายละเอียดของ Error
      console.error(`Failed: ${res.status} ${res.statusText}`, errorText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function PatchBg(id: number, file: File) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null;
  }

  const formdata = new FormData();
  formdata.append("file", file);

  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`, // ห้ามเพิ่ม Content-Type
    },
    body: formdata,
  };

  try {
    const res = await fetch(`${apiUrl}/PatchBg/${id}`, requestOptions);
    if (res.ok) {
      return await res.json();
    } else {
      const errorText = await res.text(); // อ่านรายละเอียดของ Error
      console.error(`Failed: ${res.status} ${res.statusText}`, errorText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export async function UploadimagePack( file: File) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null;
  }

  const formdata = new FormData();
  formdata.append("package", file);

  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`, // ห้ามเพิ่ม Content-Type
    },
    body: formdata,
  };

  try {
    const res = await fetch(`${apiUrl}/ImagePack`, requestOptions);
    if (res.ok) {
      return await res.json();
    } else {
      const errorText = await res.text(); // อ่านรายละเอียดของ Error
      console.error(`Failed: ${res.status} ${res.statusText}`, errorText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export async function UploadimageAddon( file: File) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please login.");
    return null;
  }

  const formdata = new FormData();
  formdata.append("package", file);

  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`, // ห้ามเพิ่ม Content-Type
    },
    body: formdata,
  };

  try {
    const res = await fetch(`${apiUrl}/ImageAddon`, requestOptions);
    if (res.ok) {
      return await res.json();
    } else {
      const errorText = await res.text(); // อ่านรายละเอียดของ Error
      console.error(`Failed: ${res.status} ${res.statusText}`, errorText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}