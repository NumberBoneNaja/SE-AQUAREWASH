package controller

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

func GetAllJob(c *gin.Context) {
	var jobs []entity.Job
	db := config.DB()

	result := db.Preload("Department").Find(&jobs)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

func GetJobById(c *gin.Context) {
	ID := c.Param("id")
	var jobs []entity.Job

	db := config.DB()
	result := db.Preload("Department").First(&jobs, ID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

// func CreateJob(c *gin.Context) {
// 	var jobs []entity.Job

// 	if err := c.ShouldBindJSON(&jobs); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	db := config.DB()
// 	if err := db.Create(&jobs).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, jobs)
// }

func CreateJob(c *gin.Context) {
	var jobs entity.Job

	if err := c.ShouldBindJSON(&jobs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	if err := db.Create(&jobs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

// func UpdateJob(c *gin.Context) {
// 	var jobs []entity.Job
// 	ID := c.Param("id")

// 	db := config.DB()
// 	result := db.First(&jobs, ID)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
// 		return
// 	}

// 	if err := c.ShouldBindJSON(&jobs); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	result = db.Save(&jobs)
// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, jobs)
// }

func UpdateJob(c *gin.Context) {
	var jobs entity.Job
	ID := c.Param("id")

	db := config.DB()
	result := db.First(&jobs, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	if err := c.ShouldBindJSON(&jobs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result = db.Save(&jobs)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

func SoftDeleteJob(c *gin.Context) {
	var jobs entity.Job
	ID := c.Param("id")

	db := config.DB()
	result := db.First(&jobs, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	result = db.Delete(&jobs)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

func RestoreJob(c *gin.Context) {
	id := c.Param("id")
	var jobs entity.Job
	db := config.DB()

	// ตรวจสอบว่ามีข้อมูลที่ถูก Soft Delete
	if err := db.Unscoped().First(&jobs, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "jobs not found or not deleted"})
		return
	}

	// กู้คืนข้อมูลที่ถูกลบ
	if err := db.Unscoped().Model(&jobs).Update("deleted_at", nil).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to restore jobs"})
		return
	}

	c.JSON(200, gin.H{"message": "jobs restored successfully"})
}
