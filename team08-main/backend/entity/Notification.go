package entity

import (
	// "time"

	"gorm.io/gorm"
)

type Notification struct {
	gorm.Model
	// DateTime time.Time  `valid:"required~DateTime is required"`
	Title string      `valid:"required~Title is required"`
	Message string      `valid:"required~Message is required"`
    
	NotificationStatusID uint `valid:"required~NotificationStatusID is required"`
	NotificationStatus NotificationStatus `gorm:"foreignKey:NotificationStatusID" valid:"-"`

	UserID uint  `valid:"required~UserID is required"`
	User User `gorm:"foreignKey:UserID" valid:"-"`

	OrderID uint `valid:"required~OrderID is required"`
	Order Order `gorm:"foreignKey:OrderID" valid:"-"`
}