package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	PaymentStart time.Time   `valid:"required~PaymentStart is required"` 
	PaymentEnd time.Time   `valid:"future~PaymentEnd must be in the future"` 
	Price float32   `valid:"positive~Price must be positive"`
	BookID uint   `valid:"optional"`
	Book Books `gorm:"foreignKey:BookID" valid:"-"`

	OrderID uint  `valid:"optional"`
	Order Order `gorm:"foreignKey:OrderID" valid:"-"`

	PaymentStatusID uint  `valid:"required~PaymentStatusID is required"`
	PaymentStatus PaymentStatus `gorm:"foreignKey:PaymentStatusID" valid:"-"`

	UserID uint  `valid:"required~UserID is required"`
	User User `gorm:"foreignKey:UserID" valid:"-"`
}