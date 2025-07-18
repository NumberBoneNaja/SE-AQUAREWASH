package controller

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {

	var Orders entity.Order
	db := config.DB()

	if err := c.ShouldBindJSON(&Orders); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// govaliator
	if _, err := govalidator.ValidateStruct(Orders); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var packages entity.Package
	db.Where("id = ?", Orders.PackageID).First(&packages)
	if packages.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not Found package ID"})
		return
	}
	var users entity.User
	db.Where("id = ?", Orders.UserID).First(&users)
	if users.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not Found User ID"})
		return
	}
	err := db.Create(&Orders).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error",
			"message": "Review your input", "data": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    Orders,
	})
}
func CreateOrderDetail(c *gin.Context) {
	var orderDetail entity.OrderDetail
	db := config.DB()

	// Parse JSON body to the OrderDetail struct
	if err := c.ShouldBindJSON(&orderDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Review your input",
			"data":    err.Error(),
		})
		return
	}
	if _, err := govalidator.ValidateStruct(orderDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if Order exists
	var orders entity.Order
	if err := db.Where("id = ?", orderDetail.OrderID).First(&orders).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Order not found",
		})
		return
	}

	// Check if ClothType exists
	var cloths entity.ClothType
	if err := db.Where("id = ?", orderDetail.ClothTypeID).First(&cloths).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Cloth type not found",
		})
		return
	}

	// Create the OrderDetail record
	if err := db.Create(&orderDetail).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Review your input",
			"data":    err.Error(),
		})
		return
	}

	// Return success response
	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    orderDetail,
	})
}
func CreateAddOnDetail(c *gin.Context) {
	var addOnDetail entity.AddOnDetail
	db := config.DB()

	// Parse JSON body to the AddOnDetail struct
	if err := c.ShouldBindJSON(&addOnDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid input",
		})
		return
	}
	if _, err := govalidator.ValidateStruct(addOnDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create the AddOnDetail record
	if err := db.Create(&addOnDetail).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Failed to create AddOnDetail",
			"data":    err.Error(),
		})
		return
	}

	// Return success response
	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    addOnDetail,
	})
}

func GetAllPackage(c *gin.Context) {
	db := config.DB()
	var packages []entity.Package

	if err := db.Find(&packages).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	for i := range packages {
		packages[i].PackagePic = fmt.Sprintf("https://api.aqua-wash.online/images/packageimage/%s", packages[i].PackagePic)
		// packages[i].PackagePic = fmt.Sprintf("http//localhost:8000/images/packageimage/%s", packages[i].PackagePic)
	}



	c.JSON(http.StatusOK, packages)
}

func GetPackageByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	db := config.DB()
	var pkg entity.Package
	if err := db.Where("id = ?", id).First(&pkg).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pkg)
}

func GetAddOnByPackageID(c *gin.Context) {
	db := config.DB()
	var addOns []entity.AddOn

	if err := db.Where("package_id = ?", c.Param("id")).Find(&addOns).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	for i := range addOns {
		addOns[i].AddOnPic = fmt.Sprintf("https://api.aqua-wash.online/images/addonImage/%s", addOns[i].AddOnPic)
		// addOns[i].AddOnPic = fmt.Sprintf("http//localhost:8000/images/addonImage/%s", addOns[i].AddOnPic)
		fmt.Println(addOns[i].AddOnPic)
	}
	

	c.JSON(http.StatusOK, addOns)
}

func GetClothByPackageID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	db := config.DB()
	var cloths []entity.ClothType
	if err := db.Where("package_id = ?", uint(id)).Find(&cloths).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, cloths)
}


func UploadImage(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
		return
	}

	uploadDir := "./images/ProfOrder"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	if err := c.SaveUploadedFile(file, fmt.Sprintf("%s/%s", uploadDir, file.Filename)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	db := config.DB()
	image := entity.Image{ImagePath: file.Filename, OrderID: uint(id)}
	if _, err := govalidator.ValidateStruct(image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := db.Create(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image uploaded successfully", "data": image})
}

func GetImagesByOrderID(c *gin.Context) {
	db := config.DB()
	var images []entity.Image

	if err := db.Where("order_id = ?", c.Param("id")).Find(&images).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Images not found"})
		return
	}

	for i := range images {
		images[i].ImagePath = fmt.Sprintf("https://api.aqua-wash.online/images/ProfOrder/%s", images[i].ImagePath)
		// images[i].ImagePath = fmt.Sprintf("http//localhost:8000/images/ProfOrder/%s", images[i].ImagePath)
	}

	c.JSON(http.StatusOK, images)
}

func DeleteImageByID(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var image entity.Image

	if err := db.Where("id = ?", id).First(&image).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image not found"})
		return
	}

	if err := os.Remove(fmt.Sprintf("./images/ProfOrder/%s", image.ImagePath)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image file"})
		return
	}

	if err := db.Delete(&entity.Image{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}

func UploadMultipleImages(c *gin.Context) {
	db := config.DB()
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	files := form.File["images"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No files uploaded"})
		return
	}

	uploadDir := "./images/ProfOrder"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	for _, file := range files {
		if err := c.SaveUploadedFile(file, fmt.Sprintf("%s/%s", uploadDir, file.Filename)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		image := entity.Image{ImagePath: file.Filename, OrderID: uint(id)}
		if _, err := govalidator.ValidateStruct(image); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := db.Create(&image).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image record"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Images uploaded successfully"})
}

func DeleteAddOnByOrderID(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if err := db.Where("order_id = ?", id).Find(&entity.AddOnDetail{}); err.RowsAffected == 0 {

		c.JSON(http.StatusNotFound, gin.H{"message": "Failed to delete AddOn"})
		return
	}

	if err := db.Where("order_id = ?", id).Delete(&entity.AddOnDetail{}); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to delete AddOn"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "delete Addon seccess"})
}

func DeleteOrderDetailByOrderID(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if err := db.Where("order_id = ?", id).Find(&entity.OrderDetail{}); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Not Found"})
		return

	}

	if err := db.Where("order_id = ?", id).Delete(&entity.OrderDetail{}); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to delete OrderDetail"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "delete Orderdetail success"})

}
func DeleteOrderByID(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if err := db.Where("id = ?", id).First(&entity.Order{}); err.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Not Found"})
		return

	}

	if db.Where("id = ?", id).Delete(&entity.Order{}).RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Order deleted successfully",
	})

}
func DeleteImageByOrderID(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var image []entity.Image

	if err := db.Where("order_id = ?", id).Find(&image); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image not found"})
		return
	}

	for _, file := range image {
		if err := os.Remove(fmt.Sprintf("./images/ProfOrder/%s", file.ImagePath)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image file"})
			return
		}
	}

	if err := db.Where("order_id = ?", id).Delete(&entity.Image{}); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete image record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}

func GetOrderbyUserID(c *gin.Context) {
	db := config.DB()
	var orders []entity.Order
	userID := c.Param("id")

	var user entity.User
	db.Where("id = ?", userID).First(&user)
	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	if err := db.Preload("Package").Preload("OrderStatus").Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to fetch orders", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": orders})
}

func GetOrderbyID(c *gin.Context) {
	db := config.DB()
	var orders []entity.Order
	ID := c.Param("id")

	var order entity.Order
	db.Where("id = ?", ID).First(&order)
	if order.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "ID not found"})
		return
	}

	if err := db.Preload("Package").Preload("OrderStatus").Preload("User").Where("id = ?", ID).First(&orders).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to fetch orders", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": orders})
}
func GetEmOrderbyID(c *gin.Context) {
	db := config.DB()
	var orders entity.Order
	ID := c.Param("id")
    
	var order entity.Order
	db.Where("id = ?", ID).First(&order)
	if order.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "ID not found"})
		return
	}

	if err := db.Preload("Package").Preload("OrderStatus").Preload("User").Where("id = ?", ID).First(&orders).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to fetch orders", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": orders})
}

func GetOrderAllOrder(c *gin.Context) {
	db := config.DB()
	var orders []entity.Order
	

	if err := db.Preload("Package").Preload("OrderStatus").Find(&orders).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to fetch orders", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": orders})
}
