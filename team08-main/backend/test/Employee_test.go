package unit

import (
	
	"testing"

	"example.com/ProjectSeG08/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestEmployee(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("UserID is required", func(t *testing.T) {
		employee := entity.Employee{
			UserID:     0, //ผิด
			JobID:      2,
			Saraly:     120000,
			TimeOffing: 0,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("UserID is required"))
	})

	t.Run("Job title is required", func(t *testing.T) {
		employee := entity.Employee{
			UserID:     1,
			JobID:      0,
			Saraly:     120000,
			TimeOffing: 0,
		}

		ok, err := govalidator.ValidateStruct(employee)
	
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Job is required"))
	})

	t.Run("Salary is required", func(t *testing.T) {
		employee := entity.Employee{
			UserID:     1,
			JobID:      2,
			Saraly:     0, //ผิด
			TimeOffing: 0,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Salary is required"))
	})

	t.Run("Time off days must be between 0 and 365", func(t *testing.T) {
		employee := entity.Employee{
			UserID:     1,
			JobID:      2,
			Saraly:     12000,
			TimeOffing: 366, //ผิด

		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Time off days must be between 0 and 365"))
	})

	t.Run("Saraly must be positive", func(t *testing.T) {
		employee := entity.Employee{
			UserID:     1,
			JobID:      2,
			Saraly:     -12000, //ผิด
			TimeOffing: 20,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Saraly must be positive"))
	})

	t.Run("TimeOffing must be positive", func(t *testing.T) {
		employee := entity.Employee{
			UserID:     1,
			JobID:      2,
			Saraly:     12000,
			TimeOffing: -20, //ผิด

		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("TimeOffing must be positive"))
	})

	t.Run("All fields valid should pass", func(t *testing.T) {
		employee := entity.Employee{
			UserID:     1,
			JobID:      2,
			Saraly:     12000,
			TimeOffing: 20,
		}

		ok, err := govalidator.ValidateStruct(employee)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

}
