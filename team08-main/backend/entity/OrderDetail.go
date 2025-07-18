package entity

import "gorm.io/gorm"


type OrderDetail struct {
	gorm.Model
	Quantity    uint    `valid:"required~Quantity is required"`
	Price       float32  `valid:"required~Price is required,positive~Price must be positive"`

	OrderID     uint      `valid:"required~OrderID is required"`
	Order       Order     `gorm:"foreignKey:OrderID" valid:"-"`
	
	ClothTypeID uint       `valid:"required~ClothTypeID is required" `
	ClothType   ClothType `gorm:"foreignKey:ClothTypeID" valid:"-"`
}