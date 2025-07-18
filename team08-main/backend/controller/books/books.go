package books

import (
	"net/http"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"
)

// GetAllBooks - ดึงข้อมูลหนังสือทั้งหมด
func GetAllBooks(c *gin.Context) {
	var books []entity.Books

	db := config.DB()

	// ดึงข้อมูลทั้งหมดจากตาราง books
	results := db.Find(&books)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, books)
}

func GetBooks(c *gin.Context) {
	ID := c.Param("id")
	var books entity.Books

	db := config.DB()

	// ค้นหาหนังสือตาม ID
	results := db.First(&books, ID)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if books.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	c.JSON(http.StatusOK, books)
}

// UpdateBook - อัปเดตข้อมูลหนังสือตาม ID
func UpdateBooks(c *gin.Context) {
	var book entity.Books

	BookID := c.Param("id")

	db := config.DB()

	// ค้นหาหนังสือตาม ID
	result := db.First(&book, BookID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	// อ่านข้อมูล JSON จาก payload และทำการแมปกับ book struct
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// บันทึกข้อมูลที่อัปเดตกลับไปยังฐานข้อมูล
	result = db.Save(&book)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DeleteBook - ลบข้อมูลหนังสือตาม ID
func DeleteBooks(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// ลบข้อมูลหนังสือตาม ID
	if tx := db.Exec("DELETE FROM books WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

func CreateBooks(c *gin.Context) {
	var book entity.Books

	// Bind JSON to book struct
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save book to database
	db := config.DB()
	if err := db.Create(&book).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the created book
	c.JSON(http.StatusOK, book)
}

func GetLastBooks(c *gin.Context) {
    var book entity.Books

    db := config.DB()

    // ค้นหาหนังสือที่มี ID ล่าสุด (เรียงลำดับ DESC และจำกัดแค่ 1 รายการ)
    results := db.Order("ID DESC").First(&book)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    if book.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }

    // ส่งข้อมูลหนังสือล่าสุดกลับไป
    c.JSON(http.StatusOK, book)
}

func UpdateBookStatus(c *gin.Context) {
	var book entity.Books

	BookID := c.Param("id")

	db := config.DB()

	// ค้นหาหนังสือตาม ID
	result := db.First(&book, BookID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ID not found"})
		return
	}

	// อัปเดตฟิลด์ status ของหนังสือเป็น "เสร็จสิ้น"
	book.Status = "เสร็จสิ้น"

	// บันทึกข้อมูลที่อัปเดตกลับไปยังฐานข้อมูล
	if err := db.Save(&book).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update book status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully", "book": book})
}
