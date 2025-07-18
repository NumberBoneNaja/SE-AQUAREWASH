package withdraw

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
)

// GetAllTypeLaundryProducts - ดึงข้อมูลประเภทสินค้าทั้งหมด
func GetAllTypeLaundryProducts(c *gin.Context) {
	var types []entity.TypeLaundryProduct
	db := config.DB()

	results := db.Preload("Exchequers").Find(&types)
	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, types)
}

// GetTypeLaundryProduct - ดึงข้อมูลประเภทสินค้าโดย ID
func GetTypeLaundryProduct(c *gin.Context) {
	ID := c.Param("id")
	var tlp entity.TypeLaundryProduct
	db := config.DB()

	results := db.Preload("Exchequers").First(&tlp, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, tlp)
}

// CreateTypeLaundryProduct - สร้างประเภทสินค้าใหม่
func CreateTypeLaundryProduct(c *gin.Context) {
	var tlp entity.TypeLaundryProduct
	db := config.DB()

	if err := c.ShouldBindJSON(&tlp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	if result := db.Create(&tlp); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "TypeLaundryProduct created successfully"})
}

// DeleteTypeLaundryProduct - ลบประเภทสินค้าโดย ID
func DeleteTypeLaundryProduct(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.TypeLaundryProduct{}, ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "TypeLaundryProduct deleted successfully"})
}
