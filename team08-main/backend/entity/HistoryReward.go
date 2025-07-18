package entity

import (
	"time"
	"gorm.io/gorm"
	//"github.com/asaskevich/govalidator" // Uncomment this line
)

type HistoryReward struct {
	gorm.Model
	Expire time.Time `valid:"required~Expire is required"`
	State  string    `valid:"required~State is required"`

	Barcode  string
	RewardID uint   `valid:"required~RewardID is required"`
	Reward   Reward `gorm:"foreignKey:RewardID;" valid:"-"`

	UserID uint `valid:"required~UserID is required" valid:"-"` // ต้องมีค่า
	User   User `gorm:"foreignKey:UserID;" valid:"-"`

	Orders []Order `gorm:"foreignKey:HistoryRewardID;" valid:"-"` // ไม่ต้อง valid ฟิลด์นี้
}
