import { UsersInterface } from "./UsersInterface";
//=============ใช้จริง=================


// MembershipPayment interface
export interface MembershipPayment {
  ID?:                    number; 
  UserID?:                number; 
  User?:                  UsersInterface; 
  
  PackageMembershipID?:   number; 
  PackageMembership?:     PackageMembershipInterface;
    packageMembership?: {
      ID:                number; 
      NamePackage?:       string;
      Price?:             number; 
      HowLongTime:       number;
      Description?:       string;
      PicPayment?:        string;
    }

  
  PaymentMethod?:         string; 
  DateStart?:             Date; 
  DateEnd?:               Date; 
  PicPayment?:            string; 
  Status?:                string; 
}

// MembershipPayment interface
export interface HistoryPaymentMembership {
  ID?:                    number; 
  UserID?:                number; 
  User?:                  UsersInterface; 
  
  PackageMembershipID?:   number; 
  PackageMembership?:     PackageMembershipInterface;
    packageMembership: {
      ID:                number; 
      NamePackage?:       string;
      Price?:             number; 
      HowLongTime:       number;
      Description?:       string;
      PicPayment?:        string;
    }

  
  PaymentMethod?:         string; 
  DateStart:             Date; 
  DateEnd:               Date; 
  Status?:                string; 
}
  

export interface PackageMembershipInterface {
  ID:                number; 
  NamePackage?:       string;
  Price?:             number; 
  HowLongTime:       number;
  Description?:       string;
  PicPayment?:        string; 
  //อย่าลบ
  QuotaOrder? :number
	QuotaBooking? :number
	PointRate? :number
  DiscountRate? :number
}
  

  
