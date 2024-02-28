import { doc, getDoc, setDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { v4 as uuid } from "uuid";
export const getNameOfEmail = (email: string) => {
    const indexBeforeName = email.indexOf("@");
    const name = email.substring(0, indexBeforeName);
    return name;
};

export function padTo2Digits (num: number) {
    return num.toString().padStart(2, '0');
}

export function formatDateFullYear (oldDate: Date) {
    const date = new Date(oldDate);
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-')
    );
}

export function formatOnlyHour (oldDate: Date) {
    const date = new Date(oldDate);
    return (
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes())
        ].join(':') + (parseInt(padTo2Digits(date.getHours())) >= 12 ? ' Pm' : ' Am')
    );
}

export function formatDate (oldDate: Date) {
    const  date = new Date(oldDate)
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}

export const changeStatusOrderToVietNameses = (status: string) => {
    let newStatus = '';
    switch (status) {
        case 'Unconfimred':
            newStatus = 'Chưa được xác nhận';
            break;
        case 'Confirmed':
            newStatus = 'Đã xác nhận';
            break;
        case 'Processing':
            newStatus = 'Đang xử lí';
            break;
        case 'Dispatched':
            newStatus = 'Đã gửi đi';
            break;
        case 'Cancelled':
            newStatus = 'Đã hủy';
            break;
        case 'Delivered':
            newStatus = 'Đã giao hàng';
            break;
        default:
            newStatus = 'Lỗi';
    }
    return newStatus;
};

export const changePaymentStatusToVietNameses = (status: string) => {
    let newStatus = '';
    switch (status) {
        case 'Unpaid':
            newStatus = 'Chưa thanh toán';
            break;
        case 'Paid':
            newStatus = 'Đã thanh toán';
            break;
        default:
            break;
    }
    return newStatus;
}

export const changeCouponDiscountForToVietNameses = (status: string) => {
    let newStatus = '';
    switch (status) {
        case 'order':
            newStatus = 'Giỏ hàng';
            break;
        case 'product':
            newStatus = 'Sản phẩm';
            break;
        default:
            break;
    }
    return newStatus;
}


export const sendNotification = async (contentMessage: string, idSender: string,avatar: string, idReceiver?: string) => {
    if (idReceiver) {
        const checkUserExists = await getDoc(doc(db, "notifications", idReceiver));
        if (!checkUserExists.exists()) {
            await setDoc(doc(db, "notifications", idReceiver), {});
        }
        await updateDoc(doc(db, "notifications", idReceiver), {
            notifications: arrayUnion({
                id: uuid(),
                contentMessage: contentMessage,
                senderId: idSender,
                date: Timestamp.now(),
                avatar: avatar
            })
        });
    };
}