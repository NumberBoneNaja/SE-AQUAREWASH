package entity

import (
	"gorm.io/gorm"
)

type ReportResult struct {
	gorm.Model
	Status     string `valid:"required~Status is required" json:"status"`
	ReportID   uint   `valid:"required~ReportID is required" json:"report_id"` // เปลี่ยนจาก report_id ให้ตรงกันกับที่ frontend ใช้
	Report     Report `gorm:"foreignKey:ReportID;references:ID" json:"report" valid:"-"` // ใช้ชื่อที่เหมาะสม เช่น report
	AccepterID uint   `valid:"required~AccepterID is required" json:"accepter_id"`
	Accepter   User   `gorm:"foreignKey:AccepterID;references:ID" json:"accepter" valid:"-"`
}
