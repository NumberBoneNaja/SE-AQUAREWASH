export interface BooksInterface {
    ID: number; // รหัสของการจอง
    Price: number; // ราคาค่าบริการ
    Status: String ;
    books_start: Date; // วันที่และเวลาที่เริ่มการจอง
    books_end: Date; // วันที่และเวลาที่สิ้นสุดการจอง
    user_id: number; // รหัสผู้จอง (อ้างอิงกับผู้ใช้)
  }
    