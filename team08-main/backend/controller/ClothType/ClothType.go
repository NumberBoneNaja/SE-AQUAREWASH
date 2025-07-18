package controller

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

// CreateClothType - Create a new cloth type for a specific package
func CreateClothType(c *gin.Context) {
    db := config.DB()
    var ClothType entity.ClothType

    // Parse the JSON body
    if err := c.ShouldBindJSON(&ClothType); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "message": "Invalid request body",
            "error":   err.Error(),
        })
        return
    }

    // Validate required fields
    if ClothType.PackageID == 0 {
        c.JSON(http.StatusBadRequest, gin.H{
            "message": "Package ID is required",
        })
        return
    }

    if ClothType.Price <= 0 {
        c.JSON(http.StatusBadRequest, gin.H{
            "message": "Price must be greater than zero",
        })
        return
    }

    // Save the ClothType
    if err := db.Create(&ClothType).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "message": "Failed to create ClothType",
            "error":   err.Error(),
        })
        return
    }

    // Eager load the related Package
    if err := db.Preload("Package").First(&ClothType, ClothType.ID).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "message": "Failed to retrieve created ClothType with Package",
            "error":   err.Error(),
        })
        return
    }

    // Return the response
    c.JSON(http.StatusCreated, gin.H{
        "message": "ClothType created successfully",
        "data":    ClothType,
    })
}


// GetClothTypesByPackageID - Retrieve all cloth types for a specific package
func GetClothTypesByPackageID(c *gin.Context) {
	db := config.DB()
	packageID := c.Param("package_id")
	var ClothTypes []entity.ClothType

	// Retrieve cloth types by package ID
	if err := db.Where("package_id = ?", packageID).Find(&ClothTypes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to retrieve cloth types",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    ClothTypes,
	})
}

// UpdateClothType - Update a cloth type by ID
func UpdateClothType(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var ClothType entity.ClothType

	// Find the cloth type by ID
	if err := db.First(&ClothType, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "ClothType not found",
			"error":   err.Error(),
		})
		return
	}

	// Bind JSON payload to the cloth type
	if err := c.ShouldBindJSON(&ClothType); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	// Save updated cloth type
	if err := db.Save(&ClothType).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update ClothType",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "ClothType updated successfully",
		"data":    ClothType,
	})
}

// DeleteClothType - Delete a cloth type by ID
func DeleteClothType(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")

	// Delete the cloth type by ID
	if err := db.Delete(&entity.ClothType{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to delete ClothType",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "ClothType deleted successfully",
	})
}
