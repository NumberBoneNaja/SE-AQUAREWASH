package MembershipPayment

import (
	"fmt"
	"net/http"
	"os"

	// "strconv"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

// GET /PackageMemberships
func ListPackageMemberships(c *gin.Context) {

	var PackageMemberships []entity.PackageMembership

	// Get the database connection
	db := config.DB()

	// ทำการหาโดยค้นจากฐานข้อมูล
	results := db.Select("id,name_package,price,how_long_time,description,pic_payment").Find(&PackageMemberships)

	// Check for errors
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Return
	c.JSON(http.StatusOK, PackageMemberships)
}

func GetPackageMembershipById(c *gin.Context) {
	ID := c.Param("id")
	var PackageMembership entity.PackageMembership

	db := config.DB()

	// ค้นหาตาม ID
	results := db.First(&PackageMembership, ID)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if PackageMembership.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	c.JSON(http.StatusOK, PackageMembership)
}

//========================= อาจจะได้้ใช้ในอนาคต =====================================================
//update
//delete

//==================================== Payment ====================================================

// post
func CreateMembershipPayment(c *gin.Context) {
	var payment entity.MembershipPayment
	db := config.DB()

	// แปลง JSON payload เป็น struct
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่าผู้ใช้ (UserID) มีอยู่ในระบบ
	var user entity.User
	if err := db.First(&user, payment.UserID).Error; err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	// ตรวจสอบว่ามี PackageMembership ที่เกี่ยวข้องหรือไม่
	var packageMembership entity.PackageMembership
	if err := db.First(&packageMembership, payment.PackageMembershipID).Error; err != nil {
		c.JSON(404, gin.H{"error": "Package membership not found"})
		return
	}

	// ตรวจสอบค่า PaymentMethod ว่าเป็นค่าที่รองรับหรือไม่
	// validMethods := []string{"Credit Card", "Bank Transfer", "Cash"}
	// isValidMethod := false
	// for _, method := range validMethods {
	// 	if payment.PaymentMethod == method {
	// 		isValidMethod = true
	// 		break
	// 	}
	// }
	// if !isValidMethod {
	// 	c.JSON(400, gin.H{"error": "Invalid payment method"})
	// 	return
	// }

	// ตั้งค่าค่าเริ่มต้น เช่น สถานะ
	if payment.Status == "" {
		payment.Status = "Processing"
	}

	// บันทึกข้อมูลลงฐานข้อมูล
	if err := db.Create(&payment).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create membership payment"})
		return
	}

	// ส่งข้อมูลที่สร้างสำเร็จกลับไป
	c.JSON(201, payment)
}

// get all
func GetMembershipPayments(c *gin.Context) {
	var payments []entity.MembershipPayment
	db := config.DB()

	if err := db.Preload("User").Preload("PackageMembership").Find(&payments).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to retrieve membership payments"})
		return
	}

	c.JSON(200, payments)
}

// get by id
func GetMembershipPaymentByID(c *gin.Context) {
	id := c.Param("id")
	var payment entity.MembershipPayment
	db := config.DB()

	if err := db.Preload("User").Preload("PackageMembership").First(&payment, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Membership payment not found"})
		return
	}

	c.JSON(200, payment)
}

func GetMembershipPaymentByUserID(c *gin.Context) {
	id := c.Param("id")
	var payment []entity.MembershipPayment
	db := config.DB()

	if err := db.Preload("User").Preload("PackageMembership").Where("user_id = ?", id).Find(&payment).Error; err != nil {
		c.JSON(404, gin.H{"error": "Membership payment not found"})
		return
	}

	c.JSON(200, payment)
}



// Soft Delet and validation
func SoftDeleteMembershipPayment(c *gin.Context) {
	id := c.Param("id")
	var payment []entity.MembershipPayment
	db := config.DB()

	// ตรวจสอบว่าข้อมูลมีอยู่จริง
	if err := db.First(&payment, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Membership payment not found"})
		return
	}

	// Soft Delete
	if err := db.Delete(&payment).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete membership payment"})
		return
	}

	c.JSON(200, gin.H{"message": "Membership payment soft deleted successfully"})
}

func UpdateMembershipPaymentStatus(c *gin.Context) {
	id := c.Param("id")
	var payment entity.MembershipPayment
	db := config.DB()

	// ค้นหา MembershipPayment ด้วย ID
	if err := db.First(&payment, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Membership payment not found"})
		return
	}

	// ตรวจสอบสถานะเดิม
	if payment.Status == "Success" {
		c.JSON(400, gin.H{"error": "Membership payment is already marked as Paid"})
		return
	}

	// เปลี่ยนสถานะเป็น Paid
	payment.Status = "Success"

	// บันทึกข้อมูลใหม่
	if err := db.Save(&payment).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update membership payment status"})
		return
	}

	c.JSON(200, gin.H{"message": "Status updated successfully", "data": payment})
}

//update ปกติ

func UpdateMembershipPayment(c *gin.Context) {
	id := c.Param("id")
	var payment entity.MembershipPayment
	db := config.DB()

	if err := db.First(&payment, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Membership payment not found"})
		return
	}

	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&payment).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update membership payment"})
		return
	}

	c.JSON(200, payment)
}

func RestoreMembershipPayment(c *gin.Context) {
	id := c.Param("id")
	var payment entity.MembershipPayment
	db := config.DB()

	// ตรวจสอบว่ามีข้อมูลที่ถูก Soft Delete
	if err := db.Unscoped().First(&payment, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Membership payment not found or not deleted"})
		return
	}

	// กู้คืนข้อมูลที่ถูกลบ
	if err := db.Unscoped().Model(&payment).Update("deleted_at", nil).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to restore membership payment"})
		return
	}

	c.JSON(200, gin.H{"message": "Membership payment restored successfully"})
}

func GetLast(c *gin.Context) {
	var payment entity.MembershipPayment

	db := config.DB()

	// ค้นหาหนังสือที่มี ID ล่าสุด (เรียงลำดับ DESC และจำกัดแค่ 1 รายการ)
	results := db.Order("ID DESC").First(&payment)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if payment.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	// ส่งข้อมูลหนังสือล่าสุดกลับไป
	c.JSON(http.StatusOK, payment)
}

func GetPaymentMemberByID(c *gin.Context) {
	ID := c.Param("id")
	var payment entity.MembershipPayment
	db := config.DB()

	// ค้นหาตาม ID
	results := db.Preload("PackageMembership").Where("id = ?", ID).First(&payment, ID)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, payment)
}

func UpdateImageByPaymentMemID(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
		return
	}

	uploadDir := "./images/ProfMember"
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
func UpdateNameImageMemberShipping(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var paymentMembership entity.MembershipPayment

	// Check if record exists
	err := db.Where("id = ?", id).First(&paymentMembership).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "History reward not found", "error": err.Error()})
		return
	}

	// Bind JSON body
	if err := c.ShouldBindJSON(&paymentMembership); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body", "error": err.Error()})
		return
	}

	db.Save(&paymentMembership)
	c.JSON(http.StatusOK, gin.H{
		"message": "Update success",
		"data":    paymentMembership,
	})
}

// History

// get all
func GetMembershipPaymentsHistory(c *gin.Context) {
	var payments []entity.MembershipPayment
	db := config.DB()

	if err := db.Preload("User").Preload("PackageMembership").Find(&payments).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to retrieve membership payments"})
		return
	}

	c.JSON(200, payments)
}

// get by id
func GetMembershipPaymentByIDHistory(c *gin.Context) {
	id := c.Param("id")
	var payment entity.HistoryPaymentMembership
	db := config.DB()

	if err := db.Preload("User").Preload("PackageMembership").First(&payment, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Membership payment not found"})
		return
	}

	c.JSON(200, payment)
}

func GetMembershipPaymentByUserIDHistory(c *gin.Context) {
	id := c.Param("id")
	var payment []entity.HistoryPaymentMembership
	db := config.DB()

	if err := db.Preload("User").Preload("PackageMembership").Where("user_id = ?", id).Find(&payment).Error; err != nil {
		c.JSON(404, gin.H{"error": "Membership payment not found"})
		return
	}

	c.JSON(200, payment)
}

// post
func CreateMembershipPaymentHistory(c *gin.Context) {
	var payment entity.HistoryPaymentMembership
	db := config.DB()

	// แปลง JSON payload เป็น struct
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่ามี PackageMembership ที่เกี่ยวข้องหรือไม่
	var packageMembership entity.PackageMembership
	if err := db.First(&packageMembership, payment.PackageMembershipID).Error; err != nil {
		c.JSON(404, gin.H{"error": "Package membership not found"})
		return
	}

	// บันทึกข้อมูลลงฐานข้อมูล
	if err := db.Create(&payment).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create membership payment"})
		return
	}

	// ส่งข้อมูลที่สร้างสำเร็จกลับไป
	c.JSON(201, payment)
}
