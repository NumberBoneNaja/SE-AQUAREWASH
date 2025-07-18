package entity
import (
	"gorm.io/gorm"
)
type RewardType struct {
	gorm.Model
	TypeName string 
 
	Rewards []Reward `gorm:"foreignKey:RewardTypeID"`



}