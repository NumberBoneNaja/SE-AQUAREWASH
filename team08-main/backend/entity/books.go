package entity

import (
	"time"

	"gorm.io/gorm"
	"github.com/asaskevich/govalidator"
)

type Books struct {
	gorm.Model
	Price          float32          `json:"price" valid:"required~Price is required,positive~Price must be positive"`
	Status         string           `json:"status" valid:"required~Status is required,in(ส่งการจอง|ไม่สมบูรณ์|สำเร็จ)~Status must be 'ส่งการจอง', 'ไม่สมบูรณ์', or 'สำเร็จ'"`
	BooksStart     time.Time        `json:"books_start" valid:"required~BooksStart is required"`
	BooksEnd       time.Time        `json:"books_end" valid:"required~BooksEnd is required,future~BooksEnd must be in the future"`
	UserID         uint             `json:"user_id" valid:"required~UserID is required"`
	User           User             `gorm:"foreignKey:UserID" json:"user" valid:"-"`
	BookingDetails []BookingDetails `gorm:"foreignKey:BooksID" json:"booking_details" valid:"-"`
	Payments       []Payment        `gorm:"foreignKey:BookID" valid:"-"`
}















func IsPositive(i interface{}, o interface{}) bool {
	switch v := i.(type) {
	case int:
		return v > 0
	case int8:
		return v > 0
	case int16:
		return v > 0
	case int32:
		return v > 0
	case int64:
		return v > 0
	case uint:
		return v > 0
	case uint8:
		return v > 0
	case uint16:
		return v > 0
	case uint32:
		return v > 0
	case uint64:
		return v > 0
	case float32:
		return v > 0
	case float64:
		return v > 0
	default:
		return false
	}
}

func init() {
	govalidator.CustomTypeTagMap.Set("positive", IsPositive)
}
