package entity

import "gorm.io/gorm"

type Order struct {
	gorm.Model
	Price float32   `valid:"positive~Price must be positive"`
	Discount float32   `valid:"optional,positive~Discount must be positive"`// มีไม่มีก็ได้ ไม่ต้องเป็น required
  
    Note string         `valid:"optional"`// มีไม่มีก็ได้ ไม่ต้องเป็น required
	QuotaUsed bool        `valid:"optional" gorm:"default:false"`// มีไม่มีก็ได้ ไม่ต้องเป็น required
	ExpecterdPoint int `valid:"optional,positive~ExpectedPoint must be positive"`// มีไม่มีก็ได้ ไม่ต้องเป็น required
	UserID uint      `valid:"required~UserID is required"`
	User User `gorm:"foreignKey:UserID " valid:"-"`
	
	PackageID uint    `valid:"required~PackageID is required"`
	Package Package `gorm:"foreignKey:PackageID" valid:"-"`

	HistoryRewardID uint     // มีไม่มีก็ได้ ไม่ต้องเป็น required
	HistoryReward HistoryReward `gorm:"foreignKey:HistoryRewardID" valid:"-"`

	OrderStatusID uint      `valid:"required~OrderStatusID is required"`
	OrderStatus OrderStatus `gorm:"foreignKey:OrderStatusID" valid:"-"`

	OrderDetails []OrderDetail `gorm:"foreignKey:OrderID"`

	Notifications []Notification `gorm:"foreignKey:OrderID"`

	Images []Image `gorm:"foreignKey:OrderID"`

	Payments []Payment `gorm:"foreignKey:OrderID"`

	AddOnDetails []AddOnDetail `gorm:"foreignKey:OrderID"` 
}