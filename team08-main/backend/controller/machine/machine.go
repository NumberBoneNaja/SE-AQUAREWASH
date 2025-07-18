package machine

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/gin-gonic/gin"

	"gorm.io/gorm"
)

// GetAllMachine
func GetAllMachine(c *gin.Context) {

	var machine []entity.Machine

	db := config.DB()
	results := db.Find(&machine)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, machine) //ถ้าการดึงข้อมูลสำเร็จ ฟังก์ชันจะส่ง HTTP 200 (OK)
	//ทำเป็นไฟล์ JSON
}

func CreateMachine(c *gin.Context) {
	var machine entity.Machine

	if err := c.ShouldBindJSON(&machine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	db := config.DB()
	if err := db.Create(&machine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Machine created successfully",
		"data":    machine,
	})
}

func DeleteMachine(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM machines WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Deleted successfully"})
}

// UpdateMachine - Update a machine based on the ID
func UpdateMachine(c *gin.Context) {
	id := c.Param("id") // Get the machine ID from the URL
	var machine entity.Machine
	db := config.DB()

	// Find the existing machine in the database by ID
	if err := db.First(&machine, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Machine not found"})
		return
	}

	// Bind the incoming JSON payload to a temporary struct
	var input entity.Machine
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Detect changes
	changes := make(map[string]interface{})
	if machine.MachineName != input.MachineName {
		changes["machine_name"] = map[string]string{
			"old": machine.MachineName,
			"new": input.MachineName,
		}
	}
	if machine.MachineType != input.MachineType {
		changes["machine_type"] = map[string]string{
			"old": machine.MachineType,
			"new": input.MachineType,
		}
	}
	if machine.Status != input.Status {
		changes["status"] = map[string]string{
			"old": machine.Status,
			"new": input.Status,
		}
	}
	if machine.MModel != input.MModel {
		changes["m_model"] = map[string]string{
			"old": machine.MModel,
			"new": input.MModel,
		}
	}
	if machine.Brand != input.Brand {
		changes["brand"] = map[string]string{
			"old": machine.Brand,
			"new": input.Brand,
		}
	}
	if machine.Capacity != input.Capacity {
		changes["capacity"] = map[string]interface{}{
			"old": machine.Capacity,
			"new": input.Capacity,
		}
	}

	// Update the fields of the found machine with new data
	machine.MachineName = input.MachineName
	machine.MachineType = input.MachineType
	machine.Status = input.Status
	machine.MModel = input.MModel
	machine.Brand = input.Brand
	machine.Capacity = input.Capacity

	// Save the updated machine back to the database
	if err := db.Save(&machine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update machine"})
		return
	}

	changesJSON, err := json.Marshal(changes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal changes"})
		return
	}

	// Create a history entry
	history := entity.MHistory{
		MachineID: machine.ID,
		Action:    "Updated",
		Timestamp: time.Now(),
		Changes:   string(changesJSON),
	}

	if err := db.Create(&history).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create history"})
		return
	}

	// Save the updated machine back to the database
	if err := db.Save(&machine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update machine"})
		return
	}

	// Respond with the updated machine
	c.JSON(http.StatusOK, machine)
}

func UpdateMachineStatusByCron(db *gorm.DB) {
	// Get current time
	now := time.Now()
	log.Println("Cron Job: Checking for machines to update...")

	// Define a struct to hold the result from the query
	var machines []struct {
		MachineID uint   `json:"machine_id"`
		BooksEnd  string `json:"books_end"` // BooksEnd will be stored as string first
	}

	// Query to find the machine with the latest books_end where books status is "เสร็จสิ้น"
	if err := db.Raw(`
        SELECT m.id AS machine_id, MAX(b.books_end) AS books_end
        FROM machines m
        JOIN booking_details bd ON m.id = bd.machine_id
        JOIN books b ON bd.books_id = b.id
        WHERE b.books_end <= ? 
        AND m.status = 'ไม่ว่าง' 
        AND b.status = 'จอง'
        GROUP BY m.id
    `, now).Scan(&machines).Error; err != nil {
		log.Printf("Cron Job: Error fetching machines: %v", err)
		return
	}

	// Log the number of machines found
	log.Printf("Cron Job: Found %d machines to update", len(machines))

	//Update the status of machines to "available" (ว่าง)
	for _, machine := range machines {
		//Parse books_end to time.Time if it is in string format
		// เปลี่ยนรูปแบบการ parse ให้ตรงกับข้อมูลที่ได้รับ
		parsedTime, err := time.Parse("2006-01-02 15:04:05.999-07:00", machine.BooksEnd)
		if err != nil {
			log.Printf("Error parsing books_end for machine ID %d: %v", machine.MachineID, err)
			continue
		}

		log.Printf("Machine ID: %d, Books End: %v", machine.MachineID, parsedTime)

		// Update machine status to "available"
		if err := db.Model(&entity.Machine{}).
			Where("id = ?", machine.MachineID).
			Update("status", "ว่าง").Error; err != nil {
			log.Printf("Cron Job: Error updating machine ID %d: %v", machine.MachineID, err)
			continue
		}
		log.Printf("Cron Job: Machine ID %d updated to 'ว่าง'", machine.MachineID)

		// Update related bookings to "สิ้นสุด"
		if err := db.Model(&entity.Books{}).
			Where("id IN (SELECT bd.books_id FROM booking_details bd WHERE bd.machine_id = ?)", machine.MachineID).
			Update("status", "สิ้นสุด").Error; err != nil {
			log.Printf("Cron Job: Error updating status to 'สิ้นสุด' for books related to machine ID %d: %v", machine.MachineID, err)
		} else {
			log.Printf("Cron Job: Status for books related to machine ID %d updated to 'สิ้นสุด'", machine.MachineID)
		}
	}
}

func CreateMachineTest(c *gin.Context) {
	db := config.DB()

	// เพิ่มข้อมูลตัวอย่าง
	machine := entity.Machine{
		Status: "ไม่ว่าง",
	}

	if err := db.Create(&machine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลที่เพิ่มกลับไปยัง Client
	c.JSON(http.StatusOK, gin.H{
		"message": "Machine created successfully",
		"data":    machine,
	})
}

func GetMachineBookingInfo(c *gin.Context) {
	var bookingInfo []struct {
		MachineID uint   `json:"machine_id"`
		UserName  string `json:"user_name"`
		BooksEnd  string `json:"books_end"`
	}

	// Query to get machine booking information
	db := config.DB()
	if err := db.Raw(`
		SELECT 
			m.id AS machine_id, 
			u.user_name AS user_name, 
			b.books_end AS books_end
		FROM 
			machines m
		JOIN 
			booking_details bd ON m.id = bd.machine_id
		JOIN 
			books b ON bd.books_id = b.id
		JOIN 
			users u ON b.user_id = u.id
		WHERE 
			m.status = 'ไม่ว่าง'
			AND b.books_end = (
				SELECT MAX(b2.books_end)
				FROM books b2
				JOIN booking_details bd2 ON b2.id = bd2.books_id
				WHERE bd2.machine_id = m.id
			)
	
	`, time.Now()).Scan(&bookingInfo).Error; err != nil {
		log.Printf("Error fetching machine booking info: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// If no booking found
	if len(bookingInfo) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No booking found"})
		return
	}

	// Return the booking info
	c.JSON(http.StatusOK, bookingInfo)
}

func UpdateMachineStatus(c *gin.Context) {
	id := c.Param("id") // Get the machine ID from the URL
	var machine entity.Machine
	db := config.DB()

	// Find the existing machine in the database by ID
	if err := db.First(&machine, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Machine not found"})
		return
	}

	// Update only the status field to "ไม่ว่าง"
	machine.Status = "ไม่ว่าง"

	// Save the updated machine back to the database
	if err := db.Save(&machine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update machine status"})
		return
	}

	// Respond with the updated machine
	c.JSON(http.StatusOK, machine)
}
