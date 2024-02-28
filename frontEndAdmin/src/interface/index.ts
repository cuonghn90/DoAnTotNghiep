
export interface IUserRegister {
    email: string;
    password: string;
    phone: string;
}
export interface IUserLogin {
    email: string;
    password: string;
}

export interface IUserProfile {
    userId: string
    username?: string;
    firstname?: string;
    lastname?: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: string;
    refreshToken?: string;
    address?: string;
    dateOfBirth?: string;
    token?: string
}
export interface IBaseUser {
    userId: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    email: string;
    phone?: string;
    avatar?: string;
}
export interface IProduct {
    productId: string,
    name: string,
    slug: string,
    description: string,
    price: number,
    image: string,
    brand: string,
    quantity: number,
    sold: number,
    tags: string,
    totalRating: number,
    categoryId: string
}
export interface IProductOrder {
    productOrderId: string,
    count: number,
    productId: string,
    orderId: string;
    product: IProduct,
    note: string,
}
export interface IOrder {
    id:number,
    orderId: string,
    paymentMethod: string,
    paymentAmount: number,
    paymentAmountAfterDiscount: number,
    couponCode: string,
    paymentStatus: string,
    paymentCreate: Date,
    paymentCurrency: string,
    orderStatus: string,
    userId: string,
    createdAt: Date,
    updateAt: Date,
    productsOrder: IProductOrder[];
    addressShip: string,
    phoneShip: string,
    isPay: string,
    orderIdPaypal?: string,
    user: IBaseUser;
}

export interface ICategory{
    categoryId: string,
    name: string,
    products?: IProduct[]
}

export interface ICoupon{
    id: number,
    couponId: string,
    couponCode: string,
    discount: number,
    discountFor: string,
    statusCoupon: string,
    startDateDiscount: Date,
    endDateDiscount:  Date,
    takeBy: string
}

export interface ICouponUsed{
    id: number,
    couponId: string,
    userId: string
}

export interface INumberItemPerPage {
    id: string,
    label: string,
    value: number;
}

