package entity

import (
	"regexp"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

// Custom validator สำหรับตรวจสอบเบอร์โทรศัพท์
func IsTelNumber(i interface{}, o interface{}) bool {
	str, ok := i.(string)
	if !ok {
		return false
	}
	// ตรวจสอบรูปแบบเบอร์โทรศัพท์ไทย (0xxxxxxxxx)
	matched, _ := regexp.MatchString(`^0[0-9]{9}$`, str)
	return matched
}

// Custom validator สำหรับตรวจสอบอายุที่เหมาะสม
func IsValidAge(i interface{}, o interface{}) bool {
	age, ok := i.(int)
	if !ok {
		return false
	}
	return age >= 0 && age <= 150
}

// Custom validator สำหรับตรวจสอบสถานะผู้ใช้
func IsValidUserStatus(i interface{}, o interface{}) bool {
	status, ok := i.(string)
	if !ok {
		return false
	}
	return status == "User" || status == "Admin"
}

// Custom validator สำหรับตรวจสอบชื่อและนามสกุล
func IsValidName(i interface{}, o interface{}) bool {
	name, ok := i.(string)
	if !ok {
		return false
	}
	// ตรวจสอบว่าต้องเป็นตัวอักษรเท่านั้น (ภาษาอังกฤษและไทย)
	matched, _ := regexp.MatchString(`^[a-zA-Zก-๙\s]+$`, name)
	return matched && name != "-"
}

func init() {
	govalidator.CustomTypeTagMap.Set("validTel", IsTelNumber)
	govalidator.CustomTypeTagMap.Set("validStatus", IsValidUserStatus)
	govalidator.CustomTypeTagMap.Set("validName", IsValidName)
}

type User struct {
	gorm.Model
	UserName          string `json:"UserName" valid:"required~UserName is required" gorm:"unique"`
	Password          string `json:"Password" valid:"required~Password is required"`
	Email             string `json:"Email" valid:"required~Email is required"`
	Profile           string `json:"Profile"`
	ProfileBackground string `json:"ProfileBackground"`
	Point             int    `json:"Point" valid:"range(0|999999)~Point must be between 0 and 999999"`
	FirstName         string `json:"FirstName" gorm:"default:'-'"`
	LastName          string `json:"LastName" gorm:"default:'-'"`
	Age               int    `json:"Age" valid:"required~Age is required,range(0|150)~Age must be between 0 and 150"`
	Tel               string `json:"Tel" valid:"required~Tel is required,validTel~Tel must be in format 0xxxxxxxxx"`
	Status            string `json:"Status" gorm:"default:'User'"`
	QuotaOrder uint `gorm:"default:0"`
	QuotaBooking uint  `gorm:"default:0"`
	PointRate float64 `gorm:"default:0.05"`
    DiscountRate float64  `gorm:"default:0"`

	
	MembershipPayment []MembershipPayment `gorm:"foreignKey:UserID"`
	HistoryRewards []HistoryReward `gorm:"foreignKey:UserID"`
	Reports []Report `gorm:"foreignKey:UserID"`
	Books []Books `gorm:"foreignKey:UserID"`
	Payments []Payment `gorm:"foreignKey:UserID"`
	Orders []Order `gorm:"foreignKey:UserID"`
	Employees []Employee `gorm:"foreignKey:UserID"`
	Notifications []Notification `gorm:"foreignKey:UserID"`

}

/*
Custom Validators:


IsTelNumber: ตรวจสอบรูปแบบเบอร์โทรศัพท์ไทย (0xxxxxxxxx)
IsValidAge: ตรวจสอบอายุให้อยู่ในช่วง 0-150 ปี [[]]



///Validation Rules:///

Point: กำหนดช่วงค่าระหว่าง 0-999999
Age: ต้องอยู่ในช่วง 0-150 ปี
Tel: ต้องเป็นรูปแบบ 0xxxxxxxxx


////ค่า Default////
FirstName/LastName: '-'
Point: 0
Age: 0
Status: 'User'

*/
