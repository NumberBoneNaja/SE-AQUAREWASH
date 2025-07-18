package entity

import "gorm.io/gorm"

type Post struct {
	gorm.Model
	Image       string    `gorm:"type:longtext" valid:"required~Image is required" json:"image"`
	Caption     string    `gorm:"type:longtext" valid:"required~Caption is required" json:"caption"`
}