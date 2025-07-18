package controller

import (
	"fmt"
	"net/http"
	"os"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

// CreatePackage - Create a new package
func CreatePackage(c *gin.Context) {
	var packages entity.Package
	db := config.DB()

	// Parse JSON body
	if err := c.ShouldBindJSON(&packages); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	// Save package to the database
	if err := db.Create(&packages).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to create package",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Package created successfully",
		"data":    packages,
	})
}

// GetPackage - Get a single package by ID
func GetPackage(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var packages entity.Package

	if err := db.First(&packages, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Package not found",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    packages,
	})
}

// GetAllPackages - Get all packages
func GetAllPackages(c *gin.Context) {
	db := config.DB()
	var packages []entity.Package

	if err := db.Find(&packages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to retrieve packages",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    packages,
	})
}

// UpdatePackage - Update a package by ID
func UpdatePackage(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var packages entity.Package

	// Find existing package
	if err := db.First(&packages, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Package not found",
			"error":   err.Error(),
		})
		return
	}

	// Parse and update fields
	if err := c.ShouldBindJSON(&packages); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	if err := db.Save(&packages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update package",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Package updated successfully",
		"data":    packages,
	})
}

// DeletePackage - Delete a package by ID
func DeletePackage(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")

	if err := db.Delete(&entity.Package{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to delete package",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Package deleted successfully",
	})
}


func UploadImagePackage(c *gin.Context) {
	file, err := c.FormFile("package")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
		return
	}

	uploadDir := "./images/packageimage"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	if err := c.SaveUploadedFile(file, fmt.Sprintf("%s/%s", uploadDir, file.Filename)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image uploaded successfully"})
}
func UploadImageAddOn(c *gin.Context) {
	file, err := c.FormFile("addon")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
		return
	}

	uploadDir := "./images/addonImage"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	if err := c.SaveUploadedFile(file, fmt.Sprintf("%s/%s", uploadDir, file.Filename)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image uploaded successfully"})
}