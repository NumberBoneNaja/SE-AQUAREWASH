import { UsersInterface } from "./UsersInterface";
export interface Employee {
    ID?: number;
    UserID?: number;
	
	Saraly?: number;
	TimeOffing?: number;
    JobID: number;
    Job?:JobInterface;
    job?:{
        ID:        number; 
        Name:     string;
        Explain:     string;
  
        DepartmentID?:number;
        Department?: Department;

        

    }

	

	// Relationships
	User?: UsersInterface;


   

    user: {
        ID: number;
        UserName?:  		string ;
        Password?:     	string ;
        Email?:     		string ;
        Profile?: 		string;
        ProfileBackground?: 		string;
        FirstName?: 		string;
        LastName?: 			string;
        Age?: 		number;
        Tel?: 			string ;
        Status?: 			string ;
    }
}

export interface Department {
    ID: number;
    Name: string;
    Explain: string;

}

export interface OfficeHours {
    ID?: number;
    EmployeeID?: number;
    Checkin?: Date;
    Checkout?: Date;

    // Relationships
    Employee?: Employee;
}

export interface JobInterface {
    ID:                number; 
    Name:     string;
    Explain:     string;
  
    DepartmentID:number;
    Department?: Department;

    department: {
        ID: number;
        Name?: string;
        Explain?: string;
    }
}