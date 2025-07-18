package machine

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

func CreateHistory(c *gin.Context) {
	var history entity.MHistory

	if err := c.ShouldBindJSON(&history); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	if err := db.Create(&history).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": history})
}

func GetHistoryByMachineID(c *gin.Context) {
    var m_histories []entity.MHistory
    machineID := c.Param("id") // Get machine ID from URL

	db := config.DB()
    if err := db.Where("machine_id = ?", machineID).Find(&m_histories).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"success": true, "data": m_histories})
}
