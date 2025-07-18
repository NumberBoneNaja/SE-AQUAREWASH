package unit

import (
	"testing"
	"time"

	"example.com/ProjectSeG08/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"fmt"
)

func TestHistoryReward(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`all fields are valid`, func(t *testing.T) {
		historyReward := &entity.HistoryReward{
			State:    "active",
			Barcode:  "123456789",
			RewardID: 3,
			UserID:   9,
			Expire:   time.Now(), // เพิ่มการตั้งค่า Expire
		}
	
		ok, err := govalidator.ValidateStruct(historyReward)
	
		// Expect that the validation is successful and no error occurs
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
		fmt.Println(err)
	})

	t.Run(`state is required`, func(t *testing.T) {
		historyReward := &entity.HistoryReward{
			State:    "",
			Barcode:  "123456789",
			RewardID: 3,
			UserID:   9,
			Expire:   time.Now(), // เพิ่มการตั้งค่า Expire
		}
	
		ok, err := govalidator.ValidateStruct(historyReward)
	
		// Expect that the validation is successful and no error occurs
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("State is required"))
	})

	t.Run(`RewardID is required`, func(t *testing.T) {
		historyReward := &entity.HistoryReward{
			State:    "active",
			Barcode:  "123456789",
			RewardID: 0,
			UserID:   9,
			Expire:   time.Now(), // เพิ่มการตั้งค่า Expire
		}
	
		ok, err := govalidator.ValidateStruct(historyReward)
	
		// Expect that the validation is successful and no error occurs
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("RewardID is required"))
	})

	t.Run(`UserID is required`, func(t *testing.T) {
		historyReward := &entity.HistoryReward{
			State:    "active",
			Barcode:  "123456789",
			RewardID: 5,
			UserID:   0,
			Expire:   time.Now(), // เพิ่มการตั้งค่า Expire
		}
	
		ok, err := govalidator.ValidateStruct(historyReward)
	
		// Expect that the validation is successful and no error occurs
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("UserID is required"))
	})


	
}