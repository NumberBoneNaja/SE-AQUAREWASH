package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"example.com/ProjectSeG08/entity"
)

func TestPackPass(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`valid`, func(t *testing.T) {
		packages := entity.Package{
			PackageName: "ซักชุดสูท", 
			Explain: "เหมาะสำหรับชุดสูท",
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(packages)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}


func TestPackName(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`PackageName is required`, func(t *testing.T) {
		packages := entity.Package{
			PackageName: "", 
			Explain: "เหมาะสำหรับชุดสูท",
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(packages)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("PackageName is required"))
	})
}

func TestPackDesc(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`Description is required`, func(t *testing.T) {
		packages := entity.Package{
			PackageName: "ซักชุดสูท", 
			Explain: "",
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(packages)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Description is required"))
	})
}
