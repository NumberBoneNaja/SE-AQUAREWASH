package entity

type TypeLaundryProduct struct {
	ID                 uint   `gorm:"primaryKey" json:"id"`
	TypeLaundryProduct string `json:"type_laundry_product"`
	Exchequers         []Exchequer `gorm:"foreignKey:TLPID" json:"exchequers"`
}