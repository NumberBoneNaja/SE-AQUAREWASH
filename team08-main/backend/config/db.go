package config

import (
	"fmt"

	"example.com/ProjectSeG08/entity"

	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("Laundry.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {
	db.AutoMigrate(
		&entity.User{},

		//จอง
		&entity.Books{},
		&entity.Machine{},
		&entity.MHistory{},
		&entity.BookingDetails{},

		//MembershipPayment and history
		&entity.PackageMembership{},
		&entity.MembershipPayment{},
		&entity.HistoryPaymentMembership{},

		//ระบบ Order + payment
		//start
		&entity.RewardType{}, &entity.Reward{},
		&entity.Package{}, &entity.ClothType{},
		&entity.AddOn{}, &entity.HistoryReward{},
		&entity.Order{}, &entity.OrderDetail{},
		&entity.AddOnDetail{}, &entity.Image{},
		&entity.Payment{}, &entity.Notification{}, &entity.PaymentStatus{}, &entity.OrderStatus{}, &entity.NotificationStatus{},

		&entity.BookingDetails{},
		&entity.Report{},
		&entity.ReportDetail{},
		&entity.ReportResult{},

		//withdraw
		&entity.Withdraw{},
		&entity.WithdrawDetail{},
		&entity.Exchequer{},
		&entity.TypeLaundryProduct{},
		//end
		//start
		&entity.RewardType{}, &entity.Reward{},
		&entity.Package{}, &entity.ClothType{},
		&entity.AddOn{}, &entity.HistoryReward{},
		&entity.Order{}, &entity.OrderDetail{},
		&entity.AddOnDetail{}, &entity.Image{},
		&entity.Payment{}, &entity.Notification{},
		//end
		//ระบบ employee
		&entity.Employee{},
		&entity.Job{},
		&entity.Department{},
		&entity.OfficeHours{},
		//end

		&entity.Post{},
	)

	//User
	hashedPassword, _ := HashPassword("1")
	User := []entity.User{
		{UserName: "Jakkapan", Password: hashedPassword, Email: "jakkapanjarcunsook@gmail.com", FirstName: "Jakkapan", LastName: "Jarcunsook", Age: 21, Profile: "https://i.pinimg.com/736x/44/35/c4/4435c4a136576fe157bc108d53ddbd84.jpg", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "User"},
		{UserName: "Jakkapan1", Password: hashedPassword, Email: "jakkapanjarcunsook@gmail.com", FirstName: "Jakkapan1", LastName: "Jarcunsook1", Age: 21, Profile: "https://i.pinimg.com/736x/44/35/c4/4435c4a136576fe157bc108d53ddbd84.jpg", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "Member"},
		{UserName: "Jack", Password: hashedPassword, Email: "jakkapanjarcunsook@gmail.com", FirstName: "JA", LastName: "CK", Age: 21, Profile: "https://i.pinimg.com/736x/cf/09/a5/cf09a510bba00e8e81e6d9a4859c5aac.jpg", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "Member"},
		{UserName: "Admin", Password: hashedPassword, Email: "Admin@g.sut.ac.th", FirstName: "Admin", LastName: "", Age: 100, Profile: "https://i.pinimg.com/736x/8f/9b/8b/8f9b8b8bc8986a94b696c0e2d13848dd.jpg", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "Admin"},
		{UserName: "Employee", Password: hashedPassword, Email: "Employee@g.sut.ac.th", FirstName: "employee", LastName: "", Age: 100, Profile: "https://i.pinimg.com/736x/90/c8/d1/90c8d1e6966dcd0990b9790adb2c1aa8.jpg", ProfileBackground: "https://i.pinimg.com/736x/c6/ed/07/c6ed076ac6cb2f7df2a03552fa8b70dd.jpg", Status: "Employee"},
		{UserName: "Test1", Password: hashedPassword, Email: "jakkapanjarcunsook@gmail.com", FirstName: "Test", LastName: "SE", Age: 21, Profile: "https://cache-igetweb-v2.mt108.info/uploads/images-cache/12677/product/dd87089fb03608d6fab36fa1204ce286_full.jpg", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "Employee"},
		{UserName: "Test2", Password: hashedPassword, Email: "jakkapanjarcunsook@gmail.com", FirstName: "Test", LastName: "SE", Age: 21, Profile: "https://i.pinimg.com/736x/0e/ee/fc/0eeefc9786a3d07c7f85ee8347717c4f.jpg", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "Employee"},
		{UserName: "Test3", Password: hashedPassword, Email: "jakkapanjarcunsook@gmail.com", FirstName: "Test", LastName: "SE", Age: 21, Profile: "https://i.pinimg.com/736x/c6/e8/e9/c6e8e9ea9455d1cf2ccc79569cbc39f8.jpg", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "Employee"},
		{UserName: "Test4", Password: hashedPassword, Email: "jakkapanjarcunsook@gmail.com", FirstName: "Test", LastName: "SE", Age: 21, Profile: "https://i.pinimg.com/736x/cf/f4/53/cff4534272b023165fb3300a53814172.jpg", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "Employee"},

		{UserName: "Four", Password: hashedPassword, Email: "jakkapanjarcunsook@gmail.com", FirstName: "Test", LastName: "SE", Age: 21, Profile: "u1.png", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "User" ,QuotaOrder:0,PointRate: 0 ,Point: 10000000},
		{UserName: "Jo", Password: hashedPassword, Email: "jakkapanjarcunsook@gmail.com", FirstName: "Test", LastName: "SE", Age: 21, Profile: "u2.png", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "User" ,QuotaOrder:0,PointRate: 0 ,Point: 10000000},
		{UserName: "Jackx", Password: hashedPassword, Email: "jakkapanjarcunsook@gmail.com", FirstName: "Test", LastName: "SE", Age: 21, Profile: "u3.png", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "User" ,QuotaOrder:0,PointRate:0  ,Point: 10000000},
		{UserName: "Jab", Password: hashedPassword, Email: "jakkapanjarcunsook@gmail.com", FirstName: "Test", LastName: "SE", Age: 21, Profile: "u4.png", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "User" ,QuotaOrder:0,PointRate:0  ,Point: 10000000},
		{UserName: "Patt", Password: hashedPassword, Email: "jakkapanjarcunsook@gmail.com", FirstName: "Test", LastName: "SE", Age: 21, Profile: "u5.png", ProfileBackground: "https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg", Status: "User" ,QuotaOrder:0,PointRate:0  ,Point: 10000000},
		
	}
	for _, pkg := range User {
		db.FirstOrCreate(&pkg, entity.User{UserName: pkg.UserName})
	}

	PackageMembership := []entity.PackageMembership{
		{NamePackage: "A month", Price: 20, HowLongTime: 30, Description: "Membership for 1 month", PicPayment: "https://i.pinimg.com/736x/3e/18/81/3e1881251ac9d98662c6bed323d32901.jpg", QuotaOrder: 2, QuotaBooking: 2, PointRate: 0.1, DiscountRate: 0.1},
		{NamePackage: "A year", Price: 30, HowLongTime: 365, Description: "Membership for 1 year", PicPayment: "https://i.pinimg.com/474x/23/56/9f/23569f1e0d1194be6f351b9c81e3a249.jpg" ,QuotaOrder: 12, QuotaBooking: 12, PointRate: 0.2, DiscountRate: 0.2},
		// {NamePackage: "3 mounts", Price: 799, HowLongTime: 90, Description: "Membership for 90 days", PicPayment: "https://i.pinimg.com/736x/08/54/56/085456ddf5025db411d57512512d1d82.jpg"},
		// {NamePackage: "6 mounts", Price: 1699, HowLongTime: 180, Description: "Membership for 180 days", PicPayment: "https://i.pinimg.com/736x/e9/86/58/e98658ca0921231abe9b2ab3906baf4c.jpg"},
		// {NamePackage: "12 mounts", Price: 3599, HowLongTime: 365, Description: "Membership for 365 days", PicPayment: "https://i.pinimg.com/736x/ee/2b/88/ee2b883a2f60abda2b7a0b6daffa604f.jpg"},
	}

	for _, pkg := range PackageMembership {
		db.FirstOrCreate(&pkg, entity.PackageMembership{NamePackage: pkg.NamePackage})
	}

	MembershipPayment := []entity.MembershipPayment{
		{UserID: 5, PackageMembershipID: 1, PaymentMethod: "Promtpay", DateStart: time.Now(), DateEnd: time.Now().AddDate(0, 0, 7), PicPayment: ""},
		{UserID: 6, PackageMembershipID: 2, PaymentMethod: "cash", DateStart: time.Now(), DateEnd: time.Now().AddDate(0, 0, 7), PicPayment: ""},
		{UserID: 7, PackageMembershipID: 3, PaymentMethod: "Promtpay", DateStart: time.Now(), DateEnd: time.Now().AddDate(0, 0, 7), PicPayment: ""},
		{UserID: 8, PackageMembershipID: 4, PaymentMethod: "Credit card", DateStart: time.Now(), DateEnd: time.Now().AddDate(0, 0, 7), PicPayment: ""},
		{UserID: 2, PackageMembershipID: 1, PaymentMethod: "Credit card", DateStart: time.Date(2024, time.December, 14, 0, 0, 0, 0, time.UTC), DateEnd: time.Date(2025, time.January, 6, 0, 0, 0, 0, time.UTC), PicPayment: "Update"},
	}

	for _, pkg := range MembershipPayment {
		db.FirstOrCreate(&pkg, entity.MembershipPayment{UserID: pkg.UserID})
	}

	//

	HistoryPaymentMembership := []entity.HistoryPaymentMembership{
		{UserID: 5, PackageMembershipID: 1, PaymentMethod: "Promtpay", DateStart: time.Now(), DateEnd: time.Now().AddDate(0, 0, 7)},
		{UserID: 6, PackageMembershipID: 2, PaymentMethod: "cash", DateStart: time.Now(), DateEnd: time.Now().AddDate(0, 0, 7)},
		{UserID: 7, PackageMembershipID: 3, PaymentMethod: "Promtpay", DateStart: time.Now(), DateEnd: time.Now().AddDate(0, 0, 7)},
		{UserID: 8, PackageMembershipID: 4, PaymentMethod: "Credit card", DateStart: time.Now(), DateEnd: time.Now().AddDate(0, 0, 7)},
		{UserID: 2, PackageMembershipID: 1, PaymentMethod: "Credit card", DateStart: time.Date(2024, time.December, 14, 0, 0, 0, 0, time.UTC), DateEnd: time.Date(2025, time.January, 6, 0, 0, 0, 0, time.UTC)},
	}

	for _, pkg := range HistoryPaymentMembership {
		db.FirstOrCreate(&pkg, entity.HistoryPaymentMembership{UserID: pkg.UserID})
	}

	books := &entity.Books{
		BooksStart: time.Now(),
		BooksEnd:   time.Now().AddDate(0, 0, 7),
		UserID:     1,
	}

	// เพิ่มหนังสือเริ่มต้น
	db.FirstOrCreate(books, &entity.Books{
		BooksStart: books.BooksStart,
	})

	// ข้อมูล Machine เริ่มต้น
	machines := []entity.Machine{
		// Washer Machines
		{MachineName: "Washer 1", MachineType: "เครื่องซักผ้า", Status: "ว่าง", MModel: "AA123", Brand: "Samsung", Capacity: 7.5},
		{MachineName: "Washer 2", MachineType: "เครื่องซักผ้า", Status: "ไม่ว่าง", MModel: "AA123", Brand: "Samsung", Capacity: 7.5},
		{MachineName: "Washer 3", MachineType: "เครื่องซักผ้า", Status: "ซ่อมแซม", MModel: "AA123", Brand: "Samsung", Capacity: 7.5},

		// Dryer Machines
		{MachineName: "Dryer 1", MachineType: "เครื่องอบผ้า", Status: "ว่าง", MModel: "AA123", Brand: "Samsung", Capacity: 7.5},
		{MachineName: "Dryer 2", MachineType: "เครื่องอบผ้า", Status: "ไม่ว่าง", MModel: "AA123", Brand: "Samsung", Capacity: 7.5},
		{MachineName: "Dryer 3", MachineType: "เครื่องอบผ้า", Status: "ซ่อมแซม", MModel: "AA123", Brand: "Samsung", Capacity: 7.5},
		{MachineName: "Dryer 4", MachineType: "เครื่องอบผ้า", Status: "ว่าง", MModel: "AA123", Brand: "Samsung", Capacity: 7.5},
	}

	m_histories := []entity.MHistory{
		{MachineID: 1, Action: "Created", Timestamp: time.Now()},
		{MachineID: 2, Action: "Updated", Timestamp: time.Now()},
	}

	for _, history := range m_histories {
		db.FirstOrCreate(&history, entity.MHistory{MachineID: history.MachineID, Action: history.Action})
	}

	// Add Machines to the database
	for _, machine := range machines {
		db.FirstOrCreate(&machine, entity.Machine{MachineName: machine.MachineName})
	}

	// ข้อมูล BookingDetails เริ่มต้น
	bookingDetail := &entity.BookingDetails{
		BooksID:   books.ID,
		MachineID: machines[0].ID,
	}

	// เพิ่ม BookingDetails เริ่มต้น
	db.FirstOrCreate(bookingDetail, &entity.BookingDetails{
		BooksID:   bookingDetail.BooksID,
		MachineID: bookingDetail.MachineID,
	})

	PackageFirst := entity.Package{PackagePic: "p5.png",PackageName: "ซักผับ", Explain: "เหมาะสำหรับเสื้อลำลองในชีวิตประจำวัน"}
	PackageSecond := entity.Package{PackagePic: "p6.png",PackageName: "ซักรองเท้า", Explain: "ดูแลรองเท้าอย่างพิถีพิถัน ทุกประเภท"}
	PackageThird := entity.Package{PackagePic: "p7.png",PackageName: "ซักเครื่องนอนและอื่น", Explain: "ซักอบเครื่องนอน ผ้าที่ใช้ในบ้านและห้องน้ำ"}
	// Create packages
	db.FirstOrCreate(&PackageFirst, &entity.Package{PackagePic: "p5.png",PackageName: "ซักผับ", Explain: "เหมาะสำหรับเสื้อลำลองในชีวิตประจำวัน"})
	db.FirstOrCreate(&PackageSecond, &entity.Package{PackagePic: "p6.png",PackageName: "ซักรองเท้า", Explain: "ดูแลรองเท้าอย่างพิถีพิถัน ทุกประเภท"})
	db.FirstOrCreate(&PackageThird, &entity.Package{PackagePic: "p7.png",PackageName: "ซักเครื่องนอนและอื่น", Explain: "ซักอบเครื่องนอน ผ้าที่ใช้ในบ้านและห้องน้ำ"})

	ClothypeFirst := entity.ClothType{TypeName: "เสื้อสำลอง", Price: 10.00, PackageID: 1}
	ClothypeSecond := entity.ClothType{TypeName: "รองเท้า", Price: 485.00, PackageID: 2}
	ClothypeThird := entity.ClothType{TypeName: "เครื่องนอนไม่หนา", Price: 100.00, PackageID: 3}
	ClothypeFourth := entity.ClothType{TypeName: "เครื่องนอนหนา", Price: 200.00, PackageID: 3}
	// // Create cloth types
	db.FirstOrCreate(&ClothypeFirst, &entity.ClothType{TypeName: "เสื้อสำลอง", Price: 10.00, PackageID: 1})
	db.FirstOrCreate(&ClothypeSecond, &entity.ClothType{TypeName: "รองเท้า", Price: 485.00, PackageID: 2})
	db.FirstOrCreate(&ClothypeThird, &entity.ClothType{TypeName: "เครื่องนอนไม่หนา", Price: 100.00, PackageID: 3})
	db.FirstOrCreate(&ClothypeFourth, &entity.ClothType{TypeName: "เครื่องนอนหนา", Price: 200.00, PackageID: 3})

	AddOnFirst := entity.AddOn{AddOnPic:"a4.png",AddOnName: "ขจัดคราบ", Price: 10.00, Description: "ขจัดคราบล้ำลึก", PackageID: 1}
	AddOnSecond := entity.AddOn{AddOnPic:"p5.png", AddOnName: "น้ำหอมร้องเท้า", Price: 10.00, Description: "น้ำหอมร้องเท้า", PackageID: 2}
	AddOnThird := entity.AddOn{AddOnPic:"p6.png",AddOnName: "ซักอุณภูมิสูง 60 องศา", Price: 20.00, Description: "ซักอุณภูมิสูง เพื่อขจัดแบคทีเรีย", PackageID: 3}
	AddOnFourth := entity.AddOn{AddOnPic:"a7.png",AddOnName: "ปกป้องรองเท้า", Price: 20.00, Description: "เคลือบน้ำยากันน้ำ ความชื้น และคราบสกปรก", PackageID: 2}

	// // Create add-ons
	db.FirstOrCreate(&AddOnFirst, &entity.AddOn{AddOnPic:"a4.png",AddOnName: "ขจัดคราบ", Price: 10.00, Description: "ขจัดคราบล้ำลึก", PackageID: 1})
	db.FirstOrCreate(&AddOnSecond, &entity.AddOn{AddOnPic:"p5.png",AddOnName: "น้ำหอมร้องเท้า", Price: 10.00, Description: "น้ำหอมร้องเท้า", PackageID: 2})
	db.FirstOrCreate(&AddOnThird, &entity.AddOn{AddOnPic:"p6.png",AddOnName: "ซักอุณภูมิสูง 60 องศา", Price: 20.00, Description: "ซักอุณภูมิสูง เพื่อขจัดแบคทีเรีย", PackageID: 3})
	db.FirstOrCreate(&AddOnFourth, &entity.AddOn{AddOnPic:"p7.png",AddOnName: "ปกป้องรองเท้า", Price: 20.00, Description: "เคลือบน้ำยากันน้ำ ความชื้น และคราบสกปรก", PackageID: 2})

	RewardTypeFirst := entity.RewardType{TypeName: "percent"}
	RewardTypeSecond := entity.RewardType{TypeName: "discount"}
	RewardTypeThird := entity.RewardType{TypeName: "things"}
	// // Create reward types
	db.FirstOrCreate(&RewardTypeFirst, &entity.RewardType{TypeName: "percent"})
	db.FirstOrCreate(&RewardTypeSecond, &entity.RewardType{TypeName: "discount"})
	db.FirstOrCreate(&RewardTypeThird, &entity.RewardType{TypeName: "things"})

	RewardFirst := entity.Reward{Point: 100, Name: "ส่วนลด 10%", Discount: 0.10, RewardTypeID: 1, Starttime: time.Now(), Endtime: time.Now().AddDate(0, 0, 7)}
	RewardSecond := entity.Reward{Point: 200, Name: "ส่วนลด 20%", Discount: 0.20, RewardTypeID: 1}
	RewardThird := entity.Reward{Point: 300, Name: "ส่วนลด 150บาท", Discount: 150.00, RewardTypeID: 2}
	RewardFourth := entity.Reward{Point: 400, Name: "ส่วนลด 40บาท", Discount: 40.00, RewardTypeID: 2}

	// // Create rewards
	db.FirstOrCreate(&RewardFirst, &entity.Reward{Point: 100, Name: "ส่วนลด 10%", Discount: 0.10, RewardTypeID: 1})
	db.FirstOrCreate(&RewardSecond, &entity.Reward{Point: 200, Name: "ส่วนลด 20%", Discount: 0.20, RewardTypeID: 1})
	db.FirstOrCreate(&RewardThird, &entity.Reward{Point: 300, Name: "ส่วนลด 150บาท", Discount: 150.00, RewardTypeID: 2})
	db.FirstOrCreate(&RewardFourth, &entity.Reward{Point: 400, Name: "ส่วนลด 40บาท", Discount: 40.00, RewardTypeID: 2})

	OrderStatusFirst := entity.OrderStatus{Status: "รอชําระเงิน"}
	OrderStatusSecond := entity.OrderStatus{Status: "ชำระเงินแล้ว"}
	OrderStatusThird := entity.OrderStatus{Status: "กำลังดำเนินการ"}
	OrderStatusFourth := entity.OrderStatus{Status: "เสร็จสิ้น"}

	db.FirstOrCreate(&OrderStatusFirst, &entity.OrderStatus{Status: "รอชําระเงิน"})
	db.FirstOrCreate(&OrderStatusSecond, &entity.OrderStatus{Status: "ชำระเงินแล้ว"})
	db.FirstOrCreate(&OrderStatusThird, &entity.OrderStatus{Status: "กำลังดำเนินการ"})
	db.FirstOrCreate(&OrderStatusFourth, &entity.OrderStatus{Status: "เสร็จสิ้น"})

	PaymentStatusFirst := entity.PaymentStatus{PaymentStatus: "รอชําระเงิน"}
	PaymentStatusSecond := entity.PaymentStatus{PaymentStatus: "ชำระเงินแล้ว"}

	db.FirstOrCreate(&PaymentStatusFirst, &entity.PaymentStatus{PaymentStatus: "รอชําระเงิน"})
	db.FirstOrCreate(&PaymentStatusSecond, &entity.PaymentStatus{PaymentStatus: "ชำระเงินแล้ว"})

	NotificastionStatusFirst := entity.NotificationStatus{Status: "ยังไม่อ่าน"}
	NotificastionStatusSecond := entity.NotificationStatus{Status: "อ่านแล้ว"}

	db.FirstOrCreate(&NotificastionStatusFirst, &entity.NotificationStatus{Status: "ยังไม่อ่าน"})
	db.FirstOrCreate(&NotificastionStatusSecond, &entity.NotificationStatus{Status: "อ่านแล้ว"})

	// HistoryFirst := entity.HistoryReward{Expire: time.Now().Add(30 * 24 * time.Hour), State: "active", RewardID: 1, UserID: 10}
	// HistorySecond := entity.HistoryReward{Expire: time.Now().Add(30 * 24 * time.Hour), State: "active", RewardID: 2, UserID: 10}
	// HistoryThird := entity.HistoryReward{Expire: time.Now().Add(30 * 24 * time.Hour), State: "active", RewardID: 3, UserID: 10}
	// HistoryFourth := entity.HistoryReward{Expire: time.Now().Add(30 * 24 * time.Hour), State: "active", RewardID: 4, UserID: 10}

	// // // Create history rewards
	// db.FirstOrCreate(&HistoryFirst,&entity.HistoryReward{Expire: time.Now().Add(30 * 24 * time.Hour), State: "active", RewardID: 1, UserID: 10})
	// db.FirstOrCreate(&HistorySecond,&entity.HistoryReward{Expire: time.Now().Add(30 * 24 * time.Hour), State: "active", RewardID: 2, UserID: 10})
	// db.FirstOrCreate(&HistoryThird,&entity.HistoryReward{Expire: time.Now().Add(30 * 24 * time.Hour), State: "active", RewardID: 3, UserID: 10})
	// db.FirstOrCreate(&HistoryFourth,&entity.HistoryReward{Expire: time.Now().Add(30 * 24 * time.Hour), State: "active", RewardID: 4, UserID: 10})
	// // // //end

	types := []entity.TypeLaundryProduct{
		{TypeLaundryProduct: "ผงซักฟอก"},
		{TypeLaundryProduct: "น้ำยาซักผ้า"},
		{TypeLaundryProduct: "น้ำยาปรับผ้านุ่ม"},
		{TypeLaundryProduct: "น้ำยาฟอกขาว"},
		{TypeLaundryProduct: "ถุงซักผ้า"},
		{TypeLaundryProduct: "ไม้แขวนเสื้อ"},
	}
	for _, t := range types {
		db.FirstOrCreate(&t, entity.TypeLaundryProduct{TypeLaundryProduct: t.TypeLaundryProduct})
	}
	//คลัง
	exchequers := []entity.Exchequer{
		{Brand: "เปา วินวอช ลิควิด สูตรเข้มข้น 700มล.", Stock: 30, Image: "https://likeoffice.co.th/cdn/shop/products/873219_2048x2048.jpg?v=1658488343", TLPID: 2},
		{Brand: "ผงซักฟอก สูตรมาตรฐาน สำหรับซักมือ OMO รุ่นถุง ขนาด 800 กรัม สีน้ำเงิน", Stock: 40, Image: "https://www.thaiwatsadu.com/_next/image?url=https%3A%2F%2Fpim.thaiwatsadu.com%2FTWDPIM%2Fweb%2FWatermark%2FImage%2F0807%2F60211166r1.jpg&w=1200&q=75", TLPID: 1},
		{Brand: "Attack Easy Happy Sweet Powder Detergent", Stock: 25, Image: "https://img.wongnai.com/p/1920x0/2023/04/07/fc1b49bc5af547199ce50d695c2ca2a9.jpg", TLPID: 1},
		{Brand: "PAO Silver Nano", Stock: 60, Image: "https://img.wongnai.com/p/1920x0/2023/04/07/5575795e6ff4454682842ab0b57f85e0.jpg", TLPID: 1},
		{Brand: "Downy Premium Parfum Passion Fabric Softener", Stock: 70, Image: "https://img.wongnai.com/p/1920x0/2023/05/25/30628ff9011c459ab6c02729fb8ff5c0.jpg", TLPID: 3},
		{Brand: "Comfort Ultra Fabric Softener Daily Fresh", Stock: 35, Image: "https://img.wongnai.com/p/1920x0/2023/05/25/c3bbda04f757417c92838f4aa8c08857.jpg", TLPID: 3},
		{Brand: "Essence Concentrate Softener Innocent Freesia", Stock: 55, Image: "https://img.wongnai.com/p/1920x0/2023/05/25/42b5d4eb829546cb89dab412273c58e9.jpg", TLPID: 3},
		{Brand: "Fineline Elegant Concentrated Fabric Softener Tender Scent", Stock: 45, Image: "https://img.wongnai.com/p/1920x0/2023/05/25/2d696462b8714266a303f1ff73965fb5.jpg", TLPID: 3},
		{Brand: "ไฮเตอร์ น้ำยาซักผ้าขาว ฟ้า 600 มล.", Stock: 65, Image: "https://media.allonline.7eleven.co.th/pdzoom/347859_01_Haiter.jpg", TLPID: 4},
		{Brand: "ไฮเตอร์น้ำยาซักผ้าขาว(สีชมพู)", Stock: 50, Image: "https://www.grocerlock.com/wp-content/uploads/2021/03/8851818614307-510x510.jpg", TLPID: 4},
		{Brand: "แอทเพลสถุงซักถนอมผ้า", Stock: 30, Image: "https://assets.tops.co.th/ATPLACE-AtplaceLaundryBag50X60cm-8853474097524-1?$JPEG$", TLPID: 5},
		{Brand: "ไม้แขวนเสื้อ", Stock: 40, Image: "https://image.makewebeasy.net/makeweb/m_1920x0/b92mDEoTf/passtic/1643265173376.jpg?v=202405291424", TLPID: 6},
		{Brand: "เอสเซ้นซ์น้ำยาซักผ้าสีชมพู", Stock: 25, Image: "https://assets.tops.co.th/ESSENCE-EssenceLiquidDetergentPink1900ml-8850002850064-1?$JPEG$", TLPID: 2},
		{Brand: "BREEZE สูตรเข้มข้น ชนิดถุง ขนาด 700 มล.", Stock: 60, Image: "https://www.thaiwatsadu.com/_next/image?url=https%3A%2F%2Fpim.thaiwatsadu.com%2FTWDPIM%2Fweb%2FThumbnail%2FImage%2F0807%2F60203050r.jpg&w=828&q=75", TLPID: 2},
	}
	for _, ex := range exchequers {
		db.FirstOrCreate(&ex, entity.Exchequer{Brand: ex.Brand})
	}

	// เพิ่มข้อมูล Withdraw (การเบิก)
	withdraw := &entity.Withdraw{
		WithdrawDate: time.Now(),
		EmployeeID:   1, // Assuming User ID 1 is an Employee
	}
	db.FirstOrCreate(withdraw, &entity.Withdraw{
		WithdrawDate: withdraw.WithdrawDate,
	})

	// เพิ่มข้อมูล WithdrawDetail (รายละเอียดการเบิก)
	withdrawDetails := []entity.WithdrawDetail{
		{Quantity: 10, ProductID: 1, WithdrawID: withdraw.ID}, // Product ID 1 -> Detergent
		{Quantity: 5, ProductID: 2, WithdrawID: withdraw.ID},  // Product ID 2 -> Fabric Softener
	}
	for _, detail := range withdrawDetails {
		db.FirstOrCreate(&detail, entity.WithdrawDetail{ProductID: detail.ProductID, WithdrawID: detail.WithdrawID})
	}

	// Report------------------------------------------------------------------------------------------------------------------
	report := &entity.Report{
		UserID:    1,
		MachineID: machines[0].ID,
	}
	db.FirstOrCreate(report, &entity.Report{
		UserID:    report.UserID,
		MachineID: report.MachineID,
	})

	// ReportDetail
	reportDetail := &entity.ReportDetail{
		Description: "Machine not functioning properly",
		Image:       "https://example.com/report_image.jpg",
		ReportDate:  time.Now(),
		ReportID:    report.ID,
	}
	db.FirstOrCreate(reportDetail, &entity.ReportDetail{
		ReportID: reportDetail.ReportID,
	})

	// ReportResult
	reportResult := &entity.ReportResult{
		Status:     "Pending",
		ReportID:   report.ID,
		AccepterID: 1, // Assuming Employee User ID = 1
	}
	db.FirstOrCreate(reportResult, &entity.ReportResult{
		ReportID:   reportResult.ReportID,
		AccepterID: reportResult.AccepterID,
	})

	postSetUp := entity.Post{

		Image:   "https://i.pinimg.com/originals/5a/c5/e0/5ac5e0a20c62f32fe6822de84a6ef0a0.gif",
		Caption: "น่ารักอ่ะไม่เท่าไหร่ แต่เรื่องซักอบผ้าไม่แพ้ใครแน่นอน🦦💕 🎉เปิดแล้ว อควาวอซ! ซักฟรี 5 วัน 17 ม.ค. 68 - 21 ม.ค. 68 นี้ Aqua wash มทส",
	}
	db.FirstOrCreate(&postSetUp, &entity.Post{
		Image:   postSetUp.Image,
		Caption: postSetUp.Caption,
	})
	// Create departments
	departments := []entity.Department{
		{Name: "ฝ่ายบุคคล", Explain: "จัดการเกี่ยวกับทรัพยากรบุคคลทั้งบริษัท"},
		{Name: "ฝ่ายซ่อมบำรุง", Explain: "ดูแลเครื่องซักผ้า และซ่อมบำรุง"},
		{Name: "ฝ่ายจัดส่ง", Explain: "บริการรับส่งสิ้นค้า ที่ลูกค้าฝากซัก"},
		{Name: "ฝ่ายการเงิน", Explain: "ดูแลเรื่องการเงิน ใบกำกับภาษี หรือภาษีที่ต้องจ่ายในแต่ละปี"},
		{Name: "่ฝ่ายบริการลูกค้า", Explain: "ดูแล และให้บริการลูกค้าอย่างจริงใจ"},
		{Name: "่ฝ่ายดูแลคลังสินค้าและบริการ", Explain: "ดูแล และให้บริการลูกค้าอย่างจริงใจ"},
		{Name: "่ฝ่ายโฆษณาและการตลาด", Explain: "ดูแล และให้บริการลูกค้าอย่างจริงใจ"},
	}
	db.Create(&departments)

	job := []entity.Job{
		{Name: "ผู้จัดการ", Explain: "", DepartmentID: 1},
		{Name: "ผู้ช่วยผู้จัดการ", Explain: "", DepartmentID: 1},
		{Name: "พนักงานต้อนรับลูกค้า", Explain: "", DepartmentID: 5},
		{Name: "พนักบริการลูกค้า", Explain: "", DepartmentID: 5},
		{Name: "เจ้าหน้าที่ขนส่ง", Explain: "", DepartmentID: 3},
		{Name: "ผู้จัดการฝ่ายขนส่ง", Explain: "", DepartmentID: 3},
		{Name: "พนักงานบัญชี", Explain: "", DepartmentID: 3},
		{Name: "ผู้ช่วยบัญชี", Explain: "", DepartmentID: 4},
		{Name: "เจ้าหน้าที่การตลาด", Explain: "", DepartmentID: 7},
		{Name: "เจ้าหน้าที่คลังสินค้า", Explain: "", DepartmentID: 6},
	}

	for _, pkg := range job {
		db.FirstOrCreate(&pkg, entity.Job{Name: pkg.Name})
	}

	// Create office hours
	officeHours := []entity.OfficeHours{
		{Checkin: time.Now(), Checkout: time.Now().Add(9 * time.Hour), EmployeeID: 1},
		{Checkin: time.Now(), Checkout: time.Now().Add(9 * time.Hour), EmployeeID: 1},
		{Checkin: time.Now(), Checkout: time.Now().Add(9 * time.Hour), EmployeeID: 1},
		{Checkin: time.Now(), Checkout: time.Now().Add(8 * time.Hour), EmployeeID: 2},
		{Checkin: time.Now(), Checkout: time.Now().Add(8 * time.Hour), EmployeeID: 2},
		{Checkin: time.Now(), Checkout: time.Now().Add(8 * time.Hour), EmployeeID: 2},
		{Checkin: time.Now(), Checkout: time.Now().Add(8 * time.Hour), EmployeeID: 3},
		{Checkin: time.Now(), Checkout: time.Now().Add(8 * time.Hour), EmployeeID: 3},
		{Checkin: time.Now(), Checkout: time.Now().Add(8 * time.Hour), EmployeeID: 3},
		{Checkin: time.Now(), Checkout: time.Now().Add(8 * time.Hour), EmployeeID: 4},
		{Checkin: time.Now(), Checkout: time.Now().Add(8 * time.Hour), EmployeeID: 4},
		{Checkin: time.Now(), Checkout: time.Now().Add(8 * time.Hour), EmployeeID: 4},
	}
	db.Create(&officeHours)

	//================================== Create employees ==================================
	employees := []entity.Employee{
		{
			UserID: 5,
			JobID:  2,
			Saraly: 50000,
		},
		{
			UserID: 6,
			JobID:  3,
			Saraly: 45000,
		},
		{
			UserID: 7,
			JobID:  1,
			Saraly: 45000,
		},
		{
			UserID: 8,
			JobID:  5,
			Saraly: 45000,
		},
	}
	db.Create(&employees)

}
