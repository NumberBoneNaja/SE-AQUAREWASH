package main

import (
	"log"
	"net/http"

	// "net/http"

	"example.com/ProjectSeG08/config"

	"example.com/ProjectSeG08/controller/MembershipPayment"

	payment "example.com/ProjectSeG08/controller/Payment"
	reward "example.com/ProjectSeG08/controller/Reward"
	"example.com/ProjectSeG08/controller/books"
	Employee "example.com/ProjectSeG08/controller/employee"
	controller "example.com/ProjectSeG08/controller/order"

	department "example.com/ProjectSeG08/controller/employee_department"
	job "example.com/ProjectSeG08/controller/employee_job"
	office "example.com/ProjectSeG08/controller/employee_officehours"

	// "google.golang.org/protobuf/internal/order"
	"example.com/ProjectSeG08/controller/machine"

	packages "example.com/ProjectSeG08/controller/packages"

	ClothType "example.com/ProjectSeG08/controller/ClothType"

	AddOn "example.com/ProjectSeG08/controller/AddOn"

	"example.com/ProjectSeG08/controller/user"
	"example.com/ProjectSeG08/middlewares"
	"github.com/gin-gonic/gin"

	"github.com/robfig/cron/v3"

	notification "example.com/ProjectSeG08/controller/Notification"

	Post "example.com/ProjectSeG08/controller/News"
	"example.com/ProjectSeG08/controller/report"
	"example.com/ProjectSeG08/controller/withdraw"
	//  "github.com/gin-contrib/cors"
)

// const PORT = "8000"

func main() {
	// open connection database
	config.ConnectionDB()

	// Generate databases
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	go startCronJobs()

	// r.Use(cors.New(cors.Config{
	// 		AllowOrigins:     []string{"https://aqua-wash.online", "https://www.aqua-wash.online", "http://localhost:5173"},
	// 		AllowMethods: []string{"POST", "GET", "OPTIONS", "PATCH"},
	// 		AllowHeaders: []string{"Content-Type", "Authorization", "X-Authorization"},
    // 		ExposeHeaders:    []string{"Content-Length", "X-Authorization"},
    // 		AllowCredentials: true,
	// 	}))

	r.POST("/booking", books.CreateBookingDetails)
	r.POST("/books", books.CreateBooks)
	r.POST("/machine", machine.CreateMachine)
	r.GET("/machine", machine.GetAllMachine)
	r.GET("/books/last", books.GetLastBooks)
	r.POST("/test-machine", machine.CreateMachineTest)
	r.GET("/report/last", report.GetLastReport)
	r.GET("/GetActiveReward", reward.GetActiveReward)          // ไม่มี / ท้ายสุด
	r.POST("/CreateHistoryReward", reward.CreateHistoryReward) // ไม่มี / ท้ายสุด
	// r.GET("/GetClaimedRewards/:id", reward.GetClaimedRewards)
	r.GET("/CheckRewardClaimed/:userId/:rewardId", reward.CheckRewardClaimed)
	r.GET("/GetUserBookings/:user_id", books.GetUserBookings)
	r.DELETE("/UsedRewardByBarcode/:barcode", reward.UsedRewardByBarcode)
	r.GET("/GetMachineBookingInfo", machine.GetMachineBookingInfo)
	r.PATCH("/UpdateBookStatus/:id", books.UpdateBookStatus)

	//======================================================== AddOn  =============================================================
	r.POST("/addon", AddOn.CreateAddOn)
	r.GET("/addons/:package_id", AddOn.GetAllAddOnsByPackageID)
	r.PUT("/addon/:id", AddOn.UpdateAddOn)
	r.DELETE("/addon/:id", AddOn.DeleteAddOn)

	//======================================================== job  =============================================================
	r.GET("/job2", job.GetAllJob)
	r.GET("/job2/:id", job.GetJobById)
	r.POST("/job2/create", job.CreateJob)
	r.PUT("/job2/update/:id", job.UpdateJob)
	r.DELETE("/job2/delete/:id", job.SoftDeleteJob)
	//======================================================== Cloth  =============================================================
	r.POST("/cloth-type", ClothType.CreateClothType)
	r.GET("/cloth-types/:package_id", ClothType.GetClothTypesByPackageID)
	r.PUT("/cloth-type/:id", ClothType.UpdateClothType)
	r.DELETE("/cloth-type/:id", ClothType.DeleteClothType)

	//======================================================== Package  =============================================================
	r.PUT("/package/:id", packages.UpdatePackage)
	r.POST("/package", packages.CreatePackage)
	r.DELETE("/package/:id", packages.DeletePackage)
	r.POST("/ImagePack", packages.UploadImagePackage)
	r.POST("/ImageAddon", packages.UploadImageAddOn)

	//======================================================== Machine  =============================================================
	r.PUT("/machines/:id", machine.UpdateMachine) //เพิ่ม
	r.POST("/machines", machine.CreateMachine)
	r.DELETE("/machines/:id", machine.DeleteMachine)

	r.PATCH("/UpdateMachineStatus/:id", machine.UpdateMachineStatus)

	r.GET("/m_histories/machines/:id", machine.GetHistoryByMachineID)
	r.POST("/m_histories", machine.CreateHistory)

	//======================================================== Sign in Login =============================================================

	r.POST("/signup", user.SignUp)                             //สมัคร
	r.POST("/signin", user.SignIn)                             //Sign in == login
	r.PUT("/UpdateUserStatus/user/:id", user.UpdateUserStatus) //UpdateUserStatus
	r.PUT("/UpdateUserStatus/Employee/:id", user.UpdateUserStatusEmployee)

	r.PUT("/ResetPasswordUser", user.ResetPasswordUser) //Sign in == login อาจจะใช้

	//======================================================== User =============================================================
	r.GET("/user", user.ListUsers)
	r.POST("/send-email", user.SendEmailHandler)
	r.Static("/images", "./images")
	r.Static("/ProfOrder", "./images/ProfOrder")
	r.Static("/ProfileUser", "./images/ProfileUser")
	r.Static("/BgUser", "./images/BgUser")
	r.Static("/addonImage", "./images/addonImage")
	r.Static("/packageimage", "./images/packageimage")

	// ====================================================== department ======================================================

	r.GET("/department", department.GetAllDepartments)
	r.GET("/department/:id", department.GetDepartmentById)
	r.POST("/department", department.CreateDepartment)
	r.PUT("/department/Update/:id", department.UpdateDepartment)
	r.PUT("/department/Delete/:id", department.SoftDeleteDepartment)
	r.PUT("/department/Restore/:id", department.RestoreDepartment)

	// ====================================================== office ======================================================

	r.GET("/office", office.GetAllOfficeHours)
	r.GET("/office/:id", office.GetOfficeHour)
	r.GET("/office/last", office.GetLastOfficeHour)
	r.GET("/office/employee/:id", office.GetOfficeHourByEmployeeID)
	r.GET("/office/checkin", office.GetOfficeHourByCheckin)
	r.POST("/office", office.CreateOfficeHour)
	r.PUT("/office/update/:id", office.UpdateOfficeHour)
	r.PUT("/office/delete/:id", office.SoftDeleteOfficeHour)
	r.PUT("/office/restore/:id", office.RestoreOfficeHour)

	router := r.Group("")
	{
		router.Use(middlewares.Authorizes())
		//User

		router.GET("/user/:id", user.GetUser)
		router.GET("/users", user.ListUsers)
		router.PUT("/user/:id", user.UpdateUserByid)
		router.GET("/preloaduser/:id", user.GetPUser)
		router.PATCH("/PatchProfile/:id", user.UpdateImageUser)
		router.PATCH("/PatchBg/:id", user.UpdateBgUser)
		r.PATCH("/UpdatePointByid/:id", user.UpdatePointByid)

		//======================================================== Admin =============================================================
		router.GET("/job/:status", user.GetListUserByStatus)

		//======================================================== Package Membership ==================================================
		PM := r.Group("/packageM")
		{
			PM.GET("", MembershipPayment.ListPackageMemberships)
			PM.GET("/:id", MembershipPayment.GetPackageMembershipById) // ดึงข้อมูลหนังสือตาม ID

			PM.POST("/", books.CreateBooks)   // อัปเดตข้อมูลหนังสือตาม ID
			PM.PUT("/:id", books.UpdateBooks) // อัปเดตข้อมูลหนังสือตาม ID
			PM.GET("/", books.GetAllBooks)    // ดึงข้อมูลหนังสือทั้งหมด

			PM.DELETE("/:id", books.DeleteBooks) // ลบหนังสือตาม ID
		}

		//======================================================== Membership Payments ==================================================
		PaymentM := r.Group("/paymentMembership")
		{
			PaymentM.GET("/userID/:id", MembershipPayment.GetMembershipPaymentByUserID)
			PaymentM.GET("/", MembershipPayment.GetMembershipPayments)
			PaymentM.GET("/:id", MembershipPayment.GetMembershipPaymentByID) // ดึงข้อมูลหนังสือตาม ID
			PaymentM.GET("/last", MembershipPayment.GetLast)

			PaymentM.POST("", MembershipPayment.CreateMembershipPayment)                 // อัปเดตข้อมูลหนังสือตาม ID
			PaymentM.PUT("/:id", MembershipPayment.UpdateMembershipPayment)              // อัปเดตข้อมูลหนังสือตาม ID
			PaymentM.PUT("/:id/status", MembershipPayment.UpdateMembershipPaymentStatus) // อัปเดตข้อมูลหนังสือตาม ID
			PaymentM.DELETE("/:id", MembershipPayment.SoftDeleteMembershipPayment)       // ลบหนังสือตาม ID
			PaymentM.PUT("/:id/restore", MembershipPayment.RestoreMembershipPayment)     // อัปเดตข้อมูลหนังสือตาม ID
			PaymentM.GET("payment/:id", MembershipPayment.GetPaymentMemberByID)
			PaymentM.PATCH("/UpdateImage/:id", MembershipPayment.UpdateImageByPaymentMemID)
			PaymentM.PATCH("/UpdateName/:id", MembershipPayment.UpdateNameImageMemberShipping)
		}

		//======================================================== history membership payment ==================================================
		PaymentH := r.Group("/HistoryMembership")
		{
			PaymentH.GET("/:id", MembershipPayment.GetMembershipPaymentByIDHistory)
			PaymentH.GET("/user/:id", MembershipPayment.GetMembershipPaymentByUserIDHistory)
			PaymentH.POST("", MembershipPayment.CreateMembershipPaymentHistory)
			PaymentH.GET("", MembershipPayment.GetMembershipPaymentsHistory)
		}

		//======================================================== Books =============================================================
		booksRouter := r.Group("/books")
		{
			booksRouter.PUT("/:id", books.UpdateBooks)    // อัปเดตข้อมูลหนังสือตาม ID
			booksRouter.GET("/", books.GetAllBooks)       // ดึงข้อมูลหนังสือทั้งหมด
			booksRouter.GET("/:id", books.GetBooks)       // ดึงข้อมูลหนังสือตาม ID
			booksRouter.DELETE("/:id", books.DeleteBooks) // ลบหนังสือตาม ID
		}

		bookingDetailsRouter := r.Group("/booking")
		{
			bookingDetailsRouter.PUT("/:id", books.UpdateBookingDetails)    // อัปเดตข้อมูลหนังสือตาม ID
			bookingDetailsRouter.GET("/", books.GetAllBookingDetails)       // ดึงข้อมูลหนังสือทั้งหมดS
			bookingDetailsRouter.GET("/:id", books.GetBookingDetails)       // ดึงข้อมูลหนังสือตาม ID
			bookingDetailsRouter.DELETE("/:id", books.DeleteBookingDetails) // ลบหนังสือตาม ID
			bookingDetailsRouter.GET("/bookingdetail/:id", books.GetbookinByBID)
		}

		//======================================================== Employee ==================================================
		Employees := r.Group("/employee")
		{
			Employees.GET("", Employee.GetAllEmployees)
			Employees.GET("/:id", Employee.GetEmployee)
			Employees.POST("", Employee.CreateEmployee)
			Employees.PUT("/update/:id", Employee.UpdateEmplyeeByid)
			Employees.DELETE("/:id", Employee.DeleteEmployee)

		}
		//======================================================== Order + Payment =============================================================
		OrderRouter := r.Group("/Order")
		{
			// Order
			OrderRouter.POST("/CreateOrder", controller.CreateOrder)
			OrderRouter.POST("/CreateOrderDetail", controller.CreateOrderDetail)
			OrderRouter.POST("/CreateAddOnDetail", controller.CreateAddOnDetail)
			// OrderRouter.PATCH("/UpdateOrder/:id", controller.UpdateStatusOrder)
			OrderRouter.DELETE("/DeleteOrderByID/:id", controller.DeleteOrderByID)
			OrderRouter.DELETE("/DeleteOrderDetailByOrderID/:id", controller.DeleteOrderDetailByOrderID)
			OrderRouter.DELETE("/DeleteOrderAddOnByOrderID/:id", controller.DeleteAddOnByOrderID)
			OrderRouter.GET("/GetOrderByUserID/:id", controller.GetOrderbyUserID)
			OrderRouter.GET("/GetOrderByID/:id", controller.GetOrderbyID)

			r.GET("/GetRewardsBooking/:id", reward.GetRewardsBooking)
			//OrderRouter.GET("/GetRewardsWithHistoryByUserID/:id", reward.GetHistoryRewardByUserID)

			OrderRouter.GET("/GetEMOrderByID/:id", controller.GetEmOrderbyID)
			OrderRouter.GET("/GetALLOrder", controller.GetOrderAllOrder)

			// Package
			OrderRouter.GET("/GetAllPackage", controller.GetAllPackage)
			OrderRouter.GET("/GetPackageByID/:id", controller.GetPackageByID)
			OrderRouter.GET("/GetClothByPackageID/:id", controller.GetClothByPackageID)
			OrderRouter.GET("/GetAddOnByPackageID/:id", controller.GetAddOnByPackageID)

			// Image
			OrderRouter.POST("/UploadImage/:id", controller.UploadImage)
			OrderRouter.GET("/GetImagesByOrderID/:id", controller.GetImagesByOrderID)
			OrderRouter.DELETE("/DeleteImage/:id", controller.DeleteImageByID)
			OrderRouter.POST("/mutipleupload/:id", controller.UploadMultipleImages)
			OrderRouter.DELETE("/DeleteImageByOrderID/:id", controller.DeleteImageByOrderID) //ลบหลายรูป

			//reward
			OrderRouter.GET("/GetRewardByRewardID/:id", reward.GetHistoryRewardByUserID)
			OrderRouter.GET("/GetHistoryRewardByUserID/:id", reward.GetHistoryRewardByUserID)
			OrderRouter.PATCH("/ChangeStateReward/:id", reward.UpdateHistoryRewardByID) //test สถานะ
			OrderRouter.DELETE("/DeleteHistoryRewardByID/:id", reward.DeleteHistoryRewardByID)
			OrderRouter.DELETE("/DeleteHistoryRewardByState", reward.DeleteHistoryRewardByState)
			OrderRouter.GET("/GetRewardsWithHistoryByUserID/:id", reward.GetRewardsWithHistoryByUserID)

			OrderRouter.POST("/CreateReward", reward.CreateReward)
			OrderRouter.GET("/GetAllRewards", reward.GetAllRewards)
			OrderRouter.DELETE("/DeleteRewards/:id", reward.DeleteReward)
			OrderRouter.PUT("/UpdateReward/:id", reward.UpdateReward)

			//payment
			OrderRouter.POST("/Createpayment", payment.CreatePayment)
			OrderRouter.POST("/CreatepaymentfromBooking", payment.CreatePaymentFromBooking)
			OrderRouter.PATCH("/c/:id", payment.UpdateStatusPaymentByID) //update status payment
			OrderRouter.GET("/GetPaymentByOrderID/:id", payment.GetPaymentByID)
			OrderRouter.GET("/GetClothDetailByOrderID/:id", payment.GetClothDetailByOrderID)
			OrderRouter.GET("/GetAddOnDetailByOrderID/:id", payment.GetAddOnDetailByOrderID)
			OrderRouter.POST("/Genqr", payment.ProxyQR)
			OrderRouter.GET("/proxy/CheckStatusPayment/:transactionID", payment.ProxyCheckStatusPayment)
			OrderRouter.DELETE("/CancelPaymetByID/:id", payment.CancelPaymetByID)
			OrderRouter.POST("/Qrdecode", payment.DecodeQR)
			OrderRouter.PATCH("/OrderSuccess/:id", payment.PatchOrderByID) // update order status
			OrderRouter.GET("/FindPayment/:id", payment.FindID)

			// notification
			OrderRouter.POST("/CreateNotification", notification.CreateNotification)
			OrderRouter.GET("/GetNotificationByUserID/:id", notification.GetNotificationbyUserID)
			OrderRouter.PATCH("/UpdateStatusNotification/:id", notification.UpdateStatusNotification)
			OrderRouter.GET("/GetNotificationbyID/:id", notification.GetNotificationbyID)
			// OrderRouter.DELETE("/DeleteNotificationByUserID/:id", notification.DeleteNotificationByUserID)

		}
		reportRouter := r.Group("/report")
		{
			reportRouter.GET("", machine.GetAllMachine)
			reportRouter.GET("/", report.GetAllReports)
			reportRouter.POST("/", report.CreateReport)
			reportRouter.POST("/detail", report.CreateReportDetail)
			reportRouter.POST("/resultC/", report.CreateReportResult)
			reportRouter.GET("/result/:report_id", report.GetReportResultByReportID)
			reportRouter.GET("/detail/:report_id", report.GetReportDetailByReportID)
			reportRouter.GET("/:user_id", report.GetReportByUserID)
			reportRouter.PUT("/:report_id", report.UpdateReportResultByReportID)
		}

		withdrawRouter := r.Group("/withdraw")
		{
			withdrawRouter.GET("", withdraw.GetAllExchequers)
			withdrawRouter.GET("/", withdraw.GetAllTypeLaundryProducts)

			withdrawRouter.POST("/exchequer", withdraw.CreateExchequer)
			withdrawRouter.POST("/wd", withdraw.CreateWithdraw)
			withdrawRouter.POST("/detail", withdraw.CreateWithdrawDetail)

			withdrawRouter.PUT("/:id", withdraw.UpdateExchequer)
			withdrawRouter.DELETE("/:id", withdraw.DeleteExchequer)
			withdrawRouter.GET("/:id", withdraw.GetExchequerByID)
		}

		newsRouter := r.Group("/news")
		{
			newsRouter.POST("/posts", Post.CreatePost)
			newsRouter.GET("/posts", Post.GetPosts)
			newsRouter.GET("/posts/:id", Post.GetPostByID)
			newsRouter.PUT("/posts/:id", Post.UpdatePost)
			newsRouter.DELETE("/posts/:id", Post.DeletePost)
		}

		//======================================================== เริ่มรัน เซิร์ฟ =============================================================

		r.GET("/", func(c *gin.Context) {
			c.String(http.StatusOK, "API RUNNING... PORT: ")
		})
		r.Run()
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func startCronJobs() {
	c := cron.New()

	c.AddFunc("@every 15s", func() {
		db := config.DB()
		reward.UpdateRewardStatusByCron(db)
		machine.UpdateMachineStatusByCron(db)
	})

	c.Start()
	log.Println("Cron Job started successfully")
}
