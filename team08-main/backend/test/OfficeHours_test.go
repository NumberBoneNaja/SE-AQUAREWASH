package unit

import (
	"testing"
	"time"

	"example.com/ProjectSeG08/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestOfficeHours(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("EmployeeID is required", func(t *testing.T) {
		officehours := entity.OfficeHours{
			EmployeeID: 0, //ผิด
			Checkin:    time.Now(),
			Checkout:   time.Now(),
		}

		ok, err := govalidator.ValidateStruct(officehours)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("EmployeeID is required"))
	})

	t.Run("Checkin is required", func(t *testing.T) {
		officehours := entity.OfficeHours{
			EmployeeID: 1,
			//Checkin: time.Now(), //ผิด
			Checkout: time.Now(),
		}

		ok, err := govalidator.ValidateStruct(officehours)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Checkin is required"))
	})

	t.Run("Checkout is required", func(t *testing.T) {
		officehours := entity.OfficeHours{
			EmployeeID: 1,
			Checkin:    time.Now(),
			//Checkout: time.Now(), //ผิด
		}

		ok, err := govalidator.ValidateStruct(officehours)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Checkout is required"))
	})

	t.Run("All fields valid should pass", func(t *testing.T) {
		officehours := entity.OfficeHours{
			EmployeeID: 1,
			Checkin:    time.Now(),
			Checkout:   time.Now(),
		}

		ok, err := govalidator.ValidateStruct(officehours)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
