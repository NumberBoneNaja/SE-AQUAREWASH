package withdraw
import (
	"net/http"
	"time"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

// Get all withdraws
func GetAllWithdraws(c *gin.Context) {
	var withdraws []entity.Withdraw
	db := config.DB()

	if err := db.Preload("WithdrawDetails").Find(&withdraws).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, withdraws)
}

// Create a withdraw
func CreateWithdraw(c *gin.Context) {
	var withdraw entity.Withdraw

	if err := c.ShouldBindJSON(&withdraw); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	withdraw.WithdrawDate = time.Now()
	db := config.DB()

	if err := db.Create(&withdraw).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, withdraw)
}

// Delete a withdraw
func DeleteWithdraw(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if err := db.Delete(&entity.Withdraw{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Withdraw deleted successfully"})
}


// UpdateWithdraw - อัปเดตข้อมูลการเบิก
func UpdateWithdraw(c *gin.Context) {
	ID := c.Param("id")
	var withdraw entity.Withdraw
	db := config.DB()

	// ค้นหา Withdraw จาก ID
	if err := db.First(&withdraw, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Withdraw not found"})
		return
	}

	// Bind ข้อมูลจาก JSON
	if err := c.ShouldBindJSON(&withdraw); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// บันทึกข้อมูลที่อัปเดต
	if err := db.Save(&withdraw).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Withdraw updated successfully", "withdraw": withdraw})
}
