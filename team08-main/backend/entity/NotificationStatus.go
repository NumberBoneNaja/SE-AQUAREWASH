package entity

import "gorm.io/gorm"

type NotificationStatus struct {
	gorm.Model
	Status string `valid:"required~Status is required"`

	Notifications []Notification `gorm:"foreignKey:NotificationStatusID"`
}