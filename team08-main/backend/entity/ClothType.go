package entity
import "gorm.io/gorm"
type ClothType struct {
    gorm.Model
    TypeName     string     `valid:"required~TypeName is required"`
    Price        float32     `valid:"required~Price is required,positive~Price must be positive"`
     
    PackageID    uint        `valid:"required~PackageID is required"`
    Package      Package    `gorm:"foreignKey:PackageID" valid:"-"`
	
    OrderDetails []OrderDetail `gorm:"foreignKey:ClothTypeID" `
}