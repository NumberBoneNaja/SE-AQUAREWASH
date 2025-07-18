package unit

import (
	"testing"
	"time"

	"example.com/ProjectSeG08/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ฟังก์ชันสำหรับตรวจสอบวันที่ในอนาคต
func init() {
	govalidator.CustomTypeTagMap.Set("future", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		t, ok := i.(time.Time)
		if !ok {
			return false
		}
		return t.After(time.Now())
	}))
}

// Test MembershipPayment
func TestMembershipPayment(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("UserID is required", func(t *testing.T) {
		payment := entity.MembershipPayment{
			UserID:              0, // ผิด
			PackageMembershipID: 1,
			PaymentMethod:       "Credit Card",
			DateStart:           time.Now(),
			DateEnd:             time.Now().Add(24 * time.Hour),
			PicPayment:          "payment.jpg",
			Status:              "Processing",
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("UserID is required"))
	})

	t.Run("PaymentMethod is required", func(t *testing.T) {
		payment := entity.MembershipPayment{
			UserID:              1,
			PackageMembershipID: 1,
			PaymentMethod:       "", // ผิด
			DateStart:           time.Now(),
			DateEnd:             time.Now().Add(24 * time.Hour),
			PicPayment:          "payment.jpg",
			Status:              "Processing",
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Payment method is required"))
	})

	t.Run("PackageMembershipID is required", func(t *testing.T) {
		payment := entity.MembershipPayment{
			UserID:              1,
			PackageMembershipID: 0, // ผิด
			PaymentMethod:       "Cash",
			DateStart:           time.Now(),
			DateEnd:             time.Now().Add(24 * time.Hour),
			PicPayment:          "payment.jpg",
			Status:              "Processing",
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("PackageMembershipID is required"))
	})

	t.Run("Start date is required", func(t *testing.T) {
		payment := entity.MembershipPayment{
			UserID:              1,
			PackageMembershipID: 1,
			PaymentMethod:       "Cash",
			//DateStart:           time.Time{}, // ผิด
			DateEnd:    time.Now().Add(24 * time.Hour),
			PicPayment: "payment.jpg",
			Status:     "Processing",
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Start date is required"))
	})

	t.Run("End date is required", func(t *testing.T) {
		payment := entity.MembershipPayment{
			UserID:              1,
			PackageMembershipID: 1,
			PaymentMethod:       "Cash",
			DateStart:           time.Now(),
			//DateEnd:             time.Time{}, // ผิด
			PicPayment: "payment.jpg",
			Status:     "Processing",
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("End date is required"))
	})

	t.Run("End date must be in the future", func(t *testing.T) {
		payment := entity.MembershipPayment{
			UserID:              1,
			PackageMembershipID: 1,
			PaymentMethod:       "Credit Card",
			DateStart:           time.Now(),
			DateEnd:             time.Now().Add(-24 * time.Hour), // ผิด
			PicPayment:          "payment.jpg",
			Status:              "Processing",
		}

		ok, err := govalidator.ValidateStruct(payment)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("End date must be in the future"))
	})

}

// Test PackageMembership
func TestPackageMembership(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Package name is required", func(t *testing.T) {
		pkg := entity.PackageMembership{
			NamePackage: "", // ผิด
			Price:       1000,
			HowLongTime: 30,
			Description: "Test package",
			PicPayment:  "package.jpg",
		}

		ok, err := govalidator.ValidateStruct(pkg)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Package name is required"))
	})

	t.Run("Price is required", func(t *testing.T) {
		pkg := entity.PackageMembership{
			NamePackage: "100 days",
			Price:       0, // ผิด
			HowLongTime: 30,
			Description: "Test package",
			PicPayment:  "package.jpg",
		}

		ok, err := govalidator.ValidateStruct(pkg)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Price is required"))
	})

	t.Run("Duration is required", func(t *testing.T) {
		pkg := entity.PackageMembership{
			NamePackage: "100 days",
			Price:       1000,
			HowLongTime: 0, // ผิด
			Description: "Test package",
			PicPayment:  "package.jpg",
		}

		ok, err := govalidator.ValidateStruct(pkg)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Duration is required"))
	})

}
