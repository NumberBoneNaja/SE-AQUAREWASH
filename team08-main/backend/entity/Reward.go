package entity

import (
	"time"
	//"fmt"
	"github.com/asaskevich/govalidator"
	//"gopkg.in/go-playground/validator.v9"
	"gorm.io/gorm"
)



// Custom validation function to check if Endtime is greater than Starttime
type Reward struct {
	gorm.Model
	Point          uint            `valid:"required~Point is required, range(0|999999)~Point must be greather than equal 0"`
	Name           string          `valid:"required~Name is required"`
	ImagePath      string          `gorm:"type:longtext"`
	Discount       float32         `valid:"range(0|100)~Discount must be greater than or equal to 0 and less than or equal to 100"`
	Limit          uint            
	RewardTypeID   uint            `valid:"required~RewardTypeID is required,range(1|3)~RewardTypeID must be 1 2 or 3"`
	RewardType     RewardType      `gorm:"foreignKey:RewardTypeID"`
	Starttime      time.Time       `valid:"required~Starttime is required"`
	Endtime        time.Time       `valid:"required~Endtime is required,EndtimeAfterStarttime~Endtime must be after Starttime"`
	IsActive       bool            
	HistoryRewards []HistoryReward `gorm:"foreignKey:RewardID"`
}

// Custom validation
func init() {
	govalidator.CustomTypeTagMap.Set("EndtimeAfterStarttime", func(i interface{}, context interface{}) bool {
		reward, ok := context.(Reward)
		if !ok {
			return false
		}
		return reward.Endtime.After(reward.Starttime) || reward.Endtime.Equal(reward.Starttime)
	})
}
