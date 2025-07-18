package entity

type Exchequer struct {
	ID                 uint               `gorm:"primaryKey" json:"id"`
	Brand              string             `json:"brand"`
	Stock              int                `json:"stock"`
	Image              string             `gorm:"type:longtext" json:"image"`
	TLPID              uint               `json:"tlp_id"`
	TLP                TypeLaundryProduct `gorm:"foreignKey:TLPID" json:"tlp"`
}