package controller

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

func GetAllEmployees(c *gin.Context) {
	var employees []entity.Employee
	db := config.DB()

	result := db.Preload("User").Preload("Job.Department").Find(&employees)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, employees)
}

func GetEmployee(c *gin.Context) {
	ID := c.Param("id")
	var employee entity.Employee

	db := config.DB()
	result := db.Preload("User").Preload("Job.Department").First(&employee, ID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, employee)
}

func CreateEmployee(c *gin.Context) {
	var employee entity.Employee

	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	if err := db.Create(&employee).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, employee)
}

func UpdateMembershipPayment(c *gin.Context) {
	id := c.Param("id")
	var employee entity.Employee
	db := config.DB()

	if err := db.First(&employee, id).Error; err != nil {
		c.JSON(404, gin.H{"error": " not found"})
		return
	}

	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&employee).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update"})
		return
	}

	c.JSON(200, employee)
}

// PUT update User by id
func UpdateEmplyeeByid(c *gin.Context) {
	var Employee entity.Employee
	EmployeeID := c.Param("id")
	db := config.DB()

	result := db.First(&Employee, EmployeeID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Id Store not found"})
		return
	}

	if err := c.ShouldBindJSON(&Employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&Employee)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func DeleteEmployee(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Exec("DELETE FROM employees WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

func GetLastEmployee(c *gin.Context) {
	var employee entity.Employee

	db := config.DB()
	result := db.Order("ID DESC").First(&employee)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, employee)
}
