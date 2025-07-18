package entity

import ( "gorm.io/gorm"
)

type Machine struct {
    gorm.Model
    MachineName     string          `valid:"required~MachineName is required" json:"machine_name"`
    MachineType     string          `valid:"required~MachineType is required" json:"machine_type"`
    Status          string          `valid:"required~Status is required"  json:"status"` 
    MModel          string          `valid:"required~MModel is required"  json:"m_model"`
    Brand           string          `valid:"required~Brand is required"   json:"brand"`
    Capacity        float32         `valid:"required~Capacity is required" json:"capacity"` 
    BookingDetails []BookingDetails `gorm:"foreignKey:MachineID" json:"booking_details"`
}

