package controller

import (
	// "fmt"
	"bytes"
	"image"
	"log"
	"net/http"
	"strconv"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
	"github.com/makiuchi-d/gozxing"

	_ "image/gif"  // รองรับ GIF
	_ "image/jpeg" // รองรับ JPEG
	"image/png"
	_ "image/png" // รองรับ PNG

	"github.com/makiuchi-d/gozxing/qrcode"
	_ "golang.org/x/image/webp" // รองรับ WebP
)

func CreatePayment(c *gin.Context) {
	db := config.DB()
	var payment entity.Payment

	// Parse JSON body
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body", "error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the Order exists
	var order entity.Order
	db.Where("id = ?", payment.OrderID).First(&order)
	if order.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Order not found"})
		return
	}

	// Create payment record
	if err := db.Create(&payment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to create payment", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    payment,
	})
}
func CreatePaymentFromBooking(c *gin.Context) {
	db := config.DB()
	var payment entity.Payment

	// Parse JSON body
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body", "error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}


	// Check if the Order exists
	// var book entity.Books
	// db.Where("id = ?", payment.OrderID).First(&book)
	// if book.ID == 0 {
	// 	c.JSON(http.StatusNotFound, gin.H{"message": "Booking not found"})
	// 	return
	// }

	// Create payment record
	if err := db.Create(&payment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to create payment", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    payment,
	})
}


func UpdateStatusPaymentByID(c *gin.Context) {
	// Convert ID from URL parameter to int
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid Order ID", "error": err.Error()})
		return
	}

	db := config.DB()
	var payment entity.Payment

	// Check if payment exists for the given Order ID
	if err := db.Where("id = ?", id).First(&payment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Payment not found"})
		return
	}

	// Update payment details
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body", "error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}


	db.Save(&payment)
	c.JSON(http.StatusOK, gin.H{
		"message": "Update success",
		"data":    payment,
	})
}

func GetAddOnDetailByOrderID(c *gin.Context) {
	// Convert ID from URL parameter to int
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid Order ID", "error": err.Error()})
		return
	}

	db := config.DB()
	var addOnDetails []entity.AddOnDetail

	// Find AddOnDetails by Order ID
	if err := db.Preload("AddOn").Where("order_id = ?", id).Find(&addOnDetails).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to fetch AddOn details", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    addOnDetails,
	})
}

func GetClothDetailByOrderID(c *gin.Context) {
	// Convert ID from URL parameter to int
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid Order ID", "error": err.Error()})
		return
	}

	db := config.DB()
	var orderDetails []entity.OrderDetail

	// Find OrderDetails by Order ID
	if err := db.Preload("ClothType").Where("order_id = ?", id).Find(&orderDetails).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to fetch Order details", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    orderDetails,
	})
}

func GetPaymentByID(c *gin.Context) {
	// Convert ID from URL parameter to int
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid Order ID", "error": err.Error()})
		return
	}

	db := config.DB()
	var payment entity.Payment

	// Find Payment by Order ID
	if err := db.Where("id = ?", id).First(&payment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Payment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    payment,
	})
}

func ProxyQR(c *gin.Context) {
	acctoken := c.GetHeader("Authorization") // ดึง Header Authorization
	body, err := c.GetRawData()              // ดึง request body จาก frontend
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body"})
		return
	}

	log.Println("Received data from frontend:", string(body))

	client := resty.New()

	// ทำการส่ง request ไปยัง SCB API
	resp, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetHeader("Authorization", acctoken).
		SetHeader("resourceOwnerId", "l72ed2137c85724b61be9eee4dcef83734").
		SetHeader("requestUId", "28dae489-3a4b-4ea1-8995-7488cff1826b").
		SetBody(body).
		Post("https://api-sandbox.partners.scb/partners/sandbox/v1/payment/qrcode/create")

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	// ส่ง response กลับไปยัง frontend โดยใช้ status code และ body จาก SCB API
	c.Data(resp.StatusCode(), "application/json", resp.Body())
}
func ProxyCheckStatusPayment(c *gin.Context) {
	transactionID := c.Param("transactionID")  // ดึง transactionID จาก URL params
	accessToken := c.GetHeader("Authorization")
	requestUId := c.GetHeader("requestUId")
	resourceOwnerId := c.GetHeader("resourceOwnerId")

	log.Println("Received Authorization:", accessToken)
	log.Println("Received requestUId:", requestUId)
	log.Println("Received resourceOwnerId:", resourceOwnerId)

	client := resty.New()

	// ส่ง request ไปยัง SCB API เพื่อเช็คสถานะการชำระเงิน
	resp, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetHeader("Authorization", accessToken).
		SetHeader("requestUId", "28dae489-3a4b-4ea1-8995-7488cff1826b").
		SetHeader("resourceOwnerId", "l72ed2137c85724b61be9eee4dcef83734").
		Get(`https://api-sandbox.partners.scb/partners/sandbox/v1/payment/billpayment/transactions/` + transactionID + `?sendingBank=014`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	// ส่ง response กลับไปยัง frontend พร้อม status code และ body จาก SCB API
	c.Data(resp.StatusCode(), "application/json", resp.Body())
}

// cancel payment
func CancelPaymetByID(c *gin.Context) {
	id := c.Param("id")
	var payment entity.Payment
	db := config.DB()

	if err := db.Where("id = ?", id).First(&payment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Payment not found"})
		return
	}

	if err := db.Where("id = ?", id).Delete(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete payment"})
		return
	}	

	c.JSON(http.StatusOK, gin.H{"message": "Payment deleted successfully"})
	
}


// อ่าน raw data qr code


func DecodeQR(c *gin.Context) {
    // ดึงไฟล์จากคำขอ
    fileHeader, err := c.FormFile("slip")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read file"})
        return
    }

    // เปิดไฟล์
    file, err := fileHeader.Open()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
        return
    }
    defer file.Close()

    // ถอดรหัสภาพ
    img, format, err := image.Decode(file)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding image", "details": err.Error()})
        return
    }

    // ตรวจสอบและแปลงเป็น PNG ถ้าจำเป็น
    var buf bytes.Buffer
    if format != "png" {
        // แปลงเป็น PNG
        err = png.Encode(&buf, img)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to convert image to PNG"})
            return
        }
    } else {
        // ถ้าเป็น PNG อยู่แล้ว ใช้ไฟล์ต้นฉบับ
        err = png.Encode(&buf, img)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to copy PNG image"})
            return
        }
    }

    // สร้าง BinaryBitmap
    pngImg, _, err := image.Decode(&buf)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding PNG image"})
        return
    }
    bmp, err := gozxing.NewBinaryBitmapFromImage(pngImg)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating binary bitmap"})
        return
    }

    // ถอดรหัส QR Code เป็น Raw Data
    reader := qrcode.NewQRCodeReader()
    result, err := reader.Decode(bmp, nil)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding QR Code"})
        return
    }

    // ส่ง Raw Data กลับไปใน JSON
    c.JSON(http.StatusOK, gin.H{"rawdata": result.String()})
}

func PatchOrderByID(c *gin.Context) {
	// Convert ID from URL parameter to int
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid Order ID", "error": err.Error()})
		return
	}

	db := config.DB()
	var order entity.Order


	if err := db.Where("id = ?", id).First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Payment not found"})
		return
	}


	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body", "error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.Save(&order)
	c.JSON(http.StatusOK, gin.H{
		"message": "Update success",
		"data":    order,
	})
}
func FindID(c *gin.Context) {
	// Convert ID from URL parameter to int
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid Order ID", "error": err.Error()})
		return
	}

	db := config.DB()
	var payment entity.Payment

	// Find Payment by Order ID
	if err := db.Where("order_id = ?", id).First(&payment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Payment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    payment,
	})
}