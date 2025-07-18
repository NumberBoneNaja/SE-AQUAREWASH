package controller

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

func CreateNotification(c *gin.Context) {

	var notification entity.Notification
	db := config.DB()

	if err := c.ShouldBindJSON(&notification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(notification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var order entity.Order
	db.Where("id = ?", notification.OrderID).First(&order)
	if order.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not Found package ID"})
		return
	}
	var users entity.User
	db.Where("id = ?", notification.UserID).First(&users)
	if users.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not Found User ID"})
		return
	}
	err := db.Create(&notification).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error",
			"message": "Review your input", "data": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    notification,
	})
}

func GetNotificationbyUserID(c *gin.Context) {
	db := config.DB()
	var notifications []entity.Notification
	userID := c.Param("id")

	var user entity.User
	db.Where("id = ?", userID).First(&user)
	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	if err := db.Preload("NotificationStatus").Where("user_id = ?", userID).Find(&notifications).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to fetch notifications", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": notifications})
}

func UpdateStatusNotification(c *gin.Context) {
	id:=c.Param("id")
	db := config.DB()
	var notification entity.Notification
	if err := db.Where("id = ?", id).First(&notification).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&notification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(notification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.Save(&notification)
	c.JSON(http.StatusOK, gin.H{"message": "Update successful", "data": notification})
}
func GetNotificationbyID(c *gin.Context) {
	db := config.DB()
	var notifications entity.Notification
	id := c.Param("id")

	var notification entity.Notification
	db.Where("id = ?", id).First(&notification)
	if notification.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "ID not found"})
		return
	}

	if err := db.Preload("NotificationStatus").Where("id = ?", id).First(&notifications).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to fetch notifications", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": notifications})
}