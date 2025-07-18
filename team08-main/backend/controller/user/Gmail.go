package user

import (
	//"encoding/json"
	"log"
	"net/http"
	"net/smtp"

	"github.com/gin-gonic/gin"
)

type EmailRequest struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}


func sendEmail(to, subject, message string) error {
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	email := "shoppingmallse13@gmail.com"       
	password := "erei bhtw ljxj gzjs"       

	auth := smtp.PlainAuth("", email, password, smtpHost)

	msg := []byte("Subject: " + subject + "\r\n" +
		"\r\n" +
		message + "\r\n")

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, email, []string{to}, msg)
	if err != nil {
		return err
	}
	return nil
}

// ฟังก์ชัน Handler สำหรับรับคำขอส่งอีเมล
func SendEmailHandler(c *gin.Context) {
	var req EmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// เรียกใช้ฟังก์ชันส่งอีเมล
	err := sendEmail(req.To, req.Subject, req.Message)
	if err != nil {
		log.Println("Error sending email:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}
