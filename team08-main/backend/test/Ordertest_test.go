package unit

import (
	// "fmt"
	"fmt"
	"testing"
	"time"

	"example.com/ProjectSeG08/entity"

	. "github.com/onsi/gomega"

	"github.com/asaskevich/govalidator"
)

func onlyPositivePrice() {
	govalidator.CustomTypeTagMap.Set("positive", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		switch v := i.(type) {
		case int:
			return v > 0 // ต้องมากกว่า 0
		case float64:
			return v > 0.0
		case float32:
			return v > 0.0
		default:
			return false
		}
	}))
}
func future() {
	govalidator.CustomTypeTagMap.Set("future", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		t, ok := i.(time.Time)
		if !ok {
			return false
		}
		return t.After(time.Now())
	}))
}


func TestOrder(t *testing.T) {
	onlyPositivePrice()

	g := NewGomegaWithT(t)

	t.Run(`price is negative`, func(t *testing.T) { // เป็นค่าลบ
		order := entity.Order{
			Price:           -1, // ผิดตรงนี้
			Discount:        100,
			OrderStatusID:     1,
			Note:            "หอมหอม",
			QuotaUsed:        true,
			ExpecterdPoint:   100,
			UserID:          1,
			PackageID:       1,
			HistoryRewardID: 1,
		}

		ok, err := govalidator.ValidateStruct(order) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Price must be positive"))
	})
	

	t.Run(`discount is optional`, func(t *testing.T) { // เป็นค่าลบ
		order := entity.Order{
			Price:           200,
			Discount:        0, // ผิดตรงนี้
			OrderStatusID:     1,
			Note:            "หอมหอม",
			QuotaUsed:        true,
			ExpecterdPoint:   100,
			UserID:          1,
			PackageID:       1,
			HistoryRewardID: 1,
		}

		ok, err := govalidator.ValidateStruct(order) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

		// g.Expect(err.Error()).To(Equal("Discount is optional"))
	})

	t.Run(`discount is positive`, func(t *testing.T) { // เป็นค่าลบ
		order := entity.Order{
			Price:           200,
			Discount:        -100, // ผิดตรงนี้
			OrderStatusID:     1,
			QuotaUsed:        true,
			ExpecterdPoint:   100,
			Note:            "หอมหอม",
			UserID:          1,
			PackageID:       1,
			HistoryRewardID: 1,
		}

		ok, err := govalidator.ValidateStruct(order) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Discount must be positive"))
	})

	t.Run(`OrderStatusID is required`, func(t *testing.T) { // ทำให้ไม่มี status
		order := entity.Order{
			Price:           100,
			Discount:        100,
			OrderStatusID:     0, //ผิดตรงนี้
			Note:            "หอมหอม",
			QuotaUsed:        true,
			ExpecterdPoint:   100,
			UserID:          1,
			PackageID:       1,
			HistoryRewardID: 1,
		}

		ok, err := govalidator.ValidateStruct(order) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("OrderStatusID is required"))
	})

	t.Run(`ExpectedPonint is plus`, func(t *testing.T) { // ทำให้ไม่มี status
		order := entity.Order{
			Price:           100,
			Discount:        100,
			OrderStatusID:     1,
			Note:            "หอมหอม",
			ExpecterdPoint:   -1, //ผิดตรงนี้
			QuotaUsed:        true,
			
			UserID:          1,
			PackageID:       1,
			HistoryRewardID: 1,
		}

		ok, err := govalidator.ValidateStruct(order) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("ExpectedPoint must be positive"))
	})

	t.Run(`Note is option`, func(t *testing.T) { // ทำให้ไม่มี status
		order := entity.Order{
			Price:           100,
			Discount:        100,
			OrderStatusID:     1,
			Note:            "", //ผิดตรงนี้
			QuotaUsed:        true,
			ExpecterdPoint:   100,
			UserID:          1,
			PackageID:       1,
			HistoryRewardID: 1,
		}

		ok, err := govalidator.ValidateStruct(order) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).To(BeTrue()) //

		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

		// g.Expect(err.Error()).To(Equal("Status is required"))
	})

	t.Run(`userid is required`, func(t *testing.T) { // ทำให้ไม่มี UserID
		order := entity.Order{
			Price:           100,
			Discount:        100,
			OrderStatusID:     1,
			Note:            "หอมหอม",
			QuotaUsed:        true,
			ExpecterdPoint:   100,
			UserID:          0, //ผิดตรงนี้
			PackageID:       1,
			HistoryRewardID: 1,
		}

		ok, err := govalidator.ValidateStruct(order) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("UserID is required"))
	})

	t.Run(`packageid is required`, func(t *testing.T) { // ทำให้ไม่มี PackageID
		order := entity.Order{
			Price:           100,
			Discount:        100,
			OrderStatusID:     1,
			Note:            "หอมหอม",
			QuotaUsed:        true,
			ExpecterdPoint:   100,
			UserID:          1,
			PackageID:       0, //ผิดตรงนี้
			HistoryRewardID: 1,
		}

		ok, err := govalidator.ValidateStruct(order) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("PackageID is required"))
	})

	t.Run(`order is success`, func(t *testing.T) {
		order := entity.Order{
			Price:           100,
			Discount:        100,
			OrderStatusID:     1,
			QuotaUsed:        true,
			ExpecterdPoint:   100,
			Note:            "หอมหอม",
			UserID:          1,
			PackageID:       1,
			HistoryRewardID: 1,
		}

		ok, err := govalidator.ValidateStruct(order) //retuen bool and error

		g.Expect(ok).To(BeTrue()) //จะ ok ถ้าเป็น false
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

		// g.Expect(err.Error()).To(Equal())
	})

}

func TestOrderdetail(t *testing.T) {
	g := NewGomegaWithT(t)
	onlyPositivePrice()
	// orderdetail
	t.Run(`quantity is required`, func(t *testing.T) { // ทำให้ไม่มี price
		orderdetail := entity.OrderDetail{

			Quantity:    0, // ผิดตรงนี้
			Price:       100,
			OrderID:     1,
			ClothTypeID: 1,
		}

		ok, err := govalidator.ValidateStruct(orderdetail) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Quantity is required"))
	})

	t.Run(`price is required`, func(t *testing.T) { // ทำให้ไม่มี price
		orderdetail := entity.OrderDetail{

			Quantity: 1,
			// Price: 100,// ผิดตรงนี้
			OrderID:     1,
			ClothTypeID: 1,
		}

		ok, err := govalidator.ValidateStruct(orderdetail) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Price is required"))
	})

	t.Run(`price is positve`, func(t *testing.T) { // ทำให้ไม่มี price
		orderdetail := entity.OrderDetail{

			Quantity:    1,
			Price:       -100, // ผิดตรงนี้
			OrderID:     1,
			ClothTypeID: 1,
		}

		ok, err := govalidator.ValidateStruct(orderdetail) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Price must be positive"))
	})

	t.Run(`orderID is required`, func(t *testing.T) { // ทำให้ไม่มี price
		orderdetail := entity.OrderDetail{

			Quantity:    1,
			Price:       100,
			OrderID:     0, // ผิดตรงนี้
			ClothTypeID: 1,
		}

		ok, err := govalidator.ValidateStruct(orderdetail) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("OrderID is required"))
	})

	t.Run(`ClothTypeID is required`, func(t *testing.T) { // ทำให้ไม่มี price
		orderdetail := entity.OrderDetail{

			Quantity:    1,
			Price:       100,
			OrderID:     1,
			ClothTypeID: 0, // ผิดตรงนี้

		}

		ok, err := govalidator.ValidateStruct(orderdetail) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("ClothTypeID is required"))
	})

	t.Run(`orderdetail is success`, func(t *testing.T) { // ทำให้ไม่มี price
		orderdetail := entity.OrderDetail{

			Quantity:    1,
			Price:       50,
			OrderID:     1,
			ClothTypeID: 1,
		}

		ok, err := govalidator.ValidateStruct(orderdetail) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

	})
	// end orderdetail

	// ClothType

}

func TestClothType(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run(`ClothType is success`, func(t *testing.T) { // ทำให้ไม่มี price
		clothtype := entity.ClothType{

			TypeName:  "เสื้อลำลอง",
			Price:     100,
			PackageID: 1,
		}

		ok, err := govalidator.ValidateStruct(clothtype) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

	})

	t.Run(`typename is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		clothtype := entity.ClothType{

			TypeName:  "", // ผิดตรงนี้
			Price:     100,
			PackageID: 1,
		}

		ok, err := govalidator.ValidateStruct(clothtype) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("TypeName is required"))

	})

	t.Run(`price is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		clothtype := entity.ClothType{

			TypeName:  "เสื้อลำลอง",
			Price:     0, // ผิดตรงนี้
			PackageID: 1,
		}

		ok, err := govalidator.ValidateStruct(clothtype) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Price is required"))
	})

	t.Run(`price is positive`, func(t *testing.T) { // ทำให้ไม่มี price
		clothtype := entity.ClothType{

			TypeName:  "เสื้อลำลอง",
			Price:     -1, // ผิดตรงนี้
			PackageID: 1,
		}

		ok, err := govalidator.ValidateStruct(clothtype) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Price must be positive"))
	})

	t.Run(`packageid is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		clothtype := entity.ClothType{

			TypeName:  "เสื้อลำลอง",
			Price:     100,
			PackageID: 0, // ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(clothtype) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("PackageID is required"))
	})

}

func TestAddOn(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run(`AddOn is success`, func(t *testing.T) { // ทำให้ไม่มี price
		addon := entity.AddOn{

			AddOnName:   "ขจัดคราบล้ำลึก",
			Price:       100,
			Description: "ขจัดคราบล้ำลึก",
			PackageID:   1,
		}

		ok, err := govalidator.ValidateStruct(addon) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

	})
	t.Run(`AddOnbane is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		addon := entity.AddOn{

			AddOnName:   "", // ผิดตรงนี้
			Price:       100,
			Description: "ขจัดคราบล้ำลึก",
			PackageID:   1,
		}

		ok, err := govalidator.ValidateStruct(addon) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil
		g.Expect(err.Error()).To(Equal("AddOnName is required"))

	})

	t.Run(`price is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		addon := entity.AddOn{

			AddOnName:   "ขจัดคราบล้ำลึก",
			Price:       0, // ผิดตรงนี้
			Description: "ขจัดคราบล้ำลึก",
			PackageID:   1,
		}

		ok, err := govalidator.ValidateStruct(addon) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Price is required"))
	})

	t.Run(`price is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		addon := entity.AddOn{

			AddOnName:   "ขจัดคราบล้ำลึก",
			Price:       -4, // ผิดตรงนี้
			Description: "ขจัดคราบล้ำลึก",
			PackageID:   1,
		}

		ok, err := govalidator.ValidateStruct(addon) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Price must be positive"))
	})

	t.Run(`description is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		addon := entity.AddOn{

			AddOnName:   "ขจัดคราบล้ำลึก",
			Price:       100,
			Description: "", // ผิดตรงนี้
			PackageID:   1,
		}

		ok, err := govalidator.ValidateStruct(addon) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Description is required"))
	})

	t.Run(`PackageID is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		addon := entity.AddOn{

			AddOnName:   "ขจัดคราบล้ำลึก",
			Price:       100,
			Description: "ขจัดคราบล้ำลึก",
			PackageID:   0, // ผิดตรงนี้

		}

		ok, err := govalidator.ValidateStruct(addon) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("PackageID is required"))
	})

}

func TestAddOnDetail(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`AddOnDetail is success`, func(t *testing.T) { // ทำให้ไม่มี price

		orderdetail := entity.AddOnDetail{
			Price:   100.0,
			AddOnID: 1,
			OrderID: 1,
		}

		ok, err := govalidator.ValidateStruct(orderdetail) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil
		if !ok {
			t.Log(err.Error()) // พิมพ์ error เพื่อตรวจสอบปัญหา
		}
		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะไม่มี err ถ้าเป็น nil
	})

	t.Run(`Price is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		addondetail := entity.AddOnDetail{
			Price:   0, // ผิดตรงนี้
			AddOnID: 1,
			OrderID: 1,
		}

		ok, err := govalidator.ValidateStruct(addondetail) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Price is required"))
	})

	t.Run(`Price is positive`, func(t *testing.T) { // ทำให้ไม่มี price
		addondetail := entity.AddOnDetail{
			Price:   -1, // ผิดตรงนี้
			AddOnID: 1,
			OrderID: 1,
		}

		ok, err := govalidator.ValidateStruct(addondetail) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Price must be positive"))
	})

	t.Run(`AddOnID is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		addondetail := entity.AddOnDetail{
			Price:   100,
			AddOnID: 0, // ผิดตรงนี้
			OrderID: 1,
		}

		ok, err := govalidator.ValidateStruct(addondetail) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil
        if !ok {
			t.Log(err.Error()) // พิมพ์ error เพื่อตรวจสอบปัญหา
		}
		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil
       
		g.Expect(err.Error()).To(Equal("AddOnID is required"))
	})

	t.Run(`OrderID is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		addondetail := entity.AddOnDetail{
			Price:   100,
			AddOnID: 1,
			OrderID: 0, // ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(addondetail) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("OrderID is required"))
	})
}

func TestImage(t *testing.T) {

	g := NewGomegaWithT(t)

	t.Run(`Image is success`, func(t *testing.T) { // ทำให้ไม่มี price
		Image := entity.Image{
			ImagePath: "test.png", // ผิดตรงนี้
			OrderID:   1,
		}

		ok, err := govalidator.ValidateStruct(Image) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

	})

	t.Run(`Imagepath is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		Image := entity.Image{
			ImagePath: "", // ผิดตรงนี้
			OrderID:   1,
		}

		ok, err := govalidator.ValidateStruct(Image) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("ImagePath is required"))
	})

	t.Run(`OrderID is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		addondetail := entity.Image{
			ImagePath: "test.png",
			OrderID:   0, // ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(addondetail) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("OrderID is required"))
	})

}

func TestNotification(t *testing.T) {
	// dateTimepatter()
	g := NewGomegaWithT(t)
	t.Run(`Notification is success`, func(t *testing.T) { // ทำให้ไม่มี price
		notification := entity.Notification{
			Title:   "test",
			Message:  "test",
			NotificationStatusID :   1,
			UserID:   1,
			OrderID:  1,
		}

		ok, err := govalidator.ValidateStruct(notification) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil
		if !ok {
			fmt.Println("Validation Error:", err)
		}
		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

	})

	t.Run(`Titile is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		notification := entity.Notification{
			Title:   "", // ผิดตรงนี้
			Message:  "test",
			NotificationStatusID :   1,
			UserID:   1,
			OrderID:  1,
		}

		ok, err := govalidator.ValidateStruct(notification) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Title is required"))
	})

	t.Run(`Message is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		notification := entity.Notification{
			Title:   "test",
			Message:  "", // ผิดตรงนี้
			NotificationStatusID :   1,
			UserID:   1,
			OrderID:  1,
		}

		ok, err := govalidator.ValidateStruct(notification) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Message is required"))
	})
    t.Run(`Status is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		notification := entity.Notification{
			Title:   "test",
			Message:  "test", 
			NotificationStatusID :   0,// ผิดตรงนี้
			UserID:   1,
			OrderID:  1,
		}

		ok, err := govalidator.ValidateStruct(notification) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("NotificationStatusID is required"))
	})



	t.Run(`UserID is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		notification := entity.Notification{
			Title:    "test",
			Message:  "test",
			NotificationStatusID :   1,
			UserID:   0, // ผิดตรงนี้
			OrderID:  1,
		}

		ok, err := govalidator.ValidateStruct(notification) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("UserID is required"))
	})

	t.Run(`OrderID is reqired`, func(t *testing.T) { // ทำให้ไม่มี price

		notification := entity.Notification{
			Title:    "test",
			Message:  "test",
			NotificationStatusID :   1,
			UserID:   1,
			OrderID:  0, // ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(notification) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("OrderID is required"))
	})
}

func TestPayment(t *testing.T) {
	// dateTimepatter()
	future()
	g := NewGomegaWithT(t)

	t.Run(`Payment is success`, func(t *testing.T) { // ทำให้ไม่มี price

		payment := entity.Payment{
			PaymentStart: time.Now(),
			PaymentEnd: time.Now().Add(1 * time.Hour),
			Price:        1,
			PaymentStatusID :      1,
			BookID:       1,
			UserID:       1,
		}

		ok, err := govalidator.ValidateStruct(payment) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil
		if !ok {
			fmt.Println("Validation Error:", err)
		}
		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

	})

	t.Run(`PaymentStart is reqired`, func(t *testing.T) { // ทำให้ไม่มี price
		payment := entity.Payment{
			PaymentStart: time.Time{}, // ผิดตรงนี้
			PaymentEnd: time.Now().Add(1 * time.Hour),
			Price:        1,
			PaymentStatusID :      1,
			BookID:       1,
			OrderID:      1,
			UserID:       1,
		}

		ok, err := govalidator.ValidateStruct(payment) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("PaymentStart is required"))
	})
	t.Run(`PaymentEnd is not future`, func(t *testing.T) { // ทำให้ไม่มี price
		payment := entity.Payment{
			PaymentStart: time.Now(),
			PaymentEnd:    time.Now().Add(-1 * time.Hour), // ผิดตรงนี้
			Price:        1,
			PaymentStatusID :      1,
			BookID:       1,
			OrderID:      1,
			UserID:       1,
		}

		ok, err := govalidator.ValidateStruct(payment) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("PaymentEnd must be in the future"))
	})
	

	

	t.Run(`Price is positive`, func(t *testing.T) { // ทำให้ไม่มี price)

		payment := entity.Payment{
			PaymentStart: time.Now(),
			PaymentEnd: time.Now().Add(1 * time.Hour),
			Price:        -1, // ผิดตรงนี้
			PaymentStatusID :      1,
			
			BookID:       1,
			OrderID:      1,
			UserID:       1,
		}

		ok, err := govalidator.ValidateStruct(payment) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("Price must be positive"))
	})

	t.Run(`status is reqired`, func(t *testing.T) { // ทำให้ไม่มี price)

		payment := entity.Payment{
			PaymentStart: time.Now(),
			PaymentEnd: time.Now().Add(1 * time.Hour),
			Price:        100,
			PaymentStatusID :      0, // ผิดตรงนี้
			
			BookID:       1,
			OrderID:      1,
			UserID:       1,
		}

		ok, err := govalidator.ValidateStruct(payment) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("PaymentStatusID is required"))
	})

	

	

	t.Run(`BookID is option`, func(t *testing.T) { // ทำให้ไม่มี price)

		payment := entity.Payment{
			PaymentStart: time.Now(),
			PaymentEnd: time.Now().Add(1 * time.Hour),
			Price:        100,
			PaymentStatusID :      1,
			BookID:       0, // ผิดตรงนี้
			OrderID:      1,
			UserID:       1,
		}

		ok, err := govalidator.ValidateStruct(payment) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

		// g.Expect(err.Error()).To(Equal("ref is required"))
	})
	t.Run(`OrderID is option`, func(t *testing.T) { // ทำให้ไม่มี price)

		payment := entity.Payment{
			PaymentStart: time.Now(),
			PaymentEnd: time.Now().Add(1 * time.Hour),
			Price:        100,
			PaymentStatusID :      1,
	
			BookID:       1,
			OrderID:      0, // ผิดตรงนี้
			UserID:       1,
		}

		ok, err := govalidator.ValidateStruct(payment) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

		// g.Expect(err.Error()).To(Equal("ref is required"))
	})

	t.Run(`UserID is required`, func(t *testing.T) { // ทำให้ไม่มี price)

		payment := entity.Payment{
			PaymentStart: time.Now(),
			PaymentEnd: time.Now().Add(1 * time.Hour),
			Price:        100,
			PaymentStatusID :      1,

			BookID:       1,
			OrderID:      1,
			UserID:       0, // ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(payment) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil

		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil

		g.Expect(err.Error()).To(Equal("UserID is required"))
	})

}

func TestNotificatioStatus(t *testing.T) {
	// dateTimepatter()
	g := NewGomegaWithT(t)
	t.Run(`NotificationStatus is success`, func(t *testing.T) { // ทำให้ไม่มี price
		notificationStatus := entity.NotificationStatus{
			Status: "อ่านแล้ว",
		}

		ok, err := govalidator.ValidateStruct(notificationStatus) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil
		if !ok {
			fmt.Println("Validation Error:", err)
		}
		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

	})
   

	t.Run(`Status is require`, func(t *testing.T) { // ทำให้ไม่มี price
		notificationStatus := entity.NotificationStatus{
			Status: "",
		}

		ok, err := govalidator.ValidateStruct(notificationStatus) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil
		if !ok {
			fmt.Println("Validation Error:", err)
		}
		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil
		g.Expect(err.Error()).To(Equal("Status is required"))

	})

}

func TestOrderStatus(t *testing.T) {
	// dateTimepatter()
	g := NewGomegaWithT(t)
	t.Run(`orderstatus is success`, func(t *testing.T) { // ทำให้ไม่มี price
		orderStatus := entity.OrderStatus{
			Status: "อ่านแล้ว",
		}

		ok, err := govalidator.ValidateStruct(orderStatus) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil
		if !ok {
			fmt.Println("Validation Error:", err)
		}
		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

	})
   

	t.Run(`Status is require`, func(t *testing.T) { // ทำให้ไม่มี price
		orderStatus := entity.OrderStatus{
			Status: "",
		}

		ok, err := govalidator.ValidateStruct(orderStatus) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil
		if !ok {
			fmt.Println("Validation Error:", err)
		}
		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil
		g.Expect(err.Error()).To(Equal("Status is required"))

	})

}

func TestPaymentStatus(t *testing.T) {
	// dateTimepatter()
	g := NewGomegaWithT(t)
	t.Run(`PaymentStatus is success`, func(t *testing.T) { // ทำให้ไม่มี price
		paymentStatus := entity.PaymentStatus{
			PaymentStatus : "อ่านแล้ว",
		}

		ok, err := govalidator.ValidateStruct(paymentStatus) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil
		if !ok {
			fmt.Println("Validation Error:", err)
		}
		g.Expect(ok).To(BeTrue()) //
		g.Expect(err).To(BeNil()) //จะ err ถ้าเป็น ไม่nil

	})
   

	t.Run(`Status is require`, func(t *testing.T) { // ทำให้ไม่มี price
		paymentStatus := entity.PaymentStatus{
			PaymentStatus: "",
		}

		ok, err := govalidator.ValidateStruct(paymentStatus) //retuen bool and error มี err จะ return false กับ err ถ้าผ่านจะคืน true กับ nil
		if !ok {
			fmt.Println("Validation Error:", err)
		}
		g.Expect(ok).NotTo(BeTrue()) //
		g.Expect(err).NotTo(BeNil()) //จะ err ถ้าเป็น ไม่nil
		g.Expect(err.Error()).To(Equal("PaymentStatus is required"))

	})

}

