package entity

import (
	"time"

	"gorm.io/gorm"
)

type MembershipPayment struct {
	gorm.Model

	UserID uint `json:"UserID" valid:"required~UserID is required"`
	User   User `gorm:"foreignKey:UserID" valid:"-"`

	PackageMembershipID uint              `json:"PackageMembershipID" valid:"required~PackageMembershipID is required"`
	PackageMembership   PackageMembership `gorm:"foreignKey:PackageMembershipID" valid:"-"`

	PaymentMethod string    `json:"PaymentMethod" valid:"required~Payment method is required"`
	DateStart     time.Time `json:"DateStart" valid:"required~Start date is required"`
	DateEnd       time.Time `json:"DateEnd" valid:"required~End date is required,future~End date must be in the future"`
	PicPayment    string    `json:"PicPayment" gorm:"default:'0'" valid:"required~Payment picture is required"`
	Status        string    `json:"status" gorm:"default:'Processing'"`
}

type PackageMembership struct {
	gorm.Model

	NamePackage       string              `json:"NamePackage" valid:"required~Package name is required"`
	Price             uint64              `json:"Price" valid:"required~Price is required"`
	HowLongTime       uint64              `json:"HowLongTime" valid:"required~Duration is required"`
	Description       string              `json:"Description" ` // ไม่จำเป็นต้องใส่
	PicPayment        string              `json:"PicPayment" `  // ไม่จำเป็นต้องใส่
	QuotaOrder        uint                `gorm:"default:0"`
	QuotaBooking      uint                `gorm:"default:0"`
	PointRate         float64             `gorm:"default:1"`
	DiscountRate      float64             `gorm:"default:0"`
	MembershipPayment []MembershipPayment `gorm:"foreignKey:PackageMembershipID" valid:"-"`
}

type HistoryPaymentMembership struct {
	gorm.Model

	UserID uint `json:"UserID" valid:"required~UserID is required"`
	User   User `gorm:"foreignKey:UserID" valid:"-"`

	PackageMembershipID uint              `json:"PackageMembershipID" valid:"required~PackageMembershipID is required"`
	PackageMembership   PackageMembership `gorm:"foreignKey:PackageMembershipID" valid:"-"`

	PaymentMethod string    `json:"PaymentMethod" valid:"required~Payment method is required"`
	DateStart     time.Time `json:"DateStart" valid:"required~Start date is required"`
	DateEnd       time.Time `json:"DateEnd" valid:"required~End date is required,future~End date must be in the future"`
	Status        string    `json:"Status" gorm:"default:'OK'"`
}
