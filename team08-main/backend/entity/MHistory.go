package entity

import (
	"time"

	"gorm.io/gorm"
)

type MHistory struct {
    gorm.Model
    MachineID uint   `json:"machine_id"`
    Action    string `json:"action"`
	Timestamp time.Time `json:"timestamp"` 
	Changes   string    `json:"changes"`   
	Machine   Machine   `gorm:"foreignKey:MachineID"` 
}
