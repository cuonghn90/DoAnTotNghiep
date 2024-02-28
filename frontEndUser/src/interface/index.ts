
export interface INumberItemPerPage {
    id: string,
    label: string,
    value: number;
}
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
    userId: string;
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
    token?: string;
}

export interface IBaseUser {
    userId: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    email: string;
    phone?: string;
    avatar?: string;
    address?: string
}
export interface IProductOrder {
    productOrderId: string,
    count: number,
    productId: string,
    orderId: string,
    product: IProduct,
    note: string;
}
export interface IOrder {
    id: number,
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
    productsOrder: IProductOrder[],
    addressShip: string,
    phoneShip: string,
    isPay: string,
    orderIdPaypal?: string,
    user: IBaseUser,
    couponUsed: ICouponsOrderUsed
}

export interface IProductCart {
    productCartId: string,
    count: number,
    cartId: string,
    productId: string,
    note: string;
    product: IProduct,
}
export interface ICart {
    id: number,
    cartId: string,
    cartTotal: number,
    userId: string,
    createdAt: Date,
    updatedAt: Date,
    productsCart: IProductCart[];
}

export interface ICategory {
    categoryId: string,
    title: string,
}

export interface IRating {
    ratingId: string,
    userId: string,
    productId: string,
    star: number;
}

export interface IComment {
    commentId: string,
    userId: string,
    productId: string,
    text: string,
    user: IBaseUser;
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
    categoryId: string,
    sold: number,
    tags: string,
    totalRating: number,
    ratings?: IRating[],
    comments?: IComment[];
}

export interface ICategory {
    categoryId: string,
    name: string,
    products?: IProduct[];
}
export interface ICoupon {
    id: number,
    couponId: string,
    couponCode: string,
    discount: number,
    discountFor: string,
    statusCoupon: string,
    startDateDiscount: Date,
    endDateDiscount: Date,
    takeBy: string,
    isUsed: boolean,
    createdAt: any,
    updatedAt: any,
}

export interface ICouponUsed {
    id: number,
    couponId: string,
    userId: string;
}

export interface ICouponsOrderUsed{
    couponCode: string,
    discount: number,
    discountFor: string,
}

export interface IFriend{
    id?: number,
    userId?: string,
    userFriendId?: string,
    createAt?: any,
    updateAt?: any,
    isFriend?: boolean,
    sendRequest?: boolean,
    numberGiveGift?: number,
    userFriendInfo?: IBaseUser
}