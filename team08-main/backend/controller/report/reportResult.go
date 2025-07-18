package report

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
)

// GetAllReportResults - ดึงข้อมูลผลรายงานทั้งหมด
func GetAllReportResults(c *gin.Context) {
	var reportResults []entity.ReportResult
	db := config.DB()

	results := db.Preload("Report").Preload("Accepter").Find(&reportResults)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, reportResults)
}

// UpdateReportResult - อัปเดตผลรายงานตาม ID
func UpdateReportResult(c *gin.Context) {
	ID := c.Param("id")
	var reportResult entity.ReportResult
	db := config.DB()

	result := db.First(&reportResult, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&reportResult); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	if result := db.Save(&reportResult); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Report result updated successfully"})
}

// DeleteReportResult - ลบผลรายงานตาม ID
func DeleteReportResult(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.ReportResult{}, ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Report result deleted successfully"})
}

func CreateReportResult(c *gin.Context) {
	var report entity.ReportResult
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

// GetReportResultByReportID - ดึงข้อมูลผลรายงานตาม ReportID
func GetReportResultByReportID(c *gin.Context) {
	reportID := c.Param("report_id") // รับ ReportID จาก URL พารามิเตอร์
	var reportResults []entity.ReportResult
	db := config.DB()

	// ค้นหาข้อมูลผลรายงานที่เกี่ยวข้องกับ ReportID
	results := db.Preload("Report").Preload("Accepter").Where("report_id = ?", reportID).Find(&reportResults)
	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	if len(reportResults) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No report results found for this report"})
		return
	}

	c.JSON(http.StatusOK, reportResults)
}

func UpdateReportResultByReportID(c *gin.Context) {
	reportID := c.Param("report_id") // รับ ReportID จาก URL พารามิเตอร์
	var reportResult entity.ReportResult
	db := config.DB()

	// ตรวจสอบว่า ReportResult ที่เกี่ยวข้องกับ ReportID มีอยู่หรือไม่
	result := db.Where("report_id = ?", reportID).First(&reportResult)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Report result not found"})
		return
	}

	// ผูกข้อมูลจาก JSON กับโครงสร้างข้อมูล ReportResult
	if err := c.ShouldBindJSON(&reportResult); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	// บันทึกข้อมูลที่ถูกแก้ไขกลับไปยังฐานข้อมูล
	if saveResult := db.Save(&reportResult); saveResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": saveResult.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Report result updated successfully"})
}