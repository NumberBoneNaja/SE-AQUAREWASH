package report

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
)

// GetAllReportDetails - ดึงข้อมูลรายละเอียดรายงานทั้งหมด
func GetAllReportDetails(c *gin.Context) {
	var reportDetails []entity.ReportDetail
	db := config.DB()

	results := db.Preload("Report").Find(&reportDetails)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, reportDetails)
}

// CreateReportDetail - สร้างรายละเอียดรายงานใหม่
func CreateReportDetail(c *gin.Context) {
	var reportDetail entity.ReportDetail
	db := config.DB()

	if err := c.ShouldBindJSON(&reportDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	if result := db.Create(&reportDetail); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Report detail created successfully"})
}

// DeleteReportDetail - ลบรายละเอียดรายงานตาม ID
func DeleteReportDetail(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.ReportDetail{}, ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Report detail deleted successfully"})
}

// GetReportDetailByReportID - ดึงข้อมูลรายละเอียดรายงานตาม ReportID
func GetReportDetailByReportID(c *gin.Context) {
	reportID := c.Param("report_id") // รับ ReportID จาก URL พารามิเตอร์
	var reportDetails []entity.ReportDetail
	db := config.DB()

	// ค้นหาข้อมูลรายละเอียดรายงานที่เกี่ยวข้องกับ ReportID
	results := db.Preload("Report").Where("report_id = ?", reportID).Find(&reportDetails)
	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	if len(reportDetails) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No report details found for this report"})
		return
	}

	c.JSON(http.StatusOK, reportDetails)
}
