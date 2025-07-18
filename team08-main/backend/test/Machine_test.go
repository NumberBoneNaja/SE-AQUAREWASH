package unit

import (
	"fmt"
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"example.com/ProjectSeG08/entity"
)


func TestAllPass(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`valid`, func(t *testing.T) {
		machine := entity.Machine{
			MachineName: "Washer 5", 
			MachineType: "เครื่องซักผ้า",
			Status:  "ว่าง",
			MModel: "LG110",
			Brand:	"LG",
			Capacity: 80,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(machine)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestMachineName(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`MachineName is required`, func(t *testing.T) {
		machine := entity.Machine{
			MachineName: "", //ผิดตรงนี้
			MachineType: "เครื่องซักผ้า",
			Status:  "ว่าง",
			MModel: "LG110",
			Brand:	"LG",
			Capacity: 80,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(machine)
		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).NotTo(BeTrue())
		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).NotTo(BeNil())
		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("MachineName is required"))
	})
}


func TestMachineType(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`MachineType is required`, func(t *testing.T) {
		machine := entity.Machine{
			MachineName: "Washer 33",
			MachineType: "",	//ผิดตรงนี้
			Status:  "ว่าง",
			MModel: "LG110",
			Brand:	"LG",
			Capacity: 80,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(machine)
		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).NotTo(BeTrue())
		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).NotTo(BeNil())
		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("MachineType is required"))
	})

}

func TestMachineStatus(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Status is required`, func(t *testing.T) {
		machine := entity.Machine{
			MachineName: "Washer 33",
			MachineType: "เครื่องซักผ้า",
			Status:  "",	//ผิดตรงนี้
			MModel: "LG110",
			Brand:	"LG",
			Capacity: 80,
		}

		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(machine)
		fmt.Println("Validation error:", err) // Debugging line
		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).NotTo(BeTrue())
		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).NotTo(BeNil())
		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("Status is required"))
	})

}


