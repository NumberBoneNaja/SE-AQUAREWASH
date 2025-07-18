package entity

import (

	"gorm.io/gorm"
)

type Report struct{
	gorm.Model

	UserID uint `json:"user_id"`
	User   User `gorm:"foreignKey:UserID"`

	MachineID uint      `json:"machine_id"`
    Machine   Machine   `gorm:"foreignKey:MachineID" json:"machine"`
	
	
}