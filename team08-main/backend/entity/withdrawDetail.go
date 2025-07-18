package entity

type WithdrawDetail struct {
	ID         uint    `gorm:"primaryKey" json:"id"`
	Quantity   int     `json:"quantity"`
	ProductID  uint    `json:"product_id"`
	Product    Exchequer `gorm:"foreignKey:ProductID" json:"product"`
	WithdrawID uint    `json:"withdraw_id"`
	Withdraw   Withdraw `gorm:"foreignKey:WithdrawID" json:"withdraw"`
}