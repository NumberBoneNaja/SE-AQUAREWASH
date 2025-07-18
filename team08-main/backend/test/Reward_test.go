package unit

import (
	"testing"
	"time"

	"example.com/ProjectSeG08/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// Duplicate function removed

func TestPoint(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`Point is required`, func(t *testing.T) {
		reward := entity.Reward{
			Point:        0, // ผิดตรงนี้
			Name:         "Reward1",
			RewardTypeID: 1,
			Discount:     10.0,
			Limit:        10,
			Starttime:    time.Now(),
			Endtime:      time.Now(),
			ImagePath:    "reward1.jpg",
			IsActive:     true,
		}

		ok, err := govalidator.ValidateStruct(reward)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Point is required"))
	})

}

func TestRewardAllValid(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Valid Reward`, func(t *testing.T) {
		reward := entity.Reward{
			Point:        100,
			Name:         "Reward1",
			RewardTypeID: 1,
			Discount:     10.0,
			Limit:        10,
			Starttime:    time.Now(),
			Endtime:      time.Now(),
			ImagePath:    "reward1.jpg",
			IsActive:     true,
		}

		ok, err := govalidator.ValidateStruct(reward)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

}

func TestName(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`name is valid`, func(t *testing.T) {
		reward := entity.Reward{
			Point:        100,
			Name:         "jo", //ผิดตรงนี้
			RewardTypeID: 1,
			Discount:     10.0,
			Limit:        10,
			Starttime:    time.Now(),
			Endtime:      time.Now(),
			ImagePath:    "reward1.jpg",
			IsActive:     true,
		}

		ok, err := govalidator.ValidateStruct(reward)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run(`name is required`, func(t *testing.T) {
		reward := entity.Reward{
			Point:        100,
			Name:         "", //ผิดตรงนี้
			RewardTypeID: 1,
			Discount:     10.0,
			Limit:        10,
			Starttime:    time.Now(),
			Endtime:      time.Now(),
			ImagePath:    "reward1.jpg",
			IsActive:     true,
		}

		ok, err := govalidator.ValidateStruct(reward)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Name is required"))
	})

}

func TestRewardTypeID(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`invalid RewardTypeID`, func(t *testing.T) {
		reward := entity.Reward{
			Point:        100,
			Name:         "Reward1",
			RewardTypeID: 0, // invalid value
			Discount:     10.0,
			Limit:        10,
			Starttime:    time.Now(),
			Endtime:      time.Now(),
			ImagePath:    "reward1.jpg",
			IsActive:     true,
		}

		ok, err := govalidator.ValidateStruct(reward)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("RewardTypeID is required"))
	})


	t.Run(`invalid RewardTypeID more than 3`, func(t *testing.T) {
		reward := entity.Reward{
			Point:        100,
			Name:         "Reward1",
			RewardTypeID: 4, // Invalid value
			Discount:     10.0,
			Limit:        10,
			Starttime:    time.Now(),
			Endtime:      time.Now(),
			ImagePath:    "reward1.jpg",
			IsActive:     true,
		}

		ok, err := govalidator.ValidateStruct(reward)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("RewardTypeID must be 1 2 or 3"))
	})


}


func TestDiscount(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Discount must be greater than or equal to 0", func(t *testing.T) {
		reward := entity.Reward{
			Point:        100,
			Name:         "Reward1",
			RewardTypeID: 1,
			Discount:     -1, // ผิดตรงนี้, ค่าติดลบ
			Limit:        10,
			Starttime:    time.Now(),
			Endtime:      time.Now(),
			ImagePath:    "reward1.jpg",
			IsActive:     true,
		}

		ok, err := govalidator.ValidateStruct(reward)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Discount must be greater than or equal to 0"))
	})
}


func TestEndtimeGreaterThanStarttime(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Endtime must be after Starttime", func(t *testing.T) {
		startTime := time.Now()
		endTime := startTime.Add(-time.Hour) // ตั้งเวลาสำหรับ Endtime ที่น้อยกว่า Starttime

		reward := entity.Reward{
			Point:        100,
			Name:         "Reward1",
			RewardTypeID: 3,
			Discount:     10.0,
			Limit:        10,
			Starttime:    startTime,
			Endtime:      endTime,
			ImagePath:    "reward1.jpg",
			IsActive:     true,
		}

		ok, err := govalidator.ValidateStruct(reward)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Endtime must be after Starttime"))
	})
	
	

	t.Run("Endtime after Starttime is valid", func(t *testing.T) {
		startTime := time.Now()
		endTime := startTime.Add(time.Hour) // Endtime มากกว่า Starttime (valid case)

		reward := entity.Reward{
			Point:        100,
			Name:         "Reward1",
			RewardTypeID: 3,
			Discount:     10.0,
			Limit:        10,
			Starttime:    startTime,
			Endtime:      endTime,
			ImagePath:    "reward1.jpg",
			IsActive:     true,
		}

		ok, err := govalidator.ValidateStruct(reward)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}


func TestIsActive(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`Point is required`, func(t *testing.T) {
		reward := entity.Reward{
			Point:        0, // ผิดตรงนี้
			Name:         "Reward1",
			RewardTypeID: 1,
			Discount:     10.0,
			Limit:        10,
			Starttime:    time.Now(),
			Endtime:      time.Now(),
			ImagePath:    "reward1.jpg",
			IsActive:     true,
		}

		ok, err := govalidator.ValidateStruct(reward)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Point is required"))
	})

}

