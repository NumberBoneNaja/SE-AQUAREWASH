package report

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
)

// GetAllReports - ดึงข้อมูลรายงานทั้งหมด
func GetAllReports(c *gin.Context) {
	var reports []entity.Report
	db := config.DB()

	results := db.Preload("User").Preload("Machine").Find(&reports)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, reports)
}

// GetReport - ดึงข้อมูลรายงานตาม ID
func GetReport(c *gin.Context) {
	ID := c.Param("id")
	var report entity.Report
	db := config.DB()

	results := db.Preload("User").Preload("Machine").First(&report, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, report)
}

// CreateReport - สร้างรายงานใหม่
func CreateReport(c *gin.Context) {
	var report entity.Report
	db := config.DB()

	if err := c.ShouldBindJSON(&report); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	if result := db.Create(&report); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Report created successfully"})
}

// DeleteReport - ลบรายงานตาม ID
func DeleteReport(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.Report{}, ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Report deleted successfully"})
}

func GetLastReport(c *gin.Context) {
    var report entity.Report

    db := config.DB()

    // ค้นหาหนังสือที่มี ID ล่าสุด (เรียงลำดับ DESC และจำกัดแค่ 1 รายการ)
    results := db.Order("ID DESC").First(&report)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    if report.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }

    // ส่งข้อมูลหนังสือล่าสุดกลับไป
    c.JSON(http.StatusOK, report)
}

func GetReportByUserID(c *gin.Context) {
    userID := c.Param("user_id") // รับ UserID จาก URL พารามิเตอร์
    var reports []entity.Report
    db := config.DB()

    // ค้นหาข้อมูลรายงานที่เกี่ยวข้องกับ UserID โดยใช้ Preload เพื่อโหลดข้อมูลผู้ใช้และเครื่อง
    results := db.Preload("User").Preload("Machine").Where("user_id = ?", userID).Find(&reports)
    if results.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        return
    }

    if len(reports) == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "No reports found for this user"})
        return
    }

    c.JSON(http.StatusOK, reports)
}
