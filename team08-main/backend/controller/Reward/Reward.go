package controller

import (
	"log"
	"net/http"
	"time"

	"example.com/ProjectSeG08/config"
	"example.com/ProjectSeG08/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetHistoryRewardByUserID(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var historyRewards []entity.HistoryReward

	err := db.Preload("Reward").Preload("Reward.RewardType").Where("user_id = ?", id).Find(&historyRewards).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to fetch history rewards", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, historyRewards)
}





func GetRewardByRewardID(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var reward entity.Reward

	err := db.Preload("RewardType").Where("id = ?", id).First(&reward).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to fetch reward", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, reward)
}

// Using join
// func GetHistoryRewardJoinUserID(c *gin.Context) {
// 	id := c.Param("id")
// 	db := config.DB()
// 	var historyRewards []entity.HistoryReward

// 	err := db.Table("history_rewards").
// 		Select("rewards.*").
// 		Joins("JOIN rewards ON history_rewards.reward_id = rewards.id").
// 		Joins("JOIN reward_types ON rewards.reward_type_id = reward_types.id").
// 		Where("history_rewards.user_id = ?", id).
// 		Scan(&historyRewards).Error

// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to fetch history rewards with join", "error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, historyRewards)
// }



func GetRewardsWithHistoryByUserID(c *gin.Context) {
	userID := c.Param("id") // Get user ID from the URL parameter
	db := config.DB()

	var results []struct {
		RewardID      uint    `json:"reward_id"`
		RewardName    string  `json:"reward_name"`
		Discount      float32 `json:"discount"`
		RewardPoints  uint    `json:"reward_points"`
		RewardType    string  `json:"reward_type"`
		HistoryState  string  `json:"history_state"`
		HistoryExpire string  `json:"history_expire"`
		UserName      string  `json:"user_name"`
		ImagePath     string  `json:"image_path"`
		Barcode       string  `json:"barcode"`
	}

	err := db.Table("history_rewards").
		Select("history_rewards.id AS reward_id, rewards.name AS reward_name, history_rewards.barcode AS barcode, rewards.point AS reward_points, rewards.discount AS discount, reward_types.type_name AS reward_type, history_rewards.state AS history_state, history_rewards.expire AS history_expire, users.user_name AS user_name, rewards.image_path AS image_path").
		Joins("JOIN rewards ON history_rewards.reward_id = rewards.id").
		Joins("JOIN reward_types ON rewards.reward_type_id = reward_types.id").
		Joins("JOIN users ON history_rewards.user_id = users.id").
		Where("history_rewards.user_id = ? AND history_rewards.expire > DATETIME('now')", userID). // เพิ่มเงื่อนไข reward_types.id
		Scan(&results).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch rewards and history", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}




func GetRewardsBooking(c *gin.Context) {
	userID := c.Param("id") // Get user ID from the URL parameter
	db := config.DB()

	var results []struct {
		RewardID      uint    `json:"reward_id"`
		RewardName    string  `json:"reward_name"`
		Discount      float32 `json:"discount"`
		RewardPoints  uint    `json:"reward_points"`
		RewardType    string  `json:"reward_type"`
		HistoryState  string  `json:"history_state"`
		HistoryExpire string  `json:"history_expire"`
		UserName      string  `json:"user_name"`
		ImagePath     string  `json:"image_path"`
		Barcode       string  `json:"barcode"`
	}

	err := db.Table("history_rewards").
		Select("history_rewards.id AS reward_id, rewards.name AS reward_name, history_rewards.barcode AS barcode, rewards.point AS reward_points, rewards.discount AS discount, reward_types.type_name AS reward_type, history_rewards.state AS history_state, history_rewards.expire AS history_expire, users.user_name AS user_name, rewards.image_path AS image_path").
		Joins("JOIN rewards ON history_rewards.reward_id = rewards.id").
		Joins("JOIN reward_types ON rewards.reward_type_id = reward_types.id").
		Joins("JOIN users ON history_rewards.user_id = users.id").
		Where("history_rewards.user_id = ? AND history_rewards.expire > DATETIME('now') AND reward_types.id IN (?, ?) AND history_rewards.state = 'claimed'", userID, 1, 2, "claimed"). // เพิ่มเงื่อนไข reward_types.id IN (1, 2)
		Scan(&results).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch rewards and history", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}







func UpdateHistoryRewardByID(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var historyReward entity.HistoryReward

	// Check if record exists
	err := db.Where("id = ?", id).First(&historyReward).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "History reward not found", "error": err.Error()})
		return
	}


	// Bind JSON body
	if err := c.ShouldBindJSON(&historyReward); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body", "error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(historyReward); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.Save(&historyReward)
	c.JSON(http.StatusOK, gin.H{
		"message": "Update success",
		"data":    historyReward,
	})
}

func DeleteHistoryRewardByID(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// Delete record
	if db.Where("id = ?", id).Delete(&entity.HistoryReward{}).RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "History reward not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delete success"})
}

func DeleteHistoryRewardByState(c *gin.Context) {
	db := config.DB()

	// Delete records by state
	if db.Where("state = ?", "expired").Delete(&entity.HistoryReward{}).RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No expired history rewards found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delete success"})
}

func CreateReward(c *gin.Context) {
	var reward entity.Reward

	// Bind JSON to book struct
	if err := c.ShouldBindJSON(&reward); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save book to database
	db := config.DB()
	if err := db.Create(&reward).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the created book
	c.JSON(http.StatusOK, reward)
}


func GetAllRewards(c *gin.Context) {
    db := config.DB()
    var rewards []entity.Reward

    if err := db.Find(&rewards).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch rewards"})
        return
    }

    c.JSON(http.StatusOK, rewards) // ส่งข้อมูลรางวัลกลับ
}


func DeleteReward(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// ลบข้อมูลหนังสือตาม ID
	if tx := db.Exec("DELETE FROM rewards WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}



func UpdateReward(c *gin.Context) {
    var rewards entity.Reward

    ID := c.Param("id")
    db := config.DB()

    // ค้นหา Reward ตาม ID
    result := db.First(&rewards, ID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Reward not found"})
        return
    }

    // อ่าน JSON payload และตรวจสอบความถูกต้อง
    if err := c.ShouldBindJSON(&rewards); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
        return
    }
	if _, err := govalidator.ValidateStruct(rewards); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    // อัปเดตข้อมูล RewardTypeID และฟิลด์อื่น ๆ
    result = db.Model(&rewards).Updates(map[string]interface{}{
        "Name":         rewards.Name,
        "Point":        rewards.Point,
		"Limit":        rewards.Limit,
        "Discount":     rewards.Discount,
		"IsActive":     rewards.IsActive,
        "ImagePath":    rewards.ImagePath,
		"Starttime":    rewards.Starttime,
		"Endtime":      rewards.Endtime,
        "RewardTypeID": rewards.RewardTypeID, // อัปเดต RewardTypeID
    })

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update reward"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Reward updated successfully"})
}


func UpdateRewardStatusByCron(db *gorm.DB) {
	now := time.Now()

	// เปิดใช้งานโค้ดตาม StartTime
	result := db.Model(&entity.Reward{}).
		Where("starttime <= ? AND endtime > ? AND is_active = ?", now, now, false).
		Update("IsActive", true)
	log.Printf("Activated rewards: %d rows affected", result.RowsAffected)

	// ปิดใช้งานโค้ดตาม EndTime
	result = db.Model(&entity.Reward{}).
		Where("endtime <= ? AND is_active = ?", now, true).
		Update("is_active", false)
	log.Printf("Deactivated rewards: %d rows affected", result.RowsAffected)
}



func GetActiveReward(c *gin.Context) {
    db := config.DB() // เชื่อมต่อ Database
    if db == nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection is nil"})
        return
    }

    var rewards []entity.Reward
    if err := db.Where("is_active = ?", true).Find(&rewards).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if len(rewards) == 0 {
        c.JSON(http.StatusNoContent, gin.H{"message": "No active rewards found"})
        return
    }

    c.JSON(http.StatusOK, rewards) // ส่งข้อมูล Rewards กลับไปในรูปแบบ JSON
}


func CreateHistoryReward(c *gin.Context) {
    var historyReward entity.HistoryReward
    if err := c.ShouldBindJSON(&historyReward); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    // Check if the user already has this reward
    var existingHistory entity.HistoryReward
    if err := db.Where("user_id = ? AND reward_id = ?", historyReward.UserID, historyReward.RewardID).First(&existingHistory).Error; err == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "User already has this reward"})
        return
    }

    // Create the history reward
    if err := db.Create(&historyReward).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, historyReward)
}



// func GetClaimedRewards(c *gin.Context) {
//     userID := c.Param("userId")
//     var claimedRewards []entity.HistoryReward

//     db := config.DB()
//     if err := db.Where("user_id = ?", userID).Find(&claimedRewards).Error; err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch claimed rewards"})
//         return
//     }

//     c.JSON(http.StatusOK, claimedRewards)
// }

func CheckRewardClaimed(c *gin.Context) {
    userID := c.Param("userId") // รับ user_id จากพารามิเตอร์ URL
    rewardID := c.Param("rewardId") // รับ reward_id จากพารามิเตอร์ URL

    db := config.DB()
    var historyReward entity.HistoryReward

    // ค้นหาในตาราง history_rewards
    result := db.Where("user_id = ? AND reward_id = ?", userID, rewardID).First(&historyReward)
    if result.RowsAffected == 0 {
        // กรณีไม่พบข้อมูล
        // c.JSON(http.StatusOK, gin.H{"claimed": false})
        return
    } else if result.Error != nil {
        // กรณีเกิดข้อผิดพลาด
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    // ถ้าพบข้อมูลแสดงว่าผู้ใช้ได้แลกรางวัลนี้แล้ว
    c.JSON(http.StatusOK, gin.H{"claimed": true})
}

func UsedRewardByBarcode(c *gin.Context) {
    barcode := c.Param("barcode")
    db := config.DB()

    // อัปเดตสถานะ state = "used"
    if tx := db.Model(&entity.HistoryReward{}).Where("barcode = ?", barcode).Update("state", "used"); tx.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "State updated to 'used' successfully"})
}



// func DeleteRewardByBarcode(c *gin.Context) {
// 	barcode := c.Param("barcode")
// 	db := config.DB()

// 	// ลบข้อมูลหนังสือตาม ID
// 	if tx := db.Exec("DELETE FROM history_rewards WHERE barcode = ?", barcode); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
// }



