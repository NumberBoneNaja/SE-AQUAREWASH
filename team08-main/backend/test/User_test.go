package unit

import (
	"testing"

	"example.com/ProjectSeG08/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestUser(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("UserName is required", func(t *testing.T) {
		user := entity.User{
			UserName:  "", // ผิด
			Password:  "12345",
			Email:     "test@example.com",
			Point:     100,
			FirstName: "PPPP",
			LastName:  "Doe",
			Age:       25,
			Tel:       "0812345678",
			Status:    "User",
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("UserName is required"))
	})

	t.Run("Password is required", func(t *testing.T) {
		user := entity.User{
			UserName:  "Jonh",
			Password:  "", // ผิด
			Email:     "test@example.com",
			Point:     100,
			FirstName: "PPPP",
			LastName:  "Doe",
			Age:       25,
			Tel:       "0812345678",
			Status:    "User",
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Password is required"))
	})

	t.Run("Email is required", func(t *testing.T) {
		user := entity.User{
			UserName:  "Jonh",
			Password:  "1234",
			Email:     "", // ผิด
			Point:     100,
			FirstName: "PPPP",
			LastName:  "Doe",
			Age:       25,
			Tel:       "0812345678",
			Status:    "User",
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Email is required"))
	})

	t.Run("Point must be in valid range", func(t *testing.T) {
		user := entity.User{
			UserName:  "testuser",
			Password:  "12345",
			Email:     "test@example.com",
			Point:     1000000, // ผิด
			FirstName: "John",
			LastName:  "Doe",
			Age:       25,
			Tel:       "0812345678",
			Status:    "User",
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Point must be between 0 and 999999"))
	})

	// Test Age Range
	t.Run("Age must be between 0 and 150", func(t *testing.T) {
		user := entity.User{
			UserName:  "testuser",
			Password:  "12345",
			Email:     "test@example.com",
			Point:     120,
			FirstName: "John",
			LastName:  "Doe",
			Age:       151, // ผิด
			Tel:       "0812345678",
			Status:    "User",
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Age must be between 0 and 150"))
	})

	// Test Telephone Format
	t.Run("Telephone must be in correct format", func(t *testing.T) {
		user := entity.User{
			UserName:  "testuser",
			Password:  "12345",
			Email:     "test@example.com",
			Point:     129,
			FirstName: "John",
			LastName:  "Doe",
			Age:       25,
			Tel:       "1234567890", // ผิด
			Status:    "User",
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Tel must be in format 0xxxxxxxxx"))
	})

	// Test Valid User
	t.Run("All fields valid should pass", func(t *testing.T) {
		user := entity.User{
			UserName:  "testuser",
			Password:  "12345",
			Email:     "test@example.com",
			Point:     100,
			FirstName: "John",
			LastName:  "Doe",
			Age:       25,
			Tel:       "0812345678",
			Status:    "User",
		}

		ok, err := govalidator.ValidateStruct(user)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

}
