package user

import (
	"errors" // เพิ่ม import สำหรับ package errors
	"fmt"
	"net/http"
	"os"


	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm" // เพิ่ม import สำหรับ gorm
)

// GET /users
func ListUsers(c *gin.Context) {

	// Define a slice to hold user records
	var users []entity.User

	// Get the database connection
	db := config.DB()

	// Query the user table for basic user data
	results := db.Select("id, email, user_name, password, status, first_name, last_name, age, profile, profile_background").Find(&users)

	// Check for errors in the query
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Return the results as JSON
	c.JSON(http.StatusOK, users)
}

// PUT update User by id
func UpdateUserByid(c *gin.Context) {
	var User entity.User
	UserID := c.Param("id")
	db := config.DB()

	result := db.First(&User, UserID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Id Store not found"})
		return
	}

	if err := c.ShouldBindJSON(&User); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&User)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// GET /user/:id
func GetUser(c *gin.Context) {
	ID := c.Param("id")
	var user entity.User

	db := config.DB()

	// Query the user by ID
	results := db.Where("id = ?", ID).First(&user)
	if results.Error != nil {
		if errors.Is(results.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, user)
}
func GetPUser(c *gin.Context) {
	ID := c.Param("id")
	var user entity.User

	db := config.DB()

	// Query the user by ID
	results := db.Where("id = ?", ID).First(&user)
	if results.Error != nil {
		if errors.Is(results.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		}
		return
	}
	user.Profile = fmt.Sprintf("https://api.aqua-wash.online/images/ProfileUser/%s", user.Profile)
	user.ProfileBackground = fmt.Sprintf("https://api.aqua-wash.online/images/BgUser/%s", user.ProfileBackground)
    
	// user.Profile = fmt.Sprintf("http//localhost:8000/images/ProfileUser/%s", user.Profile)
	// user.ProfileBackground = fmt.Sprintf("http//localhost:8000/images/BgUser/%s", user.ProfileBackground)

	c.JSON(http.StatusOK, user)
}

// GET user by status
func GetListUserByStatus(c *gin.Context) {
	StatusUser := c.Param("status")
	var User []entity.User

	db := config.DB()

	results := db.Preload("TaxUser").Where("status = ?", StatusUser).Find(&User)
	if results.Error != nil {
		if errors.Is(results.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Store not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, User)
}

func UpdateUserStatus(c *gin.Context) {
	id := c.Param("id")
	var user entity.User
	db := config.DB()

	// ค้นหา MembershipPayment ด้วย ID
	if err := db.First(&user, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	// ตรวจสอบสถานะเดิม
	if user.Status == "User" {
		c.JSON(400, gin.H{"error": "User not is already marked as User"})
		return
	}

	// เปลี่ยนสถานะเป็น Paid
	user.Status = "User"

	// บันทึกข้อมูลใหม่
	if err := db.Save(&user).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update user status"})
		return
	}

	c.JSON(200, gin.H{"message": "Status updated successfully", "data": user})
}

func UpdateUserStatusEmployee(c *gin.Context) {
	id := c.Param("id")
	var user entity.User
	db := config.DB()

	// ค้นหา MembershipPayment ด้วย ID
	if err := db.First(&user, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	// ตรวจสอบสถานะเดิม
	if user.Status == "Employee" {
		c.JSON(400, gin.H{"error": "User not is already marked as User"})
		return
	}

	// เปลี่ยนสถานะเป็น Paid
	user.Status = "Employee"

	// บันทึกข้อมูลใหม่
	if err := db.Save(&user).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update user status"})
		return
	}

	c.JSON(200, gin.H{"message": "Status updated successfully", "data": user})
}
func UpdateImageUser(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
		fmt.Println("Content-Type:", c.Request.Header.Get("Content-Type"))
		return
	}
	

	db := config.DB()
	var user entity.User
	id := c.Param("id")
	
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not provided"})
		return
	}
	uploadDir := "./images/ProfileUser"

	// ค้นหาผู้ใช้จาก database
	err1 := db.Where("id = ?", id).First(&user).Error
	if err1 != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found", "error": err1.Error()})
		return
	}

	// ตรวจสอบว่ารูปภาพปัจจุบันมีอยู่ในโฟลเดอร์หรือไม่
	imagePath := fmt.Sprintf("%s/%s", uploadDir, user.Profile)
	if _, err := os.Stat(imagePath); err == nil {
		// ถ้ามีรูปอยู่ ให้ลบออก
		if err := os.Remove(imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image file"})
			return
		}
	}

	// สร้างโฟลเดอร์ถ้ายังไม่มี
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	// บันทึกไฟล์ที่อัปโหลด
	if err := c.SaveUploadedFile(file, fmt.Sprintf("%s/%s", uploadDir, file.Filename)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// อัปเดตข้อมูลในฐานข้อมูล
	user.Profile = file.Filename
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image uploaded successfully", "data": user})
}
func UpdateBgUser(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
		return
	}

	db := config.DB()
	var user entity.User
	id := c.Param("id")
	uploadDir := "./images/BgUser"

	// ค้นหาผู้ใช้จาก database
	err1 := db.Where("id = ?", id).First(&user).Error
	if err1 != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found", "error": err1.Error()})
		return
	}

	// ตรวจสอบว่ารูปภาพปัจจุบันมีอยู่ในโฟลเดอร์หรือไม่
	imagePath := fmt.Sprintf("%s/%s", uploadDir, user.ProfileBackground)
	if _, err := os.Stat(imagePath); err == nil {
		// ถ้ามีรูปอยู่ ให้ลบออก
		if err := os.Remove(imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image file"})
			return
		}
	}

	// สร้างโฟลเดอร์ถ้ายังไม่มี
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	// บันทึกไฟล์ที่อัปโหลด
	if err := c.SaveUploadedFile(file, fmt.Sprintf("%s/%s", uploadDir, file.Filename)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// อัปเดตข้อมูลในฐานข้อมูล
	user.ProfileBackground = file.Filename
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image uploaded successfully", "data": user})
}


func UpdatePointByid(c *gin.Context) {
	var User entity.User
	UserID := c.Param("id")
	db := config.DB()
 
	// Find existing user
	result := db.First(&User, UserID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
 
	// Create a temporary struct to bind only Point
	var PointUpdate struct {
		Point float64 `json:"Point"`
	}
 
	// Bind only Point field
	if err := c.ShouldBindJSON(&PointUpdate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid point data"})
		return
	}
 
	// Update only Point field
	result = db.Model(&User).Update("Point", PointUpdate.Point)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update point"})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{
		"message": "Point updated successfully", 
		"point": PointUpdate.Point,
	})
 }
