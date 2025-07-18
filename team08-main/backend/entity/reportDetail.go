package entity

import (
	"time"
	"gorm.io/gorm"
)

type ReportDetail struct {
	gorm.Model
	Description string    `gorm:"type:longtext" valid:"required~Description is required" json:"description"`
	Image       string    `gorm:"type:longtext" valid:"required~Image is required" json:"image"`
	ReportDate  time.Time `valid:"required~ReportDate is required" json:"report_date"`
	ReportID    uint      `valid:"required~ReportID is required" json:"report_id"` // ต้องเป็น uint เพื่อเชื่อมโยง
	Report      Report    `gorm:"foreignKey:ReportID" json:"report" valid:"-"`
}
