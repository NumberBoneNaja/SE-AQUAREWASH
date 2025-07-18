package controller

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

func GetAllOfficeHours(c *gin.Context) {
	var officehours []entity.OfficeHours
	db := config.DB()

	result := db.Preload("Employee").Find(&officehours)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, officehours)
}

func GetOfficeHour(c *gin.Context) {
	ID := c.Param("id")
	var officehour entity.OfficeHours

	db := config.DB()
	result := db.Preload("Employee").First(&officehour, ID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, officehour)
}

func CreateOfficeHour(c *gin.Context) {
	var officehour entity.OfficeHours

	if err := c.ShouldBindJSON(&officehour); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	if err := db.Create(&officehour).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, officehour)
}

func UpdateOfficeHour(c *gin.Context) {
	var officehour entity.OfficeHours
	ID := c.Param("id")

	db := config.DB()
	result := db.First(&officehour, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	if err := c.ShouldBindJSON(&officehour); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result = db.Save(&officehour)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, officehour)
}

func SoftDeleteOfficeHour(c *gin.Context) {
	var officehour entity.OfficeHours
	ID := c.Param("id")

	db := config.DB()
	result := db.First(&officehour, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	result = db.Delete(&officehour)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, officehour)
}

func RestoreOfficeHour(c *gin.Context) {
	id := c.Param("id")
	var officehour entity.OfficeHours
	db := config.DB()

	if err := db.Unscoped().First(&officehour, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Office hour not found or not deleted"})
		return
	}

	if err := db.Unscoped().Model(&officehour).Update("deleted_at", nil).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to restore office hour"})
		return
	}

	c.JSON(200, gin.H{"message": "Office hour restored successfully"})
}

func GetLastOfficeHour(c *gin.Context) {
	var officehour entity.OfficeHours

	db := config.DB()

	results := db.Preload("Employee").Order("ID DESC").First(&officehour)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if officehour.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	c.JSON(http.StatusOK, officehour)
}

func GetOfficeHourByEmployeeID(c *gin.Context) {
	employeeID := c.Param("employee_id")
	var officehour entity.OfficeHours

	db := config.DB()
	result := db.Preload("Employee").Where("employee_id = ?", employeeID).First(&officehour)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, officehour)
}

func GetOfficeHourByCheckin(c *gin.Context) {
	checkin := c.Param("checkin")
	var officehour entity.OfficeHours

	db := config.DB()
	result := db.Preload("Employee").Where("checkin = ?", checkin).First(&officehour)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, officehour)
}
