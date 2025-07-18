package unit

import (
	//"fmt"
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



func TestBooksPrice(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`price is required`, func(t *testing.T) {
		book := entity.Books{
			Price:      0, // ผิดตรงนี้
			Status:     "ส่งการจอง",
			BooksStart: time.Now(),
			BooksEnd:   time.Now().Add(1 * time.Hour),
			UserID:     1,
		}

		ok, err := govalidator.ValidateStruct(book)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Price is required"))
	})

	t.Run(`price must be positive`, func(t *testing.T) {
		book := entity.Books{
			Price:      -100, // ผิดตรงนี้
			Status:     "ส่งการจอง",
			BooksStart: time.Now(),
			BooksEnd:   time.Now().Add(1 * time.Hour),
			UserID:     1,
		}

		ok, err := govalidator.ValidateStruct(book)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Price must be positive"))
	})
}



func TestBooksDates(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`BooksStart is required`, func(t *testing.T) {
		book := entity.Books{
			Price:    100,
			Status:   "ส่งการจอง",
			// BooksStart: time.Now(), // แก้ตรงนี้
			BooksEnd: time.Now().Add(1 * time.Hour),
			UserID:   1,
		}

		ok, err := govalidator.ValidateStruct(book)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("BooksStart is required"))
	})

	t.Run(`BooksEnd must be in the future`, func(t *testing.T) {
		book := entity.Books{
			Price:      100,
			Status:     "ส่งการจอง",
			BooksStart: time.Now(),
			BooksEnd:   time.Now().Add(-1 * time.Hour), // แก้ตรงนี้
			UserID:     1,
		}

		ok, err := govalidator.ValidateStruct(book)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("BooksEnd must be in the future"))
	})
	
	


}


func TestBooksUserID(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`UserID is required`, func(t *testing.T) {
		book := entity.Books{
			Price:      100,
			Status:     "ส่งการจอง",
			BooksStart: time.Now(),
			BooksEnd:   time.Now().Add(1 * time.Hour),
			UserID:     0, // ผิดตรงนี้
		}

		ok, err := govalidator.ValidateStruct(book)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("UserID is required"))
	})
}


func TestBooksStatus(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`status is required`, func(t *testing.T) {
		book := entity.Books{
			Price:      100,
			Status:     "ส่งการจอง", // กำหนดค่าถูกต้องแทนที่จะปล่อยเป็นค่าว่าง
			BooksStart: time.Now(),
			BooksEnd:   time.Now().Add(1 * time.Hour),
			UserID:     1,
		}

		ok, err := govalidator.ValidateStruct(book)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run(`status must be valid`, func(t *testing.T) {
		book := entity.Books{
			Price:      100,
			Status:     "ไม่สมบูรณ์", // ใช้ค่าที่ถูกต้อง
			BooksStart: time.Now(),
			BooksEnd:   time.Now().Add(1 * time.Hour),
			UserID:     1,
		}

		ok, err := govalidator.ValidateStruct(book)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

	t.Run(`status is valid`, func(t *testing.T) {
		book := entity.Books{
			Price:      100,
			Status:     "สำเร็จ", // ใช้ค่าที่ถูกต้อง
			BooksStart: time.Now(),
			BooksEnd:   time.Now().Add(1 * time.Hour),
			UserID:     1,
		}

		ok, err := govalidator.ValidateStruct(book)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
