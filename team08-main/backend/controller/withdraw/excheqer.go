package withdraw

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

// Get all exchequers
func GetAllExchequers(c *gin.Context) {
	var exchequers []entity.Exchequer
	db := config.DB()

	if err := db.Preload("TLP").Find(&exchequers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, exchequers)
}

// Create an exchequer
func CreateExchequer(c *gin.Context) {
	var exchequer entity.Exchequer

	if err := c.ShouldBindJSON(&exchequer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	if err := db.Create(&exchequer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, exchequer)
}

// Update stock of an exchequer
func UpdateExchequerStock(c *gin.Context) {
	id := c.Param("id")
	var exchequer entity.Exchequer

	db := config.DB()
	if err := db.First(&exchequer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Exchequer not found"})
		return
	}

	var update struct {
		Stock int `json:"stock"`
	}
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	exchequer.Stock = update.Stock
	if err := db.Save(&exchequer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, exchequer)
}

func DeleteExchequer(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.Exchequer{}, ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Exchequer deleted successfully"})
}

func UpdateExchequer(c *gin.Context) {
	ID := c.Param("id")
	var exchequer entity.Exchequer
	db := config.DB()

	// ค้นหา Exchequer จาก ID
	if err := db.First(&exchequer, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Exchequer not found"})
		return
	}

	// Bind ข้อมูลจาก JSON
	if err := c.ShouldBindJSON(&exchequer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// บันทึกข้อมูลที่อัปเดต
	if err := db.Save(&exchequer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Exchequer updated successfully", "exchequer": exchequer})
}

// GetExchequerByID - ดึงข้อมูล Exchequer โดยใช้ ID
func GetExchequerByID(c *gin.Context) {
	ID := c.Param("id")
	var exchequer entity.Exchequer
	db := config.DB()

	// ค้นหา Exchequer จาก ID พร้อม Preload ข้อมูล TLP
	if err := db.Preload("TLP").First(&exchequer, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Exchequer not found"})
		return
	}

	c.JSON(http.StatusOK, exchequer)
}
