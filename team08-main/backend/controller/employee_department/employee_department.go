package controller

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

func GetAllDepartments(c *gin.Context) {
	var departments []entity.Department
	db := config.DB()

	result := db.Find(&departments)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, departments)
}

func GetDepartmentById(c *gin.Context) {
	ID := c.Param("id")
	var departments []entity.Department

	db := config.DB()
	result := db.First(&departments, ID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, departments)
}

func CreateDepartment(c *gin.Context) {
	var department entity.Department

	if err := c.ShouldBindJSON(&department); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	if err := db.Create(&department).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, department)
}

func UpdateDepartment(c *gin.Context) {
	var department entity.Department
	ID := c.Param("id")

	db := config.DB()
	result := db.First(&department, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	if err := c.ShouldBindJSON(&department); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result = db.Save(&department)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, department)
}

func SoftDeleteDepartment(c *gin.Context) {
	var department entity.Department
	ID := c.Param("id")

	db := config.DB()
	result := db.First(&department, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	result = db.Delete(&department)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, department)
}

func RestoreDepartment(c *gin.Context) {
	id := c.Param("id")
	var department entity.Department
	db := config.DB()

	// ตรวจสอบว่ามีข้อมูลที่ถูก Soft Delete
	if err := db.Unscoped().First(&department, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Membership payment not found or not deleted"})
		return
	}

	// กู้คืนข้อมูลที่ถูกลบ
	if err := db.Unscoped().Model(&department).Update("deleted_at", nil).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to restore membership payment"})
		return
	}

	c.JSON(200, gin.H{"message": "Membership payment restored successfully"})
}
