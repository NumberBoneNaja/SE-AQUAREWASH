package entity

import "gorm.io/gorm"

type Image struct {
	gorm.Model
	ImagePath string `valid:"required~ImagePath is required"`

	OrderID uint `valid:"required~OrderID is required"`
	Order Order `gorm:"foreignKey:OrderID" valid:"-"`
}