package entity

import (
	"time"

	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model
	UserID     uint `json:"UserID" valid:"required~UserID is required"`
	Saraly     int  `json:"Saraly" valid:"required~Salary is required,positive~Saraly must be positive"`
	TimeOffing int  `json:"TimeOffing" gorm:"default:0" valid:"range(0|365)~Time off days must be between 0 and 365,positive~TimeOffing must be positive"`
	// Foreign keys
	JobID uint `json:"JobID" valid:"required~Job is required"`

	// Relationships
	User User `gorm:"foreignKey:UserID" valid:"-"`
	Job  Job  `gorm:"foreignKey:JobID" valid:"-"`
}

type Department struct {
	gorm.Model
	Name    string `json:"Name" valid:"required~Name is required"`
	Explain string `json:"Explain" valid:"required~Explain is required"`
}

type Job struct {
	gorm.Model
	Name    string `json:"Name" valid:"required~Name is required"`
	Explain string `json:"Explain" valid:"required~Explain is required"`
	// Foreign keys
	DepartmentID uint       `json:"DepartmentID" valid:"required~Department is required"`
	Department   Department `gorm:"foreignKey:DepartmentID" valid:"-"`
}

type OfficeHours struct {
	gorm.Model
	EmployeeID uint      `json:"EmployeeID" valid:"required~EmployeeID is required"`
	Checkin    time.Time `json:"Checkin" valid:"required~Checkin is required"`
	Checkout   time.Time `json:"Checkout" valid:"required~Checkout is required"`

	// Relationships
	Employee Employee `gorm:"foreignKey:EmployeeID" valid:"-"`
}
