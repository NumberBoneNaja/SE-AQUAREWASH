package withdraw

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

// Get all withdraw details
func GetAllWithdrawDetails(c *gin.Context) {
	var details []entity.WithdrawDetail
	db := config.DB()

	if err := db.Preload("Product").Preload("Withdraw").Find(&details).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, details)
}

// Create a withdraw detail
func CreateWithdrawDetail(c *gin.Context) {
	var detail entity.WithdrawDetail

	if err := c.ShouldBindJSON(&detail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	if err := db.Create(&detail).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, detail)
}

// Delete a withdraw detail
func DeleteWithdrawDetail(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if err := db.Delete(&entity.WithdrawDetail{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Withdraw detail deleted successfully"})
}

// UpdateWithdrawDetail - อัปเดตข้อมูลรายละเอียดการเบิก
func UpdateWithdrawDetail(c *gin.Context) {
	ID := c.Param("id")
	var withdrawDetail entity.WithdrawDetail
	db := config.DB()

	// ค้นหา WithdrawDetail จาก ID
	if err := db.First(&withdrawDetail, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "WithdrawDetail not found"})
		return
	}

	// Bind ข้อมูลจาก JSON
	if err := c.ShouldBindJSON(&withdrawDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// บันทึกข้อมูลที่อัปเดต
	if err := db.Save(&withdrawDetail).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "WithdrawDetail updated successfully", "withdraw_detail": withdrawDetail})
}

