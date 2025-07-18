package entity

import "gorm.io/gorm"

type Package struct {
    gorm.Model
    PackageName string `valid:"required~PackageName is required"`
    Explain     string `valid:"required~Description is required"`
    PackagePic string

    Orders     []Order     `gorm:"foreignKey:PackageID"`   
    AddOns     []AddOn     `gorm:"foreignKey:PackageID"`   
    ClothTypes []ClothType `gorm:"foreignKey:PackageID"`   
}