package entity

import "gorm.io/gorm"

type OrderStatus struct {
	gorm.Model
	Status string `valid:"required~Status is required"`

	Orders []Order `gorm:"foreignKey:OrderStatusID"`
}