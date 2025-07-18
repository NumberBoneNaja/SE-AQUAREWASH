package entity

import (
	"gorm.io/gorm"
)

type BookingDetails struct {
	gorm.Model

	BooksID uint  `json:"books_id"`
	Books   Books `gorm:"foreignKey:BooksID" json:"books"`

	MachineID uint    `json:"machine_id"`
	Machine   Machine `gorm:"foreignKey:MachineID" json:"machine" valid:"-"`
}
