package controller

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

func CreateAddOn(c *gin.Context) {
	db := config.DB()
	var AddOn entity.AddOn

	// Parse JSON body
	if err := c.ShouldBindJSON(&AddOn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	// Save AddOn to the database
	if err := db.Create(&AddOn).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to create AddOn",
			"error":   err.Error(),
		})
		return
	}

	// Respond with success
	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    AddOn,
	})
}

// GetAddOnByID - Retrieve a single AddOn by ID
func GetAddOnByID(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var AddOn entity.AddOn

	if err := db.First(&AddOn, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "AddOn not found",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    AddOn,
	})
}

// GetAllAddOnsByPackageID - Retrieve all AddOns for a specific package
func GetAllAddOnsByPackageID(c *gin.Context) {
	db := config.DB()
	packageID := c.Param("package_id")
	var AddOns []entity.AddOn

	if err := db.Where("package_id = ?", packageID).Find(&AddOns).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to retrieve AddOns",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    AddOns,
	})
}

// UpdateAddOn - Update an existing AddOn by ID
func UpdateAddOn(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var AddOn entity.AddOn

	// Find the AddOn by ID
	if err := db.First(&AddOn, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "AddOn not found",
			"error":   err.Error(),
		})
		return
	}

	// Bind updated data
	if err := c.ShouldBindJSON(&AddOn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	// Save changes to the database
	if err := db.Save(&AddOn).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update AddOn",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "AddOn updated successfully",
		"data":    AddOn,
	})
}

// DeleteAddOn - Delete an AddOn by ID
func DeleteAddOn(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")

	if err := db.Delete(&entity.AddOn{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to delete AddOn",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "AddOn deleted successfully",
	})
}