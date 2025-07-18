package entity

import "gorm.io/gorm"

type AddOn struct {
	gorm.Model
	AddOnName string `valid:"required~AddOnName is required"`
	Price float32     `valid:"required~Price is required,positive~Price must be positive"`
	Description string `valid:"required~Description is required"`
	AddOnPic string
	PackageID uint   `valid:"required~PackageID is required"`
	Package Package `gorm:"foreignKey:PackageID" valid:"-"`

	AddOnDetails []AddOnDetail `gorm:"foreignKey:AddOnID"`
}