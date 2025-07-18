package unit

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"example.com/ProjectSeG08/entity"
)

func init() {
	govalidator.CustomTypeTagMap.Set("future", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		t, ok := i.(time.Time)
		if !ok {
			return false
		}
		return t.After(time.Now())
	}))
}

func TestReportDetailFields(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Description is required`, func(t *testing.T) {
		report := entity.ReportDetail{
			Description: "", // ผิดตรงนี้
			Image:       "https://example.com/image.png",
			ReportDate:  time.Now(),
			ReportID:    1,
		}

		ok, err := govalidator.ValidateStruct(report)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Description is required"))
	})

	t.Run(`Image is required`, func(t *testing.T) {
		report := entity.ReportDetail{
			Description: "This is a report description.",
			Image:       "", // ผิดตรงนี้
			ReportDate:  time.Now(),
			ReportID:    1,
		}

		ok, err := govalidator.ValidateStruct(report)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Image is required"))
	})

}

func TestReportDetailReportID(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`ReportID is required`, func(t *testing.T) {
		report := entity.ReportDetail{
			Description: "This is a report description.",
			Image:       "https://example.com/image.png",
			ReportDate:  time.Now(),
			ReportID:    0, // ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(report)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("ReportID is required"))
	})
}

func TestReportResultValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Status is required", func(t *testing.T) {
		reportResult := entity.ReportResult{
			Status:     "", // ผิดตรงนี้
			ReportID:   1,
			AccepterID: 1,
		}

		ok, err := govalidator.ValidateStruct(reportResult)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Status is required"))
	})

	t.Run("ReportID is required", func(t *testing.T) {
		reportResult := entity.ReportResult{
			Status:     "Pending",
			ReportID:   0, // ผิดตรงนี้
			AccepterID: 1,
		}

		ok, err := govalidator.ValidateStruct(reportResult)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("ReportID is required"))
	})

	t.Run("AccepterID is required", func(t *testing.T) {
		reportResult := entity.ReportResult{
			Status:     "Pending",
			ReportID:   1,
			AccepterID: 0, // ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(reportResult)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("AccepterID is required"))
	})

	t.Run("Valid ReportResult", func(t *testing.T) {
		reportResult := entity.ReportResult{
			Status:     "Pending",
			ReportID:   1,
			AccepterID: 1,
		}

		ok, err := govalidator.ValidateStruct(reportResult)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}