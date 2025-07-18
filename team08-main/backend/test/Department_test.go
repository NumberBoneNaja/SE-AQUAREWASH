package unit

import (
	"testing"

	"example.com/ProjectSeG08/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestDepartment(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Name is required", func(t *testing.T) {
		department := entity.Department{
			Name:    "",
			Explain: "Employee",
		}

		ok, err := govalidator.ValidateStruct(department)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Name is required"))
	})

	t.Run("Explain is required", func(t *testing.T) {
		department := entity.Department{
			Name:    "HR",
			Explain: "",
		}

		ok, err := govalidator.ValidateStruct(department)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Explain is required"))
	})

	t.Run("All fields valid should pass", func(t *testing.T) {
		department := entity.Department{
			Name:    "HR",
			Explain: "Manage Human",
		}

		ok, err := govalidator.ValidateStruct(department)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
