export interface PaymentInterface {
    ID?: number
    PaymentStart?: Date
    PaymentEnd?: Date
    Price?: number
    PaymentStatusID?:number
    BookID?: number
    OrderID?: number
    UserID?: number
}