package entity

import "time"

type Withdraw struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	WithdrawDate time.Time `json:"withdraw_date"`
	EmployeeID   uint      `json:"employee_id"`
}