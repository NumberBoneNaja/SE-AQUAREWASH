package entity

import "gorm.io/gorm"

type AddOnDetail struct {
	gorm.Model
	Price float32 `valid:"required~Price is required,positive~Price must be positive"`

	AddOnID uint  `valid:"required~AddOnID is required"`
	AddOn AddOn `gorm:"foreignKey:AddOnID" valid:"-"`

	OrderID uint  `valid:"required~OrderID is required"`
	Order Order `gorm:"foreignKey:OrderID" valid:"-"`
}