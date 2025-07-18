export interface OrderInterface{
    ID?: number
    CreatedAt?: string
    Price?: number
    Discount?: number
    OrderStatusID?: number
    QuotaUsed?: boolean
    UserID?: number
    PackageID?: number
    HistoryRewardID?: number
    Note?: string
    ExpecterdPoint?: number
}